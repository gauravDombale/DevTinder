const express = require("express");
const app = express();

//! This function is known as request handler, here /test is the api endpoint or route
app.use("/test",(req, res) => {
  res.send("test");
});

app.use("/test2",(req, res) => {
  res.send("test2");
});

app.use((req, res) => {
    res.send("hello from server 3000");
  });
  

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
