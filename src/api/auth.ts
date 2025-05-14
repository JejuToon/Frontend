import axios from "axios";

type RequestUser = {
  email: string;
  password: string;
};

async function postSignup(body: RequestUser): Promise<void> {
  const { data } = await axios.post("", body);

  return data;
}

async function postLogin(body: RequestUser): Promise<{ accessToken: string }> {
  const { data } = await axios.post("", body);

  return data;
}

async function getMe() {
  const accessToken = "";
  const { data } = await axios.get("", {
    headers: {
      Authorization: ``,
    },
  });
  await axios.get("");

  return data;
}
