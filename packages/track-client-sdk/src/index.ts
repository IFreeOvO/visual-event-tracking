import type { Datasource, TrackingConfig } from './type.d.ts'
import { debounce, merge } from 'lodash-es'
import {
    EventTypeEnum,
    ModeEnum,
    RuleRequiredEnum,
    SendTypeEnum,
    SiblingEffectiveEnum,
    ValidateStatusEnum,
} from './enum'
import { IdleTask } from './idle-task'
import { Request } from './request'
import { Router } from './router'
import {
    getEleByXpath,
    getSiblingDatasource,
    getSiblingXpath,
    getValidationMarker,
    getXpath,
    hasSameClassList,
    isSiblingByXpath,
    objectToSearchParams,
} from './utils'
const TRACK_ATTR = 'data-tracking-config'

interface TrackerOptions {
    serverURL: string
    projectId: number
    sendType?: SendTypeEnum
    intersectionObserverOptions?: { threshold?: number }
    trackingClientURL?: string
    mode?: ModeEnum
    accuracy?: number
}

export default class Tracker {
    intersectionObserverOptions: { threshold?: number } = {}

    intersectionObserver?: IntersectionObserver

    mutationObserver?: MutationObserver

    eleObserverMap = new Map() // 记录哪些元素绑定了曝光事件

    siblingEleMap = new Map() // 记录哪些兄弟元素绑定了曝光事件

    serverURL?: string

    request: Request

    router: Router

    projectId?: string

    trackingClientURL?: string

    sendType = SendTypeEnum.Beacon // 请求方式。sendType用sendBeacon，gif是用gif图片

    taskManager: IdleTask

    mode = ModeEnum.Report // 默认上报。mode为validate时，仅验证。mode为report时，仅上报日志。mode为reportAndValidate时，既上报又验证

    exposeConfigList: TrackingConfig[] = [] // 曝光埋点配置

    clickConfigList: TrackingConfig[] = [] // 点击埋点配置

    accuracy = 85 / 100 // 验证标记的准确度。大于这个值认为埋点xpath是正确的

    private requestAbortController?: AbortController

    constructor(options: TrackerOptions) {
        merge(this, options)

        this.request = new Request({
            baseURL: this.serverURL,
        })
        this.router = new Router()
        this.taskManager = new IdleTask()
    }

    registerMutationObserver() {
        const options = { attributes: false, childList: true, subtree: true }
        this.mutationObserver = new MutationObserver(
            debounce(this.observeDomChange.bind(this), 1000 / 60),
        )
        this.mutationObserver.observe(document.body, options)
        // 立即执行一次变化检测
        this.observeDomChange()
    }

    // 监听dom变化，注册曝光事件
    observeDomChange() {
        this.exposeConfigList.forEach((config) => {
            this.taskManager.addTask(() => {
                this.handleExpose(
                    config,
                    this.eleObserverMap,
                    this.siblingEleMap,
                    this.intersectionObserver,
                )
            })
        })
    }

    removeExpose(
        targetEle: Element,
        targetXpath: string,
        isSiblingEffective: SiblingEffectiveEnum,
        eleObserverMap: Map<string, Element>,
        siblingEleMap: Map<Element, Set<Element>>,
        intersectionObserver?: IntersectionObserver,
    ) {
        intersectionObserver?.unobserve(targetEle)
        eleObserverMap.delete(targetXpath)

        // 取消兄弟元素的监听
        if (isSiblingEffective === SiblingEffectiveEnum.YES) {
            const siblingEleSet = siblingEleMap.get(targetEle)
            if (siblingEleSet) {
                siblingEleSet.forEach((siblingEle) => {
                    intersectionObserver?.unobserve(siblingEle)
                })
                siblingEleMap.delete(targetEle)
            }
        }
    }

    handleExpose(
        config: TrackingConfig,
        eleObserverMap: Map<string, Element>,
        siblingEleMap: Map<Element, Set<Element>>,
        intersectionObserver?: IntersectionObserver,
    ) {
        const { xpath, validationMarker, isSiblingEffective } = config
        // 判断埋点xpath元素是否已经挂载
        const targetEle = getEleByXpath(xpath)
        const cacheEle = eleObserverMap.get(xpath)

        if (!targetEle) {
            // 元素被移除时，取消监听
            if (cacheEle) {
                this.removeExpose(
                    cacheEle,
                    xpath,
                    isSiblingEffective,
                    eleObserverMap,
                    siblingEleMap,
                    intersectionObserver,
                )
            }
            return
        }

        // xpath对应的新旧元素不一致，取消旧元素监听
        if (cacheEle) {
            if (targetEle === cacheEle) {
                return
            } else {
                this.removeExpose(
                    cacheEle,
                    xpath,
                    isSiblingEffective,
                    eleObserverMap,
                    siblingEleMap,
                    intersectionObserver,
                )
            }
        }

        // 判断xpath是否正确命中(xpath是不稳定的，需要用targeValidationMarker标记提供准确度)
        const targeValidationMarker = getValidationMarker(targetEle)
        if (this.checkMarker(targeValidationMarker, validationMarker)) {
            targetEle.setAttribute(
                TRACK_ATTR,
                JSON.stringify({
                    id: config.id,
                    xpath: config.xpath,
                    datasource: config.datasource,
                    eventName: config.eventName,
                }),
            )
            intersectionObserver?.observe(targetEle)
            eleObserverMap.set(xpath, targetEle)

            // 如果配置了'同级元素生效'，则需要监听兄弟元素。比如当前xpath为div[1]/div[2]，则兄弟元素为div[1]/div[i]
            if (isSiblingEffective === SiblingEffectiveEnum.YES) {
                this.taskManager.addTask(() => {
                    let i = 0
                    const newXpath = getSiblingXpath(xpath, i)
                    const siblingEle = getEleByXpath(newXpath)
                    siblingEleMap.set(targetEle, new Set([]))

                    const processSibling = (
                        newXpath: string,
                        siblingEleMap: Map<Element, Set<Element>>,
                        siblingEle?: Element | null,
                    ) => {
                        if (!siblingEle) {
                            return
                        }
                        // 跳过元素自己，或者元素类名不同也要跳过(类名不同，视为组件变了)。继续下一个元素
                        if (siblingEle === targetEle || !hasSameClassList(siblingEle, targetEle)) {
                            i++
                            newXpath = getSiblingXpath(xpath, i)
                            siblingEle = getEleByXpath(newXpath)

                            this.taskManager.addTask(() =>
                                processSibling(newXpath, siblingEleMap, siblingEle),
                            )
                            return
                        }
                        const siblingDatasource = getSiblingDatasource(
                            config.datasource,
                            config.xpath,
                            newXpath,
                        )
                        siblingEle.setAttribute(
                            TRACK_ATTR,
                            JSON.stringify({
                                id: config.id,
                                xpath: newXpath,
                                datasource: siblingDatasource,
                                eventName: config.eventName,
                            }),
                        )
                        intersectionObserver?.observe(siblingEle)
                        const siblingSet = siblingEleMap.get(targetEle)!
                        siblingSet.add(siblingEle)

                        i++
                        newXpath = getSiblingXpath(xpath, i)
                        siblingEle = getEleByXpath(newXpath)

                        this.taskManager.addTask(() =>
                            processSibling(newXpath, siblingEleMap, siblingEle),
                        )
                    }
                    processSibling(newXpath, siblingEleMap, siblingEle)
                })
            }
        }
    }

    checkMarker(currentMarker: string, targetMarker: string) {
        const commonLength = getCommonPrefixLength(currentMarker, targetMarker)
        const minLengthMarker = Math.min(currentMarker.length, targetMarker.length)
        return commonLength / minLengthMarker > this.accuracy
    }

    registerClickEvent() {
        document.body.addEventListener(
            'click',
            (e) => {
                let dom = e.target as Element
                let xpath = getXpath(dom) // 记录埋点元素或埋点兄弟元素的xpath
                let isSibling = false // 是否因为是兄弟节点，命中xpath
                const currentXpath = xpath // 当前触发事件的dom的xpath

                const targetConfig = this.clickConfigList.find((config) => {
                    const targetXpath = config.xpath
                    if (targetXpath === currentXpath) {
                        return true
                    }

                    // 点击的xpath和配置的xpath是否是包含关系，如果是，说明点击的是埋点元素的子节点，需要触发上报
                    if (currentXpath.startsWith(targetXpath)) {
                        dom = getEleByXpath(targetXpath) as Element
                        return true
                    }
                    // 根据xpath，判断是否是满足埋点xpath的兄弟节点。如果是，且配置了'同级元素生效'。也要触发埋点
                    if (config.isSiblingEffective === SiblingEffectiveEnum.YES) {
                        // 两个xpath是否是兄弟关系
                        if (isSiblingByXpath(targetXpath, xpath)) {
                            isSibling = true
                            return true
                        }

                        // targetXpath先约定是埋点组件最外层元素的xpath。如果配置的xpath不是组件最外层元素，不保证后续逻辑的正确性
                        const xpathOfTargetParent = targetXpath.substring(
                            0,
                            targetXpath.lastIndexOf('/'),
                        )
                        // 当前xpath，是否是配置的xpath元素的父元素的子节点
                        if (currentXpath.startsWith(xpathOfTargetParent)) {
                            // 获取当前xpath所在组件的最外层tag(默认是去掉父节点xpath后的第一个节点)
                            const componentTag = currentXpath
                                .replace(`${xpathOfTargetParent}/`, '')
                                .split('/')
                                .shift()
                            xpath = `${xpathOfTargetParent}/${componentTag}`
                            // 获取配置里埋点元素targetDom和它的兄弟dom
                            dom = getEleByXpath(xpath) as Element
                            const targetDom = getEleByXpath(targetXpath)
                            // 两个元素的classList是否相同。如果相同，说明点击的是兄弟元素，需要触发上报
                            if (!hasSameClassList(dom, targetDom ?? undefined)) {
                                return false
                            }
                            isSibling = true
                            return true
                        }
                    }
                    return false
                })

                const currentValidationMarker = getValidationMarker(dom)
                const targetValidationMarker = targetConfig?.validationMarker ?? ''

                if (
                    targetConfig &&
                    this.checkMarker(currentValidationMarker, targetValidationMarker)
                ) {
                    let datasource = targetConfig.datasource
                    if (isSibling) {
                        datasource = getSiblingDatasource(
                            targetConfig.datasource,
                            targetConfig.xpath,
                            xpath,
                        )
                    }

                    const data = this.getEventData(datasource)
                    // 进行验证
                    let validationResult
                    if (this.mode !== ModeEnum.Report) {
                        validationResult = this.validateData(datasource)
                            ? ValidateStatusEnum.Success
                            : ValidateStatusEnum.Fail
                    }
                    this.report({
                        eventId: targetConfig.id,
                        eventType: EventTypeEnum.Click,
                        xpath: currentXpath,
                        data,
                        eventName: targetConfig.eventName,
                        validationResult,
                    })
                }
            },
            { capture: true },
        )
    }

    createIntersectionObserver(threshold: number) {
        const callback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.intersectionRatio >= threshold) {
                    let config: Partial<TrackingConfig> = {}
                    try {
                        config = JSON.parse(entry.target.getAttribute(TRACK_ATTR) || '{}')
                    } catch {
                        config = {}
                        console.warn('缺少埋点配置')
                    }
                    const data = this.getEventData(config.datasource || [])
                    // 进行验证
                    let validationResult
                    if (this.mode !== ModeEnum.Report) {
                        validationResult = this.validateData(config.datasource || [])
                            ? ValidateStatusEnum.Success
                            : ValidateStatusEnum.Fail
                    }
                    this.report({
                        eventId: config.id,
                        eventType: EventTypeEnum.Expose,
                        xpath: config.xpath,
                        data,
                        validationResult,
                        eventName: config.eventName,
                    })
                }
            })
        }

        const intersectionObserver = new IntersectionObserver(callback, {
            threshold,
        })
        return intersectionObserver
    }

    getEventData(datasource: Datasource[]) {
        const data: Record<string, any> = {}
        datasource.forEach((source) => {
            const ele = getEleByXpath(source.fieldXpath)
            if (ele) {
                let value = ''
                if (ele instanceof HTMLInputElement || ele instanceof HTMLTextAreaElement) {
                    value = ele.value
                } else if (
                    ele instanceof HTMLImageElement ||
                    ele instanceof HTMLAudioElement ||
                    ele instanceof HTMLVideoElement
                ) {
                    value = ele.src
                } else {
                    value = (ele as HTMLElement).textContent ?? ''
                }
                data[source.fieldName] = value
            }
        })
        return data
    }

    validateData(datasource: Datasource[]) {
        const result = datasource.every((source) => {
            let data = ''
            const ele = getEleByXpath(source.fieldXpath)
            if (ele) {
                data = (ele as HTMLElement).innerText
            }
            if (source?.isRequired === RuleRequiredEnum.YES) {
                if (!data) {
                    return false
                }
            }
            if (source?.reg) {
                const reg = new RegExp(source.reg)
                return reg.test(data)
            } else {
                // 不传正则时，默认不验证字段，所以直接返回成功
                return true
            }
        })
        return result
    }

    report(data: Record<string, any>) {
        if (this.mode === ModeEnum.Validate) {
            this.reportValidation(data)
        } else if (this.mode === ModeEnum.Report) {
            this.reportLog(data)
        } else if (this.mode === ModeEnum.ReportAndValidate) {
            this.reportValidation({ ...data })
            this.reportLog({ ...data })
        } else {
            console.error('不支持的上报模式:', this.mode)
        }
    }

    reportLog(data: Record<string, any>) {
        delete data.validationResult
        delete data.eventName
        if (this.sendType === SendTypeEnum.Beacon) {
            const msg = new Blob([JSON.stringify(data)], { type: 'application/json' })
            navigator.sendBeacon(`${this.serverURL}/tracking/report`, msg)
        } else if (this.sendType === SendTypeEnum.Gif) {
            let img: HTMLImageElement | null = new Image()
            const searchParams = objectToSearchParams(data)
            const url = `${this.serverURL}/tracking/track.gif?${searchParams}`
            img.src = url
            img = null
        } else {
            console.warn('不支持的上报类型:', this.sendType)
        }
    }

    reportValidation(data: Record<string, any>) {
        window.parent.postMessage(
            {
                type: 'client-sdk',
                method: 'reportValidation',
                params: data,
            },
            normalizeURL(this.trackingClientURL ?? ''),
        )
    }

    async getCurrentTrackingConfig(url: string, config?: Record<string, any>) {
        let data: TrackingConfig[] = []

        try {
            const res = await this.request.get(
                `/tracking?page=1&filter=projectId||$eq||${
                    this.projectId
                }&filter=url||$eq||${encodeURIComponent(url)}`,
                undefined,
                config,
            )
            if (res.code === 200) {
                data = res.data.data
            }
        } catch {
            data = []
        }

        return data
    }

    addAllListeners() {
        // 采集曝光
        this.registerMutationObserver()
        // 采集点击
        this.registerClickEvent()
    }

    async setTrackingConfig() {
        if (this.requestAbortController) {
            this.requestAbortController.abort()
            this.requestAbortController = undefined
        }
        this.requestAbortController = new AbortController()
        const trackingConfig = await this.getCurrentTrackingConfig(location.href, {
            signal: this.requestAbortController.signal,
        })
        this.exposeConfigList = trackingConfig.filter((config) =>
            config.eventType.includes(EventTypeEnum.Expose),
        )
        this.clickConfigList = trackingConfig.filter((config) =>
            config.eventType.includes(EventTypeEnum.Click),
        )
    }

    async start() {
        this.router.onChange(async () => {
            await this.setTrackingConfig()
            // 立即执行一次变化检测
            this.observeDomChange()
        })

        this.intersectionObserver = this.createIntersectionObserver(
            this.intersectionObserverOptions.threshold || 0.5,
        )
        await this.setTrackingConfig()
        this.addAllListeners()
    }
}

function normalizeURL(url: string) {
    return new URL(url).origin
}

// 获取公共前缀长度
function getCommonPrefixLength(str1: string, str2: string): number {
    let length = 0
    const minLength = Math.min(str1.length, str2.length)
    for (let i = 0; i < minLength; i++) {
        if (str1[i] === str2[i]) {
            length++
        } else {
            break
        }
    }
    return length
}
