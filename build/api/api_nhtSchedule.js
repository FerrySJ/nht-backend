const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const constance = require("../constance/constance");
const moment = require("moment");
// import model
const MBR_table = require("../model/model_natMBR");

// master machine
const schedule = require("node-schedule");
// *    *    *    *    *    *
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └──***************──────── second (0 - 59, OPTIONAL)
schedule.scheduleJob("0 * 27 * *", async function (req, res) {
  console.log("lllllllllllllllllllllll");
  try {
    let data = await MBR_table.sequelize.query(
      ` WITH CTE AS (
        SELECT
          [registered_at],
          [mc_no],
          [process],
          format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') AS mfg_date,
          [mc_no] AS mc_no_2,
          (CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
          CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
          CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
          CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) AS model,
          (CHAR(CONVERT(INT, [Spec_1])) + CHAR(CONVERT(INT, [Spec_2])) + CHAR(CONVERT(INT, [Spec_3])) +
          CHAR(CONVERT(INT, [Spec_4])) + CHAR(CONVERT(INT, [Spec_5])) + CHAR(CONVERT(INT, [Spec_6])) +
          CHAR(CONVERT(INT, [Spec_7])) + CHAR(CONVERT(INT, [Spec_8])) + CHAR(CONVERT(INT, [Spec_9])) +
          CHAR(CONVERT(INT, [Spec_10])) + CHAR(CONVERT(INT, [Spec_11])) + CHAR(CONVERT(INT, [Spec_12]))) AS spec,
          CAST([Time_Hr] AS varchar) + ':' + CAST([Time_Min] AS varchar) AS time_got,
          ROW_NUMBER() OVER (PARTITION BY [mc_no], [process] ORDER BY [registered_at] DESC) AS rn
        FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
        WHERE format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') = '${moment().format("YYYY-MM-DD")}'
      )
      SELECT *
      FROM CTE
      WHERE rn = 1
        `
    );
    let result_get = data[0]
    console.log("=================");
    console.log(result_get);
    for (const item of result_get) {
    let a =   await MBR_table.sequelize.query(
  //     `
  // INSERT INTO [dbo].[data_model_spec] ([registered_at],[mfg_date],[mc_no],[model],[spec],[time_got])
  // VALUES (${result_get},'2023-11-23','MBRMD05','6001X3DDtest','spec','12:00')
  //       `
          `
            INSERT INTO [master_data].[dbo].[data_model_spec] ([registered_at],[mfg_date],[mc_no],[model],[spec],[time_got])
            VALUES (GETDATE(),'${item.mfg_date}','${item.mc_no}','${item.model}','Tets Local','${item.time_got}');
          `
    );
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    console.log(a);
      }
    // return res.json(
      return {
      mfgdate: moment().format("YYYY-MM-DD"),
      time: moment().format("HH:mm:ss"),
      api_result: constance.result_ok,
     }
    // );
  } catch (error) {
    console.log("=======error =============", error);
    console.log(error);
    //return //res.json(
      return { error, api_result: constance.result_nok }
     // );
  }
});

module.exports = router;
