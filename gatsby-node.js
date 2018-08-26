const _ = require(`lodash`)
const Promise = require(`bluebird`)
const path = require(`path`)
const slash = require(`slash`)
const createPaginatedPages = require("gatsby-paginate");

// Implement the Gatsby API “createPages”. This is
// called after the Gatsby bootstrap is finished so you have
// access to any information necessary to programmatically
// create pages.
// Will create pages for Wordpress pages (route : /{slug})
// Will create pages for Wordpress posts (route : /post/{slug})
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return new Promise((resolve, reject) => {
    // The “graphql” function allows us to run arbitrary
    // queries against the local Wordpress graphql schema. Think of
    // it like the site has a built-in database constructed
    // from the fetched data that you can run queries against.

    // ==== PAGES (WORDPRESS NATIVE) ====
    graphql(
      `
        {
          allWordpressPage {
            edges {
              node {
                id
                slug
                status
                template
              }
            }
          }
        }
      `
    )
      .then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        // Create Page pages.
        const pageTemplate = path.resolve(`./src/templates/page.js`)
        // We want to create a detailed page for each
        // page node. We'll just use the Wordpress Slug for the slug.
        // The Page ID is prefixed with 'PAGE_'
        _.each(result.data.allWordpressPage.edges, edge => {
          // Gatsby uses Redux to manage its internal state.
          // Plugins and sites can use functions like "createPage"
          // to interact with Gatsby.
          createPage({
            // Each page is required to have a `path` as well
            // as a template component. The `context` is
            // optional but is often necessary so the template
            // can query data specific to each page.
            path: `/${edge.node.slug}/`,
            component: slash(pageTemplate),
            context: {
              id: edge.node.id,
            },
          })
        })
      })
      // ==== END PAGES ====

      // ==== POSTS (WORDPRESS NATIVE AND ACF) ====
      .then(() => {
        graphql(
          `
            {
              allWordpressPost(sort: { fields: [date], order: DESC }) {
                edges {
                  node {
                    id
                    title
                    excerpt
                    slug
                    content
                    status
                    template
                    date(formatString: "MMMM DD, YYYY")
                  }
                }
              }
            }
          `

        ).then(result => {
          if (result.errors) {
            console.log(result.errors)
            reject(result.errors)
          }
          createPaginatedPages({
            edges: result.data.allWordpressPost.edges,
            createPage: createPage,
            pageTemplate: `./src/templates/index.js`,
            pageLength: 5, // This is optional and defaults to 10 if not used
            // pathPrefix: "", // This is optional and defaults to an empty string if not used
            // context: {} // This is optional and defaults to an empty object if not used
          });
          const postTemplate = path.resolve(`./src/templates/post.js`)
          // We want to create a detailed page for each
          // post node. We'll just use the Wordpress Slug for the slug.
          // The Post ID is prefixed with 'POST_'
          _.each(result.data.allWordpressPost.edges, edge => {
            createPage({
              path: edge.node.slug,
              component: slash(postTemplate),
              context: {
                id: edge.node.id,
              },
            })
          })
          resolve()
        })
      })
    // ==== END POSTS ====
  })
}
