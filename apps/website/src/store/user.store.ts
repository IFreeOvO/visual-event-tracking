import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface UserInfo {
    username?: string
    isAdmin?: boolean
    id?: number
}

interface Actions {
    updateToken: (token: string) => void
    updateUserInfo: (userInfo: UserInfo) => void
    removeAuth: () => void
}

interface UserStore {
    token: string
    userInfo: UserInfo
    actions: Actions
}

const useUserStore = create<UserStore>()(
    devtools(
        persist(
            immer((set) => ({
                token: '',
                userInfo: {},
                actions: {
                    updateToken: (token) =>
                        set((state) => {
                            state.token = 'Bearer ' + token
                        }),
                    updateUserInfo: (userInfo) =>
                        set((state) => {
                            state.userInfo = userInfo
                        }),
                    removeAuth: () => {
                        set((state) => {
                            state.token = ''
                            state.userInfo = {}
                        })
                    },
                },
            })),
            {
                name: 'userStore',
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({
                    token: state.token,
                    userInfo: state.userInfo,
                }),
            },
        ),
        {
            trace: import.meta.env.VITE_TRACE,
        },
    ),
)

export const useToken = () =>
    useUserStore((state) => [state.token, state.actions.updateToken] as const)

export const useUserInfo = () =>
    useUserStore((state) => [state.userInfo, state.actions.updateUserInfo] as const)

export default useUserStore
