/**
 * GET请求封装
 */
function get(url, data = {}) {
	return request(url, data, 'GET');
}

function put(url, data = {}) {
	return request(url, data, 'put');
}

function deletes(url, data = {}) {
	return request(url, data, 'delete');
}
/**
 * POST请求封装
 */

function post(url, data = {}) {
	return request(url, data, 'POST');
}
/**
 * 微信的request
 */
//#ifdef H5
const BASEURL = ''
//#endif

//#ifndef H5
const BASEURL = getApp().globalData.url
//#endif

function request(url, data = {}, method = "GET") {
	return new Promise(function(resolve, reject) {
		uni.showLoading({
			title: "加载中"
		});
		uni.request({
			url: BASEURL + url,
			method: method,
			data: data,
			header: {
				'mini-session': uni.getStorageSync('session') || '',
				'Accept': 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json'
			},

			success(res) {
				if (res.data) {
					if (res.data.error) {
						if (res.data.error.code != 404) {
							uni.showToast({
								title: res.data.error.message,
								icon: 'none'
							});
						}

						if (res.data.error.code == 9999) {
							uni.clearStorageSync('session');
							uni.showToast({
								title: '登录失效，请重新登录',
								icon: 'none'
							});
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/login/login'
								});
							}, 1000);
						}

						reject(res.data.error.message);
					} else {
						resolve(res.data);
					}
				} else {
					resolve(null);
					uni.hideLoading();
				}
			},

			fail(res) {
				console.log(res);
				uni.showToast({
					title: '请求超时，请重试',
					icon: 'none'
				}); // wx.hideLoading()
			}

		});
	});
}



module.exports = {
	get,
	post,
	put,
	deletes,
};
