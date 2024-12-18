import app from "./app";

const { PORT = 8003 } = process.env;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
