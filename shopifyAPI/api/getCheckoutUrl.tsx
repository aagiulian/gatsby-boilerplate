export interface getCheckoutUrlInput {
  id: string;
}

export const getCheckoutUrl = async (input: getCheckoutUrlInput) => {
  const checkout = await fetch(`/.netlify/functions/get-checkout-url`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return await checkout.json();
};
