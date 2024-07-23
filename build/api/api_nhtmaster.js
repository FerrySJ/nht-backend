const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const constance = require("../constance/constance");
const moment = require("moment");
// import model
const MBR_table = require("../model/model_natMBR");

// master machine
router.get("/master_MC", async (req, res) => {
  try {
    let result = await MBR_table.sequelize.query(`
SELECT distinct [mc_no] as [machine_no]
  FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
 order by mc_no asc
      `);

    res.json({
      result: result,
      api_result: constance.OK,
    });
  } catch (error) {
    res.json({
      result: error,
      api_result: constance.NOK,
    });
  }
});
router.get("/master_process", async (req, res) => {
  try {
    let result = await MBR_table.sequelize.query(`
      SELECT distinct([process])
      FROM [master_data].[dbo].[master_part_assembly]
      order by process asc
        `);
    console.log(result);
    res.json({
      result: result[0],
    });
  } catch (error) {
    res.json({
      result: error,
      api_result: constance.result_nok,
    });
  }
});

router.post("/master_size", async (req, res) => {
  try {
    let result_size = await MBR_table.sequelize.query(`
      SELECT distinct([size])
      FROM [master_data].[dbo].[master_part_assembly]
      where [process] = '${req.body.process}'
        `);
    console.log("master_size");
    console.log(result_size);
    res.json({
      result_size: result_size[0],
      api_result: constance.result_ok,
    });
  } catch (error) {
    res.json({
      result: error,
      api_result: constance.result_nok,
    });
  }
});
router.post("/master_type", async (req, res) => {
  try {
    let result_type = await MBR_table.sequelize.query(
      `SELECT distinct([type])
        FROM [master_data].[dbo].[master_part_assembly]
        WHERE process = '${req.body.process}'
        ORDER BY type desc`
    );
    console.log("master_type");
    console.log(result_type);
    res.json({
      result_type: result_type[0],
      api_result: constance.result_ok,
    });
  } catch (error) {
    res.json({
      result: error,
      api_result: constance.result_nok,
    });
  }
});

router.get("/master_year", async (req, res) => {
  try {
    let result = await MBR_table.sequelize.query(
      `SELECT distinct(FORMAT([mfg_date], 'yyyy')) as year
      FROM [master_data].[dbo].[app_counter_accumoutput_new]
        ORDER BY FORMAT([mfg_date], 'yyyy') asc`
    );
    console.log("master_year");
    console.log(result);
    res.json({
      result: result[0],
      api_result: constance.result_ok,
    });
  } catch (error) {
    res.json({
      result: error,
      api_result: constance.result_nok,
    });
  }
});

// Auto noise
// master machine
router.get("/master_MC_AutoNoise", async (req, res) => {
  try {
    let result = await MBR_table.sequelize.query(`
    SELECT distinct UPPER([mc_no]) as [machine_no]
    FROM [data_machine_an].[dbo].[DATA_PRODUCTION_AN]
    order by UPPER([mc_no])  asc
      `);

    res.json({
      result: result,
      api_result: constance.OK,
    });
  } catch (error) {
    res.json({
      result: error,
      api_result: constance.NOK,
    });
  }
});
module.exports = router;
