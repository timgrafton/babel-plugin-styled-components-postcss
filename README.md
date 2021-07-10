# babel-plugin-styled-components-postcss

Babel plugin for running [postcss](https://github.com/postcss/postcss) on [styled components](https://github.com/styled-components/styled-components).

### Prerequisites

- @babel/core
- @babel/preset-env
- @babel/preset-react
- postcss
- react
- react-dom
- styled-components

### Installation

```
npm i babel-plugin-styled-components-postcss --save-dev
```

### Example

**postcss.config.js**

```
module.exports = () => ({
  plugins: {
    autoprefixer: {}
  },
})
```

**package.json**

```
{
  browserslist: ["last 4 versions"]
}
```

**Before:**

```
const Arrow = styled.div`
  flex: 2;
`
```

**After:**

```
const Arrow = styled.div`
  -webkit-box-flex: 2;
  -ms-flex: 2;
  flex: 2;
`;
```

### Configuration

**.babelrc**

```
{
    "plugins": [
      "styled-components-postcss"
    ]
}
```

This plugin runs postcss on styled components as-is. So any operations which require the component ID will not work; for e.g. postcss-nested.
The purpose of this plugin is not to replace [polished](https://github.com/styled-components/polished) but rather to provide users with the ability to use postcss features it does not support; for e.g. url rebasing with postcss-url.

**NOTE:** This plugin works on the condition that a postcss config file is used, whether that be in JS, JSON etc (Uses [postcss-load-config](https://github.com/michael-ciniawsky/postcss-load-config)).
