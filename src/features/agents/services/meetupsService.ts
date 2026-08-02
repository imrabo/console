import { apiClient } from '@/lib/api/client';

import {
  Meetup,
  MeetupCategory,
  MeetupRegistration,
  MeetupWaitlist,
} from '@/features/meetups/types/index';

export const meetupsService = {
  async fetchMeetups() {
    return apiClient.get<Meetup[]>('/meetups');
  },

  async fetchMeetupById(id: string) {
    return apiClient.get<Meetup>(`/meetups/${id}`);
  },

  async fetchCategories() {
    return apiClient.get<MeetupCategory[]>('/meetups/categories');
  },

  async fetchRegistrations(meetupId: string) {
    return apiClient.get<MeetupRegistration[]>(
      `/meetups/${meetupId}/registrations`
    );
  },

  async fetchWaitlist(meetupId: string) {
    return apiClient.get<MeetupWaitlist[]>(
      `/meetups/${meetupId}/waitlist`
    );
  },

  async createMeetup(
    data: Omit<
      Meetup,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'registrationsCount'
      | 'waitlistCount'
      | 'status'
    >
  ) {
    return apiClient.post<Meetup>('/meetups', {
      ...data,
      registrationsCount: 0,
      waitlistCount: 0,
      status: 'Active',
    });
  },

  async updateMeetup(id: string, data: Partial<Meetup>) {
    return apiClient.patch<Meetup>(`/meetups/${id}`, data);
  },

  async deleteMeetup(id: string) {
    return apiClient.delete<void>(`/meetups/${id}`);
  },
};

export default meetupsService;