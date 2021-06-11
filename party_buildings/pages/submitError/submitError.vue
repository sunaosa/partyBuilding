<template>
	<view>
		<view class="head" :style="{height: '100rpx',width: '100%'}" style="margin-bottom: 10rpx;">
			<view class="activityHead">
				问题
			</view>
			<view class="search-state">
				<u-input v-model="tureValue" type="select" border @click="showChoice = true" />
				<u-action-sheet :list="actionSheetList" v-model="showChoice" @click="actionSheetCallback"></u-action-sheet>
			</view>
		</view>
		<view class="body">
			<u-collapse :item-style="itemStyle" event-type="close" :arrow="true" :accordion="true" >
				<view style="border: 1px solid #ccc;" v-for="(el,i) in errorList" :key="i">
					<u-collapse-item :item-style="{border: '1rpx solid #ccc'}" style="{border: '1rpx solid #ccc'}">
						<view slot="title" style="font-size: 40rpx;">
							{{ el.problemTitle }}
							<u-icon :name="el.state === '已解决'?'checkmark-circle-fill':'close-circle-fill'" :color="el.state === '已解决'?'#19be6b':'#fa3534'" style="margin-left: 60rpx;"></u-icon>
						</view>
						<view style="font-size: 35rpx;height='100%'">
							<view v-if="isAdmin==='y'">
								申请人：{{el.requestor}}
							</view>
							<view v-if="isAdmin==='y'">
								申请人学号：{{el.requestNumber}}
							</view>
							<view >
								问题描述：{{el.problemDetails}}
							</view>
							<view class="">
								解决状态：{{el.state}}
							</view>
							<view class="" v-if="el.responseMsg!==null">
								回复内容：{{el.responseMsg}}
							</view>
							<view class="" v-if="isAdmin==='y'&&el.responseMsg===null">
								<u-form :label-width='200' :label-style="{fontSize: '34.5rpx',color: '#90959d'}">
									<u-form-item label="回复内容" prop="responseMsg" >
										<u-input v-model="responseMsg" border />
									</u-form-item>
								</u-form>
							</view>
							<view class="">
								<text>{{el.state ==='已解决'?'处理时间：':'申请时间：'}}</text>{{el.updatedAt}}
							</view>
							<view class="resolve-style" v-if="isAdmin==='y'&&el.responseMsg===null">
								<u-button size="medium" type="primary" @click="handleResolve(el.id)">解决</u-button>
							</view>
						</view>
					</u-collapse-item>
				</view>
			</u-collapse>
		</view>
		<u-button
			color="#ccc" 
			:style="{position: 'fixed', fontSize: '60rpx',fontWeight: 'bold'}" 
			class="handle-refresh" 
			@click="submitNewError"
			v-if="isAdmin!=='y'"
			shape="circle">
			<u-icon name="plus">
				
			</u-icon>
		</u-button>
		<u-popup v-model="showUpdateQuestion" mode="center" width="700rpx" height="400px" border-radius="14">
			<view class="changeForm">
				<view class="form-title">
					<u-cell-group>
						<u-cell-item
							title="提交问题" 
							:title-style="{'fontSize': '50rpx','fontWeight':'600','color':'#969696','textAlign': 'center'}" 
							:arrow="false" 
						>
						</u-cell-item>
					</u-cell-group>
				</view>
				<u-form :model="requestInfor" ref="requestInfor" :label-width='200'>
					<u-form-item label="问题" prop="problems">
						<u-input v-model="requestInfor.problems" border />
					</u-form-item>
					<u-form-item label="请求人姓名" prop="requestName">
						<u-input v-model="requestInfor.requestName" border />
					</u-form-item>
					<u-form-item label="请求人学号" prop="requestNumber">
						<u-input v-model="requestInfor.requestNumber" border />
					</u-form-item>
					<u-form-item label="问题详述" prop="requestDetails">
						<u-input v-model="requestInfor.requestDetails" type="textarea" :border="true"/>
					</u-form-item>
				</u-form>
				<view class="operate-button">
					<u-button size="medium" @click="cancleSubmit">取消</u-button>
					<u-button type="primary" size="medium" class="location" @click="confirmUpdate">发送</u-button>
				</view>
			</view>	
		</u-popup>
		<u-toast ref="clockToast" />
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			console.log(options.isAdmin)
			console.log(options.state)
			this.isAdmin = options.isAdmin
			this.identify = options.identify
			if (this.isAdmin === "n") {
				this.userGetError()
			} else {
				this.tureValue = options.state
				this.adminGetError()
			}
		},
		onReady() {
			this.$refs.requestInfor.setRules(this.rules);
		},
		data() {
			return {
				responseMsg: '',
				isAdmin: false,
				identify: false,
				tureValue: '',
				showChoice: false,
				errorList:[],
				actionSheetList: [
					{
						text: '已解决',
						value: '已解决'
					},
					{
						text: '未解决',
						value: '未解决'
					},
					{
						text: '全部',
						value: ''
					}
				],
				requestInfor: {
					requestName: '',
					problems: '',
					requestNumber: '',
					requestDetails: ''
				},
				rules: {
					requestName: [
						{
							required: true,
							message: '请输入你的姓名', 
							trigger: ['blur']
						}
					],
					problems: [
						{
							required: true,
							message: '请输入你的问题描述', 
							trigger: ['blur']
						}
					],
					requestNumber: [
						{
							required: true,
							message: '请输入你的学号', 
							trigger: ['blur']
						}
					],
					requestDetails: [
						{
							required: true,
							message: '请输入你的问题详细描述', 
							trigger: ['blur']
						}
					]
				},
				showUpdateQuestion: false
			}
		},
		methods: {
			actionSheetCallback(index) {
				this.tureValue = this.actionSheetList[index].value
				if(this.isAdmin === "y") {
					this.adminGetError()
				}
				else{
					this.userGetError()
				}
			},
			submitNewError() {
				this.showUpdateQuestion = true
				this.$refs.requestInfor.resetFields(this.rules);
				this.requestInfor.requestName=''
				this.requestInfor.problems=''
				this.requestInfor.requestNumber=''
				this.requestInfor.requestDetails=''
			},
			cancleSubmit() {
				this.showUpdateQuestion = false
			},
			async confirmUpdate() {
				let {data} = await this.$myRequest({
					url: '/error/submitError',
					method: 'post',
					data: {requestInfor: this.requestInfor}
				})
				this.showUpdateQuestion = false
				this.$refs.clockToast.show({
					title: '发送成功',
					type: 'success'
				})
				this.userGetError()
			},
			async userGetError(){
				let {data} = await this.$myRequest({
					url: '/error/getError',
					method: 'post',
					data: { choice: this.tureValue }
				})
				this.errorList = data.errorList
			},
			async adminGetError() {
				let {data} = await this.$myRequest({
					url: '/error/getError',
					method: 'post',
					data: {choice: this.tureValue}
				})
				this.errorList = data.errorList
			},
			async handleResolve(id) {
				let {data} = await this.$myRequest({
					url: '/error/resolveProblem',
					method: 'post',
					data: { id: id, responseMsg: this.responseMsg }
				})
				this.$refs.clockToast.show({
					title: data,
					type: 'success'
				})
				this.responseMsg = ''
				this.adminGetError()
			}
		}
	}
</script>

<style lang="scss">
.activityHead {
	font-weight: bold;
	line-height: 100rpx;
	margin-left: 30rpx;
}
.head {
	box-shadow: 0 0 10rpx 2rpx #C0C0C0;
}
.search-state {
	width: 300rpx;
	position: absolute;
	right: 30rpx;
	top: 10rpx;
	text {
		margin-top: 21rpx;
	}
}
.handle-refresh {
	width: 80rpx;
	height: 80rpx;
	border: 1rpx solid #ccc;
	line-height: 80rpx;
	text-align: center;
	right: 10rpx;
	bottom: 200rpx;
	border-radius: 50rpx;
	background-color: #fff;
	box-shadow: 0 0 10rpx 2rpx #C0C0C0;
	z-index: 0;
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
.resolve-style {
	text-align: center;
	margin-top: 40rpx;
}
</style>
