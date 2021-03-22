<template>
	<view>
		<view class="information" @click="changeInfor">
			<view class="profile">
				<u-avatar :src="profile"></u-avatar>
			</view>
			<view class="name">
				{{name}}
			</view>
			<view class="identify">
				{{identify}}
			</view>
			<view class="users" v-show="YorN">
				<image src="../../static/administer.png" mode=""></image>
			</view>
			<view class="users" v-show="!YorN">
				<image src="../../static/user.png" mode=""></image>
			</view>
		</view>
		<view class="operation">
			<view>
				<u-popup  v-model="show" mode="left" border-radius="14" width="500rpx">
					<view class="content">
						<administer>
							
						</administer>
					</view>
				</u-popup>
				<u-button @click="showModel" type="default">管理员操作</u-button>
			</view>
		</view>
		<u-tabbar v-model="current" :list="list" :mid-button="true" ></u-tabbar>
	</view>
</template>

<script>
	import administer from "../../conmonents/administer.vue"
	export default {
		async onLoad() {
			this.list = this.$store.state.list
			var autoLoginId = uni.getStorageSync("idVerification")
			var personalInfor = await this.$myRequest({
				url:"/users/myInformation",
				method: "post", 
				data: {autoLoginId:autoLoginId}
			})
			console.log(personalInfor)
			this.name = personalInfor.data.name
			this.profile = personalInfor.data.profilePhotos
			this.identify = personalInfor.data.identify
			if(this.name == null||this.name == "") {
				this.name = "未实名"
			} 
			if(this.profile == "") {
				this.profile = "../../static/default.png"
			}
			if (personalInfor.data.YorN == "y") {
				this.YorN = true
			} else {
				this.YorN = false
			}
			
		},
		data() {
			return {
				name: "",
				profile: "",
				identify: "游客",
				YorN: false,
				show: false,
				list: [],
				current: 2
			}
		},
		components:{
			administer: administer
		},
		methods: {
			showModel() {
				console.log(this.YorN)
				console.log(this.show)
				if (this.YorN == true) {
					this.show = true
				}else{
					this.show = false
					uni.showToast({
						title: "没有管理员权限"
					})
				}
			},
			changeInfor() {
				uni.navigateTo({
					url: "../individual_infor/individual_infor"
				})
			}
		}
	}
</script>

<style lang="scss"> 
	page {
		overflow: hidden;
		background-color: #C8C7CC;
		.information {
			height: 250rpx;
			width: 750rpx;
			background-color: #f4030a;
			.profile  u-avatar{
				height: 100rpx;
				width: 100rpx;
				float: left;
				margin-top: 50rpx;
				margin-left: 50rpx;
			}
			.name {
				float: left;
				margin-top: 50rpx;
				margin-left: 20rpx;
				font-size: 40rpx;
				font-weight: 600;
			}
			.identify {
				position: absolute;
				margin-top: 70rpx;
				margin-left: 40rpx;
				font-size: 28rpx;
				font-weight: 700;
				color: #ccc;
				top: 30rpx;
				left: 131rpx;
			}
			.users image{
				float: left;
				margin-top: 57rpx;
				margin-left: 30rpx;
				height: 40rpx;
				width: 50rpx;
			}
		}
		.operation {
			background-color: #F8F8F8;
			height: 1000rpx;
			overflow: auto;
			.border {
				height: 100rpx;
				width: 600rpx;
				margin: 10rpx auto;
				background-color: #fff;
				border-radius: 50rpx;
				line-height: 100rpx;
				overflow: hidden;
				button {
					float: left;
					width: 300rpx;
					height: 100rpx;
					background-color: #4CD964;
					color: #fff;
				}
			}
			.line {
				width: 700rpx;
				border: 1rpx solid #ccc;
				height: 0rpx;
				margin: 5rpx auto;
			}
			
			.content { 
				width: 100%;
				height: 100%;
				background-color: #fa3534;
			}
			u-button {
				position: absolute;
				bottom: 150rpx;
				width: 100%;
			}
		}
	}
</style>
