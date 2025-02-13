const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ArtfulWay API!' });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});