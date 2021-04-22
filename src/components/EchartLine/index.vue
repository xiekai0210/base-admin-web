<template>
  <div>
    <div :id="chartId" style="height: 100%; width: 100%;"></div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  export default {
    data() {
      return {
        options: {},
      }
    },

    props: {
      supThis: {
        type: Object,
        default: null
      },
      chartId: String,
      /**
       *  目录数据
       * {date:[], total:[]}
       */
      categoryData: Object,
      // 颜色方案 "blue","green"
      areaColor: String,
      // 单位描述
      unitText: String,
      // 单位
      unit: String,
      // 条例名称
      legendName: String,
    },
    // mounted() {
    //   this.init();
    // },
    // watch: {
    //   categoryData(val) {
    //     this.categoryData = val
    //     this.init();
    //   }
    // },
    methods: {
      init() {
        const category = this.categoryData || {};
        const xData = category.date || [];
        const yData = category.total || [];
        const _this = this
        if (xData.length === 0 || yData.length === 0) {
          return
        }
        // const yMaxValue = Math.max.apply(Math, yData.map(item => {
        //   return item
        // }))
        const blueOption = {
          color: '#4BA1F8',
          symbol: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAKFJREFUGBmNUEkOwjAQ8xSew7HXFB6BxEfgUr7EqeIBSD0h9cgb+EU72GlSVZFAWPJk4nGWGSDB3QPZke9E5SHX40qhJSeyxEihlcmYNFwf4wTcelj/imcRdsAxwDcVnMphy3AmjSbcn7NJMeV22sO4vVQMtQr5JuUZK62W8S/IOMipP5VYaYOa0QjUjP75tZl4Cc1XUqMosYxneY2OnwP/AOCqjUL7gugnAAAAAElFTkSuQmCC'
        };

        const greenOption = {
          color: '#05bfde',
          symbol: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAKFJREFUGBmNUEkOwjAQ8xSew7HXFB6BxEfgUr7EqeIBSD0h9cgb+EU72GlSVZFAWPJk4nGWGSDB3QPZke9E5SHX40qhJSeyxEihlcmYNFwf4wTcelj/imcRdsAxwDcVnMphy3AmjSbcn7NJMeV22sO4vVQMtQr5JuUZK62W8S/IOMipP5VYaYOa0QjUjP75tZl4Cc1XUqMosYxneY2OnwP/AOCqjUL7gugnAAAAAElFTkSuQmCC'
        };

        let colorOption = {};
        switch (this.areaColor) {
          case 'blue':
            colorOption = blueOption;
            break;
          case 'green':
            colorOption = greenOption;
            break;
          default:
            colorOption = blueOption;
            break;
        }

        function isDate1(v) {
          return new Date(v).getDate() === 1
        }

        function isWeek1(v) {
          return new Date(v).getDay() === 1
        }

        function isRestDay(val){
          const date = new Date(val).getDay()
          return (date === 0 || date === 6)
        }
        this.options = {
          tooltip: {
            trigger: "axis",
            confine: true,
            padding: [1, 2, 1, 1],
            axisPointer: {
              lineStyle: {
                color: "#C4C6CF",
                type: "dotted"
              },
              z: -10
            },
            textStyle: {
              fontSize: 16,
            },
            formatter: function(params) {
              let str = "",
                  yValue = '',
                  xValue = ''
              params.forEach(v => {
                const pattern = /(\d{4})(\d{2})(\d{2})/
                const formatedDate = v.axisValue.replace(pattern, '$1-$2-$3')
                xValue = formatedDate
                yValue = _this.formatMoney(v.value, '0')
                str +=
                  `<div style="pointer-events: all; padding: 5px 7px 5px 5px; text-alien: left; font-size: 16px;">
                    <span style="font-family: DINProM; display: inline-block; color: #FFFFFF; line-height: 20px;">${xValue}</span>
                    </br>
                    <span style="position: relative; display: inline-block; width: 8px; height: 8px; background-color:${v.color}; border-radius: 50%; margin: 0 5px 0px 0px;"></span>
                    <span style="font-family: DINProM; display: inline-block; color:#FFFFFF; ">${yValue}条</span>
                  </div>`
              })
              return str
            }
          },
          grid: {
            left: 5,
            right: 26,
            bottom: 10,
            top: 40,
            containLabel: true
          },
          toolbox: {
            show: false
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: xData,
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#C4C6CF'
              }
            },
            axisLabel: {
              interval: 0,
              color: function(value) {
                let dayss = '#333333'
                if (xData.length <= _this.$constant.DAYS_OF_MONTH) {
                  xData.forEach((item) => {
                    if (isRestDay(item)) {
                      let dateObj = new Date(item)
                      let curVal = ''
                      let valDateObj = new Date(value)
                      curVal = valDateObj.getDate()
                      if (parseInt(curVal) === dateObj.getDate()) {
                        dayss = '#FE9857'
                        return false
                      }
                    }
                  });
                }
                return dayss
              },
              fontSize: 16,
              fontFamily: 'DINProM',
              showMaxLabel: true,
              formatter: function(value) {
                if (xData.length <= _this.$constant.DAYS_OF_MONTH) {
                  // 不超过1个月 显示所有日期
                  return value.substring(8, 10);
                } else if (_this.$constant.DAYS_OF_MONTH < xData.length && xData.length <= _this.$constant.DAYS_OF_MONTH * 3) {
                  // 超过1个月小于3个月 显示每周一的日期
                  return isWeek1(value) ? value.substring(5, 10) : ''
                } else if (_this.$constant.DAYS_OF_MONTH * 3 < xData.length) {
                  //超过3个月 显示每月1号的日期
                  return isDate1(value) ? value.substring(5, 10) : ''
                }
              },
            }
          },
          yAxis: {
            type: 'value',
            // max: yMaxValue,
            mix: 0,
            name: "单位 : 条",
            splitNumber: 6,
            nameTextStyle: {
              padding: [0, 0, 10, 0],
              fontSize: 16,
              color: '#3C3C3C',
              fontFamily: 'AlibabaPuHuiTiR',
            },
            splitLine: {
              lineStyle: {
                color: ['#EBECF0']
              }
            },
            axisLine: {
              show: false
            },
            axisTick: false,
            axisLabel: {
              color: '#333333',
              fontSize: 16,
              fontFamily: 'DINProM',
            }
          },
          series: [{
            name: '评分',
            symbol: colorOption.symbol,
            symbolSize: 10,
            itemStyle: {
              color: colorOption.color,
              width: 2,
              fontFamily: 'DINProM',
            },
            label: {
              normal: {
                // show: xData.length <= _this.$constant.DAYS_OF_MONTH ? true : false,
                show: false,
                formatter: function(params) {
                  let stringNum = String(params.data)
                  if (isRestDay(xData[Number(params.dataIndex)])) {
                    if (stringNum.length <= 6) {
                      return '{colorRestDay|' + stringNum.substring(0, 3) + '\n' + stringNum.substring(3, stringNum.length) + '}';
                    } else if (stringNum.length >= 6) {
                      return '{colorRestDay|' + stringNum.substring(0, 4) + '\n' + stringNum.substring(4, stringNum.length) + '}';
                    }
                  } else {
                    if (stringNum.length <= 6) {
                      return '{colorNormalDay|' + stringNum.substring(0, 3) + '\n' + stringNum.substring(3, stringNum.length) + '}';
                    } else if (stringNum.length >= 6) {
                      return '{colorNormalDay|' + stringNum.substring(0, 4) + '\n' + stringNum.substring(4, stringNum.length) + '}';
                    }
                  }
                },
                rich: {
                  colorRestDay: {
                    color: '#FE9857',
                    fontSize: 11,
                    fontFamily: 'DINProM',
                  },
                  colorNormalDay: {
                    color: '#333333',
                    fontSize: 11,
                    fontFamily: 'DINProM',
                  }
                }
              }
            },
            data: yData,
            type: 'line',
            smooth: true
          }]
        };
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById(this.chartId));
        myChart.off('click')
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(this.options);

        myChart.on('click', function(params) {
          _this.$emit('EChartLineClick', params)
        });

        window.addEventListener('resize', function() {
          myChart.resize()
        })
        window.addEventListener('resizeCusEvent', function() {
          myChart.resize()
        })
      },
      formatMoney(num, type) {
        var s = num
        if (/[^0-9.]/.test(s))
            return "0"
        if (s == null || s == "")
            return "0"
        s = s.toString().replace(/^(\d*)$/, "$1.")
        s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1")
        s = s.replace(".", ",")
        var re = /(\d)(\d{3},)/
        while (re.test(s))
            s = s.replace(re, "$1,$2")
        s = s.replace(/,(\d\d)$/, ".$1")
        if (type == 0) {// 不带小数位(默认是有小数位)
            var a = s.split(".")
            if (a[1] == "00") {
                s = a[0]
            }
        }
        return s
      }
    }
  }
</script>
