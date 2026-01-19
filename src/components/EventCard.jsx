import { useState } from "react";
import CountdownTimer from "./CountdownTimer";
import ProgressRing from "./ProgressRing";
import { useCountdown } from "../hooks/useCountdown";
import EditEventModal from "./EditEventModal";
import { deleteEvent } from "../utils/deleteEvent";
import { snoozeEvent } from "../utils/snoozeEvent";

export default function EventCard({ event }) {
  const eventTime = event.eventDate.toDate();
  const timer = useCountdown(eventTime);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div className="relative p-5 rounded-2xl bg-white/5 backdrop-blur-xl
        border border-white/10 hover:border-indigo-400
        transition-all hover:scale-[1.03] cursor-pointer">

        {!timer.expired && (
          <div className="absolute top-4 right-4">
            <ProgressRing progress={timer.progress} />
          </div>
        )}

        <h3 className="text-lg font-bold text-white">
          {event.title}
        </h3>

        <p className="text-sm text-gray-400 mt-1">
          {event.description || "No description"}
        </p>

        <div className="mt-6 flex justify-between items-center">
          <CountdownTimer date={eventTime} />
          <span className="text-xs text-gray-400">
            {eventTime.toLocaleString()}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2 opacity-0 hover:opacity-100 transition">
          <button
            onClick={() => setEditOpen(true)}
            className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30"
          >
            Edit
          </button>

            <button
  onClick={() => snoozeEvent(event)}
  className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30"
>
  Snooze 10m
</button>


          <button
            onClick={() => deleteEvent(event.id)}
            className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
          >
            Delete
          </button>
        </div>
      </div>

      {editOpen && (
        <EditEventModal
          event={event}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
}
