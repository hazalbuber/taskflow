const app = require("./app");

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`TaskFlow API is running at http://localhost:${PORT}`);
});
