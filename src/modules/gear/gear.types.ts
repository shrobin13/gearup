export interface CreateGearPayload {
  categoryId: string;
  name: string;
  description: string;
  brand: string;
  dailyRate: number;
  stock: number;
  imageUrl?: string;
}

export interface UpdateGearPayload {
  categoryId?: string;
  name?: string;
  description?: string;
  brand?: string;
  dailyRate?: number;
  stock?: number;
  imageUrl?: string;
}
