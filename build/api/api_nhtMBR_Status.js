const express = require("express");
const router = express.Router();
const constance = require("../constance/constance");

// import model

const MBR_table = require("../model/model_natMBR");

//status MBR
router.get("/status_mbr_assy/:mc/:date", async (req, res) => {
    let { mc } = req.params;
    let { date } = req.params;
    try {
    let result = await MBR_table.sequelize.query(
    ` WITH RankedEvents AS (
      SELECT occurred, mc_status, mc_no, process,
          ROW_NUMBER() OVER (PARTITION BY mc_no ORDER BY occurred) AS rn,
      ROW_NUMBER() OVER (PARTITION BY occurred ORDER BY registered_at) AS num
      FROM [data_machine_assy].[dbo].[DATA_MCSTATUS_ASSY]
      where format (iif(DATEPART(HOUR, [occurred])<8,dateadd(day,-1,[occurred]),[occurred]),'yyyy-MM-dd') = '${date}'
      AND mc_no = '${mc}'
    ),
    FilteredEvents AS (
        SELECT occurred, mc_status, mc_no, process, rn
        FROM RankedEvents
        WHERE num = 1
    ),
    Status_Transitions AS (
        SELECT mc_no, occurred AS start_time,
            LEAD(occurred) OVER (PARTITION BY mc_no ORDER BY occurred) AS end_time,
            mc_status
        FROM FilteredEvents
    )
    SELECT start_time, end_time, mc_status, UPPER(mc_no) AS mc_no
    FROM Status_Transitions
    WHERE end_time IS NOT NULL
    ORDER BY start_time;
      `
    );

    // console.log(result);
   
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

module.exports = router;
