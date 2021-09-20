export interface addLinesCartInput {
  cartId: string;
  lines: {
    merchandiseId: string;
    id?: string;
    quantity?: number;
    sellingPlanId?: string;
  }[];
}

export const addLinesCart = async (input: addLinesCartInput) => {
  const cart = await fetch(`/.netlify/functions/add-lines-cart`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return await cart.json();
};
