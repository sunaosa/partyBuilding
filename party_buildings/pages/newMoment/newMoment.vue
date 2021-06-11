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
				types: 'image',
				videoContent: {
					dataList: [],
					title: '',
					content: '',
					theme: ''
				},
				show: false,
				content: '发布成功',
				title: '成功',
				identity: '',
				imagePath: []
			}
		},
		methods: {
			async successImage(val) {
				let result = await this.$myRequest({
					url: '/moment/insert',
					method: 'post',
					data: {imagePath: val.imagePath, content: val.content}
				})
				this.show = true
			},
			confirmResult() {
				uni.switchTab({
					url:'../release/release'
				})
			}
		}
	}
</script>

<style>

</style>
