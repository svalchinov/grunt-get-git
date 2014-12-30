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
        app: {
            deploy: ''
        },
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

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        plugin: {
            find: {
                root: '/Users', // narrows down search, defaults to process.env.HOME
                repository: 'digital-wallet-web.git' // name of repository
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
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('deploy', ['plugin']);
    grunt.registerTask('default', ['jshint', 'test']);


};