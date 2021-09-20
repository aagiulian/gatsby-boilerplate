import Cookies from "universal-cookie";

export const customer = () => {
  const cookie = new Cookies();
  const token = cookie.get("userToken");
  console.log(`token`, token);
  return new Promise((resolve, reject) => {
    fetch(`/.netlify/functions/customer`, {
      method: "POST",
      body: JSON.stringify({
        customerAccessToken: token,
      }),
    })
      .then((res: any) => res.json())
      .then((response: any) => {
        console.log(`response.customer`, response.customer);
        resolve(response.customer);
      })
      .catch((err: any) => reject(err));
  });
};
