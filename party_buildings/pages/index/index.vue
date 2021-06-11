<template>
	<view>
		<view class="">
			<xuan-loading 
				ref="loading"
				:shadeShow="true"	
				:custom="false"
				:shadeClick="false"
				:type="2"
			>
			</xuan-loading>
			<view class="header">
				<u-notice-bar
					:list="announceList.announcement" 
					type="warning"
					mode="vertical"
					:more-icon="true" 
					color='#ff9900'
					bg-color="#fdf6ec"
					@click="checkAnnounce">
				</u-notice-bar>
				<view class="icon" @click="showMore">
					<u-icon name="arrow-right" color='#ff9900' ></u-icon>
				</view>
			</view>
			<view class="swiper">
				<u-swiper :list="swiperList"  ></u-swiper>
			</view>
			<u-popup v-model="showAnnounce" mode="center" width="700rpx" height="350px" border-radius="14">
				<u-cell-group>
					<u-cell-item
						title="公告内容" 
						:title-style="{'fontSize': '50rpx','fontWeight':'600','color':'#969696','textAlign': 'center'}" 
						:arrow="false" 
					>
					</u-cell-item>
				</u-cell-group>
				<view class="issueContent">
					<u-input v-model="content" type="textarea" :border="true" :height="350" @input='inputAnnounce' disabled/>
					<view class="issuer">
						<text :style="{color: '#ccc'}">{{`发布人：${issuer}`}}</text>
					</view>
				</view>
				<view class="annouce-button">
					<u-button type="primary" size="medium" @click="handleIssue">确定</u-button>
				</view>
				
			</u-popup>
			<u-toast ref="authority" />
		</view>
		<view class="">
			<view>
				<u-tabs-swiper 
					ref="uTabs"  
					:list="menuList" 
					:current="current" 
					@change="tabsChange" 
					:is-scroll="false"
					swiperWidth="750"
					active-color="#ff7d0b">
				</u-tabs-swiper>
			</view>
			<view class="swiper">
				<swiper :current="swiperCurrent" :disable-programmatic-animation='true' @transition="transition" @animationfinish="animationfinish" class="videoStyle" style="min-height: 900rpx; width: 100%;">
					<swiper-item class="swiper-item" >
						<scroll-view scroll-y style="height:100%;  width:95%; margin: auto;">
							<u-divider color="#fa3534" v-if="educateList.length === 0">没有视频</u-divider>
							<view class="card-style" v-for="(ele, i) in educateList" :key="i" style=" border-radius: 50rpx;background-color: #FFFFFF;">
								<u-card border  :foot-border-top="true" :border-radius='0' margin="10rpx 20rpx" padding="10" :body-style="ele.isShowVideo?hideStyle:showStyle">
									<view slot="head" @click="showVideo(ele.id)" style="position: relative;">
										<text :style="{color: ele.clock?'#ff7d0b':'#c7cacc'}" class="title-style">{{ele.title}}</text>
										<u-icon v-if="ele.isShowVideo" :name="isPause?'play-circle-fill':'pause-circle-fill'" style="font-size: 40rpx; float: right;color: #00E676; position: absolute; top: 50%;right:-5rpx; transform: translateY(-50%);"></u-icon>
										<u-icon v-if="!ele.isShowVideo" name="play-circle" style="font-size: 40rpx; float: right; position: absolute; top: 50%;transform: translateY(-50%);right:-5rpx;"></u-icon>
									</view>
									<view slot="body" >
											<view  class="videoArea" v-if="ele.isShowVideo">
												<video
													:src="ele.videoPath"  
													@ended='videoEnded(ele.videoPath, ele.id)'
													:show-loading="true"
													:controls="true"
													:show-fullscreen-btn="false"
													:auto-pause-if-navigate="true"
													@play="play"
													@pause="pause">
												</video>
											</view>
									</view>
								</u-card>
							</view>
							
						</scroll-view>
					</swiper-item>
					<swiper-item class="swiper-item"  >
						<scroll-view scroll-y style="height: 100%; width:95%; margin: auto;">
							<u-divider color="#fa3534" v-if="knowledgeList.length === 0">没有视频</u-divider>
							<view class="card-style" v-for="(ele, i) in knowledgeList" :key="i" style=" border-radius: 50rpx; background-color: #FFFFFF;">
								<u-card border  :foot-border-top="true" :border-radius='0'   margin="10rpx 20rpx" padding="10" :body-style="ele.isShowVideo?hideStyle:showStyle">
									<view slot="head" @click="showVideo(ele.id)" style="position: relative;">
										<text :style="{color: ele.clock?'#ff7d0b':'#c7cacc'}" class="title-style">{{ele.title}}</text>
										<u-icon v-if="ele.isShowVideo" :name="isPause?'play-circle-fill':'pause-circle-fill'" style="font-size: 40rpx; float: right;color: #00E676;  position: absolute; top: 50%;right:-5rpx; transform: translateY(-50%);"></u-icon>
										<u-icon v-if="!ele.isShowVideo" name="play-circle" style="font-size: 40rpx; float: right;  position: absolute; top: 50%;right:-5rpx; transform: translateY(-50%);"></u-icon>
									</view>
									<view slot="body">
											<view  class="videoArea" v-if="ele.isShowVideo">
												<video
													:src="ele.videoPath"  
													@ended='videoEnded(ele.videoPath, ele.id)'
													:controls="true"
													:show-loading="true"
													:auto-pause-if-navigate="true"
													:show-fullscreen-btn="false"
													@play="play"
													@pause="pause">
												</video>
											</view>
									</view>
								</u-card>
							</view>
						</scroll-view>
					</swiper-item>
					<swiper-item class="swiper-item" >
						<scroll-view scroll-y style="height: 100%; width:95%; margin: auto;">
							<u-divider color="#fa3534" v-if="activityList.length === 0">没有视频</u-divider>
							<view class="card-style" v-for="(ele, i) in activityList" :key="i" style=" border-radius: 50rpx;background-color: #FFFFFF;">
								<u-card border  :foot-border-top="true" :border-radius='0'   margin="10rpx 20rpx" padding="10" :body-style="ele.isShowVideo?hideStyle:showStyle">
									<view slot="head" @click="showVideo(ele.id)" style="position: relative;">
										<text :style="{color: ele.clock?'#ff7d0b':'#c7cacc'}" class="title-style">{{ele.title}}</text>
										<u-icon v-if="ele.isShowVideo" :name="isPause?'play-circle-fill':'pause-circle-fill'" style="font-size: 40rpx; float: right;color: #00E676;  position: absolute; top: 50%;right:-5rpx; transform: translateY(-50%);"></u-icon>
										<u-icon v-if="!ele.isShowVideo" name="play-circle" style="font-size: 40rpx; float: right;  position: absolute; top: 50%;right:-5rpx; transform: translateY(-50%);"></u-icon>
									</view>
									<view slot="body">
											<view  class="videoArea" v-if="ele.isShowVideo">
												<video
													:src="ele.videoPath"  
													@ended='videoEnded(ele.videoPath, ele.id)'
													:show-loading="true"
													:controls="true"
													:auto-pause-if-navigate="true"
													:show-fullscreen-btn="false"
													@play="play"
													@pause="pause">
												</video>
											</view>
									</view>
								</u-card>
							</view>
						</scroll-view>
					</swiper-item>
					<swiper-item class="swiper-item">
						<scroll-view scroll-y style="height: 100%; width:95%; margin: auto;">
							<u-divider color="#fa3534" v-if="othersList.length === 0">没有视频</u-divider>
							<view class="card-style" v-for="(ele, i) in othersList" :key="i" style=" border-radius: 50rpx; background-color: #FFFFFF;">
								<u-card border  :foot-border-top="true" :border-radius='0'   margin="10rpx 20rpx" padding="10" :body-style="ele.isShowVideo?hideStyle:showStyle">
									<view slot="head" @click="showVideo(ele.id)"  style="position: relative;">
										<text :style="{color: ele.clock?'#ff7d0b':'#ccc'}" class="title-style">{{ele.title}}</text>
										<u-icon v-if="ele.isShowVideo" :name="isPause?'play-circle-fill':'pause-circle-fill'" style="font-size: 40rpx; float: right;color: #00E676; position: absolute; top: 50%;right:-5rpx; transform: translateY(-50%);"></u-icon>
										<u-icon v-if="!ele.isShowVideo" name="play-circle" style="font-size: 40rpx; float: right;  position: absolute; top: 50%;right:-5rpx; transform: translateY(-50%);"></u-icon>
									</view>
									
									<view slot="body">
											<view  class="videoArea" v-if="ele.isShowVideo">
												<video
													:src="ele.videoPath"  
													@ended='videoEnded(ele.videoPath, ele.id)'
													:show-loading="true"
													:controls="true"
													:auto-pause-if-navigate="true"
													:show-fullscreen-btn="false"
													@play="play"
													@pause="pause">
												</video>
											</view>
									</view>
								</u-card>
							</view>
						</scroll-view>
					</swiper-item>
					
				</swiper>
				<u-button
					color="#ccc" 
					shape="circle"
					:style="{position: 'fixed', fontSize: '60rpx',fontWeight: 'bold'}" 
					class="handle-refresh" 
					@click="handleSubmitError"
					v-if="userInformation.identity !== '游客'">
					<u-badge type="error" :count="problemCount" :offset="[-8,-8]" v-if="isAdmin === 'y'"></u-badge>
					<u-icon name="question" style="font-size: 35rpx;" color="#ccc">	
					</u-icon>
				</u-button>
				<u-button
					color="#ccc" 
					shape="circle"
					:style="{position: 'fixed', fontSize: '60rpx',fontWeight: 'bold'}" 
					class="handle-refresh activity" 
					@click="handleActivity"
					v-if="userInformation.identity !== '游客'"> 
					<!-- <u-badge type="error" :count="activityCount" :offset="[-8,-8]"></u-badge> -->
					<text style="font-size: 35rpx;" color="#ccc">	
					活
					</text>
				</u-button>
			</view>
		</view>
		<u-tabbar v-model="current" :list="list" active-color='#ff7d0b' ></u-tabbar>
		<u-toast ref="clockToast" />
	</view>
</template>

<script>
	import yfsVideo from '../../components/yfs-video/yfs-video.vue'
	import XuanLoading from '../../components/xuan-loading/xuan-loading.vue'
	export default {
		components:{
		    yfsVideo,
			XuanLoading
		},
		async onShow() {
			// 获取公告
			let {data} = await this.$myRequest({
				url: '/issue/selected'
			})
			this.announceList = data
			
		},
		async onLoad() {
			this.getProblemsCount()
			var login_result=await this.$myRequest({
				url: "/users/autoLogin",
				method: "post"
			})
			if(login_result.data.responseMsg !== "success") {
				await uni.showLoading({
					title:"身份验证失效"
				})
				setTimeout(()=>{
					uni.redirectTo({
						url:"../login/login"
					})
					uni.hideLoading()
				},2000)
			}
			this.getVideo(-1)
			this.valicteidentify()
			this.list = this.$store.state.list
		},
		data() {
			return {
				problemCount: 0,
				menuList: [{
					name: '思想教育'
				}, {
					name: '党务知识'
				}, {
					name: '党建活动',
				}, {
					name: '其他',
				}],
				showStyle: {padding: '1.8rpx'},
				hideStyle: {},
				isAdmin: '',
				isPause: true,
				loadingShow: true,
				videoContext: [],
				current: 0,
				swiperCurrent: 0, 
				announceList: [],
				issuer: [],
				current: 0,
				list: [],
				videoList: [],
				educateList: [],
				knowledgeList: [],
				activityList: [],
				othersList: [],
				content: '',
				showAnnounce: false,
				issuer: '',
				identify: '',
				activityCount: 0,
				swiperList: [{
						image: 'https://www.glut.edu.cn/__local/E/A2/91/4FCEE793B1437AB96A2F6D7F139_54E18427_5899A.jpg',
						title: '培育和践行核心价值观'
					},{
						image: 'https://www.glut.edu.cn/__local/8/3C/3E/EDFDCFBBDC16525E1125BF8C221_79D2A4C8_45453.jpg',
						title: '史实学习动员大会'
					},{
						image: 'https://www.glut.edu.cn/__local/9/8C/B0/39FF993123CDE13B13443E63E88_A5A28EBB_51A7B.jpg',
						title: '学党实悟思想办实事开新局'
					}]
			}
		},
		methods: {
			checkAnnounce(index) {
				if( this.identify === '游客') {
					this.$refs.authority.show({
						title: '请党员认证后再次操作',
						type: 'error'
					})
					return
				}
				this.content = this.announceList.announcement[index]
				this.issuer = this.announceList.issuer[index]
				this.showAnnounce = true
			},
			handleIssue(){
				this.showAnnounce = false
			},
			showMore() {
				if( this.identify === '游客') {
					this.$refs.authority.show({
						title: '请党员认证后再次操作',
						type: 'error'
					})
					return
				}
				uni.navigateTo({
					url: '../moreissuer/moreissuer?isAdmin='+this.isAdmin
				})
			},
			async valicteidentify() {
				let { data } = await this.$myRequest({
					url: '/valicate/identity',
					method: 'post'
				})
				this.isAdmin = data.response.isAdmin
				this.identify = data.response.identity
			},
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			tabsChange(index) {
				this.swiperCurrent = index;
				// this.getVideo(index)
			},
			async getVideo(videoId) {
				this.$refs.loading.open();
				let videoInfor = await this.$myRequest({
					url: '/video/selected',
					method: 'post',
					data: { videoId: videoId }
				})
				if (videoInfor.statusCode === 200) {
					this.$refs.loading.close();
					this.educateList = videoInfor.data.educateList
					this.activityList = videoInfor.data.activityList
					this.knowledgeList = videoInfor.data.knowledgeList
					this.othersList = videoInfor.data.othersList
				} else {
					console.log(videoInfor)
				}
			},
			screenChange(e) {
				if(!e.detail.fullScreen){  
				    this.videoContext.pause()
				    this.showvideo = false
				}
			},
			playVideo(i) {
				this.videoContext.forEach((ele, index) => {
					if(index !== i) {
						this.videoContext[index].pause() 
					}
				})
			},
			async videoEnded(path, id) {
				let clockResult = await this.$myRequest({
					url: '/video/clock',
					method: 'post',
					data: {videoPath: path}
				})
				if (clockResult.statusCode === 200) {
					this.$refs.clockToast.show({
						title: clockResult.data,
						type: clockResult.data === '请实名' ? 'error' : (clockResult.data === '您之前打过卡' ? 'warning' : 'success')
					})
					if(clockResult.data === '该视频打卡成功') {
						this.getVideo(id)
					}
				} else {
					console.log(clockResult)
				}
			},
			showVideo(id) {
				this.getVideo(id)
			},
			play() {
				this.isPause = !this.isPause
			},
			pause() {
				this.isPause = !this.isPause
			},
			handleSubmitError() {
				uni.navigateTo({
					url:"../submitError/submitError?isAdmin="+this.isAdmin+"&state=未解决"
				})
			},
			async getProblemsCount() {
				let {data} = await this.$myRequest({
					url: '/error/getCount'
				})
				this.problemCount = data.count
			},
			handleActivity() {
				if (this.identify === "游客") {
					this.$refs.clockToast.show({
						title: "请进行党员认证后操作",
						type: "error"
					})
					return
				}
				uni.navigateTo({
					url: '../allActivity/allActivity'
				})
			}
		}
	}
</script>

<style>
page {
	background-color: #F8F8F8
}
.video {
	width: 200rpx;
	height: 200rpx;
}
.header {
	width: 100%;
}
.icon {
	top: 15rpx;
	background-color: #fdf6ec;
	position: absolute;
	right: 15rpx;
}
.issueContent {
	position: relative;
}
.annouce-button {
	text-align: center;
	margin-top: 40rpx;
}
.issuer {
	position: absolute;
	bottom: 0rpx;
	right: 30rpx;
}
.videoArea {
	margin: auto;
}
.loading {
	text-align: center;
}
.bgc1,
.bgc2{
	width: 500rpx;
	height: 300rpx;
	background-color: #007AFF;
}
.bgc2{
	background-color: #18B566;
}
.title-style {
	display: inline-block;
	font: 28rpx "Helvetica Neue",Helvetica,Arial,"Microsoft Yahei","Hiragino Sans GB","HeitiSC","WenQuanYi Micro Hei",sans-serif;
	width: 90%;
	line-height: 35rpx;
}
.card-style {
	margin-top: 20rpx;
	border: 1rpx solid #ccc;
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
	z-index: 1000000;
}
.activity {
	bottom: 300rpx;
}
</style>
