/*
 * grunt-get-git
 * https://github.com/svalchinov/grunt-get-git.git
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

        getgit: {
            find: {
                root: '/Users/stefanvalchinov', // search start folder, defaults to process.env.HOME
                repository: 'my-repo.git', // name of repository
                config: 'app.deployTo' // set config var in grunt.config
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.task.loadTasks('tasks');
    grunt.registerTask('deploy', ['jshint', 'getgit']);

};