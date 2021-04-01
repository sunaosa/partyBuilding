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
						<administer @handleInsert='getInsert'>
							
						</administer>
					</view>
				</u-popup>
				<u-button @click="showModel" type="default">管理员操作</u-button>
			</view>
		</view>
		<u-tabbar v-model="current" :list="list" :mid-button="true" ></u-tabbar>
		<view>
			<u-popup v-model="showToast" mode="center" width="700rpx" height="350px" border-radius="14">
				<view class="changeForm">
					<view class="form-title">
						<u-cell-group>
							<u-cell-item
								title="党员信息修改" 
								:title-style="{'fontSize': '50rpx','fontWeight':'600','color':'#969696','textAlign': 'center'}" 
								:arrow="false" 
							>
							</u-cell-item>
						</u-cell-group>
					</view>
					<u-form :model="insertInfor" ref="uForm">
						<u-form-item label="姓名" prop="name"><u-input v-model="insertInfor.name" /></u-form-item>
						<u-form-item label="学号" prop="studentNumber"><u-input v-model="insertInfor.studentNumber" /></u-form-item>
						<u-form-item label="身份">
							<u-input v-model="insertInfor.identify" type="select" @click="showAction = true" :select-open='showAction'/>
							<u-action-sheet :list="actionSheetList" v-model="showAction" @click='actionSheetCallback'></u-action-sheet>
						</u-form-item>
					</u-form>
					<view class="operate-button">
						<u-button size="medium" @click="cancle">取消</u-button>
						<u-button type="primary" size="medium" class="location" @click="confirm">确认</u-button>
					</view>
				</view>	
			</u-popup>
		</view>
		<u-toast ref="uToast" />
		<u-modal 
			v-model="isshow" 
			:content="content" 
			:show-cancel-button='true' 
			@confirm="continueOperate" 
			@cancel="cancelOperate" 
			confirm-text='继续'>
		</u-modal>
	</view>
</template>

<script>
	import administer from "../../components/administer.vue"
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
			this.identify = personalInfor.data.identity
			if(this.name == null||this.name == "") {
				this.name = "未实名"
			} 
			if (personalInfor.data.YorN == "y") {
				this.YorN = true
			} else {
				this.YorN = false
			}
			
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		data() {
			return {
				name: "",
				identify: "",
				YorN: false,
				show: false,
				list: [],
				isshow: false,
				content: '',
				current: 2,
				showToast: false,
				insertInfor: {
					name: '',
					identify: '',
					studentNumber: ''
				},
				showAction: false,
				actionSheetList: [
					{
						text: '党员'
					},
					{
						text: '入党申请人'
					}
				],
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
							max: 5,
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
					identify: [
						{
							required: true,
							message: '请选择身份',
							trigger: ['click']
						}
					]
				}
			}
		},
		components:{
			administer: administer
		},
		computed:{
			profile() {
				if(this.identify === '游客'){
					return '/static/guest.png'
				} else if(this.identify === '党员') {
					return '/static/administer.png'
				}
				else {
					return '/static/applicant.png'
				}
			}
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
					url: "../individual-infor/individual-infor?identify="+this.identify
				})
			},
			getInsert(data) {
				this.showToast = data
				this.clearForm()
			},
			clearForm() {
				this.$nextTick(function(){
					this.$refs['uForm'].resetFields();
				})
				this.insertInfor.name = ''
				this.insertInfor.identify = ''
				this.insertInfor.studentNumber = ''
			},
			cancle() {
				this.showToast = false
			},
			async confirm() {
				if (this.insertInfor.identify==='' || this.insertInfor.name ==='' ||this.insertInfor.studentNumber===''){
					this.$refs.uToast.show({
						title: '内容不能为空',
						type: 'error',
					})
					return
				}
				let {data} = await this.$myRequest({
					url: '/selectMember/insert',
					method: 'post',
					data: this.insertInfor
				})
				this.isshow = true
				if (data.result === 1){
					this.content = '添加成功，是否继续'
				} else {
					this.content = '发生错误'
				}
			},
			actionSheetCallback(index) {
				this.insertInfor.identify = this.actionSheetList[index].text;
			},
			continueOperate() {
				this.clearForm()
				this.isshow = false
			},
			cancelOperate() {
				this.isshow = false
				this.showToast = false
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
	.changeForm {
		width: 640rpx;
		margin: auto;
	}
	.form-title {
		width: 100%;
		margin: auto;
	}
	.operate-button {
		
		width: 500rpx;
		margin: 50rpx auto;
	}
	.location {
		margin-left: 60rpx;
	}
</style>
