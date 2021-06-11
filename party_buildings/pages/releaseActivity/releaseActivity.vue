<template>
	<view class="card">
		<u-form :model="activity" ref="activity" :label-width="180">
			<u-form-item label="活动名称" prop="name">
				<u-input v-model="activity.name" :border="true"/>
			</u-form-item>
			<u-form-item label="面向对象" prop="oop">
				<u-input v-model="activity.oop" :border="true" type="select" @click="showPersonList = true"/>
				<u-action-sheet :list="personList" v-model="showPersonList" @click="handlePersonList"></u-action-sheet>
			</u-form-item>
			<u-form-item label="活动时间">
				<view class="startTime">
					<u-input v-model="activity.activeTime.startTime" :border="true" placeholder="开始时间" disabled @click="isStartShow = true"/>
					<u-picker 
						mode="time" 
						v-model="isStartShow" 
						:params="timeParams" 
						@cancel="isStartShow = false" 
						@confirm="getStartTime"
					></u-picker>
				</view>
				<view style="text-align: center;">
					至
				</view>
				<view class="endTime">
					<u-input v-model="activity.activeTime.overTime" :border="true" placeholder="结束时间" disabled @click="isEndShow = true"/>
					<u-picker 
						mode="time" 
						v-model="isEndShow" 
						:params="timeParams" 
						@cancel="isEndShow = false"
						@confirm="getEndTime"
					></u-picker>
				</view>
			</u-form-item>
			<u-form-item label="活动地点" prop="addressName">
				<u-input v-model="activity.addressName" disabled :border="true" @click="handlePoint" placeholder="请选择活动地点"/>
				<view style="margin-top: 30rpx">
				</view>
				<u-input v-model="detailAddress" :border="true" placeholder="活动详细地点(可为空)"/>
			</u-form-item>
			<u-form-item label="打卡距离/m" prop="admitDistance">
				<u-input v-model="activity.admitDiatance" :border="true" type="select" placeholder="最远打卡距离,单位/m" @click="showDistanceList=true"/>
				<u-action-sheet :list="distanceList" v-model="showDistanceList" @click="handleDistance"></u-action-sheet>
			</u-form-item>
			
			<u-form-item label="活动内容" prop="content">
				<u-input v-model="activity.content" :border="true" type="textarea" placeholder="请输入活动内容(具体人员请详细说明)"/>
			</u-form-item>
			<view style="text-align: center; margin-top: 30rpx;">
				<u-button type="primary" shape="circle" size="medium" :disabled="disabled" @click="handleReleaseActivity">发布</u-button>
			</view>
		</u-form>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import  QQMapWX from "../../components/map/qqmap-wx-jssdk.min.js"
	export default {
		onLoad() {
			this.getCity()
		},
		onReady() {
			this.$refs.activity.setRules(this.rules);
		},
		computed:{
			disabled() {
				if(this.activity.activeTime.startTime===''||this.activity.activeTime.overTime===""||this.activity.addressName=="") {
					return true
				} else {
					return false
				}
			}
		},
		data() {
			return {
				detailAddress: "",
				activity: {
					activeTime: {
						startTime: "",
						overTime: ""
					},
					admitDiatance: "150",
					name: '',
					oop: '全部',
					content: '',
					addressName: "",
					latitude: null,
					longitude: null,
				},
				personList: [
					{
						text: '党员'
					},
					{
						text: '入党申请人'
					},
					{
						text: "全部"
					}
				],
				timeParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true
				},
				id:0, // 使用 marker点击事件 需要填写id
				title: 'map',
				latitude: null,
				longitude: null,
				showPersonList: false,
				isStartShow: false,
				isEndShow: false,
				distanceList: [
					{
						text: '100'
					},
					{
						text: '150'
					},
					{
						text: '200'
					},
					{
						text: '300'
					},
					{
						text: '500'
					}
				],
				showDistanceList: false,
				rules: {
					name: [
						{ 
							required: true, 
							message: '请输入活动名称', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['blur']
						}
					],
					content: [
						{ 
							required: true, 
							message: '请输入活动描述', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['blur']
						}
					]
				}
			}
		},
		methods: {
			getCity() {
				uni.authorize({
							// 获取用户定位信息
					scope: "scope.userLocation",
					// 用户同意授权执行
					success:()=>{
						// 引入腾讯地图api
						// 实例化API核心类
						let qqmapsdk = new QQMapWX({
							// 填写自己的Key值，这个值是与AppID绑定的
							key: 'QSMBZ-KX66F-GIOJ3-NEM5X-SVVC7-6LBLQ'
						});
						//获取位置信息
						uni.getLocation({
							type: 'gcj02',
							success:  (res)=> {
								console.log('当前位置的经度：' + res.longitude)
								console.log('当前位置的纬度：' + res.latitude)
								this.latitude = res.latitude
								this.longitude = res.longitude	
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
			handlePoint() {
				uni.chooseLocation({
					type: 'gcj02',
					success: (res) => {
						this.activity.addressName = res.name
						this.activity.latitude = res.latitude
						this.activity.longitude = res.longitude
					}
				})
			},
			handlePersonList(index) {
				this.activity.oop = this.personList[index].text
			},
			getStartTime(res) {
				this.activity.activeTime.startTime = res.year + "-" + res.month + "-" + res.day + " " + res.hour + ":" + res.minute
			},
			getEndTime(res) {
				this.activity.activeTime.overTime = res.year + "-" + res.month + "-" + res.day + " " + res.hour + ":" + res.minute
			},
			handleDistance(index) {
				this.activity.admitDiatance = this.distanceList[index].text
			},
			handleReleaseActivity() {
				this.$refs.activity.validate(valid => { 
					if (valid) {
						this.activity.addressName = this.activity.addressName+this.detailAddress
						this.$myRequest({
							url: "/activity/release",
							data: {activity: this.activity},
							method: "post"
						}).then(res=>{
							console.log(res)
							if(res.data === "success") {
								this.$refs.uToast.show({
									title: '发布成功，活动详情，请到活动页面查看',
									type: 'success'
								})
								this.activity = {
									activeTime: {
										startTime: "",
										overTime: ""
									},
									admitDiatance: "150",
									name: '',
									oop: '全部',
									content: '',
									addressName: "",
									latitude: null,
									longitude: null,
								}
								this.detailAddress = ""
							}
						})
					} else {
						return
					}
				});
			}
		}
	}
</script>

<style>
page {
	width: 100%;
	height: 100%;
	background-color: #DBF1E1;
}
.address-btn {
	position: absolute;
	top: 0rpx;
	right: -100rpx;
}
.card {
	height: 100%;
	width: 640rpx;
	margin: auto;
	box-shadow: 0 0 10rpx 2rpx #C0C0C0;
	padding: 0 30rpx;
	background-color: #f8f8fa;
}

</style>
