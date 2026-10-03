import axios from 'axios'

const GREEN_API_URL = (
    import.meta.env.VITE_GREEN_API_URL ?? 'https://api.green-api.com'
).replace(/\/$/, '')

export const greenApiClient = axios.create({
    baseURL: GREEN_API_URL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
})