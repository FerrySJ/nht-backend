const express = require("express");
const router = express.Router();
const constance = require("../constance/constance");
// import model
const grinding_table = require("../model/model_natMBR");

// for backup data grinding
router.post("/bak_prod_gd", async (req, res) => {
  try {
    let result = await grinding_table.sequelize.query(
      ` SELECT *
      FROM (
        SELECT FORMAT(IIF(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') AS mfg_date,format(registered_at,'yyyy-MM-dd HH:mm:ss') AS registered_at
          ,UPPER([mc_no]) AS mc_no,[process],[d_str1],[d_str2],[rssi],[avgct],[eachct]
          ,[yieldrt],[idl],[ng_p],[ng_n],[tng],[prod_total],[utilization],[utl_total],[prod_s1]
          ,[prod_s2],[prod_s3],[cth1],[cth2],[idh1],[idh2],[yield_ok],[yield_ng_pos],[yield_ng_neg]
            ,ROW_NUMBER() OVER (PARTITION BY mc_no ORDER BY registered_at DESC) AS row_num
        FROM [data_machine_gd].[dbo].[DATA_PRODUCTION_GD]
              WHERE FORMAT(IIF(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') =  '${req.body.date}'
      ) AS subquery
      WHERE row_num = 1
      ORDER BY mc_no;
      `
    );

    return res.json({
      result: result[0],
      api_result: constance.result_ok,
    });
  } catch (error) {
    console.log("*****error********bak prod GD*******");
    console.log(error);
    res.json({
      result: error,
      api_result: constance.result_nok,
    });
  }
});

router.post("/bak_status_gd", async (req, res) => {
  try {
    let result = await grinding_table.sequelize.query(
      `WITH StatusDuration AS (
        SELECT FORMAT(IIF(DATEPART(HOUR, [occurred])<8,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') AS mfg_date,occurred,mc_status,mc_no,process,
          LEAD(occurred) OVER (PARTITION BY mc_no ORDER BY occurred) AS next_occurred
        FROM [data_machine_gd2].[dbo].[DATA_MCSTATUS_GD]
        WHERE  FORMAT(IIF(DATEPART(HOUR, [occurred])<8,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') = '${req.body.date}'
      )
      SELECT mfg_date,mc_no,mc_status,process,SUM(DATEDIFF(SECOND, occurred, next_occurred)) AS status_duration_seconds
      FROM StatusDuration
      WHERE next_occurred IS NOT NULL  -- ไม่รวมแถวสุดท้ายที่ไม่มีเวลาถัดไป
      GROUP BY mc_no,mc_status,process,mfg_date
      ORDER BY mc_no, mc_status;
      `

  //     `
  //     WITH DistinctStatus AS (
  //     SELECT 
  //         occurred,
  //         mc_status,
  //         mc_no,
  //         process,
  //         ROW_NUMBER() OVER (PARTITION BY mc_no, mc_status,occurred ORDER BY occurred) AS rn
      
  //         FROM [data_machine_gd2].[dbo].[DATA_MCSTATUS_GD]
  //         WHERE  FORMAT(IIF(DATEPART(HOUR, [occurred])<8,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') = '2024-11-09'
  // ),
  // StatusDuration AS (
  //     SELECT 
  //         occurred,
  //         mc_status,
  //         mc_no,
  //         process,
  //         LEAD(occurred) OVER (PARTITION BY mc_no ORDER BY occurred) AS next_occurred
  //     FROM DistinctStatus
  //     WHERE rn = 1 -- เลือกเฉพาะแถวแรกของแต่ละ mc_status ที่มีเวลา occurred ไม่ซ้ำกัน
  // )
  // SELECT 
  //     mc_no,
  //     mc_status,
  //     process,
  //     SUM(DATEDIFF(SECOND, occurred, next_occurred)) AS status_duration_seconds
  // FROM 
  //     StatusDuration
  // WHERE 
  //     next_occurred IS NOT NULL -- ไม่รวมแถวสุดท้ายที่ไม่มีเวลาถัดไป
  // GROUP BY 
  //     mc_no,
  //     mc_status,
  //     process
  // ORDER BY 
  //     mc_no, mc_status;
  // `

    );
    
    return res.json({
      result: result[0],
      api_result: constance.result_ok,
    });
  } catch (error) {
    console.log("*******master*****error********status GD*******");
    console.log(error);
    res.json({
      result: error,
      api_result: constance.result_nok,
    });
  }
});

router.post("/bak_alarm_gd", async (req, res) => {
  try {
    let alarms = await grinding_table.sequelize.query(
      `SELECT FORMAT(IIF(DATEPART(HOUR, [occurred])<8,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') AS mfg_date,occurred, alarm, mc_no, process
      FROM [data_machine_gd2].[dbo].[DATA_ALARMLIS_GD]
      WHERE  FORMAT(IIF(DATEPART(HOUR, [occurred])<8,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') = '${req.body.date}'
      ORDER BY mc_no, alarm, occurred
      `
    );
    
    let alarmDurations = {};

    // ลูปข้อมูลทั้งหมดและคำนวณเวลา
    for (let i = 0; i < alarms[0].length; i++) {
      let { mfg_date, occurred, alarm, mc_no, process } = alarms[0][i];

      // ตรวจสอบว่า alarm มี `_` ต่อท้ายหรือไม่
      let baseAlarm = alarm.endsWith('_') ? alarm.slice(0, -1) : alarm; // ถอด `_` ออกถ้ามี
      let isEndAlarm = alarm.endsWith('_'); // กำหนดว่ามี `_` หรือไม่

      // สร้าง key สำหรับ mc_no และ baseAlarm
      if (!alarmDurations[mc_no]) alarmDurations[mc_no] = {};
      if (!alarmDurations[mc_no][baseAlarm]) {
        alarmDurations[mc_no][baseAlarm] = {
          mfg_date,
          process,
          totalDuration: 0,
          start: null
        };
      }

      if (!isEndAlarm) {
        // ถ้าเป็นการเริ่มต้น alarm ให้เก็บค่า start time
        alarmDurations[mc_no][baseAlarm].start = new Date(occurred);
      } else {
        // ถ้าเป็นการสิ้นสุด alarm ให้คำนวณเวลาระหว่าง start และ end
        let startTime = alarmDurations[mc_no][baseAlarm].start;
        let endTime = new Date(occurred);

        if (startTime && endTime >= startTime) { // ตรวจสอบว่า endTime ไม่มาก่อน startTime
          // คำนวณเวลาระหว่างเริ่มต้นและสิ้นสุด alarm
          let duration = (endTime - startTime) / 1000; // เวลาในหน่วยวินาที
          alarmDurations[mc_no][baseAlarm].totalDuration += duration;
          alarmDurations[mc_no][baseAlarm].start = null; // รีเซ็ตค่า start เพื่อเตรียมสำหรับ alarm ถัดไป
        }
      }
    }

    // จัดเตรียมผลลัพธ์สำหรับส่งออก
    let result = [];
    for (let mc_no in alarmDurations) {
      for (let alarm in alarmDurations[mc_no]) {
        let { mfg_date, process, totalDuration } = alarmDurations[mc_no][alarm];
        result.push({
          mfg_date,
          mc_no,
          alarm,
          process,
          duration_seconds: totalDuration
        });
      }
    }

    return res.json({
      result: result,
      api_result: constance.result_ok,
    });
  } catch (error) {
    console.log("*******master*****error********alarm GD*******");
    console.log(error);
    res.json({
      result: error,
      api_result: constance.result_nok,
    });
    res.status(500).json({ message: "An error occurred while processing data" });
  }
});

router.post("/bak_prod_an", async (req, res) => {
  try {
    // select last time 
    let result = await grinding_table.sequelize.query(
      `SELECT *
      FROM (
          SELECT FORMAT(IIF(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') AS mfg_date
          ,format(registered_at,'yyyy-MM-dd HH:mm:ss') AS registered_at,UPPER([mc_no]) AS mc_no,[process],[model],[spec],[d_str1],[d_str2],[rssi]
          ,[ok1],[ok2],[ag],[ng],[mix],[tt],[cycle],[target],[error],[alarm],[run],[stop],[wait_p]
          ,[full_p],[adjust],[set_up],[plan_s],[spare1],[spare2],[spare3],[spare4],[hr],[min]
          ,ROW_NUMBER() OVER (PARTITION BY mc_no ORDER BY registered_at DESC) AS row_num
        FROM [data_machine_an].[dbo].[DATA_PRODUCTION_AN]
              WHERE FORMAT(IIF(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') =  '${req.body.date}'
      ) AS subquery
      WHERE row_num = 1
      ORDER BY mc_no;
      `
    );

    return res.json({
      result: result[0],
      api_result: constance.result_ok,
    });
  } catch (error) {
    console.log("*****error********bak prod auto noise*******");
    console.log(error);
    res.json({
      result: error,
      api_result: constance.result_nok,
    });
  }
});

module.exports = router;
