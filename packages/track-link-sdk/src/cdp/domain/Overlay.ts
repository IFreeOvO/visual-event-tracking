import HD from '@/shared/highlight'
import { DOMDomain, OverlayDomain, Domain } from './domain-type'

class Overlay {
    private _Overlay: OverlayDomain
    private _DOM: DOMDomain

    constructor(domain: Domain) {
        this._Overlay = domain.get('Overlay')
        this._DOM = domain.get('DOM')
    }

    enable() {
        this._Overlay.enable()
    }

    setInspectMode(params: { highlightConfig: Record<string, any>; mode: string }) {
        this._Overlay.setInspectMode(params)
    }

    highlightNode(params: {
        nodeId: number
        highlightConfig: Record<string, any>
        objectId: number
    }) {
        const { node } = this._DOM.getDOMNode(params)
        HD.highlight(node)
    }

    hideHighlight() {
        HD.reset()
    }
}

export default Overlay
