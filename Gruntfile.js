module.exports = function( grunt )
{
  var gruntConfiguration = {
    pkg: grunt.file.readJSON('package.json'),

    clean: {
        dev: [
            'develop'
        ],
        deploy: [
            'deploy'
        ]
    },

    copy: {
        build_app_assets_dev: {
            files: [
                {
                    src: [ '**' ],
                    dest: 'develop/assets/',
                    cwd: 'source/assets',
                    expand: true
                }
            ]
        },
        build_app_assets_deploy: {
            files: [
                {
                    src: [ '**' ],
                    dest: 'deploy/assets/',
                    cwd: 'source/assets',
                    expand: true
                }
            ]
        },
        build_vendorjs_dev: {
            files: [
                {
                    src: [
                        'bower_components/jquery/dist/jquery.min.js',
                        'bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
                        'bower_components/underscore/underscore-min.js',
                    ],
                    dest: 'develop/',
                    cwd: '.',
                    expand: true
                }
            ]
        },
        build_vendorjs_deploy: {
            files: [
                {
                    src: [
                        'bower_components/jquery/dist/jquery.min.js',
                        'bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
                        'bower_components/underscore/underscore-min.js',
                    ],
                    dest: 'deploy/',
                    cwd: '.',
                    expand: true
                }
            ]
        },
        copy_html: {
            files: [
                {
                    src:['source/index.html'],
                    dest:'develop/',
                    expand: true,
                    flatten: true
                }
            ]
        }
    },

    concat: {
        dev: {
            src:['source/app/js/**/*.js', 'source/app/lib/**/*.js'],
            dest:'develop/js/scripts.js'
        },
        deploy: {
            src:['source/app/js/**/*.js', 'source/app/lib/**/*.js'],
            dest:'deploy/js/scripts.js'
        }
    },

    uglify: {
        deploy: {
            files: {
                'deploy/js/scripts.min.js': ['source/app/js/**/*.js', 'source/app/lib/**/*.js']
            }
        }
    },

    sass: {
        dev: {
            files: {
                'develop/assets/site.css': 'source/scss/site.scss'
            }
        },
        deploy: {
            files: {
              'deploy/assets/site.min.css': 'source/scss/site.scss'
            }
        }
    },

    processhtml: {
        dist: {
            files: {
                'deploy/index.html': ['source/index.html']
            }
        }
    },

    watch: {
      html: {
        files: [
          'source/index.html'
        ],
        tasks: ['copy:copy_html']
      },
      jssrc: {
        files: [
          'source/app/**/*.js'
        ],
        tasks: ['concat:dev']
      },
      assets: {
        files: [
          'source/assets/**/*'
        ],
        tasks: [ 'copy:build_app_assets:dev', 'copy:build_vendor_js:dev' ]
      },
      sass: {
        files: ['source/scss/**/*.scss'],
        tasks: ['sass:dev']
      }
    },

    browserSync: {
        bsFiles: {
            src : 'develop'
        },
        options: {
            watchTask: true,
            server: "develop"
        }
    }
  };

  // init grunt
  grunt.initConfig( gruntConfiguration );

  // load plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-browser-sync');

  grunt.registerTask( 'dev', [ 'build_dev', 'browserSync', 'watch' ] );
  grunt.registerTask( 'build_dev', [
    'clean:dev', 'sass:dev', 'concat:dev', 'copy:build_app_assets_dev', 'copy:build_vendorjs_dev', 'copy:copy_html'
  ]);

  grunt.registerTask( 'deploy', [ 'build_deploy'] );
  grunt.registerTask( 'build_deploy', [
    'clean:deploy', 'sass:deploy', 'copy:build_app_assets_deploy', 'copy:build_vendorjs_deploy', 'uglify', 'processhtml'
  ]);
};
