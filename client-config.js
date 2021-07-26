require("dotenv").config()

module.exports = {
    sanity: {
      projectId: process.env.GATSBY_SANITY_PROJECT_ID || "",
      dataset: process.env.GATSBY_SANITY_DATASET || "",
      token:
        process.env.SANITY_READ_TOKEN ||
        "",
    },
    shopify: {
      storeUrl: process.env.SHOPIFY_STORE_URL || "",
      password: process.env.SHOPIFY_PASSWORD || ""
    }
  };
