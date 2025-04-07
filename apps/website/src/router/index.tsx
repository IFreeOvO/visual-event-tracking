import { RouterProvider } from 'react-router-dom'
import useDynamicRouter from '@/hooks/business/use-dynamic-router'

const AppRouter = () => {
    const router = useDynamicRouter()
    return <RouterProvider router={router}></RouterProvider>
}

export default AppRouter
