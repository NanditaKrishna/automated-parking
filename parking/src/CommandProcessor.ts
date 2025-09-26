import { ParkingLot } from './ParkingLot';
import { ParkingLotResult } from './types';

export interface Command {
  name: string;
  args: string[];
}

export class CommandProcessor {
  private parkingLot: ParkingLot | null = null;

  processCommand(command: Command): ParkingLotResult {
    try {
      switch (command.name.toLowerCase()) {
        case 'create_parking_lot':
          return this.createParkingLot(command.args);
        
        case 'park':
          return this.park(command.args);
        
        case 'leave':
          return this.leave(command.args);
        
        case 'status':
          return this.status();
        
        case 'registration_numbers_for_cars_with_colour':
          return this.getRegistrationNumbersByColor(command.args);
        
        case 'slot_numbers_for_cars_with_colour':
          return this.getSlotNumbersByColor(command.args);
        
        case 'slot_number_for_registration_number':
          return this.getSlotNumberByRegistration(command.args);
        
        default:
          return {
            success: false,
            message: `Unknown command: ${command.name}`
          };
      }
    } catch (error) {
      return {
        success: false,
        message: `Error processing command: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private createParkingLot(args: string[]): ParkingLotResult {
    if (args.length !== 1) {
      return {
        success: false,
        message: 'Usage: create_parking_lot <number_of_slots>'
      };
    }

    const numberOfSlots = parseInt(args[0], 10);
    
    if (isNaN(numberOfSlots) || numberOfSlots <= 0) {
      return {
        success: false,
        message: 'Number of slots must be a positive integer'
      };
    }

    this.parkingLot = new ParkingLot(numberOfSlots);
    
    return {
      success: true,
      message: `Created a parking lot with ${numberOfSlots} slots`
    };
  }

  private park(args: string[]): ParkingLotResult {
    if (!this.parkingLot) {
      return {
        success: false,
        message: 'Parking lot not created. Please create a parking lot first.'
      };
    }

    if (args.length !== 2) {
      return {
        success: false,
        message: 'Usage: park <registration_number> <car_color>'
      };
    }

    const [registrationNumber, color] = args;
    
    if (!registrationNumber || !color) {
      return {
        success: false,
        message: 'Registration number and color are required'
      };
    }

    return this.parkingLot.park(registrationNumber, color);
  }

  private leave(args: string[]): ParkingLotResult {
    if (!this.parkingLot) {
      return {
        success: false,
        message: 'Parking lot not created. Please create a parking lot first.'
      };
    }

    if (args.length !== 1) {
      return {
        success: false,
        message: 'Usage: leave <slot_number>'
      };
    }

    const slotNumber = parseInt(args[0], 10);
    
    if (isNaN(slotNumber)) {
      return {
        success: false,
        message: 'Slot number must be a valid integer'
      };
    }

    return this.parkingLot.leave(slotNumber);
  }

  private status(): ParkingLotResult {
    if (!this.parkingLot) {
      return {
        success: false,
        message: 'Parking lot not created. Please create a parking lot first.'
      };
    }

    return this.parkingLot.status();
  }

  private getRegistrationNumbersByColor(args: string[]): ParkingLotResult {
    if (!this.parkingLot) {
      return {
        success: false,
        message: 'Parking lot not created. Please create a parking lot first.'
      };
    }

    if (args.length !== 1) {
      return {
        success: false,
        message: 'Usage: registration_numbers_for_cars_with_colour <color>'
      };
    }

    const color = args[0];
    
    if (!color) {
      return {
        success: false,
        message: 'Color is required'
      };
    }

    return this.parkingLot.getRegistrationNumbersByColor(color);
  }

  private getSlotNumbersByColor(args: string[]): ParkingLotResult {
    if (!this.parkingLot) {
      return {
        success: false,
        message: 'Parking lot not created. Please create a parking lot first.'
      };
    }

    if (args.length !== 1) {
      return {
        success: false,
        message: 'Usage: slot_numbers_for_cars_with_colour <color>'
      };
    }

    const color = args[0];
    
    if (!color) {
      return {
        success: false,
        message: 'Color is required'
      };
    }

    return this.parkingLot.getSlotNumbersByColor(color);
  }

  private getSlotNumberByRegistration(args: string[]): ParkingLotResult {
    if (!this.parkingLot) {
      return {
        success: false,
        message: 'Parking lot not created. Please create a parking lot first.'
      };
    }

    if (args.length !== 1) {
      return {
        success: false,
        message: 'Usage: slot_number_for_registration_number <registration_number>'
      };
    }

    const registrationNumber = args[0];
    
    if (!registrationNumber) {
      return {
        success: false,
        message: 'Registration number is required'
      };
    }

    return this.parkingLot.getSlotNumberByRegistration(registrationNumber);
  }

  static parseCommand(commandString: string): Command {
    const parts = commandString.trim().split(/\s+/);
    const name = parts[0];
    const args = parts.slice(1);
    
    return { name, args };
  }
}
