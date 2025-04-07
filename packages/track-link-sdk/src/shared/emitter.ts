type Listener = (...arg: any) => void
class Emitter {
    static events: Record<string, Set<Listener>> = {}

    static on(event: string | number, listener: Listener) {
        if (!this.events[event]) {
            this.events[event] = new Set()
        }
        this.events[event].add(listener)
    }

    static emit(event: string | number, ...args: any): void {
        if (!this.events[event]) {
            return
        }
        this.events[event].forEach((listener) => {
            listener(...args)
        })
    }

    static off(event: string | number, listener: Listener): void {
        const listeners = this.events[event]
        if (!listeners) {
            return
        }

        if (listeners.size === 0) {
            return
        }

        listeners.delete(listener)
    }
}

export default Emitter
