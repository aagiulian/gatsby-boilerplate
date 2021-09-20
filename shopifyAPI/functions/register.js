const axios = require("axios");
const preparePayload = (query, v) => {
  return {
    query,
    variables: v,
  };
};

const SHOPIFY_GRAPHQL_URL = `https://${process.env.GATSBY_SHOPNAME_SHOPIFY}/api/2021-07/graphql.json`;

const CUSTOMER_CREATE = `mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      userErrors {
        field
        message
      }
      customer {
        id
      }
      customerUserErrors {
        field
        message
      }
    }
  }`;

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
    console.log("JSON parsing error:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Bad request body" }),
    };
  }

  const payload = preparePayload(CUSTOMER_CREATE, {
    input: {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    },
  });

  try {
    let customer = await axios({
      url: SHOPIFY_GRAPHQL_URL,
      method: "POST",
      headers: shopifyConfig,
      data: payload,
    });

    console.log(`customer`, customer.data.errors);
    const { customerCreate } = customer.data.data;

    if (customer.data.errors) throw customer.data.errors[0];
    if (customerCreate.userErrors.length > 0)
      throw customerCreate.userErrors[0];

    // If that was successful lets log our new user in
    const loginPayload = preparePayload(CUSTOMER_TOKEN, {
      input: {
        email: data.email,
        password: data.password,
      },
    });

    try {
      let token = await axios({
        url: SHOPIFY_GRAPHQL_URL,
        method: "POST",
        headers: shopifyConfig,
        data: loginPayload,
      });
      const { customerAccessTokenCreate } = token.data.data;
      if (customerAccessTokenCreate.userErrors.length > 0) {
        throw customerAccessTokenCreate.userErrors;
      } else {
        token = customerAccessTokenCreate.customerAccessToken;
        // Manipulate the response and send some customer info back down that we can use later
        return {
          statusCode: 200,
          body: JSON.stringify({
            token,
            customer: {
              firstName: data.firstName,
              lastName: data.lastName,
            },
          }),
        };
      }
    } catch (err) {
      console.log(`erreur ici`, err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: err[0].message }),
      };
    }
  } catch (err) {
    console.log("erreur la", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
