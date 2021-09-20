import { MailingAddressInput } from "./createAddress";

export const setDefaultAddress = async (token: string, id: string) => {
  console.log(`update`);
  const deleteAddress = await fetch(
    `/.netlify/functions/update-default-address`,
    {
      method: "POST",
      body: JSON.stringify({ id, customerAccessToken: token }),
    }
  );
  return await deleteAddress.json();
};
