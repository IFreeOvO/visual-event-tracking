import { createBrowserRouter } from 'react-router-dom'
import App from '../App.jsx'
import Home from '../home.jsx'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App></App>,
        children: [
            {
                path: '/hello',
                element: <div>Hello world!</div>,
            },
            {
                path: '/home',
                element: <Home></Home>,
            },
            {
                path: '/404',
                element: <div>404</div>,
            },
        ],
    },
])

export default router
