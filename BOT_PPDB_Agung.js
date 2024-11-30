import dotenv from "dotenv";
dotenv.config();
import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import readline from "readline";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Initialize the WhatsApp client
const client = new Client();

// Create a read/write interface for user inputs
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Listen for WhatsApp QR code for authentication
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

// Start the bot once WhatsApp client is ready
client.on("ready", () => {
  console.log("Client is ready!");
});

// Set up the AI chat history and model
const chatHistory = [
  {
    role: "user",
    parts: [
      {
        text: "I am a prospective student or CPD who will register as a student at SMA N1 Ciampel. Can you provide information?",
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: "You are the admin of the PPDB call center for SMA N 1 Ciampel. Answer questions accurately regarding new student registration, regarding the instructions and technical aspects of PPDB SMA West Java. If you are not sure, instruct the user to view the sapa warga application or the PPDB Jabar 2025 website.",
      },
    ],
  },
];

// Create the AI chat model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const chat = model.startChat({
  history: chatHistory,
  generationConfig: {
    maxOutputTokens: 200,
  },
});

// Define message handling from WhatsApp
client.on("message", async (msg) => {
  if (msg.body.toLowerCase() === "exit") {
    msg.reply("Goodbye! Feel free to reach out again if you need assistance.");
    return;
  }

  // Send the received message to the AI
  const result = await chat.sendMessage(msg.body);
  const response = await result.response;
  const aiResponse = await response.text();

  // Reply with the AI response
  msg.reply(aiResponse);
});

// Initialize the WhatsApp client
client.initialize();
