import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

config(); // uses environment variables, no path

const seedUsers = [
  /* your user objects */
];

const seedDatabase = async () => {
  try {
    await connectDB();

    const seedUsersHashed = seedUsers.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 10)
    }));

    await User.insertMany(seedUsersHashed);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();
