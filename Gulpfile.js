const pkg = require('./package.json');
const tsConfig = require('./tsconfig.json');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const gulp = require('gulp');
const less = require('gulp-less');
const minifyCSS = require('gulp-minify-css');
const tsify = require('tsify');
const twig = require('gulp-twig');
const uglifyjs = require('gulp-uglifyjs');
const fs = require('fs');

let doMinify = false;

const logError = message => {
	console.log(`\x1b[41m\x1b[37m${message}\x1b[0m`);
};

gulp.task('prod', () => {
	doMinify = true;
	gulp.start('script', 'html', 'less' , 'static');
});

gulp.task('watch', () => {
	gulp.start('script', 'html', 'less' , 'static');

	gulp.watch([
		'src/**/*',
	], ['script']);
	
	gulp.watch([
		'static/**/*',
	], ['html', 'static', 'less']);
});

gulp.task('script', () => {
	const output = `game.min.${pkg.version}.js`;

	//typescript
	let browserifyTask = browserify({})
		.add(pkg.main)
		.plugin(tsify, tsConfig.compilerOptions);
	
    // Implement a libraries array in your package.json then uncomment below to minify JS libraries..
	// //jslibraries
	// for(let i = 0; i < pkg.jsLibraries.length; i++) {
	// 	browserifyTask = browserifyTask.add(pkg.jsLibraries[i]);
	// }
	
	//bundle
	browserifyTask = browserifyTask.bundle()
		.on('error', e => logError(e.message))
		.pipe(source(output))
		.pipe(buffer())

	//minify
	if(doMinify) {
		browserifyTask = browserifyTask.pipe(uglifyjs(output));
	}
	
	return browserifyTask.pipe(gulp.dest('dist'));
		
});

gulp.task('html', () => {
	return gulp
		.src('static/**/*.html')
		.pipe(twig({
			data: {
				version: pkg.version
			},
		}))
		.pipe(gulp.dest('dist'));
});


gulp.task('static', () => {
	return gulp
		.src('static/**/!(*.html)')
		.pipe(gulp.dest('dist'));
});

gulp.task('less', function(){
    return gulp.src('static/less/*.less')
        .pipe(less())
		.pipe(gulp.dest('dist/css'));
});