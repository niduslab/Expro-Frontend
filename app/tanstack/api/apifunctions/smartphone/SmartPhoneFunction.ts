import {
  CreateSmartphoneInput,
  SmartPhoneDataType,
} from "@/app/tanstack/types/SmartPhoneType";
import { apiClient } from "../../BaseApi";

//get all
export const fetchSmartphones = async () => {
  const { data } = await apiClient.get("/smartphones");
  return data;
};

//get by ID
export const fetchSmartphoneById = async (id: number) => {
  const { data } = await apiClient.get(`/smartphones/${id}`);
  return data;
};

//store
export const addSmartphone = async (
  data: CreateSmartphoneInput,
): Promise<SmartPhoneDataType> => {
  const { data: responseData } = await apiClient.post("/smartphones", data);
  return responseData;
};

//update
export const updateSmartphone = async (
  id: number,
  data: { name?: string; brand?: string },
) => {
  const response = await apiClient.put(`/smartphones/${id}`, data);
  return response.data;
};

//delete
export const deleteSmartphone = async (id: number) => {
  const response = await apiClient.delete(`/smartphones/${id}`);
  return response.data;
};
