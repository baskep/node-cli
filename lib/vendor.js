const gitconfig = require('git-config-path')
const parse = require('parse-git-config')
const extend = Object.assign

module.exports = function (options) {
  const gc = gitconfig(extend({ type: 'global' }, options && options.gitconfig))
  options = extend({ cwd: '/', path: gc }, options)
  const config = parse.sync(options) || {}
  return config.user ? config.user.email : null
}