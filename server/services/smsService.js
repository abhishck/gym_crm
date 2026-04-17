import axios from "axios";

export const sendSMS = async (number, message) => {
  try {
    const response = await axios.post(
      "http://192.168.1.34:8080/send-sms",
      {
        number,
        message,
      }
    );

    return response.data;
  } catch (error) {
    console.error("SMS Error:", error.message);
    throw new Error("Failed to send SMS");
  }
};