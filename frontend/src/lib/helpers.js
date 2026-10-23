export const money = (n) =>
  n == null ? "Price to be agreed" : `PKR ${Number(n).toLocaleString("en-PK")}`;
export const message = (e) =>
  typeof e.response?.data?.error === "string"
    ? e.response.data.error
    : Array.isArray(e.response?.data?.error)
      ? e.response.data.error.map((x) => x.message).join("; ")
      : "Request failed. Please try again.";
