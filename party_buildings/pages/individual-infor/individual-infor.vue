<template>
	<view>
		<view class="title">
			<u-card
				:title="title" 
				:sub-title="subTitle" 
				:thumb="thumb"
				:title-size="40"
				:head-border-bottom='true'
				slot='head' 
				:border="true"
				title-color='#ff8901'>
			</u-card>
		</view>
		<view class="content">
			<u-form :model="valicateForm" ref="valicateForm" :label-width='400'>
				<u-form-item label="学号" prop="studentNumber">
					<u-input v-model="valicateForm.studentNumber" :border="true" placeholder="默认为您学号" disabled="true"/>
				</u-form-item>
				<u-line color="#e5e5e5"></u-line>
				<u-form-item label="姓名" prop="name">
					<u-input v-model="valicateForm.name" :border="true" :disabled="identify === '游客' ? false : true"/>
				</u-form-item>
				<u-line color="#e5e5e5"></u-line>
				<u-form-item label="手机号码" prop="phoneNumber">
					<u-input v-model="valicateForm.phoneNumber" :border="true"/>
				</u-form-item>
				<u-line color="#e5e5e5" prop='sex'></u-line>
				<u-form-item label="班级" prop="class">
					<u-input v-model="valicateForm.class" :border="true" placeholder="年级-专业-班级"/>
				</u-form-item>
				<u-line color="#e5e5e5"></u-line>
				<u-form-item label="性别" prop='sex'>
					<u-input v-model="valicateForm.sex" :border="true" type="select" @click='show = true'/>
					<u-action-sheet :list="sexList" v-model="show" @click="actionSheetCallback"></u-action-sheet>
				</u-form-item>
				<u-line color="#e5e5e5"></u-line>
				
			</u-form>
			<view class="button">
				<u-button type='primary' shape="circle" size="medium" @click="valicateMember" :loading='loading'>{{identify==='游客'?'认证':'保存'}}</u-button>
			</view>
			<u-top-tips ref="uTips"></u-top-tips>
			<u-modal v-model="ifshow" :content="content"></u-modal>
			<u-toast ref="uToast" />
		</view>
	</view>
</template>

<script>
	export default {
		async onLoad(identity) {
			console.log(identity)
			this.identify = identity.identify
			let { data } = await this.$myRequest({
				url: '/valicate/initialize',
				method: 'post',
				data:{id: uni.getStorageSync('idVerification')}
			})
			this.valicateForm = data
		},
		onReady() {
			this.$refs.valicateForm.setRules(this.rules);
		},
		data() {
			return {
				subTitle: '首次为认证，之后填写为更改信息',
				title: '党员认证',
				valicateForm: {
					name: '',
					studentNumber: '',
					phoneNumber: '',
					sex: '',
					class: ''
				},
				ifshow: false,
				content: '',
				loading: false,
				sexList: [
					{text: '男'},
					{text: '女'}
				],
				show: false,
				buttonText: '',
				identify: '',
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
					]
				},
				
			}
		},
		methods: {
			actionSheetCallback(index) {
				this.valicateForm.sex = this.sexList[index].text
			},
			async valicateMember() {
				this.loading = true
				this.$refs.valicateForm.validate(valid => {
					if(!valid){
						return
					}
				})
				let {data} = await this.$myRequest({
					url: '/valicate/valicate-member',
					method: 'post',
					data: {valicateForm: this.valicateForm,id:uni.getStorageSync('idVerification')}
				})
				console.log(data)
				if(data === 1) {
					this.loading = false
					
				} else{
					this.$refs.uToast.show({
						title: '登录成功',
						type: 'error',
						url: '/pages/user/index'
					})
					this.loading = false
				}
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
</style>
