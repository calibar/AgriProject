<template>
    <div ref="smoothLineChart" style="width: 100%; height: 100%;"></div>
  </template>
  
  <script>
  import * as echarts from "echarts";
  
  export default {
    props: {
      seriesData: {
        type: Array,
        required: true
      },
      xAxisData: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        selectedSeries: ['水分', '水势']  // 初始状态选中“水分”和“水势”
      };
    },
    mounted() {
      this.initChart();
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$refs.smoothLineChart);
  
        const option = {
          tooltip: {
            trigger: 'axis'
          },

          legend: {
            data: this.seriesData.map(series => series.name),
            textStyle: { color: '#ffffff' },
            right: '10%',
            selected: {  // 初始化只选中"水分"和"水势"
              '水分': true,
              '水势': true,
              '温度': false,
              'PH': false,
              'EC': false
            }
          },
          xAxis: {
            type: 'category',
            data: this.xAxisData,
            axisLine: {
              lineStyle: {
                color: '#ffffff'
              }
            },
            axisLabel: {
              color: '#ffffff'
            },
            name: '时间 (小时)',
            nameTextStyle: {
              color: '#ffffff',
              padding: [10, 0, 0, 0]  // 控制名称与轴线之间的间距
            },
            nameLocation: 'center'  // 将名称放置在 x 轴的末端
          },
          yAxis: [
            {
              type: 'value',
              name: '水分 (左)',
              position: 'left',
              min: 0,
              max: 1,
              axisLine: {
                lineStyle: {
                  color: '#ffffff'
                }
              },
              axisLabel: {
                color: '#ffffff'
              },
              nameTextStyle: {
                color: '#ffffff'
              }
            },
            {
              type: 'value',
              name: '水势 (右)',
              position: 'right',
              min: 0,
              max: 1,
              axisLine: {
                lineStyle: {
                  color: '#ffffff'
                }
              },
              axisLabel: {
                color: '#ffffff'
              },
              nameTextStyle: {
                color: '#ffffff'
              }
            }
          ],
          series: this.seriesData.map((data) => ({
            ...data,
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 2
            },
            data: this.selectedSeries.includes(data.name) ? data.data : []  // 只显示初始选中的数据
          })),
          grid: {
  left: '0%',
  right: '0%',
  bottom: '10%',
  containLabel: true
}

        };
  
        this.chart.setOption(option);
  
        this.chart.on('legendselectchanged', (params) => {
          this.handleLegendSelect(params.name);
        });
      },
  
      handleLegendSelect(selectedName) {
        if (this.selectedSeries.includes(selectedName)) return;
  
        // 如果已经有两个选中项，移除第一个选中的项（先进先出）
        if (this.selectedSeries.length === 2) {
          const removedName = this.selectedSeries.shift();
          this.chart.dispatchAction({
            type: 'legendUnSelect',
            name: removedName
          });
        }
  
        // 添加新的选中项并更新Y轴和系列数据
        this.selectedSeries.push(selectedName);
        this.chart.dispatchAction({
          type: 'legendSelect',
          name: selectedName
        });
        this.updateYAxisAndSeries();
      },
  
      updateYAxisAndSeries() {
        const leftYAxis = { ...this.chart.getOption().yAxis[0] };
        const rightYAxis = { ...this.chart.getOption().yAxis[1] };
  
        const selectedSeriesLeft = this.seriesData.find(s => s.name === this.selectedSeries[0]);
        const selectedSeriesRight = this.seriesData.find(s => s.name === this.selectedSeries[1]);
  
        if (selectedSeriesLeft) {
          const leftValues = selectedSeriesLeft.data;
          leftYAxis.name = `${selectedSeriesLeft.name} (左)`;
          leftYAxis.min = Math.min(...leftValues);
          leftYAxis.max = Math.max(...leftValues);
        } else {
          leftYAxis.name = '';
        }
  
        if (selectedSeriesRight) {
          const rightValues = selectedSeriesRight.data;
          rightYAxis.name = `${selectedSeriesRight.name} (右)`;
          rightYAxis.min = Math.min(...rightValues);
          rightYAxis.max = Math.max(...rightValues);
        } else {
          rightYAxis.name = '';
        }
  
        // 更新 Y 轴和 series 数据
        this.chart.setOption({
          yAxis: [leftYAxis, rightYAxis],
          series: this.seriesData.map((data) => ({
            ...data,
            data: this.selectedSeries.includes(data.name) ? data.data : []
          }))
        });
      }
    }
  };
  </script>
  
  <style scoped>
  </style>
  