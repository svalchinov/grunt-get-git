/*
 * grunt-plugin
 * https://github.com/stefanvalchinov/grunt-plugin
 *
 * Copyright (c) 2014 Stefan Valchinov
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    path = require('path'),
    inquirer = require('inquirer');

module.exports = function(grunt) {

    grunt.registerMultiTask('plugin', 'description', function() {
        var defaults = {
                root: process.env.HOME,
                repository: null,
                config: 'depoloyPath'
            },
            options = this.data,
            done = this.async(),
            results = [],
            matching = [];

        options = grunt.util._.extend(defaults, options);

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
                        if (err) { return done(err); }
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
                        if (err) { return done(err); }
                        // TODO: more reliable git lookup
                        properties = file.toString().split(/(\s+\t+)/);
                        properties.forEach(function(prop) {
                            temp = prop.split(' = ');
                            obj[temp[0]] = temp[1];
                        });

                        if (obj.url.split('/').pop() === options.repository) {
                            // remove trailing .git in url
                            var url = results[index].replace(/\/[^\/]+$/, '');
                            matching.push(url);
                        }

                        findMatches(index + 1, callback);
                    });
                }
            };

            findMatches(0, function(err, matches) {
                if (err) { return done(err); }
                done(null, matches);
            });

        };

        find(options.root, '.git', function(err, data) {
            readResults(data, function(err, matches) {
                if (matches.length) {
                    if (matches.length > 1) {
                        inquirer.prompt([{
                            type: 'list',
                            name: 'url',
                            default: 'Nothing found',
                            message: 'Found ' + matches.length + ' results. Select local repository to deploy to',
                            choices: matches

                        }], function(answer) {
                            grunt.config.set(options.config, answer.url);
                            done(null);
                        });
                    } else {
                        grunt.log.writeln('Found matching repository in: ' + matches);
                        grunt.config.set(options.config, matches);
                        done(null);
                    }
                } else {
                    grunt.log.error('No results found for repository "' + options.repository + '"');
                }
            });
        });
    });
};