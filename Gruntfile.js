/*
 * grunt-plugin
 * https://github.com/svalchinov/grunt-plugin-tbc.git
 *
 * Copyright (c) 2014 Stefan Valchinov
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        clean: {
            options: {
                force: true
            },
            remote: ['<%= app.deployTo %>/.tmp']
        },

        copy: {
            main: {
                expand: true,
                cwd: 'tasks/',
                src: '*.js',
                dest: '<%= app.deployTo %>/.tmp',
                flatten: true
            }
        },

        plugin: {
            find: {
                root: '/', // narrows down the search, defaults to process.env.HOME
                repository: 'my-repo.git', // name of repository to search
                config: 'app.deployTo' // variable name in grunt.config
            }
        }

    });

    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('deploy', ['jshint', 'plugin', 'copy']);
    grunt.registerTask('cleanRemote', ['jshint', 'plugin', 'clean:remote']);

};