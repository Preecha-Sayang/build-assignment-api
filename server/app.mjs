import express from "express";
import connectionPool from "./utils/db.mjs";


const app = express();
const port = 4001;

app.get("/test", (req, res) => {
  try{ return res.json("Server API is working 🚀");
  }catch(e){
    res.json("Server API not connect")
  }
 
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

app.use(express.json())
app.post("/assignments", async (req, res)=>{
  try{
     const newassign = {
      ...req.body,
      created_at: new Date(),
      updated_at: new Date(),
     }

    if(!newassign.title|| !newassign.content|| !newassign.category){
       return res.status(400).json(   { "message": "Server could not create assignment because there are missing data from client" })
    }


    const result = await connectionPool.query(
      `INSERT INTO assignments (title, content, category,  created_at, updated_at)
       Values( $1 ,$2 ,$3, $4, $5) `,[newassign.title, newassign.content, newassign.category, newassign.created_at, newassign.updated_at]
    )
    return res.status(201).json(  { "message": "Created assignment successfully" })
  }catch(e){
    return res.status(500).json({
      message: "Server could not create assignment because database connection",
    })
  }

  
})

