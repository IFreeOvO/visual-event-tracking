export interface LoginVO {
    user: {
        id: number
        username: string
        isAdmin: boolean
    }
    accessToken: string
}
