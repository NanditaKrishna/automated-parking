import { CommandProcessor, Command } from '../src/CommandProcessor';

describe('CommandProcessor', () => {
  let commandProcessor: CommandProcessor;

  beforeEach(() => {
    commandProcessor = new CommandProcessor();
  });

  describe('parseCommand', () => {
    it('should parse simple command', () => {
      const command = CommandProcessor.parseCommand('create_parking_lot 6');
      
      expect(command.name).toBe('create_parking_lot');
      expect(command.args).toEqual(['6']);
    });

    it('should parse command with multiple arguments', () => {
      const command = CommandProcessor.parseCommand('park KA-01-HH-1234 White');
      
      expect(command.name).toBe('park');
      expect(command.args).toEqual(['KA-01-HH-1234', 'White']);
    });

    it('should handle extra whitespace', () => {
      const command = CommandProcessor.parseCommand('  park   KA-01-HH-1234   White  ');
      
      expect(command.name).toBe('park');
      expect(command.args).toEqual(['KA-01-HH-1234', 'White']);
    });

    it('should handle empty command', () => {
      const command = CommandProcessor.parseCommand('');
      
      expect(command.name).toBe('');
      expect(command.args).toEqual([]);
    });
  });

  describe('create_parking_lot', () => {
    it('should create parking lot with valid number', () => {
      const result = commandProcessor.processCommand({
        name: 'create_parking_lot',
        args: ['6']
      });
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Created a parking lot with 6 slots');
    });

    it('should return error for invalid arguments', () => {
      const result = commandProcessor.processCommand({
        name: 'create_parking_lot',
        args: []
      });
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Usage: create_parking_lot <number_of_slots>');
    });

    it('should return error for invalid slot number', () => {
      const result = commandProcessor.processCommand({
        name: 'create_parking_lot',
        args: ['0']
      });
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Number of slots must be a positive integer');
    });

    it('should return error for non-numeric input', () => {
      const result = commandProcessor.processCommand({
        name: 'create_parking_lot',
        args: ['abc']
      });
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Number of slots must be a positive integer');
    });
  });

  describe('park', () => {
    beforeEach(() => {
      commandProcessor.processCommand({
        name: 'create_parking_lot',
        args: ['6']
      });
    });

    it('should park car with valid arguments', () => {
      const result = commandProcessor.processCommand({
        name: 'park',
        args: ['KA-01-HH-1234', 'White']
      });
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Allocated slot number: 1');
    });

    it('should return error when parking lot not created', () => {
      const newProcessor = new CommandProcessor();
      const result = newProcessor.processCommand({
        name: 'park',
        args: ['KA-01-HH-1234', 'White']
      });
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Parking lot not created. Please create a parking lot first.');
    });

    it('should return error for invalid arguments', () => {
      const result = commandProcessor.processCommand({
        name: 'park',
        args: ['KA-01-HH-1234']
      });
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Usage: park <registration_number> <car_color>');
    });

    it('should return error for empty arguments', () => {
      const result = commandProcessor.processCommand({
        name: 'park',
        args: ['', 'White']
      });
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Registration number and color are required');
    });
  });

  describe('leave', () => {
    beforeEach(() => {
      commandProcessor.processCommand({
        name: 'create_parking_lot',
        args: ['6']
      });
      commandProcessor.processCommand({
        name: 'park',
        args: ['KA-01-HH-1234', 'White']
      });
    });

    it('should leave slot with valid number', () => {
      const result = commandProcessor.processCommand({
        name: 'leave',
        args: ['1']
      });
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Slot number 1 is free');
    });

    it('should return error for invalid arguments', () => {
      const result = commandProcessor.processCommand({
        name: 'leave',
        args: []
      });
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Usage: leave <slot_number>');
    });

    it('should return error for non-numeric slot', () => {
      const result = commandProcessor.processCommand({
        name: 'leave',
        args: ['abc']
      });
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Slot number must be a valid integer');
    });
  });

  describe('status', () => {
    beforeEach(() => {
      commandProcessor.processCommand({
        name: 'create_parking_lot',
        args: ['6']
      });
    });

    it('should return status for empty parking lot', () => {
      const result = commandProcessor.processCommand({
        name: 'status',
        args: []
      });
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Parking lot is empty');
      expect(result.data).toEqual([]);
    });

    it('should return status for occupied parking lot', () => {
      commandProcessor.processCommand({
        name: 'park',
        args: ['KA-01-HH-1234', 'White']
      });
      
      const result = commandProcessor.processCommand({
        name: 'status',
        args: []
      });
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        { slotNumber: 1, registrationNumber: 'KA-01-HH-1234', color: 'White' }
      ]);
    });
  });

  describe('registration_numbers_for_cars_with_colour', () => {
    beforeEach(() => {
      commandProcessor.processCommand({
        name: 'create_parking_lot',
        args: ['6']
      });
      commandProcessor.processCommand({
        name: 'park',
        args: ['KA-01-HH-1234', 'White']
      });
      commandProcessor.processCommand({
        name: 'park',
        args: ['KA-01-HH-9999', 'White']
      });
      commandProcessor.processCommand({
        name: 'park',
        args: ['KA-01-BB-0001', 'Black']
      });
    });

    it('should return registration numbers for valid color', () => {
      const result = commandProcessor.processCommand({
        name: 'registration_numbers_for_cars_with_colour',
        args: ['White']
      });
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('KA-01-HH-1234, KA-01-HH-9999');
      expect(result.data).toEqual(['KA-01-HH-1234', 'KA-01-HH-9999']);
    });

    it('should return error for invalid arguments', () => {
      const result = commandProcessor.processCommand({
        name: 'registration_numbers_for_cars_with_colour',
        args: []
      });
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Usage: registration_numbers_for_cars_with_colour <color>');
    });
  });

  describe('slot_numbers_for_cars_with_colour', () => {
    beforeEach(() => {
      commandProcessor.processCommand({
        name: 'create_parking_lot',
        args: ['6']
      });
      commandProcessor.processCommand({
        name: 'park',
        args: ['KA-01-HH-1234', 'White']
      });
      commandProcessor.processCommand({
        name: 'park',
        args: ['KA-01-HH-9999', 'White']
      });
      commandProcessor.processCommand({
        name: 'park',
        args: ['KA-01-BB-0001', 'Black']
      });
    });

    it('should return slot numbers for valid color', () => {
      const result = commandProcessor.processCommand({
        name: 'slot_numbers_for_cars_with_colour',
        args: ['White']
      });
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('1, 2');
      expect(result.data).toEqual([1, 2]);
    });
  });

  describe('slot_number_for_registration_number', () => {
    beforeEach(() => {
      commandProcessor.processCommand({
        name: 'create_parking_lot',
        args: ['6']
      });
      commandProcessor.processCommand({
        name: 'park',
        args: ['KA-01-HH-1234', 'White']
      });
    });

    it('should return slot number for existing registration', () => {
      const result = commandProcessor.processCommand({
        name: 'slot_number_for_registration_number',
        args: ['KA-01-HH-1234']
      });
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('1');
      expect(result.data?.slotNumber).toBe(1);
    });

    it('should return not found for non-existent registration', () => {
      const result = commandProcessor.processCommand({
        name: 'slot_number_for_registration_number',
        args: ['MH-04-AY-1111']
      });
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Not found');
    });
  });

  describe('unknown command', () => {
    it('should return error for unknown command', () => {
      const result = commandProcessor.processCommand({
        name: 'unknown_command',
        args: []
      });
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Unknown command: unknown_command');
    });
  });
});
