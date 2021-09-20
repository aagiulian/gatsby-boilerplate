export interface AttributeInput {
  key: string;
  value: string;
}

export interface LineUpdateInput {
  attributes?: AttributeInput[];
  id?: string;
  merchandiseId?: string;
  quantity?: number;
  sellingPlanId?: string;
}

export interface updateLinesCartInput {
  cartId: string;
  lines: LineUpdateInput[];
}

export const updateLinesCart = async (input: updateLinesCartInput) => {
  console.log(`input update: `, input);
  const cart = await fetch(`/.netlify/functions/update-lines-cart`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return await cart.json();
};
