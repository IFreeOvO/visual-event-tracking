import useUserStore from '@/store/user.store'

export function getToken() {
    return useUserStore.getState().token
}

export function removeAuth() {
    useUserStore.getState().actions.removeAuth()
}

export const isLogin = () => {
    return getToken() ? true : false
}
