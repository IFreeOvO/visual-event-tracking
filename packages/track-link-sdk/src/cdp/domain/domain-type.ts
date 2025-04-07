export interface OverlayDomain {
    enable: () => void
    setInspectMode: (params: { highlightConfig: Record<string, any>; mode: string }) => void
    highlightNode: (params: {
        nodeId: number
        highlightConfig: Record<string, any>
        objectId: number
    }) => void
    hideHighlight: () => void
}

export interface DOMDomain {
    enable: () => void
    getDocument: () => { root: Node }
    setInspectedNode: (params: { nodeId: number }) => void
    requestChildNodes: (params: { nodeId: number }) => void
    pushNodesByBackendIdsToFrontend: (params: { backendNodeIds: Array<number> }) => {
        nodeIds: Array<number>
    }
    getDOMNode: (params: { nodeId: number }) => { node: Node }
    getDOMNodeId: (params: { node: Node }) => { nodeId: number }
}

interface CDP {
    DOM: DOMDomain
    Overlay: OverlayDomain
}

export interface Domain {
    get<T extends keyof CDP>(name: T): CDP[T]
}
