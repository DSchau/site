import React from 'react'
import { graphql } from 'gatsby'

import DefaultLayout from 'src/layouts/DefaultNew'
import { NewToServerlessPrefooterNew as NewToServerlessPrefooter } from 'src/fragments'
import Hero from 'src/components/pages/plugins/Hero'
import Content from 'src/components/pages/plugins/Content'
import { Helmet } from 'src/fragments'

const Plugins = ({ data: plugins }) => {
  const edges = plugins.allPlugin.edges
    .filter(plugins => plugins.node.frontmatter.title !== '')
    .reverse()

  return (
    <DefaultLayout
      prefooter={NewToServerlessPrefooter}
      transparentHeader={true}
    >
      <Helmet title='Plugins Explorer | Serverless Plugins Directory' />
      <Hero />
      <Content plugins={edges.reverse().map(({ node }) => node)} />
    </DefaultLayout>
  )
}

export const query = graphql`
  query Plugins {
    allPlugin(
      limit: 15
      sort: { fields: [frontmatter___npmDownloads], order: DESC }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            description
            gitLink
            npmDownloads
            githubStars
            status
          }
        }
      }
    }
  }
`

export default Plugins
