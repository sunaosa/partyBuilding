<template>
	<view>
		<view class="head">
			<map style="width: 100%; height: 100%;"  :latitude="activityDetail.latitude" :longitude="activityDetail.longitude" :markers="covers"></map>
		</view>
		<view class="body">
			<view class="title-area clearfix">
				<text class="title-style">活动名称</text>
				<view class="time-infor">
					<text class="subTitle">活动名称</text>
					<text class="content">{{activityDetail.name}}</text>
				</view>
			</view>
			<view class="title-area clearfix">
				<text class="title-style">时间范围</text>
				<view class="time-infor">
					<text class="subTitle">活动时间</text>
					<text class="content">{{activityDetail.startTime + ' 至 ' + activityDetail.overTime}}</text>
				</view>
			</view>
			<view class="title-area clearfix">
				<text class="title-style">活动地点</text>
				<view class="time-infor">
					<text class="subTitle">具体地点</text>
					<text class="content">{{activityDetail.addressName}}</text>
				</view>
			</view>
			<view class="title-area clearfix">
				<text class="title-style">面向对象</text>
				<view class="time-infor">
					<text class="subTitle">参加人群</text>
					<text class="content">{{activityDetail.oop}}</text>
				</view>
			</view>
			<view class="title-area clearfix">
				<text class="title-style">活动详细介绍</text>
				<view class="time-infor">
					<view class="activityContent">
						<view style="overflow-wrap: break-word;" class="aContent">
							{{activityDetail.content}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="foot">
			<button 
				type="primary" 
				style="line-height: 100rpx; height: 100%;width: 50%;position: absolute; right: 0rpx;border-radius: 0rpx;"
				@click="handleClock"
				:disabled="disabled"
				>
				{{signIn}}
			</button>
		</view>
		<u-toast ref="uToast" />
		<view
			color="#ccc" 
			:style="{position: 'fixed', fontSize: '60rpx',fontWeight: 'bold'}" 
			class="handle-refresh activity" 
			@click="showClockInformation"
			v-if="isAdmin==='y'"> 
			<!-- <u-badge type="error" :count="problemCount" :offset="[-8,-8]" v-if="isAdmin === 'y'"></u-badge> -->
			<image src="../../static/clock.png" mode="" style="height: 100%; width: 100%;"></image>
		</view>
		<clock-information
			:activityId="activityId"
			:oop="activityDetail.oop"
			:name="activityDetail.name"
			@handleClose="handleClose"
			v-if="showClock"
		></clock-information>
	</view>
</template>

<script>
	import  QQMapWX from "../../components/map/qqmap-wx-jssdk.min.js"
	import clockInformation from "@/components/clockInformation.vue"
	export default {
		onLoad(options) {
			this.oop = options.oop
			this.activityId = options.id
			this.getActivityDetail()
			this.getIdentidy()
		},
		components:{
			clockInformation
		},
		data() {
			return {
				oop: "",
				signIn: "签到",
				latitude:null,
				isAdmin: '',
				longitude:null,
				covers: [{
					latitude: null,
					longitude: null,
					iconPath: '../../static/location.png',
					width: 20,
					height: 20
				}],
				activityId: null,
				activityDetail: {},
				disabled: false,
				identify: "",
				showClock: false
			}
		},
		methods: {
			async getActivityDetail() {
				let { data } = await this.$myRequest({
					url: "/activity/getDetailById",
					method: "post",
					data: {activityId: this.activityId }
				})
				this.activityDetail = data.activityList
				console.log(this.activityDetail.longitude)
				this.covers[0].latitude = data.activityList.latitude
				this.covers[0].longitude = data.activityList.longitude
				if(this.activityDetail.clock === true) {
					this.disabled = true
					this.signIn = "已签到"
				} else if(this.activityDetail.state === "未开始") {
					this.disabled = true
					this.signIn = "未开始"
				} else if (this.activityDetail.state === "已结束") {
					this.disabled = true
					this.signIn = "已结束"
				} else {
					this.disabled = false,
					this.signIn = "签到"
				}
				
			},
			handleClock() {
				let qqmapsdk = new QQMapWX({
					// 填写自己的Key值，这个值是与AppID绑定的
					key: 'QSMBZ-KX66F-GIOJ3-NEM5X-SVVC7-6LBLQ'
				});
				uni.authorize({
					// 获取用户定位信息
					scope: "scope.userLocation",
					// 用户同意授权执行
					success:()=>{
						// 引入腾讯地图api
						// 实例化API核心类
						//获取位置信息
						uni.getLocation({
							type: 'gcj02',
							success:  (res)=> {
								console.log('当前位置的经度：' + res.longitude)
								console.log('当前位置的纬度：' + res.latitude)
								this.latitude = res.latitude
								this.longitude = res.longitude	
								qqmapsdk.calculateDistance({
									mode: "straight",
									from: {
										latitude: this.activityDetail.latitude,
										longitude: this.activityDetail.longitude
									},
									to: [{
										latitude: res.latitude,
										longitude: res.longitude
									}],
									success:(ress, data)=>{
										if(this.oop ==="全部"||this.oop ===this.identify) {
											if(ress.result.elements[0].distance>parseFloat(this.activityDetail.admitDistance)){
												this.$refs.uToast.show({
													title: '超出打卡范围，请到指定位置参加活动打卡',
													type: 'error' 
												})
												console.log(ress.result.elements[0])
												console.log(data)
											} else {
												console.log("允许打卡") 
												this.clockActivity()
											}
										}else {
											this.$refs.uToast.show({
												title: '身份不符合要求',
												type: 'error' 
											})
										}
									}
								})
							}
						})
					},
					// 若用户不同意授权，弹框提示
					fail(res){
						uni.showToast({
							icon :"none",
							title: '注意：需要获取您的定位授权,否则部分功能将无法使用',
							duration: 2000
						})
					}
				})
			},
			async clockActivity() {
				let {data} = await this.$myRequest({
					url: '/activity/clock',
					data: {activityId: this.activityId},
					method: "post"
				})
				if(data ==="success") {
					this.$refs.uToast.show({
						title: '打卡成功',
						type: 'success' 
					})
					this.signIn = "已打卡"
					this.disabled = true
				} else {
					this.$refs.uToast.show({
						title: '活动已结束',
						type: 'error' 
					})
				}
			},
			async getIdentidy() {
				let { data } = await this.$myRequest({
					url: '/valicate/identity',
					method: 'post'
				})
				this.identify = data.response.identity
				this.isAdmin = data.response.isAdmin
				console.log(this.identify)
			},
			showClockInformation() {
				this.showClock = true
			},
			handleClose(show) {
				console.log(show)
				this.showClock = false
			}
		}
	}
</script>

<style>
page {
	background-color: #DBF1E1;
	overflow: auto;
}
.head {
	height: 400rpx;
	width: 100%;
	background-color: #eeeeee;
}
.body {
	border: 3rpx solid #d0d0d0;
	background-color: #fff;
	margin-bottom: 100rpx;
}
.foot {
	height: 100rpx;
	width: 100%;
	position: fixed;
	bottom: 0;
	background-color: #e3ff7c;
}

.title-area {
	padding-top: 50rpx;
	padding-bottom: 50rpx;
	width: 650rpx;
	margin: auto;
	border-top: 2rpx solid #CCCCCC;
}
.title-area:first-child{
	border-top: 0rpx;
}
.title-style {
	color: #000000;
	font-size: 35rpx;
	font-weight: bold;
}
.subTitle,
.content{
	float: left;
	margin-top: 20rpx;
	font-size: 25rpx;
	color: #555555;
}
.content {
	float: right;
	margin-right: 60rpx;
	font-weight: bold;
	width: 465rpx;
	overflow-wrap: break-word;
	text-align: right;
}
.clearfix:after{/*伪元素是行内元素 正常浏览器清除浮动方法*/
    content: "";
    display: block;
    height: 0;
    clear:both;
    visibility: hidden;
	
}
.activityContent {
	margin-top: 20rpx;
	font-size: 25rpx;
	color: #555555;
}
.handle-refresh {
	width: 80rpx;
	height: 80rpx;
	border: 1rpx solid #ccc;
	line-height: 80rpx;
	text-align: center;
	right: 10rpx;
	bottom: 200rpx;
	border-radius: 50rpx;
	background-color: #fff;
	box-shadow: 0 0 10rpx 2rpx #C0C0C0;
	z-index: 1000000;
}
</style>
