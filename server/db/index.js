import pg from 'pg'
import { configDotenv } from 'dotenv'

configDotenv();

export const db = new pg.Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
})

export async function dbConnect() {
    try {
        await db.connect()
        console.log("db connect - success")
    } catch (error) {
        console.log(error);
    };
    
}



