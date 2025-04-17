import type { TrackingDrawerProps } from './tracking-drawer'
import { useMemoizedFn } from 'ahooks'
import { Form, message } from 'antd'
import { cloneDeep } from 'lodash-es'
import { deleteTrackingDatasource, getTracking, updateTracking } from '@/api/service/tracking'
import { upload } from '@/api/service/upload'
import { Tracking } from '@/models/vo/tracking.vo'
import { dataURLToBlob } from '@/shared/dataURL-to-blob'
import emitter, { EmitterEventTypes } from '@/shared/emitter'
import { getRandomString } from '@/shared/get-random-string'
import TrackingDrawer from './tracking-drawer'

export type EditTrackingDrawerProps = Omit<TrackingDrawerProps, 'form'> & {
    trackingId: number
    onSubmitSuccess?: () => void
}

const EditTrackingDrawer: React.FC<EditTrackingDrawerProps> = (props) => {
    const { trackingId, onSubmitSuccess, open } = props
    const [form] = Form.useForm()
    const [data, setData] = useImmer<Tracking | undefined>(undefined)
    const formData = useMemo(() => {
        if (!data) return {}
        const cloneData = cloneDeep(data)
        cloneData?.datasource.forEach((row) => {
            row.tempId = getRandomString()
        })
        return cloneData
    }, [data])

    const getNewDatasource = async (values: Tracking): Promise<Tracking['datasource']> => {
        const formData = new FormData()
        const uploadTempIds: string[] = []

        const validData = values.datasource.filter((row) => row.fieldName && row.fieldXpath)
        validData.forEach((row) => {
            // 只把表格里dataURL格式的图片上传
            if (!row.fieldSnapshot.startsWith('http')) {
                const filename = encodeURIComponent(
                    `${values.eventName}_${row.fieldName}_snapshot.png`,
                )
                formData.append(
                    'files',
                    new File([dataURLToBlob(row.fieldSnapshot)], filename, {
                        type: 'image/png',
                    }),
                )
                uploadTempIds.push(row.tempId!)
            }
        })

        if (isEmptyFormData(formData)) {
            return values.datasource.map((row) => {
                const newRow = { ...row }
                delete newRow.tempId
                return newRow
            })
        }

        const [err, uploadRes] = await upload(formData)
        if (err) {
            return []
        }
        const dataSnapshots = uploadRes.data
        // 把dataURL替换换成真实的url。并删除临时id
        const newDatasource = values.datasource.map((row) => {
            const newRow = { ...row }
            const index = uploadTempIds.findIndex((tempId) => tempId === row.tempId)
            // tempId在uploadTempIds里的顺序，对应该行埋点数据图片的顺序
            if (index > -1) {
                newRow.fieldSnapshot = dataSnapshots[index].url
                uploadTempIds.splice(index, 1)
            }
            delete newRow.tempId
            return newRow
        })
        return newDatasource
    }

    const getRequestParams = async (values: Tracking): Promise<Tracking> => {
        const params: Tracking = Object.assign({}, values, {
            datasource: cloneDeep(values.datasource),
            projectId: data?.projectId,
        })

        params.datasource = await getNewDatasource(values)
        return params
    }

    const onFinishForm = async (values: Tracking) => {
        emitter.emit(EmitterEventTypes.showFullScreenLoading, true)

        const params = await getRequestParams(values)
        const [err] = await updateTracking(trackingId, params)
        emitter.emit(EmitterEventTypes.showFullScreenLoading, false)
        if (err) {
            return
        }
        message.open({
            content: '操作成功',
            type: 'success',
        })
        if (onSubmitSuccess) {
            onSubmitSuccess()
            emitter.emit(EmitterEventTypes.onEditTrackingSuccess)
        }
    }

    const onDeleteRow: TrackingDrawerProps['onDeleteRow'] = async (
        rowIndex,
        record,
        setTableData,
    ) => {
        if (record.id) {
            const [err] = await deleteTrackingDatasource(record.id)
            if (err) {
                return
            }
        }

        setTableData((draft) => {
            draft.splice(rowIndex, 1)
        })
    }

    const initData = useMemoizedFn(async () => {
        const [err, res] = await getTracking(trackingId)
        if (err) {
            return
        }
        setData(res.data)
    })

    useEffect(() => {
        if (open) {
            initData()
        }
    }, [open, initData])

    return (
        <TrackingDrawer
            {...props}
            mode="edit"
            name="edit-tracking-form"
            form={form}
            drawerTitle="编辑埋点"
            formData={formData}
            onDeleteRow={onDeleteRow}
            onFinishForm={onFinishForm}
        ></TrackingDrawer>
    )
}

export default EditTrackingDrawer

function isEmptyFormData(formData: FormData) {
    return formData.entries().next().done === true
}
