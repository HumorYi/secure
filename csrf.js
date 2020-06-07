// 验证码
const ccap = require('ccap')()
const cache = new Map()

// token
const token = require('jsonwebtoken')

module.exports = {
	verificationCode: {
		async generator(ctx, next, timer=true, interval=60000) {
			const data = ccap.get()
			const userId = ctx.cookies.get('userId')

			this.setCache(userId, data[0])

			ctx.body = data[1]

			// 可以在此处设置验证码的存活时间
			timer && setTimeout(() => this.removeCache(userId), interval)
		},
		setCache(userId, data) {
			cache.set(userId, data)
		},
		removeCache(userId) {
			cache.delete(userId)
		},
		validCache(userId, data) {
			return data && cache[userId] === data
		}
	},
	token: {
		generator() {},
		verify() {}
	},
	referer(referer, domian) {
		if(!new RegExp(`^https?:\/\/${domian}`).test(ctx.request.headers.referer)) {
		  throw new Error('illegal request')
		}
	}
}