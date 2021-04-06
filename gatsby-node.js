const config = require("./gatsby-config");

// exports.createPages = async ({ graphql, actions }) => {
//   await whateverPageCreate
// };

const createLocalePage = (page, createPage) => {
  createPage({
    ...page,
    context: {
      ...page.context,
      lang: config.siteMetadata.defaultLanguage,
      originalPath: page.path,
    },
  });
  config.siteMetadata.extraLanguages.map(async (lang) => {
    const localizedPath = `/${lang}${page.path}`;
    createPage({
      ...page,
      path: localizedPath,
      context: {
        ...page.context,
        originalPath: page.path,
        lang,
      },
    });
  });
};

exports.onCreatePage = async ({
  page,
  actions: { createPage, deletePage },
}) => {
  await deletePage(page);
  createLocalePage(page, createPage);
};