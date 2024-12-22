import app from "./app";

const { PORT = 8006 } = process.env;

const startServer = async () => {
  try {
    app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
  } catch (error) {
    process.exit(1);
  }
};

startServer();
