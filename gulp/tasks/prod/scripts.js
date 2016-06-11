/*global require */
(function (require) {
    'use strict';
    var gulp = require('gulp'),
        gutil = require('gulp-util'),
        webpack = require('webpack'),
        rename = require('gulp-rename'),
        webpackConfig = require('../../../webpack.config.js');




    gulp.task('webpack', function (callback) {
        // run webpack
        webpack(webpackConfig, function (err, stats) {
            if (err) {
                throw new gutil.PluginError('webpack', err);
            }
            gutil.log('[webpack]', stats.toString({
                // output options
            }));
            callback();
        });
    });


    gulp.task('scripts', ['webpack'], function () {
        return gulp.src('./build/scripts/app.js')
            .pipe(rename({
                suffix: '.min'
            }))

            .pipe(gulp.dest('./build/scripts'));
    });
}(require));
