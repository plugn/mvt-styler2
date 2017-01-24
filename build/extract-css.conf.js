var utils = require('./utils')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {

	vue: {
		loaders: utils.cssLoaders({
			extract: true
		})
	},

	plugins: [
		// extract css into its own file
		new ExtractTextPlugin(utils.assetsPath('css/[name].[contenthash].css'))
	]

}
