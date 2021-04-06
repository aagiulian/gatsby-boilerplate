module.exports = {
    sanity: {
      projectId: process.env.GATSBY_SANITY_PROJECT_ID || "",
      dataset: process.env.GATSBY_SANITY_DATASET || "",
      token:
        process.env.SANITY_READ_TOKEN ||
        "",
    },
  };
  