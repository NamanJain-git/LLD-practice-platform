import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./src/config/db.js";
import Problem from "./src/models/Problem.js";

dotenv.config();

const problems = [
    {
        title: "Parking Lot",
        difficulty: "Medium",
        description:
            "Design a parking lot system that can manage different types of vehicles, parking spots, vehicle entry and exit, and parking fees.",

        requirements: [
            "The parking lot should support multiple vehicle types such as Car, Bike, and Truck.",
            "The parking lot should have different types of parking spots suitable for different vehicles.",
            "The system should assign an appropriate available parking spot when a vehicle enters.",
            "The system should release the parking spot when a vehicle exits.",
            "The system should calculate the parking fee when a vehicle exits.",
            "The system should be able to determine whether suitable parking space is available."
        ],

        constraints: [
            "A vehicle should not occupy more than one parking spot.",
            "A vehicle should only be assigned to a compatible parking spot.",
            "The design should allow new vehicle or parking spot types to be added later.",
            "Parking and payment responsibilities should be reasonably separated."
        ]
    },

    {
        title: "Vending Machine",
        difficulty: "Easy",
        description:
            "Design a vending machine that allows users to select products, insert money, purchase products, and receive change.",

        requirements: [
            "The machine should display available products and their prices.",
            "A user should be able to select a product.",
            "The machine should accept money from the user.",
            "The machine should verify whether sufficient money has been inserted.",
            "The machine should dispense the selected product after a successful purchase.",
            "The machine should return the remaining change to the user.",
            "The machine should handle unavailable or out-of-stock products."
        ],

        constraints: [
            "A product cannot be dispensed if it is out of stock.",
            "A purchase should not complete when insufficient money is provided.",
            "The design should handle invalid product selection.",
            "The machine should return appropriate money when a transaction cannot be completed."
        ]
    },

    {
        title: "Elevator System",
        difficulty: "Medium",
        description:
            "Design an elevator system for a building that manages elevator requests, floor movement, and elevator selection.",

        requirements: [
            "The building should support multiple floors.",
            "The system should support one or more elevators.",
            "A user should be able to request an elevator from a floor.",
            "A user should be able to select a destination floor.",
            "The system should determine which elevator should handle a request.",
            "The elevator should move between floors.",
            "The system should maintain the current state and direction of each elevator."
        ],

        constraints: [
            "An elevator should not move beyond the valid building floors.",
            "The design should allow different elevator-selection strategies.",
            "The system should handle multiple elevator requests.",
            "The elevator's movement and request-assignment responsibilities should be reasonably separated."
        ]
    }
];

const seedProblems = async () => {
    try {
        await connectDB();

        await Problem.deleteMany();

        await Problem.insertMany(problems);

        console.log("Problems seeded successfully");

        await mongoose.connection.close();

        process.exit(0);
    } catch (error) {
        console.error("Error seeding problems:", error.message);

        await mongoose.connection.close();

        process.exit(1);
    }
};

seedProblems();