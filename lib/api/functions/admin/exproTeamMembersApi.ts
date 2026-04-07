import { apiClient } from "@/lib/api/axios";
import {
  ExproTeamMemberListResponse,
  SingleExproTeamMemberResponse,
  DeleteExproTeamMemberResponse,
} from "@/lib/types/admin/exproTeamMemberType";

const multipartHeaders = { headers: { "Content-Type": "multipart/form-data" } };

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
  payload: FormData,
): Promise<SingleExproTeamMemberResponse> => {
  //  Explicitly set multipart header to override global application/json
  const { data } = await apiClient.post(
    "/exproteammember",
    payload,
    multipartHeaders,
  );
  return data;
};

export const updateExproTeamMember = async (
  id: number | string,
  payload: FormData,
): Promise<SingleExproTeamMemberResponse> => {
  //  Explicitly set multipart header to override global application/json
  const { data } = await apiClient.post(
    `/exproteammember/${id}?_method=PUT`,
    payload,
    multipartHeaders,
  );
  return data;
};

export const deleteExproTeamMember = async (
  id: number | string,
): Promise<DeleteExproTeamMemberResponse> => {
  const { data } = await apiClient.delete(`/exproteammember/${id}`);
  return data;
};
