import type { InternalAxiosRequestConfig } from 'axios'
import type { AxiosError, AxiosResponse } from 'axios'
import mitt from 'mitt'
import { Result } from '@/api/request'

export enum EmitterEventTypes {
    OpenFormDrawer = 'open-form-drawer',
    onGlobalRequest = 'on-global-request',
    onGlobalFulfilledResponse = 'on-global-fulfilled-response',
    onGlobalRejectedResponse = 'on-global-rejected-response',
    onUnAuthorized = 'on-unauthorized',
    onOpenAddDrawer = 'on-open-add-drawer',
    onDrawerSubmitSuccess = 'on-drawer-submit-success',
    onSearchFinish = 'on-search-finish',
    onRefreshTable = 'on-refresh-table',
    onPaginationChange = 'on-pagination-change',
    onSaveTableRow = 'on-save-table-row',
    onDeleteTableRow = 'on-delete-table-row',
    onClickMenuPermissionButton = 'on-click-menu-permission-button',
    onClickFeaturePermissionButton = 'on-click-feature-permission-button',
    showFullScreenLoading = 'show-full-screen-loading',
    onEditTrackingSuccess = 'on-edit-tracking-success',
    // sdk方法
    EnableInspect = 'enableInspect',
    DisableInspect = 'disableInspect',
    Forward = 'forward',
    Popstate = 'popstate',
    Replace = 'replace',
    SyncURL = 'syncURL',
    RequestBack = 'requestBack',
    RequestForward = 'requestForward',
    RequestRefresh = 'requestRefresh',
    SendIframeInfoParams = 'sendIframeInfoParams',
    ReceiveTrackingData = 'ReceiveTrackingData',
    BeforeReceiveData = 'BeforeReceiveData',
    ReportValidation = 'reportValidation',
}

export enum FormDrawerTypes {
    AddMenu = 'add-menu',
}

export type Events = {
    [EmitterEventTypes.OpenFormDrawer]: {
        type: FormDrawerTypes
        isOpen: boolean
    }
    [EmitterEventTypes.onGlobalRequest]: InternalAxiosRequestConfig<any>
    [EmitterEventTypes.onGlobalFulfilledResponse]: AxiosResponse<Result>
    [EmitterEventTypes.onGlobalRejectedResponse]: AxiosError<Result<any>>
    [EmitterEventTypes.onUnAuthorized]: void
    [EmitterEventTypes.onDrawerSubmitSuccess]: void
    [EmitterEventTypes.onSearchFinish]: Record<string, any>
    [EmitterEventTypes.onOpenAddDrawer]: void
    [EmitterEventTypes.onRefreshTable]: void
    [EmitterEventTypes.onPaginationChange]: [page: number, pageSize: number]
    [EmitterEventTypes.onSaveTableRow]: [key: React.Key | React.Key[], row: any, originRow?: any]
    [EmitterEventTypes.onDeleteTableRow]: [key: React.Key | React.Key[], row: any]
    [EmitterEventTypes.onClickMenuPermissionButton]: any
    [EmitterEventTypes.onClickFeaturePermissionButton]: any
    [EmitterEventTypes.showFullScreenLoading]: boolean
    [EmitterEventTypes.onEditTrackingSuccess]: void
    // sdk方法
    [EmitterEventTypes.ReceiveTrackingData]: any
    [EmitterEventTypes.BeforeReceiveData]: void
    [EmitterEventTypes.Forward]: any
    [EmitterEventTypes.Replace]: any
    [EmitterEventTypes.Popstate]: any
    [EmitterEventTypes.SyncURL]: any
    [EmitterEventTypes.SendIframeInfoParams]: any
    [EmitterEventTypes.ReportValidation]: any
}

const emitter = mitt<Events>()

export default emitter
