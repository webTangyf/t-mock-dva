import axios from 'axios'
import config from './config'
import portUrl from './portUrl'
const qs = require('qs')

let instance = axios.create({
  baseURL: config.baseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'Accept': 'application/json'
  },
  transformRequest: [function (data) {
      return qs.stringify(data)
  }]
})

// 由于react-saga的特性 需要在promise外层包含一层函数
let filter = {}
Object.keys(instance).forEach(key => {
  let item = instance[key]
  if (config.wrapList.includes(key)) {
    filter[key] = function (...args) {
      return function () {
        return item(...args)
      }
    }
    return false
  }
  filter[key] = item
})
filter.url = portUrl

export default filter