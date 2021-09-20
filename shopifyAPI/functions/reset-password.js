const axios = require("axios");
const preparePayload = (query, v) => {
  return {
    query,
    variables: v,
  };
};

const SHOPIFY_GRAPHQL_URL = `https://${process.env.GATSBY_SHOPNAME_SHOPIFY}/api/2021-07/graphql.json`;

const CUSTOMER_RESET = `mutation customerResetByUrl($resetUrl: URL!, $password: String!) {
    customerResetByUrl(resetUrl: $resetUrl, password: $password) {
        customer {
          id
        }
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
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
  if (event.httpMethod !== "POST" || !event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Bad request body" }),
    };
  }

  let data;

  try {
    data = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Bad request body" }),
    };
  }
  const payload = preparePayload(CUSTOMER_RESET, {
    resetUrl: data.resetUrl,
    password: data.password,
  });

  try {
    customer = await axios({
      url: SHOPIFY_GRAPHQL_URL,
      method: "POST",
      headers: shopifyConfig,
      data: payload,
    });

    if (customer.data.data.customerResetByUrl.customerUserErrors.length > 0) {
      throw customer.data.data.customerResetByUrl.customerUserErrors;
    } else {
      customer = customer.data.data.customerResetByUrl;
      return {
        statusCode: 200,
        body: JSON.stringify({
          token: customer.customerAccessToken,
          customer: customer.customer,
        }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err[0].message }),
    };
  }
};
