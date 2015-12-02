'use strict';

const gulp   = require('gulp');
const rimraf = require('rimraf');
const concat = require('gulp-concat');
const babel  = require('gulp-babel'); // also need babel-preset-es2015
const uglify = require('gulp-uglify');
const gutil  = require('gulp-util');
const run    = require('gulp-run');
const addsrc = require('gulp-add-src');
const ngAnnotate = require('gulp-ng-annotate');

const paths = {
  filesrc: 'source/**/*',
  codesrc: 'source/**/*.js',
  htmlsrc: 'source/**/*.html',
  csssrc: 'source/**/*.css',
  dest: 'public'
}

gulp.task('default', ['build', 'watch']);

gulp.task('watch', function() {
  gulp.watch(paths.filesrc, ['build']);
});

gulp.task('build', ['clean', 'bower'], function() {
  gulp.src(paths.codesrc)
    .pipe(concat('bundle.js'))
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(addsrc(paths.htmlsrc))
    .pipe(addsrc(paths.csssrc))
    .pipe(gulp.dest(paths.dest))
    .on('error', gutil.log);
});

gulp.task('clean', function(cb) {
  rimraf(paths.dest, cb);
});

gulp.task('bower', function(cb) {
  run('bower i').exec(cb);
});
