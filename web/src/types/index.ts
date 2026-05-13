export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface Connection {
  id?: string;
  name: string;
  ownerId: string;
}

export interface Contact {
  id?: string;
  name: string;
  phone: string;
  connectionId: string;
  ownerId: string;
}

export interface Message {
  id?: string;
  content: string;
  contactIds: string[];
  connectionId: string;
  ownerId: string;
  status: "scheduled" | "sent";
  scheduledDate: Date;
}
