const axios = require("axios");
const preparePayload = (query, v) => {
  return {
    query,
    variables: v,
  };
};

const SHOPIFY_GRAPHQL_URL = `https://${process.env.GATSBY_SHOPNAME_SHOPIFY}/api/unstable/graphql.json`;

const UPDATE_LINE_CART = `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first:10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
            }
          }
  
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }`;

const shopifyConfig = {
  Accept: "application/json",
  "X-Shopify-Storefront-Access-Token": process.env.GATSBY_STOREFRONT_API,
  // "X-Shopify-Access-Token": process.env.GATSBY_PASSWORD_SHOPIFY,
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST")
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Bad request" }),
    };
  try {
    data = JSON.parse(event.body);
  } catch (error) {
    console.log("JSON parsing error:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Bad request body" }),
    };
  }

  console.log(`data`, data);
  const payload = preparePayload(UPDATE_LINE_CART, {
    cartId: data.cartId,
    lines: data.lines,
  });
  console.log(`payload`, payload);
  try {
    const cart = await axios({
      url: SHOPIFY_GRAPHQL_URL,
      method: "POST",
      headers: shopifyConfig,
      data: payload,
    });
    console.log(`cart: `, cart);
    console.log(`cart.data.errors`, cart.data.errors);
    if (cart.data.errors) {
      return {
        statusCode: 200,
        body: JSON.stringify({ error: cart.data.errors[0].message }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ cart: cart.data.data.cartLinesUpdate.cart }),
      };
    }
  } catch (err) {
    console.log(`error : `, err);
    return {
      statusCode: 200,
      body: JSON.stringify({ error: "Failed" }),
    };
  }
};
