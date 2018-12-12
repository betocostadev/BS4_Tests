'use strict';
/* Gulp file using Gulp Ver4 - Different from the ver 3 setup.
For help go here: https://github.com/gulpjs/gulp/blob/master/README.md */
import gulp from 'gulp';
import sass from 'gulp-sass';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import del from 'del';
import imagemin from 'gulp-imagemin';
import browserSync from 'browser-sync';

/* Browser Sync config */
const files = [
    './*.html',
    './css/*.css',
    './js/*.js',
    './img/*.{png,jpg,gif}'
];
const server = browserSync.create();
function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init(files, {
    server: {
        baseDir: './'
    },
    browser: ["chrome"]
  });
  done();
}


const paths = {
  styles: {
    src: './css/*.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: './js/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: './img/*.{jpg,jpeg,png,gif}',
    dest: 'dist/img/'
  }
};

/*
 * For small tasks you can export arrow functions
 */
export const clean = () => del([ 'dist' ]);

/*
 * You can also declare named functions and export them as tasks
 */
export function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sass())
    .pipe(cleanCSS())
    // pass in options to the stream
    .pipe(rename({
      basename: 'styles',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

export function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function images() {
  return gulp.src(paths.images.src, {since: gulp.lastRun(images)})
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(paths.images.dest));
}

 /*
  * You could even use `export as` to rename exported tasks
  */
function watchFiles() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.images.src, images);
}
export { watchFiles as watch };


const build = gulp.series(clean, gulp.parallel(styles, scripts, images));
/*
 * Export a default task
 */
export default build;

/* Browser Sync final touches - FIX THIS */

// const watch = () => gulp.watch(paths.scripts.src, paths.styles.src, gulp.series(scripts, styles, reload));
// const dev = gulp.series(clean, scripts, serve, watch);
// export { dev as start};