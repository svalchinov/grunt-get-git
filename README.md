# grunt-get-git [![Build Status](https://travis-ci.org/svalchinov/grunt-get-git.svg?branch=master)](https://travis-ci.org/svalchinov/grunt-get-git)

> Get the path of a local git repository

Locate a local git repository you want to deploy to and set a grunt.config variable with the path. You can use the path in any other grunt plugin during your building process.

Note: The getgit task needs to be run first in order to get the path for any consecutive tasks. See example for more info.

## Install

```sh
$ npm install grunt-get-git --save-dev
```

## Usage

```js
getgit: {
    root: '/', // where to search, defaults to process.env.HOME
    repository: 'my-repo.git', // name of repository to search
    config: 'app.deployTo' // set the name of your config option
}
```

## Example
```js
getgit: {
    root: '/',
    repository: 'project-main-build.git',
    config: 'app.deployTo'
}
```

In any other task you can use
```js
'<%= app.deployTo %>
```

For a copy task configuration like this

```js
copy: {
    remote: {
        expand: true,
        dot: true,
        cwd: '<%= dist %>',
        dest: '<%= app.deployTo %>/static/',
        src: [
            'scripts/**/*',
            'styles/**/*'
        ]
    }
},
```
Your deploy process would look like this
```js
grunt.registerTask('deploy', [
    'getgit',
    'copy:remote'
]);
```

## Options

### root
Type: `String`  
Default: `process.env.HOME`

### repository
Type: `String`  
Default: `null`

### config
Type: `String`  
Default: `depoloyPath`


## License
[MIT](https://github.com/svalchinov/grunt-get-git/blob/master/LICENSE-MIT)

