<template>
	<view>
		<easy-upload
			ref='upload'
			:dataList="videoContent.dataList" 
			:types="types"
			uploadUrl="https://www.yik.ink/sockets/union/uploadFile.php" 
			@successVideo="successvideo"
			:autoUpload="false"
			@successImage="successImage"
		/>
		<u-modal v-model="show" :content="content" :title='title' :title-style="{color: 'green'}" @confirm='confirmResult'></u-modal>
	</view>
</template>

<script>
	import easyUpload from '@/components/easy-upload/easy-upload.vue'
	export default {
		components:{
			
			easyUpload
		},
		data() {
			return {
				dataList: [],
				types: 'video',
				videoContent: {
					dataList: [],
					title: '',
					content: '',
					theme: ''
				},
				show: false,
				content: '上传成功',
				title: '成功'
			}
		},
		
		methods: {
			async successvideo(val) {
				let result = await this.$myRequest({
					url: '/video/upload',
					method: 'post',
					data: val
				})
				console.log(result)
				if (result.statusCode === 200){
					this.show = true
				} 
			},
			confirmResult() {
				uni.switchTab({
					url: '../mine/mine'
				})
			}
		}
	}
</script>

<style>

</style>
