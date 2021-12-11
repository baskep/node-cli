#!/usr/bin/env node

'use strict'
const argv = require('minimist')(process.argv.slice(2))
const commands = argv._
const pkg = require('../package.json')
const { Creator } = require('./create-app')

console.debug(`[⚙️node-cli]: ${pkg.name}@${pkg.version}`)

new Creator({ projectName: commands[0] })

