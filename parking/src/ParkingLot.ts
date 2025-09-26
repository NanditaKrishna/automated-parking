import { Car, ParkingSlot, ParkingLotResult } from './types';

export class ParkingLot {
  private slots: ParkingSlot[];
  private totalSlots: number;

  constructor(totalSlots: number) {
    if (totalSlots <= 0) {
      throw new Error('Parking lot must have at least 1 slot');
    }
    
    this.totalSlots = totalSlots;
    this.slots = [];
    
    for (let i = 1; i <= totalSlots; i++) {
      this.slots.push({
        slotNumber: i,
        car: null,
        isOccupied: false
      });
    }
  }

  park(registrationNumber: string, color: string): ParkingLotResult {
    const existingSlot = this.findSlotByRegistration(registrationNumber);
    if (existingSlot) {
      return {
        success: false,
        message: `Car with registration number ${registrationNumber} is already parked in slot ${existingSlot.slotNumber}`
      };
    }

    const availableSlot = this.slots.find(slot => !slot.isOccupied);
    
    if (!availableSlot) {
      return {
        success: false,
        message: 'Sorry, parking lot is full'
      };
    }

    const car: Car = { registrationNumber, color };
    availableSlot.car = car;
    availableSlot.isOccupied = true;

    return {
      success: true,
      message: `Allocated slot number: ${availableSlot.slotNumber}`,
      data: { slotNumber: availableSlot.slotNumber }
    };
  }

  leave(slotNumber: number): ParkingLotResult {
    if (slotNumber < 1 || slotNumber > this.totalSlots) {
      return {
        success: false,
        message: `Invalid slot number. Slot must be between 1 and ${this.totalSlots}`
      };
    }

    const slot = this.slots[slotNumber - 1];
    
    if (!slot.isOccupied) {
      return {
        success: false,
        message: `Slot number ${slotNumber} is already free`
      };
    }

    slot.car = null;
    slot.isOccupied = false;

    return {
      success: true,
      message: `Slot number ${slotNumber} is free`
    };
  }

  status(): ParkingLotResult {
    const occupiedSlots = this.slots.filter(slot => slot.isOccupied);
    
    if (occupiedSlots.length === 0) {
      return {
        success: true,
        message: 'Parking lot is empty',
        data: []
      };
    }

    const statusData = occupiedSlots.map(slot => ({
      slotNumber: slot.slotNumber,
      registrationNumber: slot.car!.registrationNumber,
      color: slot.car!.color
    }));

    return {
      success: true,
      message: 'Current parking lot status',
      data: statusData
    };
  }

  getRegistrationNumbersByColor(color: string): ParkingLotResult {
    const carsWithColor = this.slots
      .filter(slot => slot.isOccupied && slot.car!.color.toLowerCase() === color.toLowerCase())
      .map(slot => slot.car!.registrationNumber);

    if (carsWithColor.length === 0) {
      return {
        success: true,
        message: `No cars found with color ${color}`,
        data: []
      };
    }

    return {
      success: true,
      message: carsWithColor.join(', '),
      data: carsWithColor
    };
  }

  getSlotNumbersByColor(color: string): ParkingLotResult {
    const slotsWithColor = this.slots
      .filter(slot => slot.isOccupied && slot.car!.color.toLowerCase() === color.toLowerCase())
      .map(slot => slot.slotNumber);

    if (slotsWithColor.length === 0) {
      return {
        success: true,
        message: `No cars found with color ${color}`,
        data: []
      };
    }

    return {
      success: true,
      message: slotsWithColor.join(', '),
      data: slotsWithColor
    };
  }

  getSlotNumberByRegistration(registrationNumber: string): ParkingLotResult {
    const slot = this.findSlotByRegistration(registrationNumber);
    
    if (!slot) {
      return {
        success: false,
        message: 'Not found'
      };
    }

    return {
      success: true,
      message: slot.slotNumber.toString(),
      data: { slotNumber: slot.slotNumber }
    };
  }

  private findSlotByRegistration(registrationNumber: string): ParkingSlot | null {
    return this.slots.find(slot => 
      slot.isOccupied && slot.car!.registrationNumber === registrationNumber
    ) || null;
  }

  getTotalSlots(): number {
    return this.totalSlots;
  }

  getOccupiedSlots(): number {
    return this.slots.filter(slot => slot.isOccupied).length;
  }

  getAvailableSlots(): number {
    return this.totalSlots - this.getOccupiedSlots();
  }
}
