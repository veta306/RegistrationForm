export async function getDialCodes() {
  const response = await fetch(
    "https://countriesnow.space/api/v0.1/countries/codes"
  );
  const parsedResponse = await response.json();
  return parsedResponse.data.map((object) => object.dial_code);
}
