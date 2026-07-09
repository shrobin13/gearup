import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";

const PORT = env.PORT;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to database successfully!");
    app.listen(PORT, () => {
      console.log('App is listening on port: ', PORT);
    })
  } catch (error) {
    console.error("Error starting the server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
