/*
 * grunt-plugin
 * https://github.com/stefanvalchinov/grunt-plugin
 *
 * Copyright (c) 2014 Stefan V.
 * Licensed under the MIT license.
 */

'use strict';

var exec = require('child_process').exec,
    readline = require('readline'),
    child;

module.exports = function(grunt) {

    grunt.registerMultiTask('plugin', 'description', function() {
        var data = this.data,
            done = this.async();
        var options = this.options({
            punctuation: '.',
            separator: ', '
        });


        this.files.forEach(function(f) {


            child = exec('ls -h', {
                cwd: '/',
                stdio: [
                    0,
                    'pipe'
                ]
            });


            child.stdout.on('data', function(data) {
                console.log('stdout: ' + data);
            });
            child.stderr.on('data', function(data) {
                console.log('stdout: ' + data);
            });
            child.on('close', function(code) {
                console.log('closing code: ' + code);
            });

        });
    });

};