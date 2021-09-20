const axios = require("axios");
const preparePayload = (query, v) => {
  return {
    query,
    variables: v,
  };
};

const SHOPIFY_GRAPHQL_URL = `https://${process.env.GATSBY_SHOPNAME_SHOPIFY}/api/2021-07/graphql.json`;

const CHECKOUT_CUSTOMER_ASSOCIATE = `mutation checkoutCustomerAssociateV2($checkoutId: ID!, $customerAccessToken: String!) {
	checkoutCustomerAssociateV2(
	  checkoutId: $checkoutId
	  customerAccessToken: $customerAccessToken
	) {
	  checkout {
	    id
	  }
	  checkoutUserErrors {
	    code
	    field
	    message
	  }
	  customer {
	    id
	  }
	}
      }`;

const shopifyConfig = {
  Accept: "application/json",
  "X-Shopify-Storefront-Access-Token": process.env.GATSBY_STOREFRONT_API,
};

exports.handler = async (event, context) => {
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
  const payload = preparePayload(CHECKOUT_CUSTOMER_ASSOCIATE, ...data);
  console.log(`payload`, payload);
  try {
    const checkout = await axios({
      url: SHOPIFY_GRAPHQL_URL,
      method: "POST",
      headers: shopifyConfig,
      data: payload,
    });
    console.log(`cart: `, checkout);
    console.log(`checkout.data`, checkout.data.errors);
    if (checkout.data.errors) {
      return {
        statusCode: 200,
        body: JSON.stringify({ error: carte.data.errors[0].message }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ checkout: checkout.data.data.cart }),
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
