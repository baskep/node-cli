'use strict'

const { exec } = require('child_process')
const fs = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer')
const ora = require('ora')
const chalk = require('chalk')
const userName = require('git-user-name')()
const userEmail = require('./vendor')()

const { getRootPath, shouldUseYarn, shouldUseCnpm } = require('../util')
const { fetchTemplate } = require('./fetch-template')
const { generatorFile } = require('./generator')

class Creator {
  constructor ({ projectName }) {
    this.config = {
      rootPath: getRootPath(),
      projectName: projectName || '',
    }
    this.prompts = []
    this.create()
  }

  async create () {
    try {
      await this.ask()
      const { rootPath, template } = this.config
      const res = await fetchTemplate(rootPath, template)
      res && this.write(res)
    } catch (error) {
      console.log(chalk.red('创建项目失败: ', error))
    }
  }

  async ask () {
    const { projectName } = this.config
    if (!projectName) {
      const projectNameAnswer = await inquirer.prompt([{
        type: 'input',
        name: 'projectName',
        message: '请输入项目名',
      }])
      this.config.projectName = projectNameAnswer.projectName
    }
    await this.validateProjectName()

    this.askTemplate()
    this.askCss()
    this.askTypeScript()
    this.askDescription()
    this.askAuthorInfo()
    const answers = await inquirer.prompt(this.prompts)
    this.config = { ...this.config, ...answers }
  }


  askTemplate() {
    this.prompts.push({
      type: 'list',
      name: 'template',
      message: '请选择下载的模板',
      choices: ['react-admin-template', 'storybook-template'],
      default: 'react-admin-template'
    })
  }

  askCss() {
    this.prompts.push({
      type: 'list',
      name: 'css',
      message: '请选择所使用的css预处理器',
      choices: ['less', 'scss', 'stylus'],
      default: 'less'
    })
  }

  askTypeScript() {
    this.prompts.push({
      type: 'confirm',
      name: 'typescript',
      message: '是否使用TypeScript',
      default: true
    })
  }

  askDescription () {
    this.prompts.push({
      type: 'input',
      name: 'description',
      message: '请输入项目介绍',
    })
  }

  askAuthorInfo () {
    this.prompts.push({
      type: 'input',
      name: 'author',
      message: '请输入作者信息',
      default: `${userName}<${userEmail}>`,
    })
  }

  validateProjectName () {
    const { rootPath, projectName } = this.config
    const exists = fs.existsSync(path.join(rootPath, projectName))
    if (!projectName) {
      console.info(chalk.red('无效的项目名'))
      process.exit(1)
    }
    if (exists) {
      console.info(chalk.red(`项目 ${projectName} 已经存在，请换一个项目名`))
      process.exit(1)
    }
    return true
  }

  write (tempPath) {
    const { projectName } = this.config
    generatorFile(tempPath, this.config, (logs) => {
      console.log()
      console.log(`${chalk.green('✔ ')}${chalk.grey(`创建项目: ${chalk.grey.bold(projectName)}`)}`)
      logs.forEach(log => console.log(log))
      console.log()
      fs.removeSync(tempPath)
      this.initProject()
    })
  }

  async initProject () {
    const { rootPath, projectName } = this.config
    const destPath = path.join(rootPath, projectName)
    
    process.chdir(destPath)

    await this.gitInit()
    await this.installDenpendence()

    this.confirmInfo()
  }

  gitInit () {
    return new Promise((resolve) => {
      const { projectName } = this.config
      const gitInitSpinner = ora(`cd ${chalk.cyan.bold(projectName)}, 执行 ${chalk.cyan.bold('git init')}`).start()
      const gitInit = exec('git init')
      gitInit.on('close', (code) => {
        if (code === 0) {
          gitInitSpinner.color = 'green'
          gitInitSpinner.succeed(gitInit.stdout.read())
        } else {
          gitInitSpinner.color = 'red'
          gitInitSpinner.fail(gitInit.stderr.read())
        }
        resolve()
      })
    })
  }

  installDenpendence () {
    return new Promise((resolve) => {
      let command = 'npm install'
      if (shouldUseYarn()) {
        command = 'yarn install'
      } else if (shouldUseCnpm()) {
        command = 'cnpm install'
      }
      const installSpinner = ora(`执行安装项目依赖 ${chalk.cyan.bold(command)}, 需要一会儿...`).start()
      exec(command, (error, stdout, stderr) => {
        if (error) {
          installSpinner.color = 'red'
          installSpinner.fail(chalk.red('安装项目依赖失败，请自行重新安装！'))
          console.log(error)
          this.installRes = false
        } else {
          installSpinner.color = 'green'
          installSpinner.succeed('安装成功')
          console.log(`${stderr}${stdout}`)
          this.installRes = true
        }
        resolve()
      })
    })
  }

  confirmInfo () {
    if (this.installRes) {
      const { projectName } = this.config
      console.log(chalk.green(`创建项目 ${chalk.green.bold(projectName)} 成功！`))
      console.log(chalk.green(`请进入项目 ${chalk.green.bold(projectName)} 开始工作吧！😝`))
    }
  }
}

module.exports = {
  Creator,
}
