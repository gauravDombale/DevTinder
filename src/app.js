const express = require("express");
const app = express();

//* get user
app.get("/user", (req, res)=>{

    //! for this case the the route was /user and we were putting userID and userName as a query parameter in postman something like this http://localhost:3000/user?userID=123&userName=John

    console.log(req.query);
    const userID = req.query.userID;
    const userName = req.query.userName;
    console.log(userID, userName);


    //!req params
    // console.log(req.params);
    // const userID = req.params.userID;
    // console.log(userID);

    
    res.send("get user");
})

//* this regex, will work for anything that has a
app.get(/a/, (req, res)=>{
    res.send("regex example");
})

//* post user
app.post("/user", (req, res)=>{
    res.send("post user");
})

//* delete user
app.delete("/user", (req, res)=>{
    res.send("delete user");
})

//* put user
app.put("/user", (req, res)=>{
    res.send("put user");
})


app.listen(3000, () => {
  console.log("server is running on port 3000");
});
