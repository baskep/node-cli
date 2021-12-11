const path = require('path')
const { execSync } = require('child_process')

function getRootPath () {
  console.log()
  console.log(`根目录: ${process.cwd()}`)
  return process.cwd()
}

function getTemplatePath () {
  console.log()
  console.log(`模板目录: ${path.resolve(__dirname, '../../')}`)
  return path.resolve(__dirname, '../../')
}

function shouldUseYarn () {
  try {
    execSync('yarn --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}

function shouldUseCnpm () {
  try {
    execSync('cnpm --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}

module.exports = {
  getRootPath,
  shouldUseYarn,
  shouldUseCnpm,
  getTemplatePath,
}
