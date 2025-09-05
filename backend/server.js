import express from "express";
import dotenv from 'dotenv';
import {sql} from './config/db.js'
import bucketListItemRoute from "./routes/bucketListItemRoute.js"

dotenv.config();

const PORT = process.env.PORT
const app = express();

app.use(express.json());

const initDB = async () => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS bucketlist_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,            
        collaborator_user_id UUID NOT NULL,              
        name TEXT NOT NULL,
        collaborator_name TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
        clerk_user_id TEXT UNIQUE NOT NULL,             
        username TEXT,           
        uncompleted_count INT DEFAULT 0,                           
        completed_count INT DEFAULT 0,                  
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Error initializing DB:", error);
    process.exit(1);
  }
};

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running")
    });
})

app.post("/api/users", async(req, res) => {
  try {
    const {clerk_user_id, name} = req.body;
    let existingUser = await sql`SELECT * FROM users WHERE clerk_user_id = ${clerk_user_id}`

    if(existingUser.length === 0){
      const newUser = await sql`
        INSERT INTO users (clerk_user_id, name)
        VALUES (${clerk_user_id}, ${name})
        RETURNING *
      `

      return res.status(201).json(newUser[0]);
    }

    res.status(200).json(existingUser[0]);
  } catch (error) {
    console.error("Error creating user: ", error);
    res.status(500).json({message: "Internal Server Error"})
  }
})

app.use("/api/bucketlist_items", bucketListItemRoute)