import { DOMDomain, Domain } from './domain-type'

class DOM {
    private _DOM: DOMDomain

    constructor(domain: Domain) {
        this._DOM = domain.get('DOM')
    }

    enable() {
        this._DOM.enable()
    }

    getDocument() {
        return this._DOM.getDocument()
    }

    setInspectedNode(params: { nodeId: number }) {
        return this._DOM.setInspectedNode(params)
    }

    requestChildNodes(params: { nodeId: number }) {
        return this._DOM.requestChildNodes(params)
    }

    pushNodesByBackendIdsToFrontend(params: { backendNodeIds: Array<number> }) {
        return this._DOM.pushNodesByBackendIdsToFrontend(params)
    }

    getDOMNodeId(params: { node: Node }) {
        return this._DOM.getDOMNodeId(params)
    }

    getDOMNode(params: { nodeId: number }) {
        return this._DOM.getDOMNode(params)
    }
}

export default DOM
