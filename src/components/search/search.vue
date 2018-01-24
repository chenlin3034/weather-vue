<template>
  <div class="search-wrapper">
    <div class="search">
      <a @click="closeSearch" class="cancel">取消</a>
      <div class="input">
        <span class="iconfont icon-sousuo search-btn"></span>
        <input ref="keyword" @input="getCity" @focus="toggleMatch" @blur="toggleMatch" class="txt" type="text" placeholder="搜索市/县/区">
        <i v-show="keyword" @click="cleanKeyword" class="iconfont icon-clean"></i>
      </div>
    </div>
    <div class="city-list">
      <div class="history" v-show="history.length > 0">
        <a @click="cleanHistory" class="iconfont icon-shanchu clean"></a>
        <p class="title">历史记录</p>
        <ul class="city-wrapper">
          <li class="city" @click="changeCity(city)" v-for="(city,index) in history">{{city.city_name}}</li>
        </ul>
      </div>
      <div class="hot-city">
        <p class="title">热门城市</p>
        <ul class="city-wrapper">
          <li class="city" @click="changeCity(city)" v-for="city in hotCity">{{city.city_name}}</li>
        </ul>
      </div>
    </div>
    <div v-show="loading" class="loading">加载中...</div>
    <ul class="match-wrapper" v-show="cityList.length > 0 || matchStatus">
      <li @click="changeCity(item)" class="item" v-for="item in cityList" v-html="item.name"></li>
    </ul>
  </div>
</template>

<script type="es6">
  import {getCity} from 'common/js/weather'
  export default {
    data () {
      return {
        cityList: [],
        history: [],
        matchStatus: false,
        keyword: '',
        loading: false,
        hotCity: [
          {city_name: '北京', code: 'CN101010100'},
          {city_name: '郑州', code: 'CN101180101'},
          {city_name: '上海', code: 'CN101020100'},
          {city_name: '广州', code: 'CN101280101'},
          {city_name: '西安', code: 'CN101110101'},
          {city_name: '南京', code: 'CN101190101'},
          {city_name: '深圳', code: 'CN101280601'},
          {city_name: '杭州', code: 'CN101210101'},
          {city_name: '成都', code: 'CN101270101'},
        ]
      }
    },
    created () {
    },
    methods: {
      getCity () {
        this.cityList = []
        this.keyword = this.$refs.keyword.value
        if (!this.keyword || this.loading) {
          return
        }
        this.loading = true
        getCity(this.keyword).then((res) => {
          this.loading = false
          if (res.code === 200) {
            this.formatCityList(res.data,this.keyword)
          }
        })
      },
      formatCityList (list,city) {
        if (list.length > 0) {
          list.forEach((item) => {
            let value = {}
            value.code = item.city_code
            value.city_name = item.city_name
            if (item.province_name === item.parent_city_name) {
              value.name = item.city_name === item.parent_city_name ? item.city_name : item.province_name+','+item.city_name
            } else {
              value.name = item.city_name === item.parent_city_name ? item.province_name+','+item.city_name : item.province_name+','+ item.parent_city_name+','+item.city_name
            }
            value.name = value.name.replace(city, '<span style="color:#448aff;">'+city+'</span>')
            this.cityList.push(value)
          })
        }
      },
      changeCity (item) {
        if (!item) {
          return
        }
        if (this.history.indexOf(item) === -1) {
          this.history.push(item)
        }
        this.cleanKeyword()
        this.$emit('changeCity', item.code)
        this.$emit('closeSearch')
      },
      closeSearch () {
        this.cleanKeyword()
        this.$emit('closeSearch')
      },
      cleanKeyword () {
        this.keyword = ''
        this.$refs.keyword.value = ''
        this.cityList = []
      },
      cleanHistory () {
        this.history = []
      },
      toggleMatch () {
        this.matchStatus = !this.matchStatus
      }
    },
    watch: {
      cityList () {
        if (this.cityList) {

        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .search-wrapper
    position: fixed;
    z-index: 5;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    .iconfont
      color: #999
    .search
      height: 45px;
      padding: 7px 0;
      position: relative;
      border-bottom: 1px solid #eee;
      .cancel
        float: right;
        font-size: 14px;
        color: #434343;
        width: 60px;
        line-height: 30px;
        text-align: center;
      .input
        position: relative;
        margin-right: 60px;
        margin-left: 13px;
        .search-btn
          position: absolute;
          height: 16px;
          width: 16px;
          top: 6px;
          left: 10px;
          background-size: 16px;
          font-size: 16px;
        .txt
          width: 100%;
          height: 30px;
          padding: 3px 0 3px 32px;
          box-sizing: border-box;
          line-height: 24px;
          background: #f2f2f2;
          border-radius: 44px;
          font-size: 14px;
          color: #434343;
          -webkit-appearance: none;
          border-width: 0;
          outline: none;
        .icon-clean
          position:absolute;
          height:17px;
          width:17px;
          top:6px;
          right:14px;
          font-size: 17px
    .city-list
      padding: 0 13px 7px;
      position: absolute;
      top: 43px;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: auto;
      .clean
        float: right;
        height: 17px;
        width: 17px;
        margin-top: 21px;
        font-size: 17px;
      .title
        font-size: 14px;
        color: #434343;
        height: 20px;
        line-height: 20px;
        margin: 20px 0 10px;
        text-align: left;
      .city-wrapper
        overflow: hidden;
      .history
        .title
          float: left;
        .city-wrapper
          clear: both;
      .city
        background: #f2f2f2;
        border-radius: 44px;
        padding: 0 16px;
        width: 32%;
        height: 28px;
        line-height: 28px;
        margin-bottom: 8px;
        font-size: 12px;
        color: #434343;
        text-align: center;
        float: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:nth-child(3n-1)
          margin-left: 2%;
          margin-right: 2%;
    .loading
      padding-top: 15px
      font-size: 12px
      color: #999
    .match-wrapper
      position:absolute;
      z-index:2;
      top:43px;
      left:0;
      right:0;
      height:100%;
      background-color:#fff;
      font-size:14px;
      color:#434343;
      overflow:auto;
      -webkit-overflow-scrolling:touch
      .item
        margin:0 13px;
        height:39px;
        line-height:39px;
        border-bottom:1px solid #f5f5f5;
        text-align: left;
</style>
