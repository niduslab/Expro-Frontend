import { apiClient } from "@/lib/api/axios";
import {
  ExproTeamMemberListResponse,
  SingleExproTeamMemberResponse,
  ExproTeamMemberPayload,
  DeleteExproTeamMemberResponse,
} from "@/lib/types/admin/exproTeamMemberType";

export const fetchExproTeamMembers = async (
  params?: Record<string, unknown>,
): Promise<ExproTeamMemberListResponse> => {
  const { data } = await apiClient.get("/exproteammembers", { params });
  return data;
};

export const fetchExproTeamMemberById = async (
  id: number | string,
): Promise<SingleExproTeamMemberResponse> => {
  const { data } = await apiClient.get(`/exproteammember/${id}`);
  return data;
};

export const createExproTeamMember = async (
  payload: ExproTeamMemberPayload,
): Promise<SingleExproTeamMemberResponse> => {
  const { data } = await apiClient.post("/exproteammember", payload);
  return data;
};

export const updateExproTeamMember = async (
  id: number | string,
  payload: ExproTeamMemberPayload,
): Promise<SingleExproTeamMemberResponse> => {
  const { data } = await apiClient.put(`/exproteammember/${id}`, payload);
  return data;
};

export const deleteExproTeamMember = async (
  id: number | string,
): Promise<DeleteExproTeamMemberResponse> => {
  const { data } = await apiClient.delete(`/exproteammember/${id}`);
  return data;
};
