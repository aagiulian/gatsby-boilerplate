const clientConfig = require("./client-config");
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  siteMetadata: {
    defaultLanguage: "fr",
    extraLanguages: ["en"],
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
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: ["TRACKING-ID"],
        pluginConfig: {
          head: true,
          respectDNT: true,
          exclude: [],
        },
      },
    },
    // {
    //   resolve: `gatsby-plugin-google-fonts-v2`,
    //   options: {
    //     fonts: [
    //       {
    //            family: "Lato",
    //            weights: ["300", "400", "700", "900", ["400"]],
    //            variable: true,
    //            display: "swap",
    //       },
    //     ],
    //   },
    // },
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
};
