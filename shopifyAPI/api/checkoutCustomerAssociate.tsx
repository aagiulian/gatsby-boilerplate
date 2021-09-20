export interface CheckoutCustomerAssociateInput {
  checkoutId: string;
  token: string;
}

export const checkoutCustomerAssociate = async ({
  checkoutId,
  token,
}: CheckoutCustomerAssociateInput) => {
  const checkout = await fetch(
    `/.netlify/functions/checkout-customer-associate`,
    {
      method: "POST",
      body: JSON.stringify({ checkoutId, customerAccessToken: token }),
    }
  );
  return await checkout.json();
};
