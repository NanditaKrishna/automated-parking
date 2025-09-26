export interface Car {
  registrationNumber: string;
  color: string;
}

export interface ParkingSlot {
  slotNumber: number;
  car: Car | null;
  isOccupied: boolean;
}

export interface ParkingLotResult {
  success: boolean;
  message: string;
  data?: any;
}
