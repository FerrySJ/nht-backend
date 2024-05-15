//Reference
const express = require("express");
const router = express.Router();
const constance = require("../constance/constance");
const upload_table = require("../model/model_nhtMBR");

//เป็น sub set ย่อยของ API
//เช่น http:localhost:2005/api/getresult

router.get("/getresult", (req, res) => {
  res.json({ result: constance.result_ok });
});
router.post("/upload_stock", async (req, res) => { 
  try {
    let result = await upload_table.sequelize.query(
      ` INSERT INTO [data_ball].[dbo].[ball_stock] ([stock_date],[time],[ac],[item_no],[item_name],[spec],[maker],[vender],[unit_price]
        ,[cur],[pur_unit],[pur_lt],[safety_stock],[pr_balance],[po_balance],[allocate],[on_hand],[stock_unit])
        VALUES ('${req.body.stock_date}','${req.body.time}','${req.body.ac}','${req.body.item_no}','${req.body.item_name}','${req.body.spec}'
      ,'${req.body.maker}','${req.body.vender}','${req.body.unit_price}','${req.body.cur}','${req.body.pur_unit}','${req.body.pur_lt}'
      ,'${req.body.safety_stock}','${req.body.pr_balance}','${req.body.po_balance}','${req.body.allocate}','${req.body.on_hand}','${req.body.stock_unit}')`
    );
    console.log(result);
    res.json({ result: result[0], api_result: constance.result_ok });
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
  }
});
router.post("/check_date_stock", async (req, res) => { 
  try {
    let result = await upload_table.sequelize.query(
      ` SELECT TOP 1 *, convert(varchar, time, 24) as convert_time
      FROM [data_ball].[dbo].[ball_stock] 
      ORDER BY stock_date DESC `
    );
    let result_date = await upload_table.sequelize.query(
      ` SELECT TOP 1 *, convert(varchar, time, 24) as convert_time
      FROM [data_ball].[dbo].[ball_stock] 
      WHERE stock_date = '${req.body.stock_date}'
      ORDER BY stock_date DESC `
    );
    res.json({ result: result[0],result_date:result_date[0], api_result: constance.result_ok });
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
  }
});

router.post("/delete_date_stock", async (req, res) => { 
  try {
    let result = await upload_table.sequelize.query(
      `DELETE FROM [data_ball].[dbo].[ball_stock] 
      WHERE stock_date = '${req.body.stock_date}'`
    );
    console.log(result[1]);
    res.json({ result: result[1], api_result: constance.result_ok });
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
  }
});
module.exports = router;
 