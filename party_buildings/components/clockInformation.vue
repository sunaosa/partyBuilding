<template>
	<view style="overflow: hidden;">
		<u-popup v-model="showToast" mode="center" width="650rpx" height="360px" border-radius="14" @close="closePop" style="position: relative; overflow: hidden;">
			<!-- <u-cell-group>
				<u-cell-item
					title="打卡名单" 
					:title-style="{'fontSize': '50rpx','fontWeight':'600','color':'#969696','textAlign': 'center'}" 
					:arrow="false" 
				>
				</u-cell-item>
			</u-cell-group> -->
			<view class="form-title">
				<text :style="{'fontSize': '50rpx','fontWeight':'600','color':'#969696','textAlign': 'center'}">{{clockName}}</text>
				<view class="switch">
					<u-switch v-model="ifClock" @change="handleChange"></u-switch>
				</view>
			</view>
			<view class="changeForm">
				<scroll-view class="table" scroll-y>
					<wyb-table ref="table" :headers="headers" width="700rpx" :contents="contents" :url-col="urlCol" />
				</scroll-view>
				<view class="operate-button">
					<u-button size="medium" type="primary" :loading="loading" @click="outputClock">导出数据</u-button>
					<u-button size="medium"   style="margin-left: 20rpx;"  @click="closePop">关闭</u-button>
				</view>
			</view>
			
		</u-popup>
	</view>
</template>

<script>
	import wybTable from '@/components/wyb-table/wyb-table.vue'
	export default{
		mounted() {
			console.log(111)
			this.showToast = true
			this.getClockInformation(this.ifClock)
		},
		components: {
		    wybTable
		},
		props:{
			activityId:{
				type: Number,
				default: null
			},
			oop: {
				type: String,
				default: ""
			},
			name: {
				type: String,
				default: ""
			}
		},
		data() {
			return{
				clockName: "打卡名单",
				showToast: false,
				ifClock: false,
				headers: [{
					label: '姓名',
					key: 'name',
					width: 180
				}, {
					label: '学号',
					key: 'studentNumber',
					width: 300
				}, {
					label: '是否打卡',
					key: 'ifClock',
					width: 170
				}],
				contents: [],
				loading: false
			}
		},
		methods:{
			closePop() {
				this.showToast = false
				console.log(this.activityId)
				this.$emit("handleClose", this.showToast)
			},
			handleChange(status) {
				if(status === true) {
					this.clockName="未打卡名单"
					this.getClockInformation(status)
				} else {
					this.clockName="打卡名单"
					this.getClockInformation(status)
				}
			},
			async getClockInformation(status) {
				let { data } = await this.$myRequest({
					url: "/activity/getClock",
					data: {activityId: this.activityId, status: status, oop: this.oop},
					method: "post"
				})
				this.contents = data
			},
			async outputClock() {
				this.loading = true
				let {data} = await this.$myRequest({
					url: "/activity/output",
					method: "post",
					data: {activityId: this.activityId, oop: this.oop}
				})
				uniCloud.callFunction({
				    name: 'excel', 
				    data: {userdata: data, name: this.name},
				    success:(res)=>{
						uni.downloadFile({
							url: res.result.fileID,      //文件链接
							success:(ress)=>{
								uni.openDocument({
									filePath: ress.tempFilePath,
									showMenu: true,
									success:(resss)=>{
										this.loading = false
										console.log("success")
									},
									fail:(err)=>{
										console.log(err)
									}
								})
							}
						})
						console.log(res)
					},
				    fail(err){
						console.log(err)
					},
				    complete(){}
				});
			}
		}
	}
</script>

<style>
	.form-title {
		padding-top: 20rpx;
		width: 100%;
		margin: 0rpx 200rpx 10rpx 50rpx;
		position: relative;
	}
	.switch {
		position: absolute;
		right: 90rpx;
		bottom: 0rpx;
	}
	.changeForm {
		width: 100%;
		height: 270rpx;
	}
	.operate-button {
		position: absolute;
		right: 100rpx;
		bottom: 20rpx;
	}
	.location {
		margin-left: 60rpx;
	}
	.table {
		height: 450rpx;
		/* overflow-x: hidden;
		overflow-y: auto; */
	}
	
</style>
