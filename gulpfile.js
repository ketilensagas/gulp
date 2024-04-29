const gulp = require('gulp')
const concat = require('gulp-concat')
const cssmin = require('gulp-cssmin')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const image = require('gulp-imagemin')
const stripJs = require('gulp-strip-comments')
const stripCss = require('gulp-strip-css-comments')
const htmlmin= require('gulp-htmlmin')
const {series, parallel}= require('gulp')
const babel= require('gulp-babel')
const browserSync= require('browser-sync').create()
const reload= browserSync.reload


function tarefasCSS(callback) {

    gulp.src([
        './node_modules/bootstrap/dist/css/bootstrap.css',
        './node_modules/@fortawesome/fontawesome-free/css/fontawesome.css',
        './vendor/owl/css/owl.css',
        './vendor/jquery-ui/jquery-ui.css',
        './src/css/style.css'
    ])
        .pipe(babel({
            comments: false,
            presets: ['@babel/env']
        }))                   

        .pipe(concat('styles.css'))         // mescla arquivos
        .pipe(cssmin())                     // minifica css
        .pipe(rename({ suffix: '.min' }))    // styles.min.css
        .pipe(gulp.dest('./dist/css'))      // cria arquivo em novo diretório

    return callback()
}

function tarefasJS(callback) {

    gulp.src([
        './node_modules/bootstrap/dist/js/bootstrap.js',
        './vendor/owl/js/owl.js',
        './vendor/jquery-mask/jquery.mask.js',
        './vendor/jquery-ui/jquery-ui.js',
        './src/js/custom.js'
    ])
        .pipe(stripJs())                    // remove comentários
        .pipe(concat('libs.js'))         // mescla arquivos
        .pipe(uglify())                     // minifica js
        .pipe(rename({ suffix: '.min' }))    // scripts.min.js
        .pipe(gulp.dest('./dist/js')) // cria arquivo em novo diretório
    return callback()               
}

function tarefasImagem() {

    return gulp.src('.src/images/*.jpg', '.src/images/*.png')
        .pipe(image({
            pngquant: true,
            optipng: false,
            zopflipng: true,
            jpegRecompress: false,
            mozjpeg: true,
            gifsicle: true,
            svgo: true,
            concurrent: 10,
            quiet: true
        }))
        .pipe(gulp.dest('.dist/images'))
}

function tarefasHTML(callback) {
    gulp.src('./src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist'))
    return callback()
}

gulp.task('serve', function(){

    browserSync.init({
        server: {
            baseDir: "./src"
        }
    })

    gulp.watch('./dist/**/*').on('change', reload)
    gulp.watch('./src/**/*').on('change',process) // repete quando for alterar src
})


const process= series(tarefasHTML, tarefasJS, tarefasCSS)

exports.styles = tarefasCSS
exports.scripts = tarefasJS
exports.images = tarefasImagem
exports.default = process