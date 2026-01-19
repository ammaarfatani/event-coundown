import { useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function AddEventModal({ onClose }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [reminder, setReminder] = useState(10);

  const handleAddEvent = async (e) => {
    e.preventDefault();

    const [d, t] = date.split("T");
    const [year, month, day] = d.split("-").map(Number);
    const [hour, minute] = t.split(":").map(Number);

    const localDate = new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
      0
    );

    await addDoc(collection(db, "events"), {
      uid: user.uid,
      title,
      description,
      eventDate: Timestamp.fromDate(localDate), 
      reminderMinutes: reminder,
      createdAt: serverTimestamp(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-2xl w-[420px] p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-4">
          Add New Event 📅
        </h2>

        <form onSubmit={handleAddEvent} className="space-y-4">
          <input
            type="text"
            placeholder="Event Title"
            required
            className="w-full px-4 py-3 rounded-xl bg-black/40 text-white"
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="datetime-local"
            required
            className="w-full px-4 py-3 rounded-xl bg-black/40 text-white"
            onChange={(e) => setDate(e.target.value)}
          />

          <textarea
            placeholder="Description (optional)"
            className="w-full px-4 py-3 rounded-xl bg-black/40 text-white"
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="w-full px-4 py-3 rounded-xl bg-black/40 text-white"
            onChange={(e) => setReminder(Number(e.target.value))}
          >
            <option value={5}>5 minutes before</option>
            <option value={10}>10 minutes before</option>
            <option value={30}>30 minutes before</option>
            <option value={60}>1 hour before</option>
          </select>

          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-indigo-600 rounded-xl text-white">
              Save Event
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/10 rounded-xl text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
