'use strict'

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      { useBuiltIns: 'usage', corejs: '3.10', targets: { node: '12' } },
    ],
    '@babel/preset-typescript',
  ],
}
