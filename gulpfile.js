var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	livereload = require('gulp-livereload'),
	lr = require('tiny-lr'),
	nodemon = require('gulp-nodemon'),
	open = require('gulp-open'),
	server = lr();


gulp.task('styles', function() {
  return gulp.src('app/styles/main.scss')
	.pipe(sass({ includePaths : ['app/bower_components/foundation/scss/'] }))
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	.pipe(gulp.dest('public/styles'))
	.pipe(gulp.dest('.tmp/styles'))
	.pipe(rename({suffix: '.min'}))
	.pipe(minifycss())
	.pipe(gulp.dest('public/styles'))
	.pipe(livereload(server))
});

gulp.task('scripts', function() {
  return gulp.src('app/scripts/**/*.js')
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter('jshint-stylish'))
	.pipe(concat('main.js'))
	.pipe(gulp.dest('public/scripts'))
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify())
	.pipe(gulp.dest('public/scripts'))
	.pipe(livereload(server))
});

gulp.task('images', function() {
  return gulp.src('app/images/**/*')
	.pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
	.pipe(gulp.dest('public/images'))
	.pipe(livereload(server))
});

gulp.task('views', function() {
  return gulp.src('app/views/**/*')
	.pipe(livereload(server))
});

gulp.task('clean', function() {
	return gulp.src(['public/styles', 'public/scripts', 'public/images', '.tmp'], {read: false})
		.pipe(clean());
});

gulp.task('watch', function() {

	server.listen(35729, function (err) {
    if (err) {
      return console.log(err)
    };
		gulp.watch('app/styles/main.scss', ['styles']);
		gulp.watch('app/scripts/{,*/}*.js', ['scripts']);
		gulp.watch('app/images/**/*', ['images']);
		gulp.watch('app/views/**/*', ['views']);
	});

});

gulp.task('express-dev', function () {
  nodemon({ script: 'server.js', options: '' })
    //.on('restart', ['styles', 'scripts', 'images'])
});

gulp.task('open', function(){
  var options = {
    url: 'http://localhost:3000'
  };
  gulp.src("./views/index.html")
  .pipe(open('', options));
});

gulp.task('serve', ['clean'], function() {
	gulp.start('styles', 'scripts', 'images', 'express-dev', 'watch', 'open');
});


