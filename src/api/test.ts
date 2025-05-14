import axios from "axios";

async function test(): Promise<void> {
  const { data } = await axios.post("http://localhost:3001/api/message");
  console.log(data);

  return data;
}

export default test;
