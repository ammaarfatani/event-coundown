import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import AddEventModal from "../components/AddEventModal";
import EventCard from "../components/EventCard";
import { useNotificationPermission } from "../hooks/useNotificationPermission";
import { useEventNotifications } from "../hooks/useEventNotifications";

export default function Dashboard() {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔔 REMINDER STATE (MISSING THA)
  const [activeReminder, setActiveReminder] = useState(null);

  // 🔐 permission
  useNotificationPermission(user);

  // 🔔 reminder hook
  useEventNotifications(events, user, (event) => {
    console.log("🔥 REMINDER FIRED:", event.title);

    setActiveReminder(event);

    // 🔊 sound
    new Audio("/alarm.mp3").play();

    // ⏳ auto hide after 10 sec
    setTimeout(() => setActiveReminder(null), 10000);
  });

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "events"),
      where("uid", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setEvents(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">Your Events 🎯</h1>

        <div className="flex gap-3">
          <button
            onClick={() => setOpenModal(true)}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition"
          >
            + Add Event
          </button>

          <button
            onClick={() => signOut(auth)}
            className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-400 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {events.length === 0 ? (
        <p className="text-center text-gray-400 mt-20">
          No events yet ✨
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {openModal && (
        <AddEventModal onClose={() => setOpenModal(false)} />
      )}

      {/* 🔔 REMINDER TOAST UI */}
      {activeReminder && (
        <div className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-xl shadow-2xl z-50 animate-bounce">
          ⏰ <b>{activeReminder.title}</b> starting soon!
        </div>
      )}
    </div>
  );
}
