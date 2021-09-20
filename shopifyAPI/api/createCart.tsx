export interface createCartInput {}

export const createCart = async (input: any) => {
  const initCart = await fetch(`/.netlify/functions/create-cart`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return await initCart.json();
};
