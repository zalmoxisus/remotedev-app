import gulp from 'gulp';
import rename from 'gulp-rename';

const copy = (dest) => () => {
  gulp.src('./src/assets/**/*').pipe(gulp.dest(dest));
};

gulp.task('copy:dev', copy('./dev'));

gulp.task('copy:build:app', () => {
  copy('./build/app')();
  gulp.src(`./src/chromeApp/manifest.json`).pipe(gulp.dest('./build/app'));
});

gulp.task('copy:build:electron', () => {
  gulp.src(['./src/electron/**', '!./src/electron/resources', '!./src/electron/resources/**']).pipe(gulp.dest('./build/electron'));
});
