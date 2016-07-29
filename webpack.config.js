/*global module, __dirname, require */
var path = require('path'),
    webpack = require('webpack');
module.exports = {
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery'


        })
        /*new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            mangle: false
        })*/
    ],


    entry: './app/scripts/custom/main.js',
    resolve: {

        alias: {
            jquery: 'jquery/dist/jquery',
            datamaps: 'datamaps/dist/datamaps.world.js',
            nprogress: 'nprogress/nprogress'
        }
    },
    output: {
        filename: path.join(__dirname + '/dist/app.js')
    }
};
