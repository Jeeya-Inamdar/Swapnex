import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/userModel.js";
import Post from "./models/postModel.js";
import Conversation from "./models/conversationModel.js";
import Message from "./models/messageModel.js";

dotenv.config();

const seedDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    console.log("Clearing existing database...");
    await User.deleteMany({});
    await Post.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});

    console.log("Generating Users...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    const demoUsersData = [
      {
        name: "Jeeya Inamdar",
        username: "jeeya",
        email: "jeeya@example.com",
        password: hashedPassword,
        bio: "Creator of Swapnex 🚀 #coding",
        profilePic: "https://i.pravatar.cc/150?img=1",
      },
      {
        name: "Alex Dev",
        username: "alexdev",
        email: "alex@example.com",
        password: hashedPassword,
        bio: "Full-stack engineer & AI enthusiast. Building cool stuff.",
        profilePic: "https://i.pravatar.cc/150?img=11",
      },
      {
        name: "Sarah UI",
        username: "sarahui",
        email: "sarah@example.com",
        password: hashedPassword,
        bio: "Product designer. I make things look pretty 🎨",
        profilePic: "https://i.pravatar.cc/150?img=5",
      },
      {
        name: "Tech Bro",
        username: "techbro",
        email: "techbro@example.com",
        password: hashedPassword,
        bio: "Web3 | AI | Startups. Let's connect! 🤝",
        profilePic: "https://i.pravatar.cc/150?img=14",
      },
      {
        name: "Jane Smith",
        username: "jane",
        email: "jane@example.com",
        password: hashedPassword,
        bio: "Just exploring the digital world.",
        profilePic: "https://i.pravatar.cc/150?img=9",
      }
    ];

    const users = await User.insertMany(demoUsersData);
    console.log(`Seeded ${users.length} users.`);

    console.log("Generating Follows...");
    // Make them follow each other
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < users.length; j++) {
        if (i !== j) {
          // 50% chance to follow
          if (Math.random() > 0.5) {
            users[i].following.push(users[j]._id.toString());
            users[j].followers.push(users[i]._id.toString());
          }
        }
      }
    }
    // Save updated users
    for (const user of users) {
      await user.save();
    }
    console.log("Seeded follows.");

    console.log("Generating Posts...");
    const postContents = [
      "Just launched the new version of Swapnex! So excited! 🎉 #launch #swapnex",
      "Tailwind CSS makes styling so much easier. What do you guys think? 🤔 #frontend #tailwindcss",
      "Working on some real-time features using Socket.io. It's magical! ✨",
      "Anyone have good resources for learning Framer Motion? Need to add some swagger to my app.",
      "Just had a great coffee and coded for 4 hours straight. Peak productivity ☕💻 #codinglife",
      "Testing the dynamic data feed. Looks like it's working flawlessly! #testing #dev",
      "Thinking about adding an AI integration next... any ideas? 🤖",
      "UI/UX is just as important as the backend. Don't neglect your designers! 🎨",
      "Can we appreciate how cool glassmorphism looks when done right? 🧊"
    ];

    const posts = [];
    for (let i = 0; i < 15; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomText = postContents[Math.floor(Math.random() * postContents.length)];
      
      const newPost = new Post({
        postedBy: randomUser._id,
        text: randomText,
        // Sometimes add an image
        img: Math.random() > 0.6 ? `https://picsum.photos/seed/${i}/800/600` : "",
      });
      
      posts.push(newPost);
    }
    await Post.insertMany(posts);
    console.log(`Seeded ${posts.length} posts.`);

    console.log("Generating Likes and Comments...");
    const savedPosts = await Post.find({});
    
    for (const post of savedPosts) {
      // Add random likes
      const numLikes = Math.floor(Math.random() * users.length);
      const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < numLikes; i++) {
        post.likes.push(shuffledUsers[i]._id);
      }

      // Add random comments
      if (Math.random() > 0.3) {
        const numComments = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numComments; j++) {
          const randomUser = users[Math.floor(Math.random() * users.length)];
          post.replies.push({
            userId: randomUser._id,
            text: "This is a dynamic test comment! 🔥",
            userProfilePic: randomUser.profilePic,
            username: randomUser.username
          });
        }
      }
      
      await post.save();
    }
    console.log("Seeded likes and comments.");

    console.log("Generating Conversations and Messages...");
    for (let i = 0; i < users.length - 1; i++) {
      const sender = users[i];
      const receiver = users[i+1];

      const newConversation = new Conversation({
        participants: [sender._id, receiver._id],
        lastMessage: {
          text: "Hey, how are you doing?",
          sender: sender._id,
          seen: true
        }
      });
      await newConversation.save();

      const msgs = [
        { senderId: sender._id, text: "Hey, how are you doing?", conversationId: newConversation._id, seen: true },
        { senderId: receiver._id, text: "I'm doing great! Just testing the chat.", conversationId: newConversation._id, seen: true },
        { senderId: sender._id, text: "Awesome, it seems to be working perfectly.", conversationId: newConversation._id, seen: true }
      ];
      
      await Message.insertMany(msgs);
    }
    console.log("Seeded conversations and messages.");

    console.log("Database seeded successfully! All users have password: '123456'");
    process.exit(0);

  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
