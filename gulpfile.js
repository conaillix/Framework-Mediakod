const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const bulkSass = require('gulp-sass-bulk-import');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const gutil = require("gulp-util");
/*
 * GULP TASK
 *
 */
// Define css Task
const cssConfig = {
   src : 'src/assets/scss/style.scss',
   watch: 'src/assets/scss/**/*.scss',
   filename: 'style.css',
   dest: './src/assets/css/',
   autoPrefixer: "last 2 versions"
};
const cssTask = () => {
   return gulp.src(cssConfig.src)
       .pipe(bulkSass())
       .pipe(sourcemaps.init())
       .pipe(
           sass({outputStyle: 'compressed'})
           .on('error', sass.logError)
       )
       .pipe(autoprefixer())
       .pipe(cleanCSS({compatibility: 'ie8'}))
       .pipe(rename(cssConfig.filename))
       .pipe(sourcemaps.write(''))
       .pipe(gulp.dest(cssConfig.dest))
       .pipe(browserSync.stream());
}
// const gutenbergCssConfig = {
//    src : 'components/gutenberg.scss',
//    watch: 'components/**/*.scss',
//    filename: 'gutenberg.css',
//    dest: './public/css/',
//    autoPrefixer: "last 2 versions"
// };
// const gutenbergCssTask = () => {
//    return gulp.src(gutenbergCssConfig.src)
//        .pipe(bulkSass())
//        .pipe(sourcemaps.init())
//        .pipe(
//            sass({outputStyle: 'compressed'})
//            .on('error', sass.logError)
//        )
//        .pipe(autoprefixer({
//            browsers: gutenbergCssConfig.autoPrefixer,
//            cascade: true
//        }))
//        .pipe(minifyCss({keepSpecialComments: 1}))
//        .pipe(rename(gutenbergCssConfig.filename))
//        .pipe(sourcemaps.write(''))
//        .pipe(gulp.dest(gutenbergCssConfig.dest))
//        .pipe(browserSync.stream());
// }
// Define js Task
const jsConfig = {
   src: 'src/assets/js/**/*.js',
   watch : 'src/assets/js/**/*.js',
   filename: 'app.min.js',
   dest: './public/js/'
};
// const generateJsDoc = (cb) => {
//    const config = require('./jsdoc.config.json');
//    return gulp.src(['./components/**/*.js'], {read: false})
//        .pipe(jsdoc(config, cb));
// }
const jsTask = () => {
   //generateJsDoc();
   return gulp.src(jsConfig.src)
       .pipe(sourcemaps.init())
       .pipe(babel())
       .pipe(uglify())
       .pipe(concat(jsConfig.filename))
       .pipe(sourcemaps.write())
       .pipe(gulp.dest(jsConfig.dest))
       .pipe(browserSync.stream());
}
// Server task
gulp.task('serve', function(done) {
   browserSync.init({
      server: {
        baseDir:"src", 
        index: "app.html"
      }, 
      port: 3010,
      ui: {
         port: 3020
      },
   });
   // buildFractalUI();
   gulp.watch(cssConfig.watch, cssTask);
   gulp.watch(jsConfig.watch, jsTask);
   // gulp.watch(gutenbergCssConfig.watch, gutenbergCssTask);
   gulp.watch([
       '**/*.html',
   ]).on('change', browserSync.reload);
   done();
});
// Default task
// Run cssTask, jsTask and serverTask
gulp.task('default', gulp.series('serve', (done) => {
   done();
}))