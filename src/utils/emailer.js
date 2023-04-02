import axios from "axios";

export default async function emailer(
  recipient,
  msgBody,
  subject,
  attachment,
  token
) {
  await axios
    .post(
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
    )
    .then((response) => {
      if (response.status !== 200) {
        throw new Error("Email failed to send.");
      }

      return response;
    })
    .catch((error) => {
      throw error;
    });
}
