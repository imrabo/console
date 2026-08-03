export interface Agent {
  id: string;
  title: string;
  description: string;
  organizerName: string;
  organizerId: string;
  category: string;
  date: string;
  time: string;
  locationName: string;
  latitude: number;
  longitude: number;
  maxRegistrations: number;
  registrationsCount: number;
  waitlistCount: number;
  status: 'Active' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentRegistration {
  id: string;
  agentId: string;
  userId: string;
  userName: string;
  status: 'Confirmed' | 'Cancelled';
  createdAt: Date;
}

export interface AgentWaitlist {
  id: string;
  agentId: string;
  userId: string;
  userName: string;
  queuePosition: number;
  createdAt: Date;
}

export interface AgentCategory {
  id: string;
  name: string;
  color: string;
}
