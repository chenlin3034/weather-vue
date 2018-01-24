<template>
  <div ref="scroll" class="my-scroll">
    <slot></slot>
  </div>
</template>

<script type="es6">
  import BScroll from 'better-scroll'
  export default {
    props: {
      data: {
        type: Array,
        default: null
      },
      scrollX: {
        type: Boolean,
        default: true
      },
      scrollY: {
        type: Boolean,
        default: false
      },
      eventPassthrough: {
        type: String,
        default: 'vertical'
      }
    },
    watch:{
      data(){
        setTimeout(()=>{
          this.refresh()
        }, 20)
      }
    },
    methods: {
      _initScroll(){
        if(!this.$refs.scroll){
          return;
        }
        let scrollWidth = this.$refs.scroll.offsetWidth
        let offsetWidth = this.data.length*80
        if(offsetWidth > scrollWidth){
          this.$refs.scroll.children[0].style.width = `${offsetWidth}px`
        }
        this.$emit('initChart')
        this.scroll = new BScroll(this.$refs.scroll,{
          scrollX: this.scrollX,
          scrollY: this.scrollY,
          eventPassthrough: this.eventPassthrough
        })
      },
      refresh(){
        this.scroll && this.scroll.refresh()
        this.$emit('initChart')
      }
    },
    mounted(){
      setTimeout(()=>{
        this._initScroll()
      }, 20)
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
</style>
