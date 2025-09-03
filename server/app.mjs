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

app.get("/assignments", async(req,res)=>{
  try{
    const result= await connectionPool.query(
      `SELECT * FROM assignments`
    )
  return res.status(200).json({"message": "showdata",
     data: result.rows,
  })
  }catch(e){
    return res.status(500).json( { "message": "Server could not read assignment because database connection" })
  }
})






app.get("/assignments/:assignmentId", async (req,res)=>{
  
  const assignid = req.params.assignmentId
  
      if(!assignid){
      return res.status(404).json({"message": "Server could not find a requested assignment"})
    }



  try{
    const result = await connectionPool.query(
      `SELECT * FROM assignments where assignment_id = $1`,[assignid]
    )
    return res.status(200).json({data: result.rows})
    
  }catch(e){
    return res.status(500).json( { "message": "Server could not read assignment because database connection" })
  }

})







app.delete("/assignments/:assignmentId", async (req,res)=>{
  try{
    const asignid= req.params.assignmentId
    if(!asignid){
      res.status(404).json({"message": "Server could not find a requested assignment to delete"})
    }
    

    const result = await connectionPool.query(
      `DELETE  FROM assignments where assignment_id= $1`,
      [asignid])
    res.status(200).json( { "message": "Deleted assignment sucessfully" })
    
  }catch(e){
    return res.status(500).json( { "message": "Server could not read assignment because database connection" })
  }
})





app.put("/assignments/:assignmentId", async (req,res)=>{
  try{
    const asignid= req.params.assignmentId
    const update = {...req.body, updated_at: new Date()
    }


    if(!asignid){
     return res.status(404).json({"message": "Server could not find a requested assignment to delete"})
    }

    const result = await connectionPool.query(
      `UPDATE assignments
      SET title=$1,
          content=$2,
          category=$3,
          updated_at=$4
      WHERE assignment_ID=$5
      `,[
        update.title,
        update.content,
        update.category,
        update.updated_at,
        asignid
      ]
    )

    return res.status(200).json({"message": "Updated assignment sucessfully"})

  }catch(e){
    return res.status(500).json( { "message": "Server could not read assignment because database connection" })
  }
})