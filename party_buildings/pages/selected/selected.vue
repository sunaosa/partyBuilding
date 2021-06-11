<template>
	<view >
		<xuan-loading
			ref="loading"
			:shadeShow="true"	
			:custom="false"
			:shadeClick="false"
			:type="2"
		>
		</xuan-loading>
		<view class="search clearfix" >
			<view class="search-name">
				<u-search 
					placeholder="学生姓名"
					v-model="searchList.name" 
					class="search" 
					:clearabled="true" 
					:show-action='true' 
					:animation='true'
					@custom='searchMember'
					@search="searchMember"
					@clear="clearSearch" 
					>
				</u-search>
			</view>
			<view class="search-identify">
				<u-input v-model="searchList.identify" type="select" @click="searchAction = true" :border="true" placeholder="身份" height='64'/>
				<u-action-sheet :list="actionsearchList" v-model="searchAction" @click='actionSeachCallback'></u-action-sheet>
			</view>
		</view>
		
		<view class="table">
			<u-swipe-action :show="item.show" 
				:index="index" 
				v-for="(item, index) in list" :key="item.id" 
				@click="click"
				@open="open"
				:options="options"
				bg-color="#fdf6ec"
			>
				<view class="item u-border-bottom">
					<image mode="aspectFill" :src="item.identify==='党员'?'/static/party_member.png':'/static/applicant.png'"  />
					<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
					<view class="title-wrap">
						<text class="title u-line-2">{{'姓名：'+item.name}}</text>
						<text class="title1 u-line-2">{{'学号：'+item.studentNumber}}</text>
						<view class="title u-line-2">
							<text class="title u-line-2">{{'身份：'+item.identify}}</text>
							<text class="title1 u-line-2">{{'打卡次数：'+item.count}}</text>
						</view>
					</view>
				</view>
			</u-swipe-action>
		</view>
		<view class="wrap">
			<u-loadmore :status="status" @loadmore = 'loadingData'/>
		</view>	
		<view>
			<u-popup v-model="showToast" mode="center" width="700rpx" height="400px" border-radius="14">
				<view class="changeForm">
					<view class="form-title">
						<u-cell-group>
							<u-cell-item
								title="党员信息修改" 
								:title-style="{'fontSize': '50rpx','fontWeight':'600','color':'#969696','textAlign': 'center'}" 
								:arrow="false" 
								:label="label"
							>
							</u-cell-item>
						</u-cell-group>
					</view>
					<u-form :model="changeInfor" ref="uForm">
						<u-form-item label="姓名" prop="name"><u-input v-model="changeInfor.name" /></u-form-item>
						<u-form-item label="学号" prop="studentNumber"><u-input v-model="changeInfor.studentNumber" /></u-form-item>
						<u-form-item label="身份">
							<u-input v-model="changeInfor.identify" type="select" @click="showAction = true" :select-open='showAction'/>
							<u-action-sheet :list="actionSheetList" v-model="showAction" @click='actionSheetCallback'></u-action-sheet>
						</u-form-item>
						<u-form-item label="打卡" prop="count"><u-input v-model="changeInfor.count" disabled/></u-form-item>
					</u-form> 
					<view class="operate-button">
						<u-button size="medium" @click="cancle">取消</u-button>
						<u-button type="primary" size="medium" class="location" @click="confirm">确认</u-button>
					</view>
				</view> 
			</u-popup>
		</view>
	</view>
</template>

<script>
	// import wybTable from '@/components/wyb-table/wyb-table.vue'
	export default {
		onLoad() {
			if(Math.ceil(this.total/8) === this.i) {
				this.status = 'nomore'
			}
			this.i = 1
			this.selectMember()
		},
		onReachBottom() { 
			this.loadingData()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		data() {
			return {
				searchList: {
					name: '',
					identify: ''
				},
				list: [],
				disabled: false,
				btnWidth: 70,
				show: false,
				label: '',
				options: [
					{
						text: '编辑',
						style: {
							backgroundColor: '#007aff'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				loading: true,
				isFixed: true,
				checkMode: '',
				src: '',
				i: 1,
				status: 'loadmore',
				total: 0,
				showToast: false,
				changeInfor: {
					id: '',
					name: '',
					identify: '',
					studentNumber: '',
					count: ''
				},
				actionSheetList: [
					{
						text: '党员'
					},
					{
						text: '入党申请人'
					}
				],
				actionsearchList: [
					{
						text: '党员',
						value: '党员'
					},
					{
						text: '入党申请人',
						value: '入党申请人'
					},
					{
						text: '全部',
						value: ''
					}
				],
				showAction: false,
				searchAction: false,
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
					count: [
						{
							required: true,
							message: '请输入打卡次数', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['blur']
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
					options1: [{
						label: '党员',
						value: '党员'
					},
					{
						label: '入党申请人',
						value: '入党申请人'
					}]
				}
			}
		},
		methods: {
			searchMember(val) {
				this.i = 1
				this.selectMember()
			},
			clearSearch(){
				this.i = 1
				this.selectMember()
			},
			async selectMember() {
				this.$refs.loading.open();
				let result = await this.$myRequest({
					url:"/selectMember/selected",
					method: 'post',
					data: {page: this.i,identify:this.searchList.identify,name: this.searchList.name}
				}) 
				if (result.statusCode === 200){
					this.list = result.data.memberValues
					this.total = result.data.total
					this.$refs.loading.close()
				}
			},
			async click(index, index1) {
				if(index1 == 1) {
					let { data } =await this.$myRequest({
						url:'/selectMember/deleted',
						method: 'post',
						data: {id: this.list[index].id}
					})
					if(data===1) {
						await this.selectMember()
						if(this.total % 8 === 0) {
							this.i=this.i - 1
						}
						console.log(this.i)
						console.log(this.total)
						this.$u.toast(`删除了第${++index}个成员`);
					}
					
				} else {
					let {data} = await this.$myRequest({
						url:"/selectMember/otherInfor",
						method: 'post',
						data: {id: this.list[index].id}
					}) 
					if(data.r === 0){
						this.label = '学生未注册'
					} else if(data.r === 1){
						this.label = '学生未实名'
					} else {
						this.label = '手机号：'+data.phoneNumber+' 班级：'+data.class
					}
					this.changeInfor.id = this.list[index].id
					this.changeInfor.name = this.list[index].name
					this.changeInfor.identify = this.list[index].identify
					this.changeInfor.studentNumber = this.list[index].studentNumber
					console.log(this.list[index].count)
					this.changeInfor.count = ''+this.list[index].count
					this.showToast = true
				}
			},
			cancle() {
				this.showToast = false
			},
			async confirm() {
				let { data } = await this.$myRequest({
					url: '/selectMember/update',
					method: 'post',
					data: this.changeInfor
				})
				console.log(data)
				if(data.code === 1){
					await this.selectMember()
					this.$u.toast(`修改成功`);
					this.showToast = false
				}
			},
						// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if(index != idx) this.list[idx].show = false;
				})
			},
			loadingData() {
				
				if(Math.ceil(this.total/8) === this.i) {
					this.status = 'nomore'
					return
				}
				this.status = 'loading'
				this.i = ++ this.i;
				setTimeout(()=>{
					this.selectMember()
					this.status = 'loadmore'
				},2000)
			},
			actionSheetCallback(index) {
				this.changeInfor.identify = this.actionSheetList[index].text;
			},
			actionSeachCallback(index) {
				this.searchList.identify = this.actionsearchList[index].value;
				this.i = 1
				this.selectMember()
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fda73d;
	}
	.table {
		width: 750rpx;
	}
	.u-ur {
		width: 750rpx;
	}
	.search {
		// display: flex;
		// height: 40rpx;
		margin-top: 10rpx;
		// justify-content: space-between;
	}
	.search-name {
		display: inline-block;
		width: 500rpx;
		margin-left: 15rpx;
	}
	.search-identify {
		background-color: #f1f1f1;
		display: inline-block;
		border-radius: 15rpx;
		width: 200rpx;
		margin-left: 20rpx;
		text {
			margin-top: 21rpx;
		}
	}
	.table {
		width: 730rpx;
		overflow: hidden;
		margin: auto;
	}
	.item {
			display: flex;
			padding: 20rpx;
	}
		
	image {
		width: 70rpx;
		flex: 0 0 120rpx;
		height: 100rpx;
		margin-right: 20rpx;
		border-radius: 12rpx;
	}
	
	.title,
	.title1{
		text-align: left;
		font-size: 28rpx;
		color: $u-content-color;
		margin-top: 20rpx;
	}
	.title1 {
		margin-left: 60rpx;
	}
	.members {
		background-color: #ccc;
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
		margin: auto;
	}
	.location {
		margin-left: 50rpx;
	}
</style>
