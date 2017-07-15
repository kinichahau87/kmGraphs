var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

gulp.task('default', function(){
	return gulp.src('src/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('build', function(){
	return gulp.src('src/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', function(){
	return watch('src/*js', {ignoreInitials:false})
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('buildTest', function(){
	return gulp.src('src/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(uglify())
		.pipe(gulp.dest('../../../../../xampp/htdocs/slim'));
});

