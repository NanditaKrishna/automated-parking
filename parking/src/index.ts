#!/usr/bin/env node

import { InputHandler } from './InputHandler';

async function main(): Promise<void> {
  const inputHandler = new InputHandler();
  
  // Check if a file path is provided as command line argument
  const filePath = process.argv[2];
  
  if (filePath) {
    // File-based input mode
    await inputHandler.processFileInput(filePath);
  } else {
    // Interactive shell mode
    await inputHandler.startInteractiveMode();
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Start the application
main().catch((error) => {
  console.error('Application Error:', error.message);
  process.exit(1);
});
