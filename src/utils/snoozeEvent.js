import { db } from "../firebase";
import { doc, updateDoc, Timestamp } from "firebase/firestore";

export const snoozeEvent = async (event) => {
  const now = new Date();

  // Snooze after 10 minutes
  const snoozedTime = new Date(now.getTime() + 10 * 60000);

  await updateDoc(doc(db, "events", event.id), {
    eventDate: Timestamp.fromDate(snoozedTime),
    reminderMinutes: 0, // ab direct event time pe notify
    notified: false,
  });
};
