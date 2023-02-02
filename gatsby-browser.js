/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
const React = require('react')
const { PageContextProvider } = require('./src/components/Context/pageContext')

exports.wrapPageElement = ({ element, props }) => {
  return <PageContextProvider pageContext={props.pageContext}>{element}</PageContextProvider>
}
