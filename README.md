# grunt-get-git

> Get the path of a local git repository

Locate a local git repository you want to deploy to and set a grunt.config variable with the path. You can use the path in any other grunt plugin during your building process.

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

Which will give you the path to the repository you want to deploy to
```sh
/path/to/project-main-build
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
[MIT] (https://github.com/svalchinov/grunt-get-git/blob/master/LICENSE-MIT)

