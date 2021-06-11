<template>
	<view>
		<!-- 上传文件 begin -->
		<view class="display_flex">
			<view class="img_list" v-for="(item,index) in fileList" :key="index">
				<image class="img_item" :src="item.url" @click="preview(item.url)" mode="aspectFill" v-if="item.book == 'img'"></image>
				<view class="upload" @click="prePdf(item.id)" v-else>
					<text class="iconfont iconpdf" style="color:#FF6969;font-size:44px"></text>
				</view>
				<view class="iconfont deleteicon iconshanchu2" @click.stop="delteFile(index)"></view>
			</view>
			<!-- <view class="upload img_list" @click="upload('img')">
				<view class="iconfont iconziyuan" style="font-size:20px;"></view>
				上传照片
			</view> -->
			<view class="upload img_list" @click="upload('file')">
				<view class="iconfont iconshangchuanwenjian fileicon"></view>
				更新题库
			</view>
		</view>
		<!-- 上传文件 end -->
	</view>
</template>

<script>
	import {
		get,
		post
	} from '../utils/request.js'
	import {
		uploadImage,
		uploadPdf
	} from '../utils/uploadimage.js'
	import {
		previepdf
	} from '../utils/openpdf.js'
	export default {
		name: 'upload',
		model: {
			prop: "showPop",
			event: "change"
		},
		props: {
			limitnumber: {
				type: Number,
				default: 10
			},
		},
		data() {
			return {
				fileList: []
			}
		},
		methods: {
			/**
			 * @description 上传文件
			 */
			upload(book) {
				if (this.fileList.length == this.$props.limitnumber) {
					uni.showToast({
						title: '文件上传已上限',
						icon: 'none'
					})
					return
				}
				if (book == 'img') {
					uploadImage().then(res => {
						this.fileList.push({
							url: res.imageurl,
							id: res.uploadId,
							book: 'img'
						})
						this.$emit('upload',this.fileList)
					})
				} else {
					uploadPdf().then(res => {
						this.fileList.push({
							id: res.uploadId,
							book: 'file'
						})
					})
					this.$emit('upload',this.fileList)
				}
			},

			/**
			 * @description 预览图片
			 */
			preview(url) {
				uni.previewImage({
					urls: [url],
					current: url
				})
			},
			/**
			 * @description 预览pdf
			 */
			
			prePdf(e) {
					let id = `/api/v1/consumer/download/${e}` // 下载pdf文件的借口地址
					previepdf(id)
				},
			/**
			 * @description 删除上传的文件
			 */
			delteFile(index) {
				this.fileList.splice(index, 1)
				this.$emit('upload',this.fileList)
			},
		}
	}
</script>

<style>
	@import "./pretty-uploadFile.css";

	.display_flex {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
	}

	.fileicon {
		font-size: 25px;
	}

	/* 上传图片 */
	.img_list {
		width: 70px;
		height: 70px;
		border-radius: 5px;
		margin: 10px 5px;
		position: relative;
	}

	.img>image {
		width: 70px;
		height: 70px;
		border-radius: 5px;
	}

	.img_item {
		width: 70px;
		height: 70px;
		border-radius: 5px;
	}

	.upload {
		height: 70px;
		width: 70px;
		background-color: ##ff7d0b;
		border: 1px dashed rgb(224, 223, 223);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 14px;
		color: #fff;
		word-break: break-all;
		overflow: hidden;
	}

	.deleteicon {
		position: absolute;
		font-size: 20px;
		color: #F93313;
		top: -10px;
		right: -6px;
		background-color: #fff;
		border-radius: 50%;
	}
</style>
