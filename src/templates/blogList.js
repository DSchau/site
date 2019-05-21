import React from 'react'
import { graphql } from 'gatsby'

import BlogLayout from 'src/layouts/BlogNewest'
import HighlightedBlogs from 'src/components/pages/blog/HighlightedBlogs'
import BlogPreview from 'src/components/pages/blog/Preview'
import {
  Helmet,
  NewToServerlessPrefooterNewest as NewToServerlessPrefooter,
} from 'src/fragments'
import { Pagination, SubscribeModal } from 'src/components'
import HighlightedBlogList from 'src/constants/featured-blogs.json'
import { Box } from 'serverless-design-system'

const BlogList = ({
  data: {
    blogs: { edges, totalCount },
    highlighted,
  },
  pathContext: { start, limit },
  location,
}) => {
  const totalPages = Math.ceil(totalCount / limit)
  const currentPage = start / limit
  const highlightedBlogs = highlighted.edges
    .map(({ node }) => node)
    .sort((blog1, blog2) => {
      const blog1Priority = HighlightedBlogList.indexOf(blog1.id)
      const blog2Priority = HighlightedBlogList.indexOf(blog2.id)
      if (blog1Priority === blog2Priority) {
        return 0
      }
      return blog1Priority > blog2Priority ? 1 : -1
    })

  return (
    <BlogLayout prefooter={NewToServerlessPrefooter}>
      <Helmet
        title='Serverless Blog'
        description='Articles, resources, and posts on serverless architectures, best practices, and how-to'
        location={location}
      />
      <SubscribeModal />
      {currentPage === 0 && <HighlightedBlogs blogs={highlightedBlogs} />}
      <BlogPreview
        blogs={edges.map(({ node }) => node)}
        currentPage={currentPage}
      />

      <Box mt={['62px', '62px', '62px', '62px', '120px']}>
        <Pagination total={totalPages} current={currentPage} />
      </Box>
    </BlogLayout>
  )
}

export default BlogList

export const query = graphql`
  query Blogs($start: Int!, $limit: Int!, $highlightedBlogsRegEx: String!) {
    blogs: allBlog(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { date: { ne: null } } }
      skip: $start
      limit: $limit
    ) {
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
          }
        }
      }
      totalCount
    }
    highlighted: allBlog(filter: { id: { regex: $highlightedBlogsRegEx } }) {
      edges {
        node {
          id
          frontmatter {
            title
            description
            date
            authors
            category
            thumbnail
            heroImage
          }
        }
      }
    }
  }
`
