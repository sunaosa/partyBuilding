<template>
	<view>
		<view class="information" @click="changeInfor">
			<view class="information-box">
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
		</view>

		
		<view class="operation">
			<u-divider margin-top="50" bg-color="#F8F8F8">打卡情况</u-divider>
			<view class="clock-title" >
				需打卡数{{clockData[0].value+clockData[1].value}}次
			</view>
			<view class="chart">
				<clock-chart :clockData="clockData" v-show="showChart"></clock-chart>
			</view>
			<view >
				<u-popup  v-model="show" mode="left" border-radius="14" width="500rpx" @close="closePop" @open="openPop">
					<view class="content administer-pop">
						<administer @handleInsert='getInsert' @handleAnnounce='goAnnounce' @handleUpdate='handleUpdateQuestion'>
							
						</administer>
					</view>
				</u-popup>
				<view class="">
					
				</view>
				<u-icon
					name="reload" 
					color="#2979ff" 
					:style="{position: 'fixed', fontSize: '40rpx'}" 
					:class="rotate?'handle-refresh rotate':'handle-refresh'" 
					@click="refreshChart">
				</u-icon>
				<u-button
					v-if="YorN"
					color="#ccc" 
					shape="circle"
					:style="{position: 'fixed', fontSize: '60rpx',fontWeight: 'bold',width:'80rpx',bottom:'200rpx'}" 
					class="handle-refresh" 
					@click="showModel"
					>
					管
				</u-button>
			</view>
		</view>
		<view>
			<u-popup v-model="showToast" mode="center" width="700rpx" height="350px" border-radius="14">
				<view class="changeForm">
					<view class="form-title">
						<u-cell-group>
							<u-cell-item
								title="增加党员信息" 
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
		<view>
			<u-popup v-model="showAnnounce" mode="center" width="700rpx" height="350px" border-radius="14">
				<u-cell-group>
					<u-cell-item
						title="发布通知" 
						:title-style="{'fontSize': '50rpx','fontWeight':'600','color':'#969696','textAlign': 'center'}" 
						:arrow="false" 
					>
					</u-cell-item>
				</u-cell-group>
				<view class="announce">
					<u-input v-model="announceValue" type="textarea" :border="true" :height="350" @input='inputAnnounce'/>
					<view class="text-count" :style="{color: '#ccc'}">
						<text>{{actrueCount}}</text>
						<text>{{'/'+maxCount}}</text>
					</view>
				</view>
				<view class="annouce-button">
					<u-button type="primary" size="medium" :disabled="actrueCount===0?true:false" @click="handleIssue" :loading="isIssueLoading">发布</u-button>
				</view>
				
				<u-top-tips ref="uTips"></u-top-tips>
			</u-popup>
		</view>
		<u-toast ref="annouce" />
		<!-- <u-popup v-model="showUpdateQuestion" mode="center" width="700rpx" height="400px" border-radius="14">
			<view class="changeForm">
				<view class="form-title">
					<u-cell-group>
						<u-cell-item
							title="上传题库" 
							:title-style="{'fontSize': '50rpx','fontWeight':'600','color':'#969696','textAlign': 'center'}" 
							:arrow="false" 
						>
						</u-cell-item>
					</u-cell-group>
				</view>
				<u-form :model="question" ref="updateQuestion">
					<u-form-item label="题目" prop="questionTitle">
						<u-input v-model="question.questionTitle" border/>
					</u-form-item>
					<u-form-item label="选项" prop="questionChoice">
						<u-input type="textarea" v-model="question.questionChoice" placeholderStyle="color: #ccc" placeholder="选项之间通过','隔开" border/>
					</u-form-item>
					<u-form-item label="答案" prop="questionAnswer">
						<u-input v-model="question.questionAnswer" type="textArea" border/>
					</u-form-item>
				</u-form>
				<view class="operate-button">
					<u-button size="medium" @click="cancleUpdate">取消</u-button>
					<u-button type="primary" size="medium" class="location" @click="confirmUpdate">确认</u-button>
				</view>
			</view>	
		</u-popup> -->
		<u-tabbar v-model="current" :list="list"  active-color='#ff7d0b'></u-tabbar>
	</view>
</template>

<script>
	import administer from "../../components/administer.vue"
	import clockChart from "../../components/clock-chart.vue"
	
	export default {
		async onLoad() {
			this.list = this.$store.state.list
			var personalInfor = await this.$myRequest({
				url:"/users/myInformation",
				method: "post"
			})
			this.name = personalInfor.data.name
			this.profile = personalInfor.data.profilePhotos
			this.identify = personalInfor.data.identity
			console.log(this.identify)
			if(this.name == null||this.name == "") {
				this.name = "未实名"
			} 
			if (personalInfor.data.YorN == "y") {
				this.YorN = true
			} else {
				this.YorN = false
			}
			this.getClockResult()
			// 获取打卡信息数据
			
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
			// this.$refs.updateQuestion.setRules(this.rules1)
		},
		data() {
			return {
				rotate: false,
				clockData: [],
				question: {
					questionTitle: '',
					questionChoice: '',
					questionAnswer: ''
				},
				name: "",
				identify: "",
				YorN: false,
				show: false,
				showChart: true,
				list: [],
				isshow: false,
				content: '',
				current: 2,
				showToast: false,
				showAnnounce: false,
				actrueCount: 0,
				maxCount: 140,
				announceValue:'',
				isIssueLoading: false,
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
				showUpdateQuestion: false,
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
				},
				rules1: {
					questionTitle: [
						{ 
							required: true, 
							message: '请输入题目信息', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['blur']
						},
					],
					questionAnswer: [
						{
							required: true,
							message: '请输入答案',
							trigger: ['blur']
						}
					],
					questionChoice: [
						{
							required: true,
							message: '请输入选项信息',
							trigger: ['blur']
						}
					]
				}
			}
		},
		components:{
			administer: administer,
			clockChart: clockChart
		},
		computed:{
			profile() {
				if(this.identify === '游客'){
					return '/static/guest.png'
				} else if(this.identify === '党员') {
					return '/static/party_member.png'
				}
				else {
					return '/static/applicant.png'
				}
			}
		},
		methods: {
			async getClockResult() {
				let clockResult = await this.$myRequest({
					url: '/video/clockCondition',
					method: 'post'
				})
				if(clockResult.statusCode === 200) {
					this.clockData = clockResult.data
				} else {
					console.log(clockResult)
				}
			},
			refreshChart() {
				this.rotate = true
				setTimeout(()=>{
					this.rotate = false
				},2000)
				this.getClockResult()
			},
			showModel() {
				console.log(this.YorN)
				if (this.YorN == true) {
					this.show = true
				}else{
					this.show = false
					uni.showToast({
						title: "没有管理员权限"
					})
				}
			},
			openPop() {
				this.showChart = false
			},
			closePop() {
				console.log(this.show+111)
				this.showChart = true
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
			},
			goAnnounce(data) {
				this.showAnnounce = data
				this.announceValue = ''
			},
			inputAnnounce() {
				this.actrueCount = this.announceValue.length
			},
			async handleIssue() {
				this.isIssueLoading = true
				let {data} = await this.$myRequest({
					url: '/issue/anounce',
					method: 'post',
					data: {announceValue: this.announceValue}
				})
				if(data.text === '用户未实名') {
					this.$refs.uTips.show({
						title: 	'你还未实名',
						type: 'error',
						duration: '2300'
					})
					this.isIssueLoading = false
				}else {
					this.$refs.annouce.show({
						title: 	'发布成功',
						type: 'success'
					})
					this.showAnnounce = false
					this.isIssueLoading = false
				}
			},
			handleUpdateQuestion(data) {
				console.log(data)
				this.showUpdateQuestion = data
			},
			cancleUpdate() {
				this.showUpdateQuestion = false
			},
			confirmUpdate() {
				this.showUpdateQuestion = false
			}
		}
	}
</script>

<style lang="scss"> 
	page {
		overflow: hidden;
		height: 1500rpx;
		// background-color: #C8C7CC;
		background-color: #F8F8F8;
		.information {
			height: 350rpx;
			width: 750rpx;
			background-color: #ff7d0b;
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
		.information-box {
			position: relative;
			height: 200rpx;
			top: 50%;
			transform: translate(0,-50%);
		}
		.operation {
			// position: relative;
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
				background-color: #ff7d0b;
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
	.annouce-button {
		text-align: center;
		margin-top: 40rpx;
	}
	.text-count {
		position: absolute;
		right: 28rpx;
		bottom: 0rpx;
	}
	.chart {
		margin: 20rpx auto;
		height: 800rpx;
		width: 700rpx;
	}
	.clock-title {
		text-align: center;
		color: #C0C0C0;
	}
	.handle-refresh {
		width: 80rpx;
		height: 80rpx;
		border: 1rpx solid #ccc;
		line-height: 80rpx;
		text-align: center;
		right: 50rpx;
		bottom: 320rpx;
		border-radius: 50rpx;
		box-shadow: 0 0 10rpx 2rpx #C0C0C0;
		z-index: 10000;
	}
	.default {
		transition: all 2s;
	}
	.rotate {
		transform: rotate(360deg);
		transition: all 2s;
	}
	.administer-pop {
		position: relative;
		z-index: 1000000;
	}
	.announce {
		position: relative;
	}
</style>
