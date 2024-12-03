export default async function getInput(day) {
  const sessionCookie = "53616c7465645f5f3eb1e52c01d1e9109f3a633bf50b8d7e2538a002adb285956b566ee378711ca32a9638c90d9ced8210b193395361869e351311f629bae8ba";
  const url = `https://adventofcode.com/2024/day/${day}/input`

  const request = {
    method: "GET",
    headers: {
      cookie: `session=${sessionCookie}`
    }
  };

  const response = await fetch(url, request);
  const data = await response.text();
  
  return data;
}
