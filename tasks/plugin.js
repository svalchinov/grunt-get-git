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

        var find = function(root, directory, done) {
            fs.readdir(root, function(err, list) {

                if (err) {
                    return done(err);
                }
                var pending = list.length;

                // empty folders
                if (!pending) {
                    return done(null, results);
                }

                list.forEach(function(dir) {

                    fs.lstat(path.resolve(root, dir), function(err, stats) {
                        if (stats.isDirectory()) {
                            find(path.resolve(root, dir), directory, function(err) {
                                if (dir === directory) {
                                    results.push(path.resolve(root, dir));
                                }

                                if (!--pending) {
                                    done(null, results);
                                }
                            });
                        } else {
                            if (!--pending) {
                                done(null, results);
                            }
                        }
                    });
                });
            });
        };

        find(data.root || process.env.HOME, '.git', function(err, results) {

            results.forEach(function(result) {

                fs.readFile(path.resolve(result, 'config'), function(err, file) {
                    if (err) {
                        throw err;
                    }

                    var properties = file.toString().split(/(\s+\t+)/);
                    var obj = {};

                    properties.forEach(function(prop) {
                        var temp = prop.split(' = ');
                        obj[temp[0]] = temp[1];
                    });


                    if (obj.url.split('/').pop() === data.repository) {
                        console.log('Found matching repository in: ' + result);
                    }

                });
            });

            // if (repos.length > 1) {

            //     inquirer.prompt([{
            //         type: 'list',
            //         name: 'url',
            //         default: 'Nothing found',
            //         message: 'Found ' + results.length + ' results. Select correct repository location',
            //         choices: repos

            //     }], function(answer) {

            //         console.log(answer.url);


            //     });
            // }

        });

    });

};