# babel-plugin-styled-components-postcss

Babel plugin for running [postcss](https://github.com/postcss/postcss) on [styled components](https://github.com/styled-components/styled-components).

### Prerequisites

* babel-core
* babel-preset-env
* babel-preset-react
* postcss

### Installation

```
npm i babel-plugin-styled-components-postcss --save-dev
```

### Example

**postcss.config.js**

```
module.exports = () => ({
  plugins: {
    autoprefixer: { browsers: ['last 4 versions'] }
  },
})
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

### Known Issues
PostCSS plugins that walk entire CSS _rules_, rather than individual declarations, require [`babel-plugin-styled-components`](https://github.com/styled-components/babel-plugin-styled-components), with the `displayName` and `ssr` flags enabled and `transpileTemplateLiterals` disabled, to have a fighting chance at working. When it's installed and configured, this plugin can use the classnames it assigns to expose a complete rule to PostCSS, and inject the modified CSS as a Styled Components global. **N.B.** that Styled Components which include interpolated functions cannot be parsed in this way.

```json
/* .babelrc */

{
    "plugins": [
        ["styled-components", {
            "displayName": true,
            "ssr": true,
            "transpileTemplateLiterals": false
        }],
        "styled-components-postcss"
    ]
}
```

```js
// Sample input. `postcss-responsive-type` uses a rule-based parsing strategy.

export const Header = styled.h1`
    font-size: responsive;
`
```

```js
// Sample output.

export const Header = styled.h1.withConfig({
  displayName: "styled-section-hero__Header",
  componentId: "s163561u-0"
})``;
_injectGlobal`.styled-section-hero__Header-s163561u-0{color:#1da1f2;font-size:calc(12px + 9 * ((100vw - 420px) / 860));}
@media screen and (min-width: 1280px){
.styled-section-hero__Header-s163561u-0{font-size:21px;}}
@media screen and (max-width: 420px){
.styled-section-hero__Header-s163561u-0{font-size:12px;}}`;
```

```js
// Sample input. This component contains an interpolated function, so it won't
// be processed.

export const Header = styled.h1`
    color: ${ ({ theme }) => theme.palette.blurple };
    font-size: responsive;
`
```

```js
// Sample output. See?

export const Header = styled.h1.withConfig({
  displayName: "styled-section-hero__Header",
  componentId: "s163561u-0"
})`color:${({
  theme
}) => theme.palette.blurple};font-size:responsive;`;
```
