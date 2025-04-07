import SDK, { WS_FROM } from '@ifreeovo/track-link-sdk'
import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import './App.css'

SDK.init({
    trackingClientURL: 'http://localhost:8000',
    socket: {
        devtoolURL: `ws://localhost:3000/api/v1/remote/devtool`,
        from: WS_FROM.CLIENT,
    },
})

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <p>
                    <input type="text" />
                </p>
                <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
                <div>
                    <hr />
                    <div>
                        <Link to={'/hello?a=1#1'}>跳转hello</Link>
                    </div>
                    <div>
                        <Link to={'/home'}>跳转home</Link>
                    </div>
                    <div>
                        <Link to={'/404?a=2#2'}>跳转404</Link>
                    </div>
                    <hr />
                    <div>
                        <Link to={'/404?a=2#2'} replace>
                            替换404
                        </Link>
                    </div>
                </div>
                <div style={{ border: '1px solid red' }}>
                    <Outlet></Outlet>
                </div>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
        </>
    )
}

export default App
