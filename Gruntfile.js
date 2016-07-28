module.exports = function( grunt )
{
  var gruntConfiguration = {
    pkg: grunt.file.readJSON('package.json'),

    clean: [
      'dist',
      'compile'
    ],

    copy: {
      build_app_assets: {
        files: [
          {
            src: [ '**' ],
            dest: 'dist/assets/',
            cwd: 'source/assets',
            expand: true
          }
       ]
      },
      build_vendorjs: {
        files: [
          {
            src: [
              'bower_components/jquery/dist/jquery.min.js',
              'bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
              'bower_components/underscore/underscore-min.js',
              'bower_components/victor/build/victor.min.js',
              'bower_components/jquery-touchswipe/jquery.touchSwipe.min.js'
            ],
            dest: 'dist/',
            cwd: '.',
            expand: true
          }
        ]
      },
      copy_html: {
        files: [
          {
            src:['source/index.html'],
            dest:'dist/',
            expand: true,
            flatten: true
          }
        ]
      }
    },

    jshint: {
      source: {
        options: {
          strict: false,
          curly: true,
          eqeqeq: true,
          eqnull: true,
          browser: true,
          globals: {
            strict: false,
            $: false,
            _:false,
            createjs:false,
            console: false,
            jQuery: true
          }
        },
        files: {
          src: ['dist/js/scripts.js']
        }
      }
    },

    concat: {
      js: {
        src:['source/app/js/**/*.js'],
        dest:'dist/js/scripts.js'
      },
      lib: {
        src:['source/app/lib/**/*.js'],
        dest:'dist/js/lib.js'
      }
    },

    sass: {
      build: {
        files: {
          'dist/assets/site.css': 'source/scss/site.scss'
        }
      },
      compile: {
      }
    },

    // wiredep: {
    //   task: {
    //     src: ['dist/index.html'],
    //     ignorePath: '../',
    //   }
    // },

    watch: {
      html: {
        files: [
          'source/index.html'
        ],
        tasks: ['copy:copy_html', 'wiredep']
      },
      jssrc: {
        files: [
          'source/app/**/*.js'
        ],
        tasks: ['concat']
      },
      assets: {
        files: [
          'source/assets/**/*'
        ],
        tasks: [ 'copy:build_app_assets', 'copy:build_vendor_js' ]
      },
      sass: {
        files: ['source/scss/**/*.scss'],
        tasks: ['sass:build', 'concat']
      }
    },

    browserSync: {
        bsFiles: {
            src : 'dist'
        },
        options: {
            watchTask: true,
            server: "dist"
        },
    },

    connect: {
      server: {
        options: {
          port: 9001,
          base: 'dist'
        }
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
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks("grunt-bower-install-simple");

  grunt.registerTask( 'run', [ 'build', 'browserSync', 'watch' ] );
  grunt.registerTask( 'build', [
    'clean', 'sass:build', 'copy:build_app_assets', 'copy:build_vendorjs', 'copy:copy_html', 'concat'
  ]);

};
