'use strict'

function createWhenTs(params) {
  return params.typescript
}

const DOWNLOAD_BASE_URL = 'direct:'

const TEMP_DOWNLOAD_FLODER = 'node-temp'


// 远程默认模板仓库地址
const REMOTE_URL = {
  'react-admin-template': 'git://github.com/sentianc/react-admin-template.git',
  'storybook-template': 'git://github.com/sentianc/storybook-template.git'
}

const STYLE_MAP = {
  sass: 'scss',
  less: 'less',
  stylus: 'styl',
}

const TS_FILE_CONFIG = {
  'tsconfig.json': createWhenTs,
}

module.exports = {
  DOWNLOAD_BASE_URL,
  TEMP_DOWNLOAD_FLODER,
  TS_FILE_CONFIG,
  STYLE_MAP,
  REMOTE_URL,
}