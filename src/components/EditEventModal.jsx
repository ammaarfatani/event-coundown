import { useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc, Timestamp } from "firebase/firestore";

function toLocalInputValue(date) {
  const pad = (n) => String(n).padStart(2, "0");

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}

export default function EditEventModal({ event, onClose }) {
  const eventDate = event.eventDate.toDate();

  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description || "");
  const [date, setDate] = useState(toLocalInputValue(eventDate));
  const [reminder, setReminder] = useState(event.reminderMinutes);

  const handleUpdate = async (e) => {
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

    await updateDoc(doc(db, "events", event.id), {
      title,
      description,
      eventDate: Timestamp.fromDate(localDate),
      reminderMinutes: reminder,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-6 rounded-2xl w-[420px] shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-4">
          Edit Event ✏️
        </h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            className="w-full px-4 py-3 rounded-xl bg-black/40 text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="datetime-local"
            className="w-full px-4 py-3 rounded-xl bg-black/40 text-white"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <textarea
            className="w-full px-4 py-3 rounded-xl bg-black/40 text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="w-full px-4 py-3 rounded-xl bg-black/40 text-white"
            value={reminder}
            onChange={(e) => setReminder(Number(e.target.value))}
          >
            <option value={5}>5 minutes before</option>
            <option value={10}>10 minutes before</option>
            <option value={30}>30 minutes before</option>
            <option value={60}>1 hour before</option>
          </select>

          <div className="flex gap-3">
            <button className="flex-1 bg-indigo-600 py-3 rounded-xl">
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 py-3 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
