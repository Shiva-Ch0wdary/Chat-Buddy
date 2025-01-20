import React, { useState } from "react";
import axios from "axios";

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);

    const handleSave = () => {
        if (!email || !name) {
            alert("Please enter both name and email.");
            return;
        }
        setIsRegistered(true);
        alert("Profile saved! You can now start chatting.");
    };

    const handleSend = async () => {
        if (!isRegistered) {
            alert("Please save your profile first.");
            return;
        }

        if (input.trim()) {
            const userMessage = { sender: "user", text: input };
            setMessages([...messages, userMessage]);

            try {
                const response = await axios.post("https://chat-buddy-production.up.railway.app/", {
                    email,
                    name,
                    query: input,
                });

                const botMessage = { sender: "bot", text: response.data.reply };
                setMessages((prev) => [...prev, botMessage]);
            } catch (error) {
                const botMessage = { sender: "bot", text: "Error: Unable to get response." };
                setMessages((prev) => [...prev, botMessage]);
                console.error("Error with chat request:", error);
            }

            setInput("");
        }
    };

    return (
        <div
            style={{
                background: "linear-gradient(to bottom right,rgb(85, 182, 243),rgb(49, 32, 135))",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    width: "600px",
                    padding: "20px",
                    textAlign: "center",
                }}
            >
                {!isRegistered ? (
                    <>
                        <h1 style={{ fontSize: "24px", marginBottom: "20px", fontWeight: "bold" }}>Welcome</h1>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: "90%",
                                padding: "10px",
                                marginBottom: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                            }}
                        />
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: "90%",
                                padding: "10px",
                                marginBottom: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                            }}
                        />
                        <button
                            onClick={handleSave}
                            style={{
                                width: "50%",
                                padding: "10px",
                                backgroundColor: "#007BFF",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                        >
                            Save
                        </button>
                    </>
                ) : (
                    <>
                        <h2 style={{ fontSize: "20px", marginBottom: "15px", fontWeight: "bold" }}>Chat Bot</h2>
                        <div
                            style={{
                                border: "1px solid #ccc",
                                padding: "10px",
                                height: "400px",
                                overflowY: "scroll",
                                marginBottom: "10px",
                                borderRadius: "5px",
                                textAlign: "left",
                                width: "95%",
                            }}
                        >
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    style={{
                                        margin: "10px 0",
                                        textAlign: msg.sender === "user" ? "right" : "left",
                                    }}
                                >
                                    <strong>{msg.sender}:</strong> {msg.text}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: "10px",
                                    marginRight: "10px",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                }}
                                placeholder="Type your message"
                            />
                            <button
                                onClick={handleSend}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#007BFF",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                }}
                            >
                                Send
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
