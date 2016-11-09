import gulp from 'gulp';
import pug from 'gulp-pug';

const compile = (dest, src = './src/views/*.pug', env = 'prod') => () => {
  gulp.src(src)
    .pipe(pug({ locals: { env } }))
    .pipe(gulp.dest(dest));
};

gulp.task('views:dev', compile('./dev', undefined, 'dev'));
gulp.task('views:build:extension', compile('./build/extension'));
gulp.task('views:build:app', () => {
  compile('./build/app')();
  compile('./build/app', './src/chromeApp/views/*.pug')();
});
gulp.task('views:build:electron', compile('./build/electron'));
gulp.task('views:build:web', compile('./build/web'));
