export interface addDiscountCodesInput {
  cartId: string;
  discountCodes: string[];
}

export const addDiscountCodes = async (input: addDiscountCodesInput) => {
  const cart = await fetch(`/.netlify/functions/discount-code-cart`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return await cart.json();
};
