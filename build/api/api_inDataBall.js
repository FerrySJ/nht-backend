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
schedule.scheduleJob("2 * * * *", async function (req, res) {
  console.log("lllllllllllllllllllllll");
  try {
    let day1 = "";
    let day2 = "";
    const currentHour = parseInt(moment().format("HH"), 10);
  console.log("Current Hour:", currentHour);
  
  if (currentHour >= 8 && currentHour <= 23) {
    day1 = `CONVERT(DATE, GETDATE())`;
    day2 = `CONVERT(DATE, DATEADD(day, -1, GETDATE()))`;
  } else {
    day1 = `CONVERT(DATE, DATEADD(day, -1, GETDATE()))`;
    day2 = `CONVERT(DATE, DATEADD(day, -2, GETDATE()))`;
  }
  
  console.log("Day1:", day1);
  console.log("Day2:", day2);

    // ถ้าต้องการข้อมูลเมื่อวาน => USE WHERE DATE -1 DAY
    // ถ้าต้องการข้อมูลวันนี้ => USE WHERE GETDATE()
    let data = await MBR_table.sequelize.query(
      `SELECT [registered_at],UPPER([mc_no]) as mc_no,[process],[model],[spec],[d_str1],[d_str2],[rssi],[daily_ok],[daily_ng],[daily_tt]
      ,[c1_ok],[c2_ok],[c3_ok],[c4_ok],[c5_ok],[c1_ng],[c2_ng],[c3_ng],[c4_ng],[c5_ng]
      ,[cycle_t],[target_u],[error_t],[alarm_t],[run_t],[stop_t],[wait_p_t],[full_p_t],[adjust_t],[set_up_t],[plan_s_t]
      ,[time_hr],[time_min],[w_ir_t],[w_or_t],[w_ball_t],[w_rtnr_t]
      FROM [data_machine_assy].[dbo].[DATA_PRODUCTION_ASSY]
      where CONVERT(DATE, format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd')) = ${day1}
      AND  DATEPART(HOUR, registered_at) = DATEPART(HOUR, GETDATE())
      order by mc_no asc,registered_at asc
        `
    );

    // console.log(sentence.charCodeAt([index]));
    // console.log(data[0]);
    // console.log("l .. ",data[0].length);
    let mc = [];
    for (let index = 0; index < data[0].length; index++) {
      mc.push(data[0][index].mc_no);
      let get_old = await MBR_table.sequelize.query(
        ` SELECT [registered_at],[mc_no],[process],[rssi],[Daily_OK],[Daily_NG],[Daily_Total],[Ball_C1_OK],[Ball_C2_OK],[Ball_C3_OK],[Ball_C4_OK],[Ball_C5_OK],[Ball_C1_NG],[Ball_C2_NG],[Ball_C3_NG],[Ball_C4_NG],[Ball_C5_NG],[Ball_Check_Camera_Qty],[Ball_Check_Camera_Angle],[Separate_NG_1st],[MN_MI_RTNR_NG],[Pre_Press_NG],[Main_Press_NG],[Press_Check_NG],[RTNR_Camera_NG],[Cycle_Time],[Target_Utilize],[Error_Time],[Alarm_Time],[Run_Time],[Stop_Time],[Wait_Part_Time],[Full_Part_Time],[Adjust_Time],[Set_Up_Time],[Plan_Stop_Time],[Separate_NG_2nd],[Model_1],[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],[D2_RTNR_NG],[D1_RTNR_NG],[Spec_1],[Spec_2],[Spec_3],[Spec_4],[Spec_5],[Spec_6],[Spec_7],[Spec_8],[Spec_9],[Spec_10],[Spec_11],[Spec_12],[Time_Hr],[Time_Min]
      FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
      WHERE  CAST(CONVERT(DATE, format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd')) AS DATE) = ${day2}
      AND  DATEPART(HOUR, registered_at) = 7  
      AND mc_no LIKE '${data[0][index].mc_no}'
      order by mc_no asc,registered_at asc
      `
      );
      const date = new Date(data[0][index].registered_at);

      // Function to pad numbers to two digits
      const pad = (num) => String(num).padStart(2, "0");

      // Function to format the date
      const formatDate = (date) => {
        const year = date.getUTCFullYear();
        const month = pad(date.getUTCMonth() + 1); // Months are zero-based
        const day = pad(date.getUTCDate());
        const hours = pad(date.getUTCHours());
        const minutes = pad(date.getUTCMinutes());
        const seconds = pad(date.getUTCSeconds());
        const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
      };

      const formattedDate = formatDate(date);
      console.log(moment().format("YYYY-MM-DD HH:mm:ss"), "...", formattedDate); 

      if (get_old[0].length > 0) {
         if (data[0][index].model === "") {
        await MBR_table.sequelize
        .query(`INSERT INTO [machine_data].[dbo].[DATA_PRODUCTION_ASSY] ([registered_at],[mc_no],[process],[rssi],[Daily_OK],[Daily_NG],[Daily_Total],[Ball_C1_OK],[Ball_C2_OK],[Ball_C3_OK],[Ball_C4_OK],[Ball_C5_OK],[Ball_C1_NG],[Ball_C2_NG],[Ball_C3_NG],[Ball_C4_NG],[Ball_C5_NG],[Ball_Check_Camera_Qty],[Ball_Check_Camera_Angle],[Separate_NG_1st],[MN_MI_RTNR_NG],[Pre_Press_NG],[Main_Press_NG],[Press_Check_NG],[RTNR_Camera_NG],[Cycle_Time],[Target_Utilize],[Error_Time],[Alarm_Time],[Run_Time],[Stop_Time],[Wait_Part_Time],[Full_Part_Time],[Adjust_Time],[Set_Up_Time],[Plan_Stop_Time],[Separate_NG_2nd],[Model_1],[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],[D2_RTNR_NG],[D1_RTNR_NG],[Spec_1],[Spec_2],[Spec_3],[Spec_4],[Spec_5],[Spec_6],[Spec_7],[Spec_8],[Spec_9],[Spec_10],[Spec_11],[Spec_12],[Time_Hr],[Time_Min])
        VALUES ('${formattedDate}','${data[0][index].mc_no}','${data[0][index].process}','${data[0][index].rssi}','${data[0][index].daily_ok}','${data[0][index].daily_ng}','${data[0][index].daily_tt}'
        ,'${data[0][index].c1_ok}','${data[0][index].c2_ok}','${data[0][index].c3_ok}','${data[0][index].c4_ok}','${data[0][index].c5_ok}'
        ,'${data[0][index].c1_ng}','${data[0][index].c2_ng}','${data[0][index].c3_ng}','${data[0][index].c4_ng}','${data[0][index].c5_ng}'
        ,'${get_old[0][0].Ball_Check_Camera_Qty}','${get_old[0][0].Ball_Check_Camera_Angle}','${get_old[0][0].Separate_NG_1st}','${get_old[0][0].MN_MI_RTNR_NG}','${get_old[0][0].Pre_Press_NG}','${get_old[0][0].Main_Press_NG}'
        ,'${get_old[0][0].Press_Check_NG}','${get_old[0][0].RTNR_Camera_NG}','${data[0][index].cycle_t}','${data[0][index].target_u}','${data[0][index].error_t}','${data[0][index].alarm_t}'
        ,'${data[0][index].run_t}','${data[0][index].stop_t}','${data[0][index].wait_p_t}','${data[0][index].full_p_t}','${data[0][index].adjust_t}','${data[0][index].set_up_t}'
        ,'${data[0][index].plan_s_t}','${get_old[0][0].Separate_NG_2nd}','${get_old[0][0].Model_1}','${get_old[0][0].Model_2}','${get_old[0][0].Model_3}','${get_old[0][0].Model_4}','${get_old[0][0].Model_5}'
        ,'${get_old[0][0].Model_6}','${get_old[0][0].Model_7}','${get_old[0][0].Model_8}','${get_old[0][0].Model_9}','${get_old[0][0].Model_10}','${get_old[0][0].Model_11}'
        ,'${get_old[0][0].Model_12}','${get_old[0][0].D2_RTNR_NG}','${get_old[0][0].D1_RTNR_NG}','${get_old[0][0].Spec_1}','${get_old[0][0].Spec_2}','${get_old[0][0].Spec_3}','${get_old[0][0].Spec_4}'
        ,'${get_old[0][0].Spec_5}','${get_old[0][0].Spec_6}','${get_old[0][0].Spec_7}','${get_old[0][0].Spec_8}','${get_old[0][0].Spec_9}','${get_old[0][0].Spec_10}','${get_old[0][0].Spec_11}'
        ,'${get_old[0][0].Spec_12}','${data[0][index].time_hr}','${data[0][index].time_min}')`);
          } else {
            const spaceCharCode = " ".charCodeAt(0);
            let data_m = [];
        
            const model = data[0][index].model;
            for (let j = 0; j < 12; j++) {
              if (j < model.length) {
                data_m.push(model.charCodeAt(j));
              } else {
                data_m.push(spaceCharCode);
              }
            }
            // console.log(model);
            // console.log("..",get_old[0][0]);
              await MBR_table.sequelize
          .query(`INSERT INTO [machine_data].[dbo].[DATA_PRODUCTION_ASSY] ([registered_at],[mc_no],[process],[rssi],[Daily_OK],[Daily_NG],[Daily_Total],[Ball_C1_OK],[Ball_C2_OK],[Ball_C3_OK],[Ball_C4_OK],[Ball_C5_OK],[Ball_C1_NG],[Ball_C2_NG],[Ball_C3_NG],[Ball_C4_NG],[Ball_C5_NG],[Ball_Check_Camera_Qty],[Ball_Check_Camera_Angle],[Separate_NG_1st],[MN_MI_RTNR_NG],[Pre_Press_NG],[Main_Press_NG],[Press_Check_NG],[RTNR_Camera_NG],[Cycle_Time],[Target_Utilize],[Error_Time],[Alarm_Time],[Run_Time],[Stop_Time],[Wait_Part_Time],[Full_Part_Time],[Adjust_Time],[Set_Up_Time],[Plan_Stop_Time],[Separate_NG_2nd],[Model_1],[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],[D2_RTNR_NG],[D1_RTNR_NG],[Spec_1],[Spec_2],[Spec_3],[Spec_4],[Spec_5],[Spec_6],[Spec_7],[Spec_8],[Spec_9],[Spec_10],[Spec_11],[Spec_12],[Time_Hr],[Time_Min])
          VALUES ('${formattedDate}','${data[0][index].mc_no}','${data[0][index].process}','${data[0][index].rssi}','${data[0][index].daily_ok}','${data[0][index].daily_ng}','${data[0][index].daily_tt}'
          ,'${data[0][index].c1_ok}','${data[0][index].c2_ok}','${data[0][index].c3_ok}','${data[0][index].c4_ok}','${data[0][index].c5_ok}'
          ,'${data[0][index].c1_ng}','${data[0][index].c2_ng}','${data[0][index].c3_ng}','${data[0][index].c4_ng}','${data[0][index].c5_ng}'
          ,'${get_old[0][0].Ball_Check_Camera_Qty}','${get_old[0][0].Ball_Check_Camera_Angle}','${get_old[0][0].Separate_NG_1st}','${get_old[0][0].MN_MI_RTNR_NG}','${get_old[0][0].Pre_Press_NG}','${get_old[0][0].Main_Press_NG}'
          ,'${get_old[0][0].Press_Check_NG}','${get_old[0][0].RTNR_Camera_NG}','${data[0][index].cycle_t}','${data[0][index].target_u}','${data[0][index].error_t}','${data[0][index].alarm_t}'
          ,'${data[0][index].run_t}','${data[0][index].stop_t}','${data[0][index].wait_p_t}','${data[0][index].full_p_t}','${data[0][index].adjust_t}','${data[0][index].set_up_t}'
          ,'${data[0][index].plan_s_t}','${get_old[0][0].Separate_NG_2nd}','${data_m[0]}','${data_m[1]}','${data_m[2]}','${data_m[3]}','${data_m[4]}'
          ,'${data_m[5]}','${data_m[6]}','${data_m[7]}','${data_m[8]}','${data_m[9]}','${data_m[10]}'
          ,'${data_m[11]}','${get_old[0][0].D2_RTNR_NG}','${get_old[0][0].D1_RTNR_NG}','${get_old[0][0].Spec_1}','${get_old[0][0].Spec_2}','${get_old[0][0].Spec_3}','${get_old[0][0].Spec_4}'
          ,'${get_old[0][0].Spec_5}','${get_old[0][0].Spec_6}','${get_old[0][0].Spec_7}','${get_old[0][0].Spec_8}','${get_old[0][0].Spec_9}','${get_old[0][0].Spec_10}','${get_old[0][0].Spec_11}'
          ,'${get_old[0][0].Spec_12}','${data[0][index].time_hr}','${data[0][index].time_min}')`);
           
          
        }
      }
    }
    // }

    // return res.json(
    return {
      mfgdate: moment().format("YYYY-MM-DD"),
      time: moment().format("HH:mm:ss"),
      api_result: constance.result_ok,
    };
    // );
  } catch (error) {
    console.log("=======error =============", error);
    //return //res.json(
    return { error, api_result: constance.result_nok };
    // );
  }
});

module.exports = router;
