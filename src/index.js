const deasyncPromise = require('deasync-promise')
const postcss = require('postcss')
const postcssrc = require('postcss-load-config')

module.exports = ({ types: t }) => ({
  visitor: {
    TaggedTemplateExpression(path) {
      const {
        node: {
          tag,
          quasi: { quasis, expressions },
        },
      } = path

      if (
        !(
          [
            tag.object?.name,
            tag.callee?.name,
            tag.callee?.object?.object?.name,
          ].includes('styled') || tag.name === 'createGlobalStyle'
        )
      )
        return

      const { plugins, options } = deasyncPromise(postcssrc())
      options.from = undefined
      const { css } = deasyncPromise(
        postcss(plugins).process(
          quasis.reduce(
            (accumulator, { value: { raw } }, i) =>
              `${accumulator}${raw}${
                expressions[i] ? `__QUASI_EXPR_${i}__` : ''
              }`,
            '',
          ),
          options,
        ),
      )
      const { expressionTerms, previousEnd, quasiTerms } = [
        ...css.matchAll(/__QUASI_EXPR_(\d+)__/g),
      ].reduce(
        (acc, match) => {
          acc.quasiTerms.push(css.substring(acc.previousEnd, match.index))
          const [placeholder, expressionIndex] = match
          acc.expressionTerms.push(expressionIndex)
          acc.previousEnd = match.index + placeholder.length
          return acc
        },
        { expressionTerms: [], previousEnd: 0, quasiTerms: [] },
      )
      quasiTerms.push(css.substring(previousEnd, css.length))
      quasis.splice(
        0,
        quasis.length,
        ...quasiTerms.map((term, i) =>
          t.templateElement(
            {
              raw: term,
              cooked: term,
            },
            i === quasiTerms.length - 1,
          ),
        ),
      )
      expressions.splice(
        0,
        expressions.length,
        ...expressionTerms.map((exprIndex) => expressions[exprIndex]),
      )
    },
  },
})
