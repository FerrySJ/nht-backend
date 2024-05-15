const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const constance = require("../constance/constance");
const moment = require("moment");

// import model
const turning_table = require("../model/model_natTurning");
const TurningImage_table = require("../model/model_natQC_Image");

function getDatesInRange(startDate, endDate) {
  const date = new Date(startDate.getTime());
  const dates = [];
  while (date <= endDate) {
    dates.push(formatDate(new Date(date)));
    date.setDate(date.getDate() + 1);
  }
  return dates;
}
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
}
//TB-01 OUTTER (1R:D32)
router.get("/turning_nat01/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let resultdata = await turning_table.sequelize.query(`SELECT [registered_at]
      ,[mfg_date]
      ,[pin]
      ,[accum_output]
      ,[node_no_id]
  FROM [counter].[dbo].[app_counter_accumoutput]
  where [node_no_id] = 'TB01' and [pin]='D32'and [mfg_date] ='${start_date}'
        `);
    console.log(resultdata);
    arrayData = resultdata[0];
    let seriesOutput = [];

    for (let index = 0; index < arrayData.length; index++) {
      const item = arrayData[index];
      await seriesOutput.push(item.accum_output);
    }

    let seriesOutput_new = {
      name: "Output",
      type: "column",
      data: seriesOutput,
    };

    let resultCT_target = await turning_table.sequelize
      .query(`SELECT [registered_at]
      ,[mfg_date]
      ,[pin]
      ,[accum_output]
      ,[node_no_id]
  FROM [counter].[dbo].[app_counter_accumoutput]
  where [node_no_id] = 'TB01' and [pin]='D508'and [mfg_date] ='${start_date}'
        `);
    arrayDataTarget = resultCT_target[0];
    let indexTime = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24,
    ];
    let seriesCT_Target = [];
    // UTL=80%
    for (let index = 0; index < arrayDataTarget.length; index++) {
      const item = arrayDataTarget[index];
      await seriesCT_Target.push(
        (
          (3600 / (item.accum_output / 100)) *
          0.8 *
          indexTime[index] *
          2
        ).toFixed(0)
      );
    }

    let seriesTarget_new = {
      name: "Target",
      type: "line",
      data: seriesCT_Target,
    };
    let seriesNew = [seriesOutput_new, seriesTarget_new];
    console.log(seriesOutput_new);
    res.json({
      resultOutput_turn: seriesNew,
      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});
//TB-02 INNER (2R:D350)
router.get("/turning_nat02/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let resultdata = await turning_table.sequelize.query(`SELECT [registered_at]
      ,[mfg_date]
      ,[pin]
      ,[accum_output]
      ,[node_no_id]
  FROM [counter].[dbo].[app_counter_accumoutput]
  where [node_no_id] = 'TB02' and [pin]='D350'and [mfg_date] ='${start_date}'
        `);
    console.log(resultdata);
    arrayData = resultdata[0];
    let seriesOutput = [];

    for (let index = 0; index < arrayData.length; index++) {
      const item = arrayData[index];
      await seriesOutput.push(item.accum_output);
    }

    let seriesOutput_new = {
      name: "Output",
      type: "column",
      data: seriesOutput,
    };

    let resultCT_target = await turning_table.sequelize
      .query(`SELECT [registered_at]
      ,[mfg_date]
      ,[pin]
      ,[accum_output]
      ,[node_no_id]
  FROM [counter].[dbo].[app_counter_accumoutput]
  where [node_no_id] = 'TB02' and [pin]='D508'and [mfg_date] ='${start_date}'
        `);
    arrayDataTarget = resultCT_target[0];
    let indexTime = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24,
    ];
    let seriesCT_Target = [];
    // UTL=80%
    for (let index = 0; index < arrayDataTarget.length; index++) {
      const item = arrayDataTarget[index];
      await seriesCT_Target.push(
        ((3600 / (item.accum_output / 100)) * 0.8 * indexTime[index]).toFixed(0)
      );
    }

    let seriesTarget_new = {
      name: "Target",
      type: "line",
      data: seriesCT_Target,
    };
    let seriesNew = [seriesOutput_new, seriesTarget_new];
    console.log(seriesOutput_new);
    res.json({
      resultOutput_turn: seriesNew,
      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});
//TB-03 INNER (2R:D350)
router.get("/turning_nat03/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let resultdata = await turning_table.sequelize.query(`SELECT [registered_at]
      ,[mfg_date]
      ,[pin]
      ,[accum_output]
      ,[node_no_id]
  FROM [counter].[dbo].[app_counter_accumoutput]
  where [node_no_id] = 'TB03' and [pin]='D350'and [mfg_date] ='${start_date}'
        `);
    console.log(resultdata);
    arrayData = resultdata[0];
    let seriesOutput = [];

    for (let index = 0; index < arrayData.length; index++) {
      const item = arrayData[index];
      await seriesOutput.push(item.accum_output);
    }

    let seriesOutput_new = {
      name: "Output",
      type: "column",
      data: seriesOutput,
    };

    let resultCT_target = await turning_table.sequelize
      .query(`SELECT [registered_at]
    ,[mfg_date]
    ,[pin]
    ,[accum_output]
    ,[node_no_id]
FROM [counter].[dbo].[app_counter_accumoutput]
where [node_no_id] = 'TB03' and [pin]='D508'and [mfg_date] ='${start_date}'
      `);
    arrayDataTarget = resultCT_target[0];
    let indexTime = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24,
    ];
    let seriesCT_Target = [];
    // UTL=80%
    for (let index = 0; index < arrayDataTarget.length; index++) {
      const item = arrayDataTarget[index];
      await seriesCT_Target.push(
        ((3600 / (item.accum_output / 100)) * 0.8 * indexTime[index]).toFixed(0)
      );
    }

    let seriesTarget_new = {
      name: "Target",
      type: "line",
      data: seriesCT_Target,
    };

    let seriesNew = [seriesOutput_new, seriesTarget_new];
    console.log(seriesOutput_new);
    res.json({
      resultOutput_turn: seriesNew,
      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

//TB-04 OUTTER
router.get("/turning_nat04/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let resultdata = await turning_table.sequelize.query(`SELECT [registered_at]
      ,[mfg_date]
      ,[pin]
      ,[accum_output]
      ,[node_no_id]
  FROM [counter].[dbo].[app_counter_accumoutput]
  where [node_no_id] = 'TB04' and [pin]='D32'and [mfg_date] ='${start_date}'
        `);
    console.log(resultdata);
    arrayData = resultdata[0];
    let seriesOutput = [];

    for (let index = 0; index < arrayData.length; index++) {
      const item = arrayData[index];
      await seriesOutput.push(item.accum_output);
    }

    let seriesOutput_new = {
      name: "Output",
      type: "column",
      data: seriesOutput,
    };

    let resultCT_target = await turning_table.sequelize
      .query(`SELECT [registered_at]
    ,[mfg_date]
    ,[pin]
    ,[accum_output]
    ,[node_no_id]
FROM [counter].[dbo].[app_counter_accumoutput]
where [node_no_id] = 'TB04' and [pin]='D508'and [mfg_date] ='${start_date}'
      `);
    arrayDataTarget = resultCT_target[0];
    let indexTime = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24,
    ];
    let seriesCT_Target = [];
    //   UTL=80%
    for (let index = 0; index < arrayDataTarget.length; index++) {
      const item = arrayDataTarget[index];
      await seriesCT_Target.push(
        (
          (3600 / (item.accum_output / 100)) *
          0.8 *
          indexTime[index] *
          2
        ).toFixed(0)
      );
    }

    let seriesTarget_new = {
      name: "Target",
      type: "line",
      data: seriesCT_Target,
    };
    let seriesNew = [seriesOutput_new, seriesTarget_new];
    console.log(seriesOutput_new);
    res.json({
      resultOutput_turn: seriesNew,
      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});
// //TB-03 query
// router.get("/turning_nat03/:start_date", async (req, res) => {
//   try {
//     let { start_date } = req.params;
//     let resultdata = await turning_table.sequelize.query(`SELECT [registered_at]
//       ,[mfg_date]
//       ,[pin]
//       ,[accum_output]
//       ,[node_no_id]
//   FROM [counter].[dbo].[app_counter_accumoutput]
//   where [node_no_id] = 'TB03' and [pin]='D350'and [mfg_date] ='${start_date}'
//         `);
//     console.log(resultdata);
//     arrayData = resultdata[0];
//     let seriesOutput = [];

//     for (let index = 0; index < arrayData.length; index++) {
//       const item = arrayData[index];
//       await seriesOutput.push(item.accum_output);
//     }

//     let seriesOutput_new = {
//       name: "Output",
//       type: "column",
//       data: seriesOutput,
//     };

//     let seriesTarget_new = {
//       name: "Target",
//       type: "line",
//       data: [
//         2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000, 22000,
//         24000, 26000, 28000, 30000, 32000, 34000, 36000, 38000, 40000, 42000,
//         44000, 46000, 48000,
//       ],
//     };
//     let seriesNew = [seriesOutput_new, seriesTarget_new];
//     console.log(seriesOutput_new);
//     res.json({
//       resultOutput_turn: seriesNew,
//       // resultTarget_turn: seriesTarget_new,
//     });
//   } catch (error) {
//     res.json({
//       error,
//       api_result: constance.NOK,
//     });
//   }
// });
//TB-05 query
router.get("/turning_nat05/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let resultdata = await turning_table.sequelize.query(`SELECT [registered_at]
      ,[mfg_date]
      ,[pin]
      ,[accum_output]
      ,[node_no_id]
  FROM [counter].[dbo].[app_counter_accumoutput]
  where [node_no_id] = 'TB05' and [pin]='D350'and [mfg_date] ='${start_date}'
        `);
    console.log(resultdata);
    arrayData = resultdata[0];
    let seriesOutput = [];

    for (let index = 0; index < arrayData.length; index++) {
      const item = arrayData[index];
      await seriesOutput.push(item.accum_output);
    }

    let seriesOutput_new = {
      name: "Output",
      type: "column",
      data: seriesOutput,
    };

    let seriesTarget_new = {
      name: "Target",
      type: "line",
      data: [
        2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000, 22000,
        24000, 26000, 28000, 30000, 32000, 34000, 36000, 38000, 40000, 42000,
        44000, 46000, 48000,
      ],
    };
    let seriesNew = [seriesOutput_new, seriesTarget_new];
    console.log(seriesOutput_new);
    res.json({
      resultOutput_turn: seriesNew,
      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});
//TB-06 OUTTER
router.get("/turning_nat06/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let resultdata = await turning_table.sequelize.query(`SELECT [registered_at]
      ,[mfg_date]
      ,[pin]
      ,[accum_output]
      ,[node_no_id]
  FROM [counter].[dbo].[app_counter_accumoutput]
  where [node_no_id] = 'TB06' and [pin]='D32'and [mfg_date] ='${start_date}'
        `);
    console.log(resultdata);
    arrayData = resultdata[0];
    let seriesOutput = [];

    for (let index = 0; index < arrayData.length; index++) {
      const item = arrayData[index];
      await seriesOutput.push(item.accum_output);
    }

    let seriesOutput_new = {
      name: "Output",
      type: "column",
      data: seriesOutput,
    };

    let resultCT_target = await turning_table.sequelize
      .query(`SELECT [registered_at]
    ,[mfg_date]
    ,[pin]
    ,[accum_output]
    ,[node_no_id]
FROM [counter].[dbo].[app_counter_accumoutput]
where [node_no_id] = 'TB06' and [pin]='D508'and [mfg_date] ='${start_date}'
      `);
    arrayDataTarget = resultCT_target[0];
    let indexTime = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24,
    ];
    let seriesCT_Target = [];
    // UTL=80%
    for (let index = 0; index < arrayDataTarget.length; index++) {
      const item = arrayDataTarget[index];
      await seriesCT_Target.push(
        (
          (3600 / (item.accum_output / 100)) *
          0.8 *
          indexTime[index] *
          2
        ).toFixed(0)
      );
    }
    let seriesTarget_new = {
      name: "Target",
      type: "line",
      data: seriesCT_Target,
    };
    let seriesNew = [seriesOutput_new, seriesTarget_new];
    console.log(seriesOutput_new);
    res.json({
      resultOutput_turn: seriesNew,
      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

//TB-07 OUTTER
router.get("/turning_nat07/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let resultdata = await turning_table.sequelize.query(`SELECT [registered_at]
      ,[mfg_date]
      ,[pin]
      ,[accum_output]
      ,[node_no_id]
  FROM [counter].[dbo].[app_counter_accumoutput]
  where [node_no_id] = 'TB07' and [pin]='D32'and [mfg_date] ='${start_date}'
        `);
    console.log(resultdata);
    arrayData = resultdata[0];
    let seriesOutput = [];

    for (let index = 0; index < arrayData.length; index++) {
      const item = arrayData[index];
      await seriesOutput.push(item.accum_output);
    }

    let seriesOutput_new = {
      name: "Output",
      type: "column",
      data: seriesOutput,
    };

    let seriesTarget_new = {
      name: "Target",
      type: "line",
      data: [
        2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000, 22000,
        24000, 26000, 28000, 30000, 32000, 34000, 36000, 38000, 40000, 42000,
        44000, 46000, 48000,
      ],
    };
    let seriesNew = [seriesOutput_new, seriesTarget_new];
    console.log(seriesOutput_new);
    res.json({
      resultOutput_turn: seriesNew,
      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

//TB-08 query
router.get("/turning_nat08/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let resultdata = await turning_table.sequelize.query(`SELECT [registered_at]
      ,[mfg_date]
      ,[pin]
      ,[accum_output]
      ,[node_no_id]
  FROM [counter].[dbo].[app_counter_accumoutput]
  where [node_no_id] = 'TB08' and [pin]='D32'and [mfg_date] ='${start_date}'
        `);
    console.log(resultdata);
    arrayData = resultdata[0];
    let seriesOutput = [];

    for (let index = 0; index < arrayData.length; index++) {
      const item = arrayData[index];
      await seriesOutput.push(item.accum_output);
    }

    let seriesOutput_new = {
      name: "Output",
      type: "column",
      data: seriesOutput,
    };

    let seriesTarget_new = {
      name: "Target",
      type: "line",
      data: [
        2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000, 22000,
        24000, 26000, 28000, 30000, 32000, 34000, 36000, 38000, 40000, 42000,
        44000, 46000, 48000,
      ],
    };
    let seriesNew = [seriesOutput_new, seriesTarget_new];
    console.log(seriesOutput_new);
    res.json({
      resultOutput_turn: seriesNew,
      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});
//TB-09 query
router.get("/turning_nat09/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let resultdata = await turning_table.sequelize.query(`SELECT [registered_at]
      ,[mfg_date]
      ,[pin]
      ,[accum_output]
      ,[node_no_id]
  FROM [counter].[dbo].[app_counter_accumoutput]
  where [node_no_id] = 'TB09' and [pin]='D350'and [mfg_date] ='${start_date}'
        `);
    console.log(resultdata);
    arrayData = resultdata[0];
    let seriesOutput = [];

    for (let index = 0; index < arrayData.length; index++) {
      const item = arrayData[index];
      await seriesOutput.push(item.accum_output);
    }

    let seriesOutput_new = {
      name: "Output",
      type: "column",
      data: seriesOutput,
    };

    let seriesTarget_new = {
      name: "Target",
      type: "line",
      data: [
        2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000, 22000,
        24000, 26000, 28000, 30000, 32000, 34000, 36000, 38000, 40000, 42000,
        44000, 46000, 48000,
      ],
    };
    let seriesNew = [seriesOutput_new, seriesTarget_new];
    console.log(seriesOutput_new);
    res.json({
      resultOutput_turn: seriesNew,
      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

//TB-10 OUTTER
router.get("/turning_nat10/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let resultdata = await turning_table.sequelize.query(`SELECT [registered_at]
      ,[mfg_date]
      ,[pin]
      ,[accum_output]
      ,[node_no_id]
  FROM [counter].[dbo].[app_counter_accumoutput]
  where [node_no_id] = 'TB10' and [pin]='D32'and [mfg_date] ='${start_date}'
        `);
    console.log(resultdata);
    arrayData = resultdata[0];
    let seriesOutput = [];

    for (let index = 0; index < arrayData.length; index++) {
      const item = arrayData[index];
      await seriesOutput.push(item.accum_output);
    }

    let seriesOutput_new = {
      name: "Output",
      type: "column",
      data: seriesOutput,
    };

    let seriesTarget_new = {
      name: "Target",
      type: "line",
      data: [
        2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000, 22000,
        24000, 26000, 28000, 30000, 32000, 34000, 36000, 38000, 40000, 42000,
        44000, 46000, 48000,
      ],
    };
    let seriesNew = [seriesOutput_new, seriesTarget_new];
    console.log(seriesOutput_new);
    res.json({
      resultOutput_turn: seriesNew,
      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});
//TB-11 query
router.get("/turning_nat11/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let resultdata = await turning_table.sequelize.query(`SELECT [registered_at]
      ,[mfg_date]
      ,[pin]
      ,[accum_output]
      ,[node_no_id]
  FROM [counter].[dbo].[app_counter_accumoutput]
  where [node_no_id] = 'TB11' and [pin]='D32'and [mfg_date] ='${start_date}'
        `);
    console.log(resultdata);
    arrayData = resultdata[0];
    let seriesOutput = [];

    for (let index = 0; index < arrayData.length; index++) {
      const item = arrayData[index];
      await seriesOutput.push(item.accum_output);
    }

    let seriesOutput_new = {
      name: "Output",
      type: "column",
      data: seriesOutput,
    };

    let seriesTarget_new = {
      name: "Target",
      type: "line",
      data: [
        2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000, 22000,
        24000, 26000, 28000, 30000, 32000, 34000, 36000, 38000, 40000, 42000,
        44000, 46000, 48000,
      ],
    };
    let seriesNew = [seriesOutput_new, seriesTarget_new];
    console.log(seriesOutput_new);
    res.json({
      resultOutput_turn: seriesNew,
      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

//TB-12 query
router.get("/turning_nat12/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let resultdata = await turning_table.sequelize.query(`SELECT [registered_at]
      ,[mfg_date]
      ,[pin]
      ,[accum_output]
      ,[node_no_id]
  FROM [counter].[dbo].[app_counter_accumoutput]
  where [node_no_id] = 'TB12' and [pin]='D350'and [mfg_date] ='${start_date}'
        `);
    console.log(resultdata);
    arrayData = resultdata[0];
    let seriesOutput = [];

    for (let index = 0; index < arrayData.length; index++) {
      const item = arrayData[index];
      await seriesOutput.push(item.accum_output);
    }

    let seriesOutput_new = {
      name: "Output",
      type: "column",
      data: seriesOutput,
    };

    let seriesTarget_new = {
      name: "Target",
      type: "line",
      data: [
        2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000, 22000,
        24000, 26000, 28000, 30000, 32000, 34000, 36000, 38000, 40000, 42000,
        44000, 46000, 48000,
      ],
    };
    let seriesNew = [seriesOutput_new, seriesTarget_new];
    console.log(seriesNew);
    res.json({
      resultOutput_turn: seriesNew,
      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

//TB-14 INNER (2R:D350)
router.get("/turning_nat14/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let resultdata = await turning_table.sequelize.query(`SELECT [registered_at]
      ,[mfg_date]
      ,[pin]
      ,[accum_output]
      ,[node_no_id]
  FROM [counter].[dbo].[app_counter_accumoutput]
  where [node_no_id] = 'TB14' and [pin]='D350'and [mfg_date] ='${start_date}'
        `);
    console.log(resultdata);
    arrayData = resultdata[0];
    let seriesOutput = [];

    for (let index = 0; index < arrayData.length; index++) {
      const item = arrayData[index];
      await seriesOutput.push(item.accum_output);
    }

    let seriesOutput_new = {
      name: "Output",
      type: "column",
      data: seriesOutput,
    };

    let resultCT_target = await turning_table.sequelize
      .query(`SELECT [registered_at]
    ,[mfg_date]
    ,[pin]
    ,[accum_output]
    ,[node_no_id]
FROM [counter].[dbo].[app_counter_accumoutput]
where [node_no_id] = 'TB14' and [pin]='D508'and [mfg_date] ='${start_date}'
      `);
    arrayDataTarget = resultCT_target[0];
    let indexTime = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24,
    ];
    let seriesCT_Target = [];
    // UTL=80%
    for (let index = 0; index < arrayDataTarget.length; index++) {
      const item = arrayDataTarget[index];
      await seriesCT_Target.push(
        ((3600 / (item.accum_output / 100)) * 0.8 * indexTime[index]).toFixed(0)
      );
    }

    let seriesTarget_new = {
      name: "Target",
      type: "line",
      data: seriesCT_Target,
    };
    let seriesNew = [seriesOutput_new, seriesTarget_new];
    console.log(seriesOutput_new);
    res.json({
      resultOutput_turn: seriesNew,
      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});
//TB-15 INNER (2R:D350)
router.get("/turning_nat15/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let resultdata = await turning_table.sequelize.query(`SELECT [registered_at]
      ,[mfg_date]
      ,[pin]
      ,[accum_output]
      ,[node_no_id]
  FROM [counter].[dbo].[app_counter_accumoutput]
  where [node_no_id] = 'TB15' and [pin]='D350'and [mfg_date] ='${start_date}'
        `);
    console.log(resultdata);
    arrayData = resultdata[0];
    let seriesOutput = [];

    for (let index = 0; index < arrayData.length; index++) {
      const item = arrayData[index];
      await seriesOutput.push(item.accum_output);
    }

    let seriesOutput_new = {
      name: "Output",
      type: "column",
      data: seriesOutput,
    };

    let resultCT_target = await turning_table.sequelize
      .query(`SELECT [registered_at]
    ,[mfg_date]
    ,[pin]
    ,[accum_output]
    ,[node_no_id]
FROM [counter].[dbo].[app_counter_accumoutput]
where [node_no_id] = 'TB15' and [pin]='D508'and [mfg_date] ='${start_date}'
      `);
    arrayDataTarget = resultCT_target[0];
    let indexTime = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24,
    ];
    let seriesCT_Target = [];
    // UTL=80%
    for (let index = 0; index < arrayDataTarget.length; index++) {
      const item = arrayDataTarget[index];
      await seriesCT_Target.push(
        ((3600 / (item.accum_output / 100)) * 0.8 * indexTime[index]).toFixed(0)
      );
    }

    let seriesTarget_new = {
      name: "Target",
      type: "line",
      data: seriesCT_Target,
    };
    let seriesNew = [seriesOutput_new, seriesTarget_new];
    console.log(seriesOutput_new);
    res.json({
      resultOutput_turn: seriesNew,
      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

//TB-16 query
router.get("/turning_nat16/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let resultdata = await turning_table.sequelize.query(`SELECT [registered_at]
      ,[mfg_date]
      ,[pin]
      ,[accum_output]
      ,[node_no_id]
  FROM [counter].[dbo].[app_counter_accumoutput]
  where [node_no_id] = 'TB16' and [pin]='D32'and [mfg_date] ='${start_date}'
        `);
    console.log(resultdata);
    arrayData = resultdata[0];
    let seriesOutput = [];

    for (let index = 0; index < arrayData.length; index++) {
      const item = arrayData[index];
      await seriesOutput.push(item.accum_output);
    }

    let seriesOutput_new = {
      name: "Output",
      type: "column",
      data: seriesOutput,
    };

    let seriesTarget_new = {
      name: "Target",
      type: "line",
      data: [
        2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000, 22000,
        24000, 26000, 28000, 30000, 32000, 34000, 36000, 38000, 40000, 42000,
        44000, 46000, 48000,
      ],
    };
    let seriesNew = [seriesOutput_new, seriesTarget_new];
    console.log(seriesNew);
    res.json({
      resultOutput_turn: seriesNew,
      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

//TB-17 INNER (2R:D350)
router.get("/turning_nat17/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let resultdata = await turning_table.sequelize.query(`SELECT [registered_at]
      ,[mfg_date]
      ,[pin]
      ,[accum_output]
      ,[node_no_id]
  FROM [counter].[dbo].[app_counter_accumoutput]
  where [node_no_id] = 'TB17' and [pin]='D350'and [mfg_date] ='${start_date}'
        `);
    console.log(resultdata);
    arrayData = resultdata[0];
    let seriesOutput = [];

    for (let index = 0; index < arrayData.length; index++) {
      const item = arrayData[index];
      await seriesOutput.push(item.accum_output);
    }

    let seriesOutput_new = {
      name: "Output",
      type: "column",
      data: seriesOutput,
    };

    let resultCT_target = await turning_table.sequelize
      .query(`SELECT [registered_at]
    ,[mfg_date]
    ,[pin]
    ,[accum_output]
    ,[node_no_id]
FROM [counter].[dbo].[app_counter_accumoutput]
where [node_no_id] = 'TB17' and [pin]='D508'and [mfg_date] ='${start_date}'
      `);
    arrayDataTarget = resultCT_target[0];
    let indexTime = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24,
    ];
    let seriesCT_Target = [];
    // UTL=80%
    for (let index = 0; index < arrayDataTarget.length; index++) {
      const item = arrayDataTarget[index];
      await seriesCT_Target.push(
        ((3600 / (item.accum_output / 100)) * 0.8 * indexTime[index]).toFixed(0)
      );
    }

    let seriesTarget_new = {
      name: "Target",
      type: "line",
      data: seriesCT_Target,
    };
    let seriesNew = [seriesOutput_new, seriesTarget_new];
    console.log(seriesNew);
    res.json({
      resultOutput_turn: seriesNew,
      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

//TB-18 INNER (2R:D350)
router.get("/turning_nat18/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let resultdata = await turning_table.sequelize.query(`SELECT [registered_at]
      ,[mfg_date]
      ,[pin]
      ,[accum_output]
      ,[node_no_id]
  FROM [counter].[dbo].[app_counter_accumoutput]
  where [node_no_id] = 'TB18' and [pin]='D350'and [mfg_date] ='${start_date}'
        `);
    console.log(resultdata);
    arrayData = resultdata[0];
    let seriesOutput = [];

    for (let index = 0; index < arrayData.length; index++) {
      const item = arrayData[index];
      await seriesOutput.push(item.accum_output);
    }

    let seriesOutput_new = {
      name: "Output",
      type: "column",
      data: seriesOutput,
    };

    let resultCT_target = await turning_table.sequelize
      .query(`SELECT [registered_at]
    ,[mfg_date]
    ,[pin]
    ,[accum_output]
    ,[node_no_id]
FROM [counter].[dbo].[app_counter_accumoutput]
where [node_no_id] = 'TB18' and [pin]='D508'and [mfg_date] ='${start_date}'
      `);
    arrayDataTarget = resultCT_target[0];
    let indexTime = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24,
    ];
    let seriesCT_Target = [];
    // UTL=80%
    for (let index = 0; index < arrayDataTarget.length; index++) {
      const item = arrayDataTarget[index];
      await seriesCT_Target.push(
        ((3600 / (item.accum_output / 100)) * 0.8 * indexTime[index]).toFixed(0)
      );
    }

    let seriesTarget_new = {
      name: "Target",
      type: "line",
      data: seriesCT_Target,
    };
    let seriesNew = [seriesOutput_new, seriesTarget_new];
    console.log(seriesOutput_new);
    res.json({
      resultOutput_turn: seriesNew,
      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

// IRH01 Talyrond
router.get("/turningImage/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let resultdata = await TurningImage_table.sequelize.query(`SELECT 
      [sub_process]
      ,[images]
  FROM [counter].[dbo].[app_qc_inspection]
  where [process] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB07','TB08','TB09','TB10','TB11','TB12','IRH01') and [mfg_date] ='2022-12-10'
        `);
    console.log(resultdata[0]);
    arrayData = resultdata[0];

    res.json({
      resultImage: arrayData,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});
// MMS alarm
router.get("/mms/:start_date/:end_date/:selectMc", async (req, res) => {
  // router.get("/mms/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectMc } = req.params;
  console.log(selectMc);

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);

  //console.log('command_column',command_column);
  console.log("command_pivot", command_pivot);

  try {
    let resultMMS = await turning_table.sequelize.query(
      `

    WITH cte_quantity
    AS
    (
SELECT 
    [topic]
  ,iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]) as occur_new
--    ,format( [occurred] ,'dd-MM-yyyy') as newDate
    ,[sum]


FROM [counter].[dbo].[mms]	
 
 where [mc_no] = '${selectMc}'and (convert(datetime, [occurred] , 101) between '${start_date}'and'${end_date}' )		
 group by [topic],iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),[sum]
 )
   
 , tb1  as(   select  [topic], CONVERT(DECIMAL(10,2),(CAST(sum([sum]) as Float)/60 )) as totalMinute
 ,format(occur_new,'yyyy-MM-dd')  as newDate
 FROM cte_quantity
 group by format(occur_new,'yyyy-MM-dd') ,[topic]

  )
  select [topic],
  ` +
        command_column +
        ` as array
    from tb1 
PIVOT (sum(totalMinute)
FOR [newDate] IN (` +
        command_pivot +
        `)
) AS pvt
ORDER BY pvt.[topic]

        `
    );
    // console.log(resultMMS[0]);
    arrayData_MMS = resultMMS[0];

    let resultList_MMS = [];
    arrayData_MMS.forEach(function (a) {
      if (!this[a.topic]) {
        this[a.topic] = { name: a.topic, data: [] };
        resultList_MMS.push(this[a.topic]);
      }
      this[a.topic].data.push(a.array);
    }, Object.create(null));

    console.log(resultList_MMS);

    res.json({
      resultMMS: resultList_MMS,
      resultDate_MMS: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});
router.get("/mms_machine", async (req, res) => {
  try {
    let resultMachine = await turning_table.sequelize.query(`SELECT[mc_no]
    FROM [counter].[dbo].[mms]
    group by [mc_no]
    order by [mc_no]
        `);
    console.log(resultMachine[0]);
    arrayData = resultMachine[0];

    res.json({
      resultMc: arrayData,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_machine", async (req, res) => {
  try {
    let resultMachine = await turning_table.sequelize.query(`SELECT[node_no_id]
    FROM [counter].[dbo].[app_counter_accumoutput]
    where [node_no_id] LIKE 'T%'
    group by [node_no_id]
    order by [node_no_id] ASC
        `);
    console.log(resultMachine[0]);
    arrayData = resultMachine[0];

    res.json({
      resultMc: arrayData,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_type", async (req, res) => {
  try {
    let resultMachine = await turning_table.sequelize.query(`
   -- SELECT[pin]
   -- FROM [counter].[dbo].[app_counter_tools_change]
   -- where [node_no_id] like 'T%' and [pin] in('D330','D332','D334','D336','D338','D340','D342','D348','D366','D354','D356','D362','D364','D368','D370')
   SELECT distinct[pin], CASE 
when [pin] = 'D330' THEN 'Outer_FORMING' 
when [pin] = 'D332' THEN 'Outer_FACING' 
when [pin] = 'D334' THEN 'Outer_RECESS_POS3' 
when [pin] = 'D336' THEN 'Outer_CUT_OFF1' 
when [pin] = 'D338' THEN 'Outer_RECESS_POS5' 
when [pin] = 'D340' THEN 'Outer_CUT_OFF2' 
when [pin] = 'D342' THEN 'Outer_DRILL' 
when [pin] = 'D348' THEN 'Outer_OD_BIT' 
when [pin] = 'D362' THEN 'Inner_FORMING' 
when [pin] = 'D356' THEN 'Inner_DRILL' 
when [pin] = 'D354' THEN 'Inner_CENTER_DRILL' 
when [pin] = 'D364' THEN 'Inner_FACING' 
when [pin] = 'D366' THEN 'Inner_REAMER' 
when [pin] = 'D368' THEN 'Inner_RECESS' 
when [pin] = 'D370' THEN 'Inner_CUT_OFF' 
END as bit_type
    FROM [counter].[dbo].[app_counter_accumoutput]
	where [pin] in('D330','D332','D334','D336','D338','D340','D342','D348','D366','D354','D356','D362','D364','D368','D370')
    order by [bit_type] ASC
        `);
    console.log(resultMachine[0]);
    arrayData = resultMachine[0];

    res.json({
      resultMc: arrayData,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

// router.get("/bit_usage/:start_date/:end_date", async (req, res) => {
//   let { start_date } = req.params;
//   let { end_date } = req.params;
//   let { selectMc } = req.params;
//   console.log(selectMc);

//   var list_date = [];
//   list_date = getDatesInRange(new Date(start_date), new Date(end_date));
//   console.log("list_date", list_date);
//   var command_column = "";
//   var command_pivot = "";
//   for (let i = 0; i < list_date.length; i++) {
//     command_column =
//       command_column +
//       `CONVERT(varchar, isnull([` +
//       list_date[i] +
//       `],0))+','+`;
//     command_pivot = command_pivot + "],[" + list_date[i];
//   }
//   command_column = command_column.substring(0, command_column.length - 5);
//   command_pivot = command_pivot + "]";
//   command_pivot = command_pivot.substring(2);

//   //console.log('command_column',command_column);
//   console.log("command_pivot", command_pivot);

//   try {
//     let resultBit = await Tool_table.sequelize.query(
//       `   WITH cte_quantity
//         AS
//         ( Select
//         [mfg_date]
//               ,[pin]
//               ,sum(CASE WHEN [usage] <> '0' THEN 1 ELSE 0 END) as newUsage
//         	  ,[node_no_id]
              
//           FROM [counter].[dbo].[app_counter_tools_change]
//           where  [mfg_date] between '${start_date}'and'${end_date}'and [pin] in('D366') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB06','TB14','TB15','TB17','TB18')
//           group by  [mfg_date] ,[node_no_id],[pin] 
//       )

//         select [node_no_id],
//         ` +
//         command_column +
//         ` as array
//           from cte_quantity
//       PIVOT (sum(newUsage)
//       FOR [mfg_date] IN (` +
//         command_pivot +
//         `)
//       ) AS pvt
//       ORDER BY pvt.[node_no_id]

//           `
//     );

//     arrayData_Bit = resultBit[0];
//     console.log(arrayData_Bit);

//     let resultList_Bit = [];
//     arrayData_Bit.forEach(function (a) {
//       if (!this[a.node_no_id]) {
//         this[a.node_no_id] = { name: a.node_no_id, data: [] };
//         resultList_Bit.push(this[a.node_no_id]);
//       }
//       this[a.node_no_id].data.push(a.array);
//     }, Object.create(null));

//     console.log(resultList_Bit);

//     res.json({
//       result: resultList_Bit,
//       resultDate: list_date,
//     });
//   } catch (error) {
//     res.json({
//       error,
//       api_result: constance.NOK,
//     });
//   }
// });


router.get("/TB01_bit_usage/:start_date/:end_date/:selectMc", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectMc } = req.params;
  console.log("mcccccc : ",selectMc);

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);

  //console.log('command_column',command_column);
  console.log("command_pivot", command_pivot);

  try {
    let resultMMS = await turning_table.sequelize.query(
      `   WITH cte_quantity
        AS
        ( Select
        [mfg_date]
              ,[pin]
              ,sum(CASE WHEN [usage] <> '0' THEN 1 ELSE 0 END) as newUsage
        	  ,[node_no_id]
              
          FROM [counter].[dbo].[app_counter_tools_change]
          where  [mfg_date] between '${start_date}'and'${end_date}'and [pin] in('D330','D332','D334','D336','D338','D340','D342','D348','D366','D354','D356','D362','D364','D368','D370') and [node_no_id] = '${selectMc}'
          group by  [mfg_date] ,[node_no_id],[pin] 
      )

        select [pin],
        ` +
        command_column +
        ` as array
          from cte_quantity
      PIVOT (sum(newUsage)
      FOR [mfg_date] IN (` +
        command_pivot +
        `)
      ) AS pvt
      ORDER BY pvt.[pin]

          `
    );
          console.log("lol",resultMMS);
    arrayData_MMS = resultMMS[0];
    console.log(arrayData_MMS);

    let resultList_MMS = [];
    arrayData_MMS.forEach(function (a) {
      if (!this[a.pin]) {
        this[a.pin] = { name: a.pin, data: [] };
        resultList_MMS.push(this[a.pin]);
      }
      this[a.pin].data.push(a.array);
    }, Object.create(null));

    console.log(resultList_MMS);

    res.json({
      result: resultList_MMS,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

////////////////////////////////INNER RING///////////////////////////////////////////

router.get("/bit_in_forming/:start_date/:end_date/:selectBit", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectBit } = req.params;
  console.log("mcccccc : ",selectBit); 

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);


  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select distinct[registered_at], [mfg_date],[usage],[node_no_id],[pin], CASE 
      when [pin] = 'D330' THEN 'Outer_FORMING' 
      when [pin] = 'D332' THEN 'Outer_FACING' 
      when [pin] = 'D334' THEN 'Outer_RECESS_POS3' 
      when [pin] = 'D336' THEN 'Outer_CUT_OFF1' 
      when [pin] = 'D338' THEN 'Outer_RECESS_POS5' 
      when [pin] = 'D340' THEN 'Outer_CUT_OFF2' 
      when [pin] = 'D342' THEN 'Outer_DRILL' 
      when [pin] = 'D348' THEN 'Outer_OD_BIT' 
      when [pin] = 'D362' THEN 'Inner_FORMING' 
      when [pin] = 'D356' THEN 'Inner_DRILL' 
      when [pin] = 'D354' THEN 'Inner_CENTER_DRILL' 
      when [pin] = 'D364' THEN 'Inner_FACING' 
      when [pin] = 'D366' THEN 'Inner_REAMER' 
      when [pin] = 'D368' THEN 'Inner_RECESS' 
      when [pin] = 'D370' THEN 'Inner_CUT_OFF'  
END as bit_type 
     FROM [counter].[dbo].[app_counter_tools_change]
     where [mfg_date] between '${start_date}'and'${end_date}' and [usage] > 0 and [pin] = '${selectBit}' and [node_no_id] like 'T%'
     --group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
 order by [registered_at]desc
          `);
    console.log(resultMachine[0]); 
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_in_drill/:start_date/:end_date/:selectBit", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectBit } = req.params;
  console.log("mcccccc : ",selectBit); 

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);


  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select distinct[registered_at], [mfg_date],[usage],[node_no_id],[pin], CASE 
      when [pin] = 'D330' THEN 'Outer_FORMING' 
    when [pin] = 'D332' THEN 'Outer_FACING' 
    when [pin] = 'D334' THEN 'Outer_RECESS_POS3' 
    when [pin] = 'D336' THEN 'Outer_CUT_OFF1' 
    when [pin] = 'D338' THEN 'Outer_RECESS_POS5' 
    when [pin] = 'D340' THEN 'Outer_CUT_OFF2' 
    when [pin] = 'D342' THEN 'Outer_DRILL' 
    when [pin] = 'D348' THEN 'Outer_OD_BIT' 
    when [pin] = 'D362' THEN 'Inner_FORMING' 
    when [pin] = 'D356' THEN 'Inner_DRILL' 
    when [pin] = 'D354' THEN 'Inner_CENTER_DRILL' 
    when [pin] = 'D364' THEN 'Inner_FACING' 
    when [pin] = 'D366' THEN 'Inner_REAMER' 
    when [pin] = 'D368' THEN 'Inner_RECESS' 
    when [pin] = 'D370' THEN 'Inner_CUT_OFF' 
    END as bit_type 
         FROM [counter].[dbo].[app_counter_tools_change]
         where [mfg_date] between '${start_date}'and'${end_date}' and [usage] > 0 and [pin] = '${selectBit}' and [node_no_id] like 'T%'
         --group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
     order by [registered_at]desc
          `);
    console.log(resultMachine[0]); 
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_in_center_drill/:start_date/:end_date/:selectBit", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectBit } = req.params;
  console.log("mcccccc : ",selectBit); 

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);


  try {
    let resultMachine = await turning_table.sequelize
      .query(`--Select [registered_at], [mfg_date],[usage],[node_no_id]        
     -- FROM [counter].[dbo].[app_counter_tools_change]
      --where [mfg_date] between '${start_date}'and'${end_date}' and [usage] > 0 and [pin] = '${selectBit}' and [node_no_id] like 'T%'
     -- group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
  --order by [registered_at]desc
  
  Select distinct[registered_at], [mfg_date],[usage],[node_no_id],[pin], CASE 
  when [pin] = 'D330' THEN 'Outer_FORMING' 
    when [pin] = 'D332' THEN 'Outer_FACING' 
    when [pin] = 'D334' THEN 'Outer_RECESS_POS3' 
    when [pin] = 'D336' THEN 'Outer_CUT_OFF1' 
    when [pin] = 'D338' THEN 'Outer_RECESS_POS5' 
    when [pin] = 'D340' THEN 'Outer_CUT_OFF2' 
    when [pin] = 'D342' THEN 'Outer_DRILL' 
    when [pin] = 'D348' THEN 'Outer_OD_BIT' 
    when [pin] = 'D362' THEN 'Inner_FORMING' 
    when [pin] = 'D356' THEN 'Inner_DRILL' 
    when [pin] = 'D354' THEN 'Inner_CENTER_DRILL' 
    when [pin] = 'D364' THEN 'Inner_FACING' 
    when [pin] = 'D366' THEN 'Inner_REAMER' 
    when [pin] = 'D368' THEN 'Inner_RECESS' 
    when [pin] = 'D370' THEN 'Inner_CUT_OFF'  
END as bit_type 
     FROM [counter].[dbo].[app_counter_tools_change]
     where [mfg_date] between '${start_date}'and'${end_date}' and [usage] > 0  and [pin] = '${selectBit}' and [node_no_id] like 'T%'
     --group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
 order by [registered_at]desc
          `);
    console.log(resultMachine[0]); 
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_in_facing/:start_date/:end_date/:selectBit", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectBit } = req.params;
  console.log("mcccccc : ",selectBit); 

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);


  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select distinct[registered_at], [mfg_date],[usage],[node_no_id],[pin], CASE 
      when [pin] = 'D330' THEN 'Outer_FORMING' 
    when [pin] = 'D332' THEN 'Outer_FACING' 
    when [pin] = 'D334' THEN 'Outer_RECESS_POS3' 
    when [pin] = 'D336' THEN 'Outer_CUT_OFF1' 
    when [pin] = 'D338' THEN 'Outer_RECESS_POS5' 
    when [pin] = 'D340' THEN 'Outer_CUT_OFF2' 
    when [pin] = 'D342' THEN 'Outer_DRILL' 
    when [pin] = 'D348' THEN 'Outer_OD_BIT' 
    when [pin] = 'D362' THEN 'Inner_FORMING' 
    when [pin] = 'D356' THEN 'Inner_DRILL' 
    when [pin] = 'D354' THEN 'Inner_CENTER_DRILL' 
    when [pin] = 'D364' THEN 'Inner_FACING' 
    when [pin] = 'D366' THEN 'Inner_REAMER' 
    when [pin] = 'D368' THEN 'Inner_RECESS' 
    when [pin] = 'D370' THEN 'Inner_CUT_OFF' 
    END as bit_type 
         FROM [counter].[dbo].[app_counter_tools_change]
         where [mfg_date] between '${start_date}'and'${end_date}' and [usage] > 0 and [pin] = '${selectBit}' and [node_no_id] like 'T%'
         --group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
     order by [registered_at]desc
          `);
    console.log(resultMachine[0]); 
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_in_reamer/:start_date/:end_date/:selectBit", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectBit } = req.params;
  console.log("mcccccc : ",selectBit); 

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);


  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select distinct[registered_at], [mfg_date],[usage],[node_no_id],[pin], CASE 
      when [pin] = 'D330' THEN 'Outer_FORMING' 
    when [pin] = 'D332' THEN 'Outer_FACING' 
    when [pin] = 'D334' THEN 'Outer_RECESS_POS3' 
    when [pin] = 'D336' THEN 'Outer_CUT_OFF1' 
    when [pin] = 'D338' THEN 'Outer_RECESS_POS5' 
    when [pin] = 'D340' THEN 'Outer_CUT_OFF2' 
    when [pin] = 'D342' THEN 'Outer_DRILL' 
    when [pin] = 'D348' THEN 'Outer_OD_BIT' 
    when [pin] = 'D362' THEN 'Inner_FORMING' 
    when [pin] = 'D356' THEN 'Inner_DRILL' 
    when [pin] = 'D354' THEN 'Inner_CENTER_DRILL' 
    when [pin] = 'D364' THEN 'Inner_FACING' 
    when [pin] = 'D366' THEN 'Inner_REAMER' 
    when [pin] = 'D368' THEN 'Inner_RECESS'  
    when [pin] = 'D370' THEN 'Inner_CUT_OFF'  
    END as bit_type 
         FROM [counter].[dbo].[app_counter_tools_change]
         where [mfg_date] between '${start_date}'and'${end_date}' and [usage] > 0 and [pin] = '${selectBit}' and [node_no_id] like 'T%'
         --group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
     order by [registered_at]desc
          `);
    console.log(resultMachine[0]); 
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_in_recess/:start_date/:end_date/:selectBit", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectBit } = req.params;
  console.log("mcccccc : ",selectBit); 

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);


  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select distinct[registered_at], [mfg_date],[usage],[node_no_id],[pin], CASE 
      when [pin] = 'D330' THEN 'Outer_FORMING' 
    when [pin] = 'D332' THEN 'Outer_FACING' 
    when [pin] = 'D334' THEN 'Outer_RECESS_POS3' 
    when [pin] = 'D336' THEN 'Outer_CUT_OFF1' 
    when [pin] = 'D338' THEN 'Outer_RECESS_POS5' 
    when [pin] = 'D340' THEN 'Outer_CUT_OFF2' 
    when [pin] = 'D342' THEN 'Outer_DRILL' 
    when [pin] = 'D348' THEN 'Outer_OD_BIT' 
    when [pin] = 'D362' THEN 'Inner_FORMING' 
    when [pin] = 'D356' THEN 'Inner_DRILL' 
    when [pin] = 'D354' THEN 'Inner_CENTER_DRILL' 
    when [pin] = 'D364' THEN 'Inner_FACING' 
    when [pin] = 'D366' THEN 'Inner_REAMER' 
    when [pin] = 'D368' THEN 'Inner_RECESS' 
    when [pin] = 'D370' THEN 'Inner_CUT_OFF' 
    END as bit_type 
         FROM [counter].[dbo].[app_counter_tools_change]
         where [mfg_date] between '${start_date}'and'${end_date}' and [usage] > 0 and [pin] = '${selectBit}' and [node_no_id] like 'T%'
         --group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
     order by [registered_at]desc
          `);
    console.log(resultMachine[0]); 
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_in_cut_off/:start_date/:end_date/:selectBit", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectBit } = req.params;
  console.log("mcccccc : ",selectBit); 

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);


  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select distinct[registered_at], [mfg_date],[usage],[node_no_id],[pin], CASE 
      when [pin] = 'D330' THEN 'Outer_FORMING' 
    when [pin] = 'D332' THEN 'Outer_FACING' 
    when [pin] = 'D334' THEN 'Outer_RECESS_POS3' 
    when [pin] = 'D336' THEN 'Outer_CUT_OFF1' 
    when [pin] = 'D338' THEN 'Outer_RECESS_POS5' 
    when [pin] = 'D340' THEN 'Outer_CUT_OFF2' 
    when [pin] = 'D342' THEN 'Outer_DRILL' 
    when [pin] = 'D348' THEN 'Outer_OD_BIT' 
    when [pin] = 'D362' THEN 'Inner_FORMING' 
    when [pin] = 'D356' THEN 'Inner_DRILL' 
    when [pin] = 'D354' THEN 'Inner_CENTER_DRILL' 
    when [pin] = 'D364' THEN 'Inner_FACING' 
    when [pin] = 'D366' THEN 'Inner_REAMER' 
    when [pin] = 'D368' THEN 'Inner_RECESS' 
    when [pin] = 'D370' THEN 'Inner_CUT_OFF' 
    END as bit_type 
         FROM [counter].[dbo].[app_counter_tools_change]
         where [mfg_date] between '${start_date}'and'${end_date}' and [usage] > 0 and [pin] = '${selectBit}' and [node_no_id] like 'T%'
         --group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
     order by [registered_at]desc
          `);
    console.log(resultMachine[0]); 
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

////////////////////////////////INNER RING///////////////////////////////////////////

router.get("/bit_out_forming/:start_date/:end_date/:selectBit", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectBit } = req.params;
  console.log("mcccccc : ",selectBit); 

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);


  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select distinct[registered_at], [mfg_date],[usage],[node_no_id],[pin], CASE 
      when [pin] = 'D330' THEN 'Outer_FORMING' 
    when [pin] = 'D332' THEN 'Outer_FACING' 
    when [pin] = 'D334' THEN 'Outer_RECESS_POS3' 
    when [pin] = 'D336' THEN 'Outer_CUT_OFF1' 
    when [pin] = 'D338' THEN 'Outer_RECESS_POS5' 
    when [pin] = 'D340' THEN 'Outer_CUT_OFF2' 
    when [pin] = 'D342' THEN 'Outer_DRILL' 
    when [pin] = 'D348' THEN 'Outer_OD_BIT' 
    when [pin] = 'D362' THEN 'Inner_FORMING' 
    when [pin] = 'D356' THEN 'Inner_DRILL' 
    when [pin] = 'D354' THEN 'Inner_CENTER_DRILL' 
    when [pin] = 'D364' THEN 'Inner_FACING' 
    when [pin] = 'D366' THEN 'Inner_REAMER' 
    when [pin] = 'D368' THEN 'Inner_RECESS' 
    when [pin] = 'D370' THEN 'Inner_CUT_OFF' 
    END as bit_type 
         FROM [counter].[dbo].[app_counter_tools_change]
         where [mfg_date] between '${start_date}'and'${end_date}' and [usage] > 0 and [pin] = '${selectBit}' and [node_no_id] like 'T%'
         --group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
     order by [registered_at]desc
          `);
    console.log(resultMachine[0]); 
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_facing/:start_date/:end_date/:selectBit", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectBit } = req.params;
  console.log("mcccccc : ",selectBit); 

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);


  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select distinct[registered_at], [mfg_date],[usage],[node_no_id],[pin], CASE 
      when [pin] = 'D330' THEN 'Outer_FORMING' 
    when [pin] = 'D332' THEN 'Outer_FACING' 
    when [pin] = 'D334' THEN 'Outer_RECESS_POS3' 
    when [pin] = 'D336' THEN 'Outer_CUT_OFF1' 
    when [pin] = 'D338' THEN 'Outer_RECESS_POS5' 
    when [pin] = 'D340' THEN 'Outer_CUT_OFF2' 
    when [pin] = 'D342' THEN 'Outer_DRILL' 
    when [pin] = 'D348' THEN 'Outer_OD_BIT' 
    when [pin] = 'D362' THEN 'Inner_FORMING' 
    when [pin] = 'D356' THEN 'Inner_DRILL' 
    when [pin] = 'D354' THEN 'Inner_CENTER_DRILL' 
    when [pin] = 'D364' THEN 'Inner_FACING' 
    when [pin] = 'D366' THEN 'Inner_REAMER' 
    when [pin] = 'D368' THEN 'Inner_RECESS' 
    when [pin] = 'D370' THEN 'Inner_CUT_OFF' 
    END as bit_type 
         FROM [counter].[dbo].[app_counter_tools_change]
         where [mfg_date] between '${start_date}'and'${end_date}' and [usage] > 0 and [pin] = '${selectBit}' and [node_no_id] like 'T%'
         --group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
     order by [registered_at]desc
          `);
    console.log(resultMachine[0]); 
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_3recess/:start_date/:end_date/:selectBit", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectBit } = req.params;
  console.log("mcccccc : ",selectBit); 

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);


  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select distinct[registered_at], [mfg_date],[usage],[node_no_id],[pin], CASE 
      when [pin] = 'D330' THEN 'Outer_FORMING' 
    when [pin] = 'D332' THEN 'Outer_FACING' 
    when [pin] = 'D334' THEN 'Outer_RECESS_POS3' 
    when [pin] = 'D336' THEN 'Outer_CUT_OFF1' 
    when [pin] = 'D338' THEN 'Outer_RECESS_POS5' 
    when [pin] = 'D340' THEN 'Outer_CUT_OFF2' 
    when [pin] = 'D342' THEN 'Outer_DRILL' 
    when [pin] = 'D348' THEN 'Outer_OD_BIT' 
    when [pin] = 'D362' THEN 'Inner_FORMING' 
    when [pin] = 'D356' THEN 'Inner_DRILL' 
    when [pin] = 'D354' THEN 'Inner_CENTER_DRILL' 
    when [pin] = 'D364' THEN 'Inner_FACING' 
    when [pin] = 'D366' THEN 'Inner_REAMER' 
    when [pin] = 'D368' THEN 'Inner_RECESS' 
    when [pin] = 'D370' THEN 'Inner_CUT_OFF' 
    END as bit_type 
         FROM [counter].[dbo].[app_counter_tools_change]
         where [mfg_date] between '${start_date}'and'${end_date}' and [usage] > 0 and [pin] = '${selectBit}' and [node_no_id] like 'T%'
         --group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
     order by [registered_at]desc
          `);
    console.log(resultMachine[0]); 
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_cut_off1/:start_date/:end_date/:selectBit", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectBit } = req.params;
  console.log("mcccccc : ",selectBit); 

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);


  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select distinct[registered_at], [mfg_date],[usage],[node_no_id],[pin], CASE 
      when [pin] = 'D330' THEN 'Outer_FORMING' 
    when [pin] = 'D332' THEN 'Outer_FACING' 
    when [pin] = 'D334' THEN 'Outer_RECESS_POS3' 
    when [pin] = 'D336' THEN 'Outer_CUT_OFF1' 
    when [pin] = 'D338' THEN 'Outer_RECESS_POS5' 
    when [pin] = 'D340' THEN 'Outer_CUT_OFF2' 
    when [pin] = 'D342' THEN 'Outer_DRILL' 
    when [pin] = 'D348' THEN 'Outer_OD_BIT' 
    when [pin] = 'D362' THEN 'Inner_FORMING' 
    when [pin] = 'D356' THEN 'Inner_DRILL' 
    when [pin] = 'D354' THEN 'Inner_CENTER_DRILL' 
    when [pin] = 'D364' THEN 'Inner_FACING' 
    when [pin] = 'D366' THEN 'Inner_REAMER' 
    when [pin] = 'D368' THEN 'Inner_RECESS' 
    when [pin] = 'D370' THEN 'Inner_CUT_OFF' 
    END as bit_type 
         FROM [counter].[dbo].[app_counter_tools_change]
         where [mfg_date] between '${start_date}'and'${end_date}' and [usage] > 0 and [pin] = '${selectBit}' and [node_no_id] like 'T%'
         --group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
     order by [registered_at]desc
          `);
    console.log(resultMachine[0]); 
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_5recess/:start_date/:end_date/:selectBit", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectBit } = req.params;
  console.log("mcccccc : ",selectBit); 

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);


  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select distinct[registered_at], [mfg_date],[usage],[node_no_id],[pin], CASE 
      when [pin] = 'D330' THEN 'Outer_FORMING' 
    when [pin] = 'D332' THEN 'Outer_FACING' 
    when [pin] = 'D334' THEN 'Outer_RECESS_POS3' 
    when [pin] = 'D336' THEN 'Outer_CUT_OFF1' 
    when [pin] = 'D338' THEN 'Outer_RECESS_POS5' 
    when [pin] = 'D340' THEN 'Outer_CUT_OFF2' 
    when [pin] = 'D342' THEN 'Outer_DRILL' 
    when [pin] = 'D348' THEN 'Outer_OD_BIT' 
    when [pin] = 'D362' THEN 'Inner_FORMING' 
    when [pin] = 'D356' THEN 'Inner_DRILL' 
    when [pin] = 'D354' THEN 'Inner_CENTER_DRILL' 
    when [pin] = 'D364' THEN 'Inner_FACING' 
    when [pin] = 'D366' THEN 'Inner_REAMER' 
    when [pin] = 'D368' THEN 'Inner_RECESS' 
    when [pin] = 'D370' THEN 'Inner_CUT_OFF' 
    END as bit_type 
         FROM [counter].[dbo].[app_counter_tools_change]
         where [mfg_date] between '${start_date}'and'${end_date}' and [usage] > 0 and [pin] = '${selectBit}' and [node_no_id] like 'T%'
         --group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
     order by [registered_at]desc
          `);
    console.log(resultMachine[0]); 
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_cut_off2/:start_date/:end_date/:selectBit", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectBit } = req.params;
  console.log("mcccccc : ",selectBit); 

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);


  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select distinct[registered_at], [mfg_date],[usage],[node_no_id],[pin], CASE 
      when [pin] = 'D330' THEN 'Outer_FORMING' 
    when [pin] = 'D332' THEN 'Outer_FACING' 
    when [pin] = 'D334' THEN 'Outer_RECESS_POS3' 
    when [pin] = 'D336' THEN 'Outer_CUT_OFF1' 
    when [pin] = 'D338' THEN 'Outer_RECESS_POS5' 
    when [pin] = 'D340' THEN 'Outer_CUT_OFF2' 
    when [pin] = 'D342' THEN 'Outer_DRILL' 
    when [pin] = 'D348' THEN 'Outer_OD_BIT' 
    when [pin] = 'D362' THEN 'Inner_FORMING' 
    when [pin] = 'D356' THEN 'Inner_DRILL' 
    when [pin] = 'D354' THEN 'Inner_CENTER_DRILL' 
    when [pin] = 'D364' THEN 'Inner_FACING' 
    when [pin] = 'D366' THEN 'Inner_REAMER' 
    when [pin] = 'D368' THEN 'Inner_RECESS' 
    when [pin] = 'D370' THEN 'Inner_CUT_OFF' 
    END as bit_type 
         FROM [counter].[dbo].[app_counter_tools_change]
         where [mfg_date] between '${start_date}'and'${end_date}' and [usage] > 0 and [pin] = '${selectBit}' and [node_no_id] like 'T%'
         --group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
     order by [registered_at]desc
          `);
    console.log(resultMachine[0]); 
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_drill/:start_date/:end_date/:selectBit", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectBit } = req.params;
  console.log("mcccccc : ",selectBit); 

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);


  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select distinct[registered_at], [mfg_date],[usage],[node_no_id],[pin], CASE 
      when [pin] = 'D330' THEN 'Outer_FORMING' 
    when [pin] = 'D332' THEN 'Outer_FACING' 
    when [pin] = 'D334' THEN 'Outer_RECESS_POS3' 
    when [pin] = 'D336' THEN 'Outer_CUT_OFF1' 
    when [pin] = 'D338' THEN 'Outer_RECESS_POS5' 
    when [pin] = 'D340' THEN 'Outer_CUT_OFF2' 
    when [pin] = 'D342' THEN 'Outer_DRILL'
    when [pin] = 'D348' THEN 'Outer_OD_BIT'  
    when [pin] = 'D362' THEN 'Inner_FORMING' 
    when [pin] = 'D356' THEN 'Inner_DRILL' 
    when [pin] = 'D354' THEN 'Inner_CENTER_DRILL' 
    when [pin] = 'D364' THEN 'Inner_FACING' 
    when [pin] = 'D366' THEN 'Inner_REAMER' 
    when [pin] = 'D368' THEN 'Inner_RECESS' 
    when [pin] = 'D370' THEN 'Inner_CUT_OFF' 
    END as bit_type 
         FROM [counter].[dbo].[app_counter_tools_change]
         where [mfg_date] between '${start_date}'and'${end_date}' and [usage] > 0 and [pin] = '${selectBit}' and [node_no_id] like 'T%'
         --group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
     order by [registered_at]desc
          `);
    console.log(resultMachine[0]); 
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_od_bit/:start_date/:end_date/:selectBit", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectBit } = req.params;
  console.log("mcccccc : ",selectBit); 

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);


  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select distinct[registered_at], [mfg_date],[usage],[node_no_id],[pin], CASE 
      when [pin] = 'D330' THEN 'Outer_FORMING' 
    when [pin] = 'D332' THEN 'Outer_FACING' 
    when [pin] = 'D334' THEN 'Outer_RECESS_POS3' 
    when [pin] = 'D336' THEN 'Outer_CUT_OFF1' 
    when [pin] = 'D338' THEN 'Outer_RECESS_POS5' 
    when [pin] = 'D340' THEN 'Outer_CUT_OFF2' 
    when [pin] = 'D342' THEN 'Outer_DRILL' 
    when [pin] = 'D348' THEN 'Outer_OD_BIT' 
    when [pin] = 'D362' THEN 'Inner_FORMING' 
    when [pin] = 'D356' THEN 'Inner_DRILL' 
    when [pin] = 'D354' THEN 'Inner_CENTER_DRILL' 
    when [pin] = 'D364' THEN 'Inner_FACING' 
    when [pin] = 'D366' THEN 'Inner_REAMER' 
    when [pin] = 'D368' THEN 'Inner_RECESS' 
    when [pin] = 'D370' THEN 'Inner_CUT_OFF' 
    END as bit_type 
         FROM [counter].[dbo].[app_counter_tools_change]
         where [mfg_date] between '${start_date}'and'${end_date}' and [usage] > 0 and [pin] = '${selectBit}' and [node_no_id] like 'T%'
         --group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
     order by [registered_at]desc
          `);
    console.log(resultMachine[0]); 
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/gantt/:start_date/:end_date/:selectMC", async (req, res) => {
  try {
    const { start_date, end_date, selectMC } = req.params;
    let stringMachine = await selectMC.replace("[", "");
    stringMachine = await stringMachine.replace("]", "");
    stringMachine = await stringMachine.replaceAll('"', "'");

    let ganttResult_FRONT_DOOR_OPEN = await turning_table.sequelize
      .query(`WITH tb1 as
      (
      SELECT  
      iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]) as occur_new
        ,[topic]
        ,[occurred]
        ,[restored]
        ,[topic_group]
        ,[sum]
      ,[mc_no]
   FROM [counter].[dbo].[mms]
   where [mc_no] ='${selectMC}' and (convert(datetime, [occurred] , 101) between '${start_date}'and'${end_date}' )
   group by [topic],iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),[sum],[topic_group],[occurred],[restored],[mc_no])
    , tb2  as(   select  [topic],format(occur_new,'yyyy-MM-dd')  as newDate ,[occurred],[restored],[mc_no]
      FROM tb1
    )
    ,tb3 as (select [topic],[occurred],[restored],tb2.[newDate] as [MfgDate] ,[mc_no]
    from tb2
   )
    ,tb4 as (
        SELECT *
          ,lead([occurred]) over(partition by [mc_no] order by [mc_no],[occurred]) AS [NextTimeStamp]
        FROM tb3 
        where (tb3.[MfgDate] between '${start_date}'and'${end_date}') and [mc_no] ='${selectMC}' 
        )
        select * from tb4 where [topic] = 'FRONT DOOR OPEN' and [NextTimeStamp] is not null
      `);
    console.log(ganttResult_FRONT_DOOR_OPEN);
    let ganttResult_CAM_POSITION_ALARM = await turning_table.sequelize
      .query(`WITH tb1 as
      (
      SELECT  
      iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]) as occur_new
        ,[topic]
        ,[occurred]
        ,[restored]
        ,[topic_group]
        ,[sum]
      ,[mc_no]
   FROM [counter].[dbo].[mms]
   where [mc_no] ='${selectMC}' and (convert(datetime, [occurred] , 101) between '${start_date}'and'${end_date}' )
   group by [topic],iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),[sum],[topic_group],[occurred],[restored],[mc_no])
    , tb2  as(   select  [topic],format(occur_new,'yyyy-MM-dd')  as newDate ,[occurred],[restored],[mc_no]
      FROM tb1
    )
    ,tb3 as (select [topic],[occurred],[restored],tb2.[newDate] as [MfgDate] ,[mc_no]
    from tb2
   )
    ,tb4 as (
        SELECT *
          ,lead([occurred]) over(partition by [mc_no] order by [mc_no],[occurred]) AS [NextTimeStamp]
        FROM tb3 
        where (tb3.[MfgDate] between '${start_date}'and'${end_date}') and [mc_no] ='${selectMC}' 
        )
        select * from tb4 where [topic] = 'CAM POSITION ALARM' and [NextTimeStamp] is not null
      `);
    let ganttResult_COOLANT_LOW = await turning_table.sequelize
      .query(`WITH tb1 as
      (
      SELECT  
      iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]) as occur_new
        ,[topic]
        ,[occurred]
        ,[restored]
        ,[topic_group]
        ,[sum]
      ,[mc_no]
   FROM [counter].[dbo].[mms]
   where [mc_no] ='${selectMC}' and (convert(datetime, [occurred] , 101) between '${start_date}'and'${end_date}' )
   group by [topic],iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),[sum],[topic_group],[occurred],[restored],[mc_no])
    , tb2  as(   select  [topic],format(occur_new,'yyyy-MM-dd')  as newDate ,[occurred],[restored],[mc_no]
      FROM tb1
    )
    ,tb3 as (select [topic],[occurred],[restored],tb2.[newDate] as [MfgDate] ,[mc_no]
    from tb2
   )
    ,tb4 as (
        SELECT *
          ,lead([occurred]) over(partition by [mc_no] order by [mc_no],[occurred]) AS [NextTimeStamp]
        FROM tb3 
        where (tb3.[MfgDate] between '${start_date}'and'${end_date}') and [mc_no] ='${selectMC}' 
        )
        select * from tb4 where [topic] = 'COOLANT LOW' and [NextTimeStamp] is not null
      `);
    let ganttResult_DRILL_OUT_ALARM = await turning_table.sequelize
      .query(`WITH tb1 as
      (
      SELECT  
      iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]) as occur_new
        ,[topic]
        ,[occurred]
        ,[restored]
        ,[topic_group]
        ,[sum]
      ,[mc_no]
   FROM [counter].[dbo].[mms]
   where [mc_no] ='${selectMC}' and (convert(datetime, [occurred] , 101) between '${start_date}'and'${end_date}' )
   group by [topic],iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),[sum],[topic_group],[occurred],[restored],[mc_no])
    , tb2  as(   select  [topic],format(occur_new,'yyyy-MM-dd')  as newDate ,[occurred],[restored],[mc_no]
      FROM tb1
    )
    ,tb3 as (select [topic],[occurred],[restored],tb2.[newDate] as [MfgDate] ,[mc_no]
    from tb2
   )
    ,tb4 as (
        SELECT *
          ,lead([occurred]) over(partition by [mc_no] order by [mc_no],[occurred]) AS [NextTimeStamp]
        FROM tb3 
        where (tb3.[MfgDate] between '${start_date}'and'${end_date}') and [mc_no] ='${selectMC}' 
        )
        select * from tb4 where [topic] = 'DRILL OUT ALARM' and [NextTimeStamp] is not null
      `);
    let ganttResult_HANDLE_ENGAGED = await turning_table.sequelize
      .query(`WITH tb1 as
      (
      SELECT  
      iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]) as occur_new
        ,[topic]
        ,[occurred]
        ,[restored]
        ,[topic_group]
        ,[sum]
      ,[mc_no]
   FROM [counter].[dbo].[mms]
   where [mc_no] ='${selectMC}' and (convert(datetime, [occurred] , 101) between '${start_date}'and'${end_date}' )
   group by [topic],iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),[sum],[topic_group],[occurred],[restored],[mc_no])
    , tb2  as(   select  [topic],format(occur_new,'yyyy-MM-dd')  as newDate ,[occurred],[restored],[mc_no]
      FROM tb1
    )
    ,tb3 as (select [topic],[occurred],[restored],tb2.[newDate] as [MfgDate] ,[mc_no]
    from tb2
   )
    ,tb4 as (
        SELECT *
          ,lead([occurred]) over(partition by [mc_no] order by [mc_no],[occurred]) AS [NextTimeStamp]
        FROM tb3 
        where (tb3.[MfgDate] between '${start_date}'and'${end_date}') and [mc_no] ='${selectMC}' 
        )
        select * from tb4 where [topic] = 'HANDLE ENGAGED' and [NextTimeStamp] is not null
      `);
    let ganttResult_PART_DROP_NO_SETTING = await turning_table.sequelize
      .query(`WITH tb1 as
      (
      SELECT  
      iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]) as occur_new
        ,[topic]
        ,[occurred]
        ,[restored]
        ,[topic_group]
        ,[sum]
      ,[mc_no]
   FROM [counter].[dbo].[mms]
   where [mc_no] ='${selectMC}' and (convert(datetime, [occurred] , 101) between '${start_date}'and'${end_date}' )
   group by [topic],iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),[sum],[topic_group],[occurred],[restored],[mc_no])
    , tb2  as(   select  [topic],format(occur_new,'yyyy-MM-dd')  as newDate ,[occurred],[restored],[mc_no]
      FROM tb1
    )
    ,tb3 as (select [topic],[occurred],[restored],tb2.[newDate] as [MfgDate] ,[mc_no]
    from tb2
   )
    ,tb4 as (
        SELECT *
          ,lead([occurred]) over(partition by [mc_no] order by [mc_no],[occurred]) AS [NextTimeStamp]
        FROM tb3 
        where (tb3.[MfgDate] between '${start_date}'and'${end_date}') and [mc_no] ='${selectMC}' 
        )
        select * from tb4 where [topic] = 'PART DROP NO SETTING' and [NextTimeStamp] is not null
      `);
    let ganttResult_PART_DROP_P0S_4 = await turning_table.sequelize
      .query(`WITH tb1 as
      (
      SELECT  
      iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]) as occur_new
        ,[topic]
        ,[occurred]
        ,[restored]
        ,[topic_group]
        ,[sum]
      ,[mc_no]
   FROM [counter].[dbo].[mms]
   where [mc_no] ='${selectMC}' and (convert(datetime, [occurred] , 101) between '${start_date}'and'${end_date}' )
   group by [topic],iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),[sum],[topic_group],[occurred],[restored],[mc_no])
    , tb2  as(   select  [topic],format(occur_new,'yyyy-MM-dd')  as newDate ,[occurred],[restored],[mc_no]
      FROM tb1
    )
    ,tb3 as (select [topic],[occurred],[restored],tb2.[newDate] as [MfgDate] ,[mc_no]
    from tb2
   )
    ,tb4 as (
        SELECT *
          ,lead([occurred]) over(partition by [mc_no] order by [mc_no],[occurred]) AS [NextTimeStamp]
        FROM tb3 
        where (tb3.[MfgDate] between '${start_date}'and'${end_date}') and [mc_no] ='${selectMC}' 
        )
        select * from tb4 where [topic] = 'PART DROP P0S 4' and [NextTimeStamp] is not null
      `);
    let ganttResult_PART_DROP_P0S_6 = await turning_table.sequelize
      .query(`WITH tb1 as
      (
      SELECT  
      iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]) as occur_new
        ,[topic]
        ,[occurred]
        ,[restored]
        ,[topic_group]
        ,[sum]
      ,[mc_no]
   FROM [counter].[dbo].[mms]
   where [mc_no] ='${selectMC}' and (convert(datetime, [occurred] , 101) between '${start_date}'and'${end_date}' )
   group by [topic],iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),[sum],[topic_group],[occurred],[restored],[mc_no])
    , tb2  as(   select  [topic],format(occur_new,'yyyy-MM-dd')  as newDate ,[occurred],[restored],[mc_no]
      FROM tb1
    )
    ,tb3 as (select [topic],[occurred],[restored],tb2.[newDate] as [MfgDate] ,[mc_no]
    from tb2
   )
    ,tb4 as (
        SELECT *
          ,lead([occurred]) over(partition by [mc_no] order by [mc_no],[occurred]) AS [NextTimeStamp]
        FROM tb3 
        where (tb3.[MfgDate] between '${start_date}'and'${end_date}') and [mc_no] ='${selectMC}' 
        )
        select * from tb4 where [topic] = 'PART DROP P0S 6' and [NextTimeStamp] is not null
      `);
    let ganttResult_REAR_DOOR_OPEN = await turning_table.sequelize
      .query(`WITH tb1 as
      (
      SELECT  
      iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]) as occur_new
        ,[topic]
        ,[occurred]
        ,[restored]
        ,[topic_group]
        ,[sum]
      ,[mc_no]
   FROM [counter].[dbo].[mms]
   where [mc_no] ='${selectMC}' and (convert(datetime, [occurred] , 101) between '${start_date}'and'${end_date}' )
   group by [topic],iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),[sum],[topic_group],[occurred],[restored],[mc_no])
    , tb2  as(   select  [topic],format(occur_new,'yyyy-MM-dd')  as newDate ,[occurred],[restored],[mc_no]
      FROM tb1
    )
    ,tb3 as (select [topic],[occurred],[restored],tb2.[newDate] as [MfgDate] ,[mc_no]
    from tb2
   )
    ,tb4 as (
        SELECT *
          ,lead([occurred]) over(partition by [mc_no] order by [mc_no],[occurred]) AS [NextTimeStamp]
        FROM tb3 
        where (tb3.[MfgDate] between '${start_date}'and'${end_date}') and [mc_no] ='${selectMC}' 
        )
        select * from tb4 where [topic] = 'REAR DOOR OPEN' and [NextTimeStamp] is not null
      `);
    let ganttResult_SERVO_ALARM = await turning_table.sequelize
      .query(`WITH tb1 as
      (
      SELECT  
      iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]) as occur_new
        ,[topic]
        ,[occurred]
        ,[restored]
        ,[topic_group]
        ,[sum]
      ,[mc_no]
   FROM [counter].[dbo].[mms]
   where [mc_no] ='${selectMC}' and (convert(datetime, [occurred] , 101) between '${start_date}'and'${end_date}' )
   group by [topic],iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),[sum],[topic_group],[occurred],[restored],[mc_no])
    , tb2  as(   select  [topic],format(occur_new,'yyyy-MM-dd')  as newDate ,[occurred],[restored],[mc_no]
      FROM tb1
    )
    ,tb3 as (select [topic],[occurred],[restored],tb2.[newDate] as [MfgDate] ,[mc_no]
    from tb2
   )
    ,tb4 as (
        SELECT *
          ,lead([occurred]) over(partition by [mc_no] order by [mc_no],[occurred]) AS [NextTimeStamp]
        FROM tb3 
        where (tb3.[MfgDate] between '${start_date}'and'${end_date}') and [mc_no] ='${selectMC}' 
        )
        select * from tb4 where [topic] = 'SERVO ALARM' and [NextTimeStamp] is not null
      `);

    //set data
    let data_FRONT_DOOR_OPEN = [];
    let data_CAM_POSITION_ALARM = [];
    let data_COOLANT_LOW = [];
    let data_DRILL_OUT_ALARM = [];
    let data_HANDLE_ENGAGED = [];
    let data_PART_DROP_NO_SETTING = [];
    let data_PART_DROP_P0S_4 = [];
    let data_PART_DROP_P0S_6 = [];
    let data_REAR_DOOR_OPEN = [];
    let data_SERVO_ALARM = [];

    ganttResult_FRONT_DOOR_OPEN[0].forEach(async (item) => {
      await data_FRONT_DOOR_OPEN.push({
        x: item.mc_no,
        y: [
          new Date(item.occurred).getTime(),
          new Date(item.restored).getTime(),
        ],
      });
    });

    //console.log(data_FRONT_DOOR_OPEN)

    ganttResult_CAM_POSITION_ALARM[0].forEach(async (item) => {
      await data_CAM_POSITION_ALARM.push({
        x: item.mc_no,
        y: [
          new Date(item.occurred).getTime(),
          new Date(item.restored).getTime(),
        ],
      });
    });

    ganttResult_COOLANT_LOW[0].forEach(async (item) => {
      await data_COOLANT_LOW.push({
        x: item.mc_no,
        y: [
          new Date(item.occurred).getTime(),
          new Date(item.restored).getTime(),
        ],
      });
    });
    ganttResult_DRILL_OUT_ALARM[0].forEach(async (item) => {
      await data_DRILL_OUT_ALARM.push({
        x: item.mc_no,
        y: [
          new Date(item.occurred).getTime(),
          new Date(item.restored).getTime(),
        ],
      });
    });
    console.log(data_DRILL_OUT_ALARM);
    ganttResult_HANDLE_ENGAGED[0].forEach(async (item) => {
      await data_HANDLE_ENGAGED.push({
        x: item.mc_no,
        y: [
          new Date(item.occurred).getTime(),
          new Date(item.restored).getTime(),
        ],
      });
    });

    ganttResult_PART_DROP_NO_SETTING[0].forEach(async (item) => {
      await data_PART_DROP_NO_SETTING.push({
        x: item.mc_no,
        y: [
          new Date(item.occurred).getTime(),
          new Date(item.restored).getTime(),
        ],
      });
    });

    ganttResult_PART_DROP_P0S_4[0].forEach(async (item) => {
      await data_PART_DROP_P0S_4.push({
        x: item.mc_no,
        y: [
          new Date(item.occurred).getTime(),
          new Date(item.restored).getTime(),
        ],
      });
    });

    ganttResult_PART_DROP_P0S_6[0].forEach(async (item) => {
      await data_PART_DROP_P0S_6.push({
        x: item.mc_no,
        y: [
          new Date(item.occurred).getTime(),
          new Date(item.restored).getTime(),
        ],
      });
    });

    ganttResult_REAR_DOOR_OPEN[0].forEach(async (item) => {
      await data_REAR_DOOR_OPEN.push({
        x: item.mc_no,
        y: [
          new Date(item.occurred).getTime(),
          new Date(item.restored).getTime(),
        ],
      });
    });

    ganttResult_SERVO_ALARM[0].forEach(async (item) => {
      await data_SERVO_ALARM.push({
        x: item.mc_no,
        y: [
          new Date(item.occurred).getTime(),
          new Date(item.restored).getTime(),
        ],
      });
    });

    let series_FRONT_DOOR_OPEN = {
      name: "FRONT_DOOR_OPEN",
      data: data_FRONT_DOOR_OPEN,
    };
    let series_CAM_POSITION_ALARM = {
      name: "CAM_POSITION_ALARM",
      data: data_CAM_POSITION_ALARM,
    };
    let series_COOLANT_LOW = { name: "COOLANT_LOW", data: data_COOLANT_LOW };
    let series_DRILL_OUT_ALARM = {
      name: "DRILL_OUT_ALARM",
      data: data_DRILL_OUT_ALARM,
    };
    let series_HANDLE_ENGAGED = {
      name: "HANDLE_ENGAGED",
      data: data_HANDLE_ENGAGED,
    };
    let series_PART_DROP_NO_SETTING = {
      name: "PART_DROP_NO_SETTING",
      data: data_PART_DROP_NO_SETTING,
    };
    let series_PART_DROP_P0S_4 = {
      name: "PART_DROP_P0S_4",
      data: data_PART_DROP_P0S_4,
    };
    let series_PART_DROP_P0S_6 = {
      name: "PART_DROP_P0S_6",
      data: data_PART_DROP_P0S_6,
    };
    let series_REAR_DOOR_OPEN = {
      name: "REAR_DOOR_OPEN",
      data: data_REAR_DOOR_OPEN,
    };
    let series_SERVO_ALARM = { name: "SERVO_ALARM", data: data_SERVO_ALARM };

    let series = [
      series_FRONT_DOOR_OPEN,
      series_CAM_POSITION_ALARM,
      series_COOLANT_LOW,
      series_DRILL_OUT_ALARM,
      series_HANDLE_ENGAGED,
      series_PART_DROP_NO_SETTING,
      series_PART_DROP_P0S_4,
      series_PART_DROP_P0S_6,
      series_REAR_DOOR_OPEN,
      series_SERVO_ALARM,
    ];

    console.log(series);
    res.json({
      series,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});


router.get("/bit_in_forming_usage/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectMc } = req.params;
  console.log(selectMc);

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);

  //console.log('command_column',command_column);
  console.log("command_pivot", command_pivot);

  try {
    let resultMMS = await turning_table.sequelize.query(
      `   WITH cte_quantity
        AS
        ( Select
        [mfg_date]
              ,[pin] 
              ,sum(CASE WHEN [usage] <> '0' THEN 1 ELSE 0 END) as newUsage
        	  ,[node_no_id]
              
          FROM [counter].[dbo].[app_counter_tools_change]
          where  [mfg_date] between '${start_date}'and'${end_date}'and [pin] in('D362') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18')
          group by  [mfg_date] ,[node_no_id],[pin] 
      )

        select [node_no_id],
        ` +
        command_column +
        ` as array
          from cte_quantity
      PIVOT (sum(newUsage)
      FOR [mfg_date] IN (` +
        command_pivot +
        `)
      ) AS pvt
      ORDER BY pvt.[node_no_id]

          `
    );

    arrayData_MMS = resultMMS[0];
    console.log(arrayData_MMS);

    let resultList_MMS = [];
    arrayData_MMS.forEach(function (a) {
      if (!this[a.node_no_id]) {
        this[a.node_no_id] = { name: a.node_no_id, data: [] };
        resultList_MMS.push(this[a.node_no_id]);
      }
      this[a.node_no_id].data.push(a.array);
    }, Object.create(null));

    console.log(resultList_MMS);

    res.json({
      result: resultList_MMS,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_in_drill_usage/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectMc } = req.params;
  console.log(selectMc);

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);

  //console.log('command_column',command_column);
  console.log("command_pivot", command_pivot);

  try {
    let resultMMS = await turning_table.sequelize.query(
      `   WITH cte_quantity
        AS
        ( Select
        [mfg_date]
              ,[pin] 
              ,sum(CASE WHEN [usage] <> '0' THEN 1 ELSE 0 END) as newUsage
        	  ,[node_no_id]
              
          FROM [counter].[dbo].[app_counter_tools_change]
          where  [mfg_date] between '${start_date}'and'${end_date}'and [pin] in('D356') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18')
          group by  [mfg_date] ,[node_no_id],[pin] 
      )

        select [node_no_id],
        ` +
        command_column +
        ` as array
          from cte_quantity
      PIVOT (sum(newUsage)
      FOR [mfg_date] IN (` +
        command_pivot +
        `)
      ) AS pvt
      ORDER BY pvt.[node_no_id]

          `
    );

    arrayData_MMS = resultMMS[0];
    console.log(arrayData_MMS);

    let resultList_MMS = [];
    arrayData_MMS.forEach(function (a) {
      if (!this[a.node_no_id]) {
        this[a.node_no_id] = { name: a.node_no_id, data: [] };
        resultList_MMS.push(this[a.node_no_id]);
      }
      this[a.node_no_id].data.push(a.array);
    }, Object.create(null));

    console.log(resultList_MMS);

    res.json({
      result: resultList_MMS,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_in_center_drill_usage/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectMc } = req.params;
  console.log(selectMc);

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);

  //console.log('command_column',command_column);
  console.log("command_pivot", command_pivot);

  try {
    let resultMMS = await turning_table.sequelize.query(
      `   WITH cte_quantity
        AS
        ( Select
        [mfg_date]
              ,[pin] 
              ,sum(CASE WHEN [usage] <> '0' THEN 1 ELSE 0 END) as newUsage
        	  ,[node_no_id]
              
          FROM [counter].[dbo].[app_counter_tools_change]
          where  [mfg_date] between '${start_date}'and'${end_date}'and [pin] in('D354') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18')
          group by  [mfg_date] ,[node_no_id],[pin] 
      )

        select [node_no_id],
        ` +
        command_column +
        ` as array
          from cte_quantity
      PIVOT (sum(newUsage)
      FOR [mfg_date] IN (` +
        command_pivot +
        `)
      ) AS pvt
      ORDER BY pvt.[node_no_id]

          `
    );

    arrayData_MMS = resultMMS[0];
    console.log(arrayData_MMS);

    let resultList_MMS = [];
    arrayData_MMS.forEach(function (a) {
      if (!this[a.node_no_id]) {
        this[a.node_no_id] = { name: a.node_no_id, data: [] };
        resultList_MMS.push(this[a.node_no_id]);
      }
      this[a.node_no_id].data.push(a.array);
    }, Object.create(null));

    console.log(resultList_MMS);

    res.json({
      result: resultList_MMS,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_in_facing_usage/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectMc } = req.params;
  console.log(selectMc);

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);

  //console.log('command_column',command_column);
  console.log("command_pivot", command_pivot);

  try {
    let resultMMS = await turning_table.sequelize.query(
      `   WITH cte_quantity
        AS
        ( Select
        [mfg_date]
              ,[pin] 
              ,sum(CASE WHEN [usage] <> '0' THEN 1 ELSE 0 END) as newUsage
        	  ,[node_no_id]
              
          FROM [counter].[dbo].[app_counter_tools_change]
          where  [mfg_date] between '${start_date}'and'${end_date}'and [pin] in('D364') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18')
          group by  [mfg_date] ,[node_no_id],[pin] 
      )

        select [node_no_id],
        ` +
        command_column +
        ` as array
          from cte_quantity
      PIVOT (sum(newUsage)
      FOR [mfg_date] IN (` +
        command_pivot +
        `)
      ) AS pvt
      ORDER BY pvt.[node_no_id]

          `
    );

    arrayData_MMS = resultMMS[0];
    console.log(arrayData_MMS);

    let resultList_MMS = [];
    arrayData_MMS.forEach(function (a) {
      if (!this[a.node_no_id]) {
        this[a.node_no_id] = { name: a.node_no_id, data: [] };
        resultList_MMS.push(this[a.node_no_id]);
      }
      this[a.node_no_id].data.push(a.array);
    }, Object.create(null));

    console.log(resultList_MMS);

    res.json({
      result: resultList_MMS,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_in_reamer_usage/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectMc } = req.params;
  console.log(selectMc);

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);

  //console.log('command_column',command_column);
  console.log("command_pivot", command_pivot);

  try {
    let resultMMS = await turning_table.sequelize.query(
      `   WITH cte_quantity
        AS
        ( Select
        [mfg_date]
              ,[pin] 
              ,sum(CASE WHEN [usage] <> '0' THEN 1 ELSE 0 END) as newUsage
        	  ,[node_no_id]
              
          FROM [counter].[dbo].[app_counter_tools_change]
          where  [mfg_date] between '${start_date}'and'${end_date}'and [pin] in('D366') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18')
          group by  [mfg_date] ,[node_no_id],[pin] 
      )

        select [node_no_id],
        ` +
        command_column +
        ` as array
          from cte_quantity
      PIVOT (sum(newUsage)
      FOR [mfg_date] IN (` +
        command_pivot +
        `)
      ) AS pvt
      ORDER BY pvt.[node_no_id]

          `
    );

    arrayData_MMS = resultMMS[0];
    console.log(arrayData_MMS);

    let resultList_MMS = [];
    arrayData_MMS.forEach(function (a) {
      if (!this[a.node_no_id]) {
        this[a.node_no_id] = { name: a.node_no_id, data: [] };
        resultList_MMS.push(this[a.node_no_id]);
      }
      this[a.node_no_id].data.push(a.array);
    }, Object.create(null));

    console.log(resultList_MMS);

    res.json({
      result: resultList_MMS,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_in_recess_usage/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectMc } = req.params;
  console.log(selectMc);

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);

  //console.log('command_column',command_column);
  console.log("command_pivot", command_pivot);

  try {
    let resultMMS = await turning_table.sequelize.query(
      `   WITH cte_quantity
        AS
        ( Select
        [mfg_date]
              ,[pin] 
              ,sum(CASE WHEN [usage] <> '0' THEN 1 ELSE 0 END) as newUsage
        	  ,[node_no_id]
              
          FROM [counter].[dbo].[app_counter_tools_change]
          where  [mfg_date] between '${start_date}'and'${end_date}'and [pin] in('D368') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18')
          group by  [mfg_date] ,[node_no_id],[pin] 
      )

        select [node_no_id],
        ` +
        command_column +
        ` as array
          from cte_quantity
      PIVOT (sum(newUsage)
      FOR [mfg_date] IN (` +
        command_pivot +
        `)
      ) AS pvt
      ORDER BY pvt.[node_no_id]

          `
    );

    arrayData_MMS = resultMMS[0];
    console.log(arrayData_MMS);

    let resultList_MMS = [];
    arrayData_MMS.forEach(function (a) {
      if (!this[a.node_no_id]) {
        this[a.node_no_id] = { name: a.node_no_id, data: [] };
        resultList_MMS.push(this[a.node_no_id]);
      }
      this[a.node_no_id].data.push(a.array);
    }, Object.create(null));

    console.log(resultList_MMS);

    res.json({
      result: resultList_MMS,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_in_cut_off_usage/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectMc } = req.params;
  console.log(selectMc);

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);

  //console.log('command_column',command_column);
  console.log("command_pivot", command_pivot);

  try {
    let resultMMS = await turning_table.sequelize.query(
      `   WITH cte_quantity
        AS
        ( Select
        [mfg_date]
              ,[pin] 
              ,sum(CASE WHEN [usage] <> '0' THEN 1 ELSE 0 END) as newUsage
        	  ,[node_no_id]
              
          FROM [counter].[dbo].[app_counter_tools_change]
          where  [mfg_date] between '${start_date}'and'${end_date}'and [pin] in('D370') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18')
          group by  [mfg_date] ,[node_no_id],[pin] 
      )

        select [node_no_id],
        ` +
        command_column +
        ` as array
          from cte_quantity
      PIVOT (sum(newUsage)
      FOR [mfg_date] IN (` +
        command_pivot +
        `)
      ) AS pvt
      ORDER BY pvt.[node_no_id]

          `
    );

    arrayData_MMS = resultMMS[0];
    console.log(arrayData_MMS);

    let resultList_MMS = [];
    arrayData_MMS.forEach(function (a) {
      if (!this[a.node_no_id]) {
        this[a.node_no_id] = { name: a.node_no_id, data: [] };
        resultList_MMS.push(this[a.node_no_id]);
      }
      this[a.node_no_id].data.push(a.array);
    }, Object.create(null));

    console.log(resultList_MMS);

    res.json({
      result: resultList_MMS,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_forming_usage/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectMc } = req.params;
  console.log(selectMc);

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);

  //console.log('command_column',command_column);
  console.log("command_pivot", command_pivot);

  try {
    let resultMMS = await turning_table.sequelize.query(
      `   WITH cte_quantity
        AS
        ( Select
        [mfg_date]
              ,[pin] 
              ,sum(CASE WHEN [usage] <> '0' THEN 1 ELSE 0 END) as newUsage
        	  ,[node_no_id]
              
          FROM [counter].[dbo].[app_counter_tools_change]
          where  [mfg_date] between '${start_date}'and'${end_date}'and [pin] in('D330') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18')
          group by  [mfg_date] ,[node_no_id],[pin] 
      )

        select [node_no_id],
        ` +
        command_column +
        ` as array
          from cte_quantity
      PIVOT (sum(newUsage)
      FOR [mfg_date] IN (` +
        command_pivot +
        `)
      ) AS pvt
      ORDER BY pvt.[node_no_id]

          `
    );

    arrayData_MMS = resultMMS[0];
    console.log(arrayData_MMS);

    let resultList_MMS = [];
    arrayData_MMS.forEach(function (a) {
      if (!this[a.node_no_id]) {
        this[a.node_no_id] = { name: a.node_no_id, data: [] };
        resultList_MMS.push(this[a.node_no_id]);
      }
      this[a.node_no_id].data.push(a.array);
    }, Object.create(null));

    console.log(resultList_MMS);

    res.json({
      result: resultList_MMS,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_facing_usage/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectMc } = req.params;
  console.log(selectMc);

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);

  //console.log('command_column',command_column);
  console.log("command_pivot", command_pivot);

  try {
    let resultMMS = await turning_table.sequelize.query(
      `   WITH cte_quantity
        AS
        ( Select
        [mfg_date]
              ,[pin] 
              ,sum(CASE WHEN [usage] <> '0' THEN 1 ELSE 0 END) as newUsage
        	  ,[node_no_id]
              
          FROM [counter].[dbo].[app_counter_tools_change]
          where  [mfg_date] between '${start_date}'and'${end_date}'and [pin] in('D332') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18')
          group by  [mfg_date] ,[node_no_id],[pin] 
      )

        select [node_no_id],
        ` +
        command_column +
        ` as array
          from cte_quantity
      PIVOT (sum(newUsage)
      FOR [mfg_date] IN (` +
        command_pivot +
        `)
      ) AS pvt
      ORDER BY pvt.[node_no_id]

          `
    );

    arrayData_MMS = resultMMS[0];
    console.log(arrayData_MMS);

    let resultList_MMS = [];
    arrayData_MMS.forEach(function (a) {
      if (!this[a.node_no_id]) {
        this[a.node_no_id] = { name: a.node_no_id, data: [] };
        resultList_MMS.push(this[a.node_no_id]);
      }
      this[a.node_no_id].data.push(a.array);
    }, Object.create(null));

    console.log(resultList_MMS);

    res.json({
      result: resultList_MMS,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_recess_3_usage/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectMc } = req.params;
  console.log(selectMc);

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);

  //console.log('command_column',command_column);
  console.log("command_pivot", command_pivot);

  try {
    let resultMMS = await turning_table.sequelize.query(
      `   WITH cte_quantity
        AS
        ( Select
        [mfg_date]
              ,[pin] 
              ,sum(CASE WHEN [usage] <> '0' THEN 1 ELSE 0 END) as newUsage
        	  ,[node_no_id]
              
          FROM [counter].[dbo].[app_counter_tools_change]
          where  [mfg_date] between '${start_date}'and'${end_date}'and [pin] in('D334') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18')
          group by  [mfg_date] ,[node_no_id],[pin] 
      )

        select [node_no_id],
        ` +
        command_column +
        ` as array
          from cte_quantity
      PIVOT (sum(newUsage)
      FOR [mfg_date] IN (` +
        command_pivot +
        `)
      ) AS pvt
      ORDER BY pvt.[node_no_id]

          `
    );

    arrayData_MMS = resultMMS[0];
    console.log(arrayData_MMS);

    let resultList_MMS = [];
    arrayData_MMS.forEach(function (a) {
      if (!this[a.node_no_id]) {
        this[a.node_no_id] = { name: a.node_no_id, data: [] };
        resultList_MMS.push(this[a.node_no_id]);
      }
      this[a.node_no_id].data.push(a.array);
    }, Object.create(null));

    console.log(resultList_MMS);

    res.json({
      result: resultList_MMS,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_cut_off_4_usage/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectMc } = req.params;
  console.log(selectMc);

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);

  //console.log('command_column',command_column);
  console.log("command_pivot", command_pivot);

  try {
    let resultMMS = await turning_table.sequelize.query(
      `   WITH cte_quantity
        AS
        ( Select
        [mfg_date]
              ,[pin] 
              ,sum(CASE WHEN [usage] <> '0' THEN 1 ELSE 0 END) as newUsage
        	  ,[node_no_id]
              
          FROM [counter].[dbo].[app_counter_tools_change]
          where  [mfg_date] between '${start_date}'and'${end_date}'and [pin] in('D336') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18')
          group by  [mfg_date] ,[node_no_id],[pin] 
      )

        select [node_no_id],
        ` +
        command_column +
        ` as array
          from cte_quantity
      PIVOT (sum(newUsage)
      FOR [mfg_date] IN (` +
        command_pivot +
        `)
      ) AS pvt
      ORDER BY pvt.[node_no_id]

          `
    );

    arrayData_MMS = resultMMS[0];
    console.log(arrayData_MMS);

    let resultList_MMS = [];
    arrayData_MMS.forEach(function (a) {
      if (!this[a.node_no_id]) {
        this[a.node_no_id] = { name: a.node_no_id, data: [] };
        resultList_MMS.push(this[a.node_no_id]);
      }
      this[a.node_no_id].data.push(a.array);
    }, Object.create(null));

    console.log(resultList_MMS);

    res.json({
      result: resultList_MMS,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_recess_5_usage/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectMc } = req.params;
  console.log(selectMc);

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);

  //console.log('command_column',command_column);
  console.log("command_pivot", command_pivot);

  try {
    let resultMMS = await turning_table.sequelize.query(
      `   WITH cte_quantity
        AS
        ( Select
        [mfg_date]
              ,[pin] 
              ,sum(CASE WHEN [usage] <> '0' THEN 1 ELSE 0 END) as newUsage
        	  ,[node_no_id]
              
          FROM [counter].[dbo].[app_counter_tools_change]
          where  [mfg_date] between '${start_date}'and'${end_date}'and [pin] in('D338') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18')
          group by  [mfg_date] ,[node_no_id],[pin] 
      )

        select [node_no_id],
        ` +
        command_column +
        ` as array
          from cte_quantity
      PIVOT (sum(newUsage)
      FOR [mfg_date] IN (` +
        command_pivot +
        `)
      ) AS pvt
      ORDER BY pvt.[node_no_id]

          `
    );

    arrayData_MMS = resultMMS[0];
    console.log(arrayData_MMS);

    let resultList_MMS = [];
    arrayData_MMS.forEach(function (a) {
      if (!this[a.node_no_id]) {
        this[a.node_no_id] = { name: a.node_no_id, data: [] };
        resultList_MMS.push(this[a.node_no_id]);
      }
      this[a.node_no_id].data.push(a.array);
    }, Object.create(null));

    console.log(resultList_MMS);

    res.json({
      result: resultList_MMS,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_cut_off_6_usage/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectMc } = req.params;
  console.log(selectMc);

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);

  //console.log('command_column',command_column);
  console.log("command_pivot", command_pivot);

  try {
    let resultMMS = await turning_table.sequelize.query(
      `   WITH cte_quantity
        AS
        ( Select
        [mfg_date]
              ,[pin] 
              ,sum(CASE WHEN [usage] <> '0' THEN 1 ELSE 0 END) as newUsage
        	  ,[node_no_id]
              
          FROM [counter].[dbo].[app_counter_tools_change]
          where  [mfg_date] between '${start_date}'and'${end_date}'and [pin] in('D340') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18')
          group by  [mfg_date] ,[node_no_id],[pin] 
      )

        select [node_no_id],
        ` +
        command_column +
        ` as array
          from cte_quantity
      PIVOT (sum(newUsage)
      FOR [mfg_date] IN (` +
        command_pivot +
        `)
      ) AS pvt
      ORDER BY pvt.[node_no_id]

          `
    );

    arrayData_MMS = resultMMS[0];
    console.log(arrayData_MMS);

    let resultList_MMS = [];
    arrayData_MMS.forEach(function (a) {
      if (!this[a.node_no_id]) {
        this[a.node_no_id] = { name: a.node_no_id, data: [] };
        resultList_MMS.push(this[a.node_no_id]);
      }
      this[a.node_no_id].data.push(a.array);
    }, Object.create(null));

    console.log(resultList_MMS);

    res.json({
      result: resultList_MMS,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_drill_usage/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectMc } = req.params;
  console.log(selectMc);

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);

  //console.log('command_column',command_column);
  console.log("command_pivot", command_pivot);

  try {
    let resultMMS = await turning_table.sequelize.query(
      `   WITH cte_quantity
        AS
        ( Select
        [mfg_date]
              ,[pin] 
              ,sum(CASE WHEN [usage] <> '0' THEN 1 ELSE 0 END) as newUsage
        	  ,[node_no_id]
              
          FROM [counter].[dbo].[app_counter_tools_change]
          where  [mfg_date] between '${start_date}'and'${end_date}'and [pin] in('D342') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18')
          group by  [mfg_date] ,[node_no_id],[pin] 
      )

        select [node_no_id],
        ` +
        command_column +
        ` as array
          from cte_quantity
      PIVOT (sum(newUsage)
      FOR [mfg_date] IN (` +
        command_pivot +
        `)
      ) AS pvt
      ORDER BY pvt.[node_no_id]

          `
    );

    arrayData_MMS = resultMMS[0];
    console.log(arrayData_MMS);

    let resultList_MMS = [];
    arrayData_MMS.forEach(function (a) {
      if (!this[a.node_no_id]) {
        this[a.node_no_id] = { name: a.node_no_id, data: [] };
        resultList_MMS.push(this[a.node_no_id]);
      }
      this[a.node_no_id].data.push(a.array);
    }, Object.create(null));

    console.log(resultList_MMS);

    res.json({
      result: resultList_MMS,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_od_bit_usage/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectMc } = req.params;
  console.log(selectMc);

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);
  var command_column = "";
  var command_pivot = "";
  for (let i = 0; i < list_date.length; i++) {
    command_column =
      command_column +
      `CONVERT(varchar, isnull([` +
      list_date[i] +
      `],0))+','+`;
    command_pivot = command_pivot + "],[" + list_date[i];
  }
  command_column = command_column.substring(0, command_column.length - 5);
  command_pivot = command_pivot + "]";
  command_pivot = command_pivot.substring(2);

  //console.log('command_column',command_column);
  console.log("command_pivot", command_pivot);

  try {
    let resultMMS = await turning_table.sequelize.query(
      `   WITH cte_quantity
        AS
        ( Select
        [mfg_date]
              ,[pin] 
              ,sum(CASE WHEN [usage] <> '0' THEN 1 ELSE 0 END) as newUsage
        	  ,[node_no_id]
              
          FROM [counter].[dbo].[app_counter_tools_change]
          where  [mfg_date] between '${start_date}'and'${end_date}'and [pin] in('D348') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18')
          group by  [mfg_date] ,[node_no_id],[pin] 
      )

        select [node_no_id],
        ` +
        command_column +
        ` as array
          from cte_quantity
      PIVOT (sum(newUsage)
      FOR [mfg_date] IN (` +
        command_pivot +
        `)
      ) AS pvt
      ORDER BY pvt.[node_no_id]

          `
    );

    arrayData_MMS = resultMMS[0];
    console.log(arrayData_MMS);

    let resultList_MMS = [];
    arrayData_MMS.forEach(function (a) {
      if (!this[a.node_no_id]) {
        this[a.node_no_id] = { name: a.node_no_id, data: [] };
        resultList_MMS.push(this[a.node_no_id]);
      }
      this[a.node_no_id].data.push(a.array);
    }, Object.create(null));

    console.log(resultList_MMS);

    res.json({
      result: resultList_MMS,
      resultDate: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

/////////////////////////////////////table///////////////////////////////////////

router.get("/bit_in_forming_table/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params; 
  let { end_date } = req.params;

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);

  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select [registered_at], [mfg_date],[usage],[node_no_id]        
      FROM [counter].[dbo].[app_counter_tools_change]
      where [usage] > 0  and [pin] in('D362') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18') and [mfg_date] between '${start_date}' and '${end_date}'
      group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
  order by [registered_at]desc
          `);
    console.log(resultMachine[0]);
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_in_drill_table/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params; 
  let { end_date } = req.params;

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);

  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select [registered_at], [mfg_date],[usage],[node_no_id]        
      FROM [counter].[dbo].[app_counter_tools_change]
      where [usage] > 0  and [pin] in('D356') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18') and [mfg_date] between '${start_date}' and '${end_date}'
      group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
  order by [registered_at]desc
          `);
    console.log(resultMachine[0]);
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_in_center_drill_table/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params; 
  let { end_date } = req.params;

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);

  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select [registered_at], [mfg_date],[usage],[node_no_id]        
      FROM [counter].[dbo].[app_counter_tools_change]
      where [usage] > 0  and [pin] in('D354') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18') and [mfg_date] between '${start_date}' and '${end_date}'
      group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
  order by [registered_at]desc
          `);
    console.log(resultMachine[0]);
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_in_facing_table/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params; 
  let { end_date } = req.params;

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);

  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select [registered_at], [mfg_date],[usage],[node_no_id]        
      FROM [counter].[dbo].[app_counter_tools_change]
      where [usage] > 0  and [pin] in('D364') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18') and [mfg_date] between '${start_date}' and '${end_date}'
      group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
  order by [registered_at]desc
          `);
    console.log(resultMachine[0]);
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_in_reamer_table/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params; 
  let { end_date } = req.params;

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);

  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select [registered_at], [mfg_date],[usage],[node_no_id]        
      FROM [counter].[dbo].[app_counter_tools_change]
      where [usage] > 0  and [pin] in('D366') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18') and [mfg_date] between '${start_date}' and '${end_date}'
      group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
  order by [registered_at]desc
          `);
    console.log(resultMachine[0]);
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_in_recess_table/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params; 
  let { end_date } = req.params;

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);

  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select [registered_at], [mfg_date],[usage],[node_no_id]        
      FROM [counter].[dbo].[app_counter_tools_change]
      where [usage] > 0  and [pin] in('D368') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18') and [mfg_date] between '${start_date}' and '${end_date}'
      group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
  order by [registered_at]desc
          `);
    console.log(resultMachine[0]);
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_in_cut_off_table/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params; 
  let { end_date } = req.params;

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);

  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select [registered_at], [mfg_date],[usage],[node_no_id]        
      FROM [counter].[dbo].[app_counter_tools_change]
      where [usage] > 0  and [pin] in('D370') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18') and [mfg_date] between '${start_date}' and '${end_date}'
      group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
  order by [registered_at]desc
          `);
    console.log(resultMachine[0]);
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_forming_table/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params; 
  let { end_date } = req.params;

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);

  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select [registered_at], [mfg_date],[usage],[node_no_id]        
      FROM [counter].[dbo].[app_counter_tools_change]
      where [usage] > 0  and [pin] in('D330') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18') and [mfg_date] between '${start_date}' and '${end_date}'
      group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
  order by [registered_at]desc
          `);
    console.log(resultMachine[0]);
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_facing_table/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params; 
  let { end_date } = req.params;

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);

  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select [registered_at], [mfg_date],[usage],[node_no_id]        
      FROM [counter].[dbo].[app_counter_tools_change]
      where [usage] > 0  and [pin] in('D332') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18') and [mfg_date] between '${start_date}' and '${end_date}'
      group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
  order by [registered_at]desc
          `);
    console.log(resultMachine[0]);
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_recess_3_table/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params; 
  let { end_date } = req.params;

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);

  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select [registered_at], [mfg_date],[usage],[node_no_id]        
      FROM [counter].[dbo].[app_counter_tools_change]
      where [usage] > 0  and [pin] in('D334') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18') and [mfg_date] between '${start_date}' and '${end_date}'
      group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
  order by [registered_at]desc
          `);
    console.log(resultMachine[0]);
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_cut_off_4_table/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params; 
  let { end_date } = req.params;

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);

  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select [registered_at], [mfg_date],[usage],[node_no_id]        
      FROM [counter].[dbo].[app_counter_tools_change]
      where [usage] > 0  and [pin] in('D336') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18') and [mfg_date] between '${start_date}' and '${end_date}'
      group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
  order by [registered_at]desc
          `);
    console.log(resultMachine[0]);
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_recess_5_table/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params; 
  let { end_date } = req.params;

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);

  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select [registered_at], [mfg_date],[usage],[node_no_id]        
      FROM [counter].[dbo].[app_counter_tools_change]
      where [usage] > 0  and [pin] in('D338') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18') and [mfg_date] between '${start_date}' and '${end_date}'
      group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
  order by [registered_at]desc
          `);
    console.log(resultMachine[0]);
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_cut_off_6_table/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params; 
  let { end_date } = req.params;

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);

  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select [registered_at], [mfg_date],[usage],[node_no_id]        
      FROM [counter].[dbo].[app_counter_tools_change]
      where [usage] > 0  and [pin] in('D340') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18') and [mfg_date] between '${start_date}' and '${end_date}'
      group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
  order by [registered_at]desc
          `);
    console.log(resultMachine[0]);
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_drill_table/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params; 
  let { end_date } = req.params;

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);

  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select [registered_at], [mfg_date],[usage],[node_no_id]        
      FROM [counter].[dbo].[app_counter_tools_change]
      where [usage] > 0  and [pin] in('D342') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18') and [mfg_date] between '${start_date}' and '${end_date}'
      group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
  order by [registered_at]desc
          `);
    console.log(resultMachine[0]);
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

router.get("/bit_out_od_bit_table/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params; 
  let { end_date } = req.params;

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
  console.log("list_date", list_date);

  try {
    let resultMachine = await turning_table.sequelize
      .query(`Select [registered_at], [mfg_date],[usage],[node_no_id]        
      FROM [counter].[dbo].[app_counter_tools_change]
      where [usage] > 0  and [pin] in('D348') and [node_no_id] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18') and [mfg_date] between '${start_date}' and '${end_date}'
      group by  [mfg_date] ,[node_no_id],[usage],[registered_at]
  order by [registered_at]desc
          `);
    console.log(resultMachine[0]);
    arrayData = resultMachine[0];

    res.json({
      result_IRB_worn: arrayData,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.NOK,
    });
  }
});

/////////////////////// MMS /////////////////////////

router.post("/TB_mms_mc", async (req, res) => {
  try {
      let result = await turning_table.sequelize.query(
          `
          SELECT [mc_no]
          FROM [counter].[dbo].[mms]
          where left([mc_no],2) = 'TB' 
          group by [mc_no]
          order by [mc_no]
          `
      );
      return res.json({
          result: result[0],
          api_result: constance.OK
      });
  } catch (error) {
      console.log("************error***************");
      res.json({
          result: error,
          api_result: constance.NOK
      });
  }

});

router.post("/TB_mms_log", async (req, res) => {
  try {
      let Result = await turning_table.sequelize.query(
          `
          /* get status_log*/
      with tb1 as (
          SELECT format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') as mfg_date
          ,IIF(CAST(DATEPART(HOUR, [mc_status].[occurred]) AS int)=0,23,CAST(DATEPART(HOUR, [mc_status].[occurred]) AS int)) as [hour]     
           --,iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]) as [occurred]
           ,[occurred]
          --,lead([occurred]) over(partition by [mc_no] order by [mc_no],[occurred]) AS [NextTimeStamp]
          ,[mc_status]
          ,[mc_no]
          FROM [counter].[dbo].[mc_status]
         ) ,tb2 as (
           select  mfg_date,[occurred] 
                --,[NextTimeStamp]
                 ,lead([occurred]) over(partition by [mc_no] order by [mc_no],[occurred]) AS [NextTimeStamp]
                ,[mc_status]
                ,[mc_no] 
                from tb1
                where [mc_no] ='${req.body.machine}' and  mfg_date = '${req.body.date}'
         )
           select mfg_date,convert(varchar,[occurred],120) as [occurred]
           ,convert(varchar,[NextTimeStamp] ,120) as [NextTimeStamp],[mc_status] from tb2 where [NextTimeStamp] is not null
    `
      );
      return res.json({ result: Result[0] });
  } catch (error) {
      res.json({
          error,
          api_result: constance.NOK,
      })
  }
});

router.post("/Timeline_tb_test", async (req, res) => {
  var  command_process  = ``; 
  if (req.body.responsible == "All") {
      command_process = ``;
  } else {
      command_process = ` and [responsible] = '${req.body.responsible}'`;
  }
  let result = await turning_table.sequelize.query(
      `
      with tb1 as(
          select [topic],
                 format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') as mfg_date
                 ,[occurred]
                 ,[restored]
                --,convert(varchar, [mms].[occurred],120) as [occurred]
                --,convert(varchar, [mms].[restored],120) as [restored]
                ,IIF(CAST(DATEPART(HOUR, [mms].[occurred]) AS int)=0,23,CAST(DATEPART(HOUR, [mms].[occurred]) AS int)) as [hour]
                ,[mc_no]
                ,left([mc_no],2) as propcess 
                ,[sum]
                FROM [counter].[dbo].[mms]
             ) 
             ,tb2 as (
           select tb1.mfg_date,tb1.[topic],tb1.[occurred] ,tb1.[restored],tb1.[hour],tb1.propcess ,tb1.[sum],tb1.[mc_no]
           ,[topic_masters].[responsible]
           from tb1 left join [topic_masters]
           on tb1.[topic] = [topic_masters].[Topic]
           )
             select  mfg_date,[topic]
                  ,convert(varchar,[occurred],120) as [occurred]
                  ,convert(varchar,[restored],120) as [restored],[hour],[sum]
                  ,[responsible],[mc_no]
                  from tb2
                  where mfg_date = '${req.body.date}'
                  and [mc_no] = '${req.body.machine}'
                  ` +
                  command_process +
  `
                  order by CASE
                                WHEN [hour] = 7 THEN 1
                                WHEN [hour] = 8 THEN 2
                                WHEN [hour] = 9 THEN 3
                                WHEN [hour] = 10 THEN 4
                                WHEN [hour] = 11 THEN 5
                                WHEN [hour] = 12 THEN 6
                                WHEN [hour] = 13 THEN 7
                                WHEN [hour] = 14 THEN 8
                                WHEN [hour] = 15 THEN 9
                                WHEN [hour] = 16 THEN 10
                                WHEN [hour] = 17 THEN 11
                                WHEN [hour] = 18 THEN 12
                                WHEN [hour] = 19 THEN 13
                                WHEN [hour] = 20 THEN 14
                                WHEN [hour] = 21 THEN 15
                                WHEN [hour] = 22 THEN 16
                                WHEN [hour] = 23 THEN 17
                                WHEN [hour] = 0 THEN 18
                                WHEN [hour] = 1 THEN 19
                                WHEN [hour] = 2 THEN 20
                                WHEN [hour] = 3 THEN 21
                                WHEN [hour] = 4 THEN 22
                                WHEN [hour] = 5 THEN 23
                               WHEN [hour] = 6 THEN 24
                         else 0   end ,[occurred]
    `
  );
  return res.json({ result: result[0] });
});

router.post("/AlarmTopic_time", async (req, res) => {
  try {
      let Result = await turning_table.sequelize.query(
          `
          /* count time HH:mm:ss */
          with tb1 as(
              select [topic],
              format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') as mfg_date
              ,iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]) as occur_new
              ,iif(DATEPART(HOUR, [restored])<7,dateadd(day,-1,[restored]),[restored]) as [restored]
             --,convert(varchar, [mms].[occurred],120) as [occurred]
             --,convert(varchar, [mms].[restored],120) as [restored]
             ,IIF(CAST(DATEPART(HOUR, [mms].[occurred]) AS int)=0,23,CAST(DATEPART(HOUR, [mms].[occurred]) AS int)) as [hour]
             ,[mc_no]
             ,[sum]
             FROM [counter].[dbo].[mms]
             )
            ,tb2 as ( 
            select  [topic]
             ,sum([sum]) as [Time]
             from tb1
             where mfg_date = '${req.body.date}'
             and [mc_no] = '${req.body.machine}'
             group by [topic]
             ) 
            select top(3) [topic]
            ,[Time]
            ,convert(varchar,DATEADD(s,[Time],0),8) as Alarm
            from tb2
            order by convert(varchar,DATEADD(s,[Time],0),8) desc 
    `
      );
      return res.json({ result: Result[0] });
  } catch (error) {
      res.json({
          error,
          api_result: constance.NOK,
      })
  }
});

router.post("/AlarmTopic_time2", async (req, res) => {
  try {
      let Result = await turning_table.sequelize.query(
          `
          /* count time HH:mm:ss */
          with tb1 as( SELECT 	
              [registered_at],
                  [occurred],
                  [mc_status],
                  [mc_no],
              LEAD(occurred) OVER (ORDER BY occurred ) AS previous,
              LEAD(occurred) OVER (ORDER BY occurred ASC) - occurred AS difference_previous
            FROM [counter].[dbo].[mc_status]
            where [registered_at] between '${req.body.date2}' and '${req.body.dateEnd}' and [mc_no] = '${req.body.machine}'
            )
                          ,tb2 as ( 
                          select  
                          [mc_status],
                            sum(DATEDIFF(SECOND, '0:00:00', [difference_previous] )) as [sec]
                           from tb1
                           where [registered_at] between '${req.body.date2}' and '${req.body.dateEnd}' and [mc_no] = '${req.body.machine}'
                          group by [mc_status]
                           ) 
                          select 
                          [SEC],
                          [mc_status], case
                          when [mc_status] = '0' then 'STOP'
                          when [mc_status] = '1' then 'START'
                          when [mc_status] = '2' then 'ALARM'
                          end as [status]
                          
                          ,convert(varchar,DATEADD(s,[SEC],0),8) as Alarm
                          from tb2
                          order by [status] DESC

            
              
    `
      );
      return res.json({ result: Result[0] });
  } catch (error) {
      res.json({
          error,
          api_result: constance.NOK,
      })
  }
});

router.post("/TB_alert_mc", async (req, res) => {
  //function respone and request
  try {
      let getData = await turning_table.sequelize.query(
          `
         SELECT [mc_no]
          FROM [counter].[dbo].[mms]
          group by [mc_no]
          order by [mc_no]
            `  
      );
      return res.json({
          result: getData[0],
          api_result: constant.OK
      });
  } catch (error) {
      console.log("************error***************");
      res.json({
          result: error,
          api_result: constant.NOK
      });
  }
});

router.post("/getResult", async (req, res) => { 
  try {

      list_date = getDatesInRange(new Date(req.body.date_start), new Date(req.body.date_end));
      console.log(list_date); 

      let date_text = list_date.toString();
      console.log('date_text', date_text);

      let date_text_replaced = `[` + date_text.replace(/,/g, `],[`) + `]`;
      console.log('date_text_replaced', date_text_replaced);

      let date_text_concat = date_text_replaced.replace(/,/g, `,',',`);
      console.log('date_text_concat', date_text_concat); 
      var Responsible = ``;
      if (req.body.responsible == "All") {
          Responsible = ``;
      } else {
          Responsible = ` and [responsible] = '${req.body.responsible}'`;
      }
      let getData = await turning_table.sequelize.query(
          `  
  -- query 2
  with tb1 as(
              select [topic], 
              format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') as mfg_date
              ,[occurred],[restored],[mc_no],left([mc_no],2) as propcess
              ,[sum]
              FROM [counter].[dbo].[mms]  
               )
      ,tb2 as (
               select tb1.mfg_date,tb1.[topic],tb1.[occurred] ,tb1.[restored],tb1.propcess ,tb1.[sum],tb1.[mc_no]
               ,[topic_masters].[responsible]
               from tb1 left join [topic_masters]
               on tb1.[topic] = [topic_masters].[Topic]
               )
      ,tb3 as (select  mfg_date
        ,count([topic]) as [frequency] 
        ,[topic],[responsible]
        from tb2
        where mfg_date between   '${req.body.date_start}' and '${req.body.date_end}'
                 and [mc_no] =  '${req.body.machine}'   
                 ` +
                 Responsible +
 `
        group by mfg_date,topic,[responsible]
      )
      select topic ,[responsible]
     -- ,concat(isnull([2023-03-01],0), ',',isnull([2023-03-02],0), ',',isnull([2023-03-03],0))  as [count]
     ,concat(`+ date_text_concat + `)  as [count]
      from tb3
       Pivot (sum([frequency])
        for [mfg_date] IN (`+ date_text_replaced + `)
          )as pvt order by topic
     `
      );

      // console.log(getData);
      return res.json({
          result: getData[0],
          list_date: list_date,
          api_result: constant.OK
      });
  } catch (error) {
      console.log("************error***************");
      res.json({
          result: error,
          api_result: constant.NOK
      });
  }
});

module.exports = router;
