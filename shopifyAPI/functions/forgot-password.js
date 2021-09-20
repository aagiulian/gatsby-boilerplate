const axios = require("axios");
const preparePayload = (query, v) => {
  return {
    query,
    variables: v,
  };
};

const SHOPIFY_GRAPHQL_URL = `https://${process.env.GATSBY_SHOPNAME_SHOPIFY}/api/2021-07/graphql.json`;

const CUSTOMER_RECOVERY = `mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      userErrors {
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

  const payload = preparePayload(CUSTOMER_RECOVERY, {
    email: data.email,
  });

  try {
    const customer = await axios({
      url: SHOPIFY_GRAPHQL_URL,
      method: "POST",
      headers: shopifyConfig,
      data: payload,
    });
    const { data, errors } = customer.data;
    const { customerRecover } = data;
    if (customerRecover && customerRecover.userErrors.length > 0) {
      throw customerRecover.userErrors;
    } else if (errors && errors.length > 0) {
      throw errors;
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ customerRecover }),
      };
    }
  } catch (err) {
    console.log(`err : `, err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err[0].message }),
    };
  }
};
