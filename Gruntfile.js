/*
 * grunt-plugin
 * https://github.com/svalchinov/grunt-plugin-tbc.git
 *
 * Copyright (c) 2014 Stefan V
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
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        clean: {
            tests: ['.tmp']
        },

        copy: {
            main: {
                expand: true,
                cwd: 'tasks/',
                src: '*.js',
                dest: '<%= app.deployUrl %>',
                flatten: true
            }
        },

        plugin: {
            find: {
                root: '/Users', // narrows down the search, defaults to process.env.HOME
                repository: 'digital-wallet.git', // name of repository to search
                config: 'app.deployUrl' // variable name in grunt.config
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('default', ['jshint', 'test']);

    grunt.registerTask('deploy', ['plugin', 'copy']);


};