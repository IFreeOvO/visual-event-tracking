import { Action } from './action.vo'

export interface Feature {
    id: number
    subjectName: string
    subjectDesc: string
    subjectCode: string
    action: Action
}
