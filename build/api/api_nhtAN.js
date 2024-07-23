const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const constance = require("../constance/constance");
const moment = require("moment");

// import model

const MBR_table = require("../model/model_natMBR");

// chart product / Yield All AN
router.post("/MMS_prod_yield_AN/:mc_no/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let { mc_no } = req.params;
    console.log("mc_nomc_nomc_nomc_nomc_nomc_no");
    // console.log(mc_no);
    // console.log("click PT", start_date);
    let resultdata = await MBR_table.sequelize.query(` -- chart PD
  SELECT [registered_at]
  ,format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date]
  ,[mc_no],[process],[model],[spec],[d_str1],[d_str2],[rssi],[ok1],[ok2],[ag],[ng],[mix],[tt], [ok1]+[ok2] AS val_ok
  ,[cycle],[target],[error],[alarm],[run],[stop],[wait_p],[full_p],[adjust],[set_up],[plan_s],[spare1],[spare2],[spare3],[spare4],[hr],[min]
  ,cast((3600/NULLIF([target], 0))*100  as decimal(20,0)) as UTL_target
  ,Case when [tt]=0 then 0
  Else cast((([ok1]+[ok2])/[tt])*100  as decimal(20,2)) 
  End as yield
  , FORMAT(registered_at,'HH:mm') as at_time
  FROM [data_machine_an].[dbo].[DATA_PRODUCTION_AN]
  WHERE format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') = '${start_date}'
  AND mc_no = '${mc_no}'
  ORDER BY registered_at ASC
      `);

    let resultdata_UTL = await MBR_table.sequelize
      .query(`SELECT [registered_at]
      ,format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date]
      ,[mc_no],[process],[model],[spec],[d_str1],[d_str2],[rssi],[ok1],[ok2],[ag],[ng],[mix],[tt]
      ,[cycle],[target],[error],[alarm],[run],[stop],[wait_p],[full_p],[adjust],[set_up],[plan_s],[spare1],[spare2],[spare3],[spare4],[hr],[min]
      , FORMAT(registered_at,'HH:mm') as at_time
      ,[ok1]+[ok2] as dairy_ok,[tt] as dairy_total,[cycle] as cycle_time,[Target]
      ,[error]+[alarm]+[stop]+[wait_p]+[full_p]+[adjust]+[set_up]+[plan_s] as DT
      ,cast((3600/NULLIF([target], 0))*100  as decimal(20,0)) as UTL_target
      ,Case when [tt]=0 then 0
      Else cast((([ok1]/[tt]))*100  as decimal(20,2)) 
      End as yield
      ,0 as scal_min ,2400as scal_max,70 as scal_min_YR ,100 as scal_max_YR
      FROM [data_machine_an].[dbo].[DATA_PRODUCTION_AN]
      WHERE format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') = '${start_date}'
      AND mc_no = '${mc_no}'
      ORDER BY registered_at DESC

      `);
    let resultAVG_UTL = await MBR_table.sequelize.query(`
    SELECT CAST(AVG(
      IIF(cast((3600/NULLIF([target], 0))*100  as decimal(20,0)) is not null, cast((3600/NULLIF([target], 0))*100  as decimal(20,0)),0)
      ) as decimal(10, 2))  as UTL_target
    FROM [data_machine_an].[dbo].[DATA_PRODUCTION_AN]
      where mc_no = '${mc_no}' AND FORMAT(IIF(DATEPART(HOUR, [registered_at]) < 8, DATEADD(DAY, -1, [registered_at]), [registered_at]),'yyyy-MM-dd' ) = '${start_date}'
    `);

    // console.log("resultdata",resultdata,resultdata[0].length);
    // console.log("resultdata_UTL",resultdata_UTL);
    // console.log("resultAVG_UTL",resultAVG_UTL);
    if (resultdata[0].length > 0) {
      arrayData = resultdata[0];
      arrayData_yield = resultdata[0];
      let seriesOutput = [];
      let seriesYield = [];
      let seriesTarget = [];
      const index_data = arrayData[0].ok1;
      // console.log("iii",index_data);
      await seriesOutput.push(index_data);
      
      for (let i = 0; i < arrayData.length - 1; i++) {
        // console.log((i+1).toString() + " : " + (arrayData[i+1].ok1 - arrayData[i].ok1).toString())
        await seriesOutput.push(
          // (arrayData[i+1].ok1 - arrayData[i].ok1).toString()
          (arrayData[i + 1].val_ok - arrayData[i].val_ok).toString() < 0
            ? 0
            : (arrayData[i + 1].val_ok - arrayData[i].val_ok).toString()
        );
        // await seriesUTL.push((((arrayData[i+1].ok1 - arrayData[i].ok1)/arrayData[i].target)*100).toString());
        seriesUTL = (
          ((arrayData[i + 1].val_ok - arrayData[i].val_ok) /
            arrayData[i].target) *
          100
        ).toString();
    }
      // console.log("seriesOutput", seriesOutput);
      for (let index = 0; index < arrayData_yield.length; index++) {
        const item = arrayData_yield[index];
        await seriesYield.push(item.yield);
        await seriesTarget.push(item.UTL_target);
      }
      // let max_prod = Math.max(...seriesOutput)
      let final_max_prod =
        Math.max(...seriesOutput) > 2000 ? Math.max(...seriesOutput) : 2400;
      // console.log(Math.max(...seriesOutput) > 2000 ? Math.max(...seriesOutput) : 2400);
      if (
        Math.max(...seriesTarget) > Math.max(...seriesOutput) &&
        Math.max(...seriesTarget) > 2400
      ) {
        final_max_prod = Math.max(...seriesTarget) + 100;
      } else if (
        Math.max(...seriesOutput) > Math.max(...seriesTarget) &&
        Math.max(...seriesOutput) > 2400
      ) {
        final_max_prod = Math.max(...seriesOutput) + 100;
      } else {
        final_max_prod = 2400;
      }
      // console.log("PD", seriesOutput);
      // seriesTarget.shift();
      let seriesOutput_new = {
        name: "Production",
        type: "column",
        data: seriesOutput,
      };
      let seriesTarget_new = {
        name: "Yield rate",
        type: "line",
        data: seriesYield,
      };
      let seriesYieldrate_new = {
        name: "Target",
        type: "line",
        data: seriesTarget,
      };
  
      // console.log(Math.max(...array))
      // console.log("seriesOutput_new ====>", seriesYield.splice(seriesYield.indexOf( 77 ), 1));
      let seriesNew = [seriesOutput_new, seriesYieldrate_new, seriesTarget_new];
      // console.log("click PT result =====>, seriesNew" ,seriesOutput);
      
    res.json({
      resultOutput_MBR: seriesNew,
      result_PD: seriesOutput,
      result_TG: seriesYield,
      result: resultdata, // chart PD
      result_box: resultdata_UTL,
      result_AVG_utl: resultAVG_UTL,
      result_ok: seriesOutput,
      max_prod: final_max_prod,
    });
    } else {
      // console.log("0000");
      res.json({
        resultOutput_MBR: [],
        result_PD: [],
        result_TG: [],
        result: [], // chart PD
        result_box: [],
        result_AVG_utl: 0,
        result_ok: [],
        max_prod: 0,
      });
    }
   
    // console.log(resultdata[0][0].model);
    // console.log("lllll", resultOutput_MBR);
  } catch (error) {
    console.log(error);
    // res.json({
    //   resultOutput_MBR: error,
    //   api_result: constance.result_nok,
    // });
  }
});

// chart down time All AN
router.get("/chart_downtime_AN/:mc_no/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let { mc_no } = req.params;
    console.log("click DT", start_date);
    let resultdata = await MBR_table.sequelize.query(`-- Down time
    SELECT TOP (1)[registered_at]
    ,format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date]
    ,[mc_no], model,[error],[alarm],[run],[stop],[wait_p],[full_p],[adjust],[set_up],[plan_s]
    FROM [data_machine_an].[dbo].[DATA_PRODUCTION_AN]
    where mc_no = '${mc_no}' and format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') ='${start_date}'
    order by registered_at desc
      `);

    arrayData = resultdata[0];
    let seriesDT = [];
    let seriesName = [
      "Full_Part",
      "RUN",
      "Alarm",
      "ERROR",
      "STOP",
      "W/P",
      "Adjust",
      "Set change",
      "Plan_Stop",
    ];

    for (let index = 0; index < arrayData.length; index++) {
      const item = arrayData[index];
      await seriesDT.push(
        item.full_p,
        item.run,
        item.alarm,
        item.error,
        item.stop,
        item.wait_p,
        item.adjust,
        item.set_up,
        item.plan_s
      );
    }
    // console.log("click seriesDT=====>", seriesDT);

    res.json({
      resultDT_AN: seriesDT,
      resultSeriesName: seriesName,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});

// production total by last time
router.post("/MMS_prod_total_yield_AN/:date/:mc/:hour",
  async (req, res) => {
    let { mc } = req.params;
    let { hour } = req.params;
    let { date } = req.params;
    try {
      let result = await MBR_table.sequelize.query(
        `WITH RankedData AS (
          SELECT
            [registered_at],
            format([registered_at],'HH:mm') as time,model,
            format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date],
            [mc_no],
            [ok1]+[ok2] as dairy_ok,
            [tt] as dairy_total,
            COALESCE(CAST((3600 / NULLIF(CAST([target] AS DECIMAL), 0)) * 100 AS DECIMAL(20, 0)), 0) AS UTL_target,
            [cycle],
            [target],
            [run],
            Case when [tt]=0 then 0
                 Else cast((([ok1]+[ok2])/[tt])*100 as decimal(20,2))
            End as yield,
            LAG([ok1]) OVER (PARTITION BY [mc_no] ORDER BY [registered_at]) AS prev_dairy_ok
          FROM [data_machine_an].[dbo].[DATA_PRODUCTION_AN]
          WHERE
            mc_no LIKE '${mc}%'
            AND FORMAT(IIF(DATEPART(HOUR, [registered_at]) < 8, DATEADD(DAY, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') = '${date}'
        )
        SELECT
          [registered_at],
          [time],
          [model],
          [mfg_date],
          [mc_no],
          [dairy_ok] - ISNULL([prev_dairy_ok], 0) AS diff_dairy_ok,
          [dairy_ok],
          [dairy_total],
          [UTL_target],
          [cycle],
          [target],
          [run],
          [yield]
        FROM RankedData
        where DATEPART(HOUR,registered_at) = '${hour}'
        ORDER BY [mc_no] ASC, [registered_at] ASC;
      
      `
      );

      const rawData = result[0];
      const formattedData = rawData.map((row) => row.diff_dairy_ok.toString());
      const Data_MC = rawData.map((row) => row.mc_no.toString());
      const data_Yield = rawData.map((row) => row.yield.toString());
      const data_Target = rawData.map((row) => row.UTL_target.toString());

      let final_max_prod =
      Math.max(...formattedData) > 2000 ? Math.max(...formattedData) : 2400;
    // console.log(Math.max(...formattedData) > 2000 ? Math.max(...formattedData) : 2400);
    if (
      Math.max(...data_Target) > Math.max(...formattedData) &&
      Math.max(...data_Target) > 2400
    ) {
      final_max_prod = Math.max(...data_Target) + 100;
    } else if (
      Math.max(...formattedData) > Math.max(...data_Target) &&
      Math.max(...formattedData) > 2400
    ) {
      final_max_prod = Math.max(...formattedData) + 100;
    } else {
      final_max_prod = 2400;
    }
      // console.log(data_Target);
      const chartData = [
        {
          name: "Production",
          type: "column",
          data: formattedData,
        },
        {
          name: "Target",
          type: "column",
          data: data_Target,
        },
        {
          name: "Yield Rate",
          type: "line",
          data: data_Yield,
        },
      ];
      const ProdTotal = rawData.reduce((sum, item) => {
        // Convert dairy_ok to number and add to the sum
        sum += Number(item.dairy_ok);
        return sum;
      }, 0);
      
      // console.log('Total dairy_ok:', ProdTotal);
      res.json({
        // resultBall: BallUsage[0],
        result: result[0],
        result_data: chartData,
        result_mc: Data_MC,
        ProdTotal:ProdTotal,
        scal_max: final_max_prod,

        // resultTarget_turn: seriesTarget_new,
      });
    } catch (error) {
      // console.log(error);
      res.json({
        error,
        api_result: constance.result_nok,
      });
    }
  }
);

// table total mornitor mc
router.post("/autoNoise_mornitoring_all/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
  console.log(req.body, start_date,moment().format("yyyy-MM-DD"));
  const hour = parseInt(moment().format("HH"), 10);
// if (hour >= 0 && hour <= 7) {
//   console.log("8888 >> ", hour);
// } else {
//   console.log("lllll");
// }
  if (start_date === moment().format("yyyy-MM-DD")) {
    // if (req.body.yesterday != start_date) {
      console.log("ok");
      // ใช้ [dairy_total] หา UTL
      let result = await MBR_table.sequelize.query(`
      -- today === moment
      with result as (SELECT
        [mfg_date] ,[mc_no],[model]
      , MAX(CASE WHEN RN = 1 THEN format(registered_at,'HH:mm:ss') ELSE NULL END) time
      , MAX(CASE WHEN RN = 1 THEN [dairy_ok] ELSE NULL END) production_ok
      , MAX(CASE WHEN RN = 1 THEN [dairy_ng] ELSE NULL END) production_ng
      , MAX(CASE WHEN RN = 1 THEN [dairy_total] ELSE NULL END) production_total
      , MAX(CASE WHEN RN = 1 THEN [registered_at] ELSE NULL END) Last_Date
      , MAX(CASE WHEN RN = 1 THEN [wait_p] ELSE NULL END) wait_time
      , MAX(CASE WHEN RN = 1 THEN [dairy_total] ELSE NULL END) - COALESCE(MAX(CASE WHEN RN = 2 THEN [dairy_total] ELSE NULL END), 0) PROD_DIFF
      --, MAX(CASE WHEN RN = 1 THEN [dairy_ok] ELSE NULL END) - COALESCE(MAX(CASE WHEN RN = 2 THEN [dairy_ok] ELSE NULL END), 0) PROD_DIFF
        ,MAX(CASE WHEN RN = 1 THEN [adjust]+[alarm]+[stop]+[error]+[full_p]+[plan_s]+[set_up]+[wait_p]  ELSE NULL END) DT
        , MAX(CASE WHEN RN = 1 THEN cast((3600/NULLIF([cycle_time], 0))*100  as decimal(20,0)) ELSE NULL END) UTL_target
      , MAX(CASE WHEN RN = 1 THEN [cycle_time]/100 ELSE NULL END)  ct
      , MAX(CASE WHEN RN = 1 THEN (Case when [dairy_total]=0 then 0
                        Else cast(([dairy_ok]/[dairy_total])*100  as decimal(20,2))
                        End ) ELSE NULL END) yield
      , MAX(CASE WHEN RN = 1 THEN [ag] ELSE NULL END) ag
      , MAX(CASE WHEN RN = 1 THEN [ng] ELSE NULL END) ng
      , MAX(CASE WHEN RN = 1 THEN [mix] ELSE NULL END) mix
      FROM
      (
          SELECT format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date]
                  ,[mc_no], [model],[ok1]+[ok2] as [dairy_ok],[ag]+[ng]+[mix] as [dairy_ng],[tt] as [dairy_total],[registered_at],[cycle] as [cycle_time]
        ,[error],[alarm],[stop],[wait_p],[full_p],[adjust],[set_up],[plan_s],[ag],[ng],[mix]
          ,ROW_NUMBER() OVER (PARTITION BY [mc_no] ORDER BY [registered_at] DESC) RN
          FROM [data_machine_an].[dbo].[DATA_PRODUCTION_AN]
        where format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') = '${start_date}'
      ) t1
      GROUP BY [mc_no],[model],[mfg_date]
      )
      select [mfg_date],CONVERT(char(5), time, 108) as at_time,UPPER([mc_no]) AS mc_no,[model],production_ok,production_ng,production_total,Last_Date,PROD_DIFF,DT,wait_time,UTL_target,cast((PROD_DIFF/NULLIF(UTL_target,0))*100  as decimal(20,2)) as UTL,ct, yield
      ,IIF(ct> 3.5,'red','') as bg_ct, IIF(cast((PROD_DIFF/NULLIF(UTL_target,0))*100  as decimal(20,2)) < 80,'red',IIF(cast((PROD_DIFF/NULLIF(UTL_target,0))*100  as decimal(20,2)) > 100,'green','')) as bg_utl, IIF(yield < 80,'red','') as bg_yield
      ,[ag],[ng],[mix]
      from result
      order by mc_no asc
      `);
      console.log("======= DATA TODAY Table Mornitoring =======");
      // SUM Prod
      const data1 = result[0];
      
      const sumProductionTotalsByModel = (data) => {
        return data.reduce((acc, item) => {
          // แยกตัวอักษรและตัวเลขใน mc_no
          const model = item.mc_no.match(/^[A-Z]+/)[0];
          const productionTotal = item.production_total !== null ? item.production_total : 0;
          
          if (!acc[model]) {
            acc[model] = 0;
          }
          acc[model] += productionTotal;
          return acc;
        }, {});
      };
      
      const result_prod_total = sumProductionTotalsByModel(data1);
      // console.log(result_prod_total);

const totalSum = Object.values(result_prod_total).reduce((acc, curr) => acc + curr, 0);

// console.log("sum",totalSum); // Output: 599929

      
      res.json({
        result: result,
        result_prod_total: result_prod_total,
        totalSum:totalSum,
        api_result: constance.result_ok,
      });
    } else {
      let result = await MBR_table.sequelize.query(
        `with tb2 as(SELECT [registered_at]
          , convert(varchar, [registered_at], 8) as time
          ,format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date]
          ,[mc_no],model, [tt] as [dairy_total] ,[ok1]+[ok2] as [dairy_ok] ,[ag]+[ng]+[mix] as [dairy_ng]
          ,cast(((3600*24)/NULLIF([cycle], 0))*100  as decimal(20,0)) as UTL_target
          ,[cycle] ,[target] as [target_utl],ag,ng,mix
          ,cast((([ok1]+[ok2])/NULLIF(cast(((3600*24)/NULLIF([cycle], 0))*100  as decimal(20,0)), 0))*100 as decimal(20,2)) as utl
            ,[run],[wait_p] AS wait_time
            ,[adjust]+[alarm]+[stop]+[error]+[full_p]+[plan_s]+[set_up]+[wait_p] as DT
            ,Case when [tt]=0 then 0
            Else cast((([ok1]+[ok2])/[tt])*100  as decimal(20,2))
            End as yield
            FROM [data_machine_an].[dbo].[DATA_PRODUCTION_AN]
            where format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') = '${start_date}' and DATEPART(HOUR,registered_at) = '7'
            )
            ,tb3 as (select [mfg_date],tb2.time,mc_no,model,[dairy_ok],[dairy_ng],dairy_total, SUM(UTL_target) as sum_utl,DT,wait_time,yield
            ,cast(([dairy_total]/NULLIF(SUM(UTL_target), 0))*100  as decimal(20,2)) as UTL, [cycle]/100 as ct,ag,ng,mix
            from tb2
            group by mc_no,model,DT,wait_time,[mfg_date],[dairy_ok],[dairy_ng],dairy_total,yield,cycle,tb2.time,ag,ng,mix)
            select mfg_date,UPPER(mc_no) As mc_no, model,dairy_ok as production_ok,[dairy_ng] as production_ng,[dairy_total] as production_total,DT,wait_time,yield,UTL,ct
            ,IIF(UTL < 80 ,'red',IIF(UTL < 80 ,'green','')) as bg_utl
            ,IIF(yield < 80 ,'red','') as bg_yield
            ,IIF(ct> 3.5,'red','') as bg_ct
            ,CONVERT(char(5), time, 108) as at_time
            ,ag,ng,mix
            from tb3
            order by mc_no asc
        `
      );
      console.log("======= NOK Table Mornitoring =======");
      // SUM Prod
      const data1 = result[0];
      
      const sumProductionTotalsByModel = (data) => {
        return data.reduce((acc, item) => {
          // แยกตัวอักษรและตัวเลขใน mc_no
          const model = item.mc_no.match(/^[A-Z]+/)[0];
          const productionTotal = item.production_total !== null ? item.production_total : 0;
          
          if (!acc[model]) {
            acc[model] = 0;
          }
          acc[model] += productionTotal;
          return acc;
        }, {});
      };
      
      const result_prod_total = sumProductionTotalsByModel(data1);
const totalSum = Object.values(result_prod_total).reduce((acc, curr) => acc + curr, 0);
res.json({
        result: result,
        result_prod_total: result_prod_total,
        totalSum: totalSum,
        api_result: constance.result_ok,
      });
    }
    console.log("หยุด");
  } catch (error) {
    res.json({
      result: error,
      api_result: constance.result_nok,
    });
  }
});
module.exports = router;
