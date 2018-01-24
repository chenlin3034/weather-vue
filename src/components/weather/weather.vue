<template>
  <div>
    <div id="w-main" class="container weather-now">
      <a class="link-back"><i class="iconfont icon-fanhui"></i></a>
      <!--<a class="btn-share"><i class="iconfont icon-fenxiang"></i></a>-->
      <p @click="toggleSearch" v-show="city.location" class="text-location"><i class="iconfont icon-weizhi"></i>{{city.city}}
        {{city.location}}</p>
      <div class="ct-pub" :class="ctPub" v-html="update.loc"></div>
      <p class="temperature" v-html="now.tmp"></p>
      <p class="txt-weather" v-html="now.cond_txt"></p>
      <transition-group name="wind" :duration="750" type="animation" class="ct-wind-humidity" tag="div">
        <p class="txt" :class="index === windActiveIndex?'active':''" v-for="(wind, index) in now.wind" :key="index">
          {{wind}}</p>
      </transition-group>
      <div class="landscape" :class="timeName">
        <div class="layer land1"></div>
        <div class="layer land2"></div>
        <div class="layer land3"></div>
      </div>
      <div @click="toggleAqiPop" class="aqi" :class="air.level" v-if="air">
        <p class="title">空气</p>
        <p class="value">{{air.qlty}}</p>
      </div>
      <div class="pop-window" :class="aqiShow?'show':''"  v-if="air">
        <div @click="toggleAqiPop" class="bg-cover"></div>
        <div class="ari-pop window" :class="air.level">
          <div class="main"><a id="icon-close"></a>
            <p class="titl">空气质量指数</p>
            <p class="val">{{air.aqi}}</p>
            <p class="level">{{air.qlty}}</p></div>
          <table class="detal">
            <tbody>
            <tr>
              <td><p class="val">{{air.pm25}}</p>
                <p class="titl">PM2.5</p></td>
              <td><p class="val">{{air.pm10}}</p>
                <p class="titl">PM10</p></td>
              <td><p class="val">{{air.so2}}</p>
                <p class="titl">SO2</p></td>
            </tr>
            <tr>
              <td><p class="val">{{air.no2}}</p>
                <p class="titl">NO2</p></td>
              <td><p class="val">{{air.o3}}</p>
                <p class="titl">O3</p></td>
              <td><p class="val">{{air.co}}</p>
                <p class="titl">CO</p></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="container tomorrow" v-show="daily_forecast">
      <div class="item" v-for="(item, index) in daily_forecast" v-if="item.date_name==='今天'||item.date_name==='明天'">
        <div class="top">
          <p class="date">{{item.date_name}}</p>
          <p class="temperature">{{item.tmp_max}}/{{item.tmp_min}}°</p>
        </div>
        <div class="bottom">
          <p class="weather">{{item.cond_txt_d}}</p>
          <img :src="item.cond_icon_d" class="logo">
        </div>
      </div>
    </div>
    <div v-if="hourly.length > 0" class="container">
      <scroll :data="hourly" v-if="hourly.length" class="hourly-wrapper">
        <ul class="scroll-list">
          <li class="item" v-for="item in hourly">
            <p class="txt-time">{{item.time}}</p>
            <img :src="item.cond_icon" class="icon">
            <p class="txt-degree positive">{{item.tmp}}</p>
          </li>
        </ul>
      </scroll>
    </div>
    <div class="container" v-show="daily_forecast">
      <div class="days">
        <scroll :data="daily_forecast" @initChart="initChart" v-if="daily_forecast.length">
          <div>
            <ul class="scroll-list">
              <li class="item" v-for="item in daily_forecast">
                <p class="day">{{item.date_name}}</p>
                <p class="date">{{item.date}}</p>
                <div class="ct-daytime">
                  <p class="weather">{{item.cond_txt_d}}</p>
                  <img :src="item.cond_icon_d" class="icon">
                </div>
                <div class="ct-night">
                  <img :src="item.cond_icon_n" class="icon">
                  <p class="weather">{{item.cond_txt_n}}</p>
                </div>
                <p class="wind">{{item.wind_dir}}</p>
                <p class="wind">{{item.wind_sc}}</p>
              </li>
            </ul>
            <div class="chart-days">
              <line-chart :list="daily_forecast" v-if="chart"></line-chart>
            </div>
          </div>
        </scroll>
      </div>
    </div>
    <div class="container living" v-show="lifestyle">
      <ul id="ls-living">
        <li class="item" v-for="item in lifestyle" @click="popWindow(item)">
          <span class="iconfont" :class="'icon-'+item.type" :style="'color:'+styleColor[item.type]"></span>
          <p class="content">{{item.brf}}</p>
          <p class="title">{{item.name}}</p>
        </li>
      </ul>
      <div class="pop-window" :class="popInfo.title?'show':''">
        <div @click="closePop" class="bg-cover"></div>
        <div class="window">
          <h3 class="title" :style="popInfo.bgColor" v-html="popInfo.title"></h3>
          <p class="txt" v-html="popInfo.txt"></p>
          <button @click="closePop" :style="popInfo.bgColor" class="btn-close">我知道了</button>
        </div>
      </div>
    </div>
    <footer class="footer">
      <div class="links">
        <a class="link" href="javascript:;">功能定制</a>
        <a class="link" href="javascript:;">微信：chenlin3034</a>
      </div>
    </footer>
    <search @closeSearch="toggleSearch" @changeCity="changeCity" v-show="searchStatus"></search>
    <loading v-show="!city.location"></loading>
  </div>
</template>

<script type="es6">
  import { weather,getAir } from 'common/js/weather'
  import { styleColor } from 'common/conf/lifestyle'
  import Loading from 'components/base/loading/loading'
  import Scroll from 'components/base/scroll/scroll'
  import Line from 'components/base/echarts/line'
  import Search from 'components/search/search'

  export default {
    data () {
      return {
        city: {},
        city_code: '',
        now: {},
        update: {},
        hourly: [],
        daily_forecast: [],
        lifestyle: [],
        windActiveIndex: -1,
        popInfo: {},
        styleColor: styleColor,
        timeName: 'day',
        ctPub: '',
        chart: false,
        searchStatus: false,
        air: null,
        aqiShow: false
      }
    },
    created () {
      this.getAddress()
    },
    mounted () {
      let now = new Date();
      if (now.getHours() >= 6 && now.getHours() < 6) {
        this.timeName = 'day'
      } else {
        this.timeName = 'night'
      }
    },
    methods: {
      getAddress(){
        if (typeof AMap === 'object') {
          let self = this
          const mapObj = new AMap.Map('');
          mapObj.plugin('AMap.Geolocation', function () {
            let geolocation = new AMap.Geolocation({
              timeout: 5000,
              convert: false
            });
            geolocation.getCurrentPosition()
            AMap.event.addListener(geolocation, 'complete', (res) => {
              let city = ''
              if (res.addressComponent) {
                city = res.addressComponent.city
                self.getAir(city)
              }
              self.weather(city)
            })
            AMap.event.addListener(geolocation, 'error', () => {
              self.weather()
            })
          })
        } else {
          this.weather()
        }
      },
      weather (city) {
        this.chart = false
        this.city = {}
        this.hourly = []
        this.daily_forecast = []
        this.lifestyle = []
        weather(city).then((res) => {
          if (res.code === 200) {
            if (res.data.length === 0) {
              return;
            }
            let data = res.data
            this.city = data.city
            this.city_code = data.city.city_code
            this.now = data.now
            this.daily_forecast = data.daily_forecast
            this.hourly = data.hourly || []
            this.lifestyle = data.lifestyle
            this.update = data.update
            this.loopWind()
            setTimeout(() => {
              this.ctPub = 'hide'
            }, 3000)
          } else {
            alert(res.msg)
          }
        })
      },
      getAir(city){
        this.air = null
        getAir(city).then((res) => {
          if(res.code === 200) {
            if(res.data && res.data.air_now_city) {
              this.air = res.data.air_now_city
              const aqi = parseInt(this.air.aqi)
              if (aqi <= 100) {
                this.air.level = 'level2'
              } else if (aqi <= 150) {
                this.air.level = 'level3'
              } else if (aqi <= 200) {
                this.air.level = 'level4'
              } else if (aqi <= 300) {
                this.air.level = 'level5'
              } else if (aqi > 300) {
                this.air.level = 'level6'
              } else {
                this.air.level = 'level1'
              }
            }
          }
        })
      },
      loopWind () {
        let length = this.now.wind.length
        let index = this.windActiveIndex
        index++
        if (index === length) {
          index = 0
        }
        setTimeout(() => {
          this.windActiveIndex = index
        }, 5000)
      },
      changeCity (city_code) {
        if (city_code === this.city_code) {
          return
        }
        this.weather(city_code)
        this.getAir(city_code)
      },
      popWindow(item){
        this.popInfo = {
          title: item.name + '指数',
          txt: item.txt,
          bgColor: `background-color: ${styleColor[item.type]}`
        }
      },
      closePop(){
        this.popInfo = {}
      },
      initChart(){
        this.chart = true
      },
      toggleSearch() {
        this.searchStatus = !this.searchStatus
      },
      toggleAqiPop(){
        this.aqiShow = !this.aqiShow
      }
    },
    watch: {
      windActiveIndex () {
        this.loopWind()
      }
    },
    components: {
      Scroll,
      Loading,
      'line-chart': Line,
      Search
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  .layer
    position: absolute
    bottom: 0
    top: 60px

  @keyframes wind-show
    0% {
      transform: translate3d(0, 14px, 0);
      opacity: 0
    }
    to {
      transform: translateZ(0);
      opacity: 1
    }

  @-webkit-keyframes wind-show
    0% {
      -webkit-transform: translate3d(0, 14px, 0);
      opacity: 0
    }
    to {
      -webkit-transform: translateZ(0);
      opacity: 1
    }

  @keyframes wind-hide
    0% {
      transform: translateZ(0);
      opacity: 1
    }
    to {
      transform: translate3d(0, -14px, 0)
      opacity: 0
    }

  @-webkit-keyframes wind-hide
    0% {
      -webkit-transform: translateZ(0)
      opacity: 1
    }
    to {
      -webkit-transform: translate3d(0, -14px, 0)
      opacity: 0
    }

  .scroll-list
    display block
    height 100%
    overflow hidden
    .item
      float: left
      width: 80px
      text-align: center
      position: relative

  .container
    position relative
    max-width 500px
    margin 0 auto
    text-align center
    overflow hidden
    color #fff
    box-sizing: border-box

  .weather-now
    height 400px
    background-image: -webkit-linear-gradient(-90deg, #313877, #44abec)
    .link-back, .btn-share
      position absolute
      width 22px
      height 22px
      top 15px
      color #fff
    .link-back
      left 8px
    .btn-share
      right 8px
    .link-back .iconfont, .btn-share .iconfont
      font-size 22px
    .text-location
      height 16px
      line-height 16px
      width 76%
      margin 18px 12% 6px
      .icon-weizhi
        margin-right 4px
    .text-location:hover
      opacity: .6
    .ct-pub
      height: 12px
      line-height: 12px
      font-size: 12px
      transition: opacity .75s
      -webkit-transition: opacity .75s
      &.hide
        opacity: 0
    .temperature
      position: relative
      margin-top: 55px
      height: 62px
      line-height: 62px
      font-size: 62px
      color: #fff
    .temperature:after
      content: "\B0"
      position: absolute
      top: 0;
      text-align: left
    .txt-weather
      height: 22px
      line-height: 22px
      margin-top: 8px
      font-size: 22px
    .ct-wind-humidity
      margin-top: 10px
      height: 14px
      position: relative
      .txt
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 14px
        line-height: 14px
        font-size: 14px
        animation-fill-mode: forwards
        -webkit-animation-fill-mode: forwards
        animation-duration: .75s
        -webkit-animation-duration: .75s
        animation-name: wind-hide
        -webkit-animation-name: wind-hide
      .active
        animation-name: wind-show
        -webkit-animation-name: wind-show
        &.wind-enter
          0% {
            -webkit-transform:translate3d(0,14px,0)
            opacity:0
          }
          to {
            -webkit-transform:translateZ(0)
            opacity:1
          }
        &.wind-leave
          0% {
            transform:translateZ(0)
            opacity:1
          }
          to {
            transform:translate3d(0,-14px,0)
            opacity:0
          }
    .txt-tips
      position: relative
      margin: 50px 60px 0
      height: 16px
      line-height: 1.5
      font-size: 16px
      z-index: 2
    .landscape
      position: absolute
      bottom: 0
      top: 60px
      width: 100%
      overflow: hidden
      z-index: 1
      .layer
        content: ""
        left: -6%
        right: -6%
        background-position: bottom
        background-repeat: no-repeat
        background-size: 100% auto
      &.night
        .land1
          z-index: 3
          background-image: url(//mat1.gtimg.com/pingjs/ext2020/tianqi/mobilev2/f9fca795811b5d7c0e49580760bb0213.png)
        .land2
          z-index: 2
          background-image: url(//mat1.gtimg.com/pingjs/ext2020/tianqi/mobilev2/53347cfa83d5c053610eaa533d2d02fc.png)
        .land3
          z-index: 1
          background-image: url(//mat1.gtimg.com/pingjs/ext2020/tianqi/mobilev2/a0de07d1388c2c4f81b8caf96717e1a4.png)
      &.day
        .land1
          z-index: 3
          background-image: url(https://mat1.gtimg.com/pingjs/ext2020/tianqi/mobilev2/1760b3821904f2080269709e89a22e26.png)
        .land2
          z-index: 2
          background-image: url(https://mat1.gtimg.com/pingjs/ext2020/tianqi/mobilev2/4f99c267041530f361776065c5af2671.png)
        .land3
          z-index: 1
          background-image: url(https://mat1.gtimg.com/pingjs/ext2020/tianqi/mobilev2/2bbce2b25f1f2a8af1fbf7c9215a6afe.png)
    .aqi
      height: 44px
      position: absolute
      top: 67px
      left: 8px
      padding: 8px 12px
      border-radius: 8px
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, .12)
      background: #ffbf62
      z-index: 2
      &.level1
        background-color:#a3d765
      &.level2
        background-color:#f0cc35
      &.level3
        background-color:#f1ab62
      &.level4
        background-color:#ef7f77
      &.level5
        background-color:#b28ccb
      &.level6
        background-color:#ad788a
      .title
        height: 12px
        line-height: 12px
        margin-bottom: 3px
        font-size: 12px
        opacity: .8
        color: #fff
      .value
        height: 14px
        line-height: 14px
        margin-top: 2px
        font-size: 12px
        color: #fff

  .tomorrow
    height: 103px
    padding-top: 26px
    margin-bottom: 10px
    border-bottom: 1px solid #e4e4e4
    background: #fff
    &::after
      content: ""
      position: absolute
      width: 1px
      height: 52px
      background-color: #f0f0f0
      left: 50%
      top: 26px
    .item
      width: 50%
      height: 52px
      line-height: 14px
      float: left
      padding: 0 20px
      font-size: 14px
      color: #434343
      .top
        height: 12px
        margin-bottom: 13px
        .date
          float: left
        .temperature
          float right
      .bottom
        height: 22px
        .weather
          height: 22px
          line-height: 22px
          float: left
        .logo
          height: 22px
          width: 22px
          float: right

  .hourly-wrapper
    height 136px
    margin-bottom: 10px
    padding-top: 30px
    background #fff
    .txt-time
      font-size: 12px
      line-height: 12px
      height: 12px
      color: #999
    .icon
      height: 24px
      width: 24px
      display: block
      margin: 15px auto
    .txt-degree
      font-size: 14px
      color: #434343
      line-height: 14px
      height: 14px
      position: relative
      &:after
        position: absolute
        text-align: left
        top: 0
        content: "\B0"

  .days
    position: relative
    height: 391px
    padding-top: 25px
    margin-bottom: 10px
    border-top: 1px solid #e4e4e4
    border-bottom: 1px solid #e4e4e4
    background-color: #fff
    overflow-x: auto
    overflow-y: hidden
    .date, .day, .wind, .weather
      height: 12px
      line-height: 12px
      font-size: 12px
      color: #b2b2b2
    .weather
      height: 14px
      line-height: 14px
      font-size: 14px
    .date
      margin: 5px 0 15px
    .wind
      width: 40px
      margin: 0 auto 6px
      overflow: hidden
    .icon
      display: block
      width: 24px
      height: 24px
      margin: 0 auto
    .ct-daytime
      .weather
        margin-bottom: 14px
    .ct-night
      margin-top: 136px
      .weather
        margin: 16px 0 20px
    .chart-days
      position: absolute
      left: 0
      right: 0
      width: 100%
      height: 136px
      top: 100px

  .living
    border-top: 1px solid #e4e4e4
    border-bottom: 1px solid #e4e4e4
    background-color: #fff
    .item
      float: left;
      width: 25%
      height: 94px
      border-right: 1px solid #e6e6e6
      border-bottom: 1px solid #e6e6e6
      background-color: #fff
      text-align: center
      .content
        height: 14px
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: #434343
      .title
        height: 12px
        line-height: 12px
        font-size: 12px
        color: #999
      .iconfont
        height: 24px
        width: 24px
        display: block
        margin: 15px auto 10px
        font-size: 24px

  .pop-window
    text-align center
    &.show
      display: block
      .window
        margin-top: -5%
        visibility: visible
        -webkit-transform: translateY(-50%)
        transform: translateY(-50%)
        opacity: 1
      .bg-cover
        display: block
    .window
      border-radius: 8px
      background: #fff
      padding-bottom: 20px
      position: fixed
      width: 250px
      left: 50%
      top: 50%
      margin-left: -125px
      z-index: 1000
      opacity: 0
      visibility: hidden
      -webkit-transform: translateY(-40%)
      transform: translateY(-40%)
      -webkit-transition: all .3s ease 50ms
      transition: all .3s ease 50ms
      .title
        height: 58px
        line-height: 58px
        font-size: 20px
        color: #fff
        border-top-right-radius: 8px
        border-top-left-radius: 8px
      .txt
        line-height: 22px
        padding: 27px 20px 20px
        font-size: 14px
        color: #434343
        text-align: left
      .btn-close
        width: 200px
        height: 40px
        line-height: 40px
        border-radius: 6px
        font-size: 16px
        color: #fff
        border: none
    .bg-cover
      display: none
      position: fixed;
      top: 0
      bottom: 0
      left: 0
      right: 0
      background-color: rgba(0, 0, 0, .43)
      z-index: 999
    .ari-pop
      padding-bottom: 5px
    .ari-pop
      &.level1
        background-color:#70defc;
        .level
          background-color:#a3d765
      &.level2
        background-color:#80d2e5
        .level
          background-color:#f0cc35
      &.level3
        background-color:#9ad4d6
        .level
          background-color:#f1ab62
      &.level4
        background-color:#9fc9c4
        .level
          background-color:#ef7f77
      &.level5
        background-color:#9eada7
        .level
          background-color:#b28ccb
      &.level6
        background-color:#929695
        .level
          background-color:#ad788a
      .main
        height: 250px
        width: 250px
        padding-top: 50px
        border-top-right-radius: 8px
        border-top-left-radius: 8px
        .titl
          line-height: 14px
          font-size: 14px
          color: #fff
        .val
          line-height: 60px
          margin: 15px 0 20px
          font-size: 60px
          color: #fff
        .level
          border-radius: 6px
          height: 24px
          line-height: 24px
          font-size: 16px
          color: #fff
          display: inline-block
          padding: 0 14px
      .detal
        width: 100%
        height: 112px
        margin-top: 5px
        background: #fff
        tr:first-child:after
          content: ""
          position: absolute
          left: 0
          height: 1px
          width: 100%
          -webkit-transform: scaleY(.5)
          transform: scaleY(.5)
          background: #e4e4e4
          top: auto
          bottom: 61px
        td
          width: 33.333%
          vertical-align: middle
          .val
            line-height: 14px
            margin-bottom: 5px
            font-size: 14px
            color: #434343
          .titl
            line-height: 11px
            font-size: 11px
            color: #b2b2b2
          &:nth-child(2)
            position: relative
          &:nth-child(2):before,&:nth-child(2):after
            content: ""
            position: absolute
            top: 0
            bottom: 0
            height: 100%
            width: 1px
            -webkit-transform: scaleX(.5)
            transform: scaleX(.5)
            background: #e4e4e4
          &:nth-child(2):before
            left: 0
          &:nth-child(2):after
            right: 0
  .footer
    padding: 15px 0
    font-size: 12px
    text-align: center
    color: #b2b2b2
    .link
      height: 26px
      line-height: 26px
      display: inline-block
      margin-right: 28px
</style>
