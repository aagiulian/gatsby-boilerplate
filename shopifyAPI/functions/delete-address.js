const axios = require("axios");
const preparePayload = (query, v) => {
  return {
    query,
    variables: v,
  };
};

const SHOPIFY_GRAPHQL_URL = `https://${process.env.GATSBY_SHOPNAME_SHOPIFY}/api/2021-07/graphql.json`;

const CUSTOMER_ADDRESS_DELETE = `mutation customerAddressDelete($id: ID!, $customerAccessToken: String!) {
	customerAddressDelete(id: $id, customerAccessToken: $customerAccessToken) {
	  customerUserErrors {
	    code
	    field
	    message
	  }
	  deletedCustomerAddressId
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
  const payload = preparePayload(CUSTOMER_ADDRESS_DELETE, { ...data });
  try {
    const response = await axios({
      url: SHOPIFY_GRAPHQL_URL,
      method: "POST",
      headers: shopifyConfig,
      data: payload,
    });
    console.log(`response.data`, response.data);
    if (response.data?.errors) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          error: response.data.errors[0].message,
        }),
      };
    } else if (
      response.data?.data?.customerAddressDelete?.customerUserErrors?.length > 0
    ) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          error:
            response.data.data.customerAddressDelete.customerUserErrors[0]
              .message,
        }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "success",
        }),
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
