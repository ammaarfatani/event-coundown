// useNotificationPermission.js
import { useEffect } from "react";

export const useNotificationPermission = (user) => {
  useEffect(() => {
    if (!user) return;
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [user]);
};
