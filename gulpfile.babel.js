import gulp from 'gulp';
import requireDir from 'require-dir';
requireDir('./gulp/tasks');

gulp.task('default', ['webpack-dev-server', 'views:dev', 'copy:dev']);
gulp.task('build:web', ['webpack:build:web', 'views:build:web']);
gulp.task('build:electron', ['webpack:build:electron', 'views:build:electron']);
gulp.task('build:app', ['webpack:build:app', 'views:build:app', 'copy:build:app']);
gulp.task('build:umd', ['webpack:build:umd']);
