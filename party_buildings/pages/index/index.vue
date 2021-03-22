<template>
	<view>
		<view class="">
			
		</view>
		<u-tabbar v-model="current" :list="list" :mid-button="true" ></u-tabbar>
	</view>
</template>

<script>
	export default {
		async onLoad() {
			this.list = this.$store.state.list
			var autoLoginId = uni.getStorageSync("idVerification")
			var login_result=await this.$myRequest({
				url: "/users/autoLogin",
				data: {autoLoginId: autoLoginId},
				method: "post"
			})
			if(login_result.data !== "ok") {
				await uni.showLoading({
					title:"未登录"
				})
				setTimeout(()=>{
					uni.redirectTo({
						url:"../login/login"
					})
					uni.hideLoading()
				},2000)
			}
		},
		data() {
			return {
				list: [],
				current: 0
			}
		},
		methods: {
		}
	}
</script>

<style>

</style>
