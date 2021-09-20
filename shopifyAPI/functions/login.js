// response = {
//   "firstName": "Arthur",
//   "lastName": "Giuliano",
//   "acceptsMarketing": false,
//   "phone": null,
//   "email": "giuliano.arthur@gmail.com",
//   "addresses": {
//       "edges": [
//           {
//               "node": {
//                   "firstName": "Arthur",
//                   "lastName": "Giuliano",
//                   "address1": "41 chemin de saint-etienne",
//                   "address2": "bat DB appt 204",
//                   "company": null,
//                   "phone": null,
//                   "city": "Bayonne",
//                   "country": "France",
//                   "province": null,
//                   "zip": "64100"
//               }
//           }
//       ]
//   },
//   "defaultAddress": {
//       "firstName": "Arthur",
//       "lastName": "Giuliano",
//       "address1": "41 chemin de saint-etienne",
//       "address2": "bat DB appt 204",
//       "company": null,
//       "phone": null,
//       "city": "Bayonne",
//       "country": "France",
//       "province": null,
//       "zip": "64100"
//   },
//   "orders": {
//       "edges": []
//   }
// }

const axios = require("axios");
const preparePayload = (query, v) => {
  return {
    query,
    variables: v,
  };
};

const SHOPIFY_GRAPHQL_URL = `https://${process.env.GATSBY_SHOPNAME_SHOPIFY}/api/2021-07/graphql.json`;

const CUSTOMER_TOKEN = `mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      userErrors {
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
  `;

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
                node{
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

  const payload = preparePayload(CUSTOMER_TOKEN, {
    input: {
      email: data.email,
      password: data.password,
    },
  });
  try {
    const token = await axios({
      url: SHOPIFY_GRAPHQL_URL,
      method: "POST",
      headers: shopifyConfig,
      data: payload,
    });
    if (token.data.data.customerAccessTokenCreate.userErrors.length > 0) {
      throw token.data.data.customerAccessTokenCreate.userErrors;
    } else {
      accessToken =
        token.data.data.customerAccessTokenCreate.customerAccessToken
          .accessToken;
      expiresAt =
        token.data.data.customerAccessTokenCreate.customerAccessToken.expiresAt;
    }
  } catch (err) {
    console.log(`error :`, err);
    return {
      statusCode: 200,
      body: JSON.stringify({ error: "Problem with email or password" }),
    };
  }

  console.log(`accessToken`, accessToken);
  const payloadCustomer = preparePayload(CUSTOMER, {
    customerAccessToken: accessToken,
  });

  try {
    let customer = await axios({
      url: SHOPIFY_GRAPHQL_URL,
      method: "POST",
      headers: shopifyConfig,
      data: payloadCustomer,
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
