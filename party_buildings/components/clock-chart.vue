<template>
	<view class="charts-box">
	  <qiun-data-charts
	    type="pie"
	    :chartData="chartData"
	    background="none"
	  />
	</view>
</template>

<script>
	export default {
		name: 'clock-chart',
		props: {
			clockData: Array
		},
		watch: {
			clockData(val){
				this.chartData.series[0].data = val
			}
		},
		data() {
			return {
				//clockData1: this.clockData,
				chartData:{
				  categories:[],
				  series:[{ 
					data: []
				  }],
				},
			};
		}
	}
</script>

<style>
/* 请根据需求修改图表容器尺寸，如果父容器没有高度图表则会显示异常 */
.charts-box{
  width: 100%;
  height:300px;
}
</style>
