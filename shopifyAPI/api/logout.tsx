import Cookies from "universal-cookie";

export const logout = () => {
  const cookie = new Cookies();
  const token = cookie.get("userToken");
  console.log(`token`, token);
  fetch(`/.netlify/functions/logout`, {
    method: "POST",
    body: JSON.stringify({
      accesToken: token,
    }),
  })
    .then((res: any) => res.json())
    .then((response: any) => {
      console.log(`response logout : `, response);
    });
};
