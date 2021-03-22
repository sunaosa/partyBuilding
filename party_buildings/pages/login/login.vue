<template>
	<view class="content">
		<view class="bg">
			<image src="../../static/login_bgc.png" class="background"></image>
		</view>
		<view class="login">
			<view class="text">
				<input type="text" v-model="users.username" placeholder="用户名"/>
			</view>
			<view class="text">
				<input :type="ifHide? type_password  : type_text" v-model="users.password" placeholder="密码"/>
				<view class="bgc" @click="hidePassward" v-show="ifHide">
					<image src="../../static/hide.png" ></image>
				</view>
				<view class="bgc" @click="hidePassward" v-show="!ifHide">
					<image src="../../static/notHide.png" ></image>
				</view>
			</view>
			<view class="login_btn" @click="login">
				
				登录
			</view>
			<view class="register_btn" @click="register">
				新用户，注册！
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			
			uni.hideHomeButton()
		},
		data() {
			return {
				users:{
					username: "",
					password: ""
				},
				hideOrNo: "",
				type_password: "password",
				type_text: "text",
				ifHide: true,
				
			}
		},
		
		methods: {
			hidePassward() {
				console.log(1)
				this.ifHide = !this.ifHide	
			},
			async login() {
				if(this.users.username==="") {
					uni.showToast({
						title:'请输入账号',
						image:"/static/error.png"
					})
					console.log(this.users.username)
				}
				else if(this.users.password==="") {
					uni.showToast({
						title:'请输入密码',
						image:"/static/error.png"
					})
				}
				else {
					console.log(this.users.username+"密码"+this.users.password)
					var result = await this.$myRequest({
						url:'/users/login',
						method: "post",
						data: this.users,
					})
					console.log(result.data);
					if(result.data === "密码错误") {
						uni.showModal({
							title: "密码错误",
							content: "密码错误请重新确认后登录",
							showCancel:false
						})
					} else if(result.data === "账号不存在"){
						uni.showModal({
							title: "账号不存在",
							content: "请确定账号重新登陆",
							showCancel:false
						})
					}
					else {
						console.log(result.data)
						uni.setStorageSync("idVerification",result.data)
						uni.switchTab({
							url:"../index/index"
						})
					}
				}				
			},
			register() {
				uni.navigateTo({
					url:"../register/register"
					
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		margin: 0;
		padding: 0;
		position: absolute;
	}
	.content {
		height: 100%;
		width: 100%;
		.bg {
			height: 100%;
			width: 100%;
			position: absolute;
			overflow: hidden;
			z-index: -9999;
			.background {
				height: 100%;
				width: 100%;
				position: absolute;
				bottom: 0;
			}
		}
		.login {
			width: 600rpx;
			height: 500rpx;
			margin-top: 400rpx;
			margin-left: 50%;
			left: -300rpx;
			position: absolute;
			z-index: 1;
			background-color: rgba($color: #fff, $alpha: 0.5);
			.text {
				position: relative;
				height: 80rpx;
				width: 500rpx;
				margin: auto;
				margin-top: 65rpx;
				border-radius: 30rpx;
				background-color: #FFFFFF;
				input[type="text"],
				input[type="password"] {
					height: 100%;
					width: 75%;
					margin-left: 30rpx;
				}
				.bgc{
					position: absolute;
					height: 25px;
					width: 25px;
					top: 20rpx;
					right: 30rpx;
					background-color: #fff;
					z-index: 100000;
					image {	
						width: 100%;
						height: 100%;
						
					}
				}
				
			}
			
			.text:first-child {
				margin-top: 80rpx;
			}
			 
			.login_btn {
				width: 300rpx;
				height: 100rpx;
				margin-top: 40rpx;
				margin-left: 350rpx;
				font-weight: 600;
				font-size: 60rpx;
				position: relative;
				z-index: 1;
			}
			.register_btn {
				height: 100rpx;
				color: #888 ;
				line-height: 100rpx;
				font-size: 28rpx;
				font-weight: normal;
				position: absolute;
				left: 50rpx;
				bottom: 6rpx;
				z-index: 1000;
			}
		}
	} 
</style>
