/* jshint node: true */

module.exports = function (grunt) {
    "use strict";

    grunt.initConfig(
        {
            pkg: grunt.file.readJSON('package.json'),
            traceur: {
                options: {
                    sourceMap: true
                },
                custom: {
                    files: [
                        {
                            src: ['js/common.js'],
                            dest: 'js/common.es5.js'
                        },
                        {
                            src: ['js/net.js'],
                            dest: 'js/net.es5.js'
                        },
                        {
                            src: ['js/lang.js'],
                            dest: 'js/lang.es5.js'
                        },
                        {
                            src: ['js/nav.js'],
                            dest: 'js/nav.es5.js'
                        },
                        {
                            src: ['people/people.js'],
                            dest: 'people/people.es5.js'
                        },
                        {
                            src: ['time/time.js'],
                            dest: 'time/time.es5.js'
                        },
                        {
                            src: ['time/time-module.js'],
                            dest: 'time/time-module.es5.js'
                        },
                        {
                            src: ['place/place.js'],
                            dest: 'place/place.es5.js'
                        },
                        {
                            src: ['js/foot.js'],
                            dest: 'js/foot.es5.js'
                        },
                        {
                            src: ['js/index.js'],
                            dest: 'js/index.es5.js'
                        },
                        {
                            src: ['js/search/search.js'],
                            dest: 'js/search/search.es5.js'
                        },
                        {
                            src: ['js/units.js'],
                            dest: 'js/units.es5.js'
                        }
                    ]
                }
            },
//            docular: {
//                groups: [],
//                showDocularDocs: true,
//                showAngularDocs: true,
//                docular_webapp_target: 'doc'
//            },
            sass: {
                dist: {
                    options: {
                        style: 'compressed'
                    },
                    expand: true,
                    files: {
                        'rr0.css': ['*.scss', 'js/**/*.scss', 'time/*.scss', 'people/*.scss', 'place/*.scss']
                    }
                },
                dev: {
                    options: {
                        style: 'expanded',
                        debugInfo: true,
                        lineNumbers: true
                    },
                    expand: true,
                    src: ['**/*.scss'],
                    ext: '.css'
                }
            },
            autoprefixer: {
                options: {
                    browsers: ['> 1%', 'last 2 versions', 'ie 8', 'ie 9']
                },
                multiple_files: {
                    expand: true,
                    flatten: true,
                    src: '*.css'
                }
            },
            ngAnnotate: {
                options: {
                    singleQuotes: true
                },
                rr0: {
                    files: {
                        expand: true,
                        src: ['time.es5.js'],
                        ext: '.annotated.js'
                    }
                }
            },
            jshint: {
                all: [
                    "gruntfile.js",
                    "js/**/*.js",
                    "spec/**/*.js"
                ]
            },
            jasmine: {
                /* As this is launch for dev only, we rely on non-merged files here */
                src: [
                    'js/common.es5.js', 'js/net.es5.js', 'js/lang.es5.js', 'js/nav.es5.js', 'people/people.es5.js',
                    'time/time.es5.js', 'time/time-module.es5.js', 'place/place.es5.js', 'js/foot.es5.js',
                    'js/index.es5.js', 'js/search/search.es5.js', 'js/units.es5.js'
                ],
                options: {
                    specs: 'test/**/*.js',
                    vendor: 'bower_components/**/*.js',
                    helpers: [
                        'node_modules/grunt-contrib-jasmine/vendor/jasmine-2.0.1/**/*.js',
                        'bower_components/angular-mocks/angular-mocks.js',
                        'bower_components/angular-sanitize/angular-sanitize.js'
                    ]
                    //template: 'custom.tmpl',
                }
            },
            karma: {
                dist: {
                    configFile: 'karma.conf.js',
                    singleRun: true
                },
                dev: {
                    configFile: 'karma.dev.conf.js'
                }
            },
            uglify: {
                rr0: {
                    options: {
                        sourceMap: true,
                        sourceMapName: 'js/all.es5.map',
                        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */',
                        drop_console: true
                    },
                    files: {
                        'js/all.es5.min.js': [
                            'js/common.es5.js',
                            'js/net.es5.js',
                            'js/lang.es5.js',
                            'js/nav.es5.js',
                            'people/people.es5.js',
                            'time/time.es5.js',
                            'time/time-module.es5.js',
                            'place/place.es5.js',
                            'js/foot.es5.js',
                            'js/index.es5.js',
                            'js/search/search.es5.js',
                            'js/units.es5.js'
                        ]
                    }
                }
            }
        }
    );
    //grunt.loadNpmTasks('grunt-docular');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-traceur');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('test-dist', ['karma:dist']);
    grunt.registerTask('test-dev', ['karma:dev']);
    grunt.registerTask('test-unit', ['jasmine']);
    grunt.registerTask('css-dev', ['sass:dev', 'autoprefixer']);
    grunt.registerTask('css-dist', ['sass:dist', 'autoprefixer']);
    grunt.registerTask('dev', ['traceur', 'css-dev', 'test-unit']);
    grunt.registerTask('default', ['traceur', 'uglify', 'css-dist', 'test-dist']);
};