<template>
  <div class="echarts" ref="echart"></div>
</template>

<script type="es6">
  import Echarts from 'echarts/lib/echarts'
  import Line from 'echarts/lib/chart/line'
  export default {
    props: {
      list: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: '7天温度趋势图'
      },
      xAxis: {
        type: Boolean,
        default: false
      },
      yAxis: {
        type: Boolean,
        default: false
      },
      chartType: {
        type: String,
        default: 'line'
      },
      smooth: {
        type: Boolean,
        default: true
      },
      symbol: {
        type: String,
        default: 'circle'
      },
      symbolSize: {
        type: Number,
        default: 10
      },
    },
    data(){
      return {
        xAxisData: [],
        grid: {
          x: 0,
          y: 35,
          width: '100%',
          height: '50%',
        }
      }
    },
    watch: {
      list(){
        this._initEcharts()
      }
    },
    mounted(){
      this._initEcharts()
    },
    methods: {
      _initEcharts(){
        if(!this.list.length) {
          return
        }
        let myChart = Echarts.init(this.$refs.echart)
        let option = {
          title: {
            text: this.title
          },
          grid: this.grid,
          xAxis: {
            show: this.xAxis,
            data: this.xAxisData
          },
          yAxis: {
            show: this.yAxis,
          },
          series:this.formatSeries()
        }
        myChart.setOption(option)
      },
      formatSeries(){
        let maxObj = this.itemData('#ffb74d', 'top')
        let minObj = this.itemData('#4fc3f7', 'bottom')

        this.list.forEach((item) => {
          maxObj.data.push(item.tmp_max)
          minObj.data.push(item.tmp_min)
          this.xAxisData.push(item.date_name)
        })
        return [maxObj, minObj]
      },
      itemData(color, position){
        return {
          type: this.chartType,
          smooth: this.smooth,
          symbol: this.symbol,
          symbolSize: this.symbolSize,
          itemStyle: {
            normal: {
              color: color,
              label: {
                show: true,
                position: position,
                formatter: (item)=>{
                  return item.data+'°'
                }
              }
            }
          },
          data: []
        }
      }
    }
  }
</script>
<style scoped lang="stylus" type="text/stylus">
  .echarts
    width: 100%
    height: 100%
</style>
