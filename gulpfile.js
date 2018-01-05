

var gulp = require('gulp');
//让gulp-load-plugins插件能匹配除了gulp插件之外的其他插件 
var plugins = require( "gulp-load-plugins" )( { pattern: '*' } );   

var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config.js');


//资源文件路径：  
var path = {  
    /* 总目录 */  
    dev:'./dev',
    dist:'./dist',  
    base: "./src/app",
    /* js */  
    jsSrc: "src/app/*/js/.*js",                                                 
    /* css */  
    cssSrc: "src/app/*/css/*.scss",
    /* img */  
    // imgSrc: "src/app/img/",                                              
  
    /* html */  
    htmlSrc: 'src/app/*/*.html'  
}; 
gulp.task('clean',function(){
    return gulp.src(['./dist/','./dev/']).pipe(plugins.clean());
});
//sass压缩
gulp.task('sass', function () {
    gulp.src(path.cssSrc,{base:path.base}) //要压缩的文件
    	.pipe(plugins.changed(path.cssSrc))
        .pipe(plugins.sass())
        .pipe(gulp.dest(path.dev))
        .pipe(plugins.minifyCss()) //压缩
        .pipe(plugins.rename({ suffix: '.min' }))  //改字，加上min标志
        .pipe(gulp.dest(path.dist))  //压缩后的文件路径\
        .pipe(plugins.notify({ message: 'sass complete' }));
    
});
gulp.task('js', function(callback) {
    return gulp.src(path.jsSrc,{base:path.base})
        .pipe(plugins.changed(path.jsSrc))
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(path.dev))
        .pipe(plugins.rename({ suffix: '.min' }))  //改字，加上min标志
        .pipe(gulp.dest(path.dist))
        .pipe(plugins.notify({ message: 'js complete' }));
});
gulp.task('html', function(){
    var options = {  
        collapseWhitespace: true,                   //压缩HTML  
        collapseBooleanAttributes: false,         //省略布尔属性的值 <input checked="true"/> ==> <input />  
        removeEmptyAttributes: true,            //删除所有空格作属性值 <input id="" /> ==> <input />  
        removeScriptTypeAttributes: true,      //删除<script>的type="text/javascript"  
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"  
        minifyJS: true,                                  //压缩页面JS  
        minifyCSS: true                                //压缩页面CSS  
    };
    gulp.src(path.htmlSrc,{base:path.base})
        .pipe(plugins.changed(path.htmlSrc))
        .pipe(plugins.contentIncluder({
            includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g,
            deepConcat: true,
            baseSrc: './'
        }))
        .pipe(gulp.dest(path.dev))
        .pipe(plugins.htmlmin(options))
        .pipe(plugins.replace('.css', '.min.css'))  
        .pipe(plugins.replace('.js', '.min.js'))  
        .pipe(plugins.htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(path.dist))
        .pipe(plugins.notify({ message: 'html complete' }));
});
gulp.task('default', ['clean'], function(){
    gulp.start( 'sass','js','html');
});
gulp.task('watch',function(){
    gulp.watch(path.cssSrc, ['sass']);
    gulp.watch(path.jsSrc, ['js']);
    gulp.watch(path.htmlSrc, ['html']);
});