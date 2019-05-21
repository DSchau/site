import React from 'react'
import { graphql } from 'gatsby'

import DefaultLayout from 'src/layouts/DefaultNewest'
import ExampleContent from 'src/components/pages/example/ExampleContent'
import { Helmet } from 'src/fragments'
import { NewToServerlessPrefooterNewest as NewToServerlessPrefooter } from 'src/fragments'

export default ({ data }) => (
  <DefaultLayout prefooter={NewToServerlessPrefooter} footerBackground={false}>
    <Helmet
      title={data.Example.frontmatter.seoTitle}
      description={data.Example.frontmatter.description}
    />
    <ExampleContent {...data.Example} />
  </DefaultLayout>
)

export const query = graphql`
  query ExampleDetails($exampleId: String!) {
    Example: example(id: { eq: $exampleId }) {
      id
      frontmatter {
        title
        language
        platform
        description
        authorLink
        authorName
        authorAvatar
        gitLink
        seoTitle
      }
      content
    }
  }
`
