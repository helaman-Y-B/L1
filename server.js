const express = require("express");

const app = express();

// Get the main page
app.get("/", (req, res) => {
    res.send("Hello, world!")
})

// start server
const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})