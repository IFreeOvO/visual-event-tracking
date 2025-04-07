interface Task {
    task: Function
    index: number
}

const MAX_CONCURRENT_REQUESTS = 6 // 最大并发请求数

class TaskPool {
    maxConcurrency: number
    taskList: Task[] = []
    result: any[] = []
    currentConcurrency: number = 0
    taskIndex: number = 0
    taskCount: number = 0

    constructor(maxConcurrency?: number) {
        this.maxConcurrency = maxConcurrency ?? MAX_CONCURRENT_REQUESTS
    }

    add(task: Function) {
        this.taskList.push({
            task,
            index: this.taskIndex++,
        })
        this.taskCount++
    }

    run() {
        let resolve: (value: unknown) => void
        let reject: (value: unknown) => void
        const promise = new Promise((resolveFn, rejectFn) => {
            resolve = resolveFn
            reject = rejectFn
        })

        const schedule = () => {
            while (this.currentConcurrency < this.maxConcurrency && this.taskList.length > 0) {
                const { task, index } = this.taskList.shift() as Task

                this.currentConcurrency++
                task()
                    .then((res: any) => {
                        this.result[index] = res
                        this.currentConcurrency--
                        this.taskCount--
                        schedule()

                        const isTaskFinished = this.taskCount === 0
                        if (isTaskFinished) {
                            resolve(this.result)
                        }
                    })
                    .catch(reject)
            }
        }
        schedule()

        return promise
    }
}

export default TaskPool
