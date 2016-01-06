import gulp from 'gulp';
import jade from 'gulp-jade';

const compile = (dest, src = './src/views/*.jade', env = 'prod') => () => {
  gulp.src(src)
    .pipe(jade({ locals: { env } }))
    .pipe(gulp.dest(dest));
};

gulp.task('views:dev', compile('./dev', undefined, 'dev'));
gulp.task('views:build:extension', compile('./build/extension'));
gulp.task('views:build:app', () => {
  compile('./build/app')();
  compile('./build/app', './src/chromeApp/views/*.jade')();
});
gulp.task('views:build:electron', compile('./build/electron'));
gulp.task('views:build:web', compile('./build/web'));
