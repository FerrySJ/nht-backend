const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const constance = require("../constance/constance");
const moment = require("moment");

// import model
const grinding_table = require("../model/model_natMBR");

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

/////////////////////// MMS /////////////////////////

router.post("/master_mc_GD", async (req, res) => {
  // console.log("+++");
  // router.post("/TB_mms_mc", async (req, res) => {
  try {
    let result = await grinding_table.sequelize.query(
      `SELECT  distinct(left(UPPER([mc_no]),4)) AS mc_no
      FROM [data_machine_gd].[dbo].[DATA_MCSTATUS_GD]
      order by [mc_no] asc
      `
    );
    // let result_basic = await grinding_table.sequelize.query(
    //   `
    //   SELECT  distinct((UPPER([mc_no]))) AS mc_no
    //   FROM [data_machine_gd].[dbo].[DATA_MCSTATUS_GD]
    //   order by [mc_no] asc
    //   `
    // );
    // let result_topic = await grinding_table.sequelize.query(
    //   `SELECT distinct((UPPER([mc_no]))) AS mc_no--distinct([topic])
    //   FROM [data_machine_gd].[dbo].[DATA_MCSTATUS_GD]
    //   where mc_no = '${req.body.mc_no}'
    //   order by mc_no asc `
    // );
    // let result_basic_daily = await grinding_table.sequelize.query(
    //   `
    //   SELECT  distinct((UPPER([mc_no]))) AS mc_no
    //   FROM [data_machine_gd].[dbo].[DATA_MCSTATUS_GD]
    //   where format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') = '${req.body.date}'
    //   order by [mc_no] asc
    //   `
    // );

    return res.json({
      result: result[0],
      // result_basic: result_basic[0],
      // result_basic_daily: result_basic_daily[0],
      // result_topic: result_topic[0],
      api_result: constance.result_ok,
    });
  } catch (error) {
    console.log("*******master*****error********mc*******");
    console.log(error);
    res.json({
      result: error,
      api_result: constance.result_nok,
    });
  }
});
router.get("/master_mc", async (req, res) => {
  try {
    let result = await grinding_table.sequelize.query(
      `SELECT  distinct(left(UPPER([mc_no]),4)) AS mc_no
      FROM [data_machine_gd].[dbo].[DATA_MCSTATUS_GD]
      order by [mc_no] asc
      `
    );

    return res.json({
      result: result[0],
      api_result: constance.result_ok,
    });
  } catch (error) {
    console.log("*******master*****error********mc*******");
    console.log(error);
    res.json({
      result: error,
      api_result: constance.result_nok,
    });
  }
});
router.post("/master_mc_GD_basic", async (req, res) => {
  // console.log("+++");
  // router.post("/TB_mms_mc", async (req, res) => {
  try {
    let result_basic = await grinding_table.sequelize.query(
      `
      SELECT  distinct((UPPER([mc_no]))) AS mc_no
      FROM [data_machine_gd].[dbo].[DATA_MCSTATUS_GD]
      order by [mc_no] asc
      `
    );

    return res.json({
      result_basic: result_basic[0],
      api_result: constance.result_ok,
    });
  } catch (error) {
    console.log("*******master*****error********master_mc_GD_basic*******");
    console.log(error);
    res.json({
      result: error,
      api_result: constance.result_nok,
    });
  }
});
router.post("/master_mc_GD_topic", async (req, res) => {
  // router.post("/TB_mms_mc", async (req, res) => {
  try {
    let result_topic = await grinding_table.sequelize.query(
      `SELECT distinct((UPPER([mc_no]))) AS mc_no--distinct([topic])
      FROM [data_machine_gd].[dbo].[DATA_MCSTATUS_GD]
      where mc_no = '${req.body.mc_no}'
      order by mc_no asc `
    );

    return res.json({
      result_topic: result_topic[0],
      api_result: constance.result_ok,
    });
  } catch (error) {
    console.log("*******master*****error********mc_topic*******");
    console.log(error);
    res.json({
      result: error,
      api_result: constance.result_nok,
    });
  }
});

router.post("/master_mc_GD_basic_daily", async (req, res) => {
  try {
    let result_basic_daily = await grinding_table.sequelize.query(
      `
      SELECT  distinct((UPPER([mc_no]))) AS mc_no
      FROM [data_machine_gd].[dbo].[DATA_MCSTATUS_GD]
      where format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') = '${req.body.date}'
      order by [mc_no] asc 
      `
    );

    return res.json({
      result_basic_daily: result_basic_daily[0],
      api_result: constance.result_ok,
    });
  } catch (error) {
    console.log("*******master*****error********mc_basic_daily*******");
    console.log(error);
    res.json({
      result: error,
      api_result: constance.result_nok,
    });
  }
});
router.post("/GD_mms_log", async (req, res) => {
  try {
    let Result = await grinding_table.sequelize.query(
      `
      /* get status_log*/
      with tb1 as ( SELECT format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') as mfg_date
      ,IIF(CAST(DATEPART(HOUR, [occurred]) AS int)=0,23,CAST(DATEPART(HOUR, [occurred]) AS int)) as [hour]
      ,[occurred]
    ,[mc_status]
    ,[mc_no]
    FROM [data_machine_gd].[dbo].[DATA_MCSTATUS_GD]
    WHERE format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') = '${req.body.date}')
    ,tb2 as (select  mfg_date,[occurred]
    ,lead([occurred]) over(partition by [mc_no] order by [mc_no],[occurred]) AS [NextTimeStamp]
    ,[mc_status]
    ,[mc_no]z
    from tb1
    where [mc_no] = '${req.body.machine}' and  mfg_date = '${req.body.date}' )
    select mfg_date,convert(varchar,[occurred],120) as [occurred]
    ,convert(varchar,[NextTimeStamp] ,120) as [NextTimeStamp],[mc_status] 
    ,datediff(SECOND,occurred,NextTimeStamp) as sec_timediff 
    ,datediff(MINUTE,occurred,NextTimeStamp) as min_timediff 
    from tb2 
    where [NextTimeStamp] is not null AND datediff(SECOND,occurred,NextTimeStamp) <> 0
    ORDER BY occurred ASC
    `
    );
    return res.json({ result: Result[0] });
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});
// search by hour
router.post("/GD_mms_log_hour", async (req, res) => {
  try {
    let Result = await grinding_table.sequelize.query(
      `
          /* get status_log ====== HOUR*/
          with tb1 as ( SELECT format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') as mfg_date
          ,IIF(CAST(DATEPART(HOUR, [occurred]) AS int)=0,23,CAST(DATEPART(HOUR, [occurred]) AS int)) as [hour]
          ,[occurred]
      ,[mc_status]
      ,[mc_no]
  FROM [counter].[dbo].[data_mcstatus])
      ,tb2 as (select  mfg_date,[occurred]
        ,lead([occurred]) over(partition by [mc_no] order by [mc_no],[occurred]) AS [NextTimeStamp]
        ,[mc_status]
        ,[mc_no]
        from tb1
        where [mc_no] = '${req.body.machine}' and  mfg_date = '${req.body.date}' and DATEPART(HOUR,occurred) = '${req.body.hour}' )
        select mfg_date,convert(varchar,[occurred],120) as [occurred]
        ,convert(varchar,[NextTimeStamp] ,120) as [NextTimeStamp],[mc_status] 
	      ,datediff(SECOND,occurred,NextTimeStamp) as sec_timediff 
	      ,datediff(MINUTE,occurred,NextTimeStamp) as min_timediff 
        from tb2 where [NextTimeStamp] is not null
    `
    );
    return res.json({ result: Result[0] });
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});
router.post("/Timeline_Alarmlist_GD", async (req, res) => {
  try {
    let result = await grinding_table.sequelize.query(
      ` -- bar chart alarm list
      WITH CTE AS (
        SELECT *,format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') as mfg_date
             ,IIF(CAST(DATEPART(HOUR, [occurred]) AS int)=0,23,CAST(DATEPART(HOUR, [occurred]) AS int)) as [hour]
           ,LEAD([occurred]) OVER (ORDER BY [occurred] ) AS restored
        FROM [data_machine_gd].[dbo].[DATA_ALARMLIS_GD]
        
         WHERE format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') = '${req.body.date}'--convert(varchar, GETDATE(), 23)
         and mc_no = '${req.body.machine}'
      )
      ,result as(select mfg_date,[alarm]
               ,convert(varchar,[occurred],120) as [occurred]
               ,convert(varchar,[restored],120) as [restored]
             ,[hour],UPPER([mc_no]) AS mc_no
               , case when mc_no like '%r' then 2
                when mc_no like '%b' then 1
                when mc_no like '%h' then 3
                else 5 end as num
        from CTE
        where mfg_date = '${req.body.date}'
        and [mc_no] = '${req.body.machine}'
        )
        SELECT
          mfg_date,
          alarm,
          CONVERT(VARCHAR, [occurred], 120) AS occurred,
          CONVERT(VARCHAR, [restored], 120) AS restored,
          [hour],
          UPPER([mc_no]) AS mc_no
      FROM (
          SELECT
              mfg_date,
              [alarm],
              [occurred],
              [restored],
              [hour],
              UPPER([mc_no]) AS mc_no,
              ROW_NUMBER() OVER (PARTITION BY mfg_date, [alarm], [occurred], [restored], [hour], UPPER([mc_no]) ORDER BY (SELECT NULL)) AS rn
          FROM
              result
      ) AS t
      WHERE
          rn = 1
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
    // console.log(result[0]);
    return res.json({ result: result[0] });
  } catch (error) {
    res.json({
      result: error,
      api_result: constance.result_nok,
    });
  }
});
// search by hour
router.post("/Timeline_Alarmlist_GD_Hour", async (req, res) => {
  try {
    let result = await grinding_table.sequelize.query(
      ` -- chart alarm topic
    with tb1 as (select [topic],
      format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') as mfg_date
      ,[occurred]
      ,[restored]
     --,convert(varchar, [test_mms].[occurred],120) as [occurred]
     --,convert(varchar, [test_mms].[restored],120) as [restored]
     ,IIF(CAST(DATEPART(HOUR, [occurred]) AS int)=0,23,CAST(DATEPART(HOUR, [occurred]) AS int)) as [hour]
     ,UPPER([mc_no]) as [mc_no]
     ,UPPER(left([mc_no],2)) as propcess
     FROM [data_machine_gd].[dbo].[DATA_MCSTATUS_GD]
  )
--,tb2 as (
--select tb1.mfg_date,tb1.[topic],tb1.[occurred] ,tb1.[restored],tb1.[hour],tb1.propcess ,tb1.[mc_no]
--,[test_topic_masters].[responsible]
--from tb1 left join [test_topic_masters]
--on tb1.[topic] COLLATE SQL_Latin1_General_CP1_CI_AS = [test_topic_masters].[Topic] COLLATE SQL_Latin1_General_CP1_CI_AS
--)
select mfg_date,[topic]
       ,convert(varchar,[occurred],120) as [occurred]
       ,convert(varchar,[restored],120) as [restored],[hour],[mc_no]
       , case when mc_no like '%r' then 2
			  when mc_no like '%b' then 1
			  when mc_no like '%h' then 3
			  else 5 end as num
from tb1
where mfg_date = '${req.body.date}'
--and [mc_no] = '${req.body.machine}'
and [mc_no] = '${req.body.machine}' and [hour] = '${req.body.hour}'
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
              else 0   end ,[occurred]`
    );
    // console.log(result[0]);
    return res.json({ result: result[0] });
  } catch (error) {
    res.json({
      result: error,
      api_result: constance.result_nok,
    });
  }
});
router.post("/AlarmTopic_time", async (req, res) => {
  try {
    let Result = await grinding_table.sequelize.query(
      `WITH CTE AS (
        SELECT *,format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') as mfg_date
             ,IIF(CAST(DATEPART(HOUR, [occurred]) AS int)=0,23,CAST(DATEPART(HOUR, [occurred]) AS int)) as [hour]
               ,LEAD(occurred) OVER (ORDER BY occurred) AS restored
        FROM [data_machine_gd].[dbo].[DATA_ALARMLIS_GD]
        
         WHERE format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') = convert(varchar, GETDATE(), 23)
         and mc_no = 'ic02b'
      )
      ,result as(select mfg_date,[alarm]
               ,convert(varchar,[occurred],120) as [occurred]
               ,convert(varchar,[restored],120) as [restored]
             ,[hour],UPPER([mc_no]) AS mc_no
               , case when mc_no like '%r' then 2
                when mc_no like '%b' then 1
                when mc_no like '%h' then 3
                else 5 end as num
        from CTE
        where mfg_date = '2024-04-03'
        and [mc_no] = 'IC02B'
        )
        SELECT
          mfg_date,
          alarm,
          CONVERT(VARCHAR, [occurred], 120) AS occurred,
          CONVERT(VARCHAR, [restored], 120) AS restored,
          [hour],
          UPPER([mc_no]) AS mc_no
      FROM (
          SELECT
              mfg_date,
              [alarm],
              [occurred],
              [restored],
              [hour],
              UPPER([mc_no]) AS mc_no,
              ROW_NUMBER() OVER (PARTITION BY mfg_date, [alarm], [occurred], [restored], [hour], UPPER([mc_no]) ORDER BY (SELECT NULL)) AS rn
          FROM
              result -- แทนชื่อตารางของคุณที่นี่
      ) AS t
      WHERE
          rn = 1
      
      
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
                      else 0   end ,[occurred]`
      //   `
      //       /* count time HH:mm:ss */
      //       with tb1 as(
      //           select [topic],
      //           format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') as mfg_date
      //           ,iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]) as occur_new
      //           ,iif(DATEPART(HOUR, [restored])<7,dateadd(day,-1,[restored]),[restored]) as [restored]
      //          --,convert(varchar, [test_mms].[occurred],120) as [occurred]
      //          --,convert(varchar, [test_mms].[restored],120) as [restored]
      //          ,IIF(CAST(DATEPART(HOUR, [test_mms].[occurred]) AS int)=0,23,CAST(DATEPART(HOUR, [test_mms].[occurred]) AS int)) as [hour]
      //          ,[mc_no]
      //          ,[sum]
      //          FROM [counter].[dbo].[test_mms]
      //          )
      //         ,tb2 as (
      //         select  [topic]
      //          ,sum([sum]) as [Time]
      //          from tb1
      //          where mfg_date = '${req.body.date}'
      //          and [mc_no] = '${req.body.machine}'
      //          group by [topic]
      //          )
      //         select top(3) [topic]
      //         ,[Time]
      //         ,convert(varchar,DATEADD(s,[Time],0),8) as Alarm
      //         from tb2
      //         order by convert(varchar,DATEADD(s,[Time],0),8) desc
      // `
    );
    return res.json({ result: Result[0] });
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});

// get data to table toal m/c
router.post("/AlarmTopic_time2", async (req, res) => {
  try {
    let Result = await grinding_table.sequelize.query(
      `  /* TABLE TIME -- count time HH:mm:ss */
      with tb1 as(SELECT 	
       [registered_at],
     format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') as mfg_date ,
     LEAD([occurred]) OVER (ORDER BY [occurred] ) AS previous,
     LEAD([occurred]) OVER (ORDER BY [occurred] ASC) - [occurred] AS difference_previous
     ,[occurred]
     ,[mc_status],[mc_no]
     FROM [data_machine_gd].[dbo].[DATA_MCSTATUS_GD]
     where format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd')  = '${req.body.date2}' and [mc_no] = '${req.body.machine}')
         ,tb2 as(select
           [mc_status],
             sum(DATEDIFF(SECOND, '0:00:00', [difference_previous] )) as [sec]
            from tb1
           group by [mc_status])
          ,tb4 as ( 
    select [SEC],
           [mc_status], case
           when [mc_status] = 'mc_run' then 'RUN'
           when [mc_status] = 'mc_alarm' then 'ALARM'
           else 'STOP'  end as [status]
           ,convert(varchar,DATEADD(s,[SEC],0),8) as Alarm
           ,IIF(mc_status = 'mc_run','badge rounded-pill bg-success'
     ,IIF(mc_status = 'mc_stop','badge rounded-pill bg-danger'
     ,IIF(mc_status = 'mc_alarm','badge rounded-pill bg-warning'
     ,IIF(mc_status = 'mc_waitpart','badge rounded-pill bg-info','badge rounded-pill bg-primary')))) as bg_badge
           from tb2
           WHERE [SEC] <> '' 
     )
     select  status,sum([sec]) as [sec]
     ,FORMAT(DATEADD(ms, SUM(DATEDIFF(ms, '00:00:00.000', Alarm)), '00:00:00.000'),'HH:mm:ss')  as Alarm
     ,IIF(status='RUN','badge rounded-pill bg-success',IIF(status = 'ALARM','badge rounded-pill bg-warning','badge rounded-pill bg-danger')) as bg_badge
     from tb4 
     group by status
           order by [SEC] desc
`
      //   `      /* TABLE TIME -- count time HH:mm:ss */
      //     with tb1 as(SELECT
      //       [registered_at],
      // format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') as mfg_date ,
      //       LEAD([occurred]) OVER (ORDER BY [occurred] ) AS previous,
      //       LEAD([occurred]) OVER (ORDER BY [occurred] ASC) - [occurred] AS difference_previous
      // ,[occurred]
      // ,[mc_status],[mc_no]
      // FROM [counter].[dbo].[data_mcstatus]
      //     where format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') = '${req.body.date2}' and [mc_no] = '${req.body.machine}')
      //         ,tb2 as(select
      //           [mc_status],
      //             sum(DATEDIFF(SECOND, '0:00:00', [difference_previous] )) as [sec]
      //            from tb1
      //            where mfg_date = '${req.body.date2}' and [mc_no] = '${req.body.machine}'
      //            --where mfg_date = '${req.body.date2}' and [mc_no] = '${req.body.machine}'
      //           group by [mc_status])
      //           select top 3
      //           [SEC],
      //           [mc_status], case
      //           when [mc_status] = '1' then 'RUN'
      //           when [mc_status] = '2' then 'STOP'
      //           when [mc_status] = '3' then 'ALARM'
      //           when [mc_status] = '4' then 'WAIT PART'
      //           when [mc_status] = '5' then 'FULL PART'
      //             end as [status]

      //           ,convert(varchar,DATEADD(s,[SEC],0),8) as Alarm
      //           ,IIF(mc_status = '1','badge rounded-pill bg-success',IIF(mc_status = '2','badge rounded-pill bg-danger',IIF(mc_status = '3','badge rounded-pill bg-warning',IIF(mc_status = '4','badge rounded-pill bg-info','badge rounded-pill bg-primary')))) as bg_badge
      //           from tb2
      //           WHERE [SEC] <> '' and mc_status in ('1','2')
      //           order by [SEC] desc`
    );
    let result_time_total = await grinding_table.sequelize.query(
      `with tb1 as(SELECT 	
        [registered_at],
      format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') as mfg_date ,
      LEAD([occurred]) OVER (ORDER BY [occurred] ) AS previous,
      LEAD([occurred]) OVER (ORDER BY [occurred] ASC) - [occurred] AS difference_previous
      ,[occurred]
      ,[mc_status],[mc_no]
      FROM [data_machine_gd].[dbo].[DATA_MCSTATUS_GD]
      where format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd')  = '${req.body.date2}' and [mc_no] = '${req.body.machine}')
          ,tb2 as(select
            [mc_status],
              sum(DATEDIFF(SECOND, '0:00:00', [difference_previous] )) as [sec]
             from tb1
            group by [mc_status])
           ,tb4 as ( 
     select [SEC],
            [mc_status], case
            when [mc_status] = 'mc_run' then 'RUN'
            when [mc_status] = 'mc_alarm' then 'ALARM'
            else 'STOP'  end as [status]
            ,convert(varchar,DATEADD(s,[SEC],0),8) as Alarm
            ,IIF(mc_status = 'mc_run','badge rounded-pill bg-success'
      ,IIF(mc_status = 'mc_stop','badge rounded-pill bg-danger'
      ,IIF(mc_status = 'mc_alarm','badge rounded-pill bg-warning'
      ,IIF(mc_status = 'mc_waitpart','badge rounded-pill bg-info','badge rounded-pill bg-primary')))) as bg_badge
            from tb2
            WHERE [SEC] <> '' 
      )
      ,sum_time as (
        select  status,sum([sec]) as [sec]
        ,FORMAT(DATEADD(ms, SUM(DATEDIFF(ms, '00:00:00.000', Alarm)), '00:00:00.000'),'HH:mm:ss')  as Alarm
        ,IIF(status='RUN','badge rounded-pill bg-success',IIF(status = 'ALARM','badge rounded-pill bg-warning','badge rounded-pill bg-danger')) as bg_badge
        from tb4 
        group by status
      
      )
      select convert(varchar,DATEADD(s,(sum(sec)),0),8) as total_time
      from sum_time

`
    );
    return res.json({
      result: Result[0],
      result_time_total: result_time_total[0],
      api_result: constance.result_ok,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});
// search by hour
router.post("/AlarmTopic_time2_hour", async (req, res) => {
  try {
    let Result = await grinding_table.sequelize.query(
      `  /* TABLE TIME -- count time HH:mm:ss */
       with tb1 as(SELECT 	
        [registered_at],
      format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') as mfg_date ,
      LEAD([occurred]) OVER (ORDER BY [occurred] ) AS previous,
      LEAD([occurred]) OVER (ORDER BY [occurred] ASC) - [occurred] AS difference_previous
      ,[occurred]
      ,[mc_status],[mc_no]
      FROM [counter].[dbo].[data_mcstatus]
      where format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd')  = '${req.body.date2}' and [mc_no] = '${req.body.machine}' and DATEPART(HOUR,occurred) = '${req.body.hour}')
          ,tb2 as(select
            [mc_status],
              sum(DATEDIFF(SECOND, '0:00:00', [difference_previous] )) as [sec]
             from tb1
            group by [mc_status])
           ,tb4 as ( 
     select [SEC],
            [mc_status], case
            when [mc_status] = '1' then 'RUN'
            when [mc_status] in ('2','4','5') then 'STOP'
            when [mc_status] = '3' then 'ALARM'
              end as [status]
            ,convert(varchar,DATEADD(s,[SEC],0),8) as Alarm
            ,IIF(mc_status = '1','badge rounded-pill bg-success'
      ,IIF(mc_status = '2','badge rounded-pill bg-danger'
      ,IIF(mc_status = '3','badge rounded-pill bg-warning'
      ,IIF(mc_status = '4','badge rounded-pill bg-info','badge rounded-pill bg-primary')))) as bg_badge
            from tb2
            WHERE [SEC] <> '' 
      )
      select  status,sum([sec]) as [sec]
      ,FORMAT(DATEADD(ms, SUM(DATEDIFF(ms, '00:00:00.000', Alarm)), '00:00:00.000'),'HH:mm:ss')  as Alarm
      ,IIF(status='RUN','badge rounded-pill bg-success',IIF(status = 'ALARM','badge rounded-pill bg-warning','badge rounded-pill bg-danger')) as bg_badge
      from tb4 
      group by status
            order by [SEC] desc
`
    );
    let result_time_total = await grinding_table.sequelize.query(
      `with tb1 as(SELECT 	
        [registered_at],
		[occurred],
      format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') as mfg_date ,
      LEAD([occurred]) OVER (ORDER BY [occurred] ) AS previous,
      LEAD([occurred]) OVER (ORDER BY [occurred] ASC) - [occurred] AS difference_previous
      
      ,[mc_status],[mc_no]
      FROM [counter].[dbo].[data_mcstatus]
      where format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') = '${req.body.date2}' and [mc_no] = '${req.body.machine}'  and DATEPART(HOUR,occurred) = '${req.body.hour}')
          ,tb2 as(select
            [mc_status],
              sum(DATEDIFF(SECOND, '0:00:00', [difference_previous] )) as [sec]
             from tb1
            group by [mc_status])
           ,tb4 as ( 
     select [SEC],
            [mc_status], case
            when [mc_status] = '1' then 'RUN'
            when [mc_status] in ('2','4','5') then 'STOP'
            when [mc_status] = '3' then 'ALARM'
              end as [status]
            ,convert(varchar,DATEADD(s,[SEC],0),8) as Alarm
            ,IIF(mc_status = '1','badge rounded-pill bg-success'
      ,IIF(mc_status = '2','badge rounded-pill bg-danger'
      ,IIF(mc_status = '3','badge rounded-pill bg-warning'
      ,IIF(mc_status = '4','badge rounded-pill bg-info','badge rounded-pill bg-primary')))) as bg_badge
            from tb2
            WHERE [SEC] <> '' --and [mc_status] <> '3'
      )
	  ,sum_time as (
      select  status,sum([sec]) as [sec]
      ,FORMAT(DATEADD(ms, SUM(DATEDIFF(ms, '00:00:00.000', Alarm)), '00:00:00.000'),'HH:mm:ss')  as Alarm
      ,IIF(status='RUN','badge rounded-pill bg-success',IIF(status = 'ALARM','badge rounded-pill bg-warning','badge rounded-pill bg-danger')) as bg_badge
      from tb4 
      group by status
      --order by [SEC] desc
	  )
	  select convert(varchar,DATEADD(s,(sum(sec)),0),8) as total_time
	  from sum_time
`
    );
    return res.json({
      result: Result[0],
      result_time_total: result_time_total[0],
      api_result: constance.result_ok,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});
// Table Topic MC
router.post("/GetTopic_time", async (req, res) => {
  try {
    let Result = await grinding_table.sequelize.query(
      ` with tb1 as (SELECT [registered_at]
        ,alarm
        ,[occurred],
     LEAD([occurred]) OVER (ORDER BY [occurred] ) AS [restored],
     --LEAD([occurred]) OVER (ORDER BY [occurred] ASC) - [occurred] AS [time_diff]
    DATEDIFF(SECOND, [occurred], (LEAD([occurred]) OVER (ORDER BY [occurred] ))) AS [time_diff]
        
        ,[mc_no]
    FROM [data_machine_gd].[dbo].[DATA_ALARMLIS_GD]
    where format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') = '${req.body.date2}' and [mc_no] = '${req.body.machine}' 
    )
    select [mc_no],alarm,sum([time_diff]) as time_alarm,convert(varchar,DATEADD(s,(sum([time_diff])),0),8) as Alarm
    from tb1
	where time_diff <> 0
    group by alarm,mc_no
    order by sum([time_diff]) desc`
      //   `with tb1 as (SELECT TOP (1000) [registered_at]
      //     ,[topic]
      //     ,[occurred]
      //     ,[restored]
      //     ,[time_diff]
      //     ,[mc_no]
      // FROM [data_machine_gd].[dbo].[DATA_MCSTATUS_GD]
      // where format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') = '${req.body.date2}' and [mc_no] = '${req.body.machine}'
      // )
      // select [mc_no],[topic],sum([time_diff]) as time_alarm,convert(varchar,DATEADD(s,(sum([time_diff])),0),8) as Alarm
      // from tb1
      // group by [topic],mc_no
      // order by sum([time_diff]) desc`
    );
    let result_time_total = await grinding_table.sequelize.query(
      ` with tb1 as (SELECT [registered_at]
        ,alarm
        ,[occurred],
     LEAD([occurred]) OVER (ORDER BY [occurred] ) AS [restored],
    DATEDIFF(SECOND, [occurred], (LEAD([occurred]) OVER (ORDER BY [occurred] ))) AS [time_diff]
        
        ,[mc_no]
    FROM [data_machine_gd].[dbo].[DATA_ALARMLIS_GD]
    where format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') = '${req.body.date2}' and [mc_no] = '${req.body.machine}' 
    )
	,sum_time as (
    select [mc_no],alarm,sum([time_diff]) as time_alarm,convert(varchar,DATEADD(s,(sum([time_diff])),0),8) as larm
    from tb1
	where time_diff <> 0
    group by alarm,mc_no
	)
    select mc_no,convert(varchar,DATEADD(s,(sum(time_alarm)),0),8) as total_time
    from sum_time
    group by mc_no
`
    );
    result_date = Result[0];
    let Array_result = [];
    result_date.forEach(function (a) {
      if (!this[a.mc_no]) {
        this[a.mc_no] = { name: a.mc_no, data: [] };
        Array_result.push(this[a.mc_no]);
      }
      this[a.mc_no].data.push(a.Alarm);
    }, Object.create(null));
    // console.log("Array_result", Array_result);
    // var hours = 0;
    // var minutes = 0;
    // var seconds = 0;
    // var sum_time = "";
    // var myArray = Array_result[0].data;
    // for (var i in myArray) {
    //   hours += parseInt(myArray[i].substring(0, 2));
    //   minutes += parseInt(myArray[i].substring(3, 5));
    //   seconds += parseInt(myArray[i].substring(6));
    // }
    // if (seconds > 59) {
    //   minutes += parseInt(seconds / 60);
    //   seconds = parseInt(seconds % 60);
    // }
    // if (minutes > 59) {
    //   hours += parseInt(minutes / 60);
    //   minutes = parseInt(minutes % 60);
    // }
    // sum_time = hours + ":" + minutes + ":" + seconds;
    // console.log(sum_time);
    // console.log(result_time_total[0]);
    return res.json({
      result: Result[0],
      result_array: Array_result[0],
      result_time_total: result_time_total[0],
      api_result: constance.result_ok,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});
// search by hour
router.post("/GetTopic_time_hour", async (req, res) => {
  try {
    let Result = await grinding_table.sequelize.query(
      `with tb1 as (SELECT TOP (1000) [registered_at]
        ,[topic]
        ,[occurred]
        ,[restored]
        ,[time_diff]
        ,[mc_no]
    FROM [data_machine_gd].[dbo].[DATA_MCSTATUS_GD]
    where format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') = '${req.body.date2}' and [mc_no] = '${req.body.machine}' and DATEPART(HOUR,occurred) = '${req.body.hour}'
    )
    select [mc_no],[topic],sum([time_diff]) as time_alarm,convert(varchar,DATEADD(s,(sum([time_diff])),0),8) as Alarm
    from tb1
    group by [topic],mc_no
    order by sum([time_diff]) desc`
    );
    let result_time_total = await grinding_table.sequelize.query(
      `with tb1 as (SELECT TOP (1000) [registered_at]
      ,[topic]
      ,[occurred]
      ,[restored]
      ,[time_diff]
      ,[mc_no]
      FROM [data_machine_gd].[dbo].[DATA_MCSTATUS_GD]
      where format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') = '${req.body.date2}' and [mc_no] = '${req.body.machine}' and DATEPART(HOUR,occurred) = '${req.body.hour}'
      )
    ,sum_time as (
      select [mc_no],[topic],sum([time_diff]) as time_alarm,convert(varchar,DATEADD(s,(sum([time_diff])),0),8) as Alarm
      from tb1
      group by [topic],mc_no
      --order by sum([time_diff]) desc
    )
    select mc_no,convert(varchar,DATEADD(s,(sum(time_alarm)),0),8) as total_time
    from sum_time
    group by mc_no
`
    );
    result_date = Result[0];
    let Array_result = [];
    result_date.forEach(function (a) {
      if (!this[a.mc_no]) {
        this[a.mc_no] = { name: a.mc_no, data: [] };
        Array_result.push(this[a.mc_no]);
      }
      this[a.mc_no].data.push(a.Alarm);
    }, Object.create(null));
    // console.log("Array_result", Array_result);
    // var hours = 0;
    // var minutes = 0;
    // var seconds = 0;
    // var sum_time = "";
    // var myArray = Array_result[0].data;
    // for (var i in myArray) {
    //   hours += parseInt(myArray[i].substring(0, 2));
    //   minutes += parseInt(myArray[i].substring(3, 5));
    //   seconds += parseInt(myArray[i].substring(6));
    // }
    // if (seconds > 59) {
    //   minutes += parseInt(seconds / 60);
    //   seconds = parseInt(seconds % 60);
    // }
    // if (minutes > 59) {
    //   hours += parseInt(minutes / 60);
    //   minutes = parseInt(minutes % 60);
    // }
    // sum_time = hours + ":" + minutes + ":" + seconds;
    // console.log(sum_time);
    return res.json({
      result: Result[0],
      result_array: Array_result[0],
      result_time_total: result_time_total[0],
      api_result: constance.result_ok,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});

// MMS alarm
router.get("/mms/:start_date/:end_date/:selectMc", async (req, res) => {
  // router.get("/mms/:start_date/:end_date", async (req, res) => {
  let { start_date } = req.params;
  let { end_date } = req.params;
  let { selectMc } = req.params;

  var list_date = [];
  list_date = getDatesInRange(new Date(start_date), new Date(end_date));
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

  try {
    let resultMMS = await grinding_table.sequelize.query(
      `
    WITH cte_quantity
    AS
    (
SELECT 
    [topic]
  ,iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]) as occur_new
--    ,format( [occurred] ,'dd-MM-yyyy') as newDate
    ,[sum]


FROM [counter].[dbo].[test_mms]	
 
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
    // console.log(resultMMS);
    arrayData_MMS = resultMMS[0];

    let resultList_MMS = [];
    arrayData_MMS.forEach(function (a) {
      if (!this[a.topic]) {
        this[a.topic] = { name: a.topic, data: [] };
        resultList_MMS.push(this[a.topic]);
      }
      this[a.topic].data.push(a.array);
    }, Object.create(null));

    // console.log(resultList_MMS);

    res.json({
      resultMMS: resultList_MMS,
      resultDate_MMS: list_date,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});

router.get("/mms_machine", async (req, res) => {
  try {
    let resultMachine = await grinding_table.sequelize.query(`SELECT[mc_no]
    FROM [counter].[dbo].[test_mms]
    group by [mc_no]
    order by [mc_no]
        `);
    // console.log(resultMachine[0]);
    arrayData = resultMachine[0];

    res.json({
      resultMc: arrayData,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});

//MMS GD ICB
router.post("/mms_counter_ICB", async (req, res) => {
  try {
    let result = await grinding_table.sequelize.query(`
    SELECT TOP(1) [registered_at],[mc_no],[process],[d_str1],[d_str2],[rssi],[avgct],[eachct],[yieldrt],[idl]
    ,[ng_p],[ng_n],[tng],[prod_total],[utilization],[utl_total],[prod_s1],[prod_s2],[prod_s3],[cth1],[cth2],[idh1],[idh2]
  FROM [data_machine_gd].[dbo].[DATA_PRODUCTION_GD]
  WHERE [mc_no] = '${req.body.mc_no}'
  ORDER BY registered_at DESC
        `);
    // console.log(result[0]);
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

//mc status [non/operating time]
router.post(
  "/MC_Status_All/:start_date/:end_date/:selectMc",
  async (req, res) => {
    try {
      let { start_date } = req.params;
      let { end_date } = req.params;
      let { selectMc } = req.params;
      let resultdata = await grinding_table.sequelize.query(
        `WITH tb1
      AS
      (
      SELECT  
      iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]) as occur_new
  , [registered_at]
   ,[occurred]
   ,[mc_status]
   ,[mc_no]
FROM [counter].[dbo].[data_mcstatus]
   where [mc_no] ='${selectMc}' 
   group by [mc_status],iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred])  , [registered_at]
   ,[occurred]
   ,[mc_status]
   ,[mc_no])
    , tb2  as(   select  [mc_status],format(occur_new,'yyyy-MM-dd')  as newDate ,[occurred],[mc_no]
      FROM tb1
    )
    ,tb3 as (select tb2.[newDate]  as [mfg_date],[mc_no],[mc_status],[occurred]
    from tb2
   )
    ,tb4 as (
        SELECT *
          ,lead([occurred]) over(partition by [mc_no] order by [mc_no],[occurred]) AS [NextTimeStamp]
        FROM tb3 
        where tb3.[mfg_date]  between '${start_date}'  and '${end_date}' --= '2023-08-24'
        )
        ,tb5 as (
    select * ,datediff(MINUTE,occurred,NextTimeStamp) as timediff 
    from tb4 where [NextTimeStamp] is not null
   --group by [mfg_date],[mc_no],occurred,NextTimeStamp,[mc_status]
    --order by occurred desc
    ) 
    ,non as (
    select mfg_date,[mc_no], sum(timediff) as non_oper
    from tb5 
    where [mc_status] in ('2','4','5','3') 
    group by mfg_date,[mc_no]
    )
    ,oper as ( select mfg_date,[mc_no], sum(timediff) as oper
    from tb5 
    where [mc_status] in ('1')
    group by mfg_date,[mc_no]
    )
    select non.mfg_date,oper.[mc_no],oper,non_oper
    from non 
    left join oper
    on non.mfg_date = oper.mfg_date
    --where oper > non_oper`
        //       `-- ///////////  non operating [1-5] = all  ///////////
        //       with tb1_min as(
        //       SELECT [occurred],mc_no,[mc_status],format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') as mfg_date
        //           ,convert(varchar, [occurred], 108) as min_cur
        //         FROM [counter].[dbo].[data_mcstatus]
        //        where  DATEPART(HOUR,[occurred] ) > '12' and /*DATEPART(HOUR,[occurred] ) = '15' and*/ format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') between '${start_date}'  and '${end_date}'
        //        and mc_no = '${selectMc}' and [mc_status] <> '1'
        //        )
        //        , total_tb1 as (
        //        select mfg_date,MIN(min_cur) as min_date,MAX(min_cur) as max_date,mc_no
        //        from tb1_min
        //        group by mc_no,mfg_date
        //        )
        //        -- //////////  operationg [1-5]   ////////////
        //        ,tb2_min as(
        //       SELECT [occurred],mc_no,[mc_status],format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') as mfg_date
        //           ,convert(varchar, [occurred], 108) as min_cur
        //         FROM [counter].[dbo].[data_mcstatus]
        //        where  DATEPART(HOUR,[occurred] ) > '12' and /*DATEPART(HOUR,[occurred] ) = '15' and*/  format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') between '${start_date}'  and '${end_date}'
        //        and mc_no = '${selectMc}' and [mc_status] = '1'
        //        --order by registered_at asc
        //        )
        //        , total_tb2 as (select mfg_date,MIN(min_cur) as min_date,MAX(min_cur) as max_date, mc_no
        //        from tb2_min
        //       group by mc_no,mfg_date)
        //       ,total_all as (
        //        select total_tb1.mfg_date,Upper(total_tb1.mc_no) as mc_no, DATEDIFF(SECOND,total_tb1.min_date, total_tb1.max_date) as nonoper , DATEDIFF(SECOND,total_tb2.min_date, total_tb2.max_date) as oper
        //        from total_tb1
        //        left join total_tb2
        //        on total_tb1.mfg_date = total_tb2.mfg_date)
        //        select mfg_date,mc_no,nonoper,cast((nonoper/(6*3600.00))*100 as decimal(10,2)) as [dec_non]   --,(nonoper*100/(6*3600)) as non
        //        ,oper,cast((oper*100/(6*3600.00)) as decimal(10,2)) as [dec_oper]
        //        from total_all
        //  `
      );

      // console.log(resultdata);
      // console.log(resultdata[0].length);
      // arrayData = resultdata[0];
      let name_series = ["Operating time", "Non - Operating time"];
      let resultMC_Status = [];
      arrayData.forEach(function (a) {
        if (!this[a.mfg_date]) {
          this[a.mfg_date] = { name: a.mfg_date, data: [] };
          resultMC_Status.push(this[a.mfg_date]);
        }
        this[a.mfg_date].data.push(
          a.oper,
          a.non_oper
          // a.dec_non,
          // a.dec_oper,
        );
      }, Object.create(null));
      // set arr all value
      // console.log("resultMC_Status =========", resultMC_Status);
      let getarr1 = [];
      let getarr2 = [];
      for (let index = 0; index < resultMC_Status.length; index++) {
        const item = resultMC_Status[index];
        await getarr1.push(item.data[0]);
        await getarr2.push(item.data[1]);
      }
      let getarr = [];
      getarr.push(getarr1, getarr2);
      // console.log(getarr);
      //set name ball
      let namemc = [];
      for (let index = 0; index < resultMC_Status.length; index++) {
        const item = resultMC_Status[index];
        await namemc.push(item.name);
      }
      //set arr name,data
      let dataset = [];
      for (let index = 0; index < getarr.length; index++) {
        dataset.push({
          name: name_series[index],
          data: getarr[index],
        });
      }

      let resultDate = [];
      arrayData.forEach(function (a) {
        if (!this[a.mfg_date]) {
          this[a.mfg_date] = { name: a.mfg_date };
          resultDate.push(this[a.mfg_date]);
        }
      }, Object.create(null));

      let newDate = [];
      for (let index = 0; index < resultDate.length; index++) {
        const item = resultDate[index];
        await newDate.push(item.name);
      }

      // console.log(BallUsage[0]);
      // console.log("==============");
      // console.log(dataset);
      // console.log(resultDate);

      res.json({
        // resultBall: BallUsage[0],
        result_length: resultdata[0].length,
        result: dataset,
        resultDate: newDate,

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

//mc status [non/operating time]
router.post(
  "/mc_by_status/:start_date/:end_date/:selectMc",
  async (req, res) => {
    try {
      let { start_date } = req.params;
      let { end_date } = req.params;
      let { selectMc } = req.params;
      let resultdata = await grinding_table.sequelize.query(
        `  WITH tb1
      AS
      (
      SELECT  
      iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]) as occur_new
  , [registered_at]
   ,[occurred]
   ,[mc_status]
   ,[mc_no]
FROM [counter].[dbo].[data_mcstatus]
   where [mc_no] ='${selectMc}'  
   group by [mc_status],iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred])  , [registered_at]
   ,[occurred]
   ,[mc_status]
   ,[mc_no])
    , tb2  as(   select  [mc_status],format(occur_new,'yyyy-MM-dd')  as newDate ,[occurred],[mc_no]
      FROM tb1
    )
    ,tb3 as (select tb2.[newDate]  as [mfg_date],[mc_no],[mc_status],[occurred]
    from tb2
   )
    ,tb4 as (
        SELECT *
          ,lead([occurred]) over(partition by [mc_no] order by [mc_no],[occurred]) AS [NextTimeStamp]
        FROM tb3 
        where tb3.[mfg_date] between '${start_date}' and '${end_date}'
        )
        ,tb5 as (
    select * ,datediff(MINUTE,occurred,NextTimeStamp) as timediff 
    from tb4 where [NextTimeStamp] is not null
    ) 
    ,run as (
    select mfg_date,[mc_no], sum(timediff) as run_oper
    from tb5 
    where [mc_status] = '1'
    group by mfg_date,[mc_no]
    )
    ,stop as ( select mfg_date,[mc_no], sum(timediff) as stop_oper
    from tb5 
    where [mc_status] = '2'
    group by mfg_date,[mc_no]
    )
    ,alarm as ( select mfg_date,[mc_no], sum(timediff) as alarm_oper
    from tb5 
    where [mc_status] = '3'
    group by mfg_date,[mc_no]
    )
    ,wait as ( select mfg_date,[mc_no], sum(timediff) as wait_oper
    from tb5 
    where [mc_status] = '4'
    group by mfg_date,[mc_no]
    )
    ,full_part as ( select mfg_date,[mc_no], sum(timediff) as full_oper
    from tb5 
    where [mc_status] = '5'
    group by mfg_date,[mc_no]
    )
    select run.mfg_date,run.[mc_no],run_oper,stop_oper,alarm_oper,wait_oper,full_oper
    from run 
    left join stop
    on run.mfg_date = stop.mfg_date
    left join alarm
    on run.mfg_date = alarm.mfg_date
    left join wait
    on run.mfg_date = wait.mfg_date
    left join full_part
    on run.mfg_date = full_part.mfg_date

`
      );

      // console.log(resultdata[0].length);
      arrayData = resultdata[0];
      let name_series = [
        "RUN (1)",
        "STOP (2)",
        "ALARM (3)",
        "WAIT PART (4)",
        "FULL PART (5)",
      ];
      let resultMC_Status = [];
      arrayData.forEach(function (a) {
        if (!this[a.mfg_date]) {
          this[a.mfg_date] = { name: a.mfg_date, data: [] };
          resultMC_Status.push(this[a.mfg_date]);
        }
        this[a.mfg_date].data.push(
          a.run_oper,
          a.stop_oper,
          a.alarm_oper,
          a.wait_oper,
          a.full_oper
          // a.dec_non,
          // a.dec_oper,
        );
      }, Object.create(null));
      // set arr all value
      // console.log("resultMC_Status ====status=====", resultMC_Status);
      let getarr1 = [];
      let getarr2 = [];
      let getarr3 = [];
      let getarr4 = [];
      let getarr5 = [];
      for (let index = 0; index < resultMC_Status.length; index++) {
        const item = resultMC_Status[index];
        await getarr1.push(item.data[0]);
        await getarr2.push(item.data[1]);
        await getarr3.push(item.data[2]);
        await getarr4.push(item.data[3]);
        await getarr5.push(item.data[4]);
      }
      let getarr = [];
      getarr.push(getarr1, getarr2, getarr3, getarr4, getarr5);
      // console.log(getarr);
      //set name ball
      let namemc = [];
      for (let index = 0; index < resultMC_Status.length; index++) {
        const item = resultMC_Status[index];
        await namemc.push(item.name);
      }
      //set arr name,data
      let dataset = [];
      for (let index = 0; index < getarr.length; index++) {
        dataset.push({
          name: name_series[index],
          data: getarr[index],
        });
      }

      let resultDate = [];
      arrayData.forEach(function (a) {
        if (!this[a.mfg_date]) {
          this[a.mfg_date] = { name: a.mfg_date };
          resultDate.push(this[a.mfg_date]);
        }
      }, Object.create(null));

      let newDate = [];
      for (let index = 0; index < resultDate.length; index++) {
        const item = resultDate[index];
        await newDate.push(item.name);
      }

      // console.log(BallUsage[0]);
      // console.log("======status========");
      // console.log(dataset);
      // console.log(newDate);

      res.json({
        resultdata: resultdata,
        result: dataset,
        resultDate: newDate,

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

router.get(
  "/count_mc_status_daily_GD/:start_date/:end_date",
  async (req, res) => {
    let { start_date } = req.params;
    let { end_date } = req.params;
    let { selectMc } = req.params;
    // console.log(selectMc);

    var list_date = [];
    list_date = getDatesInRange(new Date(start_date), new Date(end_date));
    // console.log("list_date", list_date);
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
    // console.log("command_pivot", command_pivot);

    try {
      let resultMMS = await grinding_table.sequelize.query(
        `  WITH tb1 as (Select
    format ( iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') as [mfg_date],
          iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]) as our,
              --COUNT(mc_status) as new_mc_status-- sum(CASE WHEN [mc_status] <> '1' THEN 1 ELSE 0 END) as new_mc_status
              [mc_no]
                
            FROM [counter].[dbo].[data_mcstatus]
            group by [occurred], [mc_no],[mc_status])
    ,tb3 as (	  select [mfg_date],CASE WHEN COUNT([mc_no]) > 1 THEN 1 ELSE 0 END as new_mc_status,[mc_no]
        from tb1
        group by  [mfg_date],[mc_no]
        --order by mc_no asc
        )
    ,tb2
          AS
          ( Select  [mfg_date],new_mc_status,[mc_no]
                
            FROM tb3
            where  [mfg_date] between '${start_date}'and'${end_date}' and mc_no like '%r'-- and [mc_no] in ('TB01','TB02','TB03','TB04','TB05','TB06','TB14','TB15','TB16','TB17','TB18')
        )
          select [mc_no] as name,
          ` +
          command_column +
          ` as data
            from tb2
        PIVOT (sum(new_mc_status)
        FOR [mfg_date] IN (` +
          command_pivot +
          `)
        ) AS pvt
        ORDER BY pvt.[mc_no]
          `
      );

      arrayData_Over = resultMMS[0];
      // console.log(arrayData_Over);
      //   arrayData_Over.forEach(function (data, index) {
      //     arrayData_Over[index].array = (data.array.split(","))
      // })
      // console.log("test", arrayData_Over)
      // ตัด '
      arrayData_Over.forEach(function (data, index) {
        arrayData_Over[index].data = data.data.split(",").map((str) => {
          return +str;
        });
      });

      // console.log("test", arrayData_Over);

      // let resultList_MMS = [];
      // arrayData_Over.forEach(function (a) {
      //   if (!this[a.mc_no]) {
      //     this[a.mc_no] = { name: a.mc_no, data: [] };
      //     resultList_MMS.push(this[a.mc_no]);
      //   }
      //   this[a.mc_no].data.push(a.array);
      // }, Object.create(null));

      // console.log(resultList_MMS);
      // console.log(list_date);
      // console.log(resultList_MMS.data[0]);

      res.json({
        // result: resultList_MMS,
        result_Over: arrayData_Over,
        resultDate: list_date,
      });
    } catch (error) {
      res.json({
        error,
        api_result: constance.result_nok,
      });
    }
  }
);

// master time => hour
router.post("/master_hour/:date", async (req, res) => {
  try {
    let { date } = req.params;
    let Result = await grinding_table.sequelize.query(
      `with tb1 as (SELECT distinct([occurred])
      ,[restored],[mc_no]
      ,IIF(CAST(DATEPART(HOUR, [occurred]) AS int)=0,23,CAST(DATEPART(HOUR, [occurred]) AS int)) as [hour]
      FROM [data_machine_gd].[dbo].[DATA_MCSTATUS_GD]
      where format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') = '${date}' 
      
      )
      select distinct(hour)
      from tb1
      order by hour asc`
    );
    return res.json({ result: Result[0] });
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});

// chart compare topic alarm list per daily
router.post(
  "/compare_alarmlist_daily_GD/:start_date/:end_date/:selectMc",
  async (req, res) => {
    let { start_date } = req.params;
    let { end_date } = req.params;
    let { selectMc } = req.params;
    let { topic } = req.params;
    // console.log(req.body);
    var list_date = [];
    list_date = getDatesInRange(new Date(start_date), new Date(end_date));
    // console.log("list_date", list_date);
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
      let result = await grinding_table.sequelize.query(
        `  with tb1 as (SELECT [registered_at]
        ,format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') AS mfg_date
                ,[topic]
                ,[occurred]
                ,[restored]
                ,[time_diff]
                ,[mc_no]
            FROM [data_machine_gd].[dbo].[DATA_MCSTATUS_GD]
            where format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') between '${start_date}' and '${end_date}' and [mc_no] = '${selectMc}'
          and topic ='${req.body.topic}'
            
          )
            ,final as(
          select mfg_date,[mc_no],[topic],sum([time_diff]) as time_alarm--,convert(varchar,DATEADD(s,(sum([time_diff])),0),8) as Alarm
            from tb1
            group by [topic],mc_no,mfg_date
            --order by mfg_date asc
            --order by sum([time_diff]) desc
          )
          SELECT --mc_no,
          [topic]as name,
          ` +
          command_column +
          ` as data
          FROM final
          PIVOT  
        (  
          sum(time_alarm) 
          FOR mfg_date IN (` +
          command_pivot +
          `)
        )  AS pvt`
      );

      arrayData_Topic = result[0];
      arrayData_Topic.forEach(function (data, index) {
        arrayData_Topic[index].data = data.data.split(",").map((str) => {
          return +str;
        });
      });
      res.json({
        // result: resultList_MMS,
        result: arrayData_Topic,
        resultDate: list_date,
        api_result: constance.result_ok,
      });
    } catch (error) {
      res.json({
        error,
        api_result: constance.result_nok,
      });
    }
  }
);

// chart total time status by M/C daily
router.get(
  "/totaltime_status_daily_GD/:start_date/:end_date/:selectMc/:status",
  async (req, res) => {
    let { start_date } = req.params;
    let { end_date } = req.params;
    let { selectMc } = req.params;
    let { status } = req.params;

    var list_date = [];
    list_date = getDatesInRange(new Date(start_date), new Date(end_date));
    // console.log("list_date", list_date);
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
      let result = await grinding_table.sequelize.query(
        ` WITH tb1
        AS
        (
        SELECT  
        iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]) as occur_new
    , [registered_at]
     ,[occurred]
     ,[mc_status]
     ,[mc_no]
  FROM [counter].[dbo].[data_mcstatus]
     where [mc_no] ='${selectMc}' 
     group by [mc_status],iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred])  , [registered_at]
     ,[occurred]
     ,[mc_status]
     ,[mc_no])
      , tb2  as(   select  [mc_status],format(occur_new,'yyyy-MM-dd')  as newDate ,[occurred],[mc_no]
        FROM tb1
      )
      ,tb3 as (select tb2.[newDate]  as [mfg_date],[mc_no],[mc_status],[occurred]
      from tb2
     )
      ,tb4 as (
          SELECT *
            ,lead([occurred]) over(partition by [mc_no] order by [mc_no],[occurred]) AS [NextTimeStamp]
          FROM tb3 
          where tb3.[mfg_date]  between '${start_date}'  and '${end_date}'
          )
          ,tb5 as (
      select * ,datediff(MINUTE,occurred,NextTimeStamp) as timediff 
      from tb4 where [NextTimeStamp] is not null
     --group by [mfg_date],[mc_no],occurred,NextTimeStamp,[mc_status]
      --order by occurred desc
      ) 
      ,non as (
      select mfg_date,[mc_no], sum(timediff) as sum_time,
      CASE
        WHEN mc_status = '1' THEN 'RUN'       
        WHEN mc_status = '2' THEN 'STOP'
        WHEN mc_status = '3' THEN 'ALARM'
        WHEN mc_status = '4' THEN 'WAIT PART'
        WHEN mc_status = '5' THEN 'FULL PART'
      ELSE 'OTHER' END as status
      from tb5 
      where [mc_status] = '${status}' 
      group by mfg_date,[mc_no],mc_status
      )
      ,final as (select mfg_date,status,[mc_no],sum_time
    from non )
  
    SELECT status as name, 
          ` +
          command_column +
          ` as data
          FROM final
          PIVOT
        (
          sum(sum_time) 
          FOR mfg_date IN (` +
          command_pivot +
          `)
        )  AS pvt`
      );

      arrayData_Topic = result[0];
      arrayData_Topic.forEach(function (data, index) {
        arrayData_Topic[index].data = data.data.split(",").map((str) => {
          return +str;
        });
      });
      res.json({
        // result: resultList_MMS,
        result: arrayData_Topic,
        resultDate: list_date,
        api_result: constance.result_ok,
      });
    } catch (error) {
      res.json({
        error,
        api_result: constance.result_nok,
      });
    }
  }
);

// chart status mc(%)
router.post("/realtime_status_mc/:date", async (req, res) => {
  try {
    // console.log("chart chart chart --->");
    // console.log(req.body);
    let { date } = req.params;
    let Result = await grinding_table.sequelize.query(
      `with tb1 as(SELECT 	 
        [registered_at],
      format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') as mfg_date ,
      LEAD([occurred]) OVER (ORDER BY [occurred] ) AS previous,
      LEAD([occurred]) OVER (ORDER BY [occurred] ASC) - [occurred] AS difference_previous
      ,[occurred]
      ,[mc_status],[mc_no]
      FROM [counter].[dbo].[data_mcstatus]
      where format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd')  = '${date}' and [mc_no] = '${req.body.mc_no}')
          ,tb2 as(select
            [mc_no],[mc_status],
              sum(DATEDIFF(SECOND, '0:00:00', [difference_previous] )) as [sec]
             from tb1
            group by [mc_status],[mc_no])
           ,tb4 as ( 
     select [mc_no],[SEC],
            [mc_status], case
            when [mc_status] = '1' then 'RUN'
            when [mc_status] = '2' then 'STOP'
            when [mc_status] = '3' then 'AL'
            when [mc_status] = '4' then 'WAIT_PART'
            when [mc_status] = '5' then 'FULL_PART'
              end as [status]
            ,convert(varchar,DATEADD(s,[SEC],0),8) as Alarm
            from tb2
            WHERE [SEC] <> '' 
      )
      , final as(select  [mc_no]--,[mc_status]
	  ,status,sum([sec]) as [sec]
      --,FORMAT(DATEADD(ms, SUM(DATEDIFF(ms, '00:00:00.000', Alarm)), '00:00:00.000'),'HH:mm:ss')  as Alarm
      from tb4 
      group by status,[mc_status],[mc_no]
            --order by [mc_status] asc
			)
		SELECT UPPER([mc_no]) as [mc_no]--,[RUN],[STOP],[AL],[WAIT_PART],[FULL_PART]--NULLIF([FULL_PART], 0) as [FULL_PART]
    ,ISNULL([RUN], 0) as [RUN],ISNULL([STOP], 0) as [STOP],ISNULL([AL], 0) as[AL],ISNULL([WAIT_PART], 0) as [WAIT_PART],ISNULL([FULL_PART], 0) as [FULL_PART]
		FROM final
		PIVOT (SUM(sec)
FOR [status] IN ([RUN],[STOP],[AL],[WAIT_PART],[FULL_PART])
) AS pvt
ORDER BY pvt.[mc_no] ASC`
    );
    // console.log(Result[0]);
    arrayData = Result[0];

    let result_MC = [];
    arrayData.forEach(function (a) {
      if (!this[a.mc_no]) {
        this[a.mc_no] = { name: a.mc_no, data: [] };
        result_MC.push(this[a.mc_no]);
      }
      this[a.mc_no].data.push(a.RUN, a.STOP, a.AL, a.WAIT_PART, a.FULL_PART);
    }, Object.create(null));
    // console.log(result_MC);

    let resultMC = [];
    arrayData.forEach(function (a) {
      if (!this[a.mc_no]) {
        this[a.mc_no] = { name: a.mc_no };
        resultMC.push(this[a.mc_no]);
      }
    }, Object.create(null));
    // console.log("resultMC",resultMC);
    let getarr1 = [];
    let getarr2 = [];
    let getarr3 = [];
    let getarr4 = [];
    let getarr5 = [];
    for (let index = 0; index < result_MC.length; index++) {
      const item = result_MC[index];
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
    let result_Status_Daily = [];
    let name_status = ["RUN", "STOP", "ALARM", "WAIT PART", "FULL PART"];
    for (let index = 0; index < getarr.length; index++) {
      result_Status_Daily.push({
        name: name_status[index],
        data: getarr[index],
      });
    }
    // console.log("======== result_Status_Daily ========", name_status);
    // console.log(result_Status_Daily);

    let newArr_MC = [];
    for (let index = 0; index < resultMC.length; index++) {
      const item = resultMC[index];
      await newArr_MC.push(item.name);
    }
    return res.json({
      result: Result[0],
      resultStatus: result_Status_Daily,
      resultDateBall: newArr_MC,
      api_result: constance.result_ok,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});

// Table status mc(%)
router.get("/realtime_status_mc_table/:date", async (req, res) => {
  try {
    let { date } = req.params;
    let Result = await grinding_table.sequelize.query(
      ` -- ////////  TABLE Status UTL %
      with tb1 as(SELECT 	
        [registered_at],
      format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') as mfg_date ,
      LEAD([occurred]) OVER (ORDER BY [occurred] ) AS previous,
      LEAD([occurred]) OVER (ORDER BY [occurred] ASC) - [occurred] AS difference_previous
      ,[occurred]
      ,[mc_status],[mc_no]
      FROM [counter].[dbo].[data_mcstatus]
      where format (iif(DATEPART(HOUR, [occurred])<7,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd')  = '${date}')-- and [mc_no] = 'ic01b'
          ,tb2 as(select
            [mc_no],[mc_status],
              sum(DATEDIFF(SECOND, '0:00:00', [difference_previous] )) as [sec]
             from tb1
            group by [mc_status],[mc_no])
           ,tb4 as ( 
     select [mc_no],[SEC],
            [mc_status], case
            when [mc_status] = '1' then 'RUN'
            when [mc_status] = '2' then 'STOP'
            when [mc_status] = '3' then 'AL'
            when [mc_status] = '4' then 'WAIT_PART'
            when [mc_status] = '5' then 'FULL_PART'
              end as [status]
            ,convert(varchar,DATEADD(s,[SEC],0),8) as Alarm
            from tb2
            WHERE [SEC] <> '' 
      )
      , final as(select  [mc_no]--,[mc_status]
	  ,status,sum([sec]) as [sec]
      --,FORMAT(DATEADD(ms, SUM(DATEDIFF(ms, '00:00:00.000', Alarm)), '00:00:00.000'),'HH:mm:ss')  as Alarm
      from tb4 
      group by status,[mc_status],[mc_no]
            --order by [mc_status] asc
			)
      ,percent_utl as (
		SELECT UPPER([mc_no]) as [mc_no],[RUN]+[STOP]+[AL]+[WAIT_PART]+[FULL_PART] as sum_all--,[RUN],[STOP],[AL],[WAIT_PART],[FULL_PART]--NULLIF([FULL_PART], 0) as [FULL_PART]
    ,ISNULL([RUN], 0) as [RUN],ISNULL([STOP], 0) as [STOP],ISNULL([AL], 0) as[AL],ISNULL([WAIT_PART], 0) as [WAIT_PART],ISNULL([FULL_PART], 0) as [FULL_PART]
		FROM final
		PIVOT (SUM(sec)
FOR [status] IN ([RUN],[STOP],[AL],[WAIT_PART],[FULL_PART])
) AS pvt
      )
, sum_utl as (SELECT [mc_no],[RUN]+[STOP]+[AL]+[WAIT_PART]+[FULL_PART] as sum_all,[RUN] as [RUNs],[STOP] as [STOPs],[AL] as [ALs],[WAIT_PART] as [WAIT_PARTs],[FULL_PART] as [FULL_PARTs]
  ,sum(isnull([RUN],0))
            + isnull([STOP],0)
            + isnull([AL],0)
            + isnull([WAIT_PART],0)
            + isnull([FULL_PART],0) as countt
  FROM percent_utl
  group by [mc_no],[RUN],[STOP],[AL],[WAIT_PART],[FULL_PART])
  SELECT [mc_no],[sum_all],countt,cast(([RUNs]/iif([countt] = 0,1, [countt]*1.0))*100 as decimal(10,2)) AS [RUN]--,[RUNs]/iif([countt] = 0,1, [countt]*1.0) as [RUN]
  ,cast(([STOPs]/iif([countt] = 0,1, [countt]*1.0))*100 as decimal(10,2)) AS [STOP],cast(([ALs]/iif([countt] = 0,1, [countt]*1.0))*100 as decimal(10,2)) AS [ALARM]
  ,cast(([WAIT_PARTs]/iif([countt] = 0,1, [countt]*1.0))*100 as decimal(10,2)) AS [WAIT_PART]
  ,cast(([FULL_PARTs]/iif([countt] = 0,1, [countt]*1.0))*100 as decimal(10,2)) AS [FULL_PART]
  
  FROM sum_utl`
    );

    // console.log(newArr_MC);
    return res.json({
      result: Result[0],
      api_result: constance.result_ok,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});

// Get data GD -- yield
router.post("/get_yr_each/:date/:mc", async (req, res) => {
  // console.log(req.body);
  let { date } = req.params;
  let { mc } = req.params;
  try {
    let Result = await grinding_table.sequelize.query(
      `SELECT TOP (1) FORMAT([registered_at], 'HH:mm') as time
      ,[mc_no]
      ,[eachct]/100 as [each_ct]
      ,[yieldrt]/10 [yield_rate]
      FROM [data_machine_gd].[dbo].[DATA_PRODUCTION_GD]
      WHERE [mc_no] = '${mc}' and FORMAT([registered_at], 'yyyy-MM-dd') = '${date}'
      order by registered_at desc`
    );
    // console.log("+++++++++++ get_yr_each +++++++++++");
    // console.log(Result);
    return res.json({
      result: Result[0],
      api_result: constance.result_ok,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});

// mms GD - Yield
router.post("/get_data_mms_mc_all/:date/:mc", async (req, res) => {
  let { date } = req.params;
  let { mc } = req.params;
  try {
    let Result = await grinding_table.sequelize.query(
      `SELECT TOP (1) *
    FROM [data_machine_gd].[dbo].[DATA_PRODUCTION_GD]
    WHERE [mc_no] = '${mc}' and FORMAT([registered_at], 'yyyy-MM-dd') = '${date}'
    order by registered_at desc`
    );
    // console.log("+++++++++++ get_data_mms_mc_all +++++++++++");
    // console.log(Result);
    return res.json({
      result: Result[0],
      api_result: constance.result_ok,
    });
  } catch (error) {
    // console.log(error);
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});

// chart product / Yield All MD
router.post("/MMS_prod_IC_GD/:mc_no/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    let { mc_no } = req.params;
    console.log("mc_nomc_nomc_nomc_nomc_nomc_no", mc_no, start_date);
    // console.log(mc_no);
    // console.log("click PT", start_date);
    let resultdata = await grinding_table.sequelize.query(` 
    -- chart PD
    SELECT [registered_at], convert(varchar, [registered_at], 8) as time
    ,format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as mfg_date
    ,[mc_no],[process],[d_str1],[d_str2],[rssi],[avgct],[eachct],[yieldrt],[idl]
    ,[ng_p],[ng_n],[tng],[prod_total],[utilization],[utl_total],[prod_s1],[prod_s2],[prod_s3],[cth1],[cth2],[idh1],[idh2]
    FROM [data_machine_gd].[dbo].[DATA_PRODUCTION_GD]
    where mc_no = '${mc_no}' and format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') =  '${start_date}' 
    order by registered_at asc
    `);

    let result_prod_sh = await grinding_table.sequelize.query(`
    SELECT
    CASE
    WHEN DATEPART(HOUR,registered_at) = '15' THEN 'A'
    WHEN DATEPART(HOUR,registered_at) = '23' THEN 'B'
    WHEN DATEPART(HOUR,registered_at) = '7' THEN 'C'
  ELSE 'other' END AS shift,
    SUM(prod_total) AS total_prod
   FROM [data_machine_gd].[dbo].[DATA_PRODUCTION_GD]
  where mc_no = '${mc_no}' and format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') =  '${start_date}' 
      
  GROUP BY
    CASE
    WHEN DATEPART(HOUR,registered_at) = '15' THEN 'A'
    WHEN DATEPART(HOUR,registered_at) = '23' THEN 'B'
    WHEN DATEPART(HOUR,registered_at) = '7' THEN 'C'
  ELSE 'other' END 
  ORDER BY shift;`);
    // console.log(resultdata[0]);
    arrayData = resultdata[0];
    arrayData_yield = resultdata[0];
    let seriesOutput = [];
    // let seriesUTL = [];

    const firstData = {
      registered_at: "2023-06-16T06:00:00.183Z",
      mfg_date: "2023-06-15",
      mc_no: "ab",
      model: "a",
      prod_total: 0,
    };
    const index_data = arrayData[0].prod_total;
    // console.log("iii",index_data);
    await seriesOutput.push(index_data);
    // console.log("arrayData",arrayData.unshift(firstData));
    for (let i = 0; i < arrayData.length - 1; i++) {
      // console.log((i+1).toString() + " : " + (arrayData[i+1].dairy_ok - arrayData[i].dairy_ok).toString())
      await seriesOutput.push(
        // (arrayData[i+1].dairy_ok - arrayData[i].dairy_ok).toString()
        (arrayData[i + 1].prod_total - arrayData[i].prod_total).toString() < 0
          ? 0
          : (arrayData[i + 1].prod_total - arrayData[i].prod_total).toString()
      );
      // await seriesUTL.push((((arrayData[i+1].dairy_ok - arrayData[i].dairy_ok)/arrayData[i].target_utl)*100).toString());
      // seriesUTL = (
      //   ((arrayData[i + 1].prod_total - arrayData[i].prod_total) /
      //     arrayData[i].target_utl) *
      //   100
      // ).toString();
    }
    // console.log("seriesOutput", seriesOutput);
    let seriesTarget = [
      1440, 1440, 1440, 1440, 1440, 1440, 1440, 1440, 1440, 1440, 1440, 1440,
      1440, 1440, 1440, 1440, 1440, 1440, 1440, 1440, 1440, 1440, 1440, 1440,
    ];
    let seriesYield = [];

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

    let seriesNew = [seriesOutput_new, seriesYieldrate_new];
    // console.log("=========== resultdata[0] ===========", result_prod_sh[0]);
    res.json({
      resultOutput: seriesNew,
      result_PD: seriesOutput,
      result: resultdata, // chart PD
      result_prod_sh: result_prod_sh[0],
    });
    // console.log("lllll", resultOutput);
  } catch (error) {
    // res.json({
    //   result: error,
    //   api_result: constance.result_nok,
    // });
  }
});

// chart PIE ==> alarm liat
router.post("/data_pie_Alarmlist_GD", async (req, res) => {
  try {
    let result = await grinding_table.sequelize.query(
      ` -- CHART PIE ALARMLIST
    WITH tb1 AS (SELECT
     UPPER([mc_no]) AS [mc_no],[occurred], LEAD([occurred]) OVER (ORDER BY [occurred] ) AS restored
     ,REPLACE([alarm], '_', '') AS [alarm] --[alarm]
     ,DATEDIFF(SECOND,[occurred], LEAD([occurred]) OVER (ORDER BY [occurred] )) AS time_diff
   FROM [data_machine_gd].[dbo].[DATA_ALARMLIS_GD]
   WHERE
     mc_no = '${req.body.machine}'
     AND FORMAT(
       IIF(DATEPART(HOUR, [occurred]) < 8, DATEADD(DAY, -1, [occurred]), [occurred]),
       'yyyy-MM-dd'
     ) = '${req.body.date}'
  -- GROUP BY[alarm],[mc_no]
  )
  SELECT mc_no,alarm,
     SUM([time_diff]) AS sumtime,
     ROW_NUMBER() OVER (ORDER BY SUM([time_diff]) DESC) AS rnk
  FROM tb1 
  GROUP BY mc_no,alarm
  ORDER BY rnk asc`
    );
    // console.log("JJJJJJJJJJJJJ");
    // console.log(req.body.machine, " >> ", result[0]);
    return res.json({ result: result[0] });
  } catch (error) {
    res.json({
      result: error,
      api_result: constance.result_nok,
    });
  }
});

// table total mornitor mc
router.post("/gd_mornitoring_all/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    console.log(req.body, start_date, moment().format("yyyy-MM-DD"));
    const hour = parseInt(moment().format("HH"), 10);

    if (start_date === moment().format("yyyy-MM-DD")) {
      let mc = ["B", "R", "H"];
      let results = {};
      console.log("ok");
      for (let i = 0; i < mc.length; i++) {
        let result = await grinding_table.sequelize.query(`
      -- today === moment
      WITH result AS (SELECT registered_at,mc_no,
        MAX(CASE WHEN RN = 1 THEN format(registered_at,'HH:mm:ss') ELSE NULL END) time
        ,MAX(CASE WHEN RN = 1 THEN eachct ELSE NULL END) ect_B_R
        ,MAX(CASE WHEN RN = 1 THEN idl ELSE NULL END) idle_time_B_R
        ,MAX(CASE WHEN RN = 1 THEN avgct ELSE NULL END) avg_ct_B_H
        ,MAX(CASE WHEN RN = 1 THEN prod_total ELSE NULL END) prod_total_B_R_H
        ,MAX(CASE WHEN RN = 1 THEN yieldrt ELSE NULL END) yr_B
        ,MAX(CASE WHEN RN = 1 THEN utilization ELSE NULL END) utl
        ,MAX(CASE WHEN RN = 1 THEN [utl_total] ELSE NULL END) utlH
        ,MAX(CASE WHEN RN = 1 THEN cth1 ELSE NULL END) ect1_H
        ,MAX(CASE WHEN RN = 1 THEN cth2 ELSE NULL END) ect2_H
        ,MAX(CASE WHEN RN = 1 THEN idh1 ELSE NULL END) idle_time1_H
        ,MAX(CASE WHEN RN = 1 THEN idh2 ELSE NULL END) idle_time2_H
        ,MAX(CASE WHEN RN = 1 THEN yield_ok ELSE NULL END) yield_ok
        ,MAX(CASE WHEN RN = 1 THEN yield_ng_pos ELSE NULL END) yield_ng_pos
        ,MAX(CASE WHEN RN = 1 THEN yield_ng_neg ELSE NULL END) yield_ng_neg
     FROM (
     SELECT format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date],
     registered_at,UPPER([mc_no]) AS [mc_no],[process],[d_str1],[d_str2],[rssi],[avgct],[eachct],[yieldrt],[idl],[ng_p],[ng_n],[tng]
    ,[prod_total],[utilization],[utl_total],[prod_s1],[prod_s2],[prod_s3],[cth1],[cth2],[idh1],[idh2]
    ,[yield_ok],[yield_ng_pos],[yield_ng_neg]
     ,ROW_NUMBER() OVER (PARTITION BY [mc_no] ORDER BY [registered_at] DESC) RN
   FROM [data_machine_gd].[dbo].[DATA_PRODUCTION_GD]
   where format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') = '${start_date}'
   AND mc_no LIKE '%${mc[i]}'
   --order by registered_at desc,mc_no asc
   ) t1
       GROUP BY registered_at,[mc_no],eachct,idl,avgct,prod_total,yieldrt,utilization,cth1,cth2,idh1,idh2,[yield_ok],[yield_ng_pos],[yield_ng_neg],[utl_total]
       )
     SELECT registered_at,mc_no,time,ect_B_R,idle_time_B_R,avg_ct_B_H, prod_total_B_R_H,yr_B,utl,utlH
     ,ect1_H,ect2_H,idle_time1_H,idle_time2_H,CONVERT(char(5), time, 108) as at_time, format(registered_at,'yyyy-MM-dd HH:mm') AS now_date
    ,[yield_ok],[yield_ng_pos],[yield_ng_neg]
    FROM result
       where time IS NOT NULL
       order by mc_no asc
 
      `);
        const data1 = result[0];
        results[mc[i]] = result; // เก็บผลลัพธ์ในแต่ละรอบใน results object
      }

      res.json({
        result: results,
        api_result: constance.result_ok,
      });
    } else {
      console.log("yesterday");
      let mc = ["B", "R", "H"];
      let results = {};
      // console.log("Yesterday");
      for (let i = 0; i < mc.length; i++) {
        let result = await grinding_table.sequelize.query(`
      -- Yesterday
      WITH result AS (SELECT registered_at,mc_no,
        MAX(CASE WHEN RN = 1 THEN format(registered_at,'HH:mm:ss') ELSE NULL END) time
        ,MAX(CASE WHEN RN = 1 THEN eachct ELSE NULL END) ect_B_R
        ,MAX(CASE WHEN RN = 1 THEN idl ELSE NULL END) idle_time_B_R
        ,MAX(CASE WHEN RN = 1 THEN avgct ELSE NULL END) avg_ct_B_H
        ,MAX(CASE WHEN RN = 1 THEN prod_total ELSE NULL END) prod_total_B_R_H
        ,MAX(CASE WHEN RN = 1 THEN yieldrt ELSE NULL END) yr_B
        ,MAX(CASE WHEN RN = 1 THEN utilization ELSE NULL END) utl
        ,MAX(CASE WHEN RN = 1 THEN cth1 ELSE NULL END) ect1_H
        ,MAX(CASE WHEN RN = 1 THEN cth2 ELSE NULL END) ect2_H
        ,MAX(CASE WHEN RN = 1 THEN idh1 ELSE NULL END) idle_time1_H
        ,MAX(CASE WHEN RN = 1 THEN idh2 ELSE NULL END) idle_time2_H
        ,MAX(CASE WHEN RN = 1 THEN yield_ok ELSE NULL END) yield_ok
        ,MAX(CASE WHEN RN = 1 THEN yield_ng_pos ELSE NULL END) yield_ng_pos
        ,MAX(CASE WHEN RN = 1 THEN yield_ng_neg ELSE NULL END) yield_ng_neg
     FROM (
     SELECT format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') as [mfg_date],
     registered_at,UPPER([mc_no]) AS [mc_no],[process],[d_str1],[d_str2],[rssi],[avgct],[eachct],[yieldrt],[idl],[ng_p],[ng_n],[tng]
    ,[prod_total],[utilization],[utl_total],[prod_s1],[prod_s2],[prod_s3],[cth1],[cth2],[idh1],[idh2]
     ,ROW_NUMBER() OVER (PARTITION BY [mc_no] ORDER BY [registered_at] DESC) RN
    ,[yield_ok],[yield_ng_pos],[yield_ng_neg]
    FROM [data_machine_gd].[dbo].[DATA_PRODUCTION_GD]
   where format(iif(DATEPART(HOUR, [registered_at]) < 8, dateadd(day, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') = '${start_date}'
   AND mc_no LIKE '%${mc[i]}' AND DATEPART(HOUR, registered_at) = 7
   ) t1
       GROUP BY registered_at,[mc_no],eachct,idl,avgct,prod_total,yieldrt,utilization,cth1,cth2,idh1,idh2
       )
     SELECT *,CONVERT(char(5), time, 108) as at_time, format(registered_at,'yyyy-MM-dd HH:mm') AS now_date
     FROM result
       where time IS NOT NULL
       order by mc_no asc
 
      `);
        // SUM Prod
        results[mc[i]] = result; // เก็บผลลัพธ์ในแต่ละรอบใน results object
      // console.log(results[mc[i]]);
    }

      res.json({
        result: results,
        api_result: constance.result_ok,
      });
    }
    // console.log("หยุด");
  } catch (error) {
    res.json({
      result: error,
      api_result: constance.result_nok,
    });
  }
});

// new database ::: table total mornitor mc
router.post("/gd_mornitoring_all_new/:start_date", async (req, res) => {
  try {
    let { start_date } = req.params;
    console.log(req.body, start_date, moment().format("yyyy-MM-DD"));
    const hour = parseInt(moment().format("HH"), 10);

    if (start_date === moment().format("yyyy-MM-DD")) {
      let mc = ["B", "R", "H"];
      let results = {};
      console.log("ok");
      for (let i = 0; i < mc.length; i++) {
        let result = await grinding_table.sequelize.query(`
        -- today === moment
        WITH result AS (SELECT [registered],mc_no,
          MAX(CASE WHEN RN = 1 THEN format([registered],'HH:mm:ss') ELSE NULL END) time
          ,MAX(CASE WHEN RN = 1 THEN eachct ELSE NULL END) ect_B_R
          ,MAX(CASE WHEN RN = 1 THEN idl ELSE NULL END) idle_time_B_R
          ,MAX(CASE WHEN RN = 1 THEN avgct ELSE NULL END) avg_ct_B_H
          ,MAX(CASE WHEN RN = 1 THEN prod_total ELSE NULL END) prod_total_B_R_H
          ,MAX(CASE WHEN RN = 1 THEN yieldrt ELSE NULL END) yr_B
          ,MAX(CASE WHEN RN = 1 THEN utilization ELSE NULL END) utl
          ,MAX(CASE WHEN RN = 1 THEN [utl_total] ELSE NULL END) utlH
          ,MAX(CASE WHEN RN = 1 THEN cth1 ELSE NULL END) ect1_H
          ,MAX(CASE WHEN RN = 1 THEN cth2 ELSE NULL END) ect2_H
          ,MAX(CASE WHEN RN = 1 THEN idh1 ELSE NULL END) idle_time1_H
          ,MAX(CASE WHEN RN = 1 THEN idh2 ELSE NULL END) idle_time2_H
          ,MAX(CASE WHEN RN = 1 THEN yield_ok ELSE NULL END) yield_ok
          ,MAX(CASE WHEN RN = 1 THEN yield_ng_pos ELSE NULL END) yield_ng_pos
          ,MAX(CASE WHEN RN = 1 THEN yield_ng_neg ELSE NULL END) yield_ng_neg
          ,MAX(CASE WHEN RN = 1 THEN [time_full] ELSE NULL END) [time_full]
          ,MAX(CASE WHEN RN = 1 THEN [time_full1] ELSE NULL END) [time_full1]
          ,MAX(CASE WHEN RN = 1 THEN [time_wait] ELSE NULL END) [time_wait]
          ,MAX(CASE WHEN RN = 1 THEN [time_wait1] ELSE NULL END) [time_wait1]
          ,MAX(CASE WHEN RN = 1 THEN [time_alarm] ELSE NULL END) [time_alarm]
          ,MAX(CASE WHEN RN = 1 THEN [time_alarm1] ELSE NULL END) [time_alarm1]
          ,MAX(CASE WHEN RN = 1 THEN [time_worn] ELSE NULL END) [time_worn]
          ,MAX(CASE WHEN RN = 1 THEN [time_worn1] ELSE NULL END) [time_worn1]
          ,MAX(CASE WHEN RN = 1 THEN [time_warm] ELSE NULL END) [time_warm]
          ,MAX(CASE WHEN RN = 1 THEN [time_warm1] ELSE NULL END) [time_warm1]
          ,MAX(CASE WHEN RN = 1 THEN [time_dress] ELSE NULL END) [time_dress]
          ,MAX(CASE WHEN RN = 1 THEN [time_dress1] ELSE NULL END) [time_dress1]
          ,MAX(CASE WHEN RN = 1 THEN [time_other] ELSE NULL END) [time_other]
          ,MAX(CASE WHEN RN = 1 THEN [time_other1] ELSE NULL END) [time_other1]
          ,MAX(CASE WHEN RN = 1 THEN [time_run1] ELSE NULL END) [time_run1]
          ,MAX(CASE WHEN RN = 1 THEN [time_run] ELSE NULL END) [time_run]
       FROM (
       SELECT format(iif(DATEPART(HOUR, [registered]) < 8, dateadd(day, -1, [registered]), [registered]), 'yyyy-MM-dd') as [mfg_date],
       [registered],UPPER([mc_no]) AS [mc_no],[process],[rssi],[avgct],[eachct],[yieldrt],[idl],[ng_p],[ng_n],[tng]
      ,[prod_total],[utilization],[utl_total],[prod_s1],[prod_s2],[prod_s3],[cth1],[cth2],[idh1],[idh2]
      ,[yield_ok],[yield_ng_pos],[yield_ng_neg],[time_run1],[time_run],[time_full],[time_full1],[time_wait],[time_wait1],[time_alarm],[time_alarm1],[time_worn],[time_worn1],[time_warm],[time_warm1],[time_dress],[time_dress1],[time_other],[time_other1]
       ,ROW_NUMBER() OVER (PARTITION BY [mc_no] ORDER BY [registered] DESC) RN
     FROM [data_machine_gd2].[dbo].[DATA_PRODUCTION_GD]
     where format(iif(DATEPART(HOUR, [registered]) < 8, dateadd(day, -1, [registered]), [registered]), 'yyyy-MM-dd') = '${start_date}'
     AND mc_no LIKE '%${mc[i]}'
     --order by registered_at desc,mc_no asc
     ) t1
         GROUP BY [registered],[mc_no],eachct,idl,avgct,prod_total,yieldrt,utilization,cth1,cth2,idh1,idh2,[yield_ok],[yield_ng_pos],[yield_ng_neg],[utl_total]
        ,[time_run1],[time_run],[time_full],[time_full1],[time_wait],[time_wait1],[time_alarm],[time_alarm1],[time_worn],[time_worn1],[time_warm],[time_warm1],[time_dress],[time_dress1],[time_other],[time_other1]
         )
       SELECT [registered],mc_no,time,ect_B_R,idle_time_B_R,avg_ct_B_H, prod_total_B_R_H,yr_B,utl,utlH
       ,ect1_H,ect2_H,idle_time1_H,idle_time2_H,CONVERT(char(5), time, 108) as at_time, format([registered],'yyyy-MM-dd HH:mm') AS now_date
      ,[yield_ok],[yield_ng_pos],[yield_ng_neg],[time_run1],[time_run],[time_full],[time_full1],[time_wait],[time_wait1],[time_alarm],[time_alarm1],[time_worn],[time_worn1],[time_warm],[time_warm1],[time_dress],[time_dress1],[time_other],[time_other1]
      FROM result
         where time IS NOT NULL
         order by mc_no asc
 
      `);
        const data1 = result[0];
        results[mc[i]] = result; // เก็บผลลัพธ์ในแต่ละรอบใน results object
      }

      res.json({
        result: results,
        api_result: constance.result_ok,
      });
    } else {
      console.log("yesterday");
      let mc = ["B", "R", "H"];
      let results = {};
      // console.log("Yesterday");
      for (let i = 0; i < mc.length; i++) {
        let result = await grinding_table.sequelize.query(` -- Yesterday
        WITH result AS (SELECT [registered],mc_no,
          MAX(CASE WHEN RN = 1 THEN format([registered],'HH:mm:ss') ELSE NULL END) time
          ,MAX(CASE WHEN RN = 1 THEN eachct ELSE NULL END) ect_B_R
          ,MAX(CASE WHEN RN = 1 THEN idl ELSE NULL END) idle_time_B_R
          ,MAX(CASE WHEN RN = 1 THEN avgct ELSE NULL END) avg_ct_B_H
          ,MAX(CASE WHEN RN = 1 THEN prod_total ELSE NULL END) prod_total_B_R_H
          ,MAX(CASE WHEN RN = 1 THEN yieldrt ELSE NULL END) yr_B
          ,MAX(CASE WHEN RN = 1 THEN utilization ELSE NULL END) utl
          ,MAX(CASE WHEN RN = 1 THEN cth1 ELSE NULL END) ect1_H
          ,MAX(CASE WHEN RN = 1 THEN cth2 ELSE NULL END) ect2_H
          ,MAX(CASE WHEN RN = 1 THEN idh1 ELSE NULL END) idle_time1_H
          ,MAX(CASE WHEN RN = 1 THEN idh2 ELSE NULL END) idle_time2_H
          ,MAX(CASE WHEN RN = 1 THEN yield_ok ELSE NULL END) yield_ok
          ,MAX(CASE WHEN RN = 1 THEN yield_ng_pos ELSE NULL END) yield_ng_pos
          ,MAX(CASE WHEN RN = 1 THEN yield_ng_neg ELSE NULL END) yield_ng_neg
          ,MAX(CASE WHEN RN = 1 THEN [time_full] ELSE NULL END) [time_full]
          ,MAX(CASE WHEN RN = 1 THEN [time_full1] ELSE NULL END) [time_full1]
          ,MAX(CASE WHEN RN = 1 THEN [time_wait] ELSE NULL END) [time_wait]
          ,MAX(CASE WHEN RN = 1 THEN [time_wait1] ELSE NULL END) [time_wait1]
          ,MAX(CASE WHEN RN = 1 THEN [time_alarm] ELSE NULL END) [time_alarm]
          ,MAX(CASE WHEN RN = 1 THEN [time_alarm1] ELSE NULL END) [time_alarm1]
          ,MAX(CASE WHEN RN = 1 THEN [time_worn] ELSE NULL END) [time_worn]
          ,MAX(CASE WHEN RN = 1 THEN [time_worn1] ELSE NULL END) [time_worn1]
          ,MAX(CASE WHEN RN = 1 THEN [time_warm] ELSE NULL END) [time_warm]
          ,MAX(CASE WHEN RN = 1 THEN [time_warm1] ELSE NULL END) [time_warm1]
          ,MAX(CASE WHEN RN = 1 THEN [time_dress] ELSE NULL END) [time_dress]
          ,MAX(CASE WHEN RN = 1 THEN [time_dress1] ELSE NULL END) [time_dress1]
          ,MAX(CASE WHEN RN = 1 THEN [time_other] ELSE NULL END) [time_other]
          ,MAX(CASE WHEN RN = 1 THEN [time_other1] ELSE NULL END) [time_other1]
          ,MAX(CASE WHEN RN = 1 THEN [time_run1] ELSE NULL END) [time_run1]
          ,MAX(CASE WHEN RN = 1 THEN [time_run] ELSE NULL END) [time_run]
       FROM (
       SELECT format(iif(DATEPART(HOUR, [registered]) < 8, dateadd(day, -1, [registered]), [registered]), 'yyyy-MM-dd') as [mfg_date],
       [registered],UPPER([mc_no]) AS [mc_no],[process],[rssi],[avgct],[eachct],[yieldrt],[idl],[ng_p],[ng_n],[tng]
      ,[prod_total],[utilization],[utl_total],[prod_s1],[prod_s2],[prod_s3],[cth1],[cth2],[idh1],[idh2]
       ,ROW_NUMBER() OVER (PARTITION BY [mc_no] ORDER BY [registered] DESC) RN
      ,[yield_ok],[yield_ng_pos],[yield_ng_neg],[time_run],[time_run1],[time_full],[time_full1],[time_wait],[time_wait1],[time_alarm],[time_alarm1],[time_worn],[time_worn1],[time_warm],[time_warm1],[time_dress],[time_dress1],[time_other],[time_other1]
      FROM [data_machine_gd2].[dbo].[DATA_PRODUCTION_GD]
     where format(iif(DATEPART(HOUR, [registered]) < 8, dateadd(day, -1, [registered]), [registered]), 'yyyy-MM-dd') = '${start_date}'
     AND mc_no LIKE '%${mc[i]}' AND DATEPART(HOUR, [registered]) = 7
     ) t1
         GROUP BY [registered],[mc_no],eachct,idl,avgct,prod_total,yieldrt,utilization,cth1,cth2,idh1,idh2,[time_run],[time_run1],[time_full],[time_full1],[time_wait],[time_wait1],[time_alarm],[time_alarm1],[time_worn],[time_worn1],[time_warm],[time_warm1],[time_dress],[time_dress1],[time_other],[time_other1]
         )
       SELECT *,CONVERT(char(5), time, 108) as at_time, format([registered],'yyyy-MM-dd HH:mm') AS now_date
       FROM result
         where time IS NOT NULL
         order by mc_no asc
 
      `);
        // SUM Prod
        results[mc[i]] = result; // เก็บผลลัพธ์ในแต่ละรอบใน results object
      // console.log(results[mc[i]]);
    }

      res.json({
        result: results,
        api_result: constance.result_ok,
      });
    }
    // console.log("หยุด");
  } catch (error) {
    res.json({
      result: error,
      api_result: constance.result_nok,
    });
  }
});

module.exports = router;
