<template>
	<view>
		<view class="">
			
		</view>
		<u-tabbar v-model="current" :list="list" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this.list = this.$store.state.list
		},
		data() {
			return {
				list: [],
				current: 1
			}
		},
		methods: {
		}
	}
</script>

<style>

</style>
