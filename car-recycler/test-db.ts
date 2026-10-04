import { config } from "dotenv";
import pg from "pg";

config({
  path: ".env.local",
});

const url = new URL(process.env.DATABASE_URL!);

console.log("Host:", url.hostname);
console.log("User:", url.username);
console.log("Database:", url.pathname);
console.log("URL password length:", url.password.length);

const decodedPassword = decodeURIComponent(url.password);

console.log("Decoded password length:", decodedPassword.length);
console.log("Decoded password contains %:", decodedPassword.includes("%"));

async function testConnection() {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    console.log("✅ Database connection successful!");

    await client.end();
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error);
  }
}

testConnection();