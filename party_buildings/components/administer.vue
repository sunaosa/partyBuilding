<template>
	<view>
		<u-cell-group :border="true">
			<u-cell-item  
				title="管理员操作" 
				:title-style="{'fontSize': '50rpx','fontWeight':'600','color':'#fff'}" 
				:arrow="false" 
				bg-color="#ff7d0b" 
				>
			</u-cell-item>
			<u-cell-item  
				title="党员信息查询" 
				:arrow="true" 
				arrow-direction="right" 
				bg-color="#ff7d0b" 
				:title-style="{'color':'#fff'}" 
				hover-class="cell-hover-class" 
				:border-bottom="true"
				@click="goSelected">
			</u-cell-item>
			<u-cell-item
				title="增添党员信息" 
				:arrow="true" arrow-direction="right" 
				bg-color="#ff7d0b" 
				:title-style="{'color':'#fff'}" 
				hover-class="cell-hover-class"
				:border-bottom="true"
				@click="goInsert">
			</u-cell-item>
			<u-cell-item  
				title="发布通知" 
				:arrow="true" 
				arrow-direction="right" 
				bg-color="#ff7d0b" 
				:title-style="{'color':'#fff'}" 
				hover-class="cell-hover-class"
				:border-bottom="true"
				@click="announce">
			</u-cell-item>
			<u-cell-item  
				title="上传视频" 
				:arrow="true" 
				arrow-direction="right" 
				bg-color="#ff7d0b" 
				:title-style="{'color':'#fff'}" 
				hover-class="cell-hover-class"
				:border-bottom="true"
				@click="upload">
			</u-cell-item>
			<!-- <u-cell-item
				title="更新题库" 
				:arrow="true" arrow-direction="right" 
				bg-color="#fa3534" 
				:title-style="{'color':'#fff'}" 
				hover-class="cell-hover-class"
				:border-bottom="true"
				@click="handleUpdate">
			</u-cell-item> -->
			<u-cell-item
				title="发布活动" 
				:arrow="true" 
				arrow-direction="right" 
				bg-color="#ff7d0b" 
				:title-style="{'color':'#fff'}" 
				hover-class="cell-hover-class"
				:border-bottom="true"
				@click="handleActivity">
			</u-cell-item>
		</u-cell-group>
		<view class="upload_question">
			<upload @upload="uploadFile"></upload>
		</view>
	</view>
</template>

<script>
	import upload from '@/components/pretty-uploadFile/pretty-uploadFile.vue'
	export default {
		components: {
		    upload
		},
		data() {
			return{
				showToast: false,
				showAnnounce: false,
				showUpdateQuestion: false
			}
		},
		methods: {
			goSelected() {
				console.log("111")
				uni.navigateTo({
					url: "/pages/selected/selected"
				})
			},
			goInsert() {
				this.showToast = true
				this.$emit('handleInsert',this.showToast)
			},
			announce() {
				this.showAnnounce = true
				this.$emit('handleAnnounce',this.showAnnounce)
			},
			upload() {
				uni.navigateTo({
					url: "/pages/upload/upload"
				})
			},
			handleUpdate() {
				this.showUpdateQuestion = true
				this.$emit('handleUpdate',this.showUpdateQuestion)
			},
			handleActivity() {
				console.log(111)
				uni.navigateTo({
					url: "/pages/releaseActivity/releaseActivity"
				})
			}
		}
	}
</script>

<style>
	.upload_question {
		position: absolute;
		bottom: 40rpx;
		left: 50%;
		transform: translateX(-50%);
	}
</style>
