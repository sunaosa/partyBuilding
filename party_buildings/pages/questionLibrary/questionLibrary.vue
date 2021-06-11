<template>
	<view>
		<view class="button">
			<view class="bottons">
				<u-button 
					ripple 
					shape="circle" 
					:loading="ifLoading" 
					size="medium" 
					type="success"
					@click="redirectQuestion"
					>
					查看题库 <u-icon name="order" style="margin-left: 10rpx;"></u-icon>
				</u-button>
			</view>
			<view class="bottons" style="margin-top: 20rpx;">
				<u-button
					ripple 
					shape="circle" 
					:loading="ifLoading" 
					size="medium" 
					type="success"
					@click="downloadFile"
					>
					下载题库 <u-icon name="download" style="margin-left: 10rpx;"></u-icon>
				</u-button>
			</view>
		</view>
		<u-modal v-model="show" :content="content" :title="title" :content-style="{overflowWrap: 'break-word'}" @confirm="confirmDown"></u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
		<u-tabbar v-model="current" :list="list"  active-color='#ff7d0b'></u-tabbar>
	</view>
</template>

<script>
	export default {
		async onLoad() {
			this.list = this.$store.state.list
			this.valicteidentify()
		},
		onShow() {
			if(this.identify === "游客") {
				this.$refs.uTips.show({
					title: '请进行党员认证',
					type: 'error',
					duration: '1300'
				})
			}
		},
		data() {
			return {
				list: [],
				ifLoading: false,
				fileSS: '',
				show: false,
				content: '点击确定打开文档，通过右上角菜单，执行其他软件打开（例wps等文件编辑器）操作',
				title: '存放地址',
				filePaths: '',
				identify: ''
			}
		},
		methods: {
			async redirectQuestion() {
				if(this.identify === "游客") {
					this.$refs.uTips.show({
						title: '请进行党员认证',
						type: 'error',
						duration: '1300'
					}) 
					return
				}
				let filePath = await this.$myRequest({
					url: "/video/getFilePath"
				}) 
				console.log(filePath.data.filePath)
				uni.downloadFile({
					url: filePath.data.filePath, //这个url我采用的是后端的接口路径返回的是pdf流 如：  http://vastwu.com/api/jiekou  
					success:  (res)=> {
						var filePath = res.tempFilePath;
						this.fileSS=filePath;
						uni.openDocument({
							filePath: filePath,
							success: function (res) {
								console.log('打开文档成功');
								uni.hideLoading();
							}
						});
					}
				});
			},
			async downloadFile() {
				if(this.identify === "游客") {
					this.$refs.uTips.show({
						title: '请进行党员认证',
						type: 'error',
						duration: '1300'
					}) 
					return
				}
				let filePath = await this.$myRequest({
					url: "/video/getFilePath"
				}) 
				uni.downloadFile({
					url: filePath.data.filePath,      //文件链接
					success:(res)=>{
						var filePath = res.tempFilePath
						this.fileSS=filePath;
						console.log(this.fileSS)
						uni.saveFile({
							tempFilePath: this.fileSS,
							success:(ress)=>{
								this.filePaths = ress.savedFilePath
								this.show = true
								console.log(ress)
							},
							fail:(err)=>{
								console.log(err)
								console.log(this.fileSS)
							}
						})
					}
				})
			},
			confirmDown() {
				uni.openDocument({
					filePath: this.filePaths,
					showMenu: true,
					success: function (res) {
						console.log('打开文档成功');
						uni.hideLoading();
					}
				});
			},
			async valicteidentify() {
				let { data } = await this.$myRequest({
					url: '/valicate/identity',
					method: 'post',
				})
				this.identify = data.response.identity
			}
		}
	}
</script>

<style>
page {
	background-color: #fdf6ec;
}
.button {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
</style>
