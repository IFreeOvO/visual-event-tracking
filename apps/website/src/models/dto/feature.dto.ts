export interface SearchFeatureForm {
    subjectDesc?: string
}

export interface AddFeature {
    subjectName: string
    subjectDesc: string
    subjectCode: string
    actionId: number
}

export interface UpdateFeature {
    subjectDesc: string
}
