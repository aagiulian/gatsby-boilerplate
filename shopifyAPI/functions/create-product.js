const sanityClient = require("@sanity/client");
const crypto = require("crypto");

const sanity = sanityClient({
  projectId: process.env.GATSBY_SANITY_PROJECT_ID,
  dataset: process.env.GATSBY_SANITY_DATASET,
  apiVersion: "2021-03-25",
  token: process.env.GATSBY_API_KEY_SANITY, // we need this to get write access
  useCdn: false, // We can't use the CDN for writing
});

exports.handler = async (event, context) => {
  try {
    const secret = process.env.GATSBY_WEBHOOK_SECRET;
    if (event.headers) {
      const shopifyHmacHash = event.headers["x-shopify-hmac-sha256"];

      const contentHmac = await crypto
        .createHmac("Sha256", secret)
        .update(Buffer.from(event.body, "utf8"))
        .digest("base64");

      if (contentHmac !== shopifyHmacHash) {
        return {
          statusCode: 500,
          body: JSON.stringify("Bad request"),
        };
      } else {
        const jsonBody = JSON.parse(event.body);
        console.log(`jsonBody: `, jsonBody);
        const newProduct = {
          _id: `product-${jsonBody.id}`,
          _type: "product",
          status: jsonBody.status,
          shopifyName: jsonBody.title,
          options: jsonBody.options.map((option) => ({
            _key: `option-${option.id}`,
            _type: "option",
            shopifyName: option.name,
            title: {
              _type: "localeString",
              fr: option.name,
            },
            display: "list",
            values: option.values.map((value) => {
              return {
                _key: `optionValue-${option.id}-${value}`,
                _type: "optionValue",
                shopifyName: value,
                title: {
                  _type: "localeString",
                  fr: value,
                },
              };
            }),
          })),
          variants: jsonBody.variants.map((variant) => {
            return {
              _key: `variant-${variant.id}`,
              _type: "variant",
              title: variant.title,
              options: [
                variant.option1,
                variant.option2,
                variant.option3,
              ].filter((e) => e !== null),
              admin_graphql_api_id: variant.admin_graphql_api_id,
              barcode: variant.barcode,
              created_at: variant.created_at,
              fulfillment_service: variant.fulfillment_service,
              grams: variant.grams,
              id: variant.id,
              inventory_item_id: variant.inventory_item_id,
              inventory_quantity: variant.inventory_quantity,
              old_inventory_quantity: variant.old_inventory_quantity,
              position: variant.position,
              price: variant.price,
              product_id: variant.product_id,
              requires_shipping: variant.requires_shipping,
              sku: variant.sku,
              taxable: variant.taxable,
              weight: variant.weight,
              weight_unit: variant.weight_unit,
            };
          }),
        };
        const responseSanity = await sanity.createOrReplace(newProduct);
        if (responseSanity.title) {
          return {
            statusCode: 200,
            body: JSON.stringify({ data: responseSanity }),
          };
        } else {
          return {
            statusCode: 500,
            body: JSON.stringify("Bad request"),
          };
        }
      }
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify("Bad request"),
    };
  }
};
