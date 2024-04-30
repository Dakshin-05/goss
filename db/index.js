import pg from 'pg'
const { Client } = pg

export const db = new Client({
    host: 'localhost',
    port: 5432,
    database: 'goss',
    user: 'postgres',
    password: 'root',
})

export async function dbConnect() {
    try {
        await db.connect()
        console.log("db connect - success")
    } catch (error) {
        console.log(error);
    };
    
}



