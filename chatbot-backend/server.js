const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();

// Define allowed origin
const allowedOrigins = ['https://chat-buddy-nine.vercel.app', 'http://localhost:3000'];


// Allow all origins
app.use(cors({
    origin: '*', // Allow requests from any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
    credentials: false, // Set to false as credentials are not necessary for unrestricted access
}));

// Handle preflight requests
app.options('*', cors());


// Middleware
app.use(bodyParser.json());

// MySQL Configuration
const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL");
});

db.query('SELECT 1', (err, results) => {
    if (err) {
        console.error('MySQL Test Query Failed:', err);
    } else {
        console.log('MySQL Test Query Success:', results);
    }
});

// OpenAI Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Use API key from .env file
});

app.get("/test",  async (req, res) => {
console.log("testing");
});

// Chat Endpoint
app.post("/chat", async (req, res) => {
    const { email, query, name } = req.body;

    if (!email) {
        return res.status(400).send({ reply: "Email is required to start chatting." });
    }

    if (!query && !name) {
        return res.status(400).send({ reply: "Query or name is required to proceed." });
    }

    // Check if the user exists
    db.query("SELECT id, name FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) {
            console.error("Error querying database:", err);
            return res.status(500).send({ reply: "Server error. Please try again later." });
        }

        let userId, userName;

        if (results.length > 0) {
            // User exists
            userId = results[0].id;
            userName = results[0].name;

            if (!query) {
                return res.send({ reply: `Welcome back, ${userName}! How can I assist you today?` });
            }
        } else {
            // New user, insert their details
            db.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], (err, result) => {
                if (err) {
                    console.error("Error inserting user:", err);
                    return res.status(500).send({ reply: "Server error. Please try again later." });
                }
                userId = result.insertId;
                userName = name;

                return res.send({ reply: `Hello, ${userName}! How can I assist you today?` });
            });
            return;
        }

        // Handle specific queries like "my profile", "what is my name", etc.
        if (query.toLowerCase() === "my profile") {
            return res.send({ reply: `Your name is ${userName}, and your email is ${email}.` });
        }

        if (query.toLowerCase() === "what is my name") {
            return res.send({ reply: `Your name is ${userName}.` });
        }

        if (query.toLowerCase() === "what is my email") {
            return res.send({ reply: `Your email is ${email}.` });
        }

        // Handle summarization-specific queries
        const summaryTriggers = ["summarize our conversation", "summarize chat"];
        if (summaryTriggers.some((trigger) => query.toLowerCase().includes(trigger))) {
            // Retrieve chat history for the user
            db.query(
                "SELECT message FROM chat_history WHERE user_id = ? ORDER BY timestamp",
                [userId],
                async (err, results) => {
                    if (err) {
                        console.error("Error querying chat history:", err);
                        return res.status(500).send({ reply: "Server error. Please try again later." });
                    }

                    if (results.length === 0) {
                        return res.send({ reply: "No chat history found for your account." });
                    }

                    // Concatenate chat history for summarization
                    const chatHistory = results.map((row) => row.message).join("\n");

                    try {
                        const openaiResponse = await openai.chat.completions.create({
                            model: "gpt-3.5-turbo",
                            messages: [{ role: "user", content: `Summarize the following chat history:\n\n${chatHistory}` }],
                            max_tokens: 200,
                            temperature: 0.7,
                        });

                        const summary = openaiResponse.choices[0].message.content.trim();
                        return res.send({ reply: summary });
                    } catch (apiError) {
                        console.error("Error with OpenAI API:", apiError);
                        return res.status(500).send({ reply: "Unable to summarize the chat at the moment." });
                    }
                }
            );
            return;
        }

        // Handle OpenAI API response
        try {
            const openaiResponse = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: query }],
                max_tokens: 150,
                temperature: 0.7,
            });

            const botReply = openaiResponse.choices[0].message.content.trim();

            // Save the user query and bot reply to chat history
            db.query("INSERT INTO chat_history (user_id, sender, message) VALUES (?, 'user', ?)", [userId, query]);
            db.query("INSERT INTO chat_history (user_id, sender, message) VALUES (?, 'bot', ?)", [userId, botReply]);

            res.send({ reply: botReply });
        } catch (apiError) {
            console.error("Error with OpenAI API:", apiError);
            return res.status(500).send({ reply: "Unable to process your request at the moment." });
        }
    });
});

// Dynamic Port Configuration
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
