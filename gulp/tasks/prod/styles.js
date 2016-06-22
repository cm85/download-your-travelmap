/*global require, __dirname */
(function (require) {
    'use strict';
    var gulp = require('gulp'),
        path = require('path'),
        config = require('../../config'),
        rename = require('gulp-rename'),
        csso = require('gulp-csso'),
        please = require('gulp-pleeease'),
        minifycss = require('gulp-minify-css'),
        concat = require('gulp-concat'),
    //sassLint = require('gulp-sass-lint'),
        sass = require('gulp-sass'),
        SASS_INCLUDE_PATHS = [
            path.join(__dirname, '/node_modules/normalize-css')
        ];

    gulp.task('styles', ['svg'], function () {
        return gulp.src('./app/styles/main.scss')
            // 1 . SASS
            /*.pipe(sassLint({
             'config': '.scss-lint.yml'
             }))
             .pipe(sassLint.format())
             //.pipe(sassLint.failOnError())*/
            .pipe(sass({includePaths: SASS_INCLUDE_PATHS
                }
                ))
            // 2. autoprefixing
            .pipe(please(config.please))

            // 4. concat them all
            .pipe(concat('app.css'))

            .pipe(gulp.dest('build/styles'))
            .pipe(rename({
                suffix: '.min'
            }))
            // 5. optimize
            .pipe(csso())
            // 6. minify
            .pipe(minifycss())
            // 7. save to app.min.css
            .pipe(gulp.dest('build/styles'));
    });
}(require));
