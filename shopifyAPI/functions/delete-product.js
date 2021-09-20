const sanityClient = require("@sanity/client");
const crypto = require("crypto");

const sanity = sanityClient({
  projectId: process.env.GATSBY_SANITY_PROJECT_ID,
  dataset: process.env.GATSBY_SANITY_DATASET,
  apiVersion: "2021-03-25",
  token: process.env.GATSBY_API_KEY_SANITY, // we need this to get write access
  useCdn: false, // We can't use the CDN for writing
});

exports.handler = async (event, context) => {
  try {
    const secret = process.env.GATSBY_WEBHOOK_SECRET;
    if (event.headers) {
      const shopifyHmacHash = event.headers["x-shopify-hmac-sha256"];

      const contentHmac = await crypto
        .createHmac("Sha256", secret)
        .update(Buffer.from(event.body, "utf8"))
        .digest("base64");

      if (contentHmac !== shopifyHmacHash) {
        return {
          statusCode: 500,
          body: JSON.stringify("Bad request"),
        };
      } else {
        const jsonBody = JSON.parse(event.body);
        const id = `product-${jsonBody.id}`;
        const responseSanity = await sanity.delete(id);
        if (responseSanity.title) {
          return {
            statusCode: 200,
            body: JSON.stringify({ data: responseSanity }),
          };
        } else {
          return {
            statusCode: 500,
            body: JSON.stringify("Bad request"),
          };
        }
      }
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify("Bad request"),
    };
  }
};
