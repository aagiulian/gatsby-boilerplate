interface Input {
  id: string;
  token: string;
}

export const deleteAddress = async ({ id, token }: Input) => {
  const deleteAddress = await fetch(`/.netlify/functions/delete-address`, {
    method: "POST",
    body: JSON.stringify({ id: id, customerAccessToken: token }),
  });
  return await deleteAddress.json();
};
