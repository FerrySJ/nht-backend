const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
// const router = require("./api/api_test1");

app.use(bodyParser.json()); //ทำให้ API เห็น body ได้
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(express.static(path.join(__dirname, "./files")));
app.use(cors());
const router = require("./api/api_test1");
app.use("/", router);
// app.use("/user", require("./api/api_user"));
app.use("/api", require("./api/api_test1")); 
app.use("/api/api_nhtMBR", require("./api/api_nhtMBR")); 
app.use("/api/api_nhtMaster", require("./api/api_nhtmaster")); 
app.use("/api/api_nhtGrinding", require("./api/api_nhtGrinding")); 
app.use("/api/api_nhtMMS", require("./api/api_nhtMMS")); 
app.use("/api/api_nhtSchedule", require("./api/api_nhtSchedule")); 
app.use("/api/api_upload_stock", require("./api/api_upload_stock")); 
app.use("/api/api_autopo", require("./api/api_autopo")); 
//================================================
app.listen(2005, () => { // run server
  // XX:8001
  console.log("DX_Backend is running...");
  
});