const express = require("express");
const app = express();

//get user
app.get("/user", (req, res)=>{
    res.send("get user");
})

// post user
app.post("/user", (req, res)=>{
    res.send("post user");
})

// delete user
app.delete("/user", (req, res)=>{
    res.send("delete user");
})

// put user
app.put("/user", (req, res)=>{
    res.send("put user");
})




app.listen(3000, () => {
  console.log("server is running on port 3000");
});
