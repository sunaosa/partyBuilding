<template>
	<view>
		<view class="head" :style="{height: '100rpx',width: '100%',position: 'relative'}" style="margin-bottom: 10rpx;">
			<view class="search-state">
				<u-input v-model="state" type="select" border @click="showChoice = true" />
				<u-action-sheet :list="stateList" v-model="showChoice" @click="chooseAction"></u-action-sheet>
			</view>
			<view class="search-identify">
				<u-checkbox-group>
					<u-checkbox 
						v-model="checked" 
						@change="radioChange" 
					>
						与我相关
					</u-checkbox>
				</u-checkbox-group>
			</view>
		</view>
		<view class="body">
			<view v-if="flowList.length===1" class="demo-one">
				<view class="demo-warter" v-for="(item, index) in flowList" :key="index" style="position: relative;" @click="showDetail(item.id, item.oop)">
					<!-- 警告：微信小程序中需要hx2.8.11版本才支持在template中结合其他组件，比如下方的lazy-load组件 -->
					<u-lazy-load threshold="-450" border-radius="10" :image="item.image" :index="index"></u-lazy-load>
					<u-tag  size="mini" :type="item.state==='正在进行'?'success':(item.state==='已结束'?'info':'warning')" :text="item.state" style="position: absolute; top: 15rpx; left: 15rpx;"></u-tag>
					<view class="demo-title">
						{{item.name}}
					</view>
					<view class="demo-tag">
						<view class="demo-tag-owner">
							{{item.startTime}}
							<view class="transition" >
								至
							</view>
						</view>
						
						<view class="demo-tag-text">
							{{item.overTime}}
						</view>
					</view>
				</view>
			</view>
			<view v-if="flowList.length!==1">
				<u-waterfall v-model="flowList" ref="uWaterfall">
					<template v-slot:left="{leftList}">
						<view class="demo-warter" v-for="(item, index) in leftList" :key="index" style="position: relative;" @click="showDetail(item.id, item.oop)">
							<!-- 警告：微信小程序中需要hx2.8.11版本才支持在template中结合其他组件，比如下方的lazy-load组件 -->
							<u-lazy-load threshold="-450" border-radius="10" :image="item.image" :index="index"></u-lazy-load>
							<u-tag  size="mini" :type="item.state==='正在进行'?'success':(item.state==='已结束'?'info':'warning')" :text="item.state" style="position: absolute; top: 15rpx; left: 15rpx;"></u-tag>
							<view class="demo-title">
								{{item.name}}
							</view>
							<view class="demo-tag">
								<view class="demo-tag-owner">
									{{item.startTime+" 至 "+item.overTime}}
								</view>
							</view>
						</view>
					</template>
					<template v-slot:right="{rightList}">
						<view class="demo-warter" v-for="(item, index) in rightList" :key="index" style="position: relative;" @click="showDetail(item.id, item.oop)">
							<u-lazy-load threshold="-450" border-radius="10" :image="item.image" :index="index"></u-lazy-load>
							<u-tag  size="mini" :type="item.state==='正在进行'?'success':(item.state==='已结束'?'info':'warning')" :text="item.state" style="position: absolute; top: 15rpx; left: 15rpx;"></u-tag>
							<view class="demo-title">
								{{item.name}}
							</view>
							<view class="demo-tag">
								<view class="demo-tag-owner">
									{{item.startTime+" 至 "+item.overTime}}
								</view>
							</view>
						</view>
					</template>
				</u-waterfall>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this.getActivity()
		},
		data() {
			return {
				checked: false,
				stateList: [
					{
						text: '正在进行'
					},
					{
					 	text: '未开始'
					},
					{
					 	text: '已结束'
					},
					{
					 	text: '全部'
					}
				],
				showChoice: false,
				state: "",
				flowList: [],
				list: [],
				identify: ""
			}
		},
		methods: {
			addRandomData() {
				// for(let i = 0; i < ; i++) {
				// 	// let index = this.$u.random(0, this.list.length - 1);
				// 	// 先转成字符串再转成对象，避免数组对象引用导致数据混乱
				// 	let item = JSON.parse(JSON.stringify(this.list[i]))
				// 	//item.id = this.$u.guid();
				// 	this.flowList.push(item);
				// 	console.log(this.flowList)
				// }
				this.$refs.uWaterfall.clear()
				this.list.forEach((el, index)=> {
					let item = JSON.parse(JSON.stringify(el))
					item.startTime = item.startTime.slice(0,10)
					item.overTime = item.overTime.slice(0,10)
					item.i = this.$u.guid();
					this.flowList.push(item)
				})
				console.log(this.flowList)
			},
			radioChange() {
				if(this.checked === false) {
					this.valicteidentify()
				}else {
					this.identify=""
					this.getActivity()
				}
			},
			chooseAction(index) {
				if(this.stateList[index].text === '全部'){
					this.state = ""
					this.getActivity()
					return
				}
				this.state = this.stateList[index].text
				this.getActivity()
			},
			async getActivity() {
				this.list = [],
				this.flowList = []
				let { data } = await this.$myRequest({
					url: '/activity/getActivity',
					method: "post",
					data: {identify: this.identify, state: this.state}
				})
				this.list = data
				this.addRandomData();
			},
			async valicteidentify() { 
				let { data } = await this.$myRequest({
					url: '/valicate/identity',
					method: 'post'
				})
				this.identify = data.response.identity
				this.getActivity()
			},
			showDetail(id,oop) {
				console.log(this.identify)
				uni.navigateTo({
					url: "../activityDetail/activityDetail?id="+id+"&oop="+oop
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #DBF1E1;
	}
.head {
	box-shadow: 0 0 10rpx 2rpx #C0C0C0;
}
.search-state {
	width: 300rpx;
	position: absolute;
	left: 30rpx;
	top: 10rpx;
	text {
		margin-top: 21rpx;
	}
}
.search-identify {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	right: 30rpx;

}
.demo-warter {
	border-radius: 8px;
	margin: 5px;
	background-color: #ffffff;
	padding: 8px;
	position: relative;
}
.demo-tag-owner ,
.demo-tag-text{
	font-size: 20rpx;
	color: #F0AD4E;
	position: relative;
}
.transition {
	font-size: 20rpx;
	color: #F0AD4E;
	position: absolute;
	left: 200rpx;
	bottom: -10rpx;
}
.demo-one {
	width: 50%;
	height: 200rpx;
}
</style>
