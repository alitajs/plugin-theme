import { IApi, utils } from 'umi';
import { join } from 'path';
import { readFileSync } from 'fs';
import UmiThemePlugin from 'umi-theme-webpack-plugin';


export default (api: IApi) => {
  const { userConfig, paths } = api;
  const { dynamicTheme, } = userConfig;
  const { type, ...other } = dynamicTheme;

  const defaultConfig = {
    'antd': {
      type: 'antd',
      stylesDir: paths.absSrcPath,
      generateOnce: false,
      antDir: join(paths.absNodeModulesPath, 'antd'),
      varFile: join(paths.absNodeModulesPath, 'antd/lib/style/themes/default.less'),
      themeVariables: ['@primary-color'],
      outputFileName: 'alita.less'
    },
    'antd-mobile': {
      type: 'antd-mobile',
      stylesDir: paths.absSrcPath,
      generateOnce: false,
      antDir: join(paths.absNodeModulesPath, 'antd-mobile'),
      varFile: join(paths.absNodeModulesPath, 'antd-mobile/lib/style/themes/default.less'),
      themeVariables: ['@brand-primary'],
      outputFileName: 'alita.less'
    }
  }
  api.describe({
    key: 'dynamicTheme',
    config: {
      default: {
        type: 'antd-mobile',
      },
      schema(joi) {
        return joi.object({
          type: joi.string().valid('antd', 'antd-mobile'),
          themeVariables: joi.array(),
          generateOnce: joi.boolean(),
          varFile: joi.string(),
          outputFileName: joi.string(),
        });
      },
    },
  });

  const option = {
    ...defaultConfig[type],
    ...other
  };
  api.chainWebpack(webpackConfig => {
    webpackConfig.plugin('umi-theme').use(UmiThemePlugin, [
      option
    ]);
    return webpackConfig;
  });
  // 这个api添加的link会在umi.css之前无法覆盖样式
  // api.addHTMLLinks(() => {
  //   return [
  //     {
  //       rel: 'stylesheet/less',
  //       type: 'text/css',
  //       href: join(api.config.publicPath as string, option.outputFileName),
  //     },
  //   ];
  // });
  api.modifyDevHTMLContent(async (defaultHtml, { req }) => {
    const a = new RegExp(option.outputFileName);
    const link = `
    <link rel="stylesheet/less" type="text/css" href="${join(api.config.publicPath as string, option.outputFileName)}" />`
    if (!(defaultHtml as string).match(a)) {
      defaultHtml = (defaultHtml as string).replace(link, "").replace(/<body>/gi, `<body>${link}`);
    }
    return defaultHtml;
  })
  api.modifyProdHTMLContent(async (defaultHtml, args) => {
    const a = new RegExp(option.outputFileName);
    const link = `
    <link rel="stylesheet/less" type="text/css" href="${join(api.config.publicPath as string, option.outputFileName)}" />`
    if (!(defaultHtml as string).match(a)) {
      defaultHtml = (defaultHtml as string).replace(link, "").replace(/<body>/gi, `<body>${link}`);
    }
    return defaultHtml;
  });
  api.addHTMLScripts(() => {
    return [
      {
        content: readFileSync(join(__dirname, 'less.min.js'), 'utf-8'),
        type: 'text/javascript'
      },
    ];
  });
};
