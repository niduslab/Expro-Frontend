import {
  CreateDonationInput,
  DonationDataType,
  DonationListResponse,
  UpdateDonationInput,
} from "@/app/tanstack/types/DonationType";
import { apiClient } from "../BaseApi";

//get all
export const fetchDonations = async (
  page: number = 1,
): Promise<DonationListResponse> => {
  const { data } = await apiClient.get(`/donations?page=${page}`);
  return {
    data: data.data,
    pagination: data.pagination,
  };
};

// get by ID
export const fetchDonationByID = async (
  id: number,
): Promise<DonationDataType> => {
  const { data } = await apiClient.get(`/donation/${id}`);
  return data.data;
};

// store
export const addDonation = async (
  payload: CreateDonationInput,
): Promise<DonationDataType> => {
  const { data } = await apiClient.post("/donation", payload);
  return data.data;
};

// update
export const updateDonation = async (
  id: number,
  payload: UpdateDonationInput,
): Promise<DonationDataType> => {
  const { data } = await apiClient.put(`/donation/${id}`, payload);
  return data.data;
};

// delete
export const deleteDonation = async (id: number) => {
  const { data } = await apiClient.delete(`/donation/${id}`);
  return data;
};
