# @alitajs/plugin-theme

you can change Ant Design (or Ant Design Mobile) specific color theme in browser.

## Install
  - yarn add @alitajs/plugin-theme

`config/config.ts`

```ts
  plugins:['@alitajs/plugin-theme'],
  dynamicTheme:{
    type:'antd-mobile',
    varFile: path.join(__dirname, '../src/default.less'),
    themeVariables: ['@brand-primary','@abcd-efg'],
  }
```

| Property | Type | Default | Descript |
| --- | --- | --- | --- |
| antDir | string | - | This is path to antd directory in your node_modules |
| varFile | string | - | Path to your theme related variables file |
| themeVariables | array | ['@primary-color'] | List of variables that you want to dynamically change |
| generateOnce | boolean | false | Everytime webpack will build new code due to some code changes in development, this plugin will run again unless you specify this flag as `true` which will just compile your styles once |
| outputFileName | string | color.less | less var file name |
