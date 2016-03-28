import config from './rollup.config'

config.format = 'umd'
config.dest = 'dist/hurdler.umd.js'
config.moduleName = 'hurdler'

export default config
