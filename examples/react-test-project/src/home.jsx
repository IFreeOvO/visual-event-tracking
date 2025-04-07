import { useNavigate } from 'react-router-dom'
const Home = () => {
    const navigate = useNavigate()

    const back = () => {
        navigate(-1)
    }

    return (
        <div>
            <div>home</div>
            <button onClick={back}>返回</button>
        </div>
    )
}

export default Home
