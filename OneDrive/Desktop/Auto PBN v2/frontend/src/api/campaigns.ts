import apiClient, { aiClient } from "./client";
import type {
  Campaign,
  CampaignCreate,
  CampaignUpdate,
  BacklinkTask,
  BacklinkTaskUpdate,
  BulkImportCampaignResult,
  BulkGenerateResult,
  BulkSetLanguageResult,
  GenerateContentResult,
  PublishResult,
  PublishAllResult,
  PublishedLinksResult,
} from "@/types/campaign";

export const campaignsApi = {
  list: () =>
    apiClient.get<Campaign[]>("/campaigns/").then((r) => r.data),

  get: (id: number) =>
    apiClient.get<Campaign>(`/campaigns/${id}`).then((r) => r.data),

  create: (data: CampaignCreate) =>
    apiClient.post<Campaign>("/campaigns/", data).then((r) => r.data),

  update: (id: number, data: CampaignUpdate) =>
    apiClient.patch<Campaign>(`/campaigns/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`/campaigns/${id}`),

  // Tasks
  getTasks: (campaignId: number) =>
    apiClient.get<BacklinkTask[]>(`/campaigns/${campaignId}/tasks`).then((r) => r.data),

  updateTask: (campaignId: number, taskId: number, data: BacklinkTaskUpdate) =>
    apiClient
      .patch<BacklinkTask>(`/campaigns/${campaignId}/tasks/${taskId}`, data)
      .then((r) => r.data),

  deleteTask: (campaignId: number, taskId: number) =>
    apiClient.delete(`/campaigns/${campaignId}/tasks/${taskId}`),

  // CSV bulk import
  bulkImport: (campaignId: number, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiClient
      .post<BulkImportCampaignResult>(`/campaigns/${campaignId}/tasks/bulk-import`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  // Text bulk import (domain|anchor|target_url per line)
  bulkImportText: (campaignId: number, text: string) =>
    apiClient
      .post<BulkImportCampaignResult>(`/campaigns/${campaignId}/tasks/bulk-import-text`, { text })
      .then((r) => r.data),

  // AI content generation
  generateContent: (campaignId: number, taskId: number) =>
    aiClient
      .post<GenerateContentResult>(`/campaigns/${campaignId}/tasks/${taskId}/generate-content`)
      .then((r) => r.data),

  bulkGenerate: (campaignId: number) =>
    aiClient
      .post<BulkGenerateResult>(`/campaigns/${campaignId}/tasks/bulk-generate`)
      .then((r) => r.data),

  bulkSetLanguage: (campaignId: number, language: string) =>
    apiClient
      .post<BulkSetLanguageResult>(`/campaigns/${campaignId}/tasks/bulk-set-language`, { language })
      .then((r) => r.data),

  // Publish via Celery
  publishTask: (campaignId: number, taskId: number) =>
    apiClient
      .post<PublishResult>(`/campaigns/${campaignId}/tasks/${taskId}/publish`)
      .then((r) => r.data),

  publishAll: (campaignId: number) =>
    apiClient
      .post<PublishAllResult>(`/campaigns/${campaignId}/publish-all`)
      .then((r) => r.data),

  getPublishedLinks: (campaignId: number) =>
    apiClient
      .get<PublishedLinksResult>(`/campaigns/${campaignId}/published-links`)
      .then((r) => r.data),

  uploadIntroImage: (campaignId: number, file: File, alt: string) => {
    const form = new FormData();
    form.append("file", file);
    return apiClient
      .post<{ intro_image_url: string; intro_image_alt: string | null }>(
        `/campaigns/${campaignId}/upload-intro-image?alt=${encodeURIComponent(alt)}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((r) => r.data);
  },

  checkAnchor: (campaignId: number, taskId: number) =>
    apiClient
      .post<{ task_id: number; anchor_check_status: string; anchor_check_message: string }>(
        `/campaigns/${campaignId}/tasks/${taskId}/check-anchor`
      )
      .then((r) => r.data),
};
