var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('default', ['copy-libs'], function () {
    gulp.src('./src/*.es6')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./build'));
});

gulp.task('copy-libs', function () {
    gulp.src(['./src/*.min.js', 'manifest.json', './src/*.css', './src/*.png'])
        .pipe(gulp.dest('./build'));
});