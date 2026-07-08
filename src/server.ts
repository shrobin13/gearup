import app from "./app.js";

const PORT = 5000;

async function main() {
  try {
    app.listen(PORT, () => {
      console.log('App is listening on port: ', PORT);
    })
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
}

main();
