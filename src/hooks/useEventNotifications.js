import { useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const useEventNotifications = (events, user, onNotify) => {
  useEffect(() => {
    if (!user || !events.length) return;

    const interval = setInterval(async () => {
      const now = new Date();

      for (const event of events) {
        if (event.notified) continue;

        const eventTime = event.eventDate.toDate();
        const reminderTime = new Date(
          eventTime.getTime() - event.reminderMinutes * 60000
        );

        if (now >= reminderTime && now < eventTime) {
          // 🔔 IN-APP TRIGGER
          onNotify(event);

          await updateDoc(doc(db, "events", event.id), {
            notified: true,
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [events, user]);
};
