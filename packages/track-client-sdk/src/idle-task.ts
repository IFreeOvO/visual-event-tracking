export class IdleTask {
    taskQueue: ((...args: any) => any)[] = []
    isProcessing = false

    addTask(task: (...args: any) => any) {
        if (typeof task !== 'function') {
            throw new Error('必须传入函数类型任务')
        }
        this.taskQueue.push(task)
        if (!this.isProcessing) {
            this.schedule()
        }
    }

    schedule() {
        this.isProcessing = true
        requestIdleCallback((deadline) => this.runTasks(deadline))
    }

    runTasks(deadline: IdleDeadline) {
        while (this.taskQueue.length > 0 && deadline.timeRemaining() > 0) {
            const task = this.taskQueue.shift()
            task?.()
        }

        if (this.taskQueue.length > 0) {
            this.schedule()
        } else {
            this.isProcessing = false
        }
    }
}
