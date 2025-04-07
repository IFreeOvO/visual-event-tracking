import axios from 'axios'
import { REQUEST_BASE_URL } from '@/constants/domains'

export const axiosInstance = axios.create({
    baseURL: REQUEST_BASE_URL,
    timeout: import.meta.env.VITE_REQUEST_TIMEOUT,
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
})
