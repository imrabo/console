import { apiClient } from '@/lib/api/client';

import {
  Webinar,
  WebinarRegistration,
  CreateWebinarDTO,
  UpdateWebinarDTO,
  CreateWebinarRegistrationDTO,
  UpdateWebinarRegistrationDTO,
  WebinarCategory,
  WebinarStatus,
  PaymentStatus,
  RegistrationStatus,
} from '../types';

import {
  WebinarQueryParams,
  RegistrationQueryParams,
} from '../schemas';

import { PaginatedResponse } from '@/types/PaginatedResponse';

export const webinarsService = {
  // ============================
  // Webinars
  // ============================

  async fetchWebinars(params?: WebinarQueryParams) {
    return apiClient.getWithQuery<PaginatedResponse<Webinar>>(
      '/webinars',
      params
    );
  },

  async fetchWebinarById(id: string) {
    return apiClient.get<Webinar>(`/webinars/${id}`);
  },

  async createWebinar(data: CreateWebinarDTO) {
    return apiClient.post<Webinar>('/webinars', {
      ...data,
      registeredCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },

  async updateWebinar(
    id: string,
    data: UpdateWebinarDTO
  ) {
    return apiClient.patch<Webinar>(
      `/webinars/${id}`,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      }
    );
  },

  async deleteWebinar(id: string) {
    return apiClient.delete<void>(`/webinars/${id}`);
  },

  async updateWebinarStatus(
    id: string,
    status: WebinarStatus
  ) {
    return apiClient.patch<Webinar>(
      `/webinars/${id}/status`,
      { status }
    );
  },

  async toggleWebinarFeatured(
    id: string,
    isFeatured: boolean
  ) {
    return apiClient.patch<Webinar>(
      `/webinars/${id}/featured`,
      { isFeatured }
    );
  },

  async toggleWebinarActive(
    id: string,
    isActive: boolean
  ) {
    return apiClient.patch<Webinar>(
      `/webinars/${id}/active`,
      { isActive }
    );
  },

  // ============================
  // Registrations
  // ============================

  async fetchRegistrations(
    params?: RegistrationQueryParams
  ) {
    return apiClient.getWithQuery<WebinarRegistration[]>(
      '/webinars/registrations',
      params
    );
  },

  async fetchRegistrationsByWebinar(
    webinarId: string
  ) {
    return apiClient.get<WebinarRegistration[]>(
      `/webinars/${webinarId}/registrations`
    );
  },

  async fetchRegistrationsByUser(
    userId: string
  ) {
    return apiClient.get<WebinarRegistration[]>(
      `/webinars/users/${userId}/registrations`
    );
  },

  async getRegistrationCount(
    webinarId: string
  ) {
    return apiClient.get<number>(
      `/webinars/${webinarId}/registrations/count`
    );
  },

  async createRegistration(
    data: CreateWebinarRegistrationDTO
  ) {
    return apiClient.post<WebinarRegistration>(
      '/webinars/registrations',
      {
        ...data,
        registeredAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        attendanceDuration: 0,
        certificateIssued: false,
        feedbackSubmitted: false,
        reminderSent: false,
      }
    );
  },

  async updateRegistration(
    id: string,
    data: UpdateWebinarRegistrationDTO
  ) {
    return apiClient.patch<WebinarRegistration>(
      `/webinars/registrations/${id}`,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      }
    );
  },

  async deleteRegistration(id: string) {
    return apiClient.delete<void>(
      `/webinars/registrations/${id}`
    );
  },

  async updateRegistrationStatus(
    id: string,
    status: RegistrationStatus
  ) {
    return apiClient.patch<WebinarRegistration>(
      `/webinars/registrations/${id}/status`,
      { registrationStatus: status }
    );
  },

  async updatePaymentStatus(
    id: string,
    status: PaymentStatus,
    paymentId?: string
  ) {
    return apiClient.patch<WebinarRegistration>(
      `/webinars/registrations/${id}/payment`,
      {
        paymentStatus: status,
        paymentId,
      }
    );
  },

  async markAttendance(
    registrationId: string,
    joinedAt: Date | string,
    leftAt?: Date | string
  ) {
    return apiClient.patch<WebinarRegistration>(
      `/webinars/registrations/${registrationId}/attendance`,
      {
        joinedAt,
        leftAt,
      }
    );
  },

  async issueCertificate(registrationId: string) {
    return apiClient.patch<WebinarRegistration>(
      `/webinars/registrations/${registrationId}/certificate`,
      {
        certificateIssued: true,
      }
    );
  },

  async revokeCertificate(registrationId: string) {
    return apiClient.patch<WebinarRegistration>(
      `/webinars/registrations/${registrationId}/certificate`,
      {
        certificateIssued: false,
      }
    );
  },

  async markFeedbackSubmitted(
    registrationId: string
  ) {
    return apiClient.patch<WebinarRegistration>(
      `/webinars/registrations/${registrationId}/feedback`,
      {
        feedbackSubmitted: true,
      }
    );
  },

  async markReminderSent(
    registrationId: string
  ) {
    return apiClient.patch<WebinarRegistration>(
      `/webinars/registrations/${registrationId}/reminder`,
      {
        reminderSent: true,
      }
    );
  },

  // ============================
  // Analytics
  // ============================

  async getActiveWebinarsCount() {
    return apiClient.get<number>(
      '/webinars/analytics/active-count'
    );
  },

  async getFeaturedWebinars() {
    return apiClient.get<Webinar[]>(
      '/webinars/featured'
    );
  },

  async getUpcomingWebinars() {
    return apiClient.get<Webinar[]>(
      '/webinars/upcoming'
    );
  },

  async getWebinarsByCategory(
    category: WebinarCategory
  ) {
    return apiClient.get<Webinar[]>(
      `/webinars/category/${category}`
    );
  },

  async validateWebinarForRegistration(
    webinarId: string
  ) {
    return apiClient.get<{
      valid: boolean;
      message?: string;
      webinar?: Webinar;
    }>(
      `/webinars/${webinarId}/validate-registration`
    );
  },
};

export default webinarsService;