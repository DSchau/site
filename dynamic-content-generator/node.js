const path = require('path')
const crypto = require('crypto')
const dir = require('node-dir')
const matter = require('gray-matter')
const unified = require('unified')
const markdown = require('remark-parse')
const slug = require('remark-slug')
const autoLinkHeadings = require('remark-autolink-headings')
const highlight = require('remark-highlight.js')
const html = require('remark-html')
const algoliasearch = require('algoliasearch')

//TODO : Refactor to use filesystem/remark to do this + refactor to avoid repetition
const blogConfig = require('./../scripts/blog/config')
const docsConfig = require('./../scripts/docs/config')
const exampleConfig = require('./../scripts/example/config')
const kickstartConfig = require('./../scripts/kickstart/config')
const pluginsConfig = require('./../scripts/plugins/config')

const fileReadingOptions = { match: /.md$/ }

const client = algoliasearch(
  process.env.GATSBY_ALGOLIA_APP_ID,
  '9a3c539ada1e49ee00b670534c9c605f'
)
const blogIndex = client.initIndex(process.env.GATSBY_ALGOLIA_BLOG_INDEX)
const examplesIndex = client.initIndex(
  process.env.GATSBY_ALGOLIA_EXAMPLES_INDEX
)
const pluginsIndex = client.initIndex(process.env.GATSBY_ALGOLIA_PLUGINS_INDEX)

//TODO: rename highlighted attribute to featured
examplesIndex.setSettings({
  attributesForFaceting: [
    'language',
    'platform',
    'title',
    'framework',
    'highlighted',
  ],
})

pluginsIndex.setSettings({
  attributesForFaceting: ['status', 'title', 'highlighted'],
})

function lengthInUtf8Bytes(str) {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  var m = encodeURIComponent(str).match(/%[89ABab]/g)
  return str.length + (m ? m.length : 0)
}

const algoliaMaxBytesLength = 18000

const digestCreator = content =>
  crypto
    .createHash(`md5`)
    .update(JSON.stringify(content))
    .digest(`hex`)

const sourceKickstart = createNode => (err, content, filename, next) => {
  if (err) throw err

  const { data, content: markdownContent } = matter(content)
  const frontmatter = data.category ? data : { ...data, category: [] }
  const kickstartId = path.basename(filename, path.extname(filename))

  unified()
    .use(markdown)
    .use(highlight)
    .use(html)
    .process(markdownContent, (err, file) => {
      createNode({
        id: kickstartId,
        parent: null,
        children: [],
        internal: {
          type: 'Kickstart',
          contentDigest: digestCreator(content),
        },
        frontmatter,
        content: String(file),
      })
      next()
    })
}

const sourceExamples = createNode => (err, content, filename, next) => {
  if (err) throw err

  const { data, content: markdownContent } = matter(content)
  const frontmatter = data.category ? data : { ...data, category: [] }
  const exampleId = path.basename(filename, path.extname(filename))

  examplesIndex.saveObject({
    title: frontmatter.title,
    description: frontmatter.description,
    platform: frontmatter.platform,
    gitLink: frontmatter.gitLink,
    language: frontmatter.language,
    framework: frontmatter.framework,
    highlighted: frontmatter.highlighted,
    objectID: exampleId,
  })

  unified()
    .use(markdown)
    .use(highlight)
    .use(html)
    .process(markdownContent, (err, file) => {
      createNode({
        id: exampleId,
        parent: null,
        children: [],
        internal: {
          type: 'Example',
          contentDigest: digestCreator(content),
        },
        frontmatter,
        content: String(file),
      })
      next()
    })
}

const sourcePlugins = createNode => (err, content, filename, next) => {
  if (err) throw err

  const { data, content: markdownContent } = matter(content)
  const frontmatter = data.category ? data : { ...data, category: [] }
  const pluginId = path.basename(filename, path.extname(filename))

  pluginsIndex.saveObject({
    title: frontmatter.title,
    description: frontmatter.description,
    npmDownloads: frontmatter.npmDownloads,
    status: frontmatter.status,
    githubStars: frontmatter.githubStars,
    gitLink: frontmatter.gitLink,
    highlighted: frontmatter.highlighted,
    objectID: pluginId,
  })

  unified()
    .use(markdown)
    .use(highlight)
    .use(html)
    .process(markdownContent, (err, file) => {
      createNode({
        id: pluginId,
        parent: null,
        children: [],
        internal: {
          type: 'Plugin',
          contentDigest: digestCreator(content),
        },
        frontmatter,
        content: String(file),
      })
      next()
    })
}

const sourceBlogs = createNode => (err, content, filename, next) => {
  if (err) throw err

  const { data, content: markdownContent } = matter(content)
  const frontmatter = data.category ? data : { ...data, category: [] }
  const blogId = path.basename(filename, path.extname(filename))

  const contentUTFLength = lengthInUtf8Bytes(markdownContent)
  let blogObjForAlgolia = {
    title: frontmatter.title,
    description: frontmatter.description,
    objectID: blogId,
  }

  if (contentUTFLength < algoliaMaxBytesLength) {
    blogObjForAlgolia.content = markdownContent
  }

  blogIndex.saveObject(blogObjForAlgolia)

  unified()
    .use(markdown)
    .use(slug)
    .use(highlight)
    .use(html)
    .process(markdownContent, (err, file) => {
      createNode({
        id: blogId,
        parent: null,
        children: [],
        internal: {
          type: 'Blog',
          contentDigest: digestCreator(content),
        },
        frontmatter,
        content: String(file),
      })
      next()
    })
}

const sourceDocs = createNode => (err, content, _filename, next) => {
  if (err) throw err

  const { data: frontmatter, content: markdownContent } = matter(content)
  const url = (frontmatter.gitLink || '').replace(/\/README.md|.md/i, '/')

  if (!url) {
    return next()
  }

  unified()
    .use(markdown)
    .use(slug)
    .use(autoLinkHeadings, {
      content: {
        type: 'text',
        value: '#',
      },
      linkProperties: {
        className: 'phenomic-HeadingAnchor',
      },
    })
    .use(html)
    .use(highlight)
    .process(markdownContent, (err, file) => {
      createNode({
        id: url,
        parent: null,
        children: [],
        internal: {
          type: `Doc`,
          contentDigest: digestCreator(content),
        },
        frontmatter,
        content: String(file),
      })
      next()
    })
}

const generator = createNode =>
  Promise.all([
    new Promise((resolve, reject) => {
      dir.readFiles(
        blogConfig.siteBlogPath,
        fileReadingOptions,
        sourceBlogs(createNode),
        resolve
      )
    }),

    new Promise((resolve, reject) => {
      dir.readFiles(
        exampleConfig.siteExamplePath,
        fileReadingOptions,
        sourceExamples(createNode),
        resolve
      )
    }),

    new Promise((resolve, reject) => {
      dir.readFiles(
        pluginsConfig.sitePluginPath,
        fileReadingOptions,
        sourcePlugins(createNode),
        resolve
      )
    }),

    new Promise((resolve, reject) => {
      dir.readFiles(
        kickstartConfig.kickstartPagesPath,
        fileReadingOptions,
        sourceKickstart(createNode),
        resolve
      )
    }),

    new Promise((resolve, reject) => {
      dir.readFiles(
        docsConfig.mainSiteDocsPath,
        fileReadingOptions,
        sourceDocs(createNode),
        resolve
      )
    }),
  ])

module.exports = generator
