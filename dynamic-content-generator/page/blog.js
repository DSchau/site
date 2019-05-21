const { getFileFromProjectRoot } = require('./utils')

const authors = require(getFileFromProjectRoot(
  'src/constants/generated-authors.json'
))
const categories = require(getFileFromProjectRoot(
  'src/constants/categories.json'
))
const highlightedBlogs = require(getFileFromProjectRoot(
  'src/constants/featured-blogs.json'
))

const blogsPerPage = 7
const highlightedBlogsRegEx = new RegExp(highlightedBlogs.join('|'), 'gi')
const graphqlQuery = `
{
  allBlog {
    edges {
      node {
        id
      }
    }
  }
}
`

const createBlogListingPageWithPagination = (createPage, blogs) => {
  for (let i = 0; i < blogs.length; i += blogsPerPage) {
    const page = i / blogsPerPage
    createPage({
      path: `blog${page === 0 ? '' : '/page/' + (page + 1)}`,
      component: getFileFromProjectRoot(`src/templates/blogList.js`),
      context: {
        limit: blogsPerPage,
        start: i,
        highlightedBlogsRegEx: highlightedBlogsRegEx.toString(),
      },
    })
  }
}

const createBlogPages = (createPage, blogs) => {
  blogs.forEach(({ node }, index, records) => {
    createPage({
      path: `blog/${node.id}`,
      component: getFileFromProjectRoot(`src/templates/blog.js`),
      context: {
        blogId: node.id,
        previousBlogId: (records[index - 1] || records[index + 2]).node.id,
        nextBlogId: (records[index + 1] || records[index - 2]).node.id,
      },
    })
  })
}

const createAuthorPages = createPage =>
  Object.keys(authors).forEach(authorKey => {
    createPage({
      path: `author/${authorKey}`,
      component: getFileFromProjectRoot(`src/templates/author.js`),
      context: {
        authorId: [authorKey],
      },
    })
  })

const createCategoryPages = createPage =>
  Object.keys(categories).forEach(categoryKey => {
    createPage({
      path: `blog/category/${categoryKey}`,
      component: getFileFromProjectRoot(`src/templates/category.js`),
      context: {
        categoryId: [categoryKey],
      },
    })
  })

const pageCreator = (graphql, createPage) =>
  new Promise((resolve, reject) => {
    graphql(graphqlQuery).then(result => {
      try {
        const blogs = result.data.allBlog.edges
        createBlogListingPageWithPagination(createPage, blogs)
        createBlogPages(createPage, blogs)
        createAuthorPages(createPage)
        createCategoryPages(createPage)
        resolve()
      } catch (e) {
        console.log('error generating blog pages:', e)
        reject(e)
      }
    })
  })

module.exports = pageCreator
