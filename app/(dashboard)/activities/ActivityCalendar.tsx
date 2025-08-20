import React, { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, EventApi } from "@fullcalendar/core";
import { ACTIVITY_TYPE_COLORS, ACTIVITY_TYPE_BORDERS } from "@/lib/colors";
import type { ClientActivity } from "@/types/firebase";
import type { ActivityCalendarEvent } from "@/types";

// Komponen kalender aktivitas sales
export default function ActivityCalendar({
  activities = [],
  onAdd,
  onEventClick,
  filterType = "all",
  filterStatus = "all",
}: {
  activities: ClientActivity[];
  onAdd: (date: string) => void;
  onEventClick: (activity: ClientActivity) => void;
  filterType?: string;
  filterStatus?: string;
}) {
  // Convert activities to calendar events
  const events: ActivityCalendarEvent[] = activities
    .filter((a) => {
      // Add filtering logic here if needed
      return (
        (!filterType || filterType === "all" || a.type === filterType) &&
        (!filterStatus || filterStatus === "all")
      );
    })
    .map((a) => ({
      id: a.id,
      title: a.description + (a.leadId ? ` (Lead: ${a.leadId})` : ""),
      start:
        a.createdAt instanceof Date
          ? a.createdAt.toISOString()
          : new Date(a.createdAt).toISOString(),
      backgroundColor: ACTIVITY_TYPE_COLORS[a.type] || "hsl(var(--muted))",
      borderColor: ACTIVITY_TYPE_BORDERS[a.type] || "hsl(var(--border))",
      textColor: "hsl(var(--foreground))",
      extendedProps: {
        activity: {
          ...a,
          title: a.description || "",
          date:
            a.createdAt instanceof Date
              ? a.createdAt.toISOString()
              : new Date(a.createdAt).toISOString(),
          type: a.type as
            | "MEETING"
            | "CALL"
            | "DEMO"
            | "EMAIL"
            | "TASK"
            | "NOTE",
          leadId: a.leadId || "",
        },
      },
    }));

  // Ref untuk akses FullCalendar
  const calendarRef = useRef<FullCalendar>(null);

  return (
    <div className="rounded border bg-white dark:bg-muted p-2">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        buttonText={{
          today: "Hari Ini",
          month: "Monthly",
          week: "Weekly",
          day: "Daily",
        }}
        events={events}
        eventClick={(info: EventClickArg) => {
          info.jsEvent.preventDefault();
          if (onEventClick)
            onEventClick(
              (info.event.extendedProps as { activity: ClientActivity })
                .activity
            );
        }}
        dateClick={(info: { dateStr: string }) => {
          if (onAdd) onAdd(info.dateStr);
        }}
        eventMouseEnter={(info: {
          event: EventApi;
          jsEvent: MouseEvent;
          el: HTMLElement;
        }) => {
          // Tooltip minimalis
          const tooltip = document.createElement("div");
          tooltip.innerHTML = `<div style='background:hsl(var(--popover));color:hsl(var(--popover-foreground));padding:4px 10px;border-radius:6px;font-size:12px;font-weight:500;box-shadow:0 2px 8px rgba(0,0,0,0.15);border:1px solid hsl(var(--border));'>${
            info.event.title
          }<br/>${new Date(info.event.start!).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}</div>`;
          tooltip.style.position = "absolute";
          tooltip.style.zIndex = "1000";
          tooltip.style.top = info.jsEvent.pageY + 8 + "px";
          tooltip.style.left = info.jsEvent.pageX + 8 + "px";
          tooltip.className = "fc-tooltip";
          document.body.appendChild(tooltip);
          info.el.setAttribute("data-tooltip-id", "fc-tooltip");
        }}
        eventMouseLeave={() => {
          const tooltip = document.querySelector(".fc-tooltip");
          if (tooltip) tooltip.remove();
        }}
        height="auto"
        aspectRatio={1.5}
        dayMaxEventRows={3}
        locale="id"
        contentHeight="auto"
        // Custom class untuk styling minimalis
        dayHeaderClassNames={() =>
          "!bg-transparent !border-0 !text-xs !font-semibold"
        }
        dayCellClassNames={({ isToday }) =>
          `!border-0 !p-0 ${isToday ? "!bg-blue-50 dark:!bg-blue-900/20" : ""}`
        }
        eventClassNames={() =>
          "rounded-md px-2 py-1 text-xs font-semibold border-2 shadow-none !m-0 !mb-1"
        }
        slotLabelClassNames={() => "!text-xs !font-medium"}
        titleFormat={{ year: "numeric", month: "short" }}
        // Responsive tweaks
        windowResize={() => {
          // Bisa tambahkan logic jika ingin ubah tampilan pada mobile
        }}
      />
      <style>{`
        .fc .fc-toolbar {
          margin-bottom: 0.5rem;
        }
        .fc .fc-button {
          border-radius: 6px;
          font-size: 13px;
          padding: 2px 10px;
          box-shadow: none;
          background: hsl(var(--muted));
          color: hsl(var(--foreground));
          border: none;
        }
        .fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
        .fc .fc-button-primary:focus {
          box-shadow: 0 0 0 2px hsl(var(--ring));
        }
        .fc .fc-daygrid-day-number {
          font-size: 12px;
          font-weight: 500;
        }
        .fc .fc-daygrid-day {
          min-height: 60px;
        }
        .fc .fc-event {
          margin: 0 0 2px 0;
        }
        @media (max-width: 600px) {
          .fc .fc-toolbar-title { font-size: 1rem; }
          .fc .fc-daygrid-day { min-height: 40px; }
          .fc .fc-event { font-size: 11px; padding: 1px 6px; }
        }
      `}</style>
    </div>
  );
}
