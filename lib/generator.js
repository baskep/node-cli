const fs = require('fs-extra')
const path = require('path')
const ejs = require('ejs')
const chalk = require('chalk')

function createFile (config, templatePath, destPath, item) {
  fs.copyFileSync(templatePath, destPath)

  if (['package.json'].includes(item)) {
    ejs.renderFile(destPath, config, (err, result) => {
      if (err) {
        console.log(err)
        return
      }
      fs.writeFileSync(destPath, result)
    })
  }

  return `${chalk.green('✔ ')}${chalk.grey(`创建文件: ${destPath}`)}`
}

function generatorFile (tempFilePath, config, cb) {
  const { rootPath, projectName } = config
  const destPath = path.join(rootPath, projectName)
  const logs = []

  fs.mkdirSync(destPath)

  const map = (src, dest) => {
    const dirs = fs.readdirSync(src)
    dirs.forEach(async (item) => {
      const curPath = path.join(src, item)
      const curDestPath = path.join(dest, item)
      const temp = fs.statSync(curPath)

      if (temp.isFile()) {
        const log = createFile(config, curPath, curDestPath, item)
        log && logs.push(log)
      } else if (temp.isDirectory()) {
        fs.mkdirSync(curDestPath)
        map(curPath, curDestPath)
      }
    })
  }
  map(tempFilePath, destPath)
  cb && cb(logs)
}

module.exports = {
  generatorFile,
}
