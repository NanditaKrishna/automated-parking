# Parking Lot Automation System

A simple automated ticketing system for a parking lot built with TypeScript. This system simulates a real-world parking lot where cars can be parked and retrieved without human assistance.

## 🚗 Features

- **Automated Parking Management**: Park cars in the nearest available slot
- **Multiple Input Modes**: File-based input and interactive shell
- **Comprehensive Commands**: Create, park, leave, status, and query operations
- **Clean Architecture**: Object-oriented design with TypeScript
- **Full Test Coverage**: Unit tests for all functionality
- **Error Handling**: Robust error handling and validation

## 📋 Commands

The system supports the following commands:

### 1. `create_parking_lot <number_of_slots>`
Creates a parking lot with a given number of slots.

**Example:**
```
create_parking_lot 6
```
**Output:**
```
Created a parking lot with 6 slots
```

### 2. `park <registration_number> <car_color>`
Parks the car into the nearest available slot.

**Example:**
```
park KA-01-HH-1234 White
```
**Output:**
```
Allocated slot number: 1
```

### 3. `leave <slot_number>`
Frees up a slot when a car leaves.

**Example:**
```
leave 4
```
**Output:**
```
Slot number 4 is free
```

### 4. `status`
Displays current occupancy.

**Example:**
```
status
```
**Output:**
```
Slot No.    Registration No    Colour
1          KA-01-HH-1234      White
2          KA-01-HH-9999      White
3          KA-01-BB-0001      Black
5          KA-01-HH-2701      Blue
6          KA-01-HH-3141      Black
```

### 5. `registration_numbers_for_cars_with_colour <color>`
Lists all registration numbers for cars with the given color.

**Example:**
```
registration_numbers_for_cars_with_colour White
```
**Output:**
```
KA-01-HH-1234, KA-01-HH-9999
```

### 6. `slot_numbers_for_cars_with_colour <color>`
Returns slot numbers occupied by cars of the given color.

**Example:**
```
slot_numbers_for_cars_with_colour White
```
**Output:**
```
1, 2
```

### 7. `slot_number_for_registration_number <reg_number>`
Returns the slot number for the car with the given registration number.

**Example:**
```
slot_number_for_registration_number KA-01-HH-3141
```
**Output:**
```
6
```

**If not found:**
```
slot_number_for_registration_number MH-04-AY-1111
```
**Output:**
```
Not found
```

## 🛠 Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or extract the project:**
   ```bash
   # If you have the project files
   cd parking_lot
   ```

2. **Run the setup script:**
   ```bash
   ./bin/setup
   ```

   This will:
   - Install all dependencies
   - Compile the TypeScript code
   - Run all tests

## 🚀 How to Run

### Interactive Mode

Start the interactive shell:
```bash
./bin/parking_lot
```

Then enter commands one by one:
```
parking_lot> create_parking_lot 6
Created a parking lot with 6 slots
parking_lot> park KA-01-HH-1234 White
Allocated slot number: 1
parking_lot> status
Slot No.    Registration No    Colour
1          KA-01-HH-1234      White
parking_lot> exit
Goodbye!
```

### File-based Input Mode

Run with an input file:
```bash
./bin/parking_lot sample_inputs/example.txt
```

## 🧪 Running Tests

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## 📁 Project Structure

```
parking_lot/
├── bin/
│   ├── setup              # Setup script
│   └── parking_lot        # Main entry point
├── src/
│   ├── types.ts           # Type definitions
│   ├── ParkingLot.ts      # Core parking lot logic
│   ├── CommandProcessor.ts # Command processing
│   ├── InputHandler.ts    # Input handling
│   └── index.ts           # Main application entry
├── __tests__/
│   ├── ParkingLot.test.ts
│   └── CommandProcessor.test.ts
├── sample_inputs/
│   ├── example.txt        # Complete example
│   ├── small_lot.txt      # Small parking lot example
│   └── single_slot.txt    # Single slot example
├── package.json
├── tsconfig.json
└── README.md
```

## 📝 Sample Input/Output

### Example 1: Complete Workflow

**Input file (`sample_inputs/example.txt`):**
```
create_parking_lot 6
park KA-01-HH-1234 White
park KA-01-HH-9999 White
park KA-01-BB-0001 Black
park KA-01-HH-7777 Red
park KA-01-HH-2701 Blue
park KA-01-HH-3141 Black
status
leave 4
status
registration_numbers_for_cars_with_colour White
slot_numbers_for_cars_with_colour White
slot_number_for_registration_number KA-01-HH-3141
slot_number_for_registration_number MH-04-AY-1111
```

**Output:**
```
Created a parking lot with 6 slots
Allocated slot number: 1
Allocated slot number: 2
Allocated slot number: 3
Allocated slot number: 4
Allocated slot number: 5
Allocated slot number: 6
Slot No.    Registration No    Colour
1          KA-01-HH-1234      White
2          KA-01-HH-9999      White
3          KA-01-BB-0001      Black
4          KA-01-HH-7777      Red
5          KA-01-HH-2701      Blue
6          KA-01-HH-3141      Black
Slot number 4 is free
Slot No.    Registration No    Colour
1          KA-01-HH-1234      White
2          KA-01-HH-9999      White
3          KA-01-BB-0001      Black
5          KA-01-HH-2701      Blue
6          KA-01-HH-3141      Black
KA-01-HH-1234, KA-01-HH-9999
1, 2
6
Not found
```

### Example 2: Small Parking Lot

**Input file (`sample_inputs/small_lot.txt`):**
```
create_parking_lot 3
park KA-01-HH-1234 White
park KA-01-HH-9999 Black
park KA-01-BB-0001 Red
park KA-01-HH-7777 Blue
leave 2
park KA-01-HH-2701 Green
status
```

**Output:**
```
Created a parking lot with 3 slots
Allocated slot number: 1
Allocated slot number: 2
Allocated slot number: 3
Sorry, parking lot is full
Slot number 2 is free
Allocated slot number: 2
Slot No.    Registration No    Colour
1          KA-01-HH-1234      White
2          KA-01-HH-2701      Green
3          KA-01-BB-0001      Red
```

## 🔧 Development

### Building the Project

```bash
npm run build
```

### Running in Development Mode

```bash
npm run dev
```

### Code Quality

The project follows TypeScript best practices:
- Strict type checking
- Clean architecture with separation of concerns
- Comprehensive error handling
- Full test coverage
- Meaningful variable and function names

## 🐛 Error Handling

The system handles various error conditions:
- Invalid slot numbers
- Duplicate car registrations
- Full parking lot
- Empty parking lot operations
- Invalid command syntax
- File I/O errors

## 📊 Test Coverage

The project includes comprehensive unit tests covering:
- All parking lot operations
- Command processing
- Edge cases and error conditions
- Input validation
- File and interactive input modes

## 🤝 Contributing

This is a demonstration project showcasing:
- Clean TypeScript code
- Object-oriented design principles
- Comprehensive testing
- Professional project structure
- Error handling and validation

## 📄 License

MIT License - See LICENSE file for details.
