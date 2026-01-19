import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";

export const deleteEvent = async (id) => {
  if (!window.confirm("Delete this event?")) return;
  await deleteDoc(doc(db, "events", id));
};
