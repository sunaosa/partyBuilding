<template>
	<view>
		<view class="head" :style="{height: '100rpx',width: '100%',backgroundColor: '#ff7d0b'}" style="margin-bottom: 10rpx;">
			<view class="activityHead">
				活动圈
			</view>
		</view>
		<view class="body">
			<view class="card-style" v-for="(item,i) in momentList" :key='i'>
				<u-card border  :foot-border-top="true" :border-radius='0' @click="showLike(i)" margin="0 5rpx">
					<view slot="head" border class="head-style clearfix">
						<u-avatar style="border: 1rpx solid #CCCCCC; border-radius: 20rpx;" :src="item.identity === '党员'? '/static/party_member.png':'/static/applicant.png'" class="issuerIdentify"></u-avatar>
						<text class="issuerName">{{item.issuername}}</text>
						<u-icon name="close-circle"@click="handleDelete(item)" class="clear-icon" v-if="userInformation.name === item.issuername||userInformation.isAdmin==='y'"></u-icon>
					</view>
					<view class="body-style" slot="body" border>
						{{item.content}}
						<view v-if="item.imagePaths[0] !== ''">
							<u-grid :col="1" v-if="item.imagePaths.length === 1">
								<u-grid-item v-for=" (el, index) in item.imagePaths" :key="index">
									<image style="width: 100%; height: 400rpx; border: 1rpx solid #fff;" :src="el" mode="aspectFill" @click.stop="previewImage(item.imagePaths,index)" :lazy-load="true"></image>
								</u-grid-item>
							</u-grid>
							<u-grid :col="2" v-if="item.imagePaths.length <= 4 && item.imagePaths.length >= 2">
								<u-grid-item v-for=" (el, index) in item.imagePaths" :key="index">
									<image style="width: 100%; height: 250rpx; border: 1rpx solid #fff;" :src="el" mode="aspectFill" @click.stop="previewImage(item.imagePaths,index)" :lazy-load="true"></image>
								</u-grid-item>
							</u-grid>
							<u-grid :col="3" v-if="item.imagePaths.length <= 9 && item.imagePaths.length >= 5">
								<u-grid-item v-for=" (el, index) in item.imagePaths" :key="index">
									<image style="width: 100%; height: 166rpx; border: 1rpx solid #fff;" :src="el" mode="aspectFill" @click.stop="previewImage(item.imagePaths,index)" :lazy-load="true"></image>
								</u-grid-item>
							</u-grid>
						</view>
					</view>
					<view class="foot-style" slot="foot" border>
						<view class="basic-iformation">
							<text class="time-style">
								{{item.createdAt}}
							</text>
							<text class="more-style" @click.stop="showChoice(i)">
								···
							</text>
							<view class="like-style" style="color: #fff;" v-if="item.isShowLike" @click.stop="handleLike(item.id)">
								<u-icon :name="likeName" color="#fff" size="28"></u-icon>
								{{text}}
							</view>
						</view>
						<view class="likePeople">
							<u-line color="#ccc" />
							<u-icon name="heart-fill" style="margin-right: 15rpx;"></u-icon>
							{{ likeList | filterLikes(item.id) }}
						</view>
					</view>
				</u-card>
			</view>
		</view>
		<u-button 
			color="#ccc" 
			:style="{position: 'fixed', fontSize: '60rpx',fontWeight: 'bold'}" 
			class="handle-refresh" 
			@click="handleNewMoment"
			v-if="userInformation.identity !== '游客'">
			<u-icon name="plus">
				
			</u-icon>
		</u-button>
		<u-toast ref="uToast" />
		<u-toast ref="showApprove" />
		<u-tabbar v-model="current" :list="list"  active-color='#ff7d0b'></u-tabbar>
	</view>
</template>

<script>
	export default {
		filters: {
			filterLikes(likeList, id) {
				let itLikePerson = []
				likeList.forEach((el, index) => {
					if (el.issurId === id) {
						itLikePerson.push(el.likePerson)
					}
				})
				return itLikePerson.join(',')
			}
		},
		async onLoad() {
			let { data } = await this.$myRequest({
				url: '/moment/identity',
				method: 'post'
			})
			this.userInformation = data
			this.list = this.$store.state.list
		},
		async onShow() {
			this.getMoments()
			this.getLikes()
		},
		data() {
			return {
				isShowLike: false,
				list: [],
				current: 1,
				content: '',
				text: '点赞',
				momentList: [],
				userInformation: {},
				likeName: 'heart',
				likeList: []
			}
		},
		
		methods: {
			async getLikes() {
				let { data }  = await this.$myRequest({
					url: '/moment/selectedLike',
					method: 'get'
				})
				this.likeList = data
			},
			async getMoments() {
				let { data } = await this.$myRequest({
					url: '/moment/selected',
					method: 'get'
				})
				this.momentList = data
			},
			showChoice(el){
				this.momentList.forEach((item,i)=>{
					if(i === el){
						this.momentList[i].isShowLike = !this.momentList[i].isShowLike
					} else {
						this.momentList[i].isShowLike = false
					}
				})
			},
			showLike(el) {
				this.momentList.forEach((item,i)=>{
					item.isShowLike = false
				})
			},
			handleNewMoment() {
				uni.navigateTo({
					url:'../newMoment/newMoment'
				})
			},
			async handleLike(issuerId) {
				if (this.userInformation.identity === '游客') {
					this.$refs.showApprove.show({
						title: '请实名认证',
						type: 'error'
					})
					return
				}
				let { data } = await this.$myRequest({
					url: '/moment/insertLike',
					method: 'post',
					data: {issuerId: issuerId}
				})
				this.getLikes()
			},
			previewImage(path,index) {
				console.log(path)
				let photoList = path.map(item => {
				    return item.src;
				});
				uni.previewImage({
				    current: index,     // 当前显示图片的链接/索引值
				    urls: path    // 需要预览的图片链接列表，photoList要求必须是数组
				});
			},
			async handleDelete(item) {
				let { data } = await this.$myRequest({
					url: '/moment/delete',
					data: {id: item.id},
					method: 'post'
				})
				if(data === 'success'){
					this.getMoments()
					this.$refs.uToast.show({
						title: '删除成功',
						type: 'success'
					})
				} 
 			}
		}
	}
</script>

<style>
page{
	background-color: #F8F8F8;
}
.activityHead {
	font-weight: bold;
	color: #f9f9f9;
	line-height: 100rpx;
	margin-left: 30rpx;
}
.foot-style {
	border-top: 1px solid #CCCCCC;
	position: relative;
}
.card-style {
	border: 1rpx solid #DCDCDC;
}
.issuerName {
	position: absolute;
	top: 50%; 
	transform: translate(32rpx,-50%);
	font-size: 40rpx;
	font-weight: bold;
	color: #a1a1a1;
}
.input-comment {
	border: 1rpx solid #DCDCDC ;
	border-radius: 20rpx;
	height: 60rpx;
	width: 100%;
	margin: auto;
	line-height: 60rpx;
	padding-left: 20rpx;
}
.issuerIdentify {
	float: left;
}
.clearfix:after{/*伪元素是行内元素 正常浏览器清除浮动方法*/
    content: "";
    display: block;
    height: 0;
    clear:both;
    visibility: hidden;
}
.head-style {
	/* background-color: #e2e2e2; */
	position: relative;
}
.body-style {
	font-size: 28rpx;
	display: block;
	overflow-wrap: break-word;
	color: #5f5f5f;
}
.image-style {
	width: 100%;
	height: 100%;
}
.more-style {
	position: absolute;
	top: 5rpx;
	right: 10rpx;
	width: 50rpx;
	height: 40rpx;
	background-color: #83868b;
	font-weight: bold;
	color: #fff;
	text-align: center;
	border-radius: 3rpx;
	z-index: 0;
}
.like-style {
	position: absolute;
	text-align: center;
	height: 50rpx;
	width: 130rpx;
	right: 70rpx;
	top: 0rpx;
	background-color: rgba(0,0,0,.5);
	padding-top: 10rpx;
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
.clear-icon {
	color: #ccc;
	position: absolute;
	right: 20rpx;
}
.likePeople {
	margin-top: 20rpx;
	overflow-wrap: break-word;
}
</style>
