# rails-action-view-loader

Forked from [rails-erb-loader](https://github.com/usabilityhub/rails-erb-loader).

> Embedded Ruby (`.erb`) webpack loader for Ruby projects that supports ActionView helpers (render, content_for, etc.).

Compiles Embedded Ruby template files in any Ruby project. Files are built using either the `Erubis` or `ERB` gem.

## Table of Contents
- [Install](#install)
- [Usage](#usage)
- [Configuration](#configuration)
  - [Options](#options)
  - [Dependencies](#dependencies)
- [Contribute](#contribute)
- [License](#license)

## Install

### npm

```console
$ npm install rails-action-view-loader --save-dev
```

### yarn

```console
$ yarn add -D rails-action-view-loader
```

## Usage

Add `rails-action-view-loader` to your rules.

```js
// webpack.config.js

module.exports = {
    module: {
      rules: [
        {
          test: /\.erb$/,
          enforce: 'pre',
          loader: 'rails-action-view-loader'
        },
      ]
    }
  }
};
```

Now you can use `.erb` files in your project, for example:

`app/assets/javascripts/UserFormFields.jsx.erb`
```erb
/* rails-erb-loader-dependencies models/user models/image */

export default function UserFormFields() {
  return (
    <div>
      <label htmlFor='avatar'>
        Avatar
      </label>
      <ImageField id='avatar' maxSize={<%= Image::MAX_SIZE %>} />
      <label htmlFor='name'>
        Name
      </label>
      <input
        id='name'
        type='text'
        maxLength={<%= User::MAX_NAME_LENGTH %>}
      />
      <label htmlFor='age'>
        Age
      </label>
      <input
        id='age'
        type='number'
        min={<%= User::MIN_AGE %>}
        max={<%= User::MAX_AGE %>}
      />
    </div>
  )
}
```

## Configuration

### Options

Can be configured with [UseEntry#options](https://webpack.js.org/configuration/module/#useentry).

| Option | Default | Description |
| ------ | ------- | ----------- |
| `dependenciesRoot` | `"app"` | The root of your Rails project, relative to webpack's working directory. |
| `lookupPaths` | `[]` | ActionView will search those paths for the requested template (`render`). |
| `runner` | `"./bin/rails runner"` | Command to run Ruby scripts, relative to webpack's working directory. |
| `timeout` | `0` | Timeout for the runner task in seconds. `0` is no timeout. Set this if you want a hanging runner to error out the build.

For example, if your webpack process is running in a subdirectory of your Rails project:

```js
{
  loader: 'rails-action-view-loader',
  options: {
    runner: '../bin/rails runner',
    dependenciesRoot: '../app',
  }
}
```

Also supports building without Rails:

```js
{
  loader: 'rails-action-view-loader',
  options: {
    runner: 'ruby'
  }
}
```

### Dependencies

If your `.erb` files depend on files in your Ruby project, you can list them explicitly. Inclusion of the `rails-erb-loader-dependency` (or `-dependencies`) comment will tell webpack to watch these files - causing webpack-dev-server to rebuild when they are changed.

#### Watch individual files

List dependencies in the comment. `.rb` extension is optional.

```js
/* rails-erb-loader-dependencies models/account models/user */
```

```erb
<% # rails-erb-loader-dependencies models/account models/user %>
```

#### Watch a whole directory

To watch all files in a directory, end the path in a `/`.

```js
/* rails-erb-loader-dependencies ../config/locales/ */
```

```erb
<% # rails-erb-loader-dependencies ../config/locales/ %>
```

## Contribute

Questions, bug reports and pull requests welcome. See [GitHub issues](https://github.com/agendrix/rails-action-view-loader/issues).

## License

MIT
