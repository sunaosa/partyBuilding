<template>
	<view>
		<view class="title">
			<u-card
				:thumb="thumb"
				:head-border-bottom='true'
				slot='head' 
				:border="true"
			>
				<view class="title" slot="head">
					{{title}}
					<u-switch v-model="checked" class="titleSwitch" @change="changeMethod"></u-switch>
				</view>
			</u-card>
		</view>
		<view class="content" v-show="checked">
			<u-form :model="valicateForm" ref="valicateIdentity" :label-width='400'>
				<u-form-item label="用户名" prop="studentNumber">
					<u-input v-model="valicateForm.studentNumber" :border="true" placeholder="学号" />
				</u-form-item>
				<u-line color="#e5e5e5"></u-line>
				<u-form-item label="姓名" prop="name"> 
					<u-input v-model="valicateForm.name" :border="true"/>
				</u-form-item>
				<u-line color="#e5e5e5"></u-line>
				<u-form-item label="绑定的手机号码" prop="phoneNumber">
					<u-input v-model="valicateForm.phoneNumber" :border="true"/>
				</u-form-item>
				<u-line color="#e5e5e5" prop='sex'></u-line>
				<u-form-item label="所在班级" prop="class">
					<u-input v-model="valicateForm.class" :border="true" placeholder="年级-专业-班级"/>
				</u-form-item>
				<u-line color="#e5e5e5"></u-line>
			</u-form>
			<view class="button">
				<u-button type='primary' shape="circle" size="medium" @click="valicateIdentity" :loading='loading'>验证身份</u-button>
			</view>
		</view>
		<view class="content" v-show="!checked">
			<u-form :model="valicateForm" ref="valicatePassword" :label-width='400'>
				<u-form-item label="用户名" prop="studentNumber">
					<u-input v-model="valicateForm.studentNumber" :border="true" placeholder="学号"/>
				</u-form-item>
				<u-line color="#e5e5e5"></u-line>
				<u-form-item label="原密码" prop="password">
					<u-input v-model="valicateForm.password" :border="true"/>
				</u-form-item>
				<u-line color="#e5e5e5"></u-line>
			</u-form>
			<view class="button">
				<u-button type='primary' shape="circle" size="medium" @click="valicatePassword" :loading='loading'>验证密码</u-button>
			</view>
		</view>
		<u-toast ref="uToast" />
		<u-popup v-model="showToast" mode="center" width="700rpx" height="350px" border-radius="14">
			<view class="changeForm">
				<view class="form-title">
					<u-cell-group>
						<u-cell-item
							title="验证成功输入新密码" 
							:title-style="{'fontSize': '50rpx','fontWeight':'600','color':'#969696','textAlign': 'center'}" 
							:arrow="false" 
						>
						</u-cell-item>
					</u-cell-group>
				</view>
				<u-form :model="insertInfor" ref="uForm" :label-width='400'>
					<u-form-item label="新密码" prop="password">
						<u-input v-model="insertInfor.password" :border="true"/>
					</u-form-item>
					<u-form-item label="确认密码" prop="confirmPassword">
						<u-input v-model="insertInfor.confirmPassword" :border="true"/>
					</u-form-item>
				</u-form>
				<view class="operate-button">
					<u-button type="primary" class="location" @click="confirm" :loading="confirmLoading">确认</u-button>
				</view>
			</view>	
		</u-popup>
		<u-modal v-model="showReturnLogin" content="修改成功,点击返回登录" @confirm="handleReturnLogin"></u-modal>
	</view>
</template>

<script>
	export default {
		async onLoad() {
		},
		onReady() {
			this.$refs.valicatePassword.setRules(this.rules);
			this.$refs.valicateIdentity.setRules(this.rules);
			this.$refs.uForm.setRules(this.rules1);
		},
		data() {
			return {
				confirmLoading: false,
				showToast: false,
				checked: false,
				subTitle: '首次为认证，之后填写为更改信息',
				title: '知道原密码',
				showReturnLogin: false,
				valicateForm: {
					name: '',
					studentNumber: '',
					phoneNumber: '',
					class: '',
					password: ''
				},
				ifshow: false,
				content: '操作成功',
				loading: false,
				sexList: [
					{text: '男'},
					{text: '女'}
				],
				show: false,
				buttonText: '',
				identify: '',
				insertInfor: {
					password: "",
					confirmPassword: ""
				},
				rules1: {
					password: [
						{
							required: true,
							message: '请输入密码', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['blur']
						},
						{
							required: true,
							message: '请输入8-15位密码',
							min: 8,
							max: 15,
							trigger: ['change']
						}
					],
					confirmPassword: [
						{
							required: true,
							message: '请确认密码', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['blur']
						},
						{
							required: true,
							message: '请输入8-15位密码',
							min: 8,
							max: 15,
							trigger: ['change']
						}
					]
				},
				rules: {
					name: [
						{ 
							required: true, 
							message: '请输入姓名', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['blur']
						},
						{
							required: true,
							min: 2,
							max: 8,
							message: '名字2-5个字',
							trigger: ['change']
						}
					],
					studentNumber: [
						{
							required: true,
							message: '请输入学号', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['blur']
						}
					],
					phoneNumber: [
						{
							required: true,
							message: '请输入手机号',
							trigger: ['blur']
						},
						{
							required: true,
							message: '手机号必须11位',
							min: 11,
							max: 11,
							trigger: ['change']
						}
					],
					sex: [
						{
							required: true,
							message: '请选择性别',
							min: 1,
							trigger: ['blur']
						}
					],
					class: [
						{
							required: true,
							message: '请输入班级',
							trigger: ['blur']
						},
						{
							required: true,
							message: '请按照格式 例：17-计科-2',
							pattern: /^\d{2}\-[\u4e00-\u9fa5]*\-\d{1,2}/,
							trigger: ['change']
						}
					],
					password: [
						{
							required: true,
							message: '请输入原密码',
							min: 1,
							trigger: ['blur']
						},
						{
							required: true,
							message: '密码至少8位',
							min: 8,
							trigger: ['change']
						}
					]
				},
				
			}
		},
		methods: {
			changeMethod() {
				if (this.checked === false) {
					this.title = "知道原密码"
				} else {
					this.title = "根据认证信息找回密码"
				}
			},
			async valicateIdentity() {
				this.loading = true
				let that = this
				this.$refs.valicateIdentity.validate(async function(valid) {
					if(!valid){
						that.loading = false
						return
					}
					let {data} = await that.$myRequest({
						url: '/reset/valicateIdentity',
						method: 'post',
						data: {valicateForm: that.valicateForm}
					})
					that.loading = false
					if (data === "信息验证失败") {
						that.$refs.uToast.show({
							title: '验证失败',
							type: 'error'
						})
					}
					else if (data === "success"){
						that.showToast = true
					}
				})
				
			},
			async valicatePassword() {
				this.loading = true
				let that = this
				this.$refs.valicatePassword.validate(async function(valid) {
					if(!valid) {
						that.loading = false
						return
					}
					let {data} = await that.$myRequest({
						url: '/reset/valicatePassword',
						method: 'post',
						data: {valicateForm: that.valicateForm}
					})
					that.loading = false
					console.log(data)
					if (data === "信息验证失败") {
						that.$refs.uToast.show({
							title: '验证失败',
							type: 'error'
						})
					}
					else if (data === "success"){
						that.showToast = true
					}
				})
			},
			async confirm() {
				let that = this
				this.confirmLoading = true
				this.$refs.uForm.validate(async function(valid) {
					if(!valid){
						that.confirmLoading = false
						return
					}
					if(that.insertInfor.password !== that.insertInfor.confirmPassword) {
						that.$refs.uToast.show({
							title: '两次密码不一致',
							type: 'warning'
						})
						that.confirmLoading = false
						return
					}
					let {data} = await that.$myRequest({
						url: '/reset/resetPassword',
						method: 'post',
						data: {newPassword: that.insertInfor.password,username: that.valicateForm.studentNumber}
					})
					if(data === "修改成功") {
						that.confirmLoading = false
						that.showReturnLogin = true
					}
				})
			},
			handleReturnLogin() {
				uni.reLaunch({
					url:"../login/login"
				})
			}
		}
	}
</script>

<style>
.title {
	height: 180rpx;
	overflow: hidden;
	width: 700rpx;
	margin: auto;
	border-bottom: 1px solid #dcdcdc;
}
.content {
	width: 700rpx;
	margin: 30rpx auto;
}
.button {
	margin: 50rpx 0;
	text-align: center;
}
.logout {
	margin-top: 300rpx;
}
.title {
	font-size:40rpx;
	color:#01ff56;
}
.titleSwitch {
	position: absolute;
	right: 50rpx;
}
.operate-button {
	width: 500rpx;
	margin: 50rpx auto;
}
.changeForm {
	width: 640rpx;
	margin: auto;
}
.form-title {
	width: 100%;
	margin: auto;
}
</style>
