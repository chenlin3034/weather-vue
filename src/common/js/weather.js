import axios from 'axios'

export function weather (city) {
  let url = 'https://wx.mumucode.com/api/weather'
  if (city) {
    url = url + '?city=' + city
  }
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => {
      })
  })
}

export function getCity (city) {
  if (!city) {
    return
  }
  let url = 'https://wx.mumucode.com/api/weather/city?name=' + city
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => {
      })
  })
}

export function getAir (city) {
  if (!city) {
    return
  }
  let url = 'https://wx.mumucode.com/api/weather/air?city=' + city
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => {
      })
  })
}
