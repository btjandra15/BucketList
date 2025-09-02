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

app.use("/api/bucketlist_items", bucketListItemRoute)