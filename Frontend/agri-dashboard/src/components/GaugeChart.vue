<template>
  <div ref="gaugeChart" class="gauge-chart"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const chart = echarts.init(this.$refs.gaugeChart);
      const option = {
        series: [
          {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 10,
            splitNumber: 5,
            pointer: {
              show: false
            },
            progress: {
              show: true,
              width: 10
            },
            axisLine: {
              lineStyle: {
                width: 10
              }
            },
            axisTick: {
              distance: -15,
              length: 5,
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            splitLine: {
              distance: -15,
              length: 10,
              lineStyle: {
                color: '#fff',
                width: 3
              }
            },
            axisLabel: {
              distance: 20,
              color: '#fff',
              fontSize: 10
            },
            data: [
              {
                value: this.value,
                name: 'PH',
                title: {
                  offsetCenter: [0, '40%']
                },
                detail: {
                  valueAnimation: true,
                  offsetCenter: [0, '60%']
                }
              }
            ],
            title: {
              fontSize: 14
            },
            detail: {
              width: 50,
              height: 14,
              fontSize: 14,
              color: '#fff',
              borderColor: '#fff',
              borderWidth: 1,
              formatter: '{value}'
            }
          }
        ]
      };
      chart.setOption(option);
    }
  }
};
</script>

<style scoped>
.gauge-chart {
  width: 80px; /* 统一宽度 */
  height: 80px; /* 统一高度 */
}
</style>
