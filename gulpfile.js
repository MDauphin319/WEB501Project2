const { src, dest, watch, parallel, series } = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const del = require('delete');
const terser = require('gulp-terser');
const fs = require('fs');
const md = require('gulp-markdown');
const wrap = require('gulp-wrap');
const frontMatter = require('gulp-front-matter');

function css() {
  return src('source/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(dest('prod/ui/'));
}

function markdown() {
  return src('source/pages/**/*.md')
    .pipe(frontMatter())
    .pipe(md())
    .pipe(wrap({ src: 'source/templates/layout.html' }))
    .pipe(dest('prod'));
}

function js() {
  return src('source/**/*.js')
	.pipe(terser())
	.pipe(dest('prod/ui/'));
}

function picture() {
  return src('source/**/*.jpg').pipe(dest('prod/'));
}

function watch_task() {
  watch('source/scss/**/*.scss', series(css, reload));
  watch('source/**/*.md', series(markdown, reload));
  watch('source/js/**/*.js', series(js, reload));
  watch('source/**/*.jpg', series(picture, reload));
}

function sync(cb) {
  browserSync.init({
    server: { baseDir: 'prod/' }
  });
  cb();
}

function reload(cb) {
  browserSync.reload();
  cb();
}

function clean(cb){
	del('prod/**/*', cb);
}

exports.clean = clean;
exports.build = series(clean, parallel(css, markdown, js, picture));
exports.default = series(exports.build, sync, watch_task);