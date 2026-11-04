export type EventStatus = "upcoming" | "full" | "completed" | "cancelled";

export interface EventLocation {
  venue?: string;
  area?: string;
  city?: string;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
}

export interface EventOrganizer {
  name?: string;
  contact?: string;
  verified?: boolean;
}

export interface Event {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  location?: EventLocation;
  date?: string;
  startTime?: string;
  endTime?: string;
  organizer?: EventOrganizer;
  capacity?: number;
  registeredCount?: number;
  status?: EventStatus;
  tags?: string[];
  imageUrl?: string;
}

/** Document returned by `GET /joined/:userId` — an event plus who joined it. */
export interface JoinedEvent extends Event {
  userId?: string;
  userName?: string;
  userEmail?: string;
  userImage?: string;
  /** ISO timestamp recorded when the user pressed "Join Event". */
  joinedAt?: string;
}
