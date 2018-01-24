import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Weather = (reslove) => {
  import('components/weather/weather').then((weather) => {
    reslove(weather)
  })
}
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Weather',
      component: Weather
    }
  ]
})
