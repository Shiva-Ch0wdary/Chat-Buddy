# ChatBuddy - A Smart Chatbot Application

ChatBuddy is an intelligent chatbot application designed to assist users with predefined queries as well as dynamic responses powered by OpenAI API. It includes a React-based frontend and a backend powered by SQLite/MySQL/PostgreSQL for efficient query handling and data storage.

---

## Features
1. **User Interaction**
   - Initial form to collect the user's name and email.
   - Seamless transition to the chat interface.

2. **Predefined Responses**
   - Queries stored in a database for instant replies. Example queries:
     - **hello** → "Hi there! How can I assist you?"
     - **how are you** → "I am just a bot, but I am functioning as expected!"
     - **summarize our conversation** → Summarizes the entire chat history.

3. **Dynamic Responses**
   - Uses OpenAI API to generate responses for queries not found in the database.

4. **Chat History**
   - Stores all user conversations.
   - Allows users to retrieve summaries of their interactions.

---

## Technologies Used
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** SQLite/MySQL/PostgreSQL
- **API:** OpenAI API for dynamic responses

---

## How to Run the Project
1. Clone the repository:
   ```bash
   git clone [https://github.com/Shiva-Ch0wdary/Chat-Buddy](https://github.com/Shiva-Ch0wdary/Chat-Buddy)
   
2. Navigate to the project directory:
   ```bash
   cd chatbuddy
3.  **Set up the databasey**
   - Create a database using SQLite/MySQL/PostgreSQL.
     
4. Set up the .env file
   ```bash
   REACT_APP_OPENAI_API_KEY=<Your_OpenAI_API_Key>
   DB_HOST=<Database_Host>
   DB_USER=<Database_Username>
   DB_PASS=<Database_Password>
   DB_NAME=<Database_Name>

6. Start the development server:
   ```bash
   npm start
7. Start the Backend server
   ```bash
   node server.js

---

***License***
This project is licensed under the MIT License. See the LICENSE file for details.

---

***Contact***
For any queries or issues, feel free to contact:
Name: Shiva Rama Krishna mandapudi
Email: shivachowdary753@gmail.com
Website: [https://shiva-chowdary.vercel.app/](https://shiva-chowdary.vercel.app/)


   
