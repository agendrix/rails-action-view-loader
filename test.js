var MemoryFS = require('memory-fs')
var path = require('path')
var webpack = require('webpack')


var fs = new MemoryFS()

function compile (config, callback) {
  config.runner = config.runner || 'ruby'

  var compiler = webpack({
    entry: './test/erb/' + config.file,
    module: {
      loaders: [
        {
          test: /\.html/,
          loader: 'html-loader'
        },
        {
          test: /\.erb$/,
          loader: './index',
          options: {
            runner: config.runner,
            timeout: config.timeout,
            dependenciesRoot: './test/dependencies',
            lookupPaths: [path.resolve('./test/erb')]
          }
        }
      ]
    },
    output: {
      filename: './output.txt'
    }
  })
  compiler.outputFileSystem = fs
  compiler.run(callback)
}

function compile2 (config, done, successCallback) {
  compile (config, function (err, stats) {
    if (err) {
      fail(error)
      done()
      return
    }
    successCallback(stats)
  })
}

function readOutput () {
  var fileContent = fs.readFileSync(path.resolve(__dirname, './output.txt'))
  return fileContent.toString()
}

function expectInOutput(str) {
  expect(readOutput()).toEqual(expect.stringContaining(str))
}

test('loads a simple file', function (done) {
  compile2({ file: 'simple.js.erb' }, done, function (stats) {
    expect(stats.compilation.errors).toEqual([])
    expectInOutput("var helloWorld = 'Hello World'")
    done()
  })
})

test('loads a html file with render and content_for', function (done) {
  compile2({ file: 'index.html.erb' }, done, function (stats) {
    expect(stats.compilation.errors).toEqual([])
    expectInOutput("<h1>Header</h1>")
    expectInOutput("<p>Lorem ipsum sit dolor amet</p>")
    done()
  })
})

test('loads a html file with render in parent directory (lookupPaths)', function (done) {
  compile2({ file: 'authors/index.html.erb' }, done, function (stats) {
    expect(stats.compilation.errors).toEqual([])
    expectInOutput("<h1>Header</h1>")
    done()
  })
})

test('loads through a Rails-like runner', function (done) {
  compile2({ file: 'runner.js.erb', runner: './test/runner' }, done, function (stats) {
    expect(stats.compilation.errors).toEqual([])
    expectInOutput("var env = 'test'")
    done()
  })
})

test('times out with error', function (done) {
  compile2({ file: 'sleep.js.erb', runner: './test/runner', timeout: 1 }, done, function (stats) {
    expect(stats.compilation.errors[0].message).toMatch(
      'rails-action-view-loader took longer than the specified 1.0 second timeout'
    )
    done()
  })
})

test.skip('loads single file dependencies in dev', function (done) {
  var prevEnv = process.env.NODE_ENV
  compile2({ file: 'dependencies.js.erb' }, done, function (stats) {
    process.env.NODE_ENV = 'development'
    expect(stats.compilation.errors).toEqual([])

    // TODO: Check that dependencies/dependency.rb and dependencies/dependency/version.rb
    // are being watched

    done()
  })
  process.env.NODE_ENV = prevEnv
})

test.skip('loads directory dependencies in dev', function (done) {
  var prevEnv = process.env.NODE_ENV
  compile2({ file: 'dependencies-all.js.erb' }, done, function (stats) {
    process.env.NODE_ENV = 'development'
    expect(stats.compilation.errors).toEqual([])

    // TODO: Check that the whole dependencies tree is being watched

    done()
  })
  process.env.NODE_ENV = prevEnv
})
