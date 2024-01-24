const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
	console.log('require("./kq-release.js")')
	require("./kq-release.js")
} else {
	console.log('require("./kq-debug.js")')
	require("./kq-debug.js")
}
