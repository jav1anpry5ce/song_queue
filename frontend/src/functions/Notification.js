import { notification } from "antd";
export default function openNotification(type, message, description) {
  notification[type]({
    message: message,
    description: description,
  });
}
