import axios from 'axios'
import { BASE_URL } from '@/config'

import dicts from './dicts.json'

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
})

client.interceptors.request.use(
  config => ({
    ...config,
    headers: {
      ...config.headers
    }
  }),
  error => error
)

client.interceptors.response.use(
  response => (response && response.data ? response.data : response) || {},
  error => {
    const status = error.response ? error.response.status : 408

    console.warn('interceptors error', status, error.response, error)
    return Promise.reject(error)
  }
)

const apiService = {
  client,
  fetchAnimals(params) {
    return new Promise(resolve => {
      setTimeout(() => {
        const item = { value: params.offset, id: params.offset }
        const list = [item, item, item, item, item]
        const data = { list, count: 10 }
        resolve(data)
      }, 500)
    })
    // return this.client.get('/api/animals/public', { params })
  },
  createRequest(params) {
    return new Promise(resolve => {
      setTimeout(() => {
        const res = { status: 'ok', ...params }
        resolve(res)
      }, 2000)
    })
    // return this.client.post('/api/request', { params })
  },
  fetchDicts() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(dicts)
      }, 0)
    })
    // return this.client.get('/api/dicts')
  }
}

export default apiService
