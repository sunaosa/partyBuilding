const BASIC_PATH="http://192.168.137.1:3000"
export const  myRequest=(options)=> {
	return new Promise((resolve,reject)=>{
		uni.request({
			url: BASIC_PATH + options.url,
			method: options.method || 'GET',
			header:{Auhorization: uni.getStorageSync("myToken")},
			data: options.data || {},
			success: (res) => { 
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
