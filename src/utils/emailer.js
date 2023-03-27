import axios from "axios";

export default function emailer(
  recipient,
  msgBody,
  subject,
  attachment,
  token
) {
  return axios.post(
    process.env.REACT_APP_ENDPOINT_URL + "/api/email" + "/sendSimpleEmail",
    {
      recipient: recipient,
      msgBody: msgBody,
      subject: subject,
      attachment: attachment,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
