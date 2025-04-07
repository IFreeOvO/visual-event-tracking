import type { TrackingDrawerProps } from './tracking-drawer'
import { Form, message } from 'antd'
import { cloneDeep } from 'lodash-es'
import { createTracking } from '@/api/service/tracking'
import { upload } from '@/api/service/upload'
import { UploadResponseData } from '@/models/dto/upload.dto'
import { Tracking } from '@/models/vo/tracking.vo'
import { dataURLToBlob } from '@/shared/dataURL-to-blob'
import emitter, { EmitterEventTypes } from '@/shared/emitter'
import TrackingDrawer from './tracking-drawer'

type CreateTrackingDrawerProps = Omit<TrackingDrawerProps, 'form'> &
    Partial<Tracking> & {
        onSubmitSuccess?: () => void
    }

const CreateTrackingDrawer: React.FC<CreateTrackingDrawerProps> = memo((props) => {
    const { xpath, snapshot, url, validationMarker, onSubmitSuccess } = props
    const { id } = useParams()
    const [form] = Form.useForm()
    const formData = useMemo(() => {
        return {
            url,
            xpath,
            snapshot,
        }
    }, [url, xpath, snapshot])

    // 把dataURL统一上传换成真实的url
    const dataURLtoURL = async (
        values: Omit<Tracking, 'id'>,
    ): Promise<[UploadResponseData, UploadResponseData[]]> => {
        const formData = new FormData()

        // 添加埋点图片
        const blob = dataURLToBlob(values.snapshot)
        const imgName = encodeURIComponent(`${values.eventName}_snapshot.png`)
        formData.append(
            'files',
            new File([blob], imgName, {
                type: 'image/png',
            }),
        )
        // 添加表格图片
        const validData = values.datasource.filter((row) => row.fieldName && row.fieldXpath)
        validData.forEach((row) => {
            const filename = encodeURIComponent(`${values.eventName}_${row.fieldName}_snapshot.png`)
            formData.append(
                'files',
                new File([dataURLToBlob(row.fieldSnapshot)], filename, {
                    type: 'image/png',
                }),
            )
        })

        const [err, uploadRes] = await upload(formData)
        if (err) {
            return [
                {
                    filename: '',
                    url: '',
                },
                [],
            ]
        }
        const [trackingSnapshot, ...dataSnapshots] = uploadRes.data
        return [trackingSnapshot, dataSnapshots]
    }

    const getRequestParams = async (
        values: Omit<Tracking, 'id'>,
    ): Promise<Omit<Tracking, 'id'>> => {
        const params: Omit<Tracking, 'id'> = Object.assign({}, values, {
            datasource: cloneDeep(values.datasource),
            projectId: Number(id),
        })

        const [trackingSnapshot, dataSnapshots] = await dataURLtoURL(values)
        params.snapshot = trackingSnapshot.url
        params.validationMarker = validationMarker ?? ''
        params.datasource.forEach((row, i) => {
            row.fieldSnapshot = dataSnapshots[i].url
            delete row.tempId
        })

        return params
    }

    const onFinishForm = async (values: Omit<Tracking, 'id'>) => {
        emitter.emit(EmitterEventTypes.showFullScreenLoading, true)

        const params = await getRequestParams(values)
        const [err] = await createTracking(params)
        emitter.emit(EmitterEventTypes.showFullScreenLoading, false)
        if (err) {
            return
        }
        message.open({
            content: '操作成功',
            type: 'success',
        })
        form.resetFields()
        if (onSubmitSuccess) {
            onSubmitSuccess()
        }
    }

    return (
        <TrackingDrawer
            {...props}
            mode="create"
            name="create-tracking"
            form={form}
            drawerTitle="添加埋点"
            formData={formData}
            onFinishForm={onFinishForm}
        ></TrackingDrawer>
    )
})

export default CreateTrackingDrawer
