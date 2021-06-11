<template>
	<view class="content" >
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
			<view class="all-valivate">
				<view class="valicate">
					<input type="text" v-model="users.valicateCode" placeholder="验证码"/>
				</view>
				<image :src="imgCode"  @click='changeImgCode'></image>
			</view>
			
			<view class="login_btn" @click="login">
				
				登录
			</view>
			<view class="register_btn" @click="register">
				新用户，注册！
			</view>
		</view>
		<u-toast ref="uToast" />
		<u-tag 
			text="忘记密码?"
			type="info"
			style="position: absolute; bottom: 20rpx;right: 50rpx;" 
			shape="circleLeft"
			@click="handleForgetPassword"
		/>
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
					password: "",
					valicateCode: ''
				},
				hideOrNo: "",
				type_password: "password",
				type_text: "text",
				ifHide: true,
				imgCode: 'http://192.168.137.1:3000/users/images'
			}
		},
		
		methods: {
			hidePassward() {
				this.ifHide = !this.ifHide	
			},
			async login() {
				if(this.users.username==="") {
					uni.showToast({
						title:'请输入账号',
						image:"/static/error.png"
					})
				}
				else if(this.users.password==="") {
					uni.showToast({
						title:'请输入密码',
						image:"/static/error.png"
					})
				}
				else {
					var result = await this.$myRequest({
						url:'/users/login',
						method: "post",
						data: this.users,
					})
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
						if(result.data === '验证码错误'){
							this.$refs.uToast.show({
								title: '验证码错误区分大小写',
								type: 'error',
							})
						}
						else{
							uni.setStorageSync("myToken",result.data.token)
							uni.switchTab({
								url:"../index/index"
							})
						}
						
					}
				}				
			},
			register() {
				uni.navigateTo({
					url:"../register/register"
				})
			},
			changeImgCode() {
				this.imgCode = 'http://192.168.137.1:3000/users/images?' + Math.ceil(Math.random()*10)
			},
			handleForgetPassword() {
				uni.navigateTo({
					url:"../forgetPassword/forgetPassword"
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
		background-image:url(https://www.yik.ink/sockets/union/uploadFile/607eec0092bea.png);
		background-size: 100% 100%;
	}
	.content {
		height: 100%;
		width: 100%;
		
		.login {
			width: 600rpx;
			height: 600rpx;
			margin-top: 200rpx;
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
	 .valicate {
		 display: inline-block;
		 width: 200rpx;
		 // position: absolute;
		 margin-left: 50rpx;
		 height: 80rpx;
		 margin-top: 65rpx;
		 border-radius: 30rpx;
		 background-color: #FFFFFF;
		 input[type="text"] {
		 	height: 100%;
		 	width: 75%;
		 	margin-left: 30rpx;
		 }
	 }
	 image {
		 display: inline-block;
		 margin-left: 20rpx;
		 right: 0rpx;
		 // margin-right: 50rpx;
		 height: 80rpx;
		 width: 200rpx;
	 }
	 .all-valivate {
		 position: relative;
	 }
</style>
