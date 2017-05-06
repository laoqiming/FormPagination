var gulp = require('gulp'),
	less = require('gulp-less'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	md5plus = require('gulp-md5-plus');

gulp.task('copy-demo',function(){
	gulp.src('demo/**')
		.pipe(gulp.dest('dist/demo'));
});
gulp.task('js-process', function() {
  	gulp.src(['src/*.js'])
  		.pipe(uglify())
  		.pipe(rename({suffix:'.min'}))
  		.pipe(gulp.dest("dist"));
  		
});
gulp.task('css-process', function() {
  	gulp.src(['src/*.css'])
  		.pipe(rename({suffix:'.min'}))
  		.pipe(gulp.dest("dist"));
  		
});
gulp.task('default',['copy-demo','js-process','css-process']);