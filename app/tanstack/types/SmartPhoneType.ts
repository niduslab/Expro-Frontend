export interface SmartPhoneDataType {
  id?: number;
  user_id?: number | null;
  name: string;
  brand: string;
  ram: number;
  price: number;
}
export type CreateSmartphoneInput = Omit<SmartPhoneDataType, "id">;

export type UpdateSmartphoneInput = Partial<Omit<SmartPhoneDataType, "id">>;
