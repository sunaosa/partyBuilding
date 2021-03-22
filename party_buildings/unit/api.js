const BASIC_PATH="http://localhost:3000"
export const  myRequest=(options)=> {
	return new Promise((resolve,reject)=>{
		uni.request({
			url: BASIC_PATH + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			success: (res) => {
				if(res.statusCode !== 200){
					uni.showToast({
						title:'获取数据失败'
					})
				} 
				resolve(res);
			},
			fail: (err) => {
				uni.showToast({
					title:'发生错误'
				})
			}
		})
	})
}
