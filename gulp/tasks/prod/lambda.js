var gulp = require('gulp'),
	lambda = require('gulp-awslambda'),
	fs = require('fs'),
	awspublish = require("gulp-awspublish"),
	zip = require('gulp-zip'),

	aws = JSON.parse(fs.readFileSync('./aws-credentials.json'));


gulp.task('lambda', function () {
	return gulp.src('./app/node-script/**/*')
		.pipe(zip('archive.zip'))
		.pipe(lambda(aws.lambda_params, aws))
});


gulp.task('s3', function() {
	'use strict';
	var publisher = awspublish.create({
		params: {
			Bucket: 'travelmap'
		}
	});


	return gulp.src('./dist/index.html')
		.pipe(publisher.publish())
		.pipe(awspublish.reporter());
});