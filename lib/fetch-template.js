'use strict'

const ora = require('ora')
const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const download = require('download-git-repo')

const { DOWNLOAD_BASE_URL, REMOTE_URL, TEMP_DOWNLOAD_FLODER } = require('../config')

async function fetchTemplate (rootPath, tempalte) {
  const tempPath = path.join(rootPath, TEMP_DOWNLOAD_FLODER)
  const remoteUrl = DOWNLOAD_BASE_URL + REMOTE_URL[tempalte]

  // 下载文件的缓存目录
  if (fs.existsSync(tempPath)) fs.removeSync(tempPath)

  return new Promise((resolve) => {
    const spinner = ora('正在拉取远程模板...').start()
    download(remoteUrl, tempPath, { clone: true }, (err) => {
      if (err) {
        console.log(err)
        spinner.color = 'red'
        spinner.fail(chalk.red('拉取远程模板仓库失败！'))
        fs.removeSync(tempPath)
        resolve('')
        return
      }
      spinner.color = 'green'
      spinner.succeed(`${chalk.grey('拉取远程模板仓库成功！')}`)
      resolve(tempPath)
    })
  })
}

module.exports = {
  fetchTemplate,
}
