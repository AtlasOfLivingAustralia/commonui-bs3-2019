var gulp = require('gulp'),
    gulpSass = require('gulp-sass'),
    csso = require('gulp-csso'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    fs = require('fs'),
    del = require('del');

const {src, dest} = gulp;

var paths = {
    styles: {
        boostrap: 'assets/scss/bootstrap.scss',
        'boostrap-ala': 'assets/scss/bootstrap-ala.scss',
        'font-awesome': 'assets/scss/font-awesome.scss',
        src: '**/*.scss',
        dest: 'build/css/',
        jqueryui: 'assets/vendor/jquery-ui/autocomplete.css',
    },
    images: {
        jqueryui: 'assets/vendor/jquery-ui/images/**',
        jqueryuidest:'build/css/images/'
    },
    assets: {
        src: ['assets/**', '!assets/vendor/**', '!assets/scss/**'],
        dest: 'build/'
    },
    dependencycss: {
        src: ['assets/css/*.css'],
        dest: 'build/css/'
    },
    dependencyjs: {
        src: 'assets/js/*.js',
        dest: 'build/js/'
    },
    html: {
        src: ['banner.html', 'footer.html', 'head.html'],
        dest: 'build/'
    },
    font: {
        src: ['bootstrap-sass/assets/fonts/bootstrap/*.*', 'ala-wordpress-2019/web/app/themes/understrap/fonts/*', 'ala-wordpress-2019/web/app/themes/pvtl/fonts/*'],
        dest: 'build/fonts/'
    },
    js: {
        src: [
            'assets/js/application.js', 'assets/js/*.js'
        ],
        dest: 'build/js/',
        jquery: 'assets/vendor/jquery/jquery-3.4.1.js',
        'jquery-migration': 'assets/vendor/jquery/jquery-migrate-3.0.1.js',
        bootstrap: 'assets/vendor/bootstrap/bootstrap.js',
        jqueryui: 'assets/vendor/jquery-ui/autocomplete.js'
    }
},
    /**
     * Possible values
     * 'ala'
     * 'living-atlas'
     * @type {string}
     */
    output = 'ala',
    /**
     * Address of the node server
     * Check readme for more details
     * @type {string}
     */
    localserver = 'http://localhost:8099/'
;

/**
 * Bootstrap output is dependent on value of @link{output} variable.
 * If 'ala' is chosen, bootstrap.css will have custom ala styles.
 * If 'living-atlas' is chosen, bootstrap.css will be standard bootstrap styling.
 * @returns {stream}
 */
function bootstrapCSS() {
    switch (output) {
        case 'ala':
            return src(paths.styles["boostrap-ala"])
            .pipe(gulpSass({precision: 9}))
            .pipe(rename('bootstrap.css'))
            .pipe(dest(paths.styles.dest))
            .pipe(csso({restructure: false}))
            .pipe(rename('bootstrap.min.css'))
            .pipe(dest(paths.styles.dest));
        case 'living-atlas':
            return src(paths.styles.boostrap)
                .pipe(gulpSass({precision: 9}))
                .pipe(rename('bootstrap.css'))
                .pipe(dest(paths.styles.dest))
                .pipe(csso({restructure: false}))
                .pipe(rename('bootstrap.min.css'))
                .pipe(dest(paths.styles.dest));


    }
}

function autocompleteCSS() {
    return src(paths.styles.jqueryui)
        .pipe(rename('autocomplete.css'))
        .pipe(dest(paths.styles.dest))
        .pipe(csso({restructure: false}))
        .pipe(rename('autocomplete.min.css'))
        .pipe(dest(paths.styles.dest));
}

function fontawesome() {
    return src(paths.styles["font-awesome"])
        .pipe(gulpSass({precision: 9}))
        .pipe(rename('font-awesome.css'))
        .pipe(dest(paths.styles.dest))
        .pipe(csso({restructure: false}))
        .pipe(rename('font-awesome.min.css'))
        .pipe(dest(paths.styles.dest));
}

function otherCSSFiles() {
        return src(paths.dependencycss.src)
        .pipe(dest(paths.dependencycss.dest))
        .pipe(csso({restructure: false}))
        .pipe(rename({extname: '.min.css'}))
        .pipe(dest(paths.dependencycss.dest));
}

function autocompleteImages() {
    return src(paths.images.jqueryui)
        .pipe(dest(paths.images.jqueryuidest));
}

var css = gulp.parallel(bootstrapCSS, fontawesome, autocompleteImages, autocompleteCSS, otherCSSFiles);

function testHTMLPage() {
    var header = fs.readFileSync('banner.html');
    var footer = fs.readFileSync('footer.html');
    return src('testTemplate.html')
        .pipe(replace('HEADER_HERE', header))
        .pipe(replace('FOOTER_HERE', footer))
        .pipe(replace(/::containerClass::/g, 'container-fluid'))
        .pipe(replace(/::headerFooterServer::/g, localserver))
        .pipe(replace(/::loginStatus::/g, 'signedOut'))
        .pipe(replace(/::loginURL::/g, 'https://auth.ala.org.au/cas/login'))
        .pipe(replace(/::searchServer::/g, 'https://bie.ala.org.au'))
        .pipe(replace(/::searchPath::/g, '/search'))
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

function jQuery() {
    return src(paths.js.jquery)
        .pipe(rename('jquery.js'))
        .pipe(dest(paths.js.dest))
        .pipe(uglify({output: {comments: '/^!/'}}))
        .pipe(rename('jquery.min.js'))
        .pipe(dest(paths.js.dest));
}

function jqueryMigration() {
    return src(paths.js["jquery-migration"])
        .pipe(rename('jquery-migration.js'))
        .pipe(dest(paths.js.dest))
        .pipe(uglify({output: {comments: '/^!/'}}))
        .pipe(rename('jquery-migration.min.js'))
        .pipe(dest(paths.js.dest));
}

function bootstrapJS() {
    return src(paths.js.bootstrap)
        .pipe(rename('bootstrap.js'))
        .pipe(dest(paths.js.dest))
        .pipe(uglify({output: {comments: '/^!/'}}))
        .pipe(rename('bootstrap.min.js'))
        .pipe(dest(paths.js.dest));
}

function autocompleteJS() {
    return src(paths.js.jqueryui)
        .pipe(rename('autocomplete.js'))
        .pipe(dest(paths.js.dest))
        .pipe(uglify({output: {comments: '/^!/'}}))
        .pipe(rename('autocomplete.min.js'))
        .pipe(dest(paths.js.dest));
}

function otherJsFiles() {
    return src(paths.js.src)
        .pipe(dest(paths.js.dest))
        .pipe(babel({presets: ['@babel/preset-env']}))
        .pipe(uglify({output: {comments: '/^!/'}}))
        .pipe(rename({extname: '.min.js'}))
        .pipe(dest(paths.js.dest));
    ;
}

var js = gulp.parallel(jQuery, jqueryMigration, bootstrapJS, autocompleteJS, otherJsFiles);

function assetCopy() {
    return src(paths.assets.src)
        .pipe(dest(paths.assets.dest));
}

function watch() {
    gulp.watch(paths.html.src, testHTMLPage);
    gulp.watch(paths.html.src, html);
    gulp.watch(paths.styles.src, css);
    gulp.watch(paths.dependencycss.src, css);
    gulp.watch(paths.js.src, js);
}

function clean() {
    return del([paths.assets.dest]);
}

var build = gulp.series(clean, assetCopy, gulp.parallel(css, testHTMLPage, html, font, js));

exports.watch = watch;
exports.css = css;
exports.html = gulp.series([testHTMLPage, html]);
exports.font = font;
exports.js = js;
exports.build = build;
exports.clean = clean;