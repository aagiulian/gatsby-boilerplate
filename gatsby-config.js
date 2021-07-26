const clientConfig = require("./client-config");
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  siteMetadata: {
    title: `Gatsby`,
    description: `SanityBoilerplate`,
    author: `@aagiulian`,
    defaultLanguage: "fr",
    extraLanguages: ["en"]
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
    resolve: `gatsby-source-shopify`,
    options: {
      // The domain name of your Shopify shop.
      storeUrl: clientConfig.shopify.storeUrl,
      // The storefront access token
      password: clientConfig.shopify.password,
    },
  },
    // `gatsby-plugin-extract-schema`,
    // {
    //   resolve: "gatsby-source-sanity",
    //   options: {
    //     ...clientConfig.sanity,
    //     // token: process.env.SANITY_READ_TOKEN,
    //     watchMode: !isProd,
    //     overlayDrafts: !isProd,
    //   },
    // },
    // Peut etre delete gatsby plugin manifest a voir!
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
