<template>
  <div class="loading" :class="timeName">
    <svg version="1.1" class="svg clear-sky-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 72.3 52.6" style="enable-background:new 0 0 72.3 52.6;" xml:space="preserve">
      <g>
        <path class="sun" d="M50.8,25.7c0,7.9-6.4,14.4-14.4,14.4s-14.4-6.4-14.4-14.4s6.4-14.4,14.4-14.4S50.8,17.8,50.8,25.7z"/>
        <path  class="line line-1" d="M54.5,25.8h6"/>
        <path class="line line-2" d="M12.4,25.8h6"/>
        <path class="line line-3" d="M36.5,44.3v6"/>
        <path class="line line-4" d="M36.5,8.2v-6"/>
        <path class="line line-5" d="M23,38.8l-4.8,4.8"/>
        <path class="line line-6" d="M54.9,8.9L50,13.8"/>
        <path class="line line-7" d="M50,38.8l4.4,4.4"/>
        <path class="line line-8" d="M18.8,9.6l4.2,4.2"/>
      </g>
    </svg>
    <svg class="svg moon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-805 -450 400 400" style="enable-background:new -825 -450 400 400;" xml:space="preserve">
      <g id="moon">
        <defs>
          <mask id="mask-moon">
            <circle r="100" cx="-600" cy="-250" fill="white" />
            <circle r="100" cx="-550" cy="-290" fill="black" />
          </mask>
        </defs>
        <circle r="100" cx="-600" cy="-250" fill="yellow" mask="url(#mask-moon)"  />
      </g>
    </svg>
  </div>
</template>

<script type="es6">
  export default {
    data(){
      return {
        timeName: 'day'
      }
    },
    mounted() {
      let now = new Date()
      const hours = now.getHours()
      if( hours >= 6 && hours < 18){
        this.timeName = 'day'
      } else {
        this.timeName = 'night'
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  @-webkit-keyframes fadeIn
    0% {
      opacity: 0
    }
    100% {
      opacity: 1
    }
  @keyframes fadeIn
    0% {
      opacity: 0
    }
    100% {
      opacity: 1
    }
  @-webkit-keyframes dash
    to {
      stroke-dashoffset: 0
    }
  @keyframes dash
    to {
      stroke-dashoffset: 0
    }
  .loading
    position fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    text-align: center
    z-index: 99999
    &.day
      background: linear-gradient(top,rgb(0,123,187),rgb(255,255,255))
      background: -webkit-linear-gradient(top,rgb(0,123,187),rgb(255,255,255))
      .moon
        display: none
    &.night
      background: linear-gradient(top,rgb(0,2,1),rgb(50,55,116))
      background: -webkit-linear-gradient(top,rgb(0,2,1),rgb(50,55,116))
      .clear-sky-svg
        display: none
    .svg
      position: absolute
      left: 50%
      top: 50%
      margin-left: -150px
      margin-top: -250px
    .moon
      width 300px
      height 300px
    .line
      stroke-miterlimit: 10
      stroke-width: 2
      stroke-linecap: round
      fill: none
    .clear-sky-svg
      width 300px
      height 300px
      -webkit-animation: expand 0.8s alternate-reverse infinite
      animation: expand 0.8s alternate-reverse infinite
      .sun
        fill: rgb(241,141,0)
      .line
        stroke: rgb(241,141,0)
        stroke-dasharray: 7
        -webkit-animation: dash 0.8s alternate-reverse infinite, fadeIn 1s forwards
        animation: dash 0.8s alternate-reverse infinite, fadeIn 1s forwards
      .line-1,.line-3,.line-5,.line-7,.line-4
        stroke-dashoffset: 5
        -webkit-animation-delay: 0.3s
        animation-delay: 0.3s
      .line-2,.line-6,.line-8
        stroke-dashoffset: -5
</style>
