const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const constance = require("../constance/constance");
const moment = require("moment");

// import model

const MBR_table = require("../model/model_natMBR");

//ball usage monthly
router.get("/MBRC_Ball_All/", async (req, res) => {
  try {
    let resultdata_Ball_All = await MBR_table.sequelize.query(
      `WITH cte_quantity
      AS
      (SELECT
        datepart(hour,[registered_at]) as newHours
          ,[mfg_date]
          ,max([ball_c1_ok])*6 as totalSize10
          ,max([ball_c2_ok])*6 as totalSize20
          ,max([ball_c3_ok])*6 as totalSize30
          ,max([ball_c4_ok])*6 as totalSize40
          ,max([ball_c5_ok])*6 as totalSize50
        ,[mc_no],model
        FROM [counter].[dbo].[app_counter_accumoutput_new]
        where  (model like '%830%' or model like '')
        group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
        UNION ALL 
      SELECT
        datepart(hour,[registered_at]) as newHours
          ,[mfg_date]
          ,max([ball_c1_ok])*7 as totalSize7_MC10
          ,max([ball_c2_ok])*7 as totalSize7_MC20
          ,max([ball_c3_ok])*7 as totalSize7_MC30
          ,max([ball_c4_ok])*7 as totalSize7_MC40
          ,max([ball_c5_ok])*7 as totalSize7_MC50
        ,[mc_no],model
        FROM [counter].[dbo].[app_counter_accumoutput_new]
        where (model like '%626%' or model like '%608%' or model like '%6202%' or model like '%840%' or model like '%940%' or model like '%1340%' or model like '%1560%' or model like '%626%')
        group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
        UNION ALL
      SELECT
        datepart(hour,[registered_at]) as newHours
          ,[mfg_date]
          ,max([ball_c1_ok])*8 as totalSize8_MC10
          ,max([ball_c2_ok])*8 as totalSize8_MC20
          ,max([ball_c3_ok])*8 as totalSize8_MC30
          ,max([ball_c4_ok])*8 as totalSize8_MC40
          ,max([ball_c5_ok])*8 as totalSize8_MC50
        ,[mc_no],model
        FROM [counter].[dbo].[app_counter_accumoutput_new]
        where (model like '%1350%' or model like '%1360%' or model like '%6001%' )
        group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
        UNION ALL
      SELECT
        datepart(hour,[registered_at]) as newHours
          ,[mfg_date]
          ,max([ball_c1_ok])*9 as totalSize9_MC10
          ,max([ball_c2_ok])*9 as totalSize9_MC20
          ,max([ball_c3_ok])*9 as totalSize9_MC30
          ,max([ball_c4_ok])*9 as totalSize9_MC40
          ,max([ball_c5_ok])*9 as totalSize9_MC50
        ,[mc_no],model
        FROM [counter].[dbo].[app_counter_accumoutput_new]
        where (model like '%1680%' or model like '%1660%' or model like '%1060%' or model like '%6002%' )
        group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
      UNION ALL
      SELECT
        datepart(hour,[registered_at]) as newHours
          ,[mfg_date]
          ,max([ball_c1_ok])*15 as totalSize15_MC10
          ,max([ball_c2_ok])*15 as totalSize15_MC20
          ,max([ball_c3_ok])*15 as totalSize15_MC30
          ,max([ball_c4_ok])*15 as totalSize15_MC40
          ,max([ball_c5_ok])*15 as totalSize15_MC50
        ,[mc_no],model
        FROM [counter].[dbo].[app_counter_accumoutput_new]
        where (model like '%6803%'  )
        group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
   )
   ,tb3 as (
   SELECT  FORMAT([mfg_date], 'yyyy MMM') as Year_Month,
   FORMAT([mfg_date], 'yyyy') as newYear
  ,sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
  ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
  ,sum(totalSize50) as totalSize50,[mc_no]
  FROM cte_quantity as Alias_table
  group by FORMAT([mfg_date], 'yyyy MMM') ,[mc_no],FORMAT([mfg_date], 'yyyy')
  )
  
  select [mc_no] , sum(totalSize10) as newtotalSize10, sum(totalSize20) as newtotalSize20
  ,sum(totalSize30) as newtotalSize30, sum(totalSize40) as newtotalSize40
  ,sum(totalSize50) as newtotalSize50, [Year_Month],[newYear],
  CASE
    WHEN [Year_Month]  LIKE '%Jan%'  THEN 'a'
    WHEN [Year_Month]  LIKE '%Feb%'  THEN 'b'
    WHEN [Year_Month]  LIKE '%Mar%'  THEN 'c'
    WHEN [Year_Month]  LIKE '%Apr%'  THEN 'd' 
    WHEN [Year_Month]  LIKE '%May%'  THEN 'e'						 
    WHEN [Year_Month]  LIKE '%Jun%'  THEN 'f'						 
    WHEN [Year_Month]  LIKE '%Jul%'  THEN 'g'						 
    WHEN [Year_Month]  LIKE '%Aug%'  THEN 'h'						 
    WHEN [Year_Month]  LIKE '%Sep%'  THEN 'i'						 
    WHEN [Year_Month]  LIKE '%Oct%'  THEN 'j'						 
    WHEN [Year_Month]  LIKE '%Nov%'  THEN 'k'						 
    WHEN [Year_Month]  LIKE '%Dec%'  THEN 'l'						 
        ELSE 'other'
    END as _month
  From tb3
  group by [Year_Month],[mc_no],[newYear]
  order by [newYear] asc, _month asc`
      //       `WITH cte_quantity
      //     AS
      //     (SELECT [mfg_date]
      //   ,max([ball_c1_ok])*6 as totalSize_MC10
      // ,max([ball_c2_ok])*6 as totalSize_MC20
      // ,max([ball_c3_ok])*6 as totalSize_MC30
      // ,max([ball_c4_ok])*6 as totalSize_MC40
      // ,max([ball_c5_ok])*6 as totalSize_MC50,[mc_no]
      //         FROM [counter].[dbo].[app_counter_accumoutput_new]
      //  group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no]
      //  )
      //  ,tb3 as (
      //  SELECT  FORMAT([mfg_date], 'yyyy MMM') as Year_Month,
      //  FORMAT([mfg_date], 'yyyy') as newYear
      // ,sum(totalSize_MC10) as totalSize10,sum(totalSize_MC20) as totalSize20
      // ,sum(totalSize_MC30) as totalSize30,sum(totalSize_MC40) as totalSize40
      // ,sum(totalSize_MC50) as totalSize50,[mc_no]
      // FROM cte_quantity as Alias_table
      // group by FORMAT([mfg_date], 'yyyy MMM') ,[mc_no],FORMAT([mfg_date], 'yyyy')
      // )

      // select [mc_no] , sum(totalSize10) as newtotalSize10, sum(totalSize20) as newtotalSize20
      // ,sum(totalSize30) as newtotalSize30, sum(totalSize40) as newtotalSize40
      // ,sum(totalSize50) as newtotalSize50, [Year_Month],[newYear],
      // CASE
      //   WHEN [Year_Month]  LIKE '%Jan%'  THEN 'a'
      //   WHEN [Year_Month]  LIKE '%Feb%'  THEN 'b'
      //   WHEN [Year_Month]  LIKE '%Mar%'  THEN 'c'
      //   WHEN [Year_Month]  LIKE '%Apr%'  THEN 'd'
      //   WHEN [Year_Month]  LIKE '%May%'  THEN 'e'
      //   WHEN [Year_Month]  LIKE '%Jun%'  THEN 'f'
      //   WHEN [Year_Month]  LIKE '%Jul%'  THEN 'g'
      //   WHEN [Year_Month]  LIKE '%Aug%'  THEN 'h'
      //   WHEN [Year_Month]  LIKE '%Sep%'  THEN 'i'
      //   WHEN [Year_Month]  LIKE '%Oct%'  THEN 'j'
      //   WHEN [Year_Month]  LIKE '%Nov%'  THEN 'k'
      //   WHEN [Year_Month]  LIKE '%Dec%'  THEN 'l'
      //       ELSE 'other'
      //   END as _month
      // From tb3
      // group by [Year_Month],[mc_no],[newYear]
      // order by [newYear] asc, _month asc
      //         `
    );

    console.log(resultdata_Ball_All);
    arrayData_Ball_All = resultdata_Ball_All[0];

    let resultUsage_Ball_All = [];
    arrayData_Ball_All.forEach(function (a) {
      if (!this[a.mc_no]) {
        this[a.mc_no] = { name: a.mc_no, data: [] };
        resultUsage_Ball_All.push(this[a.mc_no]);
      }
      this[a.mc_no].data.push(
        a.newtotalSize10,
        a.newtotalSize20,
        a.newtotalSize30,
        a.newtotalSize40,
        a.newtotalSize50
      );
    }, Object.create(null));

    let BallUsage_All = [resultUsage_Ball_All];
    let resultDate_Ball = [];
    arrayData_Ball_All.forEach(function (a) {
      if (!this[a.Year_Month]) {
        this[a.Year_Month] = { name: a.Year_Month };
        resultDate_Ball.push(this[a.Year_Month]);
      }
    }, Object.create(null));

    let newDate_Ball = [];
    for (let index = 0; index < resultDate_Ball.length; index++) {
      const item = resultDate_Ball[index];
      await newDate_Ball.push(item.name);
    }

    // console.log(BallUsage_All[0]);
    // console.log(newDate_Ball);

    res.json({
      resultBall_All: BallUsage_All[0],
      resultDateBall_All: newDate_Ball,

      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});

//table total by machine
router.get("/MBRC_Ball_tb/:yesterday", async (req, res) => {
  console.log(req.body);
  console.log("==========MBRC_Ball_tb=================");
  try {
    let { yesterday } = req.params;
    let { end_yesterday } = req.params;
    let resultdata_Ball = await MBR_table.sequelize.query(
      `with tb1 as(SELECT
        datepart(hour,[registered_at]) as newHours
            ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
            ,max([ball_c1_ok])*6 as totalSize10
            ,max([ball_c2_ok])*6 as totalSize20
            ,max([ball_c3_ok])*6 as totalSize30
            ,max([ball_c4_ok])*6 as totalSize40
            ,max([ball_c5_ok])*6 as totalSize50
          ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
       FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
       where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') = '${yesterday}'  and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12])))  like '%830%' )  and datepart(hour,[registered_at]) in ('7' )  -- or model like '')
       group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
      ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
   UNION ALL 
      SELECT
        datepart(hour,[registered_at]) as newHours
          ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
          ,max([ball_c1_ok])*7 as totalSize7_MC10
          ,max([ball_c2_ok])*7 as totalSize7_MC20
          ,max([ball_c3_ok])*7 as totalSize7_MC30
          ,max([ball_c4_ok])*7 as totalSize7_MC40
          ,max([ball_c5_ok])*7 as totalSize7_MC50
        ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
       FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
        where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') = '${yesterday}'  and ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%626%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%608%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%6202%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%840%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%940%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1340%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1560%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%627%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%730%') and datepart(hour,[registered_at]) in ('7' ) 
        group by registered_at,[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
      ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
      UNION ALL 
      SELECT
        datepart(hour,[registered_at]) as newHours
          ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
          ,max([ball_c1_ok])*8 as totalSize8_MC10
          ,max([ball_c2_ok])*8 as totalSize8_MC20
          ,max([ball_c3_ok])*8 as totalSize8_MC30
          ,max([ball_c4_ok])*8 as totalSize8_MC40
          ,max([ball_c5_ok])*8 as totalSize8_MC50
        ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
       FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
        where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') = '${yesterday}'  and ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1350%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1360%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%6001%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%630%'  ) and datepart(hour,[registered_at]) in ('7' ) 
        group by registered_at,[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
      ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
      UNION ALL 
      SELECT
        datepart(hour,[registered_at]) as newHours
          ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
          ,max([ball_c1_ok])*9 as totalSize9_MC10
          ,max([ball_c2_ok])*9 as totalSize9_MC20
          ,max([ball_c3_ok])*9 as totalSize9_MC30
          ,max([ball_c4_ok])*9 as totalSize9_MC40
          ,max([ball_c5_ok])*9 as totalSize9_MC50
        ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
       FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
        where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') = '${yesterday}'  and ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1680%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1660%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1060%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%6002%' ) and datepart(hour,[registered_at]) in ('7' ) 
        group by registered_at,[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
      ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
      UNION ALL 
      SELECT
        datepart(hour,[registered_at]) as newHours
          ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
          ,max([ball_c1_ok])*10 as totalSize10_MC10
          ,max([ball_c2_ok])*10 as totalSize10_MC20
          ,max([ball_c3_ok])*10 as totalSize10_MC30
          ,max([ball_c4_ok])*10 as totalSize10_MC40
          ,max([ball_c5_ok])*10 as totalSize10_MC50
        ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
       FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
        where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') = '${yesterday}'  and ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1889%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1260%') and datepart(hour,[registered_at]) in ('7' ) 
        group by registered_at,[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
      ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
      UNION ALL 
      SELECT
        datepart(hour,[registered_at]) as newHours
          ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
          ,max([ball_c1_ok])*11 as totalSize11_MC10
          ,max([ball_c2_ok])*11 as totalSize11_MC20
          ,max([ball_c3_ok])*11 as totalSize11_MC30
          ,max([ball_c4_ok])*11 as totalSize11_MC40
          ,max([ball_c5_ok])*11 as totalSize11_MC50
        ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
       FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
        where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') = '${yesterday}'  and ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%740%') and datepart(hour,[registered_at]) in ('7' ) 
        group by registered_at,[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
      ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
     UNION ALL 
      SELECT
        datepart(hour,[registered_at]) as newHours
          ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
          ,max([ball_c1_ok])*13 as totalSize13_MC10
          ,max([ball_c2_ok])*13 as totalSize13_MC20
          ,max([ball_c3_ok])*13 as totalSize13_MC30
          ,max([ball_c4_ok])*13 as totalSize13_MC40
          ,max([ball_c5_ok])*13 as totalSize13_MC50
        ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
       FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
        where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') = '${yesterday}'  and ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%850%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%614%') and datepart(hour,[registered_at]) in ('7' ) 
        group by registered_at,[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
      ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
       UNION ALL 
      SELECT
        datepart(hour,[registered_at]) as newHours
          ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
          ,max([ball_c1_ok])*15 as totalSize15_MC10
          ,max([ball_c2_ok])*15 as totalSize15_MC20
          ,max([ball_c3_ok])*15 as totalSize15_MC30
          ,max([ball_c4_ok])*15 as totalSize15_MC40
          ,max([ball_c5_ok])*15 as totalSize15_MC50
        ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
       FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
        where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') = '${yesterday}'  and ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%6803%') and datepart(hour,[registered_at]) in ('7' ) 
        group by registered_at,[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
      ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
  )
        SELECT
          sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
          ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
          ,sum(totalSize50) as totalSize50,[mc_no],model,[mfg_date]
        FROM tb1
          group by [mc_no],model,[mfg_date]
    order by mc_no asc`
      //     `SELECT datepart(hour,PROD.[registered_at])
      //     ,PROD.[mc_no],[mfg_date],[model]
      //     ,max([Ball_C1_OK])*6 as totalSize10
      //     ,max([Ball_C2_OK])*6 as totalSize20
      //     ,max([Ball_C3_OK])*6 as totalSize30
      //     ,max([Ball_C4_OK])*6 as totalSize40
      //     ,max([Ball_C5_OK])*6 as totalSize50
      // FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY] as PROD
      // left join [master_data].[dbo].[data_model_spec] as MODEL
      // on PROD.mc_no = MODEL.mc_no -- (format(iif(DATEPART(HOUR, PROD.[registered_at])<7,dateadd(day,-1,PROD.[registered_at]),PROD.[registered_at]),'yyyy-MM-dd')) = MODEL.mfg_date
      // where [mfg_date] = '${yesterday}' and datepart(hour,PROD.[registered_at]) in ('7' )  and (model like '%830%' or model like '')
      //     GROUP BY [mfg_date],PROD.[mc_no],[model],datepart(hour, PROD.[registered_at])
      //     UNION ALL
      //   SELECT datepart(hour,PROD.[registered_at])
      //     ,PROD.[mc_no],[mfg_date],[model]
      //     ,max([Ball_C1_OK])*7 as totalSize10
      //     ,max([Ball_C2_OK])*7 as totalSize20
      //     ,max([Ball_C3_OK])*7 as totalSize30
      //     ,max([Ball_C4_OK])*7 as totalSize40
      //     ,max([Ball_C5_OK])*7 as totalSize50
      // FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY] as PROD
      // left join [master_data].[dbo].[data_model_spec] as MODEL
      // on PROD.mc_no = MODEL.mc_no -- (format(iif(DATEPART(HOUR, PROD.[registered_at])<7,dateadd(day,-1,PROD.[registered_at]),PROD.[registered_at]),'yyyy-MM-dd')) = MODEL.mfg_date
      // where [mfg_date] = '${yesterday}' and datepart(hour,PROD.[registered_at]) in ('7' ) and (model like '%626%' or model like '%608%' or model like '%6202%' or model like '%840%' or model like '%940%' or model like '%1340%' or model like '%1560%' or model like '%730%')
      //     GROUP BY [mfg_date],PROD.[mc_no],[model],datepart(hour, PROD.[registered_at])
      //     UNION ALL
      //   SELECT datepart(hour,PROD.[registered_at])
      //     ,PROD.[mc_no],[mfg_date],[model]
      //     ,max([Ball_C1_OK])*8 as totalSize10
      //     ,max([Ball_C2_OK])*8 as totalSize20
      //     ,max([Ball_C3_OK])*8 as totalSize30
      //     ,max([Ball_C4_OK])*8 as totalSize40
      //     ,max([Ball_C5_OK])*8 as totalSize50
      // FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY] as PROD
      // left join [master_data].[dbo].[data_model_spec] as MODEL
      // on PROD.mc_no = MODEL.mc_no -- (format(iif(DATEPART(HOUR, PROD.[registered_at])<7,dateadd(day,-1,PROD.[registered_at]),PROD.[registered_at]),'yyyy-MM-dd')) = MODEL.mfg_date
      //     where [mfg_date] = '${yesterday}' and datepart(hour,PROD.[registered_at]) in ('7' )  and (model like '%1350%' or model like '%1360%' or model like '%6001%' or model like '%6002%' or model like '%630%'  )
      //     GROUP BY [mfg_date],PROD.[mc_no],[model],datepart(hour, PROD.[registered_at])
      //     UNION ALL
      //   SELECT datepart(hour,PROD.[registered_at])
      //     ,PROD.[mc_no],[mfg_date],[model]
      //     ,max([Ball_C1_OK])*9 as totalSize10
      //     ,max([Ball_C2_OK])*9 as totalSize20
      //     ,max([Ball_C3_OK])*9 as totalSize30
      //     ,max([Ball_C4_OK])*9 as totalSize40
      //     ,max([Ball_C5_OK])*9 as totalSize50
      // FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY] as PROD
      // left join [master_data].[dbo].[data_model_spec] as MODEL
      // on PROD.mc_no = MODEL.mc_no -- (format(iif(DATEPART(HOUR, PROD.[registered_at])<7,dateadd(day,-1,PROD.[registered_at]),PROD.[registered_at]),'yyyy-MM-dd')) = MODEL.mfg_date
      // where [mfg_date] = '${yesterday}' and datepart(hour,PROD.[registered_at]) in ('7' )  and (model like '%1680%' or model like '%1660%' or model like '%1060%' )
      //     GROUP BY [mfg_date],PROD.[mc_no],[model],datepart(hour, PROD.[registered_at])
      //     UNION ALL
      //     SELECT datepart(hour,PROD.[registered_at])
      //     ,PROD.[mc_no],[mfg_date],[model]
      //     ,max([Ball_C1_OK])*11 as totalSize10
      //     ,max([Ball_C2_OK])*11 as totalSize20
      //     ,max([Ball_C3_OK])*11 as totalSize30
      //     ,max([Ball_C4_OK])*11 as totalSize40
      //     ,max([Ball_C5_OK])*11 as totalSize50
      // FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY] as PROD
      // left join [master_data].[dbo].[data_model_spec] as MODEL
      // on PROD.mc_no = MODEL.mc_no -- (format(iif(DATEPART(HOUR, PROD.[registered_at])<7,dateadd(day,-1,PROD.[registered_at]),PROD.[registered_at]),'yyyy-MM-dd')) = MODEL.mfg_date
      // where [mfg_date] = '${yesterday}' and datepart(hour,PROD.[registered_at]) in ('7' )  and (model like '%740%')
      //       GROUP BY [mfg_date],PROD.[mc_no],[model],datepart(hour, PROD.[registered_at])
      //       UNION ALL
      //       SELECT datepart(hour,PROD.[registered_at])
      //     ,PROD.[mc_no],[mfg_date],[model]
      //     ,max([Ball_C1_OK])*13 as totalSize10
      //     ,max([Ball_C2_OK])*13 as totalSize20
      //     ,max([Ball_C3_OK])*13 as totalSize30
      //     ,max([Ball_C4_OK])*13 as totalSize40
      //     ,max([Ball_C5_OK])*13 as totalSize50
      // FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY] as PROD
      // left join [master_data].[dbo].[data_model_spec] as MODEL
      // on PROD.mc_no = MODEL.mc_no -- (format(iif(DATEPART(HOUR, PROD.[registered_at])<7,dateadd(day,-1,PROD.[registered_at]),PROD.[registered_at]),'yyyy-MM-dd')) = MODEL.mfg_date
      // where [mfg_date] = '${yesterday}'  and (model like '%850%' or model like '%614%' ) and datepart(hour,PROD.[registered_at]) in ('7' )
      //         GROUP BY [mfg_date],PROD.[mc_no],[model],datepart(hour, PROD.[registered_at])

      //       UNION ALL
      //   SELECT datepart(hour,PROD.[registered_at])
      //     ,PROD.[mc_no],[mfg_date],[model]
      //     ,max([Ball_C1_OK])*15 as totalSize10
      //     ,max([Ball_C2_OK])*15 as totalSize20
      //     ,max([Ball_C3_OK])*15 as totalSize30
      //     ,max([Ball_C4_OK])*15 as totalSize40
      //     ,max([Ball_C5_OK])*15 as totalSize50
      // FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY] as PROD
      // left join [master_data].[dbo].[data_model_spec] as MODEL
      // on PROD.mc_no = MODEL.mc_no -- (format(iif(DATEPART(HOUR, PROD.[registered_at])<7,dateadd(day,-1,PROD.[registered_at]),PROD.[registered_at]),'yyyy-MM-dd')) = MODEL.mfg_date
      // where [mfg_date] = '${yesterday}'  and datepart(hour,PROD.[registered_at]) in ('7' )  and (model like '%6803%'  )
      //     GROUP BY [mfg_date],PROD.[mc_no],[model],datepart(hour, PROD.[registered_at])
      //     order by mc_no asc`
    );

    // console.log(resultdata_Ball);
    arrayData_Ball = resultdata_Ball[0];
    let ballsize = [
      "BALL GRADE -5.0",
      "BALL GRADE -2.5",
      "BALL GRADE 0.0",
      "BALL GRADE +2.5",
      "BALL GRADE +5.0",
    ];
    let resultUsage_Ball = [];
    let mc_no_Name = [];
    arrayData_Ball.forEach(function (a) {
      if (!this[a.mc_no]) {
        this[a.mc_no] = { name: a.mc_no, data: [] };
        resultUsage_Ball.push(this[a.mc_no]);
        // this[a.ballsize] = { name: a.ballsize };
        // mc_no_Name.push(this[a.ballsize]);
        // mc_no_Name.push(ballsize);
      }
      this[a.mc_no].data.push(
        a.totalSize10,
        a.totalSize20,
        a.totalSize30,
        a.totalSize40,
        a.totalSize50
      );
    }, Object.create(null));
    // console.log(resultUsage_Ball);
    // set arr all value
    let getarr1 = [];
    let getarr2 = [];
    let getarr3 = [];
    let getarr4 = [];
    let getarr5 = [];
    for (let index = 0; index < resultUsage_Ball.length; index++) {
      const item = resultUsage_Ball[index];
      await getarr1.push(item.data[0]);
      await getarr2.push(item.data[1]);
      await getarr3.push(item.data[2]);
      await getarr4.push(item.data[3]);
      await getarr5.push(item.data[4]);
    }
    let getarr = [];
    getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
    // console.log("getarr");
    // console.log(getarr);
    //set name ball
    let namemc = [];
    for (let index = 0; index < resultUsage_Ball.length; index++) {
      const item = resultUsage_Ball[index];
      await namemc.push(item.name);
    }
    //set name ball
    let nameball = [];
    for (let index = 0; index < mc_no_Name.length; index++) {
      const item = mc_no_Name[index];
      await nameball.push(item.name);
    }
    // console.log(namemc);
    //set arr name,data
    let dataset = [];
    for (let index = 0; index < getarr.length; index++) {
      dataset.push({
        // name: nameball[index],
        name: ballsize[index],
        data: getarr[index],
      });
    }

    // console.log(dataset);

    let BallUsage = [resultUsage_Ball];
    let resultDate_Ball = [];
    arrayData_Ball.forEach(function (a) {
      if (!this[a.mfg_date]) {
        this[a.mfg_date] = { name: a.mfg_date };
        resultDate_Ball.push(this[a.mfg_date]);
      }
    }, Object.create(null));

    let newDate_Ball = [];
    for (let index = 0; index < resultDate_Ball.length; index++) {
      const item = resultDate_Ball[index];
      await newDate_Ball.push(item.name);
    }

    // console.log(BallUsage[0]);
    console.log("=======Table=======");
    // console.log(dataset);
    // console.log(newDate_Ball);

    res.json({
      // resultBall: BallUsage[0],
      result: resultdata_Ball,
      resultBall: dataset,
      resultDateBall: newDate_Ball,
      result_mcname: namemc,
      result_ballname: nameball,

      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});

// chart total :Ball usage (%) by Machine -- all size [old]
router.get("/MBRC_Ball/:start_date/:end_date", async (req, res) => {
  try {
    let { datetoday } = req.params;
    let { start_date } = req.params;
    let { end_date } = req.params;
    let resultdata_Ball = await MBR_table.sequelize.query(
      `  with tb1 as(SELECT
        datepart(hour,[registered_at]) as newHours
          ,[mfg_date]
          ,max([ball_c1_ok])*6 as totalSize10
          ,max([ball_c2_ok])*6 as totalSize20
          ,max([ball_c3_ok])*6 as totalSize30
          ,max([ball_c4_ok])*6 as totalSize40
          ,max([ball_c5_ok])*6 as totalSize50
        ,[mc_no],model
        FROM [counter].[dbo].[app_counter_accumoutput_new]
        where [mfg_date] between '${start_date}'and'${end_date}'  and (model like '%830%' or model like '')
        group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
        UNION ALL 
      SELECT
        datepart(hour,[registered_at]) as newHours
          ,[mfg_date]
          ,max([ball_c1_ok])*7 as totalSize7_MC10
          ,max([ball_c2_ok])*7 as totalSize7_MC20
          ,max([ball_c3_ok])*7 as totalSize7_MC30
          ,max([ball_c4_ok])*7 as totalSize7_MC40
          ,max([ball_c5_ok])*7 as totalSize7_MC50
        ,[mc_no],model
        FROM [counter].[dbo].[app_counter_accumoutput_new]
        where [mfg_date] between '${start_date}'and'${end_date}' and (model like '%626%' or model like '%608%' or model like '%6202%' or model like '%840%' or model like '%940%' or model like '%1340%' or model like '%1560%' or model like '%730%' or model like '%627%')
        group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
        UNION ALL
      SELECT
        datepart(hour,[registered_at]) as newHours
          ,[mfg_date]
          ,max([ball_c1_ok])*8 as totalSize8_MC10
          ,max([ball_c2_ok])*8 as totalSize8_MC20
          ,max([ball_c3_ok])*8 as totalSize8_MC30
          ,max([ball_c4_ok])*8 as totalSize8_MC40
          ,max([ball_c5_ok])*8 as totalSize8_MC50
        ,[mc_no],model
        FROM [counter].[dbo].[app_counter_accumoutput_new]
        where [mfg_date] between '${start_date}'and'${end_date}' and (model like '%1350%' or model like '%1360%' or model like '%6001%' )
        group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
        UNION ALL
      SELECT
        datepart(hour,[registered_at]) as newHours
          ,[mfg_date]
          ,max([ball_c1_ok])*9 as totalSize9_MC10
          ,max([ball_c2_ok])*9 as totalSize9_MC20
          ,max([ball_c3_ok])*9 as totalSize9_MC30
          ,max([ball_c4_ok])*9 as totalSize9_MC40
          ,max([ball_c5_ok])*9 as totalSize9_MC50
        ,[mc_no],model
        FROM [counter].[dbo].[app_counter_accumoutput_new]
        where [mfg_date] between '${start_date}'and'${end_date}' and (model like '%1680%' or model like '%1660%' or model like '%1060%' or model like '%6002%')
        group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
      UNION ALL
      SELECT
        datepart(hour,[registered_at]) as newHours
          ,[mfg_date]
          ,max([ball_c1_ok])*15 as totalSize15_MC10
          ,max([ball_c2_ok])*15 as totalSize15_MC20
          ,max([ball_c3_ok])*15 as totalSize15_MC30
          ,max([ball_c4_ok])*15 as totalSize15_MC40
          ,max([ball_c5_ok])*15 as totalSize15_MC50
        ,[mc_no],model
        FROM [counter].[dbo].[app_counter_accumoutput_new]
        where [mfg_date] between '${start_date}'and'${end_date}' and (model like '%6803%'  )
        group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
        --order by mc_no asc
          )
          SELECT
            sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
            ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
            ,sum(totalSize50) as totalSize50,[mc_no]
          FROM tb1
            group by [mc_no]`
    );

    // console.log(resultdata_Ball);
    arrayData_Ball = resultdata_Ball[0];
    let ballsize = [
      "BALL GRADE -5.0",
      "BALL GRADE -2.5",
      "BALL GRADE 0.0",
      "BALL GRADE +2.5",
      "BALL GRADE +5.0",
    ];
    let resultUsage_Ball = [];
    let mc_no_Name = [];
    arrayData_Ball.forEach(function (a) {
      if (!this[a.mc_no]) {
        this[a.mc_no] = { name: a.mc_no, data: [] };
        resultUsage_Ball.push(this[a.mc_no]);
        // this[a.ballsize] = { name: a.ballsize };
        // mc_no_Name.push(this[a.ballsize]);
        // mc_no_Name.push(ballsize);
      }
      this[a.mc_no].data.push(
        a.totalSize10,
        a.totalSize20,
        a.totalSize30,
        a.totalSize40,
        a.totalSize50
      );
    }, Object.create(null));
    // set arr all value
    let getarr1 = [];
    let getarr2 = [];
    let getarr3 = [];
    let getarr4 = [];
    let getarr5 = [];

    for (let index = 0; index < resultUsage_Ball.length; index++) {
      const item = resultUsage_Ball[index];
      await getarr1.push(item.data[0]);
      await getarr2.push(item.data[1]);
      await getarr3.push(item.data[2]);
      await getarr4.push(item.data[3]);
      await getarr5.push(item.data[4]);
    }
    let getarr = [];
    getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
    // console.log("getarr");
    // console.log(getarr);
    //set name ball
    let namemc = [];
    for (let index = 0; index < resultUsage_Ball.length; index++) {
      const item = resultUsage_Ball[index];
      await namemc.push(item.name);
    }
    //set name ball
    let nameball = [];
    for (let index = 0; index < mc_no_Name.length; index++) {
      const item = mc_no_Name[index];
      await nameball.push(item.name);
    }
    // console.log(namemc);
    //set arr name,data
    let dataset = [];
    for (let index = 0; index < getarr.length; index++) {
      dataset.push({
        // name: nameball[index],
        name: ballsize[index],
        data: getarr[index],
      });
    }

    // console.log(dataset);

    let BallUsage = [resultUsage_Ball];
    let resultDate_Ball = [];mms_mbrmd_total
    arrayData_Ball.forEach(function (a) {
      if (!this[a.mfg_date]) {
        this[a.mfg_date] = { name: a.mfg_date };
        resultDate_Ball.push(this[a.mfg_date]);
      }
    }, Object.create(null));

    let newDate_Ball = [];
    for (let index = 0; index < resultDate_Ball.length; index++) {
      const item = resultDate_Ball[index];
      await newDate_Ball.push(item.name);
    }

    // console.log(BallUsage[0]);
    console.log("==============");
    // console.log(dataset);
    // console.log(newDate_Ball);

    res.json({
      // resultBall: BallUsage[0],
      result: resultdata_Ball,
      resultBall: dataset,
      resultDateBall: newDate_Ball,
      result_mcname: namemc,
      result_ballname: nameball,

      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});

// chart total :Ball usage (%) by Machine -- Process MA
router.post("/MBRC_Ball_Size_MA/:start_date/:end_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let { end_date } = req.params;
    if (req.body.type === "SUJ") {
      if (req.body.size === "1.0") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
              ,max([ball_c1_ok])*13 as totalSize10
              ,max([ball_c2_ok])*13 as totalSize20
              ,max([ball_c3_ok])*13 as totalSize30
              ,max([ball_c4_ok])*13 as totalSize40
              ,max([ball_c5_ok])*13 as totalSize50
            ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
            FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
            group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
        ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12]
        ,datepart(hour,[registered_at])
            )
            SELECT
              sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
              ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
              ,sum(totalSize50) as totalSize50,[mc_no]
            FROM tb1
            where [mfg_date] between '${start_date}' and '${end_date}'  and (model like '%614%' )--and datepart(hour,[registered_at]) in ('7' )  -- or model like '')
              group by [mc_no]`
        );
        console.log(" size 1.0");
        // console.log(resultdata_Ball);
        arrayData_Ball = resultdata_Ball[0];
        let ballsize = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        let resultUsage_Ball = [];
        let mc_no_Name = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mc_no]) {
            this[a.mc_no] = { name: a.mc_no, data: [] };
            resultUsage_Ball.push(this[a.mc_no]);
            // this[a.ballsize] = { name: a.ballsize };
            // mc_no_Name.push(this[a.ballsize]);
            // mc_no_Name.push(ballsize);
          }
          this[a.mc_no].data.push(
            a.totalSize10,
            a.totalSize20,
            a.totalSize30,
            a.totalSize40,
            a.totalSize50
          );
        }, Object.create(null));
        // set arr all value
        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];

        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        // console.log("getarr");
        // console.log(getarr);
        //set name ball
        let namemc = [];
        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await namemc.push(item.name);
        }
        //set name ball
        let nameball = [];
        for (let index = 0; index < mc_no_Name.length; index++) {
          const item = mc_no_Name[index];
          await nameball.push(item.name);
        }
        // console.log(namemc);
        //set arr name,data
        let dataset = [];
        for (let index = 0; index < getarr.length; index++) {
          dataset.push({
            // name: nameball[index],
            name: ballsize[index],
            data: getarr[index],
          });
        }

        console.log(dataset);

        let BallUsage = [resultUsage_Ball];
        let resultDate_Ball = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(BallUsage[0]);
        console.log("==============");
        // console.log(dataset);
        // console.log("==============");
        // console.log(newDate_Ball);

        res.json({
          // resultBall: BallUsage[0],
          result: resultdata_Ball,
          resultBall: dataset,
          resultDateBall: newDate_Ball,
          result_mcname: namemc,
          result_ballname: nameball,

          // resultTarget_turn: seriesTarget_new,
        });
      } else if (req.body.size === "1/16") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          ` with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
                ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                ,max([ball_c1_ok])*6 as totalSize10
                ,max([ball_c2_ok])*6 as totalSize20
                ,max([ball_c3_ok])*6 as totalSize30
                ,max([ball_c4_ok])*6 as totalSize40
                ,max([ball_c5_ok])*6 as totalSize50
              ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
           FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
           where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}' and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12])))  like '%830%' ) -- and datepart(hour,[registered_at]) in ('7' )  -- or model like '')
           group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
       UNION ALL 
          SELECT
            datepart(hour,[registered_at]) as newHours
              ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
              ,max([ball_c1_ok])*7 as totalSize7_MC10
              ,max([ball_c2_ok])*7 as totalSize7_MC20
              ,max([ball_c3_ok])*7 as totalSize7_MC30
              ,max([ball_c4_ok])*7 as totalSize7_MC40
              ,max([ball_c5_ok])*7 as totalSize7_MC50
            ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
           FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
            where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}' and ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%940%') --and datepart(hour,[registered_at]) in ('7' ) 
            group by registered_at,[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
            )
            SELECT
              sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
              ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
              ,sum(totalSize50) as totalSize50,[mc_no]
            FROM tb1
              group by [mc_no]`
        );
        console.log("======= 1/16 =======");

        // console.log(resultdata_Ball);
        let arrayData_Ball = resultdata_Ball[0];
        let ballsize = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        let resultUsage_Ball = [];
        let mc_no_Name = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mc_no]) {
            this[a.mc_no] = { name: a.mc_no, data: [] };
            resultUsage_Ball.push(this[a.mc_no]);
            // this[a.ballsize] = { name: a.ballsize };
            // mc_no_Name.push(this[a.ballsize]);
            // mc_no_Name.push(ballsize);
          }
          this[a.mc_no].data.push(
            a.totalSize10,
            a.totalSize20,
            a.totalSize30,
            a.totalSize40,
            a.totalSize50
          );
        }, Object.create(null));
        // set arr all value
        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];

        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        // console.log("getarr");
        // console.log(getarr);
        //set name ball
        let namemc = [];
        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await namemc.push(item.name);
        }
        //set name ball
        let nameball = [];
        for (let index = 0; index < mc_no_Name.length; index++) {
          const item = mc_no_Name[index];
          await nameball.push(item.name);
        }
        console.log(nameball);
        //set arr name,data
        let dataset = [];
        for (let index = 0; index < getarr.length; index++) {
          dataset.push({
            // name: nameball[index],
            name: ballsize[index],
            data: getarr[index],
          });
        }

        console.log(dataset);

        let BallUsage = [resultUsage_Ball];
        let resultDate_Ball = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(BallUsage[0]);
        console.log("==============");
        // console.log(dataset);
        // console.log(newDate_Ball);

        res.json({
          // resultBall: BallUsage[0],
          result: resultdata_Ball,
          resultBall: dataset,
          resultDateBall: newDate_Ball,
          result_mcname: namemc,
          result_ballname: nameball,

          // resultTarget_turn: seriesTarget_new,
        });
      } else if (req.body.size === "1/32") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `		with tb1 as(
            SELECT
              datepart(hour,[registered_at]) as newHours
                ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                ,max([ball_c1_ok])*8 as totalSize10
                ,max([ball_c2_ok])*8 as totalSize20
                ,max([ball_c3_ok])*8 as totalSize30
                ,max([ball_c4_ok])*8 as totalSize40
                ,max([ball_c5_ok])*8 as totalSize50
              ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
           FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
              where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd')  between '${start_date}' and '${end_date}'  
        and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%630%' )--and datepart(hour,[registered_at]) in ('7' )  -- or model like '')
              group by registered_at,[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
              UNION ALL
            SELECT
              datepart(hour,[registered_at]) as newHours
                ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                ,max([ball_c1_ok])*11 as totalSize9_MC10
                ,max([ball_c2_ok])*11 as totalSize9_MC20
                ,max([ball_c3_ok])*11 as totalSize9_MC30
                ,max([ball_c4_ok])*11 as totalSize9_MC40
                ,max([ball_c5_ok])*11 as totalSize9_MC50
              ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
           FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
              where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd')  between '${start_date}' 
        and '${end_date}'  and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%740%') --and datepart(hour,[registered_at]) in ('7' ) 
              group by registered_at,[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
            UNION ALL
            SELECT
              datepart(hour,[registered_at]) as newHours
                ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                ,max([ball_c1_ok])*13 as totalSize15_MC10
                ,max([ball_c2_ok])*13 as totalSize15_MC20
                ,max([ball_c3_ok])*13 as totalSize15_MC30
                ,max([ball_c4_ok])*13 as totalSize15_MC40
                ,max([ball_c5_ok])*13 as totalSize15_MC50
              ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
           FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
              where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd')  between '${start_date}' and '${end_date}'  
        and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%850%'  ) --and datepart(hour,[registered_at]) in ('7' ) 
              group by registered_at,[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
            --order by mc_no asc
                )
            SELECT
              sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
              ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
              ,sum(totalSize50) as totalSize50,[mc_no]
            FROM tb1
              group by [mc_no]`
        );
        console.log("===== 1/32 ======");
        arrayData_Ball = resultdata_Ball[0];
        let ballsize = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        let resultUsage_Ball = [];
        let mc_no_Name = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mc_no]) {
            this[a.mc_no] = { name: a.mc_no, data: [] };
            resultUsage_Ball.push(this[a.mc_no]);
            // this[a.ballsize] = { name: a.ballsize };
            // mc_no_Name.push(this[a.ballsize]);
            // mc_no_Name.push(ballsize);
          }
          this[a.mc_no].data.push(
            a.totalSize10,
            a.totalSize20,
            a.totalSize30,
            a.totalSize40,
            a.totalSize50
          );
        }, Object.create(null));
        // set arr all value
        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];

        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        // console.log("getarr");
        // console.log(getarr);
        //set name ball
        let namemc = [];
        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await namemc.push(item.name);
        }
        //set name ball
        let nameball = [];
        for (let index = 0; index < mc_no_Name.length; index++) {
          const item = mc_no_Name[index];
          await nameball.push(item.name);
        }
        // console.log(namemc);
        //set arr name,data
        let dataset = [];
        for (let index = 0; index < getarr.length; index++) {
          dataset.push({
            // name: nameball[index],
            name: ballsize[index],
            data: getarr[index],
          });
        }

        console.log(dataset);

        let BallUsage = [resultUsage_Ball];
        let resultDate_Ball = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(BallUsage[0]);
        console.log("==============");
        // console.log(dataset);
        // console.log(newDate_Ball);

        res.json({
          // resultBall: BallUsage[0],
          result: resultdata_Ball,
          resultBall: dataset,
          resultDateBall: newDate_Ball,
          result_mcname: namemc,
          result_ballname: nameball,

          // resultTarget_turn: seriesTarget_new,
        });
      } else if (req.body.size === "3/64") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
              ,max([ball_c1_ok])*11 as totalSize10
              ,max([ball_c2_ok])*11 as totalSize20
              ,max([ball_c3_ok])*11 as totalSize30
              ,max([ball_c4_ok])*11 as totalSize40
              ,max([ball_c5_ok])*11 as totalSize50
            ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
           +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
           +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
           +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
            FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
            where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd')  between '${start_date}' and '${end_date}'  
        and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
           +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
           +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
           +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%740%' ) --and datepart(hour,[registered_at]) in ('7' )  -- or model like '')
            group by registered_at,[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
        ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
            UNION ALL 
          SELECT
            datepart(hour,[registered_at]) as newHours
              ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
              ,max([ball_c1_ok])*13 as totalSize7_MC10
              ,max([ball_c2_ok])*13 as totalSize7_MC20
              ,max([ball_c3_ok])*13 as totalSize7_MC30
              ,max([ball_c4_ok])*13 as totalSize7_MC40
              ,max([ball_c5_ok])*13 as totalSize7_MC50
            ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
           +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
           +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
           +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
            FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
            where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd')   between '${start_date}' and '${end_date}'  
        and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
           +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
           +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
           +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%850%') --and datepart(hour,[registered_at]) in ('7' )
            group by registered_at,[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
           )
            SELECT
              sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
              ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
              ,sum(totalSize50) as totalSize50,[mc_no]
            FROM tb1
              group by [mc_no]
  `
        );
        console.log("===== 3/64 ======");

        // console.log(resultdata_Ball);
        arrayData_Ball = resultdata_Ball[0];
        let ballsize = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        let resultUsage_Ball = [];
        let mc_no_Name = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mc_no]) {
            this[a.mc_no] = { name: a.mc_no, data: [] };
            resultUsage_Ball.push(this[a.mc_no]);
            // this[a.ballsize] = { name: a.ballsize };
            // mc_no_Name.push(this[a.ballsize]);
            // mc_no_Name.push(ballsize);
          }
          this[a.mc_no].data.push(
            a.totalSize10,
            a.totalSize20,
            a.totalSize30,
            a.totalSize40,
            a.totalSize50
          );
        }, Object.create(null));
        // set arr all value
        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];

        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        // console.log("getarr");
        // console.log(getarr);
        //set name ball
        let namemc = [];
        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await namemc.push(item.name);
        }
        //set name ball
        let nameball = [];
        for (let index = 0; index < mc_no_Name.length; index++) {
          const item = mc_no_Name[index];
          await nameball.push(item.name);
        }
        // console.log(namemc);
        //set arr name,data
        let dataset = [];
        for (let index = 0; index < getarr.length; index++) {
          dataset.push({
            // name: nameball[index],
            name: ballsize[index],
            data: getarr[index],
          });
        }

        console.log(dataset);

        let BallUsage = [resultUsage_Ball];
        let resultDate_Ball = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(BallUsage[0]);
        console.log("==============");
        // console.log(dataset);
        // console.log(newDate_Ball);

        res.json({
          // resultBall: BallUsage[0],
          result: resultdata_Ball,
          resultBall: dataset,
          resultDateBall: newDate_Ball,
          result_mcname: namemc,
          result_ballname: nameball,

          // resultTarget_turn: seriesTarget_new,
        });
      }
    } else {
      res.json({
        result: "NO DATA",
        api_result: constance.result_ok,
      });
    }
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});

// chart total :Ball usage (%) by Machine -- all size [old]
router.post("/MBRC_Ball_Size_MD/:start_date/:end_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let { end_date } = req.params;
    if (req.body.type === "SUJ") {
      console.log("MD ============== MD ============== MD");
      if (req.body.size === "1/4") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours ,[mc_no]
        ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
            ,max([ball_c1_ok])*7 as totalSize10
            ,max([ball_c2_ok])*7 as totalSize20
            ,max([ball_c3_ok])*7 as totalSize30
            ,max([ball_c4_ok])*7 as totalSize40
            ,max([ball_c5_ok])*7 as totalSize50
        ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
          FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
          where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}'
        and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%6202%' ) 
              group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
              )
                SELECT
                  sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
                  ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
                  ,sum(totalSize50) as totalSize50,[mc_no]
                FROM tb1
                  group by [mc_no]`
        );

        // console.log(resultdata_Ball);
        arrayData_Ball = resultdata_Ball[0];
        let ballsize = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        let resultUsage_Ball = [];
        let mc_no_Name = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mc_no]) {
            this[a.mc_no] = { name: a.mc_no, data: [] };
            resultUsage_Ball.push(this[a.mc_no]);
            // this[a.ballsize] = { name: a.ballsize };
            // mc_no_Name.push(this[a.ballsize]);
            // mc_no_Name.push(ballsize);
          }
          this[a.mc_no].data.push(
            a.totalSize10,
            a.totalSize20,
            a.totalSize30,
            a.totalSize40,
            a.totalSize50
          );
        }, Object.create(null));
        // set arr all value
        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];

        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        // console.log("getarr");
        // console.log(getarr);
        //set name ball
        let namemc = [];
        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await namemc.push(item.name);
        }
        //set name ball
        let nameball = [];
        for (let index = 0; index < mc_no_Name.length; index++) {
          const item = mc_no_Name[index];
          await nameball.push(item.name);
        }
        // console.log(namemc);
        //set arr name,data
        let dataset = [];
        for (let index = 0; index < getarr.length; index++) {
          dataset.push({
            // name: nameball[index],
            name: ballsize[index],
            data: getarr[index],
          });
        }

        // console.log(dataset);

        let BallUsage = [resultUsage_Ball];
        let resultDate_Ball = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(BallUsage[0]);
        console.log("==============");
        // console.log(dataset);
        // console.log(newDate_Ball);

        res.json({
          // resultBall: BallUsage[0],
          result: resultdata_Ball,
          resultBall: dataset,
          resultDateBall: newDate_Ball,
          result_mcname: namemc,
          result_ballname: nameball,

          // resultTarget_turn: seriesTarget_new,
        });
      } else if (req.body.size === "2.0") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          ` with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours ,[mc_no]
        ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
            ,max([ball_c1_ok])*8 as totalSize10
            ,max([ball_c2_ok])*8 as totalSize20
            ,max([ball_c3_ok])*8 as totalSize30
            ,max([ball_c4_ok])*8 as totalSize40
            ,max([ball_c5_ok])*8 as totalSize50
        ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
          FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
          where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}'
        AND ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1350%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1360%' )
          GROUP BY [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
              )
                SELECT
                  sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
                  ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
                  ,sum(totalSize50) as totalSize50,[mc_no]
                FROM tb1
                  group by [mc_no]
                  --- 2.0 --- `
        );

        // console.log(resultdata_Ball);
        arrayData_Ball = resultdata_Ball[0];
        let ballsize = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        let resultUsage_Ball = [];
        let mc_no_Name = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mc_no]) {
            this[a.mc_no] = { name: a.mc_no, data: [] };
            resultUsage_Ball.push(this[a.mc_no]);
            // this[a.ballsize] = { name: a.ballsize };
            // mc_no_Name.push(this[a.ballsize]);
            // mc_no_Name.push(ballsize);
          }
          this[a.mc_no].data.push(
            a.totalSize10,
            a.totalSize20,
            a.totalSize30,
            a.totalSize40,
            a.totalSize50
          );
        }, Object.create(null));
        // set arr all value
        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];

        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        // console.log("getarr");
        // console.log(getarr);
        //set name ball
        let namemc = [];
        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await namemc.push(item.name);
        }
        //set name ball
        let nameball = [];
        for (let index = 0; index < mc_no_Name.length; index++) {
          const item = mc_no_Name[index];
          await nameball.push(item.name);
        }
        // console.log(namemc);
        //set arr name,data
        let dataset = [];
        for (let index = 0; index < getarr.length; index++) {
          dataset.push({
            // name: nameball[index],
            name: ballsize[index],
            data: getarr[index],
          });
        }

        // console.log(dataset);

        let BallUsage = [resultUsage_Ball];
        let resultDate_Ball = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(BallUsage[0]);
        console.log("==============");
        // console.log(dataset);
        // console.log(newDate_Ball);

        res.json({
          // resultBall: BallUsage[0],
          result: resultdata_Ball,
          resultBall: dataset,
          resultDateBall: newDate_Ball,
          result_mcname: namemc,
          result_ballname: nameball,

          // resultTarget_turn: seriesTarget_new,
        });
      } else if (req.body.size === "3.5") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours ,[mc_no]
        ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
            ,max([ball_c1_ok])*7 as totalSize10
            ,max([ball_c2_ok])*7 as totalSize20
            ,max([ball_c3_ok])*7 as totalSize30
            ,max([ball_c4_ok])*7 as totalSize40
            ,max([ball_c5_ok])*7 as totalSize50
        ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
          FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
          where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}'
        AND ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%626%' )
          GROUP BY [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
              )
                SELECT
                  sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
                  ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
                  ,sum(totalSize50) as totalSize50,[mc_no]
                FROM tb1
                  group by [mc_no]
          ---------- 3.5 ----------`
        );

        // console.log(resultdata_Ball);
        arrayData_Ball = resultdata_Ball[0];
        let ballsize = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        let resultUsage_Ball = [];
        let mc_no_Name = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mc_no]) {
            this[a.mc_no] = { name: a.mc_no, data: [] };
            resultUsage_Ball.push(this[a.mc_no]);
            // this[a.ballsize] = { name: a.ballsize };
            // mc_no_Name.push(this[a.ballsize]);
            // mc_no_Name.push(ballsize);
          }
          this[a.mc_no].data.push(
            a.totalSize10,
            a.totalSize20,
            a.totalSize30,
            a.totalSize40,
            a.totalSize50
          );
        }, Object.create(null));
        // set arr all value
        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];

        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        // console.log("getarr");
        // console.log(getarr);
        //set name ball
        let namemc = [];
        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await namemc.push(item.name);
        }
        //set name ball
        let nameball = [];
        for (let index = 0; index < mc_no_Name.length; index++) {
          const item = mc_no_Name[index];
          await nameball.push(item.name);
        }
        // console.log(namemc);
        //set arr name,data
        let dataset = [];
        for (let index = 0; index < getarr.length; index++) {
          dataset.push({
            // name: nameball[index],
            name: ballsize[index],
            data: getarr[index],
          });
        }

        // console.log(dataset);

        let BallUsage = [resultUsage_Ball];
        let resultDate_Ball = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(BallUsage[0]);
        console.log("==============");
        // console.log(dataset);
        // console.log(newDate_Ball);

        res.json({
          // resultBall: BallUsage[0],
          result: resultdata_Ball,
          resultBall: dataset,
          resultDateBall: newDate_Ball,
          result_mcname: namemc,
          result_ballname: nameball,

          // resultTarget_turn: seriesTarget_new,
        });
      } else if (req.body.size === "3/16") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours ,[mc_no]
        ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
            ,max([ball_c1_ok])*8 as totalSize10
            ,max([ball_c2_ok])*8 as totalSize20
            ,max([ball_c3_ok])*8 as totalSize30
            ,max([ball_c4_ok])*8 as totalSize40
            ,max([ball_c5_ok])*8 as totalSize50
        ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
          FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
          where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}'
        AND ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%6001%') 
          GROUP BY [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
           UNION ALL
SELECT
            datepart(hour,[registered_at]) as newHours ,[mc_no]
        ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
            ,max([ball_c1_ok])*9 as totalSize10
            ,max([ball_c2_ok])*9 as totalSize20
            ,max([ball_c3_ok])*9 as totalSize30
            ,max([ball_c4_ok])*9 as totalSize40
            ,max([ball_c5_ok])*9 as totalSize50
        ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
          FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
          where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}'
        AND ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%6002%' ) 
          GROUP BY [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
			  )
          SELECT
            sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
            ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
            ,sum(totalSize50) as totalSize50,[mc_no]
          FROM tb1
            group by [mc_no]
          --------- 3/16 --------- `
        );

        // console.log(resultdata_Ball);
        arrayData_Ball = resultdata_Ball[0];
        let ballsize = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        let resultUsage_Ball = [];
        let mc_no_Name = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mc_no]) {
            this[a.mc_no] = { name: a.mc_no, data: [] };
            resultUsage_Ball.push(this[a.mc_no]);
            // this[a.ballsize] = { name: a.ballsize };
            // mc_no_Name.push(this[a.ballsize]);
            // mc_no_Name.push(ballsize);
          }
          this[a.mc_no].data.push(
            a.totalSize10,
            a.totalSize20,
            a.totalSize30,
            a.totalSize40,
            a.totalSize50
          );
        }, Object.create(null));
        // set arr all value
        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];

        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        // console.log("getarr");
        // console.log(getarr);
        //set name ball
        let namemc = [];
        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await namemc.push(item.name);
        }
        //set name ball
        let nameball = [];
        for (let index = 0; index < mc_no_Name.length; index++) {
          const item = mc_no_Name[index];
          await nameball.push(item.name);
        }
        // console.log(namemc);
        //set arr name,data
        let dataset = [];
        for (let index = 0; index < getarr.length; index++) {
          dataset.push({
            // name: nameball[index],
            name: ballsize[index],
            data: getarr[index],
          });
        }

        // console.log(dataset);

        let BallUsage = [resultUsage_Ball];
        let resultDate_Ball = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(BallUsage[0]);
        console.log("==============");
        // console.log(dataset);
        // console.log(newDate_Ball);

        res.json({
          // resultBall: BallUsage[0],
          result: resultdata_Ball,
          resultBall: dataset,
          resultDateBall: newDate_Ball,
          result_mcname: namemc,
          result_ballname: nameball,

          // resultTarget_turn: seriesTarget_new,
        });
      } else if (req.body.size === "3/32") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `
          with tb1 as(SELECT
                    datepart(hour,[registered_at]) as newHours
                      ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
                      ,max([ball_c1_ok])*7 as totalSize10
                      ,max([ball_c2_ok])*7 as totalSize20
                      ,max([ball_c3_ok])*7 as totalSize30
                      ,max([ball_c4_ok])*7 as totalSize40
                      ,max([ball_c5_ok])*7 as totalSize50
                    ,[mc_no]
              ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
              +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
              +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
              +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
                    FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
                    where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}'  
                and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
              +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
              +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
              +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1340%' )-- and datepart(hour,[registered_at]) in ('7' )  -- or model like '')
                    group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
                ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
                    UNION ALL 
                  SELECT
                    datepart(hour,[registered_at]) as newHours
                      ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
                      ,max([ball_c1_ok])*9 as totalSize7_MC10
                      ,max([ball_c2_ok])*9 as totalSize7_MC20
                      ,max([ball_c3_ok])*9 as totalSize7_MC30
                      ,max([ball_c4_ok])*9 as totalSize7_MC40
                      ,max([ball_c5_ok])*9 as totalSize7_MC50
                    ,[mc_no]
              ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
              +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
              +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
              +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
                    FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
                    where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}'  
                and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
              +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
              +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
              +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1660%' OR (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
              +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
              +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
              +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1680%') -- and datepart(hour,[registered_at]) in ('7' )
                    group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
                ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
                    UNION ALL 
                    SELECT
                      datepart(hour,[registered_at]) as newHours
                        ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
                        ,max([ball_c1_ok])*15 as totalSize7_MC10
                        ,max([ball_c2_ok])*15 as totalSize7_MC20
                        ,max([ball_c3_ok])*15 as totalSize7_MC30
                        ,max([ball_c4_ok])*15 as totalSize7_MC40
                        ,max([ball_c5_ok])*15 as totalSize7_MC50
                      ,[mc_no]
              ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
              +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
              +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
              +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
                      FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
                      where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}'  
                and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
              +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
              +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
              +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%6803%') -- and datepart(hour,[registered_at]) in ('7' )
                      group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
                ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
                     )
                      SELECT
                        sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
                        ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
                        ,sum(totalSize50) as totalSize50,[mc_no]
                      FROM tb1
                        group by [mc_no]
                        
          -------- 3/32 -------- `
        );

        // console.log(resultdata_Ball);
        arrayData_Ball = resultdata_Ball[0];
        let ballsize = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        let resultUsage_Ball = [];
        let mc_no_Name = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mc_no]) {
            this[a.mc_no] = { name: a.mc_no, data: [] };
            resultUsage_Ball.push(this[a.mc_no]);
            // this[a.ballsize] = { name: a.ballsize };
            // mc_no_Name.push(this[a.ballsize]);
            // mc_no_Name.push(ballsize);
          }
          this[a.mc_no].data.push(
            a.totalSize10,
            a.totalSize20,
            a.totalSize30,
            a.totalSize40,
            a.totalSize50
          );
        }, Object.create(null));
        // set arr all value
        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];

        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        // console.log("getarr");
        // console.log(getarr);
        //set name ball
        let namemc = [];
        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await namemc.push(item.name);
        }
        //set name ball
        let nameball = [];
        for (let index = 0; index < mc_no_Name.length; index++) {
          const item = mc_no_Name[index];
          await nameball.push(item.name);
        }
        // console.log(namemc);
        //set arr name,data
        let dataset = [];
        for (let index = 0; index < getarr.length; index++) {
          dataset.push({
            // name: nameball[index],
            name: ballsize[index],
            data: getarr[index],
          });
        }

        // console.log(dataset);

        let BallUsage = [resultUsage_Ball];
        let resultDate_Ball = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(BallUsage[0]);
        console.log("==============");
        // console.log(dataset);
        // console.log(newDate_Ball);

        res.json({
          // resultBall: BallUsage[0],
          result: resultdata_Ball,
          resultBall: dataset,
          resultDateBall: newDate_Ball,
          result_mcname: namemc,
          result_ballname: nameball,

          // resultTarget_turn: seriesTarget_new,
        });
      } else if (req.body.size === "5/32") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours ,[mc_no]
        ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
            ,max([ball_c1_ok])*7 as totalSize10
            ,max([ball_c2_ok])*7 as totalSize20
            ,max([ball_c3_ok])*7 as totalSize30
            ,max([ball_c4_ok])*7 as totalSize40
            ,max([ball_c5_ok])*7 as totalSize50
        ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
          FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
          where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}'
        AND ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%608%') 
          GROUP BY [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
              )
          SELECT
            sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
            ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
            ,sum(totalSize50) as totalSize50,[mc_no]
          FROM tb1
            group by [mc_no]
    
    -------- 5/32 -------- `
        );

        // console.log(resultdata_Ball);
        arrayData_Ball = resultdata_Ball[0];
        let ballsize = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        let resultUsage_Ball = [];
        let mc_no_Name = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mc_no]) {
            this[a.mc_no] = { name: a.mc_no, data: [] };
            resultUsage_Ball.push(this[a.mc_no]);
            // this[a.ballsize] = { name: a.ballsize };
            // mc_no_Name.push(this[a.ballsize]);
            // mc_no_Name.push(ballsize);
          }
          this[a.mc_no].data.push(
            a.totalSize10,
            a.totalSize20,
            a.totalSize30,
            a.totalSize40,
            a.totalSize50
          );
        }, Object.create(null));
        // set arr all value
        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];

        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        // console.log("getarr");
        // console.log(getarr);
        //set name ball
        let namemc = [];
        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await namemc.push(item.name);
        }
        //set name ball
        let nameball = [];
        for (let index = 0; index < mc_no_Name.length; index++) {
          const item = mc_no_Name[index];
          await nameball.push(item.name);
        }
        // console.log(namemc);
        //set arr name,data
        let dataset = [];
        for (let index = 0; index < getarr.length; index++) {
          dataset.push({
            // name: nameball[index],
            name: ballsize[index],
            data: getarr[index],
          });
        }

        // console.log(dataset);

        let BallUsage = [resultUsage_Ball];
        let resultDate_Ball = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(BallUsage[0]);
        console.log("==============");
        // console.log(dataset);
        // console.log(newDate_Ball);

        res.json({
          // resultBall: BallUsage[0],
          result: resultdata_Ball,
          resultBall: dataset,
          resultDateBall: newDate_Ball,
          result_mcname: namemc,
          result_ballname: nameball,

          // resultTarget_turn: seriesTarget_new,
        });
      } else if (req.body.size === "7/64") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours ,[mc_no]
        ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
            ,max([ball_c1_ok])*7 as totalSize10
            ,max([ball_c2_ok])*7 as totalSize20
            ,max([ball_c3_ok])*7 as totalSize30
            ,max([ball_c4_ok])*7 as totalSize40
            ,max([ball_c5_ok])*7 as totalSize50
        ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
          FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
          where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}'
        AND ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1560%') 
          GROUP BY [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
              )
          SELECT
            sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
            ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
            ,sum(totalSize50) as totalSize50,[mc_no]
          FROM tb1
            group by [mc_no]
    
    -------- 7/64 ------- `
        );

        // console.log(resultdata_Ball);
        arrayData_Ball = resultdata_Ball[0];
        let ballsize = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        let resultUsage_Ball = [];
        let mc_no_Name = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mc_no]) {
            this[a.mc_no] = { name: a.mc_no, data: [] };
            resultUsage_Ball.push(this[a.mc_no]);
            // this[a.ballsize] = { name: a.ballsize };
            // mc_no_Name.push(this[a.ballsize]);
            // mc_no_Name.push(ballsize);
          }
          this[a.mc_no].data.push(
            a.totalSize10,
            a.totalSize20,
            a.totalSize30,
            a.totalSize40,
            a.totalSize50
          );
        }, Object.create(null));
        // set arr all value
        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];

        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        // console.log("getarr");
        // console.log(getarr);
        //set name ball
        let namemc = [];
        for (let index = 0; index < resultUsage_Ball.length; index++) {
          const item = resultUsage_Ball[index];
          await namemc.push(item.name);
        }
        //set name ball
        let nameball = [];
        for (let index = 0; index < mc_no_Name.length; index++) {
          const item = mc_no_Name[index];
          await nameball.push(item.name);
        }
        // console.log(namemc);
        //set arr name,data
        let dataset = [];
        for (let index = 0; index < getarr.length; index++) {
          dataset.push({
            // name: nameball[index],
            name: ballsize[index],
            data: getarr[index],
          });
        }

        // console.log(dataset);

        let BallUsage = [resultUsage_Ball];
        let resultDate_Ball = [];
        arrayData_Ball.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(BallUsage[0]);
        console.log("==============");
        // console.log(dataset);
        // console.log(newDate_Ball);

        res.json({
          // resultBall: BallUsage[0],
          result: resultdata_Ball,
          resultBall: dataset,
          resultDateBall: newDate_Ball,
          result_mcname: namemc,
          result_ballname: nameball,

          // resultTarget_turn: seriesTarget_new,
        });
      }
    } else {
      res.json({
        result: "NO DATA",
        api_result: constance.result_ok,
      });
    }
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});

// daily ball usage
router.get("/MBRC_Ball_Daily/:start_date/:end_date", async (req, res) => {
  // แก้เป็นของ accum new ด้วย
  try {
    let { datetoday } = req.params;
    let { start_date } = req.params;
    let { end_date } = req.params;
    let resultdata_Ball = await MBR_table.sequelize.query(
      `with tb1 as(SELECT
        datepart(hour,[registered_at]) as newHours
          ,[mfg_date]
          ,max([ball_c1_ok])*6 as totalSize10
          ,max([ball_c2_ok])*6 as totalSize20
          ,max([ball_c3_ok])*6 as totalSize30
          ,max([ball_c4_ok])*6 as totalSize40
          ,max([ball_c5_ok])*6 as totalSize50
        ,[mc_no],model
        FROM [counter].[dbo].[app_counter_accumoutput_new]
        where [mfg_date] between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  and (model like '%830%' or model like '')
        group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
        UNION ALL 
      SELECT
        datepart(hour,[registered_at]) as newHours
          ,[mfg_date]
          ,max([ball_c1_ok])*7 as totalSize7_MC10
          ,max([ball_c2_ok])*7 as totalSize7_MC20
          ,max([ball_c3_ok])*7 as totalSize7_MC30
          ,max([ball_c4_ok])*7 as totalSize7_MC40
          ,max([ball_c5_ok])*7 as totalSize7_MC50
        ,[mc_no],model
        FROM [counter].[dbo].[app_counter_accumoutput_new]
        where [mfg_date] between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' ) and (model like '%626%' or model like '%608%' or model like '%6202%' or model like '%840%' or model like '%940%' or model like '%1340%' or model like '%1560%' or model like '%730%')
        group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
        UNION ALL
      SELECT
        datepart(hour,[registered_at]) as newHours
          ,[mfg_date]
          ,max([ball_c1_ok])*8 as totalSize8_MC10
          ,max([ball_c2_ok])*8 as totalSize8_MC20
          ,max([ball_c3_ok])*8 as totalSize8_MC30
          ,max([ball_c4_ok])*8 as totalSize8_MC40
          ,max([ball_c5_ok])*8 as totalSize8_MC50
        ,[mc_no],model
        FROM [counter].[dbo].[app_counter_accumoutput_new]
        where [mfg_date] between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  and (model like '%1350%' or model like '%1360%' or model like '%6001%')
        group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
        UNION ALL
      SELECT
        datepart(hour,[registered_at]) as newHours
          ,[mfg_date]
          ,max([ball_c1_ok])*9 as totalSize9_MC10
          ,max([ball_c2_ok])*9 as totalSize9_MC20
          ,max([ball_c3_ok])*9 as totalSize9_MC30
          ,max([ball_c4_ok])*9 as totalSize9_MC40
          ,max([ball_c5_ok])*9 as totalSize9_MC50
        ,[mc_no],model
        FROM [counter].[dbo].[app_counter_accumoutput_new]
        where [mfg_date] between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  and (model like '%1680%' or model like '%1660%' or model like '%1060%' or model like '%6002%' )
        group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
      UNION ALL
      SELECT
        datepart(hour,[registered_at]) as newHours
          ,[mfg_date]
          ,max([ball_c1_ok])*15 as totalSize15_MC10
          ,max([ball_c2_ok])*15 as totalSize15_MC20
          ,max([ball_c3_ok])*15 as totalSize15_MC30
          ,max([ball_c4_ok])*15 as totalSize15_MC40
          ,max([ball_c5_ok])*15 as totalSize15_MC50
        ,[mc_no],model
        FROM [counter].[dbo].[app_counter_accumoutput_new]
        where [mfg_date] between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  and (model like '%6803%'  )
        group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
      --order by mc_no asc
          )
          SELECT mfg_date,
            sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
            ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
            ,sum(totalSize50) as totalSize50
          FROM tb1
            group by mfg_date
            order by mfg_date asc`
    );
    console.log(" daily");
    // console.log(resultdata_Ball);
    arrayData_Ball_Daily = resultdata_Ball[0];

    let resultStock_Ball_Daily = [];
    arrayData_Ball_Daily.forEach(function (a) {
      if (!this[a.mfg_date]) {
        this[a.mfg_date] = { name: a.mfg_date, data: [] };
        resultStock_Ball_Daily.push(this[a.mfg_date]);
      }
      this[a.mfg_date].data.push(
        a.totalSize10,
        a.totalSize20,
        a.totalSize30,
        a.totalSize40,
        a.totalSize50
      );
    }, Object.create(null));
    // console.log(resultStock_Ball_Daily);

    let Ball_Daily = [resultStock_Ball_Daily];
    let resultDate_Ball = [];
    arrayData_Ball_Daily.forEach(function (a) {
      if (!this[a.mfg_date]) {
        this[a.mfg_date] = { name: a.mfg_date };
        resultDate_Ball.push(this[a.mfg_date]);
      }
    }, Object.create(null));

    let getarr1 = [];
    let getarr2 = [];
    let getarr3 = [];
    let getarr4 = [];
    let getarr5 = [];
    for (let index = 0; index < resultStock_Ball_Daily.length; index++) {
      const item = resultStock_Ball_Daily[index];
      await getarr1.push(item.data[0]);
      await getarr2.push(item.data[1]);
      await getarr3.push(item.data[2]);
      await getarr4.push(item.data[3]);
      await getarr5.push(item.data[4]);
    }
    let getarr = [];
    getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
    console.log("=================");
    // console.log(getarr);
    //set arr name,data
    let result_Ball_Daily = [];
    let nameSizeball = [
      "BALL GRADE -5.0",
      "BALL GRADE -2.5",
      "BALL GRADE 0.0",
      "BALL GRADE +2.5",
      "BALL GRADE +5.0",
    ];
    for (let index = 0; index < getarr.length; index++) {
      result_Ball_Daily.push({
        name: nameSizeball[index],
        data: getarr[index],
      });
    }

    console.log(result_Ball_Daily);

    let newDate_Ball = [];
    for (let index = 0; index < resultDate_Ball.length; index++) {
      const item = resultDate_Ball[index];
      await newDate_Ball.push(item.name);
    }

    // console.log(Ball_Daily[0]);
    console.log(resultdata_Ball);

    res.json({
      resultBall: result_Ball_Daily,
      result: resultdata_Ball, //for table
      // resultBall: Ball_Daily[0],
      resultDateBall: newDate_Ball,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});

// MA By Size / Part DAILY
router.post(
  "/MBRC_Ball_Size_MA_Daily/:start_date/:end_date",
  async (req, res) => {
    // แก้เป็นของ accum new ด้วย
    try {
      let { datetoday } = req.params;
      let { start_date } = req.params;
      let { end_date } = req.params;

      if (req.body.type === "SUJ") {
        if (req.body.size === "1.0") {
          let resultdata_Ball = await MBR_table.sequelize.query(
            `with tb1 as(SELECT
              datepart(hour,[registered_at]) as newHours
          ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
                ,max([ball_c1_ok])*13 as totalSize10
                ,max([ball_c2_ok])*13 as totalSize20
                ,max([ball_c3_ok])*13 as totalSize30
                ,max([ball_c4_ok])*13 as totalSize40
                ,max([ball_c5_ok])*13 as totalSize50
              ,[mc_no]
          ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
              FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
              where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  
          and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%614%' ) 
              group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
            ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
              )
                SELECT mfg_date,
                  sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
                  ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
                  ,sum(totalSize50) as totalSize50
                FROM tb1
                  group by mfg_date
                  order by mfg_date asc
            ------- 1.0 -------`
          );
          console.log(" size 1.0 -----", start_date);
          // console.log(resultdata_Ball);
          arrayData_Ball_Daily = resultdata_Ball[0];

          let resultStock_Ball_Daily = [];
          arrayData_Ball_Daily.forEach(function (a) {
            if (!this[a.mfg_date]) {
              this[a.mfg_date] = { name: a.mfg_date, data: [] };
              resultStock_Ball_Daily.push(this[a.mfg_date]);
            }
            this[a.mfg_date].data.push(
              a.totalSize10,
              a.totalSize20,
              a.totalSize30,
              a.totalSize40,
              a.totalSize50
            );
          }, Object.create(null));
          // console.log(resultStock_Ball_Daily);

          let Ball_Daily = [resultStock_Ball_Daily];
          let resultDate_Ball = [];
          arrayData_Ball_Daily.forEach(function (a) {
            if (!this[a.mfg_date]) {
              this[a.mfg_date] = { name: a.mfg_date };
              resultDate_Ball.push(this[a.mfg_date]);
            }
          }, Object.create(null));

          let getarr1 = [];
          let getarr2 = [];
          let getarr3 = [];
          let getarr4 = [];
          let getarr5 = [];
          for (let index = 0; index < resultStock_Ball_Daily.length; index++) {
            const item = resultStock_Ball_Daily[index];
            await getarr1.push(item.data[0]);
            await getarr2.push(item.data[1]);
            await getarr3.push(item.data[2]);
            await getarr4.push(item.data[3]);
            await getarr5.push(item.data[4]);
          }
          let getarr = [];
          getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
          console.log("=================");
          // console.log(getarr);
          //set arr name,data
          let result_Ball_Daily = [];
          let nameSizeball = [
            "BALL GRADE -5.0",
            "BALL GRADE -2.5",
            "BALL GRADE 0.0",
            "BALL GRADE +2.5",
            "BALL GRADE +5.0",
          ];
          for (let index = 0; index < getarr.length; index++) {
            result_Ball_Daily.push({
              name: nameSizeball[index],
              data: getarr[index],
            });
          }

          console.log(result_Ball_Daily);

          let newDate_Ball = [];
          for (let index = 0; index < resultDate_Ball.length; index++) {
            const item = resultDate_Ball[index];
            await newDate_Ball.push(item.name);
          }

          // console.log(Ball_Daily[0]);
          console.log(resultdata_Ball);

          res.json({
            resultBall: result_Ball_Daily,
            result: resultdata_Ball, //for table
            // resultBall: Ball_Daily[0],
            resultDateBall: newDate_Ball,
          });
        } else if (req.body.size === "1/16") {
          let resultdata_Ball = await MBR_table.sequelize.query(
            `with tb1 as(SELECT
              datepart(hour,[registered_at]) as newHours
                ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                ,max([ball_c1_ok])*6 as totalSize10
                ,max([ball_c2_ok])*6 as totalSize20
                ,max([ball_c3_ok])*6 as totalSize30
                ,max([ball_c4_ok])*6 as totalSize40
                ,max([ball_c5_ok])*6 as totalSize50
              ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
              FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
              where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  
          and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%830%' ) -- or model like '')
              group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
              UNION ALL 
            SELECT
              datepart(hour,[registered_at]) as newHours
                ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                ,max([ball_c1_ok])*7 as totalSize7_MC10
                ,max([ball_c2_ok])*7 as totalSize7_MC20
                ,max([ball_c3_ok])*7 as totalSize7_MC30
                ,max([ball_c4_ok])*7 as totalSize7_MC40
                ,max([ball_c5_ok])*7 as totalSize7_MC50
              ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
              FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
              where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' ) 
          and ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%940%')
              group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
              )
                SELECT mfg_date,
                  sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
                  ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
                  ,sum(totalSize50) as totalSize50
                FROM tb1
                  group by mfg_date
                  order by mfg_date asc
          ------ 1/16 `
          );
          console.log(" daily");
          // console.log(resultdata_Ball);
          arrayData_Ball_Daily = resultdata_Ball[0];

          let resultStock_Ball_Daily = [];
          arrayData_Ball_Daily.forEach(function (a) {
            if (!this[a.mfg_date]) {
              this[a.mfg_date] = { name: a.mfg_date, data: [] };
              resultStock_Ball_Daily.push(this[a.mfg_date]);
            }
            this[a.mfg_date].data.push(
              a.totalSize10,
              a.totalSize20,
              a.totalSize30,
              a.totalSize40,
              a.totalSize50
            );
          }, Object.create(null));
          // console.log(resultStock_Ball_Daily);

          let Ball_Daily = [resultStock_Ball_Daily];
          let resultDate_Ball = [];
          arrayData_Ball_Daily.forEach(function (a) {
            if (!this[a.mfg_date]) {
              this[a.mfg_date] = { name: a.mfg_date };
              resultDate_Ball.push(this[a.mfg_date]);
            }
          }, Object.create(null));

          let getarr1 = [];
          let getarr2 = [];
          let getarr3 = [];
          let getarr4 = [];
          let getarr5 = [];
          for (let index = 0; index < resultStock_Ball_Daily.length; index++) {
            const item = resultStock_Ball_Daily[index];
            await getarr1.push(item.data[0]);
            await getarr2.push(item.data[1]);
            await getarr3.push(item.data[2]);
            await getarr4.push(item.data[3]);
            await getarr5.push(item.data[4]);
          }
          let getarr = [];
          getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
          console.log("=================");
          // console.log(getarr);
          //set arr name,data
          let result_Ball_Daily = [];
          let nameSizeball = [
            "BALL GRADE -5.0",
            "BALL GRADE -2.5",
            "BALL GRADE 0.0",
            "BALL GRADE +2.5",
            "BALL GRADE +5.0",
          ];
          for (let index = 0; index < getarr.length; index++) {
            result_Ball_Daily.push({
              name: nameSizeball[index],
              data: getarr[index],
            });
          }

          console.log(result_Ball_Daily);

          let newDate_Ball = [];
          for (let index = 0; index < resultDate_Ball.length; index++) {
            const item = resultDate_Ball[index];
            await newDate_Ball.push(item.name);
          }

          // console.log(Ball_Daily[0]);
          console.log(resultdata_Ball);

          res.json({
            resultBall: result_Ball_Daily,
            result: resultdata_Ball, //for table
            // resultBall: Ball_Daily[0],
            resultDateBall: newDate_Ball,
          });
        } else if (req.body.size === "1/32") {
          let resultdata_Ball = await MBR_table.sequelize.query(
            `with tb1 as(
              SELECT
                datepart(hour,[registered_at]) as newHours
                  ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                  ,max([ball_c1_ok])*8 as totalSize10
                  ,max([ball_c2_ok])*8 as totalSize20
                  ,max([ball_c3_ok])*8 as totalSize30
                  ,max([ball_c4_ok])*8 as totalSize40
                  ,max([ball_c5_ok])*8 as totalSize50
                ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
                +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
                +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
                +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
                FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
                where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  
            and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%630%' ) -- or model like '')
                group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
            ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
                UNION ALL
              SELECT
                datepart(hour,[registered_at]) as newHours
                  ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                  ,max([ball_c1_ok])*11 as totalSize9_MC10
                  ,max([ball_c2_ok])*11 as totalSize9_MC20
                  ,max([ball_c3_ok])*11 as totalSize9_MC30
                  ,max([ball_c4_ok])*11 as totalSize9_MC40
                  ,max([ball_c5_ok])*11 as totalSize9_MC50
                ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
                FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
                where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  
            and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%740%')
                group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
            ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
              UNION ALL
              SELECT
                datepart(hour,[registered_at]) as newHours
                  ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                  ,max([ball_c1_ok])*13 as totalSize15_MC10
                  ,max([ball_c2_ok])*13 as totalSize15_MC20
                  ,max([ball_c3_ok])*13 as totalSize15_MC30
                  ,max([ball_c4_ok])*13 as totalSize15_MC40
                  ,max([ball_c5_ok])*13 as totalSize15_MC50
                ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
                FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
                where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  
            and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%850%'  )
                group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
            ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
              --order by mc_no asc
                  )
                  SELECT mfg_date,
                    sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
                    ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
                    ,sum(totalSize50) as totalSize50
                  FROM tb1
                    group by mfg_date
                    order by mfg_date asc
            ------ 1/32 ---------`
          );
          console.log(" daily");
          // console.log(resultdata_Ball);
          arrayData_Ball_Daily = resultdata_Ball[0];

          let resultStock_Ball_Daily = [];
          arrayData_Ball_Daily.forEach(function (a) {
            if (!this[a.mfg_date]) {
              this[a.mfg_date] = { name: a.mfg_date, data: [] };
              resultStock_Ball_Daily.push(this[a.mfg_date]);
            }
            this[a.mfg_date].data.push(
              a.totalSize10,
              a.totalSize20,
              a.totalSize30,
              a.totalSize40,
              a.totalSize50
            );
          }, Object.create(null));
          // console.log(resultStock_Ball_Daily);

          let Ball_Daily = [resultStock_Ball_Daily];
          let resultDate_Ball = [];
          arrayData_Ball_Daily.forEach(function (a) {
            if (!this[a.mfg_date]) {
              this[a.mfg_date] = { name: a.mfg_date };
              resultDate_Ball.push(this[a.mfg_date]);
            }
          }, Object.create(null));

          let getarr1 = [];
          let getarr2 = [];
          let getarr3 = [];
          let getarr4 = [];
          let getarr5 = [];
          for (let index = 0; index < resultStock_Ball_Daily.length; index++) {
            const item = resultStock_Ball_Daily[index];
            await getarr1.push(item.data[0]);
            await getarr2.push(item.data[1]);
            await getarr3.push(item.data[2]);
            await getarr4.push(item.data[3]);
            await getarr5.push(item.data[4]);
          }
          let getarr = [];
          getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
          console.log("=================");
          // console.log(getarr);
          //set arr name,data
          let result_Ball_Daily = [];
          let nameSizeball = [
            "BALL GRADE -5.0",
            "BALL GRADE -2.5",
            "BALL GRADE 0.0",
            "BALL GRADE +2.5",
            "BALL GRADE +5.0",
          ];
          for (let index = 0; index < getarr.length; index++) {
            result_Ball_Daily.push({
              name: nameSizeball[index],
              data: getarr[index],
            });
          }

          console.log(result_Ball_Daily);

          let newDate_Ball = [];
          for (let index = 0; index < resultDate_Ball.length; index++) {
            const item = resultDate_Ball[index];
            await newDate_Ball.push(item.name);
          }

          // console.log(Ball_Daily[0]);
          console.log(resultdata_Ball);

          res.json({
            resultBall: result_Ball_Daily,
            result: resultdata_Ball, //for table
            // resultBall: Ball_Daily[0],
            resultDateBall: newDate_Ball,
          });
        } else if (req.body.size === "3/64") {
          let resultdata_Ball = await MBR_table.sequelize.query(
            `with tb1 as(SELECT
              datepart(hour,[registered_at]) as newHours
                ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                ,max([ball_c1_ok])*11 as totalSize10
                ,max([ball_c2_ok])*11 as totalSize20
                ,max([ball_c3_ok])*11 as totalSize30
                ,max([ball_c4_ok])*11 as totalSize40
                ,max([ball_c5_ok])*11 as totalSize50
              ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
              FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
              where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  
              and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
              +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
              +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
              +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%740%' ) -- or model like '')
              group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
              UNION ALL 
            SELECT
              datepart(hour,[registered_at]) as newHours
                ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                ,max([ball_c1_ok])*13 as totalSize7_MC10
                ,max([ball_c2_ok])*13 as totalSize7_MC20
                ,max([ball_c3_ok])*13 as totalSize7_MC30
                ,max([ball_c4_ok])*13 as totalSize7_MC40
                ,max([ball_c5_ok])*13 as totalSize7_MC50
              ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
              FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
              where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' ) 
          and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%850%')
              group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
             )
                SELECT mfg_date,
                  sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
                  ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
                  ,sum(totalSize50) as totalSize50
                FROM tb1
                  group by mfg_date
                  order by mfg_date asc
                  
          ------- 3/64 -------`
          );
          console.log(" daily");
          // console.log(resultdata_Ball);
          arrayData_Ball_Daily = resultdata_Ball[0];

          let resultStock_Ball_Daily = [];
          arrayData_Ball_Daily.forEach(function (a) {
            if (!this[a.mfg_date]) {
              this[a.mfg_date] = { name: a.mfg_date, data: [] };
              resultStock_Ball_Daily.push(this[a.mfg_date]);
            }
            this[a.mfg_date].data.push(
              a.totalSize10,
              a.totalSize20,
              a.totalSize30,
              a.totalSize40,
              a.totalSize50
            );
          }, Object.create(null));
          // console.log(resultStock_Ball_Daily);

          let Ball_Daily = [resultStock_Ball_Daily];
          let resultDate_Ball = [];
          arrayData_Ball_Daily.forEach(function (a) {
            if (!this[a.mfg_date]) {
              this[a.mfg_date] = { name: a.mfg_date };
              resultDate_Ball.push(this[a.mfg_date]);
            }
          }, Object.create(null));

          let getarr1 = [];
          let getarr2 = [];
          let getarr3 = [];
          let getarr4 = [];
          let getarr5 = [];
          for (let index = 0; index < resultStock_Ball_Daily.length; index++) {
            const item = resultStock_Ball_Daily[index];
            await getarr1.push(item.data[0]);
            await getarr2.push(item.data[1]);
            await getarr3.push(item.data[2]);
            await getarr4.push(item.data[3]);
            await getarr5.push(item.data[4]);
          }
          let getarr = [];
          getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
          console.log("=================");
          // console.log(getarr);
          //set arr name,data
          let result_Ball_Daily = [];
          let nameSizeball = [
            "BALL GRADE -5.0",
            "BALL GRADE -2.5",
            "BALL GRADE 0.0",
            "BALL GRADE +2.5",
            "BALL GRADE +5.0",
          ];
          for (let index = 0; index < getarr.length; index++) {
            result_Ball_Daily.push({
              name: nameSizeball[index],
              data: getarr[index],
            });
          }

          console.log(result_Ball_Daily);

          let newDate_Ball = [];
          for (let index = 0; index < resultDate_Ball.length; index++) {
            const item = resultDate_Ball[index];
            await newDate_Ball.push(item.name);
          }

          // console.log(Ball_Daily[0]);
          console.log(resultdata_Ball);

          res.json({
            resultBall: result_Ball_Daily,
            result: resultdata_Ball, //for table
            // resultBall: Ball_Daily[0],
            resultDateBall: newDate_Ball,
          });
        }
      } else {
        res.json({
          result: "NO DATA",
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        error,
        api_result: constance.result_nok,
      });
    }
  }
);
// Monthly BALL GRADE type => MA
router.post("/MBRC_Ball_Size_MA_Monthly/:year", async (req, res) => {
  // แก้เป็นของ accum new ด้วย
  try {
    let { year } = req.params;
    if (req.body.type === "SUJ") {
      if (req.body.size === "1.0") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,[mfg_date]
              ,max([ball_c1_ok])*13 as totalSize10
              ,max([ball_c2_ok])*13 as totalSize20
              ,max([ball_c3_ok])*13 as totalSize30
              ,max([ball_c4_ok])*13 as totalSize40
              ,max([ball_c5_ok])*13 as totalSize50
            ,[mc_no],model
            FROM [counter].[dbo].[app_counter_accumoutput_new]
            where  (model like '%614%' )  and FORMAT([mfg_date], 'yyyy') ='${year}'-- or model like '')
            group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
            )
             ,tb2 as (
       SELECT  FORMAT([mfg_date], 'yyyy MMM') as Year_Month,
       FORMAT([mfg_date], 'yyyy') as newYear
      ,sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
      ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
      ,sum(totalSize50) as totalSize50,[mc_no]
      FROM tb1 as Alias_table
      group by FORMAT([mfg_date], 'yyyy MMM') ,[mc_no],FORMAT([mfg_date], 'yyyy')
      )
      ,sum_month as (select [mc_no] , sum(totalSize10) as newtotalSize10, sum(totalSize20) as newtotalSize20
      ,sum(totalSize30) as newtotalSize30, sum(totalSize40) as newtotalSize40
      ,sum(totalSize50) as newtotalSize50, [Year_Month],[newYear],
      CASE
        WHEN [Year_Month]  LIKE '%Jan%'  THEN 'a'
        WHEN [Year_Month]  LIKE '%Feb%'  THEN 'b'
        WHEN [Year_Month]  LIKE '%Mar%'  THEN 'c'
        WHEN [Year_Month]  LIKE '%Apr%'  THEN 'd' 
        WHEN [Year_Month]  LIKE '%May%'  THEN 'e'						 
        WHEN [Year_Month]  LIKE '%Jun%'  THEN 'f'						 
        WHEN [Year_Month]  LIKE '%Jul%'  THEN 'g'						 
        WHEN [Year_Month]  LIKE '%Aug%'  THEN 'h'						 
        WHEN [Year_Month]  LIKE '%Sep%'  THEN 'i'						 
        WHEN [Year_Month]  LIKE '%Oct%'  THEN 'j'						 
        WHEN [Year_Month]  LIKE '%Nov%'  THEN 'k'						 
        WHEN [Year_Month]  LIKE '%Dec%'  THEN 'l'						 
            ELSE 'other'
        END as _month
      From tb2
      group by [Year_Month],[mc_no],[newYear]
      --order by [newYear] asc, _month asc
      )
      SELECT sum(newtotalSize10) as newtotalSize10, sum(newtotalSize20) as newtotalSize20
      ,sum(newtotalSize30) as newtotalSize30, sum(newtotalSize40) as newtotalSize40
      ,sum(newtotalSize50) as newtotalSize50, [Year_Month], _month
      FROM sum_month
      GROUP BY [Year_Month],_month
      ORDER BY _month asc
    `
        );
        console.log(" size 1.0");
        console.log(resultdata_Ball);
        let arrayData_Ball_All = [];
        arrayData_Ball_All = resultdata_Ball[0];

        let resultUsage_Ball_All = [];
        arrayData_Ball_All.forEach(function (a) {
          if (!this[a.mc_no]) {
            this[a.mc_no] = { name: a.mc_no, data: [] };
            resultUsage_Ball_All.push(this[a.mc_no]);
          }
          this[a.mc_no].data.push(
            a.newtotalSize10,
            a.newtotalSize20,
            a.newtotalSize30,
            a.newtotalSize40,
            a.newtotalSize50
          );
        }, Object.create(null));

        let BallUsage_All = [resultUsage_Ball_All];
        let resultDate_Ball = [];
        arrayData_Ball_All.forEach(function (a) {
          if (!this[a.Year_Month]) {
            this[a.Year_Month] = { name: a.Year_Month };
            resultDate_Ball.push(this[a.Year_Month]);
          }
        }, Object.create(null));

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(BallUsage_All[0]);
        // console.log(newDate_Ball);

        res.json({
          resultBall_All: BallUsage_All[0],
          resultDateBall_All: newDate_Ball,

          // resultTarget_turn: seriesTarget_new,
        });
      } else if (req.body.size === "1/16") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `-- 1/16
          with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,[mfg_date]
              ,max([ball_c1_ok])*6 as totalSize10
              ,max([ball_c2_ok])*6 as totalSize20
              ,max([ball_c3_ok])*6 as totalSize30
              ,max([ball_c4_ok])*6 as totalSize40
              ,max([ball_c5_ok])*6 as totalSize50
            ,[mc_no],model
            FROM [counter].[dbo].[app_counter_accumoutput_new]
            where (model like '%830%' ) and FORMAT([mfg_date], 'yyyy') ='${year}' -- or model like '')
            group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
            UNION ALL 
          SELECT
            datepart(hour,[registered_at]) as newHours
              ,[mfg_date]
              ,max([ball_c1_ok])*7 as totalSize7_MC10
              ,max([ball_c2_ok])*7 as totalSize7_MC20
              ,max([ball_c3_ok])*7 as totalSize7_MC30
              ,max([ball_c4_ok])*7 as totalSize7_MC40
              ,max([ball_c5_ok])*7 as totalSize7_MC50
            ,[mc_no],model
            FROM [counter].[dbo].[app_counter_accumoutput_new]
            where ( model like '%940%') and FORMAT([mfg_date], 'yyyy') ='${year}'
            group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
            )
           ,tb2 as (
     SELECT  FORMAT([mfg_date], 'yyyy MMM') as Year_Month,
     FORMAT([mfg_date], 'yyyy') as newYear
    ,sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
    ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
    ,sum(totalSize50) as totalSize50,[mc_no]
    FROM tb1 as Alias_table
    group by FORMAT([mfg_date], 'yyyy MMM') ,[mc_no],FORMAT([mfg_date], 'yyyy')
    )
    ,sum_month as (select [mc_no] , sum(totalSize10) as newtotalSize10, sum(totalSize20) as newtotalSize20
    ,sum(totalSize30) as newtotalSize30, sum(totalSize40) as newtotalSize40
    ,sum(totalSize50) as newtotalSize50, [Year_Month],[newYear],
    CASE
      WHEN [Year_Month]  LIKE '%Jan%'  THEN 'a'
      WHEN [Year_Month]  LIKE '%Feb%'  THEN 'b'
      WHEN [Year_Month]  LIKE '%Mar%'  THEN 'c'
      WHEN [Year_Month]  LIKE '%Apr%'  THEN 'd' 
      WHEN [Year_Month]  LIKE '%May%'  THEN 'e'						 
      WHEN [Year_Month]  LIKE '%Jun%'  THEN 'f'						 
      WHEN [Year_Month]  LIKE '%Jul%'  THEN 'g'						 
      WHEN [Year_Month]  LIKE '%Aug%'  THEN 'h'						 
      WHEN [Year_Month]  LIKE '%Sep%'  THEN 'i'						 
      WHEN [Year_Month]  LIKE '%Oct%'  THEN 'j'						 
      WHEN [Year_Month]  LIKE '%Nov%'  THEN 'k'						 
      WHEN [Year_Month]  LIKE '%Dec%'  THEN 'l'						 
          ELSE 'other'
      END as _month
    From tb2
    group by [Year_Month],[mc_no],[newYear]
    --order by [newYear] asc, _month asc
    )
    SELECT sum(newtotalSize10) as newtotalSize10, sum(newtotalSize20) as newtotalSize20
    ,sum(newtotalSize30) as newtotalSize30, sum(newtotalSize40) as newtotalSize40
    ,sum(newtotalSize50) as newtotalSize50, [Year_Month], _month
    FROM sum_month
    GROUP BY [Year_Month],_month
    ORDER BY _month asc
  `
        );
        console.log(" Monthly 1/16");
        console.log(resultdata_Ball);
        // return
        arrayData_Ball_Daily = resultdata_Ball[0];

        let resultStock_Ball_Daily = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.Year_Month]) {
            this[a.Year_Month] = { name: a.Year_Month, data: [] };
            resultStock_Ball_Daily.push(this[a.Year_Month]);
          }
          this[a.Year_Month].data.push(
            a.newtotalSize10,
            a.newtotalSize20,
            a.newtotalSize30,
            a.newtotalSize40,
            a.newtotalSize50
          );
        }, Object.create(null));
        // console.log(resultStock_Ball_Daily);

        let Ball_Daily = [resultStock_Ball_Daily];
        let resultDate_Ball = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.Year_Month]) {
            this[a.Year_Month] = { name: a.Year_Month };
            resultDate_Ball.push(this[a.Year_Month]);
          }
        }, Object.create(null));

        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];
        for (let index = 0; index < resultStock_Ball_Daily.length; index++) {
          const item = resultStock_Ball_Daily[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        console.log("=================");
        // console.log(getarr);
        //set arr name,data
        let result_Ball_Daily = [];
        let nameSizeball = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        for (let index = 0; index < getarr.length; index++) {
          result_Ball_Daily.push({
            name: nameSizeball[index],
            data: getarr[index],
          });
        }

        console.log(result_Ball_Daily);

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(Ball_Daily[0]);
        console.log(resultdata_Ball);

        res.json({
          resultBall_All: result_Ball_Daily,
          resultDateBall_All: newDate_Ball,

          // resultTarget_turn: seriesTarget_new,
        });
      } else if (req.body.size === "1/32") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `-- 1/32
          with tb1 as(
        SELECT
          datepart(hour,[registered_at]) as newHours
            ,[mfg_date]
            ,max([ball_c1_ok])*8 as totalSize10
            ,max([ball_c2_ok])*8 as totalSize20
            ,max([ball_c3_ok])*8 as totalSize30
            ,max([ball_c4_ok])*8 as totalSize40
            ,max([ball_c5_ok])*8 as totalSize50
          ,[mc_no],model
          FROM [counter].[dbo].[app_counter_accumoutput_new]
          where [mfg_date] between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  and (model like '%630%' ) -- or model like '')
          group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
          UNION ALL
        SELECT
          datepart(hour,[registered_at]) as newHours
            ,[mfg_date]
            ,max([ball_c1_ok])*11 as totalSize9_MC10
            ,max([ball_c2_ok])*11 as totalSize9_MC20
            ,max([ball_c3_ok])*11 as totalSize9_MC30
            ,max([ball_c4_ok])*11 as totalSize9_MC40
            ,max([ball_c5_ok])*11 as totalSize9_MC50
          ,[mc_no],model
          FROM [counter].[dbo].[app_counter_accumoutput_new]
          where [mfg_date] between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  and (model like '%740%')
          group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
        UNION ALL
        SELECT
          datepart(hour,[registered_at]) as newHours
            ,[mfg_date]
            ,max([ball_c1_ok])*13 as totalSize15_MC10
            ,max([ball_c2_ok])*13 as totalSize15_MC20
            ,max([ball_c3_ok])*13 as totalSize15_MC30
            ,max([ball_c4_ok])*13 as totalSize15_MC40
            ,max([ball_c5_ok])*13 as totalSize15_MC50
          ,[mc_no],model
          FROM [counter].[dbo].[app_counter_accumoutput_new]
          where [mfg_date] between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  and (model like '%850%'  )
          group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
        --order by mc_no asc
            )
            SELECT mfg_date,
              sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
              ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
              ,sum(totalSize50) as totalSize50
            FROM tb1
              group by mfg_date
              order by mfg_date asc`
        );
        console.log(" Monthly 1/32");
        console.log(resultdata_Ball);
        let arrayData_Ball_All = [];
        arrayData_Ball_All = resultdata_Ball[0];

        let resultUsage_Ball_All = [];
        arrayData_Ball_All.forEach(function (a) {
          if (!this[a.mc_no]) {
            this[a.mc_no] = { name: a.mc_no, data: [] };
            resultUsage_Ball_All.push(this[a.mc_no]);
          }
          this[a.mc_no].data.push(
            a.newtotalSize10,
            a.newtotalSize20,
            a.newtotalSize30,
            a.newtotalSize40,
            a.newtotalSize50
          );
        }, Object.create(null));

        let BallUsage_All = [resultUsage_Ball_All];
        let resultDate_Ball = [];
        arrayData_Ball_All.forEach(function (a) {
          if (!this[a.Year_Month]) {
            this[a.Year_Month] = { name: a.Year_Month };
            resultDate_Ball.push(this[a.Year_Month]);
          }
        }, Object.create(null));

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(BallUsage_All[0]);
        // console.log(newDate_Ball);

        res.json({
          resultBall_All: BallUsage_All[0],
          resultDateBall_All: newDate_Ball,

          // resultTarget_turn: seriesTarget_new,
        });
      } else if (req.body.size === "3/64") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
          datepart(hour,[registered_at]) as newHours
            ,[mfg_date]
            ,max([ball_c1_ok])*11 as totalSize10
            ,max([ball_c2_ok])*11 as totalSize20
            ,max([ball_c3_ok])*11 as totalSize30
            ,max([ball_c4_ok])*11 as totalSize40
            ,max([ball_c5_ok])*11 as totalSize50
          ,[mc_no],model
          FROM [counter].[dbo].[app_counter_accumoutput_new]
          where (model like '%740%' ) and FORMAT([mfg_date], 'yyyy') ='${year}' -- or model like '')
          group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
          UNION ALL 
        SELECT
          datepart(hour,[registered_at]) as newHours
            ,[mfg_date]
            ,max([ball_c1_ok])*13 as totalSize7_MC10
            ,max([ball_c2_ok])*13 as totalSize7_MC20
            ,max([ball_c3_ok])*13 as totalSize7_MC30
            ,max([ball_c4_ok])*13 as totalSize7_MC40
            ,max([ball_c5_ok])*13 as totalSize7_MC50
          ,[mc_no],model
          FROM [counter].[dbo].[app_counter_accumoutput_new]
          where (model like '%850%') and FORMAT([mfg_date], 'yyyy') ='${year}'
          group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
         )
         ,tb2 as (
   SELECT  FORMAT([mfg_date], 'yyyy MMM') as Year_Month,
   FORMAT([mfg_date], 'yyyy') as newYear
  ,sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
  ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
  ,sum(totalSize50) as totalSize50,[mc_no]
  FROM tb1 as Alias_table
  group by FORMAT([mfg_date], 'yyyy MMM') ,[mc_no],FORMAT([mfg_date], 'yyyy')
  )
  ,sum_month as (select [mc_no] , sum(totalSize10) as newtotalSize10, sum(totalSize20) as newtotalSize20
  ,sum(totalSize30) as newtotalSize30, sum(totalSize40) as newtotalSize40
  ,sum(totalSize50) as newtotalSize50, [Year_Month],[newYear],
  CASE
    WHEN [Year_Month]  LIKE '%Jan%'  THEN 'a'
    WHEN [Year_Month]  LIKE '%Feb%'  THEN 'b'
    WHEN [Year_Month]  LIKE '%Mar%'  THEN 'c'
    WHEN [Year_Month]  LIKE '%Apr%'  THEN 'd' 
    WHEN [Year_Month]  LIKE '%May%'  THEN 'e'						 
    WHEN [Year_Month]  LIKE '%Jun%'  THEN 'f'						 
    WHEN [Year_Month]  LIKE '%Jul%'  THEN 'g'						 
    WHEN [Year_Month]  LIKE '%Aug%'  THEN 'h'						 
    WHEN [Year_Month]  LIKE '%Sep%'  THEN 'i'						 
    WHEN [Year_Month]  LIKE '%Oct%'  THEN 'j'						 
    WHEN [Year_Month]  LIKE '%Nov%'  THEN 'k'						 
    WHEN [Year_Month]  LIKE '%Dec%'  THEN 'l'						 
        ELSE 'other'
    END as _month
  From tb2
  group by [Year_Month],[mc_no],[newYear]
  --order by [newYear] asc, _month asc
  )
  SELECT sum(newtotalSize10) as newtotalSize10, sum(newtotalSize20) as newtotalSize20
  ,sum(newtotalSize30) as newtotalSize30, sum(newtotalSize40) as newtotalSize40
  ,sum(newtotalSize50) as newtotalSize50, [Year_Month], _month
  FROM sum_month
  GROUP BY [Year_Month],_month
  ORDER BY _month asc
`
        );
        console.log(" Monthly 3/64");
        console.log(resultdata_Ball);
        let arrayData_Ball_All = [];
        arrayData_Ball_All = resultdata_Ball[0];

        let resultUsage_Ball_All = [];
        arrayData_Ball_All.forEach(function (a) {
          if (!this[a.mc_no]) {
            this[a.mc_no] = { name: a.mc_no, data: [] };
            resultUsage_Ball_All.push(this[a.mc_no]);
          }
          this[a.mc_no].data.push(
            a.newtotalSize10,
            a.newtotalSize20,
            a.newtotalSize30,
            a.newtotalSize40,
            a.newtotalSize50
          );
        }, Object.create(null));

        let BallUsage_All = [resultUsage_Ball_All];
        let resultDate_Ball = [];
        arrayData_Ball_All.forEach(function (a) {
          if (!this[a.Year_Month]) {
            this[a.Year_Month] = { name: a.Year_Month };
            resultDate_Ball.push(this[a.Year_Month]);
          }
        }, Object.create(null));

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(BallUsage_All[0]);
        // console.log(newDate_Ball);

        res.json({
          resultBall_All: BallUsage_All[0],
          resultDateBall_All: newDate_Ball,

          // resultTarget_turn: seriesTarget_new,
        });
      }
    } else {
      res.json({
        result: "NO DATA",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});
// Monthly BALL GRADE type => MD
router.post("/MBRC_Ball_Size_MD_Monthly/:year", async (req, res) => {
  try {
    let { year } = req.params;
    let { end_date } = req.params;
    if (req.body.type === "SUJ") {
      if (req.body.size === "1/4") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,[mfg_date]
              ,max([ball_c1_ok])*7 as totalSize10
              ,max([ball_c2_ok])*7 as totalSize20
              ,max([ball_c3_ok])*7 as totalSize30
              ,max([ball_c4_ok])*7 as totalSize40
              ,max([ball_c5_ok])*7 as totalSize50
            ,[mc_no],model
            FROM [counter].[dbo].[app_counter_accumoutput_new]
            where (model like '%6202%' ) and FORMAT([mfg_date], 'yyyy') ='${year}' -- or model like '')
            group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
            )
             ,tb2 as (
       SELECT  FORMAT([mfg_date], 'yyyy MMM') as Year_Month,
       FORMAT([mfg_date], 'yyyy') as newYear
      ,sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
      ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
      ,sum(totalSize50) as totalSize50,[mc_no]
      FROM tb1 as Alias_table
      group by FORMAT([mfg_date], 'yyyy MMM') ,[mc_no],FORMAT([mfg_date], 'yyyy')
      )
      ,sum_month as (select [mc_no] , sum(totalSize10) as newtotalSize10, sum(totalSize20) as newtotalSize20
      ,sum(totalSize30) as newtotalSize30, sum(totalSize40) as newtotalSize40
      ,sum(totalSize50) as newtotalSize50, [Year_Month],[newYear],
      CASE
        WHEN [Year_Month]  LIKE '%Jan%'  THEN 'a'
        WHEN [Year_Month]  LIKE '%Feb%'  THEN 'b'
        WHEN [Year_Month]  LIKE '%Mar%'  THEN 'c'
        WHEN [Year_Month]  LIKE '%Apr%'  THEN 'd' 
        WHEN [Year_Month]  LIKE '%May%'  THEN 'e'						 
        WHEN [Year_Month]  LIKE '%Jun%'  THEN 'f'						 
        WHEN [Year_Month]  LIKE '%Jul%'  THEN 'g'						 
        WHEN [Year_Month]  LIKE '%Aug%'  THEN 'h'						 
        WHEN [Year_Month]  LIKE '%Sep%'  THEN 'i'						 
        WHEN [Year_Month]  LIKE '%Oct%'  THEN 'j'						 
        WHEN [Year_Month]  LIKE '%Nov%'  THEN 'k'						 
        WHEN [Year_Month]  LIKE '%Dec%'  THEN 'l'						 
            ELSE 'other'
        END as _month
      From tb2
      group by [Year_Month],[mc_no],[newYear]
      --order by [newYear] asc, _month asc
      )
      SELECT sum(newtotalSize10) as newtotalSize10, sum(newtotalSize20) as newtotalSize20
      ,sum(newtotalSize30) as newtotalSize30, sum(newtotalSize40) as newtotalSize40
      ,sum(newtotalSize50) as newtotalSize50, [Year_Month], _month
      FROM sum_month
      GROUP BY [Year_Month],_month
      ORDER BY _month asc
    `
        );
        console.log("MD Monthly 1/4");
        console.log(resultdata_Ball);
        let arrayData_Ball_All = [];
        arrayData_Ball_All = resultdata_Ball[0];

        let resultUsage_Ball_All = [];
        arrayData_Ball_All.forEach(function (a) {
          if (!this[a.mc_no]) {
            this[a.mc_no] = { name: a.mc_no, data: [] };
            resultUsage_Ball_All.push(this[a.mc_no]);
          }
          this[a.mc_no].data.push(
            a.newtotalSize10,
            a.newtotalSize20,
            a.newtotalSize30,
            a.newtotalSize40,
            a.newtotalSize50
          );
        }, Object.create(null));

        let BallUsage_All = [resultUsage_Ball_All];
        let resultDate_Ball = [];
        arrayData_Ball_All.forEach(function (a) {
          if (!this[a.Year_Month]) {
            this[a.Year_Month] = { name: a.Year_Month };
            resultDate_Ball.push(this[a.Year_Month]);
          }
        }, Object.create(null));

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(BallUsage_All[0]);
        // console.log(newDate_Ball);

        res.json({
          resultBall_All: BallUsage_All[0],
          resultDateBall_All: newDate_Ball,

          // resultTarget_turn: seriesTarget_new,
        });
      } else if (req.body.size === "2.0") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,[mfg_date]
              ,max([ball_c1_ok])*8 as totalSize10
              ,max([ball_c2_ok])*8 as totalSize20
              ,max([ball_c3_ok])*8 as totalSize30
              ,max([ball_c4_ok])*8 as totalSize40
              ,max([ball_c5_ok])*8 as totalSize50
            ,[mc_no],model
            FROM [counter].[dbo].[app_counter_accumoutput_new]
            where (model like '%1350%' or model like '%1360%' ) and FORMAT([mfg_date], 'yyyy') ='${year}' -- or model like '')
            group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
            )
           ,tb2 as (
     SELECT  FORMAT([mfg_date], 'yyyy MMM') as Year_Month,
     FORMAT([mfg_date], 'yyyy') as newYear
    ,sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
    ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
    ,sum(totalSize50) as totalSize50,[mc_no]
    FROM tb1 as Alias_table
    group by FORMAT([mfg_date], 'yyyy MMM') ,[mc_no],FORMAT([mfg_date], 'yyyy')
    )
    ,sum_month as (select [mc_no] , sum(totalSize10) as newtotalSize10, sum(totalSize20) as newtotalSize20
    ,sum(totalSize30) as newtotalSize30, sum(totalSize40) as newtotalSize40
    ,sum(totalSize50) as newtotalSize50, [Year_Month],[newYear],
    CASE
      WHEN [Year_Month]  LIKE '%Jan%'  THEN 'a'
      WHEN [Year_Month]  LIKE '%Feb%'  THEN 'b'
      WHEN [Year_Month]  LIKE '%Mar%'  THEN 'c'
      WHEN [Year_Month]  LIKE '%Apr%'  THEN 'd' 
      WHEN [Year_Month]  LIKE '%May%'  THEN 'e'						 
      WHEN [Year_Month]  LIKE '%Jun%'  THEN 'f'						 
      WHEN [Year_Month]  LIKE '%Jul%'  THEN 'g'						 
      WHEN [Year_Month]  LIKE '%Aug%'  THEN 'h'						 
      WHEN [Year_Month]  LIKE '%Sep%'  THEN 'i'						 
      WHEN [Year_Month]  LIKE '%Oct%'  THEN 'j'						 
      WHEN [Year_Month]  LIKE '%Nov%'  THEN 'k'						 
      WHEN [Year_Month]  LIKE '%Dec%'  THEN 'l'						 
          ELSE 'other'
      END as _month
    From tb2
    group by [Year_Month],[mc_no],[newYear]
    --order by [newYear] asc, _month asc
    )
    SELECT sum(newtotalSize10) as newtotalSize10, sum(newtotalSize20) as newtotalSize20
    ,sum(newtotalSize30) as newtotalSize30, sum(newtotalSize40) as newtotalSize40
    ,sum(newtotalSize50) as newtotalSize50, [Year_Month], _month
    FROM sum_month
    GROUP BY [Year_Month],_month
    ORDER BY _month asc
  `
        );
        console.log("MD Monthly 2.0");
        console.log(resultdata_Ball);
        let arrayData_Ball_All = [];
        arrayData_Ball_All = resultdata_Ball[0];

        let resultUsage_Ball_All = [];
        arrayData_Ball_All.forEach(function (a) {
          if (!this[a.mc_no]) {
            this[a.mc_no] = { name: a.mc_no, data: [] };
            resultUsage_Ball_All.push(this[a.mc_no]);
          }
          this[a.mc_no].data.push(
            a.newtotalSize10,
            a.newtotalSize20,
            a.newtotalSize30,
            a.newtotalSize40,
            a.newtotalSize50
          );
        }, Object.create(null));

        let BallUsage_All = [resultUsage_Ball_All];
        let resultDate_Ball = [];
        arrayData_Ball_All.forEach(function (a) {
          if (!this[a.Year_Month]) {
            this[a.Year_Month] = { name: a.Year_Month };
            resultDate_Ball.push(this[a.Year_Month]);
          }
        }, Object.create(null));

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(BallUsage_All[0]);
        // console.log(newDate_Ball);

        res.json({
          resultBall_All: BallUsage_All[0],
          resultDateBall_All: newDate_Ball,

          // resultTarget_turn: seriesTarget_new,
        });
      } else if (req.body.size === "3.5") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(
            SELECT
              datepart(hour,[registered_at]) as newHours
                ,[mfg_date]
                ,max([ball_c1_ok])*7 as totalSize10
                ,max([ball_c2_ok])*7 as totalSize20
                ,max([ball_c3_ok])*7 as totalSize30
                ,max([ball_c4_ok])*7 as totalSize40
                ,max([ball_c5_ok])*7 as totalSize50
              ,[mc_no],model
              FROM [counter].[dbo].[app_counter_accumoutput_new]
              where (model like '%626%' ) and FORMAT([mfg_date], 'yyyy') ='${year}' -- ) -- or model like '')
              group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
              )
             ,tb2 as (
       SELECT  FORMAT([mfg_date], 'yyyy MMM') as Year_Month,
       FORMAT([mfg_date], 'yyyy') as newYear
      ,sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
      ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
      ,sum(totalSize50) as totalSize50,[mc_no]
      FROM tb1 as Alias_table
      group by FORMAT([mfg_date], 'yyyy MMM') ,[mc_no],FORMAT([mfg_date], 'yyyy')
      )
      ,sum_month as (select [mc_no] , sum(totalSize10) as newtotalSize10, sum(totalSize20) as newtotalSize20
      ,sum(totalSize30) as newtotalSize30, sum(totalSize40) as newtotalSize40
      ,sum(totalSize50) as newtotalSize50, [Year_Month],[newYear],
      CASE
        WHEN [Year_Month]  LIKE '%Jan%'  THEN 'a'
        WHEN [Year_Month]  LIKE '%Feb%'  THEN 'b'
        WHEN [Year_Month]  LIKE '%Mar%'  THEN 'c'
        WHEN [Year_Month]  LIKE '%Apr%'  THEN 'd' 
        WHEN [Year_Month]  LIKE '%May%'  THEN 'e'						 
        WHEN [Year_Month]  LIKE '%Jun%'  THEN 'f'						 
        WHEN [Year_Month]  LIKE '%Jul%'  THEN 'g'						 
        WHEN [Year_Month]  LIKE '%Aug%'  THEN 'h'						 
        WHEN [Year_Month]  LIKE '%Sep%'  THEN 'i'						 
        WHEN [Year_Month]  LIKE '%Oct%'  THEN 'j'						 
        WHEN [Year_Month]  LIKE '%Nov%'  THEN 'k'						 
        WHEN [Year_Month]  LIKE '%Dec%'  THEN 'l'						 
            ELSE 'other'
        END as _month
      From tb2
      group by [Year_Month],[mc_no],[newYear]
      --order by [newYear] asc, _month asc
      )
      SELECT sum(newtotalSize10) as newtotalSize10, sum(newtotalSize20) as newtotalSize20
      ,sum(newtotalSize30) as newtotalSize30, sum(newtotalSize40) as newtotalSize40
      ,sum(newtotalSize50) as newtotalSize50, [Year_Month], _month
      FROM sum_month
      GROUP BY [Year_Month],_month
      ORDER BY _month asc
    `
        );
        console.log("MD Monthly 3.5");
        console.log(resultdata_Ball);
        let arrayData_Ball_All = [];
        arrayData_Ball_All = resultdata_Ball[0];

        let resultUsage_Ball_All = [];
        arrayData_Ball_All.forEach(function (a) {
          if (!this[a.mc_no]) {
            this[a.mc_no] = { name: a.mc_no, data: [] };
            resultUsage_Ball_All.push(this[a.mc_no]);
          }
          this[a.mc_no].data.push(
            a.newtotalSize10,
            a.newtotalSize20,
            a.newtotalSize30,
            a.newtotalSize40,
            a.newtotalSize50
          );
        }, Object.create(null));

        let BallUsage_All = [resultUsage_Ball_All];
        let resultDate_Ball = [];
        arrayData_Ball_All.forEach(function (a) {
          if (!this[a.Year_Month]) {
            this[a.Year_Month] = { name: a.Year_Month };
            resultDate_Ball.push(this[a.Year_Month]);
          }
        }, Object.create(null));

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(BallUsage_All[0]);
        // console.log(newDate_Ball);

        res.json({
          resultBall_All: BallUsage_All[0],
          resultDateBall_All: newDate_Ball,

          // resultTarget_turn: seriesTarget_new,
        });
      } else if (req.body.size === "3/16") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,[mfg_date]
              ,max([ball_c1_ok])*8 as totalSize10
              ,max([ball_c2_ok])*8 as totalSize20
              ,max([ball_c3_ok])*8 as totalSize30
              ,max([ball_c4_ok])*8 as totalSize40
              ,max([ball_c5_ok])*8 as totalSize50
            ,[mc_no],model
            FROM [counter].[dbo].[app_counter_accumoutput_new]
            where (model like '%6001%') and FORMAT([mfg_date], 'yyyy') ='${year}' -- or model like '')
            group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
            UNION ALL
            with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,[mfg_date]
              ,max([ball_c1_ok])*9 as totalSize10
              ,max([ball_c2_ok])*9 as totalSize20
              ,max([ball_c3_ok])*9 as totalSize30
              ,max([ball_c4_ok])*9 as totalSize40
              ,max([ball_c5_ok])*9 as totalSize50
            ,[mc_no],model
            FROM [counter].[dbo].[app_counter_accumoutput_new]
            where (model like '%6002%' ) and FORMAT([mfg_date], 'yyyy') ='${year}' -- or model like '')
            group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
            )
           ,tb2 as (
     SELECT  FORMAT([mfg_date], 'yyyy MMM') as Year_Month,
     FORMAT([mfg_date], 'yyyy') as newYear
    ,sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
    ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
    ,sum(totalSize50) as totalSize50,[mc_no]
    FROM tb1 as Alias_table
    group by FORMAT([mfg_date], 'yyyy MMM') ,[mc_no],FORMAT([mfg_date], 'yyyy')
    )
    ,sum_month as (select [mc_no] , sum(totalSize10) as newtotalSize10, sum(totalSize20) as newtotalSize20
    ,sum(totalSize30) as newtotalSize30, sum(totalSize40) as newtotalSize40
    ,sum(totalSize50) as newtotalSize50, [Year_Month],[newYear],
    CASE
      WHEN [Year_Month]  LIKE '%Jan%'  THEN 'a'
      WHEN [Year_Month]  LIKE '%Feb%'  THEN 'b'
      WHEN [Year_Month]  LIKE '%Mar%'  THEN 'c'
      WHEN [Year_Month]  LIKE '%Apr%'  THEN 'd' 
      WHEN [Year_Month]  LIKE '%May%'  THEN 'e'						 
      WHEN [Year_Month]  LIKE '%Jun%'  THEN 'f'						 
      WHEN [Year_Month]  LIKE '%Jul%'  THEN 'g'						 
      WHEN [Year_Month]  LIKE '%Aug%'  THEN 'h'						 
      WHEN [Year_Month]  LIKE '%Sep%'  THEN 'i'						 
      WHEN [Year_Month]  LIKE '%Oct%'  THEN 'j'						 
      WHEN [Year_Month]  LIKE '%Nov%'  THEN 'k'						 
      WHEN [Year_Month]  LIKE '%Dec%'  THEN 'l'						 
          ELSE 'other'
      END as _month
    From tb2
    group by [Year_Month],[mc_no],[newYear]
    --order by [newYear] asc, _month asc
    )
    SELECT sum(newtotalSize10) as newtotalSize10, sum(newtotalSize20) as newtotalSize20
    ,sum(newtotalSize30) as newtotalSize30, sum(newtotalSize40) as newtotalSize40
    ,sum(newtotalSize50) as newtotalSize50, [Year_Month], _month
    FROM sum_month
    GROUP BY [Year_Month],_month
    ORDER BY _month asc
  
    -- 3/16`
        );
        console.log("MD Monthly 3/16");
        console.log(resultdata_Ball);
        let arrayData_Ball_All = [];
        arrayData_Ball_All = resultdata_Ball[0];

        let resultUsage_Ball_All = [];
        arrayData_Ball_All.forEach(function (a) {
          if (!this[a.mc_no]) {
            this[a.mc_no] = { name: a.mc_no, data: [] };
            resultUsage_Ball_All.push(this[a.mc_no]);
          }
          this[a.mc_no].data.push(
            a.newtotalSize10,
            a.newtotalSize20,
            a.newtotalSize30,
            a.newtotalSize40,
            a.newtotalSize50
          );
        }, Object.create(null));

        let BallUsage_All = [resultUsage_Ball_All];
        let resultDate_Ball = [];
        arrayData_Ball_All.forEach(function (a) {
          if (!this[a.Year_Month]) {
            this[a.Year_Month] = { name: a.Year_Month };
            resultDate_Ball.push(this[a.Year_Month]);
          }
        }, Object.create(null));

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(BallUsage_All[0]);
        // console.log(newDate_Ball);

        res.json({
          resultBall_All: BallUsage_All[0],
          resultDateBall_All: newDate_Ball,

          // resultTarget_turn: seriesTarget_new,
        });
      } else if (req.body.size === "3/32") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,[mfg_date]
              ,max([ball_c1_ok])*7 as totalSize10
              ,max([ball_c2_ok])*7 as totalSize20
              ,max([ball_c3_ok])*7 as totalSize30
              ,max([ball_c4_ok])*7 as totalSize40
              ,max([ball_c5_ok])*7 as totalSize50
            ,[mc_no],model
            FROM [counter].[dbo].[app_counter_accumoutput_new]
            where (model like '%1340%' ) and FORMAT([mfg_date], 'yyyy') ='${year}' -- or model like '')
            group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
            UNION ALL 
          SELECT
            datepart(hour,[registered_at]) as newHours
              ,[mfg_date]
              ,max([ball_c1_ok])*9 as totalSize7_MC10
              ,max([ball_c2_ok])*9 as totalSize7_MC20
              ,max([ball_c3_ok])*9 as totalSize7_MC30
              ,max([ball_c4_ok])*9 as totalSize7_MC40
              ,max([ball_c5_ok])*9 as totalSize7_MC50
            ,[mc_no],model
            FROM [counter].[dbo].[app_counter_accumoutput_new]
            where (model like '%1660%' OR model like '%1680%') and FORMAT([mfg_date], 'yyyy') ='${year}'
            group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
            UNION ALL 
            SELECT
              datepart(hour,[registered_at]) as newHours
                ,[mfg_date]
                ,max([ball_c1_ok])*15 as totalSize7_MC10
                ,max([ball_c2_ok])*15 as totalSize7_MC20
                ,max([ball_c3_ok])*15 as totalSize7_MC30
                ,max([ball_c4_ok])*15 as totalSize7_MC40
                ,max([ball_c5_ok])*15 as totalSize7_MC50
              ,[mc_no],model
              FROM [counter].[dbo].[app_counter_accumoutput_new]
              where (model like '%6803%') and FORMAT([mfg_date], 'yyyy') ='${year}'
              group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
             )
           ,tb2 as (
     SELECT  FORMAT([mfg_date], 'yyyy MMM') as Year_Month,
     FORMAT([mfg_date], 'yyyy') as newYear
    ,sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
    ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
    ,sum(totalSize50) as totalSize50,[mc_no]
    FROM tb1 as Alias_table
    group by FORMAT([mfg_date], 'yyyy MMM') ,[mc_no],FORMAT([mfg_date], 'yyyy')
    )
    ,sum_month as (select [mc_no] , sum(totalSize10) as newtotalSize10, sum(totalSize20) as newtotalSize20
    ,sum(totalSize30) as newtotalSize30, sum(totalSize40) as newtotalSize40
    ,sum(totalSize50) as newtotalSize50, [Year_Month],[newYear],
    CASE
      WHEN [Year_Month]  LIKE '%Jan%'  THEN 'a'
      WHEN [Year_Month]  LIKE '%Feb%'  THEN 'b'
      WHEN [Year_Month]  LIKE '%Mar%'  THEN 'c'
      WHEN [Year_Month]  LIKE '%Apr%'  THEN 'd' 
      WHEN [Year_Month]  LIKE '%May%'  THEN 'e'						 
      WHEN [Year_Month]  LIKE '%Jun%'  THEN 'f'						 
      WHEN [Year_Month]  LIKE '%Jul%'  THEN 'g'						 
      WHEN [Year_Month]  LIKE '%Aug%'  THEN 'h'						 
      WHEN [Year_Month]  LIKE '%Sep%'  THEN 'i'						 
      WHEN [Year_Month]  LIKE '%Oct%'  THEN 'j'						 
      WHEN [Year_Month]  LIKE '%Nov%'  THEN 'k'						 
      WHEN [Year_Month]  LIKE '%Dec%'  THEN 'l'						 
          ELSE 'other'
      END as _month
    From tb2
    group by [Year_Month],[mc_no],[newYear]
    --order by [newYear] asc, _month asc
    )
    SELECT sum(newtotalSize10) as newtotalSize10, sum(newtotalSize20) as newtotalSize20
    ,sum(newtotalSize30) as newtotalSize30, sum(newtotalSize40) as newtotalSize40
    ,sum(newtotalSize50) as newtotalSize50, [Year_Month], _month
    FROM sum_month
    GROUP BY [Year_Month],_month
    ORDER BY _month asc
  `
        );
        console.log("MD Monthly 3/32");
        console.log(resultdata_Ball);
        let arrayData_Ball_All = [];
        arrayData_Ball_All = resultdata_Ball[0];

        let resultUsage_Ball_All = [];
        arrayData_Ball_All.forEach(function (a) {
          if (!this[a.mc_no]) {
            this[a.mc_no] = { name: a.mc_no, data: [] };
            resultUsage_Ball_All.push(this[a.mc_no]);
          }
          this[a.mc_no].data.push(
            a.newtotalSize10,
            a.newtotalSize20,
            a.newtotalSize30,
            a.newtotalSize40,
            a.newtotalSize50
          );
        }, Object.create(null));

        let BallUsage_All = [resultUsage_Ball_All];
        let resultDate_Ball = [];
        arrayData_Ball_All.forEach(function (a) {
          if (!this[a.Year_Month]) {
            this[a.Year_Month] = { name: a.Year_Month };
            resultDate_Ball.push(this[a.Year_Month]);
          }
        }, Object.create(null));

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(BallUsage_All[0]);
        // console.log(newDate_Ball);

        res.json({
          resultBall_All: BallUsage_All[0],
          resultDateBall_All: newDate_Ball,

          // resultTarget_turn: seriesTarget_new,
        });
      } else if (req.body.size === "5/32") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,[mfg_date]
              ,max([ball_c1_ok])*7 as totalSize10
              ,max([ball_c2_ok])*7 as totalSize20
              ,max([ball_c3_ok])*7 as totalSize30
              ,max([ball_c4_ok])*7 as totalSize40
              ,max([ball_c5_ok])*7 as totalSize50
            ,[mc_no],model
            FROM [counter].[dbo].[app_counter_accumoutput_new]
            where (model like '%608%' ) and FORMAT([mfg_date], 'yyyy') ='${year}' -- or model like '')
            group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
           )
           ,tb2 as (
     SELECT  FORMAT([mfg_date], 'yyyy MMM') as Year_Month,
     FORMAT([mfg_date], 'yyyy') as newYear
    ,sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
    ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
    ,sum(totalSize50) as totalSize50,[mc_no]
    FROM tb1 as Alias_table
    group by FORMAT([mfg_date], 'yyyy MMM') ,[mc_no],FORMAT([mfg_date], 'yyyy')
    )
    ,sum_month as (select [mc_no] , sum(totalSize10) as newtotalSize10, sum(totalSize20) as newtotalSize20
    ,sum(totalSize30) as newtotalSize30, sum(totalSize40) as newtotalSize40
    ,sum(totalSize50) as newtotalSize50, [Year_Month],[newYear],
    CASE
      WHEN [Year_Month]  LIKE '%Jan%'  THEN 'a'
      WHEN [Year_Month]  LIKE '%Feb%'  THEN 'b'
      WHEN [Year_Month]  LIKE '%Mar%'  THEN 'c'
      WHEN [Year_Month]  LIKE '%Apr%'  THEN 'd' 
      WHEN [Year_Month]  LIKE '%May%'  THEN 'e'						 
      WHEN [Year_Month]  LIKE '%Jun%'  THEN 'f'						 
      WHEN [Year_Month]  LIKE '%Jul%'  THEN 'g'						 
      WHEN [Year_Month]  LIKE '%Aug%'  THEN 'h'						 
      WHEN [Year_Month]  LIKE '%Sep%'  THEN 'i'						 
      WHEN [Year_Month]  LIKE '%Oct%'  THEN 'j'						 
      WHEN [Year_Month]  LIKE '%Nov%'  THEN 'k'						 
      WHEN [Year_Month]  LIKE '%Dec%'  THEN 'l'						 
          ELSE 'other'
      END as _month
    From tb2
    group by [Year_Month],[mc_no],[newYear]
    --order by [newYear] asc, _month asc
    )
    SELECT sum(newtotalSize10) as newtotalSize10, sum(newtotalSize20) as newtotalSize20
    ,sum(newtotalSize30) as newtotalSize30, sum(newtotalSize40) as newtotalSize40
    ,sum(newtotalSize50) as newtotalSize50, [Year_Month], _month
    FROM sum_month
    GROUP BY [Year_Month],_month
    ORDER BY _month asc
  `
        );
        console.log(" Monthly 5/32");
        console.log(resultdata_Ball);
        let arrayData_Ball_All = [];
        arrayData_Ball_All = resultdata_Ball[0];

        let resultUsage_Ball_All = [];
        arrayData_Ball_All.forEach(function (a) {
          if (!this[a.mc_no]) {
            this[a.mc_no] = { name: a.mc_no, data: [] };
            resultUsage_Ball_All.push(this[a.mc_no]);
          }
          this[a.mc_no].data.push(
            a.newtotalSize10,
            a.newtotalSize20,
            a.newtotalSize30,
            a.newtotalSize40,
            a.newtotalSize50
          );
        }, Object.create(null));

        let BallUsage_All = [resultUsage_Ball_All];
        let resultDate_Ball = [];
        arrayData_Ball_All.forEach(function (a) {
          if (!this[a.Year_Month]) {
            this[a.Year_Month] = { name: a.Year_Month };
            resultDate_Ball.push(this[a.Year_Month]);
          }
        }, Object.create(null));

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(BallUsage_All[0]);
        // console.log(newDate_Ball);

        res.json({
          resultBall_All: BallUsage_All[0],
          resultDateBall_All: newDate_Ball,

          // resultTarget_turn: seriesTarget_new,
        });
      } else if (req.body.size === "7/64") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,[mfg_date]
              ,max([ball_c1_ok])*7 as totalSize10
              ,max([ball_c2_ok])*7 as totalSize20
              ,max([ball_c3_ok])*7 as totalSize30
              ,max([ball_c4_ok])*7 as totalSize40
              ,max([ball_c5_ok])*7 as totalSize50
            ,[mc_no],model
            FROM [counter].[dbo].[app_counter_accumoutput_new]
            where (model like '%1560%' )  and FORMAT([mfg_date], 'yyyy') ='${year}' -- or model like '')
            group by [mfg_date],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[model],datepart(hour,[registered_at])
           )
           ,tb2 as (
     SELECT  FORMAT([mfg_date], 'yyyy MMM') as Year_Month,
     FORMAT([mfg_date], 'yyyy') as newYear
    ,sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
    ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
    ,sum(totalSize50) as totalSize50,[mc_no]
    FROM tb1 as Alias_table
    group by FORMAT([mfg_date], 'yyyy MMM') ,[mc_no],FORMAT([mfg_date], 'yyyy')
    )
    ,sum_month as (select [mc_no] , sum(totalSize10) as newtotalSize10, sum(totalSize20) as newtotalSize20
    ,sum(totalSize30) as newtotalSize30, sum(totalSize40) as newtotalSize40
    ,sum(totalSize50) as newtotalSize50, [Year_Month],[newYear],
    CASE
      WHEN [Year_Month]  LIKE '%Jan%'  THEN 'a'
      WHEN [Year_Month]  LIKE '%Feb%'  THEN 'b'
      WHEN [Year_Month]  LIKE '%Mar%'  THEN 'c'
      WHEN [Year_Month]  LIKE '%Apr%'  THEN 'd' 
      WHEN [Year_Month]  LIKE '%May%'  THEN 'e'						 
      WHEN [Year_Month]  LIKE '%Jun%'  THEN 'f'						 
      WHEN [Year_Month]  LIKE '%Jul%'  THEN 'g'						 
      WHEN [Year_Month]  LIKE '%Aug%'  THEN 'h'						 
      WHEN [Year_Month]  LIKE '%Sep%'  THEN 'i'						 
      WHEN [Year_Month]  LIKE '%Oct%'  THEN 'j'						 
      WHEN [Year_Month]  LIKE '%Nov%'  THEN 'k'						 
      WHEN [Year_Month]  LIKE '%Dec%'  THEN 'l'						 
          ELSE 'other'
      END as _month
    From tb2
    group by [Year_Month],[mc_no],[newYear]
    --order by [newYear] asc, _month asc
    )
    SELECT sum(newtotalSize10) as newtotalSize10, sum(newtotalSize20) as newtotalSize20
    ,sum(newtotalSize30) as newtotalSize30, sum(newtotalSize40) as newtotalSize40
    ,sum(newtotalSize50) as newtotalSize50, [Year_Month], _month
    FROM sum_month
    GROUP BY [Year_Month],_month
    ORDER BY _month asc
  `
        );
        console.log("MD Monthly 7/64");
        console.log(resultdata_Ball);
        let arrayData_Ball_All = [];
        arrayData_Ball_All = resultdata_Ball[0];

        let resultUsage_Ball_All = [];
        arrayData_Ball_All.forEach(function (a) {
          if (!this[a.mc_no]) {
            this[a.mc_no] = { name: a.mc_no, data: [] };
            resultUsage_Ball_All.push(this[a.mc_no]);
          }
          this[a.mc_no].data.push(
            a.newtotalSize10,
            a.newtotalSize20,
            a.newtotalSize30,
            a.newtotalSize40,
            a.newtotalSize50
          );
        }, Object.create(null));

        let BallUsage_All = [resultUsage_Ball_All];
        let resultDate_Ball = [];
        arrayData_Ball_All.forEach(function (a) {
          if (!this[a.Year_Month]) {
            this[a.Year_Month] = { name: a.Year_Month };
            resultDate_Ball.push(this[a.Year_Month]);
          }
        }, Object.create(null));

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(BallUsage_All[0]);
        // console.log(newDate_Ball);

        res.json({
          resultBall_All: BallUsage_All[0],
          resultDateBall_All: newDate_Ball,

          // resultTarget_turn: seriesTarget_new,
        });
      }
    } else {
      res.json({
        result: "NO DATA",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});

// MD By Size / Part
router.post(
  "/MBRC_Ball_Size_MD_Daily/:start_date/:end_date",
  async (req, res) => {
    try {
      let { start_date } = req.params;
      let { end_date } = req.params;
      if (req.body.size === "1/4") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
              ,max([ball_c1_ok])*7 as totalSize10
              ,max([ball_c2_ok])*7 as totalSize20
              ,max([ball_c3_ok])*7 as totalSize30
              ,max([ball_c4_ok])*7 as totalSize40
              ,max([ball_c5_ok])*7 as totalSize50
            ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
            FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
            where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  
        and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%6202%' ) -- or model like '')
            group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
            )
              SELECT mfg_date,
              FORMAT(sum(totalSize10), '#,##0') as totalSize10,FORMAT(sum(totalSize20), '#,##0') as totalSize20
                ,FORMAT(sum(totalSize30), '#,##0') as totalSize30,FORMAT(sum(totalSize40), '#,##0') as totalSize40
                ,FORMAT(sum(totalSize50), '#,##0') as totalSize50
              FROM tb1
                group by mfg_date
                order by mfg_date asc
      ------ 1/4`
        );
        console.log(" === MD === size 1/4 ===");
        // console.log(resultdata_Ball);
        arrayData_Ball_Daily = resultdata_Ball[0];

        let resultStock_Ball_Daily = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date, data: [] };
            resultStock_Ball_Daily.push(this[a.mfg_date]);
          }
          this[a.mfg_date].data.push(
            a.totalSize10,
            a.totalSize20,
            a.totalSize30,
            a.totalSize40,
            a.totalSize50
          );
        }, Object.create(null));
        // console.log(resultStock_Ball_Daily);

        let Ball_Daily = [resultStock_Ball_Daily];
        let resultDate_Ball = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];
        for (let index = 0; index < resultStock_Ball_Daily.length; index++) {
          const item = resultStock_Ball_Daily[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        console.log("=================");
        // console.log(getarr);
        //set arr name,data
        let result_Ball_Daily = [];
        let nameSizeball = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        for (let index = 0; index < getarr.length; index++) {
          result_Ball_Daily.push({
            name: nameSizeball[index],
            data: getarr[index],
          });
        }

        console.log(result_Ball_Daily);

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(Ball_Daily[0]);
        console.log(resultdata_Ball);

        res.json({
          resultBall: result_Ball_Daily,
          result: resultdata_Ball, //for table
          // resultBall: Ball_Daily[0],
          resultDateBall: newDate_Ball,
        });
      } else if (req.body.size === "2.0") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
              ,max([ball_c1_ok])*8 as totalSize10
              ,max([ball_c2_ok])*8 as totalSize20
              ,max([ball_c3_ok])*8 as totalSize30
              ,max([ball_c4_ok])*8 as totalSize40
              ,max([ball_c5_ok])*8 as totalSize50
            ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
            FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
            where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  
        and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1350%' 
      or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1360%' ) -- or model like '')
            group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
        ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
            )
              SELECT mfg_date,
              FORMAT(sum(totalSize10), '#,##0') as totalSize10,FORMAT(sum(totalSize20), '#,##0') as totalSize20
              ,FORMAT(sum(totalSize30), '#,##0') as totalSize30,FORMAT(sum(totalSize40), '#,##0') as totalSize40
              ,FORMAT(sum(totalSize50), '#,##0') as totalSize50
              FROM tb1
                group by mfg_date
                order by mfg_date asc
    ------ 2.0`
        );
        console.log("=== MD === 2.0 ===");
        // console.log(resultdata_Ball);
        arrayData_Ball_Daily = resultdata_Ball[0];

        let resultStock_Ball_Daily = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date, data: [] };
            resultStock_Ball_Daily.push(this[a.mfg_date]);
          }
          this[a.mfg_date].data.push(
            a.totalSize10,
            a.totalSize20,
            a.totalSize30,
            a.totalSize40,
            a.totalSize50
          );
        }, Object.create(null));
        // console.log(resultStock_Ball_Daily);

        let Ball_Daily = [resultStock_Ball_Daily];
        let resultDate_Ball = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];
        for (let index = 0; index < resultStock_Ball_Daily.length; index++) {
          const item = resultStock_Ball_Daily[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        console.log("=================");
        // console.log(getarr);
        //set arr name,data
        let result_Ball_Daily = [];
        let nameSizeball = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        for (let index = 0; index < getarr.length; index++) {
          result_Ball_Daily.push({
            name: nameSizeball[index],
            data: getarr[index],
          });
        }

        console.log(result_Ball_Daily);

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(Ball_Daily[0]);
        console.log(resultdata_Ball);

        res.json({
          resultBall: result_Ball_Daily,
          result: resultdata_Ball, //for table
          // resultBall: Ball_Daily[0],
          resultDateBall: newDate_Ball,
        });
      } else if (req.body.size === "3.5") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(
            SELECT
              datepart(hour,[registered_at]) as newHours
                ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                ,max([ball_c1_ok])*7 as totalSize10
                ,max([ball_c2_ok])*7 as totalSize20
                ,max([ball_c3_ok])*7 as totalSize30
                ,max([ball_c4_ok])*7 as totalSize40
                ,max([ball_c5_ok])*7 as totalSize50
              ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
              FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
              where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  
          and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%626%' ) -- ) -- or model like '')
              group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
              )
                SELECT mfg_date,
                  
              FORMAT(sum(totalSize10), '#,##0') as totalSize10,FORMAT(sum(totalSize20), '#,##0') as totalSize20
              ,FORMAT(sum(totalSize30), '#,##0') as totalSize30,FORMAT(sum(totalSize40), '#,##0') as totalSize40
              ,FORMAT(sum(totalSize50), '#,##0') as totalSize50
                FROM tb1
                  group by mfg_date
                  order by mfg_date asc
      ------ 3.5`
        );
        console.log(" === MD === 3.5 ===");
        // console.log(resultdata_Ball);
        arrayData_Ball_Daily = resultdata_Ball[0];

        let resultStock_Ball_Daily = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date, data: [] };
            resultStock_Ball_Daily.push(this[a.mfg_date]);
          }
          this[a.mfg_date].data.push(
            a.totalSize10,
            a.totalSize20,
            a.totalSize30,
            a.totalSize40,
            a.totalSize50
          );
        }, Object.create(null));
        // console.log(resultStock_Ball_Daily);

        let Ball_Daily = [resultStock_Ball_Daily];
        let resultDate_Ball = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];
        for (let index = 0; index < resultStock_Ball_Daily.length; index++) {
          const item = resultStock_Ball_Daily[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        console.log("=================");
        // console.log(getarr);
        //set arr name,data
        let result_Ball_Daily = [];
        let nameSizeball = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        for (let index = 0; index < getarr.length; index++) {
          result_Ball_Daily.push({
            name: nameSizeball[index],
            data: getarr[index],
          });
        }

        console.log(result_Ball_Daily);

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(Ball_Daily[0]);
        console.log(resultdata_Ball);

        res.json({
          resultBall: result_Ball_Daily,
          result: resultdata_Ball, //for table
          // resultBall: Ball_Daily[0],
          resultDateBall: newDate_Ball,
        });
      } else if (req.body.size === "3/16") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
              ,max([ball_c1_ok])*8 as totalSize10
              ,max([ball_c2_ok])*8 as totalSize20
              ,max([ball_c3_ok])*8 as totalSize30
              ,max([ball_c4_ok])*8 as totalSize40
              ,max([ball_c5_ok])*8 as totalSize50
            ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
            FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
            where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  
        and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%6001%' 
      or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%6002%' ) -- or model like '')
            group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
        ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
            )
        SELECT mfg_date,
        FORMAT(sum(totalSize10), '#,##0') as totalSize10,FORMAT(sum(totalSize20), '#,##0') as totalSize20
        ,FORMAT(sum(totalSize30), '#,##0') as totalSize30,FORMAT(sum(totalSize40), '#,##0') as totalSize40
        ,FORMAT(sum(totalSize50), '#,##0') as totalSize50
        FROM tb1
          group by mfg_date
          order by mfg_date asc
              ------ 3/16 ------`
        );
        console.log(" === MD === 3/16 ===");
        // console.log(resultdata_Ball);
        arrayData_Ball_Daily = resultdata_Ball[0];

        let resultStock_Ball_Daily = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date, data: [] };
            resultStock_Ball_Daily.push(this[a.mfg_date]);
          }
          this[a.mfg_date].data.push(
            a.totalSize10,
            a.totalSize20,
            a.totalSize30,
            a.totalSize40,
            a.totalSize50
          );
        }, Object.create(null));
        // console.log(resultStock_Ball_Daily);

        let Ball_Daily = [resultStock_Ball_Daily];
        let resultDate_Ball = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];
        for (let index = 0; index < resultStock_Ball_Daily.length; index++) {
          const item = resultStock_Ball_Daily[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        console.log("=================");
        // console.log(getarr);
        //set arr name,data
        let result_Ball_Daily = [];
        let nameSizeball = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        for (let index = 0; index < getarr.length; index++) {
          result_Ball_Daily.push({
            name: nameSizeball[index],
            data: getarr[index],
          });
        }

        console.log(result_Ball_Daily);

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(Ball_Daily[0]);
        console.log(resultdata_Ball);

        res.json({
          resultBall: result_Ball_Daily,
          result: resultdata_Ball, //for table
          // resultBall: Ball_Daily[0],
          resultDateBall: newDate_Ball,
        });
      } else if (req.body.size === "3/32") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
              ,max([ball_c1_ok])*7 as totalSize10
              ,max([ball_c2_ok])*7 as totalSize20
              ,max([ball_c3_ok])*7 as totalSize30
              ,max([ball_c4_ok])*7 as totalSize40
              ,max([ball_c5_ok])*7 as totalSize50
            ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
            FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
            where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  
        and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1340%' ) -- or model like '')
            group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
        ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
            UNION ALL 
          SELECT
            datepart(hour,[registered_at]) as newHours
              ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
              ,max([ball_c1_ok])*9 as totalSize7_MC10
              ,max([ball_c2_ok])*9 as totalSize7_MC20
              ,max([ball_c3_ok])*9 as totalSize7_MC30
              ,max([ball_c4_ok])*9 as totalSize7_MC40
              ,max([ball_c5_ok])*9 as totalSize7_MC50
            ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
            FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
            where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' ) 
        and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1660%' OR (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1680%')
            group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
        ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
            UNION ALL 
            SELECT
              datepart(hour,[registered_at]) as newHours
                ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                ,max([ball_c1_ok])*15 as totalSize7_MC10
                ,max([ball_c2_ok])*15 as totalSize7_MC20
                ,max([ball_c3_ok])*15 as totalSize7_MC30
                ,max([ball_c4_ok])*15 as totalSize7_MC40
                ,max([ball_c5_ok])*15 as totalSize7_MC50
              ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
              FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
              where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' ) 
        and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%6803%')
              group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
        ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
             )
              SELECT mfg_date,
              FORMAT(sum(totalSize10), '#,##0') as totalSize10,FORMAT(sum(totalSize20), '#,##0') as totalSize20
              ,FORMAT(sum(totalSize30), '#,##0') as totalSize30,FORMAT(sum(totalSize40), '#,##0') as totalSize40
              ,FORMAT(sum(totalSize50), '#,##0') as totalSize50
              FROM tb1
                group by mfg_date
                order by mfg_date asc
    ------ 3/32`
        );
        console.log(" === MD === 3/32 ===");
        // console.log(resultdata_Ball);
        arrayData_Ball_Daily = resultdata_Ball[0];

        let resultStock_Ball_Daily = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date, data: [] };
            resultStock_Ball_Daily.push(this[a.mfg_date]);
          }
          this[a.mfg_date].data.push(
            a.totalSize10,
            a.totalSize20,
            a.totalSize30,
            a.totalSize40,
            a.totalSize50
          );
        }, Object.create(null));
        // console.log(resultStock_Ball_Daily);

        let Ball_Daily = [resultStock_Ball_Daily];
        let resultDate_Ball = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];
        for (let index = 0; index < resultStock_Ball_Daily.length; index++) {
          const item = resultStock_Ball_Daily[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        console.log("=================");
        // console.log(getarr);
        //set arr name,data
        let result_Ball_Daily = [];
        let nameSizeball = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        for (let index = 0; index < getarr.length; index++) {
          result_Ball_Daily.push({
            name: nameSizeball[index],
            data: getarr[index],
          });
        }

        console.log(result_Ball_Daily);

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(Ball_Daily[0]);
        console.log(resultdata_Ball);

        res.json({
          resultBall: result_Ball_Daily,
          result: resultdata_Ball, //for table
          // resultBall: Ball_Daily[0],
          resultDateBall: newDate_Ball,
        });
      } else if (req.body.size === "5/32") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
              ,max([ball_c1_ok])*7 as totalSize10
              ,max([ball_c2_ok])*7 as totalSize20
              ,max([ball_c3_ok])*7 as totalSize30
              ,max([ball_c4_ok])*7 as totalSize40
              ,max([ball_c5_ok])*7 as totalSize50
            ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
            FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
            where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  
        and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%608%' ) -- or model like '')
            group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
        ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
           )
              SELECT mfg_date,
              FORMAT(sum(totalSize10), '#,##0') as totalSize10,FORMAT(sum(totalSize20), '#,##0') as totalSize20
              ,FORMAT(sum(totalSize30), '#,##0') as totalSize30,FORMAT(sum(totalSize40), '#,##0') as totalSize40
              ,FORMAT(sum(totalSize50), '#,##0') as totalSize50
              FROM tb1
                group by mfg_date
                order by mfg_date asc
    ------ 5/32`
        );
        console.log(" === MD === 5/32===");
        // console.log(resultdata_Ball);
        arrayData_Ball_Daily = resultdata_Ball[0];

        let resultStock_Ball_Daily = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date, data: [] };
            resultStock_Ball_Daily.push(this[a.mfg_date]);
          }
          this[a.mfg_date].data.push(
            a.totalSize10,
            a.totalSize20,
            a.totalSize30,
            a.totalSize40,
            a.totalSize50
          );
        }, Object.create(null));
        // console.log(resultStock_Ball_Daily);

        let Ball_Daily = [resultStock_Ball_Daily];
        let resultDate_Ball = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];
        for (let index = 0; index < resultStock_Ball_Daily.length; index++) {
          const item = resultStock_Ball_Daily[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        console.log("=================");
        // console.log(getarr);
        //set arr name,data
        let result_Ball_Daily = [];
        let nameSizeball = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        for (let index = 0; index < getarr.length; index++) {
          result_Ball_Daily.push({
            name: nameSizeball[index],
            data: getarr[index],
          });
        }

        console.log(result_Ball_Daily);

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(Ball_Daily[0]);
        console.log(resultdata_Ball);

        res.json({
          resultBall: result_Ball_Daily,
          result: resultdata_Ball, //for table
          // resultBall: Ball_Daily[0],
          resultDateBall: newDate_Ball,
        });
      } else if (req.body.size === "7/64") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
              ,max([ball_c1_ok])*7 as totalSize10
              ,max([ball_c2_ok])*7 as totalSize20
              ,max([ball_c3_ok])*7 as totalSize30
              ,max([ball_c4_ok])*7 as totalSize40
              ,max([ball_c5_ok])*7 as totalSize50
            ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
            FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
            where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${start_date}' and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  
        and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1560%' ) -- or model like '')
            group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
        ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
           )
              SELECT mfg_date,
              FORMAT(sum(totalSize10), '#,##0') as totalSize10,FORMAT(sum(totalSize20), '#,##0') as totalSize20
              ,FORMAT(sum(totalSize30), '#,##0') as totalSize30,FORMAT(sum(totalSize40), '#,##0') as totalSize40
              ,FORMAT(sum(totalSize50), '#,##0') as totalSize50
              FROM tb1
                group by mfg_date
                order by mfg_date asc
    ------ 7/64 ------ `
        );
        console.log("=== MD === 7/64 ===");
        // console.log(resultdata_Ball);
        arrayData_Ball_Daily = resultdata_Ball[0];

        let resultStock_Ball_Daily = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date, data: [] };
            resultStock_Ball_Daily.push(this[a.mfg_date]);
          }
          this[a.mfg_date].data.push(
            a.totalSize10,
            a.totalSize20,
            a.totalSize30,
            a.totalSize40,
            a.totalSize50
          );
        }, Object.create(null));
        // console.log(resultStock_Ball_Daily);

        let Ball_Daily = [resultStock_Ball_Daily];
        let resultDate_Ball = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];
        for (let index = 0; index < resultStock_Ball_Daily.length; index++) {
          const item = resultStock_Ball_Daily[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        console.log("=================");
        // console.log(getarr);
        //set arr name,data
        let result_Ball_Daily = [];
        let nameSizeball = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        for (let index = 0; index < getarr.length; index++) {
          result_Ball_Daily.push({
            name: nameSizeball[index],
            data: getarr[index],
          });
        }

        console.log(result_Ball_Daily);

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(Ball_Daily[0]);
        console.log(resultdata_Ball);

        res.json({
          resultBall: result_Ball_Daily,
          result: resultdata_Ball, //for table
          // resultBall: Ball_Daily[0],
          resultDateBall: newDate_Ball,
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        error,
        api_result: constance.result_nok,
      });
    }
  }
);
router.get("/MBRC_Ball_onHand/:start_date/:end_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let { end_date } = req.params;
    let resultdata_Ball_onHand = await MBR_table.sequelize.query(`
      SELECT  max([stock_date]) as lastestDate
      ,[item_no]
      ,CASE
      WHEN ball_stock.item_no  LIKE '%3N%'  THEN 'BT111U3N 5240'
	       WHEN ball_stock.item_no  LIKE '%4N%'  THEN 'BT111U4N 5240'
		        WHEN ball_stock.item_no  LIKE '%5N%'  THEN 'BT111U5N 5240'
				     WHEN ball_stock.item_no  LIKE '%6N%'  THEN 'BT111U6N 5240' 
					      WHEN ball_stock.item_no LIKE '%7N%'  THEN 'BT111U7N 5240'						 
        ELSE 'other'
    END as dec
    ,[spec]
    ,[on_hand] as New_onHand
    FROM [data_ball].[dbo].[ball_stock]
    where [stock_date] between '${start_date}'and'${end_date}' and item_no in ('BT111U3NT9','BT111U4NT9',
    'BT111U5NT9','BT111U6NT9','BT111U7NT9')
    group by [stock_date],[item_no],[spec],[on_hand]
        `);
    arrayData_Ball_onHand = resultdata_Ball_onHand[0];

    let resultStock_Ball_onHand = [];
    arrayData_Ball_onHand.forEach(function (a) {
      if (!this[a.dec]) {
        this[a.dec] = { name: a.dec, data: [] };
        resultStock_Ball_onHand.push(this[a.dec]);
      }
      this[a.dec].data.push(a.New_onHand);
    }, Object.create(null));
    // console.log(resultStock_Ball_onHand);

    let Ball_Stock_onHand = [resultStock_Ball_onHand];
    let resultDate_Ball = [];
    arrayData_Ball_onHand.forEach(function (a) {
      if (!this[a.lastestDate]) {
        this[a.lastestDate] = { name: a.lastestDate };
        resultDate_Ball.push(this[a.lastestDate]);
      }
    }, Object.create(null));

    let newDate_Ball = [];
    for (let index = 0; index < resultDate_Ball.length; index++) {
      const item = resultDate_Ball[index];
      await newDate_Ball.push(item.name);
    }

    // console.log(Ball_Stock_onHand[0]);
    // console.log(newDate_Ball);

    res.json({
      resultBall_onHand: Ball_Stock_onHand[0],
      resultDateBall_onHand: newDate_Ball,

      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});
// onhand by size SUJ === Table ===
router.post(
  "/MBRC_Ball_onHand_size_SUJ/:start_date/:end_date",
  async (req, res) => {
    try {
      let { start_date } = req.params;
      let { end_date } = req.params;
      if (req.body.type === "SUJ") {
        if (req.body.size === "1/32") {
          let resultdata_Ball_onHand = await MBR_table.sequelize.query(`
    SELECT
    lastestDate,
    COALESCE(SUM([BALL GRADE -2.5]), 0) AS [totalSize20],
    COALESCE(SUM([BALL GRADE 0.0]), 0) AS [totalSize30],
    COALESCE(SUM([BALL GRADE +2.5]), 0) AS [totalSize40]
    FROM (
    SELECT  max([stock_date]) as lastestDate
    ,[item_no]
    ,CASE
    -- SUJ 1/32
    WHEN ball_stock.item_no  = 'BT131V4LT9'  THEN 'BALL GRADE -2.5'
    WHEN ball_stock.item_no  = 'BT131V5LT9'  THEN 'BALL GRADE 0.0'
    WHEN ball_stock.item_no  = 'BT131V6LT9'  THEN 'BALL GRADE +2.5'
    ELSE 'other'
      END as dec
    ,[spec]
    ,[on_hand] as New_onHand
    FROM [data_ball].[dbo].[ball_stock]
    where [stock_date] between '${start_date}'and'${end_date}' and item_no in ('BT131V4LT9','BT131V5LT9','BT131V6LT9')
    group by [stock_date],[item_no],[spec],[on_hand]
    ) AS SourceTable
    PIVOT (
        SUM(New_onHand)
        FOR dec IN ([BALL GRADE -2.5], [BALL GRADE 0.0], [BALL GRADE +2.5])
    ) AS PivotTable
    GROUP BY lastestDate;
        `);
          let arrayData_Ball_onHand = resultdata_Ball_onHand[0];

          const newDate_Ball = [
            ...new Set(arrayData_Ball_onHand.map((item) => item.lastestDate)),
          ];
          console.log(newDate_Ball);
          console.log(resultdata_Ball_onHand[0]);

          let resultStock_Ball_onHand = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.dec]) {
              this[a.dec] = { name: a.dec, data: [] };
              resultStock_Ball_onHand.push(this[a.dec]);
            }
            this[a.dec].data.push(a.New_onHand);
          }, Object.create(null));

          let Ball_Stock_onHand = [resultStock_Ball_onHand];
          let resultDate_Ball = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.lastestDate]) {
              this[a.lastestDate] = { name: a.lastestDate };
              resultDate_Ball.push(this[a.lastestDate]);
            }
          }, Object.create(null));

          let totalSum = 0;
          const arr = Ball_Stock_onHand[0];
          for (let index = 0; index < arr.length; index++) {
            const sum = arr[index].data.reduce(
              (acc, currentValue) => acc + currentValue,
              0
            );
            totalSum += sum;
          }

          const transformedData = [
            {
              name: "BALL GRADE -2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize20 || 0),
            },
            {
              name: "BALL GRADE 0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize30 || 0),
            },
            {
              name: "BALL GRADE +2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize40 || 0),
            },
          ];
          res.json({
            result_table: resultdata_Ball_onHand[0],
            resultBall_onHand: transformedData,
            resultDateBall_onHand: newDate_Ball,
            // length_data: totalSum,
          });
        } else if (req.body.size === "1/16") {
          let resultdata_Ball_onHand = await MBR_table.sequelize.query(`
        SELECT
        lastestDate,
        COALESCE(SUM([BALL GRADE -5.0]), 0) AS [totalSize10],
        COALESCE(SUM([BALL GRADE -2.5]), 0) AS [totalSize20],
        COALESCE(SUM([BALL GRADE 0.0]), 0) AS [totalSize30],
        COALESCE(SUM([BALL GRADE +2.5]), 0) AS [totalSize40],
        COALESCE(SUM([BALL GRADE +5.0]), 0) AS [totalSize50]
        FROM (
    SELECT  max([stock_date]) as lastestDate
    ,[item_no]
    ,CASE
    -- SUJ 1/16
    WHEN ball_stock.item_no  LIKE '%U3N%'  THEN 'BALL GRADE -5.0'
    WHEN ball_stock.item_no  LIKE '%U4N%'  THEN 'BALL GRADE -2.5'
    WHEN ball_stock.item_no  LIKE '%U5N%'  THEN 'BALL GRADE 0.0'
    WHEN ball_stock.item_no  LIKE '%U6N%'  THEN 'BALL GRADE +2.5' 
    WHEN ball_stock.item_no  LIKE '%U7N%'  THEN 'BALL GRADE +5.0'
    ELSE 'other'
      END as dec
    ,[spec]
    ,[on_hand] as New_onHand
    FROM [data_ball].[dbo].[ball_stock]
    where [stock_date] between '${start_date}'and'${end_date}' and item_no in ('BT111U3NT9','BT111U4NT9','BT111U5NT9','BT111U6NT9','BT111U7NT9')
    group by [stock_date],[item_no],[spec],[on_hand]
    ) AS SourceTable
    PIVOT (
        SUM(New_onHand)
        FOR dec IN ([BALL GRADE -5.0],[BALL GRADE -2.5], [BALL GRADE 0.0], [BALL GRADE +2.5],[BALL GRADE +5.0])
    ) AS PivotTable
    GROUP BY lastestDate;
        `);
          arrayData_Ball_onHand = resultdata_Ball_onHand[0];

          let resultStock_Ball_onHand = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.dec]) {
              this[a.dec] = { name: a.dec, data: [] };
              resultStock_Ball_onHand.push(this[a.dec]);
            }
            this[a.dec].data.push(a.New_onHand);
          }, Object.create(null));
          // console.log(resultStock_Ball_onHand);

          let Ball_Stock_onHand = [resultStock_Ball_onHand];
          let resultDate_Ball = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.lastestDate]) {
              this[a.lastestDate] = { name: a.lastestDate };
              resultDate_Ball.push(this[a.lastestDate]);
            }
          }, Object.create(null));

          let newDate_Ball = [];
          for (let index = 0; index < resultDate_Ball.length; index++) {
            const item = resultDate_Ball[index];
            await newDate_Ball.push(item.name);
          }
          let totalSum = 0;
          const arr = Ball_Stock_onHand[0];
          for (let index = 0; index < arr.length; index++) {
            const sum = arr[index].data.reduce(
              (acc, currentValue) => acc + currentValue,
              0
            );
            totalSum += sum;
          }

          const transformedData = [
            {
              name: "BALL GRADE -5.0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize10 || 0),
            },
            {
              name: "BALL GRADE -2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize20 || 0),
            },
            {
              name: "BALL GRADE 0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize30 || 0),
            },
            {
              name: "BALL GRADE +2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize40 || 0),
            },
            {
              name: "BALL GRADE +5.0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize50 || 0),
            },
          ];

          console.log(transformedData);
          // console.log('Total Sum:', totalSum);
          res.json({
            result_table: resultdata_Ball_onHand[0],
            // resultBall_onHand: Ball_Stock_onHan0d[0],
            resultBall_onHand: transformedData,
            resultDateBall_onHand: newDate_Ball,
            length_data: totalSum,
          });
        } else if (req.body.size === "1.0") {
          let resultdata_Ball_onHand = await MBR_table.sequelize.query(`
        SELECT
        lastestDate,
        COALESCE(SUM([BALL GRADE -2.5]), 0) AS [totalSize20],
        COALESCE(SUM([BALL GRADE 0.0]), 0) AS  [totalSize30],
        COALESCE(SUM([BALL GRADE +2.5]), 0) AS [totalSize40]
        FROM (
    SELECT  max([stock_date]) as lastestDate
    ,[item_no]
    ,CASE
    -- SUJ 1.0
    WHEN ball_stock.item_no  = 'BT05014LT9'  THEN 'BALL GRADE -2.5'
    WHEN ball_stock.item_no  = 'BT05015LT9'  THEN 'BALL GRADE 0.0'
    WHEN ball_stock.item_no  = 'BT05016LT9'  THEN 'BALL GRADE +2.5'
    ELSE 'other'
      END as dec
    ,[spec]
    ,[on_hand] as New_onHand
    FROM [data_ball].[dbo].[ball_stock]
    where [stock_date] between '${start_date}'and'${end_date}' and item_no in ('BT05014LT9', 'BT05015LT9', 'BT05016LT9' )
    group by [stock_date],[item_no],[spec],[on_hand]
    ) AS SourceTable
    PIVOT (
        SUM(New_onHand)
        FOR dec IN ([BALL GRADE -2.5], [BALL GRADE 0.0], [BALL GRADE +2.5])
    ) AS PivotTable
    GROUP BY lastestDate;
        `);

          let arrayData_Ball_onHand = resultdata_Ball_onHand[0];

          const newDate_Ball = [
            ...new Set(arrayData_Ball_onHand.map((item) => item.lastestDate)),
          ];
          console.log(newDate_Ball);
          console.log(resultdata_Ball_onHand[0]);

          let resultStock_Ball_onHand = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.dec]) {
              this[a.dec] = { name: a.dec, data: [] };
              resultStock_Ball_onHand.push(this[a.dec]);
            }
            this[a.dec].data.push(a.New_onHand);
          }, Object.create(null));

          let Ball_Stock_onHand = [resultStock_Ball_onHand];
          let resultDate_Ball = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.lastestDate]) {
              this[a.lastestDate] = { name: a.lastestDate };
              resultDate_Ball.push(this[a.lastestDate]);
            }
          }, Object.create(null));

          let totalSum = 0;
          const arr = Ball_Stock_onHand[0];
          for (let index = 0; index < arr.length; index++) {
            const sum = arr[index].data.reduce(
              (acc, currentValue) => acc + currentValue,
              0
            );
            totalSum += sum;
          }

          const transformedData = [
            {
              name: "BALL GRADE -2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize20 || 0),
            },
            {
              name: "BALL GRADE 0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize30 || 0),
            },
            {
              name: "BALL GRADE +2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize40 || 0),
            },
          ];
          res.json({
            result_table: resultdata_Ball_onHand[0],
            resultBall_onHand: transformedData,
            resultDateBall_onHand: newDate_Ball,
            // length_data: totalSum,
          });
        } else if (req.body.size === "3/64") {
          let resultdata_Ball_onHand = await MBR_table.sequelize.query(`
        SELECT
        lastestDate,
        COALESCE(SUM([BALL GRADE -2.5]), 0) AS [totalSize20],
        COALESCE(SUM([BALL GRADE 0.0]), 0) AS [totalSize30],
        COALESCE(SUM([BALL GRADE +2.5]), 0) AS [totalSize40]
        FROM (
    SELECT  max([stock_date]) as lastestDate
    ,[item_no]
    ,CASE
    -- SUJ 3/64
    WHEN ball_stock.item_no  = 'BT161U4LT9'  THEN 'BALL GRADE -2.5'
    WHEN ball_stock.item_no  = 'BT161U5LT9'  THEN 'BALL GRADE 0.0'
    WHEN ball_stock.item_no  = 'BT161U6LT9'  THEN 'BALL GRADE +2.5'
    ELSE 'other'
      END as dec
    ,[spec]
    ,[on_hand] as New_onHand
    FROM [data_ball].[dbo].[ball_stock]
    where [stock_date] between '${start_date}'and'${end_date}' and item_no in ('BT161U4LT9','BT161U5LT9','BT161U6LT9')
    group by [stock_date],[item_no],[spec],[on_hand]
    ) AS SourceTable
    PIVOT (
        SUM(New_onHand)
        FOR dec IN ([BALL GRADE -2.5], [BALL GRADE 0.0], [BALL GRADE +2.5])
    ) AS PivotTable
    GROUP BY lastestDate;
        `);
          let arrayData_Ball_onHand = resultdata_Ball_onHand[0];

          const newDate_Ball = [
            ...new Set(arrayData_Ball_onHand.map((item) => item.lastestDate)),
          ];
          console.log(newDate_Ball);
          console.log(resultdata_Ball_onHand[0]);

          let resultStock_Ball_onHand = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.dec]) {
              this[a.dec] = { name: a.dec, data: [] };
              resultStock_Ball_onHand.push(this[a.dec]);
            }
            this[a.dec].data.push(a.New_onHand);
          }, Object.create(null));

          let Ball_Stock_onHand = [resultStock_Ball_onHand];
          let resultDate_Ball = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.lastestDate]) {
              this[a.lastestDate] = { name: a.lastestDate };
              resultDate_Ball.push(this[a.lastestDate]);
            }
          }, Object.create(null));

          let totalSum = 0;
          const arr = Ball_Stock_onHand[0];
          for (let index = 0; index < arr.length; index++) {
            const sum = arr[index].data.reduce(
              (acc, currentValue) => acc + currentValue,
              0
            );
            totalSum += sum;
          }

          const transformedData = [
            {
              name: "BALL GRADE -2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize20 || 0),
            },
            {
              name: "BALL GRADE 0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize30 || 0),
            },
            {
              name: "BALL GRADE +2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize40 || 0),
            },
          ];
          res.json({
            result_table: resultdata_Ball_onHand[0],
            resultBall_onHand: transformedData,
            resultDateBall_onHand: newDate_Ball,
            // length_data: totalSum,
          });
        } else if (req.body.size === "5/32") {
        // } else if (req.body.size === "5/32 (G1S)") {
          let resultdata_Ball_onHand = await MBR_table.sequelize.query(`
        SELECT
        lastestDate,
        COALESCE(SUM([BALL GRADE -5.0]), 0) AS [totalSize10],
        COALESCE(SUM([BALL GRADE -2.5]), 0) AS [totalSize20],
        COALESCE(SUM([BALL GRADE 0.0]), 0) AS [totalSize30],
        COALESCE(SUM([BALL GRADE +2.5]), 0) AS [totalSize40],
        COALESCE(SUM([BALL GRADE +5.0]), 0) AS [totalSize50]
        FROM (
    SELECT  max([stock_date]) as lastestDate
    ,[item_no]
    ,CASE
    -- SUJ 5/32 G1S
    WHEN ball_stock.item_no  = 'BT151S3LT9'  THEN 'BALL GRADE -5.0'
    WHEN ball_stock.item_no  = 'BT151S4LT9'  THEN 'BALL GRADE -2.5'
    WHEN ball_stock.item_no  = 'BT151S5LT9'  THEN 'BALL GRADE 0.0'
    WHEN ball_stock.item_no  = 'BT151S6LT9'  THEN 'BALL GRADE +2.5'
    WHEN ball_stock.item_no  = 'BT151S7LT9'  THEN 'BALL GRADE +5.0'
    ELSE 'other'
      END as dec
    ,[spec]
    ,[on_hand] as New_onHand
    FROM [data_ball].[dbo].[ball_stock]
    where [stock_date] between '${start_date}'and'${end_date}' and item_no in ('BT151S3LT9','BT151S4LT9','BT151S5LT9','BT151S6LT9','BT151S7LT9')
    group by [stock_date],[item_no],[spec],[on_hand]
    ) AS SourceTable
    PIVOT (
        SUM(New_onHand)
        FOR dec IN ([BALL GRADE -5.0],[BALL GRADE -2.5], [BALL GRADE 0.0], [BALL GRADE +2.5],[BALL GRADE +5.0])
    ) AS PivotTable
    GROUP BY lastestDate;
        `);
          let arrayData_Ball_onHand = resultdata_Ball_onHand[0];

          const newDate_Ball = [
            ...new Set(arrayData_Ball_onHand.map((item) => item.lastestDate)),
          ];
          console.log(newDate_Ball);
          console.log(resultdata_Ball_onHand[0]);

          let resultStock_Ball_onHand = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.dec]) {
              this[a.dec] = { name: a.dec, data: [] };
              resultStock_Ball_onHand.push(this[a.dec]);
            }
            this[a.dec].data.push(a.New_onHand);
          }, Object.create(null));

          let Ball_Stock_onHand = [resultStock_Ball_onHand];
          let resultDate_Ball = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.lastestDate]) {
              this[a.lastestDate] = { name: a.lastestDate };
              resultDate_Ball.push(this[a.lastestDate]);
            }
          }, Object.create(null));

          let totalSum = 0;
          const arr = Ball_Stock_onHand[0];
          for (let index = 0; index < arr.length; index++) {
            const sum = arr[index].data.reduce(
              (acc, currentValue) => acc + currentValue,
              0
            );
            totalSum += sum;
          }

          const transformedData = [
            {
              name: "BALL GRADE -5.0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize10 || 0),
            },
            {
              name: "BALL GRADE -2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize20 || 0),
            },
            {
              name: "BALL GRADE 0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize30 || 0),
            },
            {
              name: "BALL GRADE +2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize40 || 0),
            },
            {
              name: "BALL GRADE +5.0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize50 || 0),
            },
          ];
          res.json({
            result_table: resultdata_Ball_onHand[0],
            resultBall_onHand: transformedData,
            resultDateBall_onHand: newDate_Ball,
            // length_data: totalSum,
          });
        } else if (req.body.size === "5/32 (G1SZ)") {
          let resultdata_Ball_onHand = await MBR_table.sequelize.query(`
        --- problem +-1.3 -> pin??
        SELECT
        lastestDate,
        COALESCE(SUM([BALL GRADE -5.0]), 0) AS [totalSize10],
        COALESCE(SUM([BALL GRADE -2.5]), 0) AS [totalSize20],
        COALESCE(SUM([BALL GRADE 0.0]), 0) AS [totalSize30],
        COALESCE(SUM([BALL GRADE +2.5]), 0) AS [totalSize40],
        COALESCE(SUM([BALL GRADE +5.0]), 0) AS [totalSize50]
        FROM (
    SELECT  max([stock_date]) as lastestDate
    ,[item_no]
    ,CASE
    -- SUJ 5/32 G1SZ
    WHEN ball_stock.item_no  = 'BS151P3LT7'  THEN 'BALL GRADE -5.0'
    WHEN ball_stock.item_no  = 'BS151P4LT7'  THEN 'BALL GRADE -2.5'
    WHEN ball_stock.item_no  = 'BS151P5LT7'  THEN 'BALL GRADE 0.0'
    WHEN ball_stock.item_no  = 'BS151P6LT7'  THEN 'BALL GRADE +2.5'
    WHEN ball_stock.item_no  = 'BS151P7LT7'  THEN 'BALL GRADE +5.0'
    -- SUJ 6202 **5/32 G1SZ
    WHEN ball_stock.item_no  = 'BT19053K' THEN 'BALL GRADE -5.0' 	
    WHEN ball_stock.item_no  = 'BT19054K' THEN 'BALL GRADE -2.5' 	
    WHEN ball_stock.item_no  = 'BT19055K' THEN 'BALL GRADE 0.0' 	
    WHEN ball_stock.item_no  = 'BT19056K' THEN 'BALL GRADE +2.5' 	
    WHEN ball_stock.item_no  = 'BT19057K' THEN 'BALL GRADE +5.0' 	
    -- SUJ SPECIAL **5/32 G1SZ
    WHEN ball_stock.item_no  = 'BC12034T' THEN 'BALL GRADE -2.5'	
    WHEN ball_stock.item_no  = 'BT151SLLT9'	THEN 'BALL GRADE -1.3'
    WHEN ball_stock.item_no  = 'BC12035T' THEN 'BALL GRADE 0.0' 	
    WHEN ball_stock.item_no  = 'BT151SMLT9' THEN 'BALL GRADE +1.3'	
    WHEN ball_stock.item_no  = 'BC12036T' THEN 'BALL GRADE +2.5'	

    ELSE 'other'
      END as dec
    ,[spec]
    ,[on_hand] as New_onHand
    FROM [data_ball].[dbo].[ball_stock]
    where [stock_date] between '${start_date}'and'${end_date}' and item_no in ('BS151P3LT7','BS151P4LT7','BS151P5LT7','BS151P6LT7','BS151P7LT7'
    ,'BT19053K','BT19054K','BT19055K','BT19056K','BT19057K','BC12034T','BC12035T','BC12036T','BT151SLLT9','BT151SMLT9')
    group by [stock_date],[item_no],[spec],[on_hand]
    ) AS SourceTable
    PIVOT (
        SUM(New_onHand)
        FOR dec IN ([BALL GRADE -5.0],[BALL GRADE -2.5], [BALL GRADE 0.0], [BALL GRADE +2.5],[BALL GRADE +5.0])
    ) AS PivotTable
    GROUP BY lastestDate;
        `);
          let arrayData_Ball_onHand = resultdata_Ball_onHand[0];

          const newDate_Ball = [
            ...new Set(arrayData_Ball_onHand.map((item) => item.lastestDate)),
          ];
          console.log(newDate_Ball);
          console.log(resultdata_Ball_onHand[0]);

          let resultStock_Ball_onHand = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.dec]) {
              this[a.dec] = { name: a.dec, data: [] };
              resultStock_Ball_onHand.push(this[a.dec]);
            }
            this[a.dec].data.push(a.New_onHand);
          }, Object.create(null));

          let Ball_Stock_onHand = [resultStock_Ball_onHand];
          let resultDate_Ball = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.lastestDate]) {
              this[a.lastestDate] = { name: a.lastestDate };
              resultDate_Ball.push(this[a.lastestDate]);
            }
          }, Object.create(null));

          let totalSum = 0;
          const arr = Ball_Stock_onHand[0];
          for (let index = 0; index < arr.length; index++) {
            const sum = arr[index].data.reduce(
              (acc, currentValue) => acc + currentValue,
              0
            );
            totalSum += sum;
          }

          const transformedData = [
            {
              name: "BALL GRADE -5.0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize10 || 0),
            },
            {
              name: "BALL GRADE -2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize20 || 0),
            },
            {
              name: "BALL GRADE 0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize30 || 0),
            },
            {
              name: "BALL GRADE +2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize40 || 0),
            },
            {
              name: "BALL GRADE +5.0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize50 || 0),
            },
          ];
          res.json({
            result_table: resultdata_Ball_onHand[0],
            resultBall_onHand: transformedData,
            resultDateBall_onHand: newDate_Ball,
            // length_data: totalSum,
          });
        } else if (req.body.size === "5/32 (JGBR)") {
          let resultdata_Ball_onHand = await MBR_table.sequelize.query(`
        SELECT
        lastestDate,
        COALESCE(SUM([BALL GRADE -5.0]), 0) AS [totalSize10],
        COALESCE(SUM([BALL GRADE -2.5]), 0) AS [totalSize20],
        COALESCE(SUM([BALL GRADE 0.0]), 0) AS [totalSize30],
        COALESCE(SUM([BALL GRADE +2.5]), 0) AS [totalSize40],
        COALESCE(SUM([BALL GRADE +5.0]), 0) AS [totalSize50]
        FROM (
    SELECT  max([stock_date]) as lastestDate
    ,[item_no]
    ,CASE
    -- SUJ 5/32 JGBR
    WHEN ball_stock.item_no  = 'BT15053J' THEN 'BALL GRADE -5.0'
    WHEN ball_stock.item_no  = 'BT15054J' THEN 'BALL GRADE -2.5'
    WHEN ball_stock.item_no  = 'BT15055J' THEN 'BALL GRADE 0.0'
    WHEN ball_stock.item_no  = 'BT15056J' THEN 'BALL GRADE +2.5'
    WHEN ball_stock.item_no  = 'BT15057J' THEN 'BALL GRADE +5.0'
    ELSE 'other'
      END as dec
    ,[spec]
    ,[on_hand] as New_onHand
    FROM [data_ball].[dbo].[ball_stock]
    where [stock_date] between '${start_date}'and'${end_date}' and item_no in ('BT15053J','BT15054J','BT15055J','BT15056J','BT15057J')
    group by [stock_date],[item_no],[spec],[on_hand]
    ) AS SourceTable
    PIVOT (
        SUM(New_onHand)
        FOR dec IN ([BALL GRADE -5.0],[BALL GRADE -2.5], [BALL GRADE 0.0], [BALL GRADE +2.5],[BALL GRADE +5.0])
    ) AS PivotTable
    GROUP BY lastestDate;
        `);
          let arrayData_Ball_onHand = resultdata_Ball_onHand[0];

          const newDate_Ball = [
            ...new Set(arrayData_Ball_onHand.map((item) => item.lastestDate)),
          ];
          console.log(newDate_Ball);
          console.log(resultdata_Ball_onHand[0]);

          let resultStock_Ball_onHand = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.dec]) {
              this[a.dec] = { name: a.dec, data: [] };
              resultStock_Ball_onHand.push(this[a.dec]);
            }
            this[a.dec].data.push(a.New_onHand);
          }, Object.create(null));

          let Ball_Stock_onHand = [resultStock_Ball_onHand];
          let resultDate_Ball = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.lastestDate]) {
              this[a.lastestDate] = { name: a.lastestDate };
              resultDate_Ball.push(this[a.lastestDate]);
            }
          }, Object.create(null));

          let totalSum = 0;
          const arr = Ball_Stock_onHand[0];
          for (let index = 0; index < arr.length; index++) {
            const sum = arr[index].data.reduce(
              (acc, currentValue) => acc + currentValue,
              0
            );
            totalSum += sum;
          }

          const transformedData = [
            {
              name: "BALL GRADE -5.0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize10 || 0),
            },
            {
              name: "BALL GRADE -2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize20 || 0),
            },
            {
              name: "BALL GRADE 0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize30 || 0),
            },
            {
              name: "BALL GRADE +2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize40 || 0),
            },
            {
              name: "BALL GRADE +5.0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize50 || 0),
            },
          ];
          res.json({
            result_table: resultdata_Ball_onHand[0],
            resultBall_onHand: transformedData,
            resultDateBall_onHand: newDate_Ball,
            // length_data: totalSum,
          });
        } else if (req.body.size === "3/16 G10") {
          let resultdata_Ball_onHand = await MBR_table.sequelize.query(`
        SELECT
        lastestDate,
        COALESCE(SUM([BALL GRADE -5.0]), 0) AS [totalSize10],
        COALESCE(SUM([BALL GRADE -2.5]), 0) AS [totalSize20],
        COALESCE(SUM([BALL GRADE 0.0]), 0) AS [totalSize30],
        COALESCE(SUM([BALL GRADE +2.5]), 0) AS [totalSize40],
        COALESCE(SUM([BALL GRADE +5.0]), 0) AS [totalSize50]
        FROM (
    SELECT  max([stock_date]) as lastestDate
    ,[item_no]
    ,CASE
    -- SUJ 3/16 G10	
    WHEN ball_stock.item_no  = 'BT12103ZT'  THEN 'BALL GRADE -5.0' 
    WHEN ball_stock.item_no  = 'BT12104ZT'  THEN 'BALL GRADE -2.5' 
    WHEN ball_stock.item_no  = 'BT12105ZT'  THEN 'BALL GRADE 0.0' 
    WHEN ball_stock.item_no  = 'BT12106ZT'  THEN 'BALL GRADE +2.5' 
    WHEN ball_stock.item_no  = 'BT12107ZT'  THEN 'BALL GRADE +5.0' 
    ELSE 'other'
      END as dec
    ,[spec]
    ,[on_hand] as New_onHand
    FROM [data_ball].[dbo].[ball_stock]
    where [stock_date] between '${start_date}'and'${end_date}' and item_no in ('BT12103ZT','BT12104ZT','BT12105ZT','BT12106ZT','BT12107ZT')
    group by [stock_date],[item_no],[spec],[on_hand]
    ) AS SourceTable
    PIVOT (
        SUM(New_onHand)
        FOR dec IN ([BALL GRADE -5.0],[BALL GRADE -2.5], [BALL GRADE 0.0], [BALL GRADE +2.5],[BALL GRADE +5.0])
    ) AS PivotTable
    GROUP BY lastestDate;
        `);
          let arrayData_Ball_onHand = resultdata_Ball_onHand[0];

          const newDate_Ball = [
            ...new Set(arrayData_Ball_onHand.map((item) => item.lastestDate)),
          ];
          console.log(newDate_Ball);
          console.log(resultdata_Ball_onHand[0]);

          let resultStock_Ball_onHand = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.dec]) {
              this[a.dec] = { name: a.dec, data: [] };
              resultStock_Ball_onHand.push(this[a.dec]);
            }
            this[a.dec].data.push(a.New_onHand);
          }, Object.create(null));

          let Ball_Stock_onHand = [resultStock_Ball_onHand];
          let resultDate_Ball = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.lastestDate]) {
              this[a.lastestDate] = { name: a.lastestDate };
              resultDate_Ball.push(this[a.lastestDate]);
            }
          }, Object.create(null));

          let totalSum = 0;
          const arr = Ball_Stock_onHand[0];
          for (let index = 0; index < arr.length; index++) {
            const sum = arr[index].data.reduce(
              (acc, currentValue) => acc + currentValue,
              0
            );
            totalSum += sum;
          }

          const transformedData = [
            {
              name: "BALL GRADE -5.0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize10 || 0),
            },
            {
              name: "BALL GRADE -2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize20 || 0),
            },
            {
              name: "BALL GRADE 0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize30 || 0),
            },
            {
              name: "BALL GRADE +2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize40 || 0),
            },
            {
              name: "BALL GRADE +5.0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize50 || 0),
            },
          ];
          res.json({
            result_table: resultdata_Ball_onHand[0],
            resultBall_onHand: transformedData,
            resultDateBall_onHand: newDate_Ball,
            // length_data: totalSum,
          });
        } else if (req.body.size === "3/16 G5") {
          let resultdata_Ball_onHand = await MBR_table.sequelize.query(`
        SELECT
        lastestDate,
        COALESCE(SUM([BALL GRADE -5.0]), 0) AS [totalSize10],
        COALESCE(SUM([BALL GRADE -2.5]), 0) AS [totalSize20],
        COALESCE(SUM([BALL GRADE 0.0]), 0) AS [totalSize30],
        COALESCE(SUM([BALL GRADE +2.5]), 0) AS [totalSize40],
        COALESCE(SUM([BALL GRADE +5.0]), 0) AS [totalSize50]
        FROM (
    SELECT  max([stock_date]) as lastestDate
    ,[item_no]
    ,CASE
    -- SUJ 3/16 G5	
    WHEN ball_stock.item_no  = 'BT12053Z'  THEN 'BALL GRADE -5.0' 
    WHEN ball_stock.item_no  = 'BT12054Z'  THEN 'BALL GRADE -2.5' 
    WHEN ball_stock.item_no  = 'BT12055Z'  THEN 'BALL GRADE 0.0' 
    WHEN ball_stock.item_no  = 'BT12056Z'  THEN 'BALL GRADE +2.5' 
    WHEN ball_stock.item_no  = 'BT12057Z'  THEN 'BALL GRADE +5.0' 
    ELSE 'other'
      END as dec
    ,[spec]
    ,[on_hand] as New_onHand
    FROM [data_ball].[dbo].[ball_stock]
    where [stock_date] between '${start_date}'and'${end_date}' and item_no in ('BT12053Z','BT12054Z','BT12055Z','BT12056Z','BT12057Z')
    group by [stock_date],[item_no],[spec],[on_hand]
    ) AS SourceTable
    PIVOT (
        SUM(New_onHand)
        FOR dec IN ([BALL GRADE -5.0],[BALL GRADE -2.5], [BALL GRADE 0.0], [BALL GRADE +2.5],[BALL GRADE +5.0])
    ) AS PivotTable
    GROUP BY lastestDate;
        `);
          let arrayData_Ball_onHand = resultdata_Ball_onHand[0];

          const newDate_Ball = [
            ...new Set(arrayData_Ball_onHand.map((item) => item.lastestDate)),
          ];
          console.log(newDate_Ball);
          console.log(resultdata_Ball_onHand[0]);

          let resultStock_Ball_onHand = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.dec]) {
              this[a.dec] = { name: a.dec, data: [] };
              resultStock_Ball_onHand.push(this[a.dec]);
            }
            this[a.dec].data.push(a.New_onHand);
          }, Object.create(null));

          let Ball_Stock_onHand = [resultStock_Ball_onHand];
          let resultDate_Ball = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.lastestDate]) {
              this[a.lastestDate] = { name: a.lastestDate };
              resultDate_Ball.push(this[a.lastestDate]);
            }
          }, Object.create(null));

          let totalSum = 0;
          const arr = Ball_Stock_onHand[0];
          for (let index = 0; index < arr.length; index++) {
            const sum = arr[index].data.reduce(
              (acc, currentValue) => acc + currentValue,
              0
            );
            totalSum += sum;
          }

          const transformedData = [
            {
              name: "BALL GRADE -5.0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize10 || 0),
            },
            {
              name: "BALL GRADE -2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize20 || 0),
            },
            {
              name: "BALL GRADE 0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize30 || 0),
            },
            {
              name: "BALL GRADE +2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize40 || 0),
            },
            {
              name: "BALL GRADE +5.0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize50 || 0),
            },
          ];
          res.json({
            result_table: resultdata_Ball_onHand[0],
            resultBall_onHand: transformedData,
            resultDateBall_onHand: newDate_Ball,
            // length_data: totalSum,
          });
        } else if (req.body.size === "3.5") {
          let resultdata_Ball_onHand = await MBR_table.sequelize.query(`
        SELECT
        lastestDate,
        COALESCE(SUM([BALL GRADE -5.0]), 0) AS [totalSize10],
        COALESCE(SUM([BALL GRADE -2.5]), 0) AS [totalSize20],
        COALESCE(SUM([BALL GRADE 0.0]), 0) AS [totalSize30],
        COALESCE(SUM([BALL GRADE +2.5]), 0) AS [totalSize40],
        COALESCE(SUM([BALL GRADE +5.0]), 0) AS [totalSize50]
        FROM (
    SELECT  max([stock_date]) as lastestDate
    ,[item_no]
    ,CASE
    -- SUJ 3.5	
    WHEN ball_stock.item_no  = 'BT091S3NT9'  THEN 'BALL GRADE -5.0' 
    WHEN ball_stock.item_no  = 'BT091S4NT9'  THEN 'BALL GRADE -2.5' 
    WHEN ball_stock.item_no  = 'BT091S5NT9'  THEN 'BALL GRADE 0.0' 
    WHEN ball_stock.item_no  = 'BT091S6NT9'  THEN 'BALL GRADE +2.5' 
    WHEN ball_stock.item_no  = 'BT091S7NT9'  THEN 'BALL GRADE +5.0' 
    ELSE 'other'
      END as dec
    ,[spec]
    ,[on_hand] as New_onHand
    FROM [data_ball].[dbo].[ball_stock]
    where [stock_date] between '${start_date}'and'${end_date}' and item_no in ('BT091S3NT9','BT091S4NT9','BT091S5NT9','BT091S6NT9','BT091S7NT9' )
    group by [stock_date],[item_no],[spec],[on_hand]
    ) AS SourceTable
    PIVOT (
        SUM(New_onHand)
        FOR dec IN ([BALL GRADE -5.0],[BALL GRADE -2.5], [BALL GRADE 0.0], [BALL GRADE +2.5],[BALL GRADE +5.0])
    ) AS PivotTable
    GROUP BY lastestDate;
        `);
          let arrayData_Ball_onHand = resultdata_Ball_onHand[0];

          const newDate_Ball = [
            ...new Set(arrayData_Ball_onHand.map((item) => item.lastestDate)),
          ];
          console.log(newDate_Ball);
          console.log(resultdata_Ball_onHand[0]);

          let resultStock_Ball_onHand = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.dec]) {
              this[a.dec] = { name: a.dec, data: [] };
              resultStock_Ball_onHand.push(this[a.dec]);
            }
            this[a.dec].data.push(a.New_onHand);
          }, Object.create(null));

          let Ball_Stock_onHand = [resultStock_Ball_onHand];
          let resultDate_Ball = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.lastestDate]) {
              this[a.lastestDate] = { name: a.lastestDate };
              resultDate_Ball.push(this[a.lastestDate]);
            }
          }, Object.create(null));

          let totalSum = 0;
          const arr = Ball_Stock_onHand[0];
          for (let index = 0; index < arr.length; index++) {
            const sum = arr[index].data.reduce(
              (acc, currentValue) => acc + currentValue,
              0
            );
            totalSum += sum;
          }

          const transformedData = [
            {
              name: "BALL GRADE -5.0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize10 || 0),
            },
            {
              name: "BALL GRADE -2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize20 || 0),
            },
            {
              name: "BALL GRADE 0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize30 || 0),
            },
            {
              name: "BALL GRADE +2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize40 || 0),
            },
            {
              name: "BALL GRADE +5.0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize50 || 0),
            },
          ];
          res.json({
            result_table: resultdata_Ball_onHand[0],
            resultBall_onHand: transformedData,
            resultDateBall_onHand: newDate_Ball,
            // length_data: totalSum,
          });
        } else if (req.body.size === "3/32") {
          let resultdata_Ball_onHand = await MBR_table.sequelize.query(`
        SELECT
        lastestDate,
        COALESCE(SUM([BALL GRADE -5.0]), 0) AS [totalSize10],
        COALESCE(SUM([BALL GRADE -2.5]), 0) AS [totalSize20],
        COALESCE(SUM([BALL GRADE 0.0]), 0) AS [totalSize30],
        COALESCE(SUM([BALL GRADE +2.5]), 0) AS [totalSize40],
        COALESCE(SUM([BALL GRADE +5.0]), 0) AS [totalSize50]
        FROM (
    SELECT  max([stock_date]) as lastestDate
    ,[item_no]
    ,CASE
    -- SUJ 3/32
    WHEN ball_stock.item_no  = 'BT141S3NT9'  THEN 'BALL GRADE -5.0' 
    WHEN ball_stock.item_no  = 'BT141S4NT9'  THEN 'BALL GRADE -2.5' 
    WHEN ball_stock.item_no  = 'BT141S5NT9'  THEN 'BALL GRADE 0.0' 
    WHEN ball_stock.item_no  = 'BT141S6NT9'  THEN 'BALL GRADE +2.5' 
    WHEN ball_stock.item_no  = 'BT141S7NT9'  THEN 'BALL GRADE +5.0' 
    ELSE 'other'
      END as dec
    ,[spec]
    ,[on_hand] as New_onHand
    FROM [data_ball].[dbo].[ball_stock]
    where [stock_date] between '${start_date}'and'${end_date}' and item_no in ('BT141S3NT9','BT141S4NT9','BT141S5NT9','BT141S6NT9','BT141S7NT9')
    group by [stock_date],[item_no],[spec],[on_hand]
    ) AS SourceTable
    PIVOT (
        SUM(New_onHand)
        FOR dec IN ([BALL GRADE -5.0],[BALL GRADE -2.5], [BALL GRADE 0.0], [BALL GRADE +2.5],[BALL GRADE +5.0])
    ) AS PivotTable
    GROUP BY lastestDate;
        `);
          let arrayData_Ball_onHand = resultdata_Ball_onHand[0];

          const newDate_Ball = [
            ...new Set(arrayData_Ball_onHand.map((item) => item.lastestDate)),
          ];
          console.log(newDate_Ball);
          console.log(resultdata_Ball_onHand[0]);

          let resultStock_Ball_onHand = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.dec]) {
              this[a.dec] = { name: a.dec, data: [] };
              resultStock_Ball_onHand.push(this[a.dec]);
            }
            this[a.dec].data.push(a.New_onHand);
          }, Object.create(null));

          let Ball_Stock_onHand = [resultStock_Ball_onHand];
          let resultDate_Ball = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.lastestDate]) {
              this[a.lastestDate] = { name: a.lastestDate };
              resultDate_Ball.push(this[a.lastestDate]);
            }
          }, Object.create(null));

          let totalSum = 0;
          const arr = Ball_Stock_onHand[0];
          for (let index = 0; index < arr.length; index++) {
            const sum = arr[index].data.reduce(
              (acc, currentValue) => acc + currentValue,
              0
            );
            totalSum += sum;
          }

          const transformedData = [
            {
              name: "BALL GRADE -5.0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize10 || 0),
            },
            {
              name: "BALL GRADE -2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize20 || 0),
            },
            {
              name: "BALL GRADE 0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize30 || 0),
            },
            {
              name: "BALL GRADE +2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize40 || 0),
            },
            {
              name: "BALL GRADE +5.0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize50 || 0),
            },
          ];
          res.json({
            result_table: resultdata_Ball_onHand[0],
            resultBall_onHand: transformedData,
            resultDateBall_onHand: newDate_Ball,
            // length_data: totalSum,
          });
        } else if (req.body.size === "7/64") {
          let resultdata_Ball_onHand = await MBR_table.sequelize.query(`
        SELECT
        lastestDate,
        COALESCE(SUM([BALL GRADE -5.0]), 0) AS [totalSize10],
        COALESCE(SUM([BALL GRADE -2.5]), 0) AS [totalSize20],
        COALESCE(SUM([BALL GRADE 0.0]), 0) AS [totalSize30],
        COALESCE(SUM([BALL GRADE +2.5]), 0) AS [totalSize40],
        COALESCE(SUM([BALL GRADE +5.0]), 0) AS [totalSize50]
        FROM (
    SELECT  max([stock_date]) as lastestDate
    ,[item_no]
    ,CASE
    -- SUJ 7/64
    WHEN ball_stock.item_no  = 'BT171S3NT9'  THEN 'BALL GRADE -5.0' 
    WHEN ball_stock.item_no  = 'BT171S4NT9'  THEN 'BALL GRADE -2.5' 
    WHEN ball_stock.item_no  = 'BT171S5NT9'  THEN 'BALL GRADE 0.0' 
    WHEN ball_stock.item_no  = 'BT171S6NT9'  THEN 'BALL GRADE +2.5' 
    WHEN ball_stock.item_no  = 'BT171S7NT9'  THEN 'BALL GRADE +5.0' 
    ELSE 'other'
      END as dec
    ,[spec]
    ,[on_hand] as New_onHand
    FROM [data_ball].[dbo].[ball_stock]
    where [stock_date] between '${start_date}'and'${end_date}' and item_no in ('BT171S3NT9','BT171S4NT9','BT171S5NT9','BT171S6NT9','BT171S7NT9')
    group by [stock_date],[item_no],[spec],[on_hand]
    ) AS SourceTable
    PIVOT (
        SUM(New_onHand)
        FOR dec IN ([BALL GRADE -5.0],[BALL GRADE -2.5], [BALL GRADE 0.0], [BALL GRADE +2.5],[BALL GRADE +5.0])
    ) AS PivotTable
    GROUP BY lastestDate;
        `);
          let arrayData_Ball_onHand = resultdata_Ball_onHand[0];

          const newDate_Ball = [
            ...new Set(arrayData_Ball_onHand.map((item) => item.lastestDate)),
          ];
          console.log(newDate_Ball);
          console.log(resultdata_Ball_onHand[0]);

          let resultStock_Ball_onHand = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.dec]) {
              this[a.dec] = { name: a.dec, data: [] };
              resultStock_Ball_onHand.push(this[a.dec]);
            }
            this[a.dec].data.push(a.New_onHand);
          }, Object.create(null));

          let Ball_Stock_onHand = [resultStock_Ball_onHand];
          let resultDate_Ball = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.lastestDate]) {
              this[a.lastestDate] = { name: a.lastestDate };
              resultDate_Ball.push(this[a.lastestDate]);
            }
          }, Object.create(null));

          let totalSum = 0;
          const arr = Ball_Stock_onHand[0];
          for (let index = 0; index < arr.length; index++) {
            const sum = arr[index].data.reduce(
              (acc, currentValue) => acc + currentValue,
              0
            );
            totalSum += sum;
          }

          const transformedData = [
            {
              name: "BALL GRADE -5.0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize10 || 0),
            },
            {
              name: "BALL GRADE -2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize20 || 0),
            },
            {
              name: "BALL GRADE 0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize30 || 0),
            },
            {
              name: "BALL GRADE +2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize40 || 0),
            },
            {
              name: "BALL GRADE +5.0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize50 || 0),
            },
          ];
          res.json({
            result_table: resultdata_Ball_onHand[0],
            resultBall_onHand: transformedData,
            resultDateBall_onHand: newDate_Ball,
            // length_data: totalSum,
          });
        } else if (req.body.size === "2.0") {
          let resultdata_Ball_onHand = await MBR_table.sequelize.query(`
        SELECT
        lastestDate,
        COALESCE(SUM([BALL GRADE -5.0]), 0) AS [totalSize10],
        COALESCE(SUM([BALL GRADE -2.5]), 0) AS [totalSize20],
        COALESCE(SUM([BALL GRADE 0.0]), 0)  AS [totalSize30],
        COALESCE(SUM([BALL GRADE +2.5]), 0) AS [totalSize40],
        COALESCE(SUM([BALL GRADE +5.0]), 0) AS [totalSize50]
        FROM (
    SELECT  max([stock_date]) as lastestDate
    ,[item_no]
    ,CASE
    -- SUJ 2.0	
    WHEN ball_stock.item_no  = 'BT081U3NT9'  THEN 'BALL GRADE -5.0' 
    WHEN ball_stock.item_no  = 'BT081U4NT9'  THEN 'BALL GRADE -2.5' 
    WHEN ball_stock.item_no  = 'BT081U5NT9'  THEN 'BALL GRADE 0.0' 
    WHEN ball_stock.item_no  = 'BT081U6NT9'  THEN 'BALL GRADE +2.5' 
    WHEN ball_stock.item_no  = 'BT081U7NT9'  THEN 'BALL GRADE +5.0' 
    ELSE 'other'
      END as dec
    ,[spec]
    ,[on_hand] as New_onHand
    FROM [data_ball].[dbo].[ball_stock]
    where [stock_date] between '${start_date}'and'${end_date}' and item_no in ('BT081U3NT9','BT081U4NT9','BT081U5NT9','BT081U6NT9','BT081U7NT9')
    group by [stock_date],[item_no],[spec],[on_hand]
    ) AS SourceTable
    PIVOT (
        SUM(New_onHand)
        FOR dec IN ([BALL GRADE -5.0],[BALL GRADE -2.5], [BALL GRADE 0.0], [BALL GRADE +2.5],[BALL GRADE +5.0])
    ) AS PivotTable
    GROUP BY lastestDate;
        `);
          let arrayData_Ball_onHand = resultdata_Ball_onHand[0];

          const newDate_Ball = [
            ...new Set(arrayData_Ball_onHand.map((item) => item.lastestDate)),
          ];
          console.log(newDate_Ball);
          console.log(resultdata_Ball_onHand[0]);

          let resultStock_Ball_onHand = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.dec]) {
              this[a.dec] = { name: a.dec, data: [] };
              resultStock_Ball_onHand.push(this[a.dec]);
            }
            this[a.dec].data.push(a.New_onHand);
          }, Object.create(null));

          let Ball_Stock_onHand = [resultStock_Ball_onHand];
          let resultDate_Ball = [];
          arrayData_Ball_onHand.forEach(function (a) {
            if (!this[a.lastestDate]) {
              this[a.lastestDate] = { name: a.lastestDate };
              resultDate_Ball.push(this[a.lastestDate]);
            }
          }, Object.create(null));

          let totalSum = 0;
          const arr = Ball_Stock_onHand[0];
          for (let index = 0; index < arr.length; index++) {
            const sum = arr[index].data.reduce(
              (acc, currentValue) => acc + currentValue,
              0
            );
            totalSum += sum;
          }

          const transformedData = [
            {
              name: "BALL GRADE -5.0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize10 || 0),
            },
            {
              name: "BALL GRADE -2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize20 || 0),
            },
            {
              name: "BALL GRADE 0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize30 || 0),
            },
            {
              name: "BALL GRADE +2.5",
              data: arrayData_Ball_onHand.map((item) => item.totalSize40 || 0),
            },
            {
              name: "BALL GRADE +5.0",
              data: arrayData_Ball_onHand.map((item) => item.totalSize50 || 0),
            },
          ];
          res.json({
            result_table: resultdata_Ball_onHand[0],
            resultBall_onHand: transformedData,
            resultDateBall_onHand: newDate_Ball,
            // length_data: totalSum,
          });
        }
      } else {
        res.json({
          resultBall_onHand: "NO DATA",
          api_result: constance.result_ok,
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        error,
        api_result: constance.result_nok,
      });
    }
  }
);
// onhand by size DD
router.get(
  "/MBRC_Ball_onHand_size_DD/:start_date/:end_date",
  async (req, res) => {
    try {
      let { start_date } = req.params;
      let { end_date } = req.params;
      if (req.body.size === "") {
      } else if (req.body.size === "") {
      }
      let resultdata_Ball_onHand = await MBR_table.sequelize.query(`
      SELECT  max([stock_date]) as lastestDate
      ,[item_no]
      ,CASE
      WHEN ball_stock.item_no  LIKE '%3N%'  THEN 'BT111U3N 5240'
	       WHEN ball_stock.item_no  LIKE '%4N%'  THEN 'BT111U4N 5240'
		        WHEN ball_stock.item_no  LIKE '%5N%'  THEN 'BT111U5N 5240'
				     WHEN ball_stock.item_no  LIKE '%6N%'  THEN 'BT111U6N 5240' 
					      WHEN ball_stock.item_no LIKE '%7N%'  THEN 'BT111U7N 5240'						 
        ELSE 'other'
    END as dec
    ,[spec]
    ,[on_hand] as New_onHand
FROM [data_ball].[dbo].[ball_stock]
where [stock_date] between '${start_date}'and'${end_date}'
group by [stock_date],[item_no],[spec],[on_hand]
        `);
      arrayData_Ball_onHand = resultdata_Ball_onHand[0];

      let resultStock_Ball_onHand = [];
      arrayData_Ball_onHand.forEach(function (a) {
        if (!this[a.dec]) {
          this[a.dec] = { name: a.dec, data: [] };
          resultStock_Ball_onHand.push(this[a.dec]);
        }
        this[a.dec].data.push(a.New_onHand);
      }, Object.create(null));
      // console.log(resultStock_Ball_onHand);

      let Ball_Stock_onHand = [resultStock_Ball_onHand];
      let resultDate_Ball = [];
      arrayData_Ball_onHand.forEach(function (a) {
        if (!this[a.lastestDate]) {
          this[a.lastestDate] = { name: a.lastestDate };
          resultDate_Ball.push(this[a.lastestDate]);
        }
      }, Object.create(null));

      let newDate_Ball = [];
      for (let index = 0; index < resultDate_Ball.length; index++) {
        const item = resultDate_Ball[index];
        await newDate_Ball.push(item.name);
      }

      // console.log(Ball_Stock_onHand[0]);
      // console.log(newDate_Ball);

      res.json({
        result_table: resultdata_Ball_onHand[0],
        resultBall_onHand: Ball_Stock_onHand[0],
        resultDateBall_onHand: newDate_Ball,

        // resultTarget_turn: seriesTarget_new,
      });
    } catch (error) {
      res.json({
        error,
        api_result: constance.result_nok,
      });
    }
  }
);
router.get("/MBRC_Ball_Turnover/:start_date/:end_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let { end_date } = req.params;
let resultdata_Ball_Turnover = await MBR_table.sequelize.query(`
-- Turnover
WITH sum_tb4 AS (SELECT
  datepart(hour,[registered_at]) as newHours
    ,format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date]
    ,max([ball_c1_ok])*6 as totalSize10
    ,max([ball_c2_ok])*6 as totalSize20
    ,max([ball_c3_ok])*6 as totalSize30
    ,max([ball_c4_ok])*6 as totalSize40
    ,max([ball_c5_ok])*6 as totalSize50
  ,[mc_no],(CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) AS model
  FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
  where format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') between '${start_date}'and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  
and ((CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) like '%830%' or (CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) like '')
  group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
  ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
  
)

,ball_usage as(
SELECT
      mfg_date,sum(totalSize10) as All_total_usage10,sum(totalSize20) as All_total_usage20
      ,sum(totalSize30) as All_total_usage30,sum(totalSize40) as All_total_usage40
      ,sum(totalSize50) as All_total_usage50--,[mc_no]
    FROM sum_tb4
      group by mfg_date)
  --select * from ball_usage
,sum_ball_usage as ( 
SELECT mfg_date, SUM(All_total_usage10+All_total_usage20+All_total_usage30+All_total_usage40+All_total_usage50) AS All_total_usage
FROM ball_usage
GROUP BY mfg_date
)
  ,ball_oh as (
    SELECT  [stock_date] ,[item_no],[spec],
  [on_hand]*1000 as New_onHand
  FROM [data_ball].[dbo].[ball_stock]
  where  [stock_date] between '${start_date}'and '${end_date}' and item_no in ('BT111U3NT9','BT111U4NT9','BT111U5NT9','BT111U6NT9','BT111U7NT9')
  group by [stock_date],[item_no],[spec],[on_hand]
  )
  ,ball_stock as(
  select [stock_date] as mfg_date,sum([New_onHand]) as total_Onhand
  From ball_oh
  group by [stock_date]
)
  select sum_ball_usage.mfg_date,All_total_usage,total_Onhand
  ,cast((total_Onhand/All_total_usage)/30 as decimal(20,2)) as [old_turnover]
  ,Case when total_Onhand is null then 0
    Else cast((total_Onhand/All_total_usage)/30 as decimal(20,2))
    End as [turnover]
  from  sum_ball_usage
  left join ball_stock on ball_stock.[mfg_date] = sum_ball_usage.[mfg_date]
  --where All_total_usage > 100000`)
    // let resultdata_Ball_Turnover = await MBR_table.sequelize.query(`-- Turnover
    // WITH sum_tb4 AS (SELECT
    //   datepart(hour,[registered_at]) as newHours
    //     ,format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date]
    //     ,max([ball_c1_ok])*6 as totalSize10
    //     ,max([ball_c2_ok])*6 as totalSize20
    //     ,max([ball_c3_ok])*6 as totalSize30
    //     ,max([ball_c4_ok])*6 as totalSize40
    //     ,max([ball_c5_ok])*6 as totalSize50
    //   ,[mc_no],(CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) AS model
    //   FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
    //   where format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') between '${start_date}'and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  
	  // and ((CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) like '%830%' or (CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) like '')
    //   group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
    //   ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
    //   UNION ALL 
    // SELECT
    //   datepart(hour,[registered_at]) as newHours
    //     ,format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date]
    //     ,max([ball_c1_ok])*7 as totalSize7_MC10
    //     ,max([ball_c2_ok])*7 as totalSize7_MC20
    //     ,max([ball_c3_ok])*7 as totalSize7_MC30
    //     ,max([ball_c4_ok])*7 as totalSize7_MC40
    //     ,max([ball_c5_ok])*7 as totalSize7_MC50
    //   ,[mc_no],(CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) AS model
    //   FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
    //   where format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') between '${start_date}'and '${end_date}' and datepart(hour,[registered_at]) in ('7' ) 
	  // and ((CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) like '%626%' or (CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) like '%608%' or (CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) like '%6202%' or (CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) like '%840%' or (CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) like '%940%' or (CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) like '%1340%' or (CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) like '%1560%' or (CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) like '%730%' or (CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) like '%627%')
    //   group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
    //   ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
    //   UNION ALL
    // SELECT
    //   datepart(hour,[registered_at]) as newHours
    //     ,format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date]
    //     ,max([ball_c1_ok])*8 as totalSize8_MC10
    //     ,max([ball_c2_ok])*8 as totalSize8_MC20
    //     ,max([ball_c3_ok])*8 as totalSize8_MC30
    //     ,max([ball_c4_ok])*8 as totalSize8_MC40
    //     ,max([ball_c5_ok])*8 as totalSize8_MC50
    //   ,[mc_no],(CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) AS model
    //   FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
    //   where format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') between '${start_date}'and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  
	  // and ((CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) like '%1350%' or (CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) like '%1360%' or (CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) like '%6001%' or (CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) like '%6002%' )
    //   group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
    //   ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
    //   UNION ALL
    // SELECT
    //   datepart(hour,[registered_at]) as newHours
    //     ,format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date]
    //     ,max([ball_c1_ok])*9 as totalSize9_MC10
    //     ,max([ball_c2_ok])*9 as totalSize9_MC20
    //     ,max([ball_c3_ok])*9 as totalSize9_MC30
    //     ,max([ball_c4_ok])*9 as totalSize9_MC40
    //     ,max([ball_c5_ok])*9 as totalSize9_MC50
    //   ,[mc_no],(CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) AS model
    //   FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
    //   where format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') between '${start_date}'and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  
	  // and ((CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) like '%1680%' or (CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) like '%1660%' or (CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) like '%1060%')
    //   group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
    //   ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
    // UNION ALL
    // SELECT
    //   datepart(hour,[registered_at]) as newHours
    //     ,format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date]
    //     ,max([ball_c1_ok])*15 as totalSize15_MC10
    //     ,max([ball_c2_ok])*15 as totalSize15_MC20
    //     ,max([ball_c3_ok])*15 as totalSize15_MC30
    //     ,max([ball_c4_ok])*15 as totalSize15_MC40
    //     ,max([ball_c5_ok])*15 as totalSize15_MC50
    //   ,[mc_no],(CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) AS model
    //   FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
    //   where format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') between '${start_date}'and '${end_date}' and datepart(hour,[registered_at]) in ('7' )  
	  // and ((CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    // CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    // CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    // CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) like '%6803%'  )
    //   group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
    //   ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
    //   --order by mc_no asc
	  // )

    // ,tb4 as(
    // SELECT
    //       mfg_date,sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
    //       ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
    //       ,sum(totalSize50) as totalSize50,[mc_no]
    //     FROM sum_tb4
    //       group by [mc_no],mfg_date)
    //   ,tb5 as(
    //   select [mfg_date],totalSize10,totalSize20,totalSize30,totalSize40,totalSize50
    //   From tb4
    //   group by [mfg_date],totalSize10,totalSize20,totalSize30,totalSize40,totalSize50)
      
    //   ,ball_usage as
    // (
    //   select [mfg_date],sum(totalSize10) as All_total_usage10,sum(totalSize20) as All_total_usage20,sum(totalSize30) as All_total_usage30,sum(totalSize40) as All_total_usage40,sum(totalSize50) as All_total_usage50
    //   From tb5
    //   group by [mfg_date]
    // )
    // ,sum_ball_usage as ( 
    // SELECT mfg_date, SUM(All_total_usage10+All_total_usage20+All_total_usage30+All_total_usage40+All_total_usage50) AS All_total_usage
    // FROM ball_usage
    // GROUP BY mfg_date
    // )
    //   ,ball_oh as (
    //     SELECT  [stock_date] ,[item_no],[spec],
    //   [on_hand] as New_onHand
    //   FROM [data_ball].[dbo].[ball_stock]
    //   where  [stock_date] between '${start_date}'and '${end_date}' 
    //   group by [stock_date],[item_no],[spec],[on_hand]
    //   )
    //   ,ball_stock as(
    //   select [stock_date] as mfg_date,sum([New_onHand]) as total_Onhand
    //   From ball_oh
    //   group by [stock_date]
    // )
    //   select sum_ball_usage.mfg_date,All_total_usage,total_Onhand
    //   ,cast((total_Onhand/All_total_usage)/30 as decimal(20,2)) as [old_turnover]
    //   ,Case when total_Onhand is null then 0
    //     Else cast((total_Onhand/All_total_usage)/30 as decimal(20,2))
    //     End as [turnover]
    //   from  sum_ball_usage
    //   left join ball_stock on ball_stock.[mfg_date] = sum_ball_usage.[mfg_date]
    //   where All_total_usage > 100000
    //   `);

    console.log(resultdata_Ball_Turnover);
    arrayData = resultdata_Ball_Turnover[0];

    let seriesTurnover = [];

    for (let index = 0; index < arrayData.length; index++) {
      const item = arrayData[index];
      await seriesTurnover.push(item.turnover);
    }
    //console.log(seriesTurnover);
    let resultDate_Turnover = [];
    arrayData.forEach(function (a) {
      if (!this[a.mfg_date]) {
        this[a.mfg_date] = { name: a.mfg_date };
        resultDate_Turnover.push(this[a.mfg_date]);
      }
    }, Object.create(null));
    let newDate = [];
    for (let index = 0; index < resultDate_Turnover.length; index++) {
      const item = resultDate_Turnover[index];
      await newDate.push(item.name);
    }
    console.log(seriesTurnover);
    let seriesOutput_new = {
      name: "Turnover ratio",
      type: "column",
      data: seriesTurnover,
    };

    let seriesTarget_new = {
      name: "Turnover target",
      type: "line",
      data: [
        0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,
        0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,
        0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,
        0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,
      ],
    };
    let seriesNew = [seriesOutput_new, seriesTarget_new];
    // console.log(seriesOutput_new);
    // console.log(newDate);
    // console.log(seriesNew);

    res.json({
      resultTurnover: seriesNew,
      resultDate_Turnover: newDate,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});
router.get(
  "/MBRC_Ball_Cost_Turnover/:start_date/:end_date",
  async (req, res) => {
    try {
      let { start_date } = req.params;
      let { end_date } = req.params;

      let resultdata = await MBR_table.sequelize.query(`   
         SELECT  
         [stock_date] ,[item_no],[spec]
            ,left(RIGHT([item_no], LEN([item_no]) -6),2) AS ball_size
            ,CASE
          
              WHEN left(RIGHT([item_no], LEN([item_no]) -6),2)='3N' THEN -5.0
            WHEN left(RIGHT([item_no], LEN([item_no]) -6),2)='4N' THEN -2.5
            WHEN left(RIGHT([item_no], LEN([item_no]) -6),2)='5N' THEN 0.0
            WHEN left(RIGHT([item_no], LEN([item_no]) -6),2)='6N' THEN 2.5
            WHEN left(RIGHT([item_no], LEN([item_no]) -6),2)='7N' THEN 5.0
              ELSE 99
          END as dec
              ,[on_hand] as New_onHand
              ,FLOOR([on_hand]*[unit_price]) as Cost_onHand
          FROM [data_ball].[dbo].[ball_stock]
          where [stock_date] between'2023-06-01' and '${end_date}' 
          group by [stock_date],[item_no],[spec],[on_hand],[unit_price]
        `);

      // console.log(resultdata);
      arrayData = resultdata[0];

      let resultCost = [];
      arrayData.forEach(function (a) {
        if (!this[a.dec]) {
          this[a.dec] = { name: "" + [a.dec] + "", data: [] };
          resultCost.push(this[a.dec]);
        }
        this[a.dec].data.push(a.Cost_onHand);
      }, Object.create(null));
      console.log(resultCost);

      let newCost = [resultCost];

      let resultDate = [];
      arrayData.forEach(function (a) {
        if (!this[a.stock_date]) {
          this[a.stock_date] = { name: a.stock_date };
          resultDate.push(this[a.stock_date]);
        }
      }, Object.create(null));
      //console.log(resultDate);

      let newDate = [];
      for (let index = 0; index < resultDate.length; index++) {
        const item = resultDate[index];
        await newDate.push(item.name);
      }

      // console.log(newCost[0]);
      // console.log(newDate);

      res.json({
        resultBall_cost_onHand: newCost[0],
        resultDate_onHand: newDate,
      });
    } catch (error) {
      res.json({
        error,
        api_result: constance.result_nok,
      });
    }
  }
);

// chart down time
router.get("/MMS_downtime_MBRC_MD24/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    console.log(start_date);
    let resultdata = await MBR_table.sequelize
      .query(`SELECT TOP (1)[registered_at]
    ,[mfg_date]
    ,[mc_no]
    ,[model]
    ,[error_time]
    ,[alarm_time]
    ,[run_time]
    ,[stop_time]
    ,[wait_part_time]
    ,[full_part_time]
    ,[adjust_time]
    ,[set_up_time]
    ,[plan_stop_time]
FROM [counter].[dbo].[app_counter_accumoutput_new]
  where mc_no = 'MBR_MD24' and mfg_date = '${start_date}'
order by registered_at desc
      `);

    // console.log(resultdata);
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
        item.full_part_time,
        item.run_time,
        item.alarm_time,
        item.error_time,
        item.stop_time,
        item.wait_part_time,
        item.adjust_time,
        item.set_up_time,
        item.plan_stop_time
      );
    }
    // console.log("seriesDT=====>",seriesDT);

    res.json({
      resultDT_MBR: seriesDT,
      resultSeriesName: seriesName,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});

// chart product / Yield All MD
router.post("/MMS_prod_yield_MBRC_MD/:mc_no/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let { mc_no } = req.params;
    console.log("mc_nomc_nomc_nomc_nomc_nomc_no");
    // console.log(mc_no);
    // console.log("click PT", start_date);
    let resultdata = await MBR_table.sequelize.query(` -- chart PD
    SELECT   [registered_at], convert(varchar, [registered_at], 8) as time
    , (CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
    CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
    CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
    CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) AS model
  ,format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date]
  ,[mc_no],[Daily_OK] as dairy_ok,[Daily_Total] as dairy_total
  ,cast((3600/NULLIF([Target_Utilize], 0))*100  as decimal(20,0)) as UTL_target
  ,cast((3600/NULLIF([Cycle_Time], 0))*100  as decimal(20,0)) as old_UTL_target
  ,[Cycle_Time],[Target_Utilize],[Run_Time]
    ,cast(([Daily_OK]/NULLIF([Daily_Total], 0))*100  as decimal(20,2)) as old_yield
  ,Case when [Daily_Total]=0 then 0
  Else cast(([Daily_OK]/[Daily_Total])*100  as decimal(20,2)) 
  End as yield, FORMAT(registered_at,'HH:mm') as cat_time
    FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
WHERE 
  mc_no = '${mc_no}'
  AND FORMAT(IIF(DATEPART(HOUR, [registered_at]) < 8, DATEADD(DAY, -1, [registered_at]), [registered_at]),'yyyy-MM-dd') = '${start_date}'
ORDER BY registered_at asc
      `);
    let resultdata_UTL = await MBR_table.sequelize
      .query(`SELECT   [registered_at], convert(varchar, [registered_at], 8) as time
    , (CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
        CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
        CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
        CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) AS model
  ,format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date]
  ,[mc_no],[Daily_OK] as dairy_ok,[Daily_Total] as dairy_total,[Cycle_Time] as cycle_time,[Target_Utilize],[Run_Time]
  ,[adjust_time]+[alarm_time]+[stop_time]+[error_time]+[full_part_time]+[plan_stop_time]+[set_up_time]+[wait_part_time] as DT
  ,cast((3600/NULLIF([Target_Utilize], 0))*100  as decimal(20,0)) as UTL_target
  ,cast((3600/NULLIF([Cycle_Time], 0))*100  as decimal(20,0)) as old_UTL_target
    ,cast(([Daily_OK]/NULLIF([Daily_Total], 0))*100  as decimal(20,2)) as old_yield
  ,Case when [Daily_Total]=0 then 0
  Else cast(([Daily_OK]/[Daily_Total])*100  as decimal(20,2)) 
  End as yield
  ,0 as scal_min ,2400as scal_max,80 as scal_min_YR ,110 as scal_max_YR
    FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
WHERE 
  mc_no = '${mc_no}'
  AND FORMAT(IIF(DATEPART(HOUR, [registered_at]) < 8, DATEADD(DAY, -1, [registered_at]), [registered_at]),'yyyy-MM-dd' ) = '${start_date}'

ORDER BY registered_at DESC

      `);
    let resultAVG_UTL = await MBR_table.sequelize.query(`
    SELECT CAST(AVG(
      IIF(cast((3600/NULLIF([Target_Utilize], 0))*100  as decimal(20,0)) is not null, cast((3600/NULLIF([Target_Utilize], 0))*100  as decimal(20,0)),0)
      ) as decimal(10, 2))  as UTL_target
      FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
      where mc_no = '${mc_no}' AND FORMAT(IIF(DATEPART(HOUR, [registered_at]) < 8, DATEADD(DAY, -1, [registered_at]), [registered_at]),'yyyy-MM-dd' ) = '${start_date}'
    `);

    // console.log("resultdata",resultdata,resultdata[0].length);
    // console.log("resultdata_UTL",resultdata_UTL);
    // console.log("resultAVG_UTL",resultAVG_UTL);
    if (resultdata[0].length > 0) {
      arrayData = resultdata[0];
      arrayData_yield = resultdata[0];
      let seriesOutput = [];
      let seriesUTL = [];
      let seriesYield = [];
      let seriesTarget = [];
      const firstData = {
        registered_at: "2023-06-16T06:00:00.183Z",
        mfg_date: "2023-06-15",
        mc_no: "ab",
        model: "a",
        dairy_ok: 0,
        dairy_total: 0,
        yield: 77,
      };
      const index_data = arrayData[0].dairy_ok;
      // console.log("iii",index_data);
      await seriesOutput.push(index_data);
      // console.log("arrayData",arrayData.unshift(firstData));
      for (let i = 0; i < arrayData.length - 1; i++) {
        // console.log((i+1).toString() + " : " + (arrayData[i+1].dairy_ok - arrayData[i].dairy_ok).toString())
        await seriesOutput.push(
          // (arrayData[i+1].dairy_ok - arrayData[i].dairy_ok).toString()
          (arrayData[i + 1].dairy_ok - arrayData[i].dairy_ok).toString() < 0
            ? 0
            : (arrayData[i + 1].dairy_ok - arrayData[i].dairy_ok).toString()
        );
        // await seriesUTL.push((((arrayData[i+1].dairy_ok - arrayData[i].dairy_ok)/arrayData[i].target_utl)*100).toString());
        seriesUTL = (
          ((arrayData[i + 1].dairy_ok - arrayData[i].dairy_ok) /
            arrayData[i].target_utl) *
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
      console.log("click PT result =====>, seriesNew" );
      
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
      console.log("0000");
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
    // res.json({
    //   resultOutput_MBR: error,
    //   api_result: constance.result_nok,
    // });
  }
});

// chart down time All MD
router.get("/MMS_downtime_MBRC_MD/:mc_no/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let { mc_no } = req.params;
    console.log("click DT", start_date);
    let resultdata = await MBR_table.sequelize.query(`-- Down time
    SELECT TOP (1)[registered_at]
    ,format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date]
    ,[mc_no]
    ,(CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
     CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
     CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
     CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) AS model
    ,[error_time] ,[alarm_time],[run_time],[stop_time],[wait_part_time]
    ,[full_part_time],[adjust_time],[set_up_time],[plan_stop_time]
    FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
    where mc_no = '${mc_no}' and format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') ='${start_date}'
    order by registered_at desc
      `);

    // console.log(resultdata);
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
        item.full_part_time,
        item.run_time,
        item.alarm_time,
        item.error_time,
        item.stop_time,
        item.wait_part_time,
        item.adjust_time,
        item.set_up_time,
        item.plan_stop_time
      );
    }
    // console.log("click seriesDT=====>", seriesDT);

    res.json({
      resultDT_MBR: seriesDT,
      resultSeriesName: seriesName,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});

// table total mornitor mc
router.post("/MBRC_mornitoring_all/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
  // console.log(req.body, start_date,moment().format("yyyy-MM-DD"));
//   const hour = parseInt(moment().format("HH"), 10);
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
      , MAX(CASE WHEN RN = 1 THEN [wait_part_time] ELSE NULL END) wait_time
      , MAX(CASE WHEN RN = 1 THEN [dairy_total] ELSE NULL END) - COALESCE(MAX(CASE WHEN RN = 2 THEN [dairy_total] ELSE NULL END), 0) PROD_DIFF
      --, MAX(CASE WHEN RN = 1 THEN [dairy_ok] ELSE NULL END) - COALESCE(MAX(CASE WHEN RN = 2 THEN [dairy_ok] ELSE NULL END), 0) PROD_DIFF
        ,MAX(CASE WHEN RN = 1 THEN [adjust_time]+[alarm_time]+[stop_time]+[error_time]+[full_part_time]+[plan_stop_time]+[set_up_time]+[wait_part_time]  ELSE NULL END) DT
        , MAX(CASE WHEN RN = 1 THEN cast((3600/NULLIF([cycle_time], 0))*100  as decimal(20,0)) ELSE NULL END) UTL_target
      , MAX(CASE WHEN RN = 1 THEN [cycle_time]/100 ELSE NULL END)  ct
      , MAX(CASE WHEN RN = 1 THEN (Case when [dairy_total]=0 then 0
                        Else cast(([dairy_ok]/[dairy_total])*100  as decimal(20,2))
                        End ) ELSE NULL END) yield
      FROM
      (
          SELECT format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date]
                  ,[mc_no],(CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
                CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +     
                CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +     
                CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) AS model,[Daily_OK] as [dairy_ok],[Daily_NG] as [dairy_ng],[Daily_Total] as [dairy_total],[registered_at],[Cycle_Time] as [cycle_time]
        ,[error_time],[alarm_time],[stop_time],[wait_part_time],[full_part_time],[adjust_time],[set_up_time],[plan_stop_time]
          ,ROW_NUMBER() OVER (PARTITION BY [mc_no] ORDER BY [registered_at] DESC) RN
          FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
        where format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') = '${start_date}'
      ) t1
      GROUP BY [mc_no],[model],[mfg_date]
      )
      select [mfg_date],CONVERT(char(5), time, 108) as at_time,[mc_no],[model],production_ok,production_ng,production_total,Last_Date,PROD_DIFF,DT,wait_time,UTL_target,cast((PROD_DIFF/NULLIF(UTL_target,0))*100  as decimal(20,2)) as UTL,ct, yield
      ,IIF(ct> 3.5,'red','') as bg_ct, IIF(cast((PROD_DIFF/NULLIF(UTL_target,0))*100  as decimal(20,2)) < 80,'red',IIF(cast((PROD_DIFF/NULLIF(UTL_target,0))*100  as decimal(20,2)) > 100,'green','')) as bg_utl, IIF(yield < 80,'red','') as bg_yield
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
        `with tb1 as(
          select [mc_no],(CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, 
[Model_3])) +
       CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +      
       CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +      
       CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) AS 
model
       ,cast(((3600*24)/NULLIF([cycle_time], 0))*100  as decimal(20,0)) as UTL_target
          FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
          where format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') = '${start_date}' and DATEPART(HOUR,registered_at) = '7'
          )
          ,tb2 as(SELECT [registered_at]
          , convert(varchar, [registered_at], 8) as time
          ,format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date]
      ,[mc_no]
      ,(CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +     
       CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +      
       CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +      
       CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) AS 
model
            ,[Daily_Total] as [dairy_total] ,[Daily_OK] as [dairy_ok] ,[Daily_NG] as [dairy_ng]
          ,cast(((3600*24)/NULLIF([cycle_time], 0))*100  as decimal(20,0)) as UTL_target
          ,[cycle_time] ,[Target_Utilize] as [target_utl]
          ,cast(([Daily_OK]/NULLIF(cast(((3600*24)/NULLIF([cycle_time], 0))*100  as decimal(20,0)), 0))*100 as decimal(20,2)) as utl
            ,[run_time],[wait_part_time] AS wait_time
            ,[adjust_time]+[alarm_time]+[stop_time]+[error_time]+[full_part_time]+[plan_stop_time]+[set_up_time]+[wait_part_time] as DT
            ,Case when [Daily_Total]=0 then 0
            Else cast(([Daily_OK]/[Daily_Total])*100  as decimal(20,2))
            End as yield
            FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
            where format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') = '${start_date}' and DATEPART(HOUR,registered_at) = '7'
            )
            ,tb3 as (select [mfg_date],tb2.time,tb1.mc_no,tb1.model,[dairy_ok],[dairy_ng],dairy_total, SUM(tb1.UTL_target) as sum_utl,DT,wait_time,yield
            ,cast(([dairy_total]/NULLIF(SUM(tb1.UTL_target), 0))*100  as decimal(20,2)) as UTL, [cycle_time]/100 
as ct
            from tb1
            left join tb2
            on tb1.mc_no = tb2.mc_no
            group by tb1.mc_no,tb1.model,DT,wait_time,[mfg_date],[dairy_ok],[dairy_ng],dairy_total,yield,cycle_time,tb2.time)
            select mfg_date,mc_no,model,dairy_ok as production_ok,[dairy_ng] as production_ng,[dairy_total] 
as production_total,DT,wait_time,yield,UTL,ct
            ,IIF(UTL < 80 ,'red',IIF(UTL < 80 ,'green','')) as bg_utl
            ,IIF(yield < 80 ,'red','') as bg_yield
            ,IIF(ct> 3.5,'red','') as bg_ct
            ,CONVERT(char(5), time, 108) as at_time
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

// production total by last time
router.post(
  "/MMS_prod_total_yield_MBRC_MD/:date/:mc/:hour",
  async (req, res) => {
    console.log(req.body);
    console.log("========== PROD TOTAL =================");
    let { mc } = req.params;
    let { hour } = req.params;
    let { date } = req.params;
    try {
      let result = await MBR_table.sequelize.query(
        `WITH RankedData AS (
        SELECT
          [registered_at],
          --convert(varchar, [registered_at], 8) as time,
          format([registered_at],'HH:mm') as time,
          (CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
           CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
           CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
           CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) AS model,
          format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date],
          [mc_no],
          [Daily_OK] as dairy_ok,
          [Daily_Total] as dairy_total,
          --cast((3600/NULLIF([Target_Utilize], 0))*100 as decimal(20,0)) as UTL_target,
          cast((3600/NULLIF([Cycle_Time], 0))*100 as decimal(20,0)) as old_UTL_target,
          COALESCE(CAST((3600 / NULLIF(CAST([Target_Utilize] AS DECIMAL), 0)) * 100 AS DECIMAL(20, 0)), 0) AS UTL_target,
          [Cycle_Time],
          [Target_Utilize],
          [Run_Time],
          cast(([Daily_OK]/NULLIF([Daily_Total], 0))*100 as decimal(20,2)) as old_yield,
          Case when [Daily_Total]=0 then 0
               Else cast(([Daily_OK]/[Daily_Total])*100 as decimal(20,2))
          End as yield,
          LAG([Daily_OK]) OVER (PARTITION BY [mc_no] ORDER BY [registered_at]) AS prev_dairy_ok
        FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
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
        [old_UTL_target],
        [Cycle_Time],
        [Target_Utilize],
        [Run_Time],
        [old_yield],
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
      console.log(final_max_prod);
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

// production total by accum
router.post(
  "/MMS_accum_prod_total_yield_MBRC_MD/:date/:mc/:hour",
  async (req, res) => {
    console.log(req.body);
    console.log("========== ACCUM PROD TOTAL =================");
    let { mc } = req.params;
    let { hour } = req.params;
    let { date } = req.params;
    try {
      let result = await MBR_table.sequelize.query(
        ` SELECT
        [registered_at],
        --convert(varchar, [registered_at], 8) as time,
        format([registered_at],'HH:mm') as time,
        (CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
         CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
         CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
         CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) AS model,
        format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date],
        [mc_no],
        [Daily_OK] as dairy_ok,
        [Daily_Total] as dairy_total,
        --cast((3600/NULLIF([Target_Utilize], 0))*100 as decimal(20,0)) as UTL_target,
        cast((3600/NULLIF([Cycle_Time], 0))*100 as decimal(20,0)) as old_UTL_target,
        COALESCE(CAST((3600 / NULLIF(CAST([Target_Utilize] AS DECIMAL), 0)) * 100 AS DECIMAL(20, 0)), 0) AS UTL_target,
        [Cycle_Time],
        [Target_Utilize],
        [Run_Time],
        cast(([Daily_OK]/NULLIF([Daily_Total], 0))*100 as decimal(20,2)) as old_yield,
        Case when [Daily_Total]=0 then 0
             Else cast(([Daily_OK]/[Daily_Total])*100 as decimal(20,2))
        End as yield
      FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
      WHERE
        mc_no LIKE '${mc}%'
        AND FORMAT(IIF(DATEPART(HOUR, [registered_at]) < 8, DATEADD(DAY, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') = '${date}'
  and DATEPART(HOUR,registered_at) = '${hour}'
    ORDER BY mc_no ASC
      
      `
      );
      let result_target = await MBR_table.sequelize.query(
        `  WITH dataAll as (SELECT
          [registered_at],
          (CHAR(CONVERT(INT, [Model_1])) + CHAR(CONVERT(INT, [Model_2])) + CHAR(CONVERT(INT, [Model_3])) +
           CHAR(CONVERT(INT, [Model_4])) + CHAR(CONVERT(INT, [Model_5])) + CHAR(CONVERT(INT, [Model_6])) +
           CHAR(CONVERT(INT, [Model_7])) + CHAR(CONVERT(INT, [Model_8])) + CHAR(CONVERT(INT, [Model_9])) +
           CHAR(CONVERT(INT, [Model_10])) + CHAR(CONVERT(INT, [Model_11])) + CHAR(CONVERT(INT, [Model_12]))) AS model,
          format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date],
          [mc_no],[Target_Utilize],
          COALESCE(CAST((3600 / NULLIF(CAST([Target_Utilize] AS DECIMAL), 0)) * 100 AS DECIMAL(20, 0)), 0) AS UTL_target
        FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
        WHERE
          mc_no LIKE '${mc}%'
          AND FORMAT(IIF(DATEPART(HOUR, [registered_at]) < 8, DATEADD(DAY, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') = '${date}'
		)
		SELECT mc_no,SUM(UTL_target) as target, SUM([Target_Utilize]) as tg
		FROM dataAll
		GROUP BY mc_no
    ORDER BY mc_no ASC
      `
      );

      const rawData = result[0];
      const rawData_target = result_target[0];
      const formattedData = rawData.map((row) => row.dairy_ok.toString());
      const Data_MC = rawData.map((row) => row.mc_no.toString());
      const data_Yield = rawData.map((row) => row.yield.toString());
      const data_Target = rawData_target.map((row) => row.target.toString());

      const dataTable = rawData.map((item) => ({
        ...item,
        target: rawData_target.find((d) => d.mc_no === item.mc_no)?.target || null
      }));
      
      // console.log(dataTable);

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
      // console.log(final_max_prod);
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
      
      console.log('Total dairy_ok:', ProdTotal);
      res.json({
        // resultBall: BallUsage[0],
        result: result[0],
        result_data: chartData,
        result_mc: Data_MC,
        ProdTotal:ProdTotal,
        scal_max: final_max_prod,
        result_table:dataTable,

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
// =========================== NEW SERVER ===================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================

//table total by machine
router.get("/MBRC_Ball_tb_NEW_SERVER/:yesterday", async (req, res) => {
  console.log(req.body);
  console.log("==========MBRC_Ball_tb NEW SERVER=================");
  try { 
    let { yesterday } = req.params;
    let resultdata_Ball = await MBR_table.sequelize.query(
      `SELECT datepart(hour,PROD.[registered_at])
      ,PROD.[mc_no],[mfg_date],[model]
      ,max([Ball_C1_OK])*6 as totalSize10
      ,max([Ball_C2_OK])*6 as totalSize20
      ,max([Ball_C3_OK])*6 as totalSize30
      ,max([Ball_C4_OK])*6 as totalSize40
      ,max([Ball_C5_OK])*6 as totalSize50
  FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY] as PROD
  left join [master_data].[dbo].[data_model_spec] as MODEL
  on PROD.mc_no = MODEL.mc_no -- (format(iif(DATEPART(HOUR, PROD.[registered_at])<7,dateadd(day,-1,PROD.[registered_at]),PROD.[registered_at]),'yyyy-MM-dd')) = MODEL.mfg_date
  where [mfg_date] = '${yesterday}' and datepart(hour,PROD.[registered_at]) in ('7' )  and (model like '%830%' or model like '')
      GROUP BY [mfg_date],PROD.[mc_no],[model],datepart(hour, PROD.[registered_at])
      UNION ALL 
    SELECT datepart(hour,PROD.[registered_at])
      ,PROD.[mc_no],[mfg_date],[model]
      ,max([Ball_C1_OK])*7 as totalSize10
      ,max([Ball_C2_OK])*7 as totalSize20
      ,max([Ball_C3_OK])*7 as totalSize30
      ,max([Ball_C4_OK])*7 as totalSize40
      ,max([Ball_C5_OK])*7 as totalSize50
  FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY] as PROD
  left join [master_data].[dbo].[data_model_spec] as MODEL
  on PROD.mc_no = MODEL.mc_no -- (format(iif(DATEPART(HOUR, PROD.[registered_at])<7,dateadd(day,-1,PROD.[registered_at]),PROD.[registered_at]),'yyyy-MM-dd')) = MODEL.mfg_date
  where [mfg_date] = '${yesterday}' and datepart(hour,PROD.[registered_at]) in ('7' ) and (model like '%626%' or model like '%608%' or model like '%6202%' or model like '%840%' or model like '%940%' or model like '%1340%' or model like '%1560%' or model like '%730%')
      GROUP BY [mfg_date],PROD.[mc_no],[model],datepart(hour, PROD.[registered_at])
      UNION ALL
    SELECT datepart(hour,PROD.[registered_at])
      ,PROD.[mc_no],[mfg_date],[model]
      ,max([Ball_C1_OK])*8 as totalSize10
      ,max([Ball_C2_OK])*8 as totalSize20
      ,max([Ball_C3_OK])*8 as totalSize30
      ,max([Ball_C4_OK])*8 as totalSize40
      ,max([Ball_C5_OK])*8 as totalSize50
  FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY] as PROD
  left join [master_data].[dbo].[data_model_spec] as MODEL
  on PROD.mc_no = MODEL.mc_no -- (format(iif(DATEPART(HOUR, PROD.[registered_at])<7,dateadd(day,-1,PROD.[registered_at]),PROD.[registered_at]),'yyyy-MM-dd')) = MODEL.mfg_date
      where [mfg_date] = '${yesterday}' and datepart(hour,PROD.[registered_at]) in ('7' )  and (model like '%1350%' or model like '%1360%' or model like '%6001%' or model like '%6002%' or model like '%630%'  )
      GROUP BY [mfg_date],PROD.[mc_no],[model],datepart(hour, PROD.[registered_at])
      UNION ALL
    SELECT datepart(hour,PROD.[registered_at])
      ,PROD.[mc_no],[mfg_date],[model]
      ,max([Ball_C1_OK])*9 as totalSize10
      ,max([Ball_C2_OK])*9 as totalSize20
      ,max([Ball_C3_OK])*9 as totalSize30
      ,max([Ball_C4_OK])*9 as totalSize40
      ,max([Ball_C5_OK])*9 as totalSize50
  FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY] as PROD
  left join [master_data].[dbo].[data_model_spec] as MODEL
  on PROD.mc_no = MODEL.mc_no -- (format(iif(DATEPART(HOUR, PROD.[registered_at])<7,dateadd(day,-1,PROD.[registered_at]),PROD.[registered_at]),'yyyy-MM-dd')) = MODEL.mfg_date
  where [mfg_date] = '${yesterday}' and datepart(hour,PROD.[registered_at]) in ('7' )  and (model like '%1680%' or model like '%1660%' or model like '%1060%' )
      GROUP BY [mfg_date],PROD.[mc_no],[model],datepart(hour, PROD.[registered_at])
      UNION ALL
      SELECT datepart(hour,PROD.[registered_at])
      ,PROD.[mc_no],[mfg_date],[model]
      ,max([Ball_C1_OK])*11 as totalSize10
      ,max([Ball_C2_OK])*11 as totalSize20
      ,max([Ball_C3_OK])*11 as totalSize30
      ,max([Ball_C4_OK])*11 as totalSize40
      ,max([Ball_C5_OK])*11 as totalSize50
  FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY] as PROD
  left join [master_data].[dbo].[data_model_spec] as MODEL
  on PROD.mc_no = MODEL.mc_no -- (format(iif(DATEPART(HOUR, PROD.[registered_at])<7,dateadd(day,-1,PROD.[registered_at]),PROD.[registered_at]),'yyyy-MM-dd')) = MODEL.mfg_date
  where [mfg_date] = '${yesterday}' and datepart(hour,PROD.[registered_at]) in ('7' )  and (model like '%740%')
        GROUP BY [mfg_date],PROD.[mc_no],[model],datepart(hour, PROD.[registered_at])
        UNION ALL
        SELECT datepart(hour,PROD.[registered_at])
      ,PROD.[mc_no],[mfg_date],[model]
      ,max([Ball_C1_OK])*13 as totalSize10
      ,max([Ball_C2_OK])*13 as totalSize20
      ,max([Ball_C3_OK])*13 as totalSize30
      ,max([Ball_C4_OK])*13 as totalSize40
      ,max([Ball_C5_OK])*13 as totalSize50
  FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY] as PROD
  left join [master_data].[dbo].[data_model_spec] as MODEL
  on PROD.mc_no = MODEL.mc_no -- (format(iif(DATEPART(HOUR, PROD.[registered_at])<7,dateadd(day,-1,PROD.[registered_at]),PROD.[registered_at]),'yyyy-MM-dd')) = MODEL.mfg_date
  where [mfg_date] = '${yesterday}'  and (model like '%850%' or model like '%614%' ) and datepart(hour,PROD.[registered_at]) in ('7' ) 
          GROUP BY [mfg_date],PROD.[mc_no],[model],datepart(hour, PROD.[registered_at])
        
        UNION ALL
    SELECT datepart(hour,PROD.[registered_at])
      ,PROD.[mc_no],[mfg_date],[model]
      ,max([Ball_C1_OK])*15 as totalSize10
      ,max([Ball_C2_OK])*15 as totalSize20
      ,max([Ball_C3_OK])*15 as totalSize30
      ,max([Ball_C4_OK])*15 as totalSize40
      ,max([Ball_C5_OK])*15 as totalSize50
  FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY] as PROD
  left join [master_data].[dbo].[data_model_spec] as MODEL
  on PROD.mc_no = MODEL.mc_no -- (format(iif(DATEPART(HOUR, PROD.[registered_at])<7,dateadd(day,-1,PROD.[registered_at]),PROD.[registered_at]),'yyyy-MM-dd')) = MODEL.mfg_date
  where [mfg_date] = '${yesterday}'  and datepart(hour,PROD.[registered_at]) in ('7' )  and (model like '%6803%'  )
      GROUP BY [mfg_date],PROD.[mc_no],[model],datepart(hour, PROD.[registered_at])
      order by mc_no asc`
    );

    // console.log(resultdata_Ball);
    arrayData_Ball = resultdata_Ball[0];
    let ballsize = [
      "BALL GRADE -5.0",
      "BALL GRADE -2.5",
      "BALL GRADE 0.0",
      "BALL GRADE +2.5",
      "BALL GRADE +5.0",
    ];
    let resultUsage_Ball = [];
    let mc_no_Name = [];
    arrayData_Ball.forEach(function (a) {
      if (!this[a.mc_no]) {
        this[a.mc_no] = { name: a.mc_no, data: [] };
        resultUsage_Ball.push(this[a.mc_no]);
        // this[a.ballsize] = { name: a.ballsize };
        // mc_no_Name.push(this[a.ballsize]);
        // mc_no_Name.push(ballsize);
      }
      this[a.mc_no].data.push(
        a.totalSize10,
        a.totalSize20,
        a.totalSize30,
        a.totalSize40,
        a.totalSize50
      );
    }, Object.create(null));
    // console.log(resultUsage_Ball);
    // set arr all value
    let getarr1 = [];
    let getarr2 = [];
    let getarr3 = [];
    let getarr4 = [];
    let getarr5 = [];
    for (let index = 0; index < resultUsage_Ball.length; index++) {
      const item = resultUsage_Ball[index];
      await getarr1.push(item.data[0]);
      await getarr2.push(item.data[1]);
      await getarr3.push(item.data[2]);
      await getarr4.push(item.data[3]);
      await getarr5.push(item.data[4]);
    }
    let getarr = [];
    getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
    // console.log("getarr");
    // console.log(getarr);
    //set name ball
    let namemc = [];
    for (let index = 0; index < resultUsage_Ball.length; index++) {
      const item = resultUsage_Ball[index];
      await namemc.push(item.name);
    }
    //set name ball
    let nameball = [];
    for (let index = 0; index < mc_no_Name.length; index++) {
      const item = mc_no_Name[index];
      await nameball.push(item.name);
    }
    // console.log(namemc);
    //set arr name,data
    let dataset = [];
    for (let index = 0; index < getarr.length; index++) {
      dataset.push({
        // name: nameball[index],
        name: ballsize[index],
        data: getarr[index],
      });
    }

    // console.log(dataset);

    let BallUsage = [resultUsage_Ball];
    let resultDate_Ball = [];
    arrayData_Ball.forEach(function (a) {
      if (!this[a.mfg_date]) {
        this[a.mfg_date] = { name: a.mfg_date };
        resultDate_Ball.push(this[a.mfg_date]);
      }
    }, Object.create(null));

    let newDate_Ball = [];
    for (let index = 0; index < resultDate_Ball.length; index++) {
      const item = resultDate_Ball[index];
      await newDate_Ball.push(item.name);
    }

    // console.log(BallUsage[0]);
    console.log("=======Table=======");
    // console.log(dataset);
    // console.log(newDate_Ball);

    res.json({
      // resultBall: BallUsage[0],
      result: resultdata_Ball,
      resultBall: dataset,
      resultDateBall: newDate_Ball,
      result_mcname: namemc,
      result_ballname: nameball,

      // resultTarget_turn: seriesTarget_new,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});

// MA By Size ==> 7 DAY AGO (ACCUMULATE)
router.post(
  "/MBRC_Ball_Size_MA_7Day_Ago/:start_date",
  async (req, res) => {
    try {
      let { start_date } = req.params;
      if (req.body.type === "SUJ") {
        if (req.body.size === "1.0") {
          let resultdata_Ball = await MBR_table.sequelize.query(
            `with tb1 as(SELECT
              datepart(hour,[registered_at]) as newHours
          ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
                ,max([ball_c1_ok])*13 as totalSize10
                ,max([ball_c2_ok])*13 as totalSize20
                ,max([ball_c3_ok])*13 as totalSize30
                ,max([ball_c4_ok])*13 as totalSize40
                ,max([ball_c5_ok])*13 as totalSize50
              ,[mc_no]
          ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
              FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
              WHERE format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') >= DATEADD(day, -6, '${start_date}') and DATEPART(HOUR,[registered_at]) in ('7' )   
          and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%614%' ) 
              group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
            ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
              )
              ,tb_sum as (SELECT mfg_date,
                  sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
                  ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
                  ,sum(totalSize50) as totalSize50
                  FROM tb1
                  group by mfg_date
                  --order by mfg_date asc
                  )
              SELECT '${start_date}' as mfg_date, SUM(totalSize10) as sum_totalSize10,SUM(totalSize20) as sum_totalSize20,SUM(totalSize30) as sum_totalSize30,
              SUM(totalSize40) as sum_totalSize40,SUM(totalSize50) as sum_totalSize50
              FROM tb_sum
            ------- 1.0 -------`
          );
          console.log(" size 1.0");
          // console.log(resultdata_Ball);
          arrayData_Ball_7Day = resultdata_Ball[0];

          let resultStock_Ball_7Day = [];
          arrayData_Ball_7Day.forEach(function (a) {
            if (!this[start_date]) {
              this[start_date] = { name: start_date, data: [] };
              resultStock_Ball_7Day.push(this[start_date]);
            }
            this[start_date].data.push(
              a.sum_totalSize10,
              a.sum_totalSize20,
              a.sum_totalSize30,
              a.sum_totalSize40,
              a.sum_totalSize50
            );
          }, Object.create(null));
          // console.log(resultStock_Ball_7Day);

          let Ball_Daily = [resultStock_Ball_7Day];
          let resultDate_Ball = [];
          arrayData_Ball_7Day.forEach(function (a) {
            if (!this[start_date]) {
              this[start_date] = { name: start_date };
              resultDate_Ball.push(this[start_date]);
            }
          }, Object.create(null));

          let getarr1 = [];
          let getarr2 = [];
          let getarr3 = [];
          let getarr4 = [];
          let getarr5 = [];
          for (let index = 0; index < resultStock_Ball_7Day.length; index++) {
            const item = resultStock_Ball_7Day[index];
            await getarr1.push(item.data[0]);
            await getarr2.push(item.data[1]);
            await getarr3.push(item.data[2]);
            await getarr4.push(item.data[3]);
            await getarr5.push(item.data[4]);
          }
          let getarr = [];
          getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
          // console.log("=================");
          // console.log(getarr);
          //set arr name,data
          let result_Ball_7Day = [];
          let nameSizeball = [
            "BALL GRADE -5.0",
            "BALL GRADE -2.5",
            "BALL GRADE 0.0",
            "BALL GRADE +2.5",
            "BALL GRADE +5.0",
          ];
          for (let index = 0; index < getarr.length; index++) {
            result_Ball_7Day.push({
              name: nameSizeball[index],
              data: getarr[index],
            });
          }

          // console.log(result_Ball_7Day);

          let newDate_Ball = [];
          for (let index = 0; index < resultDate_Ball.length; index++) {
            const item = resultDate_Ball[index];
            await newDate_Ball.push(item.name);
          }


          console.log("Table======",resultdata_Ball);

          res.json({
            resultBall: result_Ball_7Day,
            result: resultdata_Ball, //for table
            // resultBall: Ball_Daily[0],
            resultDateBall: newDate_Ball,
          });
        } else if (req.body.size === "1/16") {
          let resultdata_Ball = await MBR_table.sequelize.query(
            `with tb1 as(SELECT
              datepart(hour,[registered_at]) as newHours
                ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                ,max([ball_c1_ok])*6 as totalSize10
                ,max([ball_c2_ok])*6 as totalSize20
                ,max([ball_c3_ok])*6 as totalSize30
                ,max([ball_c4_ok])*6 as totalSize40
                ,max([ball_c5_ok])*6 as totalSize50
              ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
              FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
              WHERE format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') >= DATEADD(day, -6, '${start_date}') and DATEPART(HOUR,[registered_at]) in ('7' )   
          and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%830%' ) -- or model like '')
              group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
              UNION ALL 
            SELECT
              datepart(hour,[registered_at]) as newHours
                ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                ,max([ball_c1_ok])*7 as totalSize7_MC10
                ,max([ball_c2_ok])*7 as totalSize7_MC20
                ,max([ball_c3_ok])*7 as totalSize7_MC30
                ,max([ball_c4_ok])*7 as totalSize7_MC40
                ,max([ball_c5_ok])*7 as totalSize7_MC50
              ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
              FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
              WHERE format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') >= DATEADD(day, -6, '${start_date}') and DATEPART(HOUR,[registered_at]) in ('7' )  
          and ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%940%')
              group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
              )
              ,tb_sum as (SELECT mfg_date,
                  sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
                  ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
                  ,sum(totalSize50) as totalSize50
                  FROM tb1
                  group by mfg_date
                  --order by mfg_date asc
                  )
              SELECT '${start_date}' as mfg_date, SUM(totalSize10) as sum_totalSize10,SUM(totalSize20) as sum_totalSize20,SUM(totalSize30) as sum_totalSize30,
              SUM(totalSize40) as sum_totalSize40,SUM(totalSize50) as sum_totalSize50
              FROM tb_sum
          ------ 1/16 `
          );
          console.log(" daily");
          // console.log(resultdata_Ball);
          arrayData_Ball_7Day = resultdata_Ball[0];

          let resultStock_Ball_7Day = [];
          arrayData_Ball_7Day.forEach(function (a) {
            if (!this[start_date]) {
              this[start_date] = { name: start_date, data: [] };
              resultStock_Ball_7Day.push(this[start_date]);
            }
            this[start_date].data.push(
              a.sum_totalSize10,
              a.sum_totalSize20,
              a.sum_totalSize30,
              a.sum_totalSize40,
              a.sum_totalSize50
            );
          }, Object.create(null));
          // console.log(resultStock_Ball_7Day);

          let Ball_Daily = [resultStock_Ball_7Day];
          let resultDate_Ball = [];
          arrayData_Ball_7Day.forEach(function (a) {
            if (!this[start_date]) {
              this[start_date] = { name: start_date };
              resultDate_Ball.push(this[start_date]);
            }
          }, Object.create(null));

          let getarr1 = [];
          let getarr2 = [];
          let getarr3 = [];
          let getarr4 = [];
          let getarr5 = [];
          for (let index = 0; index < resultStock_Ball_7Day.length; index++) {
            const item = resultStock_Ball_7Day[index];
            await getarr1.push(item.data[0]);
            await getarr2.push(item.data[1]);
            await getarr3.push(item.data[2]);
            await getarr4.push(item.data[3]);
            await getarr5.push(item.data[4]);
          }
          let getarr = [];
          getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
          console.log("=================");
          // console.log(getarr);
          //set arr name,data
          let result_Ball_7Day = [];
          let nameSizeball = [
            "BALL GRADE -5.0",
            "BALL GRADE -2.5",
            "BALL GRADE 0.0",
            "BALL GRADE +2.5",
            "BALL GRADE +5.0",
          ];
          for (let index = 0; index < getarr.length; index++) {
            result_Ball_7Day.push({
              name: nameSizeball[index],
              data: getarr[index],
            });
          }

          console.log(result_Ball_7Day);

          let newDate_Ball = [];
          for (let index = 0; index < resultDate_Ball.length; index++) {
            const item = resultDate_Ball[index];
            await newDate_Ball.push(item.name);
          }

          // console.log(Ball_Daily[0]);
          console.log(resultdata_Ball);

          res.json({
            resultBall: result_Ball_7Day,
            result: resultdata_Ball, //for table
            // resultBall: Ball_Daily[0],
            resultDateBall: newDate_Ball,
          });
        } else if (req.body.size === "1/32") {
          let resultdata_Ball = await MBR_table.sequelize.query(
            `with tb1 as(
              SELECT
                datepart(hour,[registered_at]) as newHours
                  ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                  ,max([ball_c1_ok])*8 as totalSize10
                  ,max([ball_c2_ok])*8 as totalSize20
                  ,max([ball_c3_ok])*8 as totalSize30
                  ,max([ball_c4_ok])*8 as totalSize40
                  ,max([ball_c5_ok])*8 as totalSize50
                ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
                +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
                +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
                +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
                FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
                WHERE format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') >= DATEADD(day, -6, '${start_date}') and DATEPART(HOUR,[registered_at]) in ('7' )   
            and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%630%' ) -- or model like '')
                group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
            ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
                UNION ALL
              SELECT
                datepart(hour,[registered_at]) as newHours
                  ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                  ,max([ball_c1_ok])*11 as totalSize9_MC10
                  ,max([ball_c2_ok])*11 as totalSize9_MC20
                  ,max([ball_c3_ok])*11 as totalSize9_MC30
                  ,max([ball_c4_ok])*11 as totalSize9_MC40
                  ,max([ball_c5_ok])*11 as totalSize9_MC50
                ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
                FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
                WHERE format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') >= DATEADD(day, -6, '${start_date}') and DATEPART(HOUR,[registered_at]) in ('7' )   
            and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%740%')
                group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
            ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
              UNION ALL
              SELECT
                datepart(hour,[registered_at]) as newHours
                  ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                  ,max([ball_c1_ok])*13 as totalSize15_MC10
                  ,max([ball_c2_ok])*13 as totalSize15_MC20
                  ,max([ball_c3_ok])*13 as totalSize15_MC30
                  ,max([ball_c4_ok])*13 as totalSize15_MC40
                  ,max([ball_c5_ok])*13 as totalSize15_MC50
                ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
                FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
                WHERE format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') >= DATEADD(day, -6, '${start_date}') and DATEPART(HOUR,[registered_at]) in ('7' )   
            and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
          +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
          +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
          +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%850%'  )
                group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
            ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
              --order by mc_no asc
                  )
                  ,tb_sum as (SELECT mfg_date,
                      sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
                      ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
                      ,sum(totalSize50) as totalSize50
                      FROM tb1
                      group by mfg_date
                      --order by mfg_date asc
                      )
                  SELECT '${start_date}' as mfg_date, SUM(totalSize10) as sum_totalSize10,SUM(totalSize20) as sum_totalSize20,SUM(totalSize30) as sum_totalSize30,
                  SUM(totalSize40) as sum_totalSize40,SUM(totalSize50) as sum_totalSize50
                  FROM tb_sum
            ------ 1/32 ---------`
          );
          console.log(" daily");
          // console.log(resultdata_Ball);
          arrayData_Ball_7Day = resultdata_Ball[0];

          let resultStock_Ball_7Day = [];
          arrayData_Ball_7Day.forEach(function (a) {
            if (!this[start_date]) {
              this[start_date] = { name: start_date, data: [] };
              resultStock_Ball_7Day.push(this[start_date]);
            }
            this[start_date].data.push(
              a.sum_totalSize10,
              a.sum_totalSize20,
              a.sum_totalSize30,
              a.sum_totalSize40,
              a.sum_totalSize50
            );
          }, Object.create(null));
          // console.log(resultStock_Ball_7Day);

          let Ball_Daily = [resultStock_Ball_7Day];
          let resultDate_Ball = [];
          arrayData_Ball_7Day.forEach(function (a) {
            if (!this[start_date]) {
              this[start_date] = { name: start_date };
              resultDate_Ball.push(this[start_date]);
            }
          }, Object.create(null));

          let getarr1 = [];
          let getarr2 = [];
          let getarr3 = [];
          let getarr4 = [];
          let getarr5 = [];
          for (let index = 0; index < resultStock_Ball_7Day.length; index++) {
            const item = resultStock_Ball_7Day[index];
            await getarr1.push(item.data[0]);
            await getarr2.push(item.data[1]);
            await getarr3.push(item.data[2]);
            await getarr4.push(item.data[3]);
            await getarr5.push(item.data[4]);
          }
          let getarr = [];
          getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
          console.log("=================");
          // console.log(getarr);
          //set arr name,data
          let result_Ball_7Day = [];
          let nameSizeball = [
            "BALL GRADE -5.0",
            "BALL GRADE -2.5",
            "BALL GRADE 0.0",
            "BALL GRADE +2.5",
            "BALL GRADE +5.0",
          ];
          for (let index = 0; index < getarr.length; index++) {
            result_Ball_7Day.push({
              name: nameSizeball[index],
              data: getarr[index],
            });
          }

          console.log(result_Ball_7Day);

          let newDate_Ball = [];
          for (let index = 0; index < resultDate_Ball.length; index++) {
            const item = resultDate_Ball[index];
            await newDate_Ball.push(item.name);
          }

          // console.log(Ball_Daily[0]);
          console.log(resultdata_Ball);

          res.json({
            resultBall: result_Ball_7Day,
            result: resultdata_Ball, //for table
            // resultBall: Ball_Daily[0],
            resultDateBall: newDate_Ball,
          });
        } else if (req.body.size === "3/64") {
          let resultdata_Ball = await MBR_table.sequelize.query(
            `with tb1 as(SELECT
              datepart(hour,[registered_at]) as newHours
                ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                ,max([ball_c1_ok])*11 as totalSize10
                ,max([ball_c2_ok])*11 as totalSize20
                ,max([ball_c3_ok])*11 as totalSize30
                ,max([ball_c4_ok])*11 as totalSize40
                ,max([ball_c5_ok])*11 as totalSize50
              ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
              FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
              WHERE format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') >= DATEADD(day, -6, '${start_date}') and DATEPART(HOUR,[registered_at]) in ('7' )   
              and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
              +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
              +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
              +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%740%' ) -- or model like '')
              group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
              UNION ALL 
            SELECT
              datepart(hour,[registered_at]) as newHours
                ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                ,max([ball_c1_ok])*13 as totalSize7_MC10
                ,max([ball_c2_ok])*13 as totalSize7_MC20
                ,max([ball_c3_ok])*13 as totalSize7_MC30
                ,max([ball_c4_ok])*13 as totalSize7_MC40
                ,max([ball_c5_ok])*13 as totalSize7_MC50
              ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
              FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
              WHERE format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') >= DATEADD(day, -6, '${start_date}') and DATEPART(HOUR,[registered_at]) in ('7' )  
          and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%850%')
              group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
             )
             ,tb_sum as (SELECT mfg_date,
              sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
              ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
              ,sum(totalSize50) as totalSize50
              FROM tb1
              group by mfg_date
              --order by mfg_date asc
              )
          SELECT '${start_date}' as mfg_date, SUM(totalSize10) as sum_totalSize10,SUM(totalSize20) as sum_totalSize20,SUM(totalSize30) as sum_totalSize30,
          SUM(totalSize40) as sum_totalSize40,SUM(totalSize50) as sum_totalSize50
          FROM tb_sum
                  
          ------- 3/64 -------`
          );
          console.log(" daily");
          // console.log(resultdata_Ball);
          arrayData_Ball_7Day = resultdata_Ball[0];

          let resultStock_Ball_7Day = [];
          arrayData_Ball_7Day.forEach(function (a) {
            if (!this[start_date]) {
              this[start_date] = { name: start_date, data: [] };
              resultStock_Ball_7Day.push(this[start_date]);
            }
            this[start_date].data.push(
              a.sum_totalSize10,
              a.sum_totalSize20,
              a.sum_totalSize30,
              a.sum_totalSize40,
              a.sum_totalSize50
            );
          }, Object.create(null));
          // console.log(resultStock_Ball_7Day);

          let Ball_Daily = [resultStock_Ball_7Day];
          let resultDate_Ball = [];
          arrayData_Ball_7Day.forEach(function (a) {
            if (!this[start_date]) {
              this[start_date] = { name: start_date };
              resultDate_Ball.push(this[start_date]);
            }
          }, Object.create(null));

          let getarr1 = [];
          let getarr2 = [];
          let getarr3 = [];
          let getarr4 = [];
          let getarr5 = [];
          for (let index = 0; index < resultStock_Ball_7Day.length; index++) {
            const item = resultStock_Ball_7Day[index];
            await getarr1.push(item.data[0]);
            await getarr2.push(item.data[1]);
            await getarr3.push(item.data[2]);
            await getarr4.push(item.data[3]);
            await getarr5.push(item.data[4]);
          }
          let getarr = [];
          getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
          console.log("=================");
          // console.log(getarr);
          //set arr name,data
          let result_Ball_7Day = [];
          let nameSizeball = [
            "BALL GRADE -5.0",
            "BALL GRADE -2.5",
            "BALL GRADE 0.0",
            "BALL GRADE +2.5",
            "BALL GRADE +5.0",
          ];
          for (let index = 0; index < getarr.length; index++) {
            result_Ball_7Day.push({
              name: nameSizeball[index],
              data: getarr[index],
            });
          }

          console.log(result_Ball_7Day);

          let newDate_Ball = [];
          for (let index = 0; index < resultDate_Ball.length; index++) {
            const item = resultDate_Ball[index];
            await newDate_Ball.push(item.name);
          }

          // console.log(Ball_Daily[0]);
          console.log(resultdata_Ball);

          res.json({
            resultBall: result_Ball_7Day,
            result: resultdata_Ball, //for table
            // resultBall: Ball_Daily[0],
            resultDateBall: newDate_Ball,
          });
        }
      } else {
        res.json({
          result: "NO DATA",
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        error,
        api_result: constance.result_nok,
      });
    }
  }
);

// MD By Size ==> 7 DAY AGO (ACCUMULATE)
router.post(
  "/MBRC_Ball_Size_MD_7Day_Ago/:start_date",
  async (req, res) => {
    try {
      let { start_date } = req.params;
      if (req.body.size === "1/4") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
              ,max([ball_c1_ok])*7 as totalSize10
              ,max([ball_c2_ok])*7 as totalSize20
              ,max([ball_c3_ok])*7 as totalSize30
              ,max([ball_c4_ok])*7 as totalSize40
              ,max([ball_c5_ok])*7 as totalSize50
            ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
            FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
            WHERE format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') >= DATEADD(day, -6, '${start_date}') and DATEPART(HOUR,[registered_at]) in ('7' )  
        and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%6202%' ) -- or model like '')
            group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
            )
            ,tb_sum as (SELECT mfg_date,
                sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
                ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
                ,sum(totalSize50) as totalSize50
                FROM tb1
                group by mfg_date
                --order by mfg_date asc
                )
            SELECT '${start_date}' as mfg_date, SUM(totalSize10) as sum_totalSize10,SUM(totalSize20) as sum_totalSize20,SUM(totalSize30) as sum_totalSize30,
            SUM(totalSize40) as sum_totalSize40,SUM(totalSize50) as sum_totalSize50
            FROM tb_sum
      ------ 1/4`
        );
        console.log(" === MD === size 1/4 ===");
        // console.log(resultdata_Ball);
        arrayData_Ball_Daily = resultdata_Ball[0];

        let resultStock_Ball_Daily = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date, data: [] };
            resultStock_Ball_Daily.push(this[a.mfg_date]);
          }
          this[a.mfg_date].data.push(
            a.sum_totalSize10,
            a.sum_totalSize20,
            a.sum_totalSize30,
            a.sum_totalSize40,
            a.sum_totalSize50
          );
        }, Object.create(null));
        // console.log(resultStock_Ball_Daily);

        let Ball_Daily = [resultStock_Ball_Daily];
        let resultDate_Ball = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];
        for (let index = 0; index < resultStock_Ball_Daily.length; index++) {
          const item = resultStock_Ball_Daily[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        console.log("=================");
        // console.log(getarr);
        //set arr name,data
        let result_Ball_Daily = [];
        let nameSizeball = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        for (let index = 0; index < getarr.length; index++) {
          result_Ball_Daily.push({
            name: nameSizeball[index],
            data: getarr[index],
          });
        }

        console.log(result_Ball_Daily);

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(Ball_Daily[0]);
        console.log(resultdata_Ball);

        res.json({
          resultBall: result_Ball_Daily,
          result: resultdata_Ball, //for table
          // resultBall: Ball_Daily[0],
          resultDateBall: newDate_Ball,
        });
      } else if (req.body.size === "2.0") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
              ,max([ball_c1_ok])*8 as totalSize10
              ,max([ball_c2_ok])*8 as totalSize20
              ,max([ball_c3_ok])*8 as totalSize30
              ,max([ball_c4_ok])*8 as totalSize40
              ,max([ball_c5_ok])*8 as totalSize50
            ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
            FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
            WHERE format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') >= DATEADD(day, -6, '${start_date}') and DATEPART(HOUR,[registered_at]) in ('7' )  
        and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1350%' 
      or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1360%' ) -- or model like '')
            group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
        ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
            )
            ,tb_sum as (SELECT mfg_date,
                sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
                ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
                ,sum(totalSize50) as totalSize50
                FROM tb1
                group by mfg_date
                --order by mfg_date asc
                )
            SELECT '${start_date}' as mfg_date, SUM(totalSize10) as sum_totalSize10,SUM(totalSize20) as sum_totalSize20,SUM(totalSize30) as sum_totalSize30,
            SUM(totalSize40) as sum_totalSize40,SUM(totalSize50) as sum_totalSize50
            FROM tb_sum
    ------ 2.0`
        );
        console.log("=== MD === 2.0 ===");
        // console.log(resultdata_Ball);
        arrayData_Ball_Daily = resultdata_Ball[0];

        let resultStock_Ball_Daily = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date, data: [] };
            resultStock_Ball_Daily.push(this[a.mfg_date]);
          }
          this[a.mfg_date].data.push(
            a.sum_totalSize10,
            a.sum_totalSize20,
            a.sum_totalSize30,
            a.sum_totalSize40,
            a.sum_totalSize50
          );
        }, Object.create(null));
        // console.log(resultStock_Ball_Daily);

        let Ball_Daily = [resultStock_Ball_Daily];
        let resultDate_Ball = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];
        for (let index = 0; index < resultStock_Ball_Daily.length; index++) {
          const item = resultStock_Ball_Daily[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        console.log("=================");
        // console.log(getarr);
        //set arr name,data
        let result_Ball_Daily = [];
        let nameSizeball = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        for (let index = 0; index < getarr.length; index++) {
          result_Ball_Daily.push({
            name: nameSizeball[index],
            data: getarr[index],
          });
        }

        console.log(result_Ball_Daily);

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(Ball_Daily[0]);
        console.log(resultdata_Ball);

        res.json({
          resultBall: result_Ball_Daily,
          result: resultdata_Ball, //for table
          // resultBall: Ball_Daily[0],
          resultDateBall: newDate_Ball,
        });
      } else if (req.body.size === "3.5") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(
            SELECT
              datepart(hour,[registered_at]) as newHours
                ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                ,max([ball_c1_ok])*7 as totalSize10
                ,max([ball_c2_ok])*7 as totalSize20
                ,max([ball_c3_ok])*7 as totalSize30
                ,max([ball_c4_ok])*7 as totalSize40
                ,max([ball_c5_ok])*7 as totalSize50
              ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
              FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
              WHERE format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') >= DATEADD(day, -6, '${start_date}') and DATEPART(HOUR,[registered_at]) in ('7' )  
          and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
        +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
        +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
        +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%626%' ) -- ) -- or model like '')
              group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
          ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
              )
              ,tb_sum as (SELECT mfg_date,
                sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
                ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
                ,sum(totalSize50) as totalSize50
                FROM tb1
                group by mfg_date
                --order by mfg_date asc
                )
            SELECT '${start_date}' as mfg_date, SUM(totalSize10) as sum_totalSize10,SUM(totalSize20) as sum_totalSize20,SUM(totalSize30) as sum_totalSize30,
            SUM(totalSize40) as sum_totalSize40,SUM(totalSize50) as sum_totalSize50
            FROM tb_sum
      ------ 3.5`
        );
        console.log(" === MD === 3.5 ===");
        // console.log(resultdata_Ball);
        arrayData_Ball_Daily = resultdata_Ball[0];

        let resultStock_Ball_Daily = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date, data: [] };
            resultStock_Ball_Daily.push(this[a.mfg_date]);
          }
          this[a.mfg_date].data.push(
            a.sum_totalSize10,
            a.sum_totalSize20,
            a.sum_totalSize30,
            a.sum_totalSize40,
            a.sum_totalSize50
          );
        }, Object.create(null));
        // console.log(resultStock_Ball_Daily);

        let Ball_Daily = [resultStock_Ball_Daily];
        let resultDate_Ball = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];
        for (let index = 0; index < resultStock_Ball_Daily.length; index++) {
          const item = resultStock_Ball_Daily[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        console.log("=================");
        // console.log(getarr);
        //set arr name,data
        let result_Ball_Daily = [];
        let nameSizeball = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        for (let index = 0; index < getarr.length; index++) {
          result_Ball_Daily.push({
            name: nameSizeball[index],
            data: getarr[index],
          });
        }

        console.log(result_Ball_Daily);

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(Ball_Daily[0]);
        console.log(resultdata_Ball);

        res.json({
          resultBall: result_Ball_Daily,
          result: resultdata_Ball, //for table
          // resultBall: Ball_Daily[0],
          resultDateBall: newDate_Ball,
        });
      } else if (req.body.size === "3/16") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
              ,max([ball_c1_ok])*8 as totalSize10
              ,max([ball_c2_ok])*8 as totalSize20
              ,max([ball_c3_ok])*8 as totalSize30
              ,max([ball_c4_ok])*8 as totalSize40
              ,max([ball_c5_ok])*8 as totalSize50
            ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
            FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
            WHERE format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') >= DATEADD(day, -6, '${start_date}') and DATEPART(HOUR,[registered_at]) in ('7' )  
        and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%6001%' 
      or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%6002%' ) -- or model like '')
            group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
        ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
            )
            ,tb_sum as (SELECT mfg_date,
                sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
                ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
                ,sum(totalSize50) as totalSize50
                FROM tb1
                group by mfg_date
                --order by mfg_date asc
                )
            SELECT '${start_date}' as mfg_date, SUM(totalSize10) as sum_totalSize10,SUM(totalSize20) as sum_totalSize20,SUM(totalSize30) as sum_totalSize30,
            SUM(totalSize40) as sum_totalSize40,SUM(totalSize50) as sum_totalSize50
            FROM tb_sum
              ------ 3/16 ------`
        );
        console.log(" === MD === 3/16 ===");
        // console.log(resultdata_Ball);
        arrayData_Ball_Daily = resultdata_Ball[0];

        let resultStock_Ball_Daily = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date, data: [] };
            resultStock_Ball_Daily.push(this[a.mfg_date]);
          }
          this[a.mfg_date].data.push(
            a.sum_totalSize10,
            a.sum_totalSize20,
            a.sum_totalSize30,
            a.sum_totalSize40,
            a.sum_totalSize50
          );
        }, Object.create(null));
        // console.log(resultStock_Ball_Daily);

        let Ball_Daily = [resultStock_Ball_Daily];
        let resultDate_Ball = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];
        for (let index = 0; index < resultStock_Ball_Daily.length; index++) {
          const item = resultStock_Ball_Daily[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        console.log("=================");
        // console.log(getarr);
        //set arr name,data
        let result_Ball_Daily = [];
        let nameSizeball = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        for (let index = 0; index < getarr.length; index++) {
          result_Ball_Daily.push({
            name: nameSizeball[index],
            data: getarr[index],
          });
        }

        console.log(result_Ball_Daily);

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(Ball_Daily[0]);
        console.log(resultdata_Ball);

        res.json({
          resultBall: result_Ball_Daily,
          result: resultdata_Ball, //for table
          // resultBall: Ball_Daily[0],
          resultDateBall: newDate_Ball,
        });
      } else if (req.body.size === "3/32") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
              ,max([ball_c1_ok])*7 as totalSize10
              ,max([ball_c2_ok])*7 as totalSize20
              ,max([ball_c3_ok])*7 as totalSize30
              ,max([ball_c4_ok])*7 as totalSize40
              ,max([ball_c5_ok])*7 as totalSize50
            ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
            FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
            WHERE format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') >= DATEADD(day, -6, '${start_date}') and DATEPART(HOUR,[registered_at]) in ('7' )  
        and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1340%' ) -- or model like '')
            group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
        ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
            UNION ALL 
          SELECT
            datepart(hour,[registered_at]) as newHours
              ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
              ,max([ball_c1_ok])*9 as totalSize7_MC10
              ,max([ball_c2_ok])*9 as totalSize7_MC20
              ,max([ball_c3_ok])*9 as totalSize7_MC30
              ,max([ball_c4_ok])*9 as totalSize7_MC40
              ,max([ball_c5_ok])*9 as totalSize7_MC50
            ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
            FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
            WHERE format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') >= DATEADD(day, -6, '${start_date}') and DATEPART(HOUR,[registered_at]) in ('7' ) 
        and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1660%' OR (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1680%')
            group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
        ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
            UNION ALL 
            SELECT
              datepart(hour,[registered_at]) as newHours
                ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
                ,max([ball_c1_ok])*15 as totalSize7_MC10
                ,max([ball_c2_ok])*15 as totalSize7_MC20
                ,max([ball_c3_ok])*15 as totalSize7_MC30
                ,max([ball_c4_ok])*15 as totalSize7_MC40
                ,max([ball_c5_ok])*15 as totalSize7_MC50
              ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
              FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
              WHERE format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') >= DATEADD(day, -6, '${start_date}') and DATEPART(HOUR,[registered_at]) in ('7' ) 
        and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%6803%')
              group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
        ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
             )
             ,tb_sum as (SELECT mfg_date,
                sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
                ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
                ,sum(totalSize50) as totalSize50
                FROM tb1
                group by mfg_date
                --order by mfg_date asc
                )
            SELECT '${start_date}' as mfg_date, SUM(totalSize10) as sum_totalSize10,SUM(totalSize20) as sum_totalSize20,SUM(totalSize30) as sum_totalSize30,
            SUM(totalSize40) as sum_totalSize40,SUM(totalSize50) as sum_totalSize50
            FROM tb_sum
    ------ 3/32`
        );
        console.log(" === MD === 3/32 ===");
        // console.log(resultdata_Ball);
        arrayData_Ball_Daily = resultdata_Ball[0];

        let resultStock_Ball_Daily = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date, data: [] };
            resultStock_Ball_Daily.push(this[a.mfg_date]);
          }
          this[a.mfg_date].data.push(
            a.sum_totalSize10,
            a.sum_totalSize20,
            a.sum_totalSize30,
            a.sum_totalSize40,
            a.sum_totalSize50
          );
        }, Object.create(null));
        // console.log(resultStock_Ball_Daily);

        let Ball_Daily = [resultStock_Ball_Daily];
        let resultDate_Ball = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];
        for (let index = 0; index < resultStock_Ball_Daily.length; index++) {
          const item = resultStock_Ball_Daily[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        console.log("=================");
        // console.log(getarr);
        //set arr name,data
        let result_Ball_Daily = [];
        let nameSizeball = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        for (let index = 0; index < getarr.length; index++) {
          result_Ball_Daily.push({
            name: nameSizeball[index],
            data: getarr[index],
          });
        }

        console.log(result_Ball_Daily);

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(Ball_Daily[0]);
        console.log(resultdata_Ball);

        res.json({
          resultBall: result_Ball_Daily,
          result: resultdata_Ball, //for table
          // resultBall: Ball_Daily[0],
          resultDateBall: newDate_Ball,
        });
      } else if (req.body.size === "5/32") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
              ,max([ball_c1_ok])*7 as totalSize10
              ,max([ball_c2_ok])*7 as totalSize20
              ,max([ball_c3_ok])*7 as totalSize30
              ,max([ball_c4_ok])*7 as totalSize40
              ,max([ball_c5_ok])*7 as totalSize50
            ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
            FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
            WHERE format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') >= DATEADD(day, -6, '${start_date}') and DATEPART(HOUR,[registered_at]) in ('7' )  
        and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%608%' ) -- or model like '')
            group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
        ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
           )
           ,tb_sum as (SELECT mfg_date,
            sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
            ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
            ,sum(totalSize50) as totalSize50
            FROM tb1
            group by mfg_date
            --order by mfg_date asc
            )
        SELECT '${start_date}' as mfg_date, SUM(totalSize10) as sum_totalSize10,SUM(totalSize20) as sum_totalSize20,SUM(totalSize30) as sum_totalSize30,
        SUM(totalSize40) as sum_totalSize40,SUM(totalSize50) as sum_totalSize50
        FROM tb_sum
    ------ 5/32`
        );
        console.log(" === MD === 5/32===");
        // console.log(resultdata_Ball);
        arrayData_Ball_Daily = resultdata_Ball[0];

        let resultStock_Ball_Daily = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date, data: [] };
            resultStock_Ball_Daily.push(this[a.mfg_date]);
          }
          this[a.mfg_date].data.push(
            a.sum_totalSize10,
            a.sum_totalSize20,
            a.sum_totalSize30,
            a.sum_totalSize40,
            a.sum_totalSize50
          );
        }, Object.create(null));
        // console.log(resultStock_Ball_Daily);

        let Ball_Daily = [resultStock_Ball_Daily];
        let resultDate_Ball = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];
        for (let index = 0; index < resultStock_Ball_Daily.length; index++) {
          const item = resultStock_Ball_Daily[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        console.log("=================");
        // console.log(getarr);
        //set arr name,data
        let result_Ball_Daily = [];
        let nameSizeball = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        for (let index = 0; index < getarr.length; index++) {
          result_Ball_Daily.push({
            name: nameSizeball[index],
            data: getarr[index],
          });
        }

        console.log(result_Ball_Daily);

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(Ball_Daily[0]);
        console.log(resultdata_Ball);

        res.json({
          resultBall: result_Ball_Daily,
          result: resultdata_Ball, //for table
          // resultBall: Ball_Daily[0],
          resultDateBall: newDate_Ball,
        });
      } else if (req.body.size === "7/64") {
        let resultdata_Ball = await MBR_table.sequelize.query(
          `with tb1 as(SELECT
            datepart(hour,[registered_at]) as newHours
              ,format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as [mfg_date]
              ,max([ball_c1_ok])*7 as totalSize10
              ,max([ball_c2_ok])*7 as totalSize20
              ,max([ball_c3_ok])*7 as totalSize30
              ,max([ball_c4_ok])*7 as totalSize40
              ,max([ball_c5_ok])*7 as totalSize50
            ,[mc_no],(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model
            FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
            WHERE format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') >= DATEADD(day, -6, '${start_date}') and DATEPART(HOUR,[registered_at]) in ('7' )  
        and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
      +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
      +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
      +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1560%' ) -- or model like '')
            group by [registered_at],[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
        ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
           )
           ,tb_sum as (SELECT mfg_date,
            sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
            ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
            ,sum(totalSize50) as totalSize50
            FROM tb1
            group by mfg_date
            --order by mfg_date asc
            )
        SELECT '${start_date}' as mfg_date, SUM(totalSize10) as sum_totalSize10,SUM(totalSize20) as sum_totalSize20,SUM(totalSize30) as sum_totalSize30,
        SUM(totalSize40) as sum_totalSize40,SUM(totalSize50) as sum_totalSize50
        FROM tb_sum
    ------ 7/64 ------ `
        );
        console.log("=== MD === 7/64 ===");
        // console.log(resultdata_Ball);
        arrayData_Ball_Daily = resultdata_Ball[0];

        let resultStock_Ball_Daily = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date, data: [] };
            resultStock_Ball_Daily.push(this[a.mfg_date]);
          }
          this[a.mfg_date].data.push(
            a.sum_totalSize10,
            a.sum_totalSize20,
            a.sum_totalSize30,
            a.sum_totalSize40,
            a.sum_totalSize50
          );
        }, Object.create(null));
        // console.log(resultStock_Ball_Daily);

        let Ball_Daily = [resultStock_Ball_Daily];
        let resultDate_Ball = [];
        arrayData_Ball_Daily.forEach(function (a) {
          if (!this[a.mfg_date]) {
            this[a.mfg_date] = { name: a.mfg_date };
            resultDate_Ball.push(this[a.mfg_date]);
          }
        }, Object.create(null));

        let getarr1 = [];
        let getarr2 = [];
        let getarr3 = [];
        let getarr4 = [];
        let getarr5 = [];
        for (let index = 0; index < resultStock_Ball_Daily.length; index++) {
          const item = resultStock_Ball_Daily[index];
          await getarr1.push(item.data[0]);
          await getarr2.push(item.data[1]);
          await getarr3.push(item.data[2]);
          await getarr4.push(item.data[3]);
          await getarr5.push(item.data[4]);
        }
        let getarr = [];
        getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
        console.log("=================");
        // console.log(getarr);
        //set arr name,data
        let result_Ball_Daily = [];
        let nameSizeball = [
          "BALL GRADE -5.0",
          "BALL GRADE -2.5",
          "BALL GRADE 0.0",
          "BALL GRADE +2.5",
          "BALL GRADE +5.0",
        ];
        for (let index = 0; index < getarr.length; index++) {
          result_Ball_Daily.push({
            name: nameSizeball[index],
            data: getarr[index],
          });
        }

        console.log(result_Ball_Daily);

        let newDate_Ball = [];
        for (let index = 0; index < resultDate_Ball.length; index++) {
          const item = resultDate_Ball[index];
          await newDate_Ball.push(item.name);
        }

        // console.log(Ball_Daily[0]);
        console.log(resultdata_Ball);

        res.json({
          resultBall: result_Ball_Daily,
          result: resultdata_Ball, //for table
          // resultBall: Ball_Daily[0],
          resultDateBall: newDate_Ball,
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        error,
        api_result: constance.result_nok,
      });
    }
  }
);

module.exports = router;
