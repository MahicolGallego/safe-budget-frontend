import { notification } from "antd";

// types for on-screen notifications location
type NotificationType = "error" | "success" | "info" | "warning";

export const useNotification = () => {
  const [NotificationApi, NotificationContextHolder] =
    notification.useNotification();

  const openNotification = (
    type: NotificationType,
    message: string,
    description: string
  ) => {
    NotificationApi[type]({
      message,
      description,
      placement: "bottomRight",
      duration: 5,
    });
  };
  return {
    // context
    NotificationContextHolder,
    // functions

    // methods
    openNotification,
  };
};
