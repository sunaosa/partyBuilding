<template>
	<view>
		<view class="content" v-if="types == 'image' && !autoUpload">
			<u-input type="textarea" :border="true" placeholder="请输入内容" v-model="moment"/>
		</view>
		<view class="upload">
			<block v-for="(upload,index) in uploads" :key="index">
				<view class="uplode-file">
					<image v-if="types == 'image'" class="uploade-img" :src="uploads" :data-src="uploads" @tap="previewImage"></image>
					<image v-if="types == 'image'" class="clear-one-icon" :src="clearIcon" @tap="delImage(index)"></image>
					<video v-if="types == 'video'" class="uploade-img" :src="upload" controls>
						<cover-image v-if="types == 'video'" class="clear-one-icon" :src="clearIcon" @tap="delImage(index)"></cover-image>
					</video>
				</view>
			</block>
			<view v-if="uploads.length < uploadCount" :class="uploadIcon ? 'uploader-icon' : 'uploader-input-box'">
				<view v-if="!uploadIcon" class="uploader-input" @tap="chooseUploads"></view>
				<image v-else class="image-cion" :src="uploadIcon" @tap="chooseUploads"></image>
			</view>
		</view>	
		<view class="content" v-if="types == 'video' && !autoUpload">
			<u-input type="text" :border="true" placeholder="请输入标题" v-model="videoContent.title"/>
			<u-input type="select" :border="true" placeholder="主题" v-model="videoContent.theme" @click='show = true'/>
			<u-action-sheet :list="actionSheetList" v-model="show" @click="actionSheetCallback"></u-action-sheet>
		</view>
		<u-button type="primary" v-if="types == 'image' && !autoUpload" @click="unifiedUpload" :loading="isImageLoading">上传</u-button>
		<u-button type="primary" v-if="types == 'video' && !autoUpload" @click="handleUploadVideo" :loading="loading">上传</u-button>
	</view>
</template>

<script>
	export default{
		props: {
			types: {
				type: String,
				default: 'image'
			},
			dataList: {
				type: Array,
				default: function() {
					return []
				}
			},
			clearIcon: {
				type: String,
				default: 'http://img1.imgtn.bdimg.com/it/u=451604666,2295832001&fm=26&gp=0.jpg'
			},
			uploadIcon: {
				type: String,
				default: ''
			},
			uploadUrl: {
				type: String,
				default: ''
			},
			deleteUrl: {
				type: String,
				default: ''
			},
			uploadCount: {
				type: Number,
				default: 9
			},
			//上传图片大小 默认3M
			upload_max: {
				type: Number,
				default: 25
			},
			autoUpload: {
				type: Boolean,
				default: false
			}
		},
		data(){
			return {
				//上传的图片地址
				uploadImages: [],
				isImageLoading: false,
				//展示的图片地址
				uploads: [],
				// 超出限制数组
				exceeded_list: [],
				// 视频地址
				videoPath: '',
				actionSheetList: [{
					text: '思想教育',
					value: '思想教育'
				},{
					text: '党务知识',
					value: '党务知识'
				},{
					text: '党建活动',
					value: '党建活动'
				},{
					text: '其他',
					value: '其他'
				}],
				show: false,
				videoContent: {
					title: '',
					theme: ''
				},
				moment:'',
				loading: false,
				imagePath: '',
				pathList: []
			}
		},
		watch:{
			dataList:{
				handler(val){
					this.uploads = val;
				},
				immediate: true
			}
		},
		methods:{
			previewImage (e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.dataList
				})
			},
			chooseUploads(){
				switch (this.types){
					case 'image': 
						uni.chooseImage({
							count: this.uploadCount - this.uploads.length, //默认9
							sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
							sourceType: ['album', 'camera'], //从相册选择
							success: (res) => {
								for(let i = 0; i< res.tempFiles.length; i++){
									if(Math.ceil(res.tempFiles[i].size / 1024) < this.upload_max * 1024){
										this.uploads.push(res.tempFiles[i].path)
										if(this.autoUpload){
											this.uploadFile(res.tempFiles[i].path)
										}else{
											this.uploadImages.push(res.tempFiles[i].path);
										}
									}else {
										this.exceeded_list.push(i === 0 ? 1 : i + 1);
										uni.showModal({
											title: '提示',
											content: `第${[...new Set(this.exceeded_list)].join(',')}张图片超出限制${this.upload_max}MB,已过滤`
										});
									}
								}
							},
							fail: (err) => {
								uni.showModal({
									content: JSON.stringify(err)
								});
							}
						});
					break;
					case 'video' :
						uni.chooseVideo({
							sourceType: ['camera', 'album'],
							success: (res) => {
								if(Math.ceil(res.size / 1024) < this.upload_max * 1024){
									this.uploads.push(res.tempFilePath)
									this.videoPath = res.tempFilePath
								}else {
									uni.showModal({
										title: '提示',
										content: `第${[...new Set(this.exceeded_list)].join(',')}张视频超出限制${this.upload_max}MB,已过滤`
									});
								}
							},
							fail: (err) => {
								uni.showModal({
									content: JSON.stringify(err)
								});
							}
						});
					break;
				}
			},
			delImage(index){
				//第一个是判断app或者h5的 第二个是判断小程序的
				if(this.uploads[index].substring(0,4) !== 'http' || this.uploads[index].substring(0,11) == 'http://tmp/'){
					this.uploads.splice(index,1)
					return;
				};
				if(!this.deleteUrl) {
					uni.showModal({
						content: '请填写删除接口'
					});
					return;
				};
				uni.request({
					url: this.deleteUrl,
					method: 'DELETE',
					data: {
						image: this.dataList[index]
					},
					success: res => {
						if(res.data.status == 1) {
							uni.showToast({
								title: '删除成功'
							})
							this.uploads.splice(index,1)
						}
					},
				});
			},
			uploadFile(path){
				console.log(path)
				return new Promise((resolve,reject)=>{
					uniCloud.uploadFile({
						// url: this.uploadUrl, //仅为示例，非真实的接口地址
						filePath: path,
						name: 'file',
						cloudPath: Date.now() + '.jpg',
						// formData:   '\r\n--XXX' +
						// 			'\r\nContent-Disposition: form-data; name="file"' +
						// 			'\r\n' + path,
						success: (res) => {
							// console.log(uploadFileRes.fileID)
							console.log(path)
							// console.log(uploadFileRes)
							// let imagePath = JSON.parse(uploadFileRes.data).url
							let imagePath = res.fileID
							console.log(imagePath)
							resolve(imagePath)
						},
						fail(err) {
							console.log(err)
						}
					});
				})
			},
			uploadVideo(path) {
				uniCloud.uploadFile({
					// url: this.uploadUrl, //仅为示例，非真实的接口地址
					filePath: path,
					name: 'file',
					cloudPath: Date.now() + '.mp4',
					// formData: '\r\n--XXX' +
					// 		  '\r\nContent-Disposition: form-data; name="file"' +
					// 		  '\r\n' + path,
					//请求参数
					success: (uploadFileRes) => {
						// let videoPath = JSON.parse(uploadFileRes.data).url
						this.$emit('successVideo',{videoPath: uploadFileRes.fileID, title: this.videoContent.title, theme: this.videoContent.theme})
					}
				});
			},
			async unifiedUpload(){
				this.isImageLoading = true
				if(!this.uploadUrl) {
					uni.showModal({
						content: '请填写上传接口'
					});
					return;
				};
				if (this.uploadImages.length === 0) {
					console.log(111)
					this.$emit('successImage',{imagePath: '', content: this.moment})
				}
				else{
					for (let i of this.uploadImages) {
						let path = await this.uploadFile(i)
						this.pathList.push(path)
						console.log(path)
					}
					console.log(this.pathList)
					this.$emit('successImage',{imagePath: this.pathList.join(','), content: this.moment})
				}
			},
			handleUploadVideo() {
				this.loading = true
				if(!this.uploadUrl) {
					uni.showModal({
						content: '请填写上传接口'
					});
					return;
				}
				this.uploadVideo(this.videoPath)
			},
			actionSheetCallback(index) {
				this.videoContent.theme = this.actionSheetList[index].value;
			}
		}
	}
</script>

<style scoped>
	.upload {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	.uplode-file {
		margin: 10upx;
		width: 210upx;
		height: 210upx;
		position: relative;
	}
	.uploade-img {
		display: block;
		width: 210upx;
		height: 210upx;
	}
	.clear-one{
		position: absolute;
		top: -10rpx;
		right: 0;
	}
	.clear-one-icon{
		position: absolute;
		width: 20px;
		height: 20px;
		top: 0;
		right: 0;
		z-index: 9;
	}
	.uploader-input-box {
		position: relative;
		margin:10upx;
		width: 208upx;
		height: 208upx;
		border: 2upx solid #D9D9D9;
	}
	.uploader-input-box:before,
	.uploader-input-box:after {
		content: " ";
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		background-color: #D9D9D9;
	}
	.uploader-input-box:before {
		width: 4upx;
		height: 79upx;
	}
	.uploader-input-box:after {
		width: 79upx;
		height: 4upx;
	}
	.uploader-input-box:active {
		border-color: #999999;
	}
	.uploader-input-box:active:before,
	.uploader-input-box:active:after {
		background-color: #999999;
	}
	.uploader-input {
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
	.uploader-icon{
		position: relative;
		margin:10upx;
		width: 208upx;
		height: 208upx;
	}
	.uploader-icon .image-cion{
		width: 100%;
		height: 100%;
	}
</style>
