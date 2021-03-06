    // Gulp Core
    const gulp = require('gulp');

    // css auto prefixer
    const autoprefixer = require('gulp-autoprefixer');
    // injecting header on css
    const header = require('gulp-header');
    // gulp image minifier
    const imagemin = require('gulp-imagemin');
    // notify about task
    const notify = require('gulp-notify');
    // passing options on gulp task
    const options = require('gulp-options');
    // plumber to handle error
    const plumber = require('gulp-plumber');
    // sass package to compile sass
    const sass = require('gulp-sass');
    // writing sourcemaps for sass
    const sourcemaps = require('gulp-sourcemaps');
    // merge stram for custom Javascript
    const merge = require('merge-stream');
    // bundling javascript using webpack
    const gulpwebpack = require('webpack-stream');
    const webpack = require('webpack');
    // clean folder before builing
    const clean = require('gulp-clean');
    // browsersync to serve locally
    const browserSync = require('browser-sync').create();

    //javascript Minifier
    const uglify = require('gulp-uglify');
    //rename File
    const rename = require('gulp-rename');

    //package json to inject information on header
    let pkg = require('./app.json');

    /* modernizr Building */
    const modernizr = require('gulp-modernizr');
    const config = require('./modernizr-config.json');

    //injecting App header and Footer
    const headerfooter = require('gulp-headerfooter');
    const prettyHtml = require('gulp-pretty-html');

    //header And Footer File
    let fs = require('fs');


    
let banner = ['/**',
    '   Theme Name    : <%= pkg.name %>',
    '   Theme URI     : https://github.com/hasanmisbah/',
    '   Author        : <%= pkg.author %>',
    '   Author URI    : https://github.com/hasanmisbah/',
    '   Description   : <%= pkg.description %>',
    '   version       : <%= pkg.version %>',
    '   license       : <%= pkg.license %>',
    '   License URI:  : https://opensource.org/licenses/<%= pkg.license %>',
    '   Text Domain:  : ',
    '   Tags:         : <%= pkg.tags %>',
    '*/',
    ''
].join('\n');

//Supported Browser list
const supportedBrowsers = [
    'last 10 versions', // http://browserl.ist/?q=last+10+versions
    'ie >= 8', // http://browserl.ist/?q=ie+%3E%3D+8
    'edge >= 12', // http://browserl.ist/?q=edge+%3E%3D+12
    'firefox >= 25', // http://browserl.ist/?q=firefox+%3E%3D+25
    'chrome >= 20', // http://browserl.ist/?q=chrome+%3E%3D+20
    'safari >= 5', // http://browserl.ist/?q=safari+%3E%3D+5
    'opera >= 10', // http://browserl.ist/?q=opera+%3E%3D+0
    'ios >= 6', // http://browserl.ist/?q=ios+%3E%3D+6
    'android >= 4', // http://browserl.ist/?q=android+%3E%3D+4
    'blackberry >= 10', // http://browserl.ist/?q=blackberry+%3E%3D+10
    'operamobile >= 7', // http://browserl.ist/?q=operamobile+%3E%3D+7
    'samsung >= 4', // http://browserl.ist/?q=samsung+%3E%3D+4
];


let vendors = [
    {
        name : 'jquery',
        path: 'jquery/dist'
    },
    {
        name : 'bootstrap',
        path: 'bootstrap/dist'
    },
    {
        name : 'popper',
        path: 'popper.js/dist/umd'
    },
    {
        name: 'waypoints',
        path: 'waypoints/lib'
    },
    {
        name: 'prefixfree',
        path: 'prefixfree'
    },
    {
        name : 'slick',
        path : 'slick-carousel/slick'
    }
];
let fonts = [{
    src: '@fortawesome/fontawesome-free',
    dest: 'font-awesome'
},
{
    src: 'devicon',
    dest: 'devicon'
}
];

let appPath = {
    src: 'app/',
    dev : 'dev',
    build : 'dist'
};

function pathName(){
    let path;
    if (options.has('build')){
        path = appPath.build;
        return path;
    }else{
        path = appPath.dev;
        return path;
    }
}

function devclean(done){
    gulp.src('dev/**/*', {
        read: false
    })
    .pipe(clean({
        force: true
    }));
    done();
}
function modernizrbuild(done) {
    gulp.src(appPath.src + '/**/*.js')
        .pipe(modernizr(config))
        .pipe(uglify({
            output: {
                comments: 'some'
            }
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(pathName() + '/assets/vendor/modernizr/'));
    done();
}

function browsers(done){
    browserSync.init({
        watch: true,
        server: {
            baseDir: './dev/',
            injectChanges: true
        }
    });
    done();
}

function reload(done) {
    browserSync.reload();
    done();
}


function html(done){
    gulp.src(appPath.src+'**/*.html')
        .pipe(gulp.dest(pathName()+'/'))
        .pipe(browserSync.stream());
    done();
}
let webpackconfig = require('./webpack.config');

function js(done){
    gulp.src(appPath.src+'/scripts/scripts.js')
        .pipe(gulpwebpack(webpackconfig, webpack))
        .pipe(gulp.dest(pathName()+'/scripts/'))
        .pipe(browserSync.stream());
    done();
}

function css(done){
    gulp.src(appPath.src+'/stylesheet/style.scss')
        .pipe(plumber({ errorHandler: function(err){
            notify.onError({
                title: "Cool Man! There is an error on " + err.plugin,
                message: err.toString()
            })(err);
        }}))
        .pipe(header(banner, {
            pkg: pkg,
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            errorLogToConsole: true,
            outputStyle: 'expanded'
        }))
        .on('error', console.error.bind(console))
        .pipe(autoprefixer({
            browsers: supportedBrowsers,
            cascade: false
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(pathName()+'/css/'))
        .pipe(browserSync.stream());
    done();
}

function vendor(done){
    merge(vendors.map(function(vendor){
        return gulp.src('node_modules/' + vendor.path +'/**/*.+(css|js|woff|gif)*')
                    .pipe(gulp.dest(pathName() + '/assets/vendor/' + vendor.path.replace(/\/.*/, '')));
    }));
    done();
}

function font(done){
    merge(fonts.map(function(font){
        return gulp.src([
            'node_modules/' + font.src + '/**/*.{ttf,woff,eot,svg,min.css,min.js,woff2}',
            '!node_modules/'+font.src+'/**/*.map',
            '!node_modules/'+font.src+'/**/*.selection.json',
            '!node_modules/'+font.src+'/.npmignore',
            '!node_modules/'+font.src+'/*.txt',
            '!node_modules/'+font.src+'/*.md',
            '!node_modules/'+font.src+'/*.json',
            '!node_modules/'+font.src+'/less/*',
            '!node_modules/'+font.src+'/scss/*',
        ])
        .pipe(gulp.dest(pathName() + '/assets/vendor/' + font.dest + '/'));
    }));
    done();
}

function images(done){
    gulp.src(appPath.src+'assets/images/*')
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5
        }))
        .pipe(gulp.dest(pathName() + '/assets/images/'))
        .pipe(browserSync.stream());
    done();
}

let headerFile = fs.readFileSync(appPath.src + 'partials/header.html');
let footerFile = fs.readFileSync(appPath.src + 'partials/footer.html');

function inject(done) {
    gulp.src(appPath.src + '*.html')
        .pipe(headerfooter.header(headerFile))
        .pipe(headerfooter.footer(footerFile))
        .pipe(prettyHtml())
        .pipe(gulp.dest(pathName() + '/'))
        .pipe(browserSync.stream());
    done();
}

function watch_file() {
    gulp.watch('./app/**/*.scss', gulp.series(css, reload));
    gulp.watch('./app/**/*.html', gulp.parallel(inject, reload));
    gulp.watch('./app/**/*.js', gulp.series(js, reload));
    gulp.watch('./app/assets/images/**', gulp.series(images, reload));
    return;
}

exports.html = html;
exports.inject = inject;
exports.js = js;
exports.css = css;
exports.vendor = gulp.series(modernizrbuild, font, vendor);
exports.font = font;
exports.clean = devclean;
exports.watch = gulp.parallel(inject, css, js, images, browsers, watch_file);
exports.default = gulp.parallel(modernizrbuild, vendor, images, font, inject, css, js);
