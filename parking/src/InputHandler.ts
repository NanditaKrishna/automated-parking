import * as fs from 'fs';
import * as readline from 'readline';
import { CommandProcessor, Command } from './CommandProcessor';
import { ParkingLotResult } from './types';

export class InputHandler {
  private commandProcessor: CommandProcessor;

  constructor() {
    this.commandProcessor = new CommandProcessor();
  }

  async processFileInput(filePath: string): Promise<void> {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        const command = CommandProcessor.parseCommand(line);
        const result = this.commandProcessor.processCommand(command);
        this.displayResult(result);
      }
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  }

  async startInteractiveMode(): Promise<void> {
    console.log('Welcome to Parking Lot Automation System');
    console.log('Type "exit" or "quit" to exit the program');
    console.log('Available commands:');
    console.log('  create_parking_lot <number_of_slots>');
    console.log('  park <registration_number> <car_color>');
    console.log('  leave <slot_number>');
    console.log('  status');
    console.log('  registration_numbers_for_cars_with_colour <color>');
    console.log('  slot_numbers_for_cars_with_colour <color>');
    console.log('  slot_number_for_registration_number <registration_number>');
    console.log('');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'parking_lot> '
    });

    rl.prompt();

    rl.on('line', (input: string) => {
      const trimmedInput = input.trim();
      
      if (trimmedInput.toLowerCase() === 'exit' || trimmedInput.toLowerCase() === 'quit') {
        console.log('Goodbye!');
        rl.close();
        return;
      }

      if (trimmedInput === '') {
        rl.prompt();
        return;
      }

      try {
        const command = CommandProcessor.parseCommand(trimmedInput);
        const result = this.commandProcessor.processCommand(command);
        this.displayResult(result);
      } catch (error) {
        console.error('Error processing command:', error instanceof Error ? error.message : 'Unknown error');
      }

      rl.prompt();
    });

    rl.on('close', () => {
      process.exit(0);
    });
  }

  private displayResult(result: ParkingLotResult): void {
    if (result.success) {
      console.log(result.message);
      
      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        const statusData = result.data;
        if (statusData[0] && statusData[0].slotNumber) {
          console.log('Slot No.    Registration No    Colour');
          statusData.forEach((item: any) => {
            console.log(`${item.slotNumber.toString().padEnd(11)} ${item.registrationNumber.padEnd(18)} ${item.color}`);
          });
        }
      }
    } else {
      console.log(result.message);
    }
  }
}
