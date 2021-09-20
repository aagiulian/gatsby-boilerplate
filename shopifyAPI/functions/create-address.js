const axios = require("axios");
const preparePayload = (query, v) => {
  return {
    query,
    variables: v,
  };
};

const SHOPIFY_GRAPHQL_URL = `https://${process.env.GATSBY_SHOPNAME_SHOPIFY}/api/2021-07/graphql.json`;

const CUSTOMER_ADDRESS_CREATE = `mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
	customerAddressCreate(
	  customerAccessToken: $customerAccessToken
	  address: $address
	) {
	  customerAddress {
	    id
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
  const payload = preparePayload(CUSTOMER_ADDRESS_CREATE, { ...data });
  try {
    const response = await axios({
      url: SHOPIFY_GRAPHQL_URL,
      method: "POST",
      headers: shopifyConfig,
      data: payload,
    });
    console.log(`response`, response);
    console.log(`response.data `, response.data);
    console.log(`response.data `, response.data.data.customerAddressCreate);
    console.log(`response.errors `, response.data.errors);
    console.log(`response.customerAddress `, response.customerAddress);
    console.log(
      `response.data.customeraddresscreate`,
      response.data.customerAddressCreate
    );
    console.log(
      `response.data.customeraddresscreate`,
      response.data.customerUserErrors
    );
    console.log(`response.data.errors`, response.data.errors);
    //     if (response.data.errors) {
    //       return {
    //         statusCode: 200,
    //         body: JSON.stringify({ error: response.data.errors[0].message }),
    //       };
    //     } else
    if (
      response.data?.data?.customerAddressCreate?.customerUserErrors?.length > 0
    ) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          error:
            response.data.data.customerAddressCreate.customerUserErrors[0]
              .message,
        }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({
          adddressId:
            response.data.data.customerAddressCreate.customerAddress.id,
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
