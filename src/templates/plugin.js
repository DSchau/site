import React from 'react'
import { graphql } from 'gatsby'

import DefaultLayout from 'src/layouts/DefaultNew'
import PluginContent from 'src/components/pages/plugin/PluginContent'
import { Helmet } from 'src/fragments'
import { NewToServerlessPrefooterNew as NewToServerlessPrefooter } from 'src/fragments'

const PluginPage = ({ data }) => (
  <DefaultLayout prefooter={NewToServerlessPrefooter} footerBackground={false}>
    <Helmet
      title={data.Plugin.frontmatter.seoTitle}
      description={data.Plugin.frontmatter.description}
    />
    <PluginContent {...data.Plugin} />
  </DefaultLayout>
)

module.exports = PluginPage

export const query = graphql`
  query PluginDetails($pluginId: String!) {
    Plugin: plugin(id: { eq: $pluginId }) {
      id
      frontmatter {
        title
        description
        authorLink
        authorName
        gitLink
        seoTitle
      }
      content
    }
  }
`
