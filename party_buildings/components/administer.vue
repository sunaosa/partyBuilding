<template>
	<view>
		
	
	<u-cell-group :border="true">
		<u-cell-item  
			title="管理员操作" 
			:title-style="{'fontSize': '50rpx','fontWeight':'600','color':'#fff'}" 
			:arrow="false" 
			bg-color="#fa3534" 
			>
		</u-cell-item>
		<u-cell-item  
			title="党员信息查询" 
			:arrow="true" 
			arrow-direction="right" 
			bg-color="#fa3534" 
			:title-style="{'color':'#fff'}" 
			hover-class="cell-hover-class" 
			:border-bottom="true"
			@click="goSelected">
		</u-cell-item>
		<u-cell-item
			title="增添党员信息" 
			:arrow="true" arrow-direction="right" 
			bg-color="#fa3534" 
			:title-style="{'color':'#fff'}" 
			hover-class="cell-hover-class"
			:border-bottom="true"
			@click="goInsert">
		</u-cell-item>
		<u-cell-item  
			title="发布通知" 
			:arrow="true" 
			arrow-direction="right" 
			bg-color="#fa3534" 
			:title-style="{'color':'#fff'}" 
			hover-class="cell-hover-class"
			:border-bottom="true"
			@click="announce">
		</u-cell-item>
		<u-cell-item  
			title="上传视频" 
			:arrow="true" 
			arrow-direction="right" 
			bg-color="#fa3534" 
			:title-style="{'color':'#fff'}" 
			hover-class="cell-hover-class"
			:border-bottom="true"
			@click="uploud">
		</u-cell-item>
	</u-cell-group>
		
	</view>
</template>

<script>
	export default {
		data() {
			return{
				showToast: false
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
			}
		}
	}
</script>

<style>
	
</style>
