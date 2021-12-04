import axios from 'axios'

const ERR_OK = 0
const baseURL = process.env.NODE_ENV === 'production' ? 'http://106.52.70.152/music-next/' : '/'

axios.defaults.baseURL = baseURL

export function get(url, params) {
  return axios.get(url, {
    params
  }).then((res) => {
    const serverData = res.data
    if (serverData.code === ERR_OK) {
      return serverData.result
    }
  }).catch((e) => {
    console.log(e)
  })
}
