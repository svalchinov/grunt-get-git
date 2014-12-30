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
    inquirer = require('inquirer'),
    child;


module.exports = function(grunt) {

    grunt.registerMultiTask('plugin', 'description', function() {
        var data = this.data,
            done = this.async(),
            results = [],
            matching = [];

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

        var readResults = function(results, done) {
            
            var properties,
                obj = {},
                temp;

            var findMatches = function(index, callback) {

                if (index === results.length) {
                    callback(null, matching);

                } else {

                    fs.readFile(path.resolve(results[index], 'config'), function(err, file) {

                        if (err) {
                            throw err;
                        }
                        // TODO: more reliable splitting
                        properties = file.toString().split(/(\s+\t+)/);
                        properties.forEach(function(prop) {
                            temp = prop.split(' = ');
                            obj[temp[0]] = temp[1];
                        });

                        if (obj.url.split('/').pop() === data.repository) {
                            matching.push(results[index]);
                        }

                        findMatches(index + 1, callback);
                    });
                }
            };

            findMatches(0, function(err, matches) {
                done(null, matches);
            });

        };

        find(data.root || process.env.HOME, '.git', function(err, results) {
            readResults(results, function(err, matching) {
                if (matching.length) {
                    if (matching.length > 1) {
                        inquirer.prompt([{
                            type: 'list',
                            name: 'url',
                            default: 'Nothing found',
                            message: 'Found ' + matching.length + ' results. Select correct repository location',
                            choices: matching

                        }], function(answer) {

                            console.log(answer.url);

                        });
                    } else {
                        console.log('Found matching repository in: ' + matching);
                    }
                } else {
                    console.log('Nothing found');
                }
            });
        });
    });
};