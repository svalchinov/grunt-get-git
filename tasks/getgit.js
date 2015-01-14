/*
 * grunt-get-git
 * https://github.com/stefanvalchinov/grunt-get-git
 *
 * Copyright (c) 2014 Stefan Valchinov
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    path = require('path'),
    inquirer = require('inquirer');

module.exports = function(grunt) {

    grunt.registerMultiTask('getgit', 'Get the path of a local git repository', function() {
        
        var defaults = {
                root: process.env.HOME,
                repository: null,
                config: 'depoloyPath'
            },
            options = this.data,
            done = this.async(),
            results = [];

        options = grunt.util._.extend(defaults, options);

        var find = function(location, directory, callback) {
            fs.readdir(location, function(err, list) {
                if (err) { return callback(err); }
                var pending = list.length;

                // empty folders
                if (!pending) { return callback(null, results); }

                // recursive directory search
                list.forEach(function(dir) {
                    fs.lstat(path.resolve(location, dir), function(err, stats) {
                        if (err) { return callback(err); }
                        if (stats.isDirectory()) {
                            find(path.resolve(location, dir), directory, function(err) {
                                // read git config file for matches
                                if (dir === directory) {
                                    fs.readFile(path.resolve(location, dir, 'config'), function(err, file) {
                                        if (err) { return callback(err); }
                                        var properties,
                                            obj = {},
                                            temp;

                                        // TODO: use git commands for more reliable git lookup
                                        properties = file.toString().split(/(\s+\t+)/);
                                        properties.forEach(function(prop) {
                                            temp = prop.split(' = ');
                                            obj[temp[0]] = temp[1];
                                        });

                                        if (obj.url.split('/').pop() === options.repository) {
                                            results.push(location);
                                        }
                                    });
                                }

                                if (!--pending) {
                                    callback(null, results);
                                }
                            });
                        } else {
                            if (!--pending) {
                                callback(null, results);
                            }
                        }
                    });
                });
            });
        };

        find(options.root, '.git', function(err, data) {
            if (results.length) {
                if (results.length > 1) {
                    inquirer.prompt([{
                        type: 'list',
                        name: 'url',
                        default: 'Nothing found',
                        message: 'Found ' + results.length + ' results. Select local repository to deploy to',
                        choices: results

                    }], function(answer) {
                        grunt.config.set(options.config, answer.url);
                        done(null);
                    });
                } else {
                    grunt.log.writeln('Found matching repository in: ' + results);
                    grunt.config.set(options.config, results);
                    done(null);
                }
            } else {
                grunt.log.error('No results found for repository "' + options.repository + '"');
            }
        });
    });
};