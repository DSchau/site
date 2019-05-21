import React from 'react'
import { graphql } from 'gatsby'

import { Flex, Heading, Box } from 'serverless-design-system'
import BlogLayout from 'src/layouts/Blog'
import BlogPreview from 'src/components/pages/blog/Preview'
import { NewToServerlessPrefooterNew as NewToServerlessPrefooter, Helmet } from 'src/fragments'
import CategoryData from 'src/constants/categories.json'
import { SubscribeModal } from 'src/components' 

const BlogCategory = ({ data, pathContext: { categoryId } }) => {
    const edges = data.allBlog ? (data.allBlog.edges || []) : []
    const category = CategoryData[categoryId]
    const categoryInTitleCase = category.split(' ')
    .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
    .join(' ')

    return (
      <BlogLayout prefooter={NewToServerlessPrefooter}>
      <Helmet title={`Blogs posts under ${categoryInTitleCase} | AWS & Serverless`}/>
      <SubscribeModal />
        <Flex.center mt={[3, 3, 4, 4, 5]}>
          <Heading.h2
            fontSize={[4, 4, 6]}
            fontFamily='SoleilSb'
            align='center'
            lineHeight={1.4}
            letterSpacing='0'
            mb={0}
          >
            Posts under {category}
          </Heading.h2>
        </Flex.center>
        <Box mb={['172px', '172px', '122px', '122px', '142px']}>
        <BlogPreview blogs={edges.map(({ node }) => node)} mtFirstBlog={['42px', '42px', '52px', '52px', '92px']}/>
        </Box>
      </BlogLayout>
    )
}

export default BlogCategory

export const query = graphql`
  query CategoriesBlogs($categoryId: [String]) {
    allBlog (sort: { fields: [frontmatter___date], order: DESC }, filter: { frontmatter: { date: { ne: null }, category: {  in: $categoryId } } }) {
      edges {
        node {
          id
          frontmatter {
            title
            description
            date
            authors
            thumbnail
            category
            featured
          }
        }
      }
      totalCount
    }
  }
`
