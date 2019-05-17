var gulp = require('gulp'),
    gulpSass = require('gulp-sass'),
    csso = require('gulp-csso'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    fs = require('fs'),
    del = require('del');

const {src, dest} = gulp;

var paths = {
    styles: {
        src: '**/*.scss',
        dest: 'build/css/',
        filename: 'bootstrap-fontawesome.css',
        scssfile: 'backport/stylesheets/theme-overrides.scss'
    },
    dependencycss: {
        src: [ 'assets/css/jquery-ui.css', 'assets/css/ala-styles.css', 'assets/css/jquery-ui-extra.css', 'assets/css/*.css'],
        dest: 'build/css/'
    },
    dependencyjs: {
        src: 'assets/js/*.js',
        dest: 'build/js/'
    },
    html: {
        src: '*.html',
        dest: 'build/html/'
    },
    font: {
        src: ['bootstrap-sass/assets/fonts/bootstrap/*.*', 'ala-wordpress-2019/web/app/themes/understrap/fonts/*'],
        dest: 'build/font/'
    },
    js: {
        src: ['assets/js/jquery-2.2.4.js', 'assets/js/bootstrap.js', 'assets/js/application.js', 'assets/js/*.js'],
        dest: 'build/js/'
    }
};

function css() {
    return src(paths.styles.scssfile)
        .pipe(gulpSass())
        .pipe(rename(paths.styles.filename))
        .pipe(dest(paths.styles.dest))
        .pipe(src(paths.dependencycss.src))
        .pipe(dest(paths.dependencycss.dest))
        .pipe(concat('ala.min.css'))
        .pipe(csso({restructure: false}))
        .pipe(dest(paths.dependencycss.dest));
};

function testHTMLPage() {
    var header = fs.readFileSync('banner.html');
    var footer = fs.readFileSync('footer.html');
    return src('testTemplate.html')
        .pipe(replace('HEADER_HERE', header))
        .pipe(replace('FOOTER_HERE', footer))
        .pipe(replace(/::containerClass::/g, 'container-fluid'))
        .pipe(replace(/::headerFooterServer::/g, '../'))
        .pipe(replace(/::loginStatus::/g, 'signedOut'))
        .pipe(replace(/::loginURL::/g, 'https://auth.ala.org.au/cas/login'))
        .pipe(rename('testPage.html'))
        .pipe(dest(paths.html.dest));
};

function html() {
    return src(paths.html.src)
        .pipe(dest(paths.html.dest));
};

function font() {
    return src(paths.font.src)
        .pipe(dest(paths.font.dest));
}

function js() {
    return src(paths.js.src)
        .pipe(dest(paths.js.dest))
        .pipe(concat('ala.min.js'))
        .pipe(uglify({output: {comments: '/^!/'}}))
        .pipe(dest(paths.js.dest));
}

function watch() {
    gulp.watch(paths.html.src, testHTMLPage);
    gulp.watch(paths.html.src, html);
    gulp.watch(paths.styles.src, css);
    gulp.watch(paths.dependencycss.src, dependencyCSS);
}

function clean() {
    return del([paths.styles.dest, paths.html.dest, paths.font.dest, paths.js.dest]);
}

var build = gulp.series(clean, gulp.parallel( css, testHTMLPage, html, font, js));

exports.watch = watch;
exports.css = css;
exports.html = testHTMLPage;
exports.font = font;
exports.js = js;
exports.build = build;
exports.clean = clean;