/*global module, __dirname, require */
var path = require('path'),
    webpack = require('webpack');
console.log(__dirname);
module.exports = {
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery'


        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            mangle: false
        })
    ],


    entry: './app/scripts/custom/main.js',
    resolve: {

        moduleDirectories : [ '../../node_modules' ],
        alias: {

            jquery: 'jquery/dist/jquery',
            d3: 'd3/d3',
            datamaps: 'datamaps/dist/datamaps.world.js',
            nprogress: 'nprogress/nprogress'
        }
    },
    output: {
        filename: path.join(__dirname + '/dist/app.js')
    }
};
