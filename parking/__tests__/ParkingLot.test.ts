import { ParkingLot } from '../src/ParkingLot';
import { ParkingLotResult } from '../src/types';

describe('ParkingLot', () => {
  let parkingLot: ParkingLot;

  beforeEach(() => {
    parkingLot = new ParkingLot(6);
  });

  describe('Constructor', () => {
    it('should create a parking lot with specified number of slots', () => {
      expect(parkingLot.getTotalSlots()).toBe(6);
      expect(parkingLot.getAvailableSlots()).toBe(6);
      expect(parkingLot.getOccupiedSlots()).toBe(0);
    });

    it('should throw error for invalid slot count', () => {
      expect(() => new ParkingLot(0)).toThrow('Parking lot must have at least 1 slot');
      expect(() => new ParkingLot(-1)).toThrow('Parking lot must have at least 1 slot');
    });
  });

  describe('park', () => {
    it('should park a car in the first available slot', () => {
      const result = parkingLot.park('KA-01-HH-1234', 'White');
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Allocated slot number: 1');
      expect(result.data?.slotNumber).toBe(1);
      expect(parkingLot.getOccupiedSlots()).toBe(1);
    });

    it('should park cars in sequential slots', () => {
      parkingLot.park('KA-01-HH-1234', 'White');
      parkingLot.park('KA-01-HH-9999', 'Black');
      
      const result = parkingLot.park('KA-01-BB-0001', 'Red');
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Allocated slot number: 3');
      expect(parkingLot.getOccupiedSlots()).toBe(3);
    });

    it('should return error when parking lot is full', () => {
      // Fill all slots
      for (let i = 1; i <= 6; i++) {
        parkingLot.park(`KA-01-HH-${i.toString().padStart(4, '0')}`, 'White');
      }
      
      const result = parkingLot.park('KA-01-HH-9999', 'Black');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Sorry, parking lot is full');
    });

    it('should prevent duplicate car registration', () => {
      parkingLot.park('KA-01-HH-1234', 'White');
      
      const result = parkingLot.park('KA-01-HH-1234', 'Black');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Car with registration number KA-01-HH-1234 is already parked in slot 1');
    });
  });

  describe('leave', () => {
    beforeEach(() => {
      parkingLot.park('KA-01-HH-1234', 'White');
      parkingLot.park('KA-01-HH-9999', 'Black');
    });

    it('should free a slot when car leaves', () => {
      const result = parkingLot.leave(1);
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Slot number 1 is free');
      expect(parkingLot.getOccupiedSlots()).toBe(1);
    });

    it('should return error for invalid slot number', () => {
      const result = parkingLot.leave(0);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid slot number. Slot must be between 1 and 6');
    });

    it('should return error for slot number out of range', () => {
      const result = parkingLot.leave(10);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid slot number. Slot must be between 1 and 6');
    });

    it('should return error when trying to leave empty slot', () => {
      parkingLot.leave(1); // Free slot 1
      
      const result = parkingLot.leave(1);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Slot number 1 is already free');
    });
  });

  describe('status', () => {
    it('should return empty status for empty parking lot', () => {
      const result = parkingLot.status();
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Parking lot is empty');
      expect(result.data).toEqual([]);
    });

    it('should return correct status for occupied slots', () => {
      parkingLot.park('KA-01-HH-1234', 'White');
      parkingLot.park('KA-01-HH-9999', 'Black');
      
      const result = parkingLot.status();
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        { slotNumber: 1, registrationNumber: 'KA-01-HH-1234', color: 'White' },
        { slotNumber: 2, registrationNumber: 'KA-01-HH-9999', color: 'Black' }
      ]);
    });
  });

  describe('getRegistrationNumbersByColor', () => {
    beforeEach(() => {
      parkingLot.park('KA-01-HH-1234', 'White');
      parkingLot.park('KA-01-HH-9999', 'White');
      parkingLot.park('KA-01-BB-0001', 'Black');
      parkingLot.park('KA-01-HH-7777', 'Red');
    });

    it('should return registration numbers for cars with specified color', () => {
      const result = parkingLot.getRegistrationNumbersByColor('White');
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('KA-01-HH-1234, KA-01-HH-9999');
      expect(result.data).toEqual(['KA-01-HH-1234', 'KA-01-HH-9999']);
    });

    it('should be case insensitive', () => {
      const result = parkingLot.getRegistrationNumbersByColor('white');
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(['KA-01-HH-1234', 'KA-01-HH-9999']);
    });

    it('should return empty result for non-existent color', () => {
      const result = parkingLot.getRegistrationNumbersByColor('Blue');
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('No cars found with color Blue');
      expect(result.data).toEqual([]);
    });
  });

  describe('getSlotNumbersByColor', () => {
    beforeEach(() => {
      parkingLot.park('KA-01-HH-1234', 'White');
      parkingLot.park('KA-01-HH-9999', 'White');
      parkingLot.park('KA-01-BB-0001', 'Black');
      parkingLot.park('KA-01-HH-7777', 'Red');
    });

    it('should return slot numbers for cars with specified color', () => {
      const result = parkingLot.getSlotNumbersByColor('White');
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('1, 2');
      expect(result.data).toEqual([1, 2]);
    });

    it('should be case insensitive', () => {
      const result = parkingLot.getSlotNumbersByColor('white');
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual([1, 2]);
    });

    it('should return empty result for non-existent color', () => {
      const result = parkingLot.getSlotNumbersByColor('Blue');
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('No cars found with color Blue');
      expect(result.data).toEqual([]);
    });
  });

  describe('getSlotNumberByRegistration', () => {
    beforeEach(() => {
      parkingLot.park('KA-01-HH-1234', 'White');
      parkingLot.park('KA-01-HH-9999', 'Black');
    });

    it('should return slot number for existing registration', () => {
      const result = parkingLot.getSlotNumberByRegistration('KA-01-HH-1234');
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('1');
      expect(result.data?.slotNumber).toBe(1);
    });

    it('should return not found for non-existent registration', () => {
      const result = parkingLot.getSlotNumberByRegistration('MH-04-AY-1111');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Not found');
    });
  });

  describe('Edge cases', () => {
    it('should handle parking and leaving multiple cars', () => {
      // Park cars
      parkingLot.park('KA-01-HH-1234', 'White');
      parkingLot.park('KA-01-HH-9999', 'Black');
      parkingLot.park('KA-01-BB-0001', 'Red');
      
      expect(parkingLot.getOccupiedSlots()).toBe(3);
      
      // Leave middle car
      parkingLot.leave(2);
      expect(parkingLot.getOccupiedSlots()).toBe(2);
      
      // Park new car (should go to slot 2)
      const result = parkingLot.park('KA-01-HH-7777', 'Blue');
      expect(result.success).toBe(true);
      expect(result.message).toBe('Allocated slot number: 2');
      expect(parkingLot.getOccupiedSlots()).toBe(3);
    });

    it('should handle single slot parking lot', () => {
      const singleSlotLot = new ParkingLot(1);
      
      const parkResult = singleSlotLot.park('KA-01-HH-1234', 'White');
      expect(parkResult.success).toBe(true);
      
      const fullResult = singleSlotLot.park('KA-01-HH-9999', 'Black');
      expect(fullResult.success).toBe(false);
      expect(fullResult.message).toBe('Sorry, parking lot is full');
    });
  });
});
