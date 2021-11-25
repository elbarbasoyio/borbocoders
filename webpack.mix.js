const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js(['resources/js/app.js', 'node_modules/bootstrap-touchspin/src/jquery.bootstrap-touchspin.js'], 'public/js/app.js')
mix.js('resources/js/menu.js', 'public/js')
    .postCss('resources/css/auth.css', 'public/css', [
        require('postcss-import'),
        require('tailwindcss'),
        require('autoprefixer')])
    .postCss('resources/css/menu.css', 'public/css')

mix.sass('resources/sass/app.scss', 'public/css')
    .sass('resources/sass/card.scss', 'public/css')
    .postCss('node_modules/bootstrap-touchspin/src/jquery.bootstrap-touchspin.css', 'public/app.css')


