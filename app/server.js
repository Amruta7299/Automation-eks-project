const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send({
    message: 'Hello from the Automated DevOps App!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Example route demonstrating secrets handling
app.get('/secret', (req, res) => {
  const secretKey = process.env.MY_APP_SECRET || 'No secret provided';
  // Note: Never log or expose secrets in a real app
  res.send(`Secret is loaded successfully: ${secretKey ? 'YES' : 'NO'}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
