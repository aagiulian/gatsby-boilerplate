const axios = require("axios");
const preparePayload = (query, v) => {
  return {
    query,
    variables: v,
  };
};

const SHOPIFY_GRAPHQL_URL = `https://${process.env.GATSBY_SHOPNAME_SHOPIFY}/api/2021-07/graphql.json`;

const CUSTOMER_ADDRESS = `
  id
  firstName
  lastName
  address1
  address2
  company
  phone
  city
  country
  province
  zip
`;

const CUSTOMER = `query customerQuery($customerAccessToken: String!){
    customer(customerAccessToken: $customerAccessToken) {
      firstName
      lastName
      acceptsMarketing
      phone
      email
      addresses(first:100) {
        edges {
          node {
            ${CUSTOMER_ADDRESS}
          }
        }
      }
      defaultAddress {
        id
      }
      orders(first:100){
        edges{
          node{
            orderNumber
            totalPrice
            processedAt
            statusUrl
            successfulFulfillments(first: 100){
              trackingInfo(first: 100){
                number
                url
              }
            }
            lineItems(first:100){
              edges{
                node {
                  quantity
                  title
                  variant{
                    id
                    title
                    price
                    product {
                      id
                    }
                  }
                }
              }
            }
          }
        }
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
  const payload = preparePayload(CUSTOMER, data);

  try {
    let customer = await axios({
      url: SHOPIFY_GRAPHQL_URL,
      method: "POST",
      headers: shopifyConfig,
      data: payload,
    });
    console.log(`customer`, customer.data.errors);
    customer = customer.data.data.customer;
    return {
      statusCode: 200,
      body: JSON.stringify({
        token: { token: accessToken, expiresAt: expiresAt },
        customer,
      }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
