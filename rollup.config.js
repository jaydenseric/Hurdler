import babel from 'rollup-plugin-babel'

const pkg = require('./package.json')

export default {
  entry: 'lib/index.js',
  plugins: [babel()],
  targets: [{
    dest: pkg['main'],
    format: 'umd',
    moduleName: 'hurdler',
    sourceMap: true
  }, {
    dest: pkg['jsnext:main'],
    format: 'es',
    sourceMap: true
  }]
}
