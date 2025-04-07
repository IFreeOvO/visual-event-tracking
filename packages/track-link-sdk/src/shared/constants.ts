export enum SessionKeys {
    CLIENT_ID = '__client_id__',
}

export enum WS_FROM {
    DEVTOOL = '1',
    CLIENT = '2',
    OTHER = '3',
}

export enum EventMethods {
    'EnableInspect' = 'enableInspect',
    'DisableInspect' = 'disableInspect',
    'Forward' = 'forward',
    'Popstate' = 'popstate',
    'Replace' = 'replace',
    'SyncURL' = 'syncURL',
    'RequestBack' = 'requestBack',
    'RequestForward' = 'requestForward',
    'RequestRefresh' = 'requestRefresh',
    'SendIframeInfoParams' = 'sendIframeInfoParams',
    'ReceiveTrackingData' = 'ReceiveTrackingData',
    'BeforeReceiveData' = 'BeforeReceiveData',
}

export enum EventType {
    'SDK' = 'SDK',
    'CDP' = 'CDP',
    'History' = 'history',
}

export const DEPS_METADATA = Symbol('__deps__')

export enum GLOBAL_PROVIDERS {
    TrackingClientURL = 'TrackingClientURL',
    SocketConfig = 'socketConfig',
    SDKConfig = 'SDKConfig',
}

export enum RouterMethods {
    PushState = 'pushState',
    ReplaceState = 'replaceState',
    Popstate = 'popstate',
    Hashchange = 'hashchange',
    Go = 'go',
    Forward = 'forward',
    Back = 'back',
}

export enum Overlay {
    NodeHighlightRequested = 'Overlay.nodeHighlightRequested',
}

export enum EmitEvents {
    RequestBack,
    RequestForward,
    RequestRefresh,
    RequestEnableInspect,
    RequestDisableInspect,
}
