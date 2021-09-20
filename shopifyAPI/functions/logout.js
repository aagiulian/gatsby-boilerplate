const axios = require("axios");
const preparePayload = (query, v) => {
  return {
    query,
    variables: v,
  };
};

const SHOPIFY_GRAPHQL_URL = `https://${process.env.GATSBY_SHOPNAME_SHOPIFY}/api/2021-07/graphql.json`;

const CUSTOMER_LOGOUT = `mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      userErrors {
        field
        message
      }
      deletedAccessToken
      deletedCustomerAccessTokenId
    }
  }`;

const shopifyConfig = {
  Accept: "application/json",
  "X-Shopify-Storefront-Access-Token": process.env.GATSBY_STOREFRONT_API,
  // "X-Shopify-Access-Token": process.env.GATSBY_PASSWORD_SHOPIFY,
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST" || !event.body)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Bad request body" }),
    };

  try {
    data = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Bad request body" }),
    };
  }
  const payload = preparePayload(CUSTOMER_LOGOUT, {
    customerAccessToken: data.accessToken,
  });
  try {
    const logout = await axios({
      url: SHOPIFY_GRAPHQL_URL,
      method: "POST",
      headers: shopifyConfig,
      data: payload,
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ logout: logout }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err[0] }),
    };
  }
};
