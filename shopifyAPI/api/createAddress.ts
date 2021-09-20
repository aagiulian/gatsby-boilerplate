export interface MailingAddressInput {
  address1: string;
  address2: string;
  city: string;
  company: string;
  country: string;
  firstName: string;
  lastName: string;
  phone: string;
  province: string;
  zip: string;
  id?: string;
}

export interface MalingAddressResponse {
  customerAccessToken: string;
  address: any;
}

export const createAddress = async (
  token: string,
  input: MailingAddressInput
) => {
  console.log(`createAddress`);
  const createAddress = await fetch(`/.netlify/functions/create-address`, {
    method: "POST",
    body: JSON.stringify({ customerAccessToken: token, address: input }),
  });
  return await createAddress.json();
};
