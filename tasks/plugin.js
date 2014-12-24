/*
 * grunt-plugin
 * https://github.com/stefanvalchinov/grunt-plugin
 *
 * Copyright (c) 2014 Stefan V.
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec,
    inquirer = require('inquirer'),
    child;


module.exports = function(grunt) {

    grunt.registerMultiTask('plugin', 'description', function() {
        var data = this.data,
            done = this.async(),
            results = [];

        var find = function(path, directory, done) {
            fs.readdir(path, function(err, list) {
                if (err) return done(err);
                var pending = list.length;

                list.forEach(function(dir) {
                    fs.lstat(path + '/' + dir, function(err, stats) {
                        if (stats.isDirectory()) {
                            //console.log(dir + ' = ' + directory + ' ?');
                            if (dir === directory) {
                                results.push(path + '/' + dir);
                                //console.log(dir);
                                done(null, results);
                            }

                            find(path + '/' + dir, directory, done);
                        }
                    });
                });
            });
        };

        find('/Users', 'grunt', function(err, data) {
            console.log(data);

        });

    });

};