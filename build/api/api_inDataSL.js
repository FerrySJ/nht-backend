const express = require("express");
const router = express.Router();
const constance = require("../constance/constance");
const moment = require("moment");
// import model
const MBR_table = require("../model/model_natMBR");

router.get("/getresult", (req, res) => {
  res.json({ result: constance.result_ok });
});

router.post("/get_data_sl", async (req, res) => {
  let day = moment().format("YYYY-MM-DD");
  try {
    let result = await MBR_table.sequelize.query(
      `SELECT [registered_at],[occurred],[mc_no],[process],[model],[lot],[d_str1],[d_str2],[rssi],[shift],[double_part]
      ,[basket_cnt],[ng_input],[end_cond],[shift_a_ok],[shift_b_ok],[shift_c_ok],[shift_a_ng],[shift_b_ng],[shift_c_ng]
      ,[total_cnt],[total_utilize],[master]
      FROM [data_machine_sl].[dbo].[DATA_PRODUCTION_SL]
      where FORMAT(registered_at, 'yyyy-MM-dd') = '${day}' -- FORMAT(GETDATE(), 'yyyy-MM-dd')
      order by registered_at asc`
    );
    res.json({
      result: result[0],
      api_result: constance.result_ok,
    });
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
  }
});

module.exports = router;
