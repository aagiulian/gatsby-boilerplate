import { MailingAddressInput } from "./createAddress";

export const updateAddress = async (
  address: MailingAddressInput,
  id: string,
  token: string
) => {
  console.log(`update`);
  const deleteAddress = await fetch(`/.netlify/functions/update-address`, {
    method: "POST",
    body: JSON.stringify({ address, id, customerAccessToken: token }),
  });
  return await deleteAddress.json();
};
