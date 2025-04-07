import { useCreation, useMemoizedFn } from 'ahooks'
import { Updater } from 'use-immer'

const useResetImmer = <State>(initialState: State): [State, Updater<State>, () => void] => {
    const initialStateMemo = useCreation(() => initialState, [])
    const [state, setState] = useImmer(initialState)

    const resetState = useMemoizedFn(() => {
        setState(initialStateMemo)
    })

    return [state, setState, resetState]
}

export default useResetImmer
