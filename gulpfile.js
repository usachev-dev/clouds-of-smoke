const gulp = require('gulp'),
  postcss = require('gulp-postcss'),
  sass = require('gulp-sass')(require('sass')),
  autoprefixer = require('autoprefixer'),
  gulpWatch = require('gulp-watch'),
  through = require('through2'),
  exec = require('child_process').exec,
  rename = require('gulp-rename'),
  inject = require('gulp-inject-string');
;

var myHash = (function () {
  var result = '';
  var characters = 'abcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for (var i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
})();

const cssGlob = './assets/styles/styles.scss',
  fontsGlob = ['./assets/fonts/**/*', './node_modules/@fortawesome/fontawesome-free/webfonts/**/*'],
  clientJsGlob = './client/src/**/*',
  assetsGlob = './assets/**',
  logoSvgGlob = './assets/logo/SVG/**/*',
  localesGlob = './assets/locales/**/*',
  imagesGlob = './assets/images/**/*',
  htmlGlob = './templates/**/*.html'
;

let isWatching = false

function src(glob) {
  let result
  if (isWatching) {
    result = gulpWatch(glob, {ignoreInitial: false, verbose: true})
  } else {
    result = gulp.src(glob)
  }
  return result
}

gulp.task('watch:on', function (cb) {
  isWatching = true;
  cb();
});

gulp.task('html', () => {
  return src(htmlGlob)
    .pipe(gulp.dest('./dist/templates'))
})

gulp.task('css', gulp.series(() => {
  return src(cssGlob)
    .pipe(sass())
    .pipe(postcss([autoprefixer]))
    .pipe(rename('styles.' + myHash + '.css'))
    .pipe(gulp.dest('./dist'))
}, () => {
  return gulp.src('./dist/templates/layout.html')
    .pipe(inject.replace('styles.css', 'styles.' + myHash + '.css'))
    .pipe(gulp.dest('./dist/templates'))
}))

gulp.task('cssdev', () => {
  return src(cssGlob)
    .pipe(sass().on('error', function (err) {
      console.error(err)
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('fonts', () => {
  return src(fontsGlob)
    .pipe(gulp.dest('./dist/fonts'))
})

gulp.task('favicon', () => {
  return src("./assets/favicon.ico")
    .pipe(gulp.dest('./dist'))
})

gulp.task('logoSvg', () => {
  return src(logoSvgGlob)
    .pipe(gulp.dest('./dist/logo/SVG'))
    .pipe(gulp.dest('./dist/dist/logo/SVG'))
})

gulp.task('locales', () => {
  return src(localesGlob)
    .pipe(gulp.dest('./dist/locales'))
})

gulp.task('images', () => {
  return src(imagesGlob)
    .pipe(gulp.dest('./dist/images'))
})

gulp.task("clientjs", () => {
  return src(clientJsGlob)
    .pipe(
      through.obj(function (chunk, enc, cb) {
        exec('npm run build-client', function (err, stdout, stderr) {
          if (err) {
            console.error(err)
          }
          cb(null, chunk)
        })
      })
    )
})

gulp.task('default', gulp.series(
  'html',
  'css',
  'fonts',
  'logoSvg',
  'locales',
  'clientjs',
  'images',
  'favicon'
))
gulp.task('watch', gulp.series('watch:on', gulp.parallel(
  'html',
  'cssdev',
  'fonts',
  'logoSvg',
  'locales',
  'clientjs',
  'images',
  'favicon'
)));
