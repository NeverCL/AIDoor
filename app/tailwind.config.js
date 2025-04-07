module.exports = {
  content: [
    './src/pages/**/*.tsx',
    './src/components/**/*.tsx',
    './src/layouts/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        // 定义两种自定义文本颜色
        'primary': '#fff',  // 主要文本颜色
        'secondary': '#999999', // 次要文本颜色
      },
    },
  },
  corePlugins: {
    preflight: false, // 完全禁用预设样式
  },
  // 通过在CSS中添加更高优先级的选择器来覆盖img和video样式
  // 或者使用下面的方式自定义预设样式
  // future: {
  //   removePreflightStyles: ['img', 'video'],
  // },
}
