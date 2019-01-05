const postcss = require('postcss')
const postcssrc = require('postcss-load-config')
const deasyncPromise = require('deasync-promise')

// styled component expression regex
const expressionsRegex = /__QUASI_EXPR_(\d+)__/g

const splitExpressions = css => {
  let found
  const matches = []
  while ((found = expressionsRegex.exec(css)) !== null) {
    matches.push(found)
  }
  const { prevEnd, quasiTerms, expressionTerms } = matches.reduce(
    (acc, match) => {
      acc.quasiTerms.push(css.substring(acc.prevEnd, match.index))
      const [placeholder, expressionIndex] = match
      acc.expressionTerms.push(expressionIndex)
      acc.prevEnd = match.index + placeholder.length
      return acc
    },
    { prevEnd: 0, quasiTerms: [], expressionTerms: [] },
  )
  quasiTerms.push(css.substring(prevEnd, css.length))
  return { quasiTerms, expressionTerms }
}

const buildQuasisAst = (t, terms) =>
  terms.map((term, i) =>
    t.templateElement(
      {
        raw: term,
        cooked: term,
      },
      i === terms.length - 1,
    ),
  )

const generateExpressionPlaceholder = i => `__QUASI_EXPR_${i}__`

module.exports = ({ types: t }) => ({
  visitor: {
    TaggedTemplateExpression(path) {
      const {
        node: {
          tag,
          quasi: { quasis, expressions },
        },
      } = path
      const tmatch = () =>
        (tag.object && tag.object.name && tag.object.name === 'styled') ||
        (tag.callee && tag.callee.name && tag.callee.name === 'styled') ||
        (tag.callee &&
          tag.callee.object &&
          tag.callee.object.object &&
          tag.callee.object.object.name &&
          tag.callee.object.object.name === 'styled') ||
        (tag.name && tag.name === 'createGlobalStyle')

      if (!tmatch()) return

      // extracts css from template literal
      let css = quasis.reduce((acc, { value: { raw } }, i) => {
        const expr = expressions[i] ? generateExpressionPlaceholder(i) : ''
        return `${acc}${raw}${expr}`
      }, '')

      // const processed = postcss(plugins).process(css, options).css
      const { plugins, options } = deasyncPromise(postcssrc())
      ;({ css } = deasyncPromise(postcss(plugins).process(css, options)))

      const { quasiTerms, expressionTerms } = splitExpressions(css)
      const quasisAst = buildQuasisAst(t, quasiTerms)
      const expressionsAst = expressionTerms.map(
        exprIndex => expressions[exprIndex],
      )

      quasis.splice(0, quasis.length, ...quasisAst)
      expressions.splice(0, expressions.length, ...expressionsAst)
    },
  },
})
