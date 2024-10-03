import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Active, DataRef, Over } from "@dnd-kit/core";
import { ColumnDragData } from "@/components/kanban/board-column";
import { TaskDragData } from "@/components/kanban/task-card";

type DraggableData = ColumnDragData | TaskDragData;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined,
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === "Column" || data?.type === "Task") {
    return true;
  }

  return false;
}



export function getESTDateRange(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  const start = new Date(year, month, day, 9, 30); // 9:30 AM
  const end = new Date(year, month, day, 16, 0);   // 4:00 PM

  // Convert to UTC
  start.setUTCHours(start.getUTCHours() - 5); // EST is UTC-5
  end.setUTCHours(end.getUTCHours() - 5);

  return { start, end };
}
