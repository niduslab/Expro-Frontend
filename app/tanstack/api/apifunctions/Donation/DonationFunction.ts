import {
  CreateDonationInput,
  DonationDataType,
  UpdateDonationInput,
} from "@/app/tanstack/types/DonationType";
import { apiClient } from "../../BaseApi";

//get all
export const fetchDonations = async () => {
  const { data } = await apiClient.get("/donations");
  return data;
};

//get by ID
export const fetchDonationByID = async (id: number) => {
  const { data } = await apiClient.get(`/donation/${id}`);
  return data;
};

//store
export const addDonation = async (
  data: CreateDonationInput,
): Promise<DonationDataType> => {
  const { data: responseData } = await apiClient.post("/donation", data);
  return responseData;
};

// update
export const updateDonation = async (
  id: number,
  data: UpdateDonationInput,
): Promise<DonationDataType> => {
  const response = await apiClient.put(`/donation/${id}`, data);
  return response.data;
};

//delete
export const deleteDonation = async (id: number) => {
  const response = await apiClient.delete(`/donation/${id}`);
  return response.data;
};
