export interface removeLinesCartInput {
  cartId: string;
  lineIds: string[];
}

export const removeLinesCart = async (input: removeLinesCartInput) => {
  const cart = await fetch(`/.netlify/functions/remove-lines-cart`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return await cart.json();
};
