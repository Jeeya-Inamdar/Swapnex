import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

const seedDatabase = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    const demoUsers = [
      {
        name: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        password: hashedPassword,
        bio: "AI social explorer",
      },
      {
        name: "Jane Smith",
        username: "janesmith",
        email: "jane@example.com",
        password: hashedPassword,
        bio: "Design leader and community builder",
      },
      {
        name: "Alex Johnson",
        username: "alexjohnson",
        email: "alex@example.com",
        password: hashedPassword,
        bio: "Startup founder and product thinker",
      },
      {
        name: "Sarah Williams",
        username: "sarahwilliams",
        email: "sarah@example.com",
        password: hashedPassword,
        bio: "Full-stack creator and AI tinkerer",
      },
      {
        name: "Mike Brown",
        username: "mikebrown",
        email: "mike@example.com",
        password: hashedPassword,
        bio: "Realtime chat fan and social UX designer",
      },
    ];

    // Ensure every existing user has the same known password for development access.
    await User.updateMany({}, { password: hashedPassword });

    const existingUsers = await User.find({
      $or: demoUsers.map((user) => ({
        $or: [{ email: user.email }, { username: user.username }],
      })),
    }).select("email username");

    const existingEmails = new Set(existingUsers.map((user) => user.email));
    const existingUsernames = new Set(existingUsers.map((user) => user.username));

    const usersToCreate = demoUsers.filter(
      (user) => !existingEmails.has(user.email) && !existingUsernames.has(user.username)
    );

    if (usersToCreate.length > 0) {
      await User.insertMany(usersToCreate);
    }

    const users = await User.find().select("username email").lean();

    res.status(200).json({
      message: "Database seeded successfully",
      users,
    });
  } catch (error) {
    console.error("seedDatabase error", error);
    res.status(500).json({ error: error.message });
  }
};

export default seedDatabase;
