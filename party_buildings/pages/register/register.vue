<template>
		<view class="container">
			<view class="title">
				新用户注册
			</view>
			<view class="line">
			</view>
			<view class="register">
				<view class="text">
					<view class="show" v-show="ifShow_user">
						用户名(学号)
					</view>
					<view class="uername" >
						<input type="text" v-model="newUsers.username" :placeholder="placeholder_username" @focus="ifShowUser" @blur="ifShowUser"/>
					</view>
				</view>
				<view class="text">
					<view class="show" v-show="ifShow_password">
						密码
					</view>
					<view class="password" >
						<input type="password" v-model="newUsers.password"  :placeholder="placeholder_password" @focus="ifShowPassword" @blur="ifShowPassword"/>
					</view>
				</view>
				<view class="text">
					<view class="show"  v-show="ifShow_confirm">
						确认密码
					</view>
					<view class="password">	
						<input type="password" v-model="confirm_password" :placeholder="placeholder_confirm" @focus="ifShowConfirm" @blur="ifShowConfirm"/>
					</view>
				</view>
				<view class="register_btn" @click="verification">
					立即注册
				</view>
			</view>
		</view>
</template>

<script>
	export default {
		data() {
			return {
				newUsers: {
					username: "" ,
					password: ""
				},
				confirm_password: "",
				placeholder_username: "用户名(学号)",
				placeholder_password: "密码",
				placeholder_confirm: "确认密码",
				ifShow_user: false,
				ifShow_password: false,
				ifShow_confirm: false,
				vertify_username: /^3\d{2}205205[1-2]\d{3}$/,
				vertify_password: /^[0-9a-z]{8,15}$/
			}
		},
		methods: {
			ifShowUser(e) {
				if (this.ifShow_user === false){
					this.placeholder_username = ""
				} else{
				    this.placeholder_username = "用户名(学号)";
				}
				this.ifShow_user = !this.ifShow_user
				// this.newUsers.username = e.detail.value
				if (this.newUsers.username !=""){
					this.ifShow_user = true
				}
			},
			ifShowPassword(e) {
				if (this.ifShow_password === false){
					this.placeholder_password = ""
				} else{
				    this.placeholder_password = "密码";
				}
				this.ifShow_password = !this.ifShow_password
				// this.newUsers.password = e.detail.value
				if (this.newUsers.password !=""){
					this.ifShow_password = true
				}
			},
			ifShowConfirm(e) {
				if (this.ifShow_confirm === false){
					this.placeholder_confirm = ""
				} else{
				    this.placeholder_confirm = "确认密码";
				}
				this.ifShow_confirm = !this.ifShow_confirm
				// this.confirm_password = e.detail.value
				if (this.confirm_password !=""){
					this.ifShow_confirm = true
				}
			},
			async verification(e) {
				if (this.newUsers.username == ""){
					uni.showToast({
						title:'请输入用户名',
						image:"/static/error.png"
					})
				}else if(this.newUsers.password == "") {
					uni.showToast({
						title:'请输入密码',
						image:"/static/error.png"
					})
				}else if(this.confirm_password==""){
					uni.showToast({
						title:'请确认密码',
						image:"/static/error.png"
					})
				} else {
					if(!this.vertify_username.test(this.newUsers.username)){
						uni.showModal({
							title: "请输入正确的学号",
							content: "按照信息学院个人学号格式输入",
							showCancel:false
						})
					}else if(!this.vertify_password.test(this.newUsers.password)){
						uni.showModal({
							title: "密码格式错误",
							content: "请输入8-15位字母或数字",
							showCancel:false
						})
					}else if(this.confirm_password!==this.newUsers.password) {
						uni.showToast({
							title:"两遍密码不一致",
							image:"/static/error.png"
						})
					}else {
						var result = await this.$myRequest({
							url: "/users/register",
							method: "post",
							data: this.newUsers
						})
						if(result.data==="账号存在"){
							uni.showModal({
								title: "该学号已被注册",
								content: "检查如有问题请联系老师解决",
								showCancel:false
							})
						}
						console.log(result.data)
						if(result.data==="注册成功"){
							await uni.showModal({
								title: "注册成功",
								content: "点击确定返回登录页面",
								success: () => {
									uni.reLaunch({
										url:"../login/login"
									})
								},
								showCancel:false
							})
						}
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		.title {
			margin-top: 50rpx;
			margin-left: 50rpx;
			font-size: 40rpx;
		}
		.line {
			margin-top: 20rpx;
			width: 100%;
			height: 1rpx;
			background-color: #000;	
		}
		.register{
			.text{
				.uername,
				.password{
					height: 50rpx;
					width: 700rpx;
					margin:0 auto;
					border-bottom:1rpx  solid  #ccc ;
					input {
						transition: all 1s linear;
					}
				}
				.show {
					margin-left: 25rpx;
					margin-bottom: 30rpx;
					font-size: 40rpx;
					transition: all 1s linear;
				}
				
			    margin-top: 80rpx;	
		     }
			 .register_btn {
			 	width: 300rpx;
			 	height: 100rpx;
			 	margin-top: 40rpx;
			 	margin-left: 475rpx;
			 	font-weight: 600;
			 	font-size: 60rpx;
			 	position: relative;
			 	z-index: 1;
			 }
		}
	}
</style>
