import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import {
  Row,
  Column,
  Flex,
  Background,
  Text,
  Box,
} from 'serverless-design-system'
import Default from 'src/layouts/DefaultNew'
import DocsWrapper from '../components/pages/doc/DocsWrapper'
import Sidebar from '../components/pages/doc/Sidebar'
import LiteHeader from '../components/pages/doc/LiteHeader'
import gitHubSvg from 'src/assets/images/github.svg'
import { Helmet as SEOHelmet, InternalLink } from 'src/fragments'
import { Button } from 'src/fragments/DesignSystem'
import { WhiteButtonNew as WhiteButton } from 'src/components'

const ServerlessFrameworkText = ({ children }) => (
  <Text fontSize='16px' color='white' letterSpacing='0.67px' mt={(22, 22, 32)}>
    serverless framework
  </Text>
)

const FrameworkType = ({ children }) => (
  <Text fontSize='36px' color='white' letterSpacing='1.5px'>
    {children}
  </Text>
)

const DocTemplate = ({ data: { doc }, location }) => (
  <Default footerBackground={false} noPrefooter>
    <Helmet
      link={[
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.css',
        },
      ]}
      script={[
        {
          src: 'https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.js',
          type: 'text/javascript',
        },
      ]}
    />

    <DocsWrapper __url={location.pathname}>
      <SEOHelmet {...doc.frontmatter} location={location} />
      <Box
        display={
          doc.frontmatter.gitLink == '/docs/README.md'
            ? ['none', 'none', 'none', 'none', 'block']
            : 'block'
        }
      >
        <LiteHeader url={location.pathname} />
      </Box>
      <Row className='docWrapper'>
        <Sidebar head={doc.frontmatter} />
        <Column>
          {doc.frontmatter.gitLink == '/docs/README.md' ? (
            <Flex
              flexDirection={['column', 'column', 'row']}
              mt={['-3px', '-3px', '-3px', 0]}
            >
              <Background
                width={[1, 1, 0.5]}
                background='#fd5750'
                height={[164, 164, 184]}
              >
                <Column alignItems='center'>
                  <ServerlessFrameworkText />
                  <FrameworkType>open source</FrameworkType>
                  <InternalLink to={'/framework/docs/getting-started/'}>
                    <WhiteButton mt={22}>get started</WhiteButton>
                  </InternalLink>
                </Column>
              </Background>
              <Background
                width={[1, 1, 0.5]}
                background='black'
                height={[164, 164, 184]}
              >
                <Column alignItems='center'>
                  <ServerlessFrameworkText />
                  <FrameworkType>enterprise</FrameworkType>
                  <InternalLink to={'/enterprise/'}>
                    <Button mt={22}>schedule a demo</Button>
                  </InternalLink>
                </Column>
              </Background>
            </Flex>
          ) : (
            <a
              title='Edit this page on github'
              rel='noopener noreferrer'
              href={`https://github.com/serverless/serverless/edit/master${
                doc.frontmatter.gitLink
              }`}
            >
              <span className='editLink'>
                <img src={gitHubSvg} />
                <span className='text'>Edit on github</span>
              </span>
            </a>
          )}

          <Column
            dangerouslySetInnerHTML={{ __html: doc.content }}
            className='content'
          />
        </Column>
      </Row>
    </DocsWrapper>
  </Default>
)

export default DocTemplate

export const query = graphql`
  query Doc($docId: String!) {
    doc(id: { eq: $docId }) {
      id
      frontmatter {
        title
        menuText
        layout
        menuOrder
        gitLink
        description
        menuItems {
          menuText
          path
        }
      }
      content
    }
  }
`
