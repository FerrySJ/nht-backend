//Reference
const express = require("express");
const router = express.Router();
const constance = require("../constance/constance");
const po_table = require("../model/user");

//เป็น sub set ย่อยของ API
//เช่น http:localhost:2005/api/getresult

router.get("/getresult", (req, res) => {
  res.json({ result: constance.result_ok });
});
router.get("/qry_usage_ball_po", async (req, res) => {
  // ถ้า qty มี withtb 
  try {
    let db_usage = await po_table.sequelize.query(
      `WITH tb_name AS (
        SELECT
            mfg_date,
            value,
            name
        FROM (
            SELECT
                [registered_at],
                FORMAT(
                    IIF(DATEPART(HOUR, [registered_at]) < 8, DATEADD(DAY, -1, [registered_at]), [registered_at]),
                    'yyyy-MM-dd'
                ) AS mfg_date,
                [ball_c1_ok] AS '-5',
                [ball_c2_ok] AS '-2.5',
                [ball_c3_ok] AS '0',
                [ball_c4_ok] AS '2.5',
                [ball_c5_ok] AS '5',
                ROW_NUMBER() OVER (PARTITION BY FORMAT(IIF(DATEPART(HOUR, [registered_at]) < 8, DATEADD(DAY, -1, [registered_at]), [registered_at]), 'yyyy-MM-dd') ORDER BY [registered_at] DESC) AS rn
            FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
        ) AS SourceTable
        UNPIVOT (
            value FOR name IN ([-5], [-2.5], [0], [2.5], [5])
        ) AS UnpivotedTable
        WHERE rn = 1 AND mfg_date = CONVERT(DATE, GETDATE())
    ),
    tb1 AS (
    SELECT
    mfg_date,
    value,
    name2,
    model
    FROM
    (SELECT mfg_date, model,
        MaxOut1,
        MaxOut2,
        MaxOut3,
        MaxOut4,
        MaxOut5
    FROM
        (SELECT
            format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
    ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
    +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
    +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
    +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model,
            max([ball_c1_ok])*6 as MaxOut1,
            max([ball_c2_ok])*6 as MaxOut2,
            max([ball_c3_ok])*6 as MaxOut3,
            max([ball_c4_ok])*6 as MaxOut4,
            max([ball_c5_ok])*6 as MaxOut5
        FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
        WHERE
            ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
    +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
    +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
    +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) LIKE '%830%' OR 
    (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
    +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
    +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
    +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) LIKE '%83o%')
            AND (format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') BETWEEN CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, 0, getdate())-1, 0), 23) AND CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, -1, getdate())-1, -1), 23))
        GROUP BY
            format(iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd'), [Model_1],[Model_2],[Model_3]
    ,[Model_4]
    ,[Model_5]
    ,[Model_6]
    ,[Model_7]
    ,[Model_8]
    ,[Model_9]
    ,[Model_10]
    ,[Model_11]
    ,[Model_12]) AS SourceTable
    ) AS PivotData
    CROSS APPLY
    (VALUES ('-5', MaxOut1),
            ('-2.5', MaxOut2),
            ('0', MaxOut3),
            ('2.5', MaxOut4),
            ('5', MaxOut5)
    ) AS UnpivotedData(name2, value)
      ),
    tb_counter AS (
        SELECT
            tb1.[mfg_date],
            LEFT(CONVERT(VARCHAR, tb1.[mfg_date], 23), 7) AS mfg_month,
            SUM(tb1.value) AS MaxOut,
            [name],
            [name2]
        FROM tb1
        LEFT JOIN tb_name ON tb1.name2 = tb_name.name
        GROUP BY tb1.[mfg_date], [name], [name2]
    ),
    tb_counter_2 AS (
        SELECT
            mfg_month,
            [name],
            name2,
            SUM(MaxOut) AS usage_pcs
        FROM tb_counter
        GROUP BY mfg_month, [name], name2
    )
    SELECT
        mfg_month,
        [name],
        name2,
        usage_pcs,
        SUM([usage_pcs]) / SUM(SUM([usage_pcs])) OVER () AS usage_percent
    FROM tb_counter_2
    GROUP BY mfg_month, [name], name2, usage_pcs;
    `
//       `with tb_name as(
//         SELECT
// mfg_date,
// value,
// name
// FROM
// (SELECT
//      format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date,
//     [ball_c1_ok] as '-5',
//     [ball_c2_ok] as '-2.5',
//     [ball_c3_ok] as '0',
//     [ball_c4_ok] as '2.5',
//     [ball_c5_ok] as '5'
// FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]) AS SourceTable 
// UNPIVOT
// (
//     value FOR name IN ([-5], [-2.5], [0], [2.5], [5])
// ) AS UnpivotedTable
// WHERE
// mfg_date = CONVERT(DATE, GETDATE())
// )
// ,tb1 as(
// SELECT
// mfg_date,
// value,
// name2,
// model
// FROM
// (SELECT mfg_date, model,
//     MaxOut1,
//     MaxOut2,
//     MaxOut3,
//     MaxOut4,
//     MaxOut5
// FROM
//     (SELECT
//         format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
// ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
// +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
// +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
// +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model,
//         max([ball_c1_ok])*6 as MaxOut1,
//         max([ball_c2_ok])*6 as MaxOut2,
//         max([ball_c3_ok])*6 as MaxOut3,
//         max([ball_c4_ok])*6 as MaxOut4,
//         max([ball_c5_ok])*6 as MaxOut5
//     FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
//     WHERE
//         (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
// +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
// +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
// +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) LIKE '%830%'
//         AND (format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') BETWEEN CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, 0, getdate())-1, 0), 23) AND CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, -1, getdate())-1, -1), 23))
//     GROUP BY
//         format(iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd'), [Model_1],[Model_2],[Model_3]
// ,[Model_4]
// ,[Model_5]
// ,[Model_6]
// ,[Model_7]
// ,[Model_8]
// ,[Model_9]
// ,[Model_10]
// ,[Model_11]
// ,[Model_12]) AS SourceTable
// ) AS PivotData
// CROSS APPLY
// (VALUES ('-5', MaxOut1),
//         ('-2.5', MaxOut2),
//         ('0', MaxOut3),
//         ('2.5', MaxOut4),
//         ('5', MaxOut5)
// ) AS UnpivotedData(name2, value)
//   )

// ,tb_counter as(
// SELECT tb1.[mfg_date], left(convert(varchar, tb1.[mfg_date], 23),7) as mfg_month,sum(tb1.value) as MaxOut,[name],[name2]
// FROM tb1
// left join tb_name on tb1.name2 = tb_name.name
// group by tb1.[mfg_date],[name],[name2]
// )
// --select * from tb_counter
// ,tb_counter_2 as (
// select  mfg_month,[name],name2,sum(MaxOut) as usage_pcs
// from tb_counter
// group by mfg_month,[name],name2
//  )
// select mfg_month,[name],name2,usage_pcs,sum([usage_pcs]) / sum(sum([usage_pcs])) over () as usage_percent    
// from tb_counter_2
// group by mfg_month,[name],name2,usage_pcs
//       `
    );
    res.json({
      result: db_usage[0],
      api_result: constance.result_ok,
    });
    // if (dbdata !== null) {
    //   res.json({
    //     result: dbdata[0],
    //     api_result: constance.result_ok,
    //   });
    // } else {
    //   res.json({ error, api_result: constance.result_nok });
    // }
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
  }
});

//  ALL M/C
router.get("/qry_usage_ball_po_all_mc", async (req, res) => {
    // ถ้า qty มี withtb 
    try {
      let db_usage = await po_table.sequelize.query(
     ` -- All size in 1 month ago
     WITH data_ball AS (SELECT
        LEFT(CONVERT(VARCHAR, [mfg_date], 23), 7) AS mfg_month,
        value,
        name,
        model,series
        FROM
        (
          SELECT * 
          ,CASE WHEN model LIKE '%DCL-740%' THEN 'DCL-740'
                WHEN model LIKE '%DCL-850%' THEN 'DCL-850'
                WHEN model LIKE '%L-630%' THEN 'L-630'
                WHEN model LIKE '%DCL-614%' THEN 'DCL-614'
                WHEN model LIKE '%DDL-1060%' THEN 'DDL-1060'
                WHEN model LIKE '%DDL-740%' THEN 'DDL-740'
                WHEN model LIKE '%DDL-850%' THEN 'DDL-850'
                WHEN model LIKE '%DDL-630%' THEN 'DDL-630'
                WHEN model LIKE '%DDL-614%' THEN 'DDL-614'
                WHEN model LIKE '%DDR-830%' OR model LIKE '%DDR-83o%' THEN 'DDR-830'
                WHEN model LIKE '%DDRI-614%' THEN 'DDL-614'
                WHEN model LIKE '%DCRI-614%' THEN 'DCL-614'
                WHEN model LIKE '%1060%' THEN '1060'
                WHEN model LIKE '%840%' THEN '840'
                WHEN model LIKE '%730%' THEN '730'
                WHEN model LIKE '%1889%' THEN '1889'
                WHEN model LIKE '%830%' OR model LIKE '%83o%' THEN '830'
                WHEN model LIKE '%1260%' THEN '1260'
                WHEN model LIKE '%940%' THEN '940'
                WHEN model LIKE '%608J%' OR model LIKE '%608 J%' OR model LIKE '%608-J%' THEN '608J'
                WHEN model LIKE '%608C%' OR model LIKE '%608 C%' OR model LIKE '%608-C%' THEN '608C'
                WHEN model LIKE '%608%' THEN '608'
                WHEN model LIKE '%627%' THEN '627'
                WHEN model LIKE '%626%' THEN '626'
                WHEN model LIKE '%1560%' THEN '1560'
                WHEN model LIKE '%1340%' THEN '1340'
                WHEN model LIKE '%1680%' THEN '1680'
                WHEN model LIKE '%1660%' THEN '1660'
                WHEN model LIKE '%6803%' THEN '6803'
                WHEN model LIKE '%1350%' THEN '1350'
                WHEN model LIKE '%1360%' THEN '1360'
                WHEN model LIKE '%6001J%' OR model LIKE '%6001 J%' OR model LIKE '%6001-J%' THEN '6001'  -- oversea
                WHEN model LIKE '%6001%' THEN '6001'  -- oversea
                WHEN model LIKE '%6002J%' OR model LIKE '%6002 J%' OR model LIKE '%6002-J%' THEN '6002J'  -- oversea
                WHEN model LIKE '%6002%' THEN '6002'  -- oversea
                WHEN model LIKE '%6202%' THEN '6202'  -- oversea
              ELSE model
              END as series
          FROM 
          (SELECT
                    format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
            ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model,
                    max([ball_c1_ok])*6 as MaxOut1,
                    max([ball_c2_ok])*6 as MaxOut2,
                    max([ball_c3_ok])*6 as MaxOut3,
                    max([ball_c4_ok])*6 as MaxOut4,
                    max([ball_c5_ok])*6 as MaxOut5
                FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
                WHERE (format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') BETWEEN  CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, 0, getdate())-1, 0), 23) AND CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, -1, getdate())-1, -1), 23))
               AND  (   (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) LIKE '%DDR-830%' OR
            (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) LIKE '%830%' OR
            (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) LIKE '%DDR-83o%' OR
            (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) LIKE '%83o%')
                GROUP BY
                    format(iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd'), [Model_1],[Model_2],[Model_3]
            ,[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12]
            UNION ALL
            SELECT
                    format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
            ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model,
                    max([ball_c1_ok])*10 as MaxOut1,
                    max([ball_c2_ok])*10 as MaxOut2,
                    max([ball_c3_ok])*10 as MaxOut3,
                    max([ball_c4_ok])*10 as MaxOut4,
                    max([ball_c5_ok])*10 as MaxOut5
                FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
                WHERE 
            ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) LIKE '%1260%')
                    AND (format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') BETWEEN CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, 0, getdate())-1, 0), 23) AND CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, -1, getdate())-1, -1), 23))
                GROUP BY
                    format(iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd'), [Model_1],[Model_2],[Model_3]
            ,[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12]
            UNION ALL
            SELECT
                    format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
            ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model,
                    max([ball_c1_ok])*7 as MaxOut1,
                    max([ball_c2_ok])*7 as MaxOut2,
                    max([ball_c3_ok])*7 as MaxOut3,
                    max([ball_c4_ok])*7 as MaxOut4,
                    max([ball_c5_ok])*7 as MaxOut5
                FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
                WHERE 
            ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) LIKE '%940%')
                    AND (format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') BETWEEN CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, 0, getdate())-1, 0), 23) AND CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, -1, getdate())-1, -1), 23))
                GROUP BY
                    format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd'), [Model_1],[Model_2],[Model_3]
            ,[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12]
              UNION ALL
            SELECT
                    format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
            ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model,
                    max([ball_c1_ok])*7 as MaxOut1,
                    max([ball_c2_ok])*7 as MaxOut2,
                    max([ball_c3_ok])*7 as MaxOut3,
                    max([ball_c4_ok])*7 as MaxOut4,
                    max([ball_c5_ok])*7 as MaxOut5
               FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
                where ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
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
              +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%730%') 
              AND (format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') BETWEEN CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, 0, getdate())-1, 0), 23) AND CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, -1, getdate())-1, -1), 23))
                GROUP BY
                    format(iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd'), [Model_1],[Model_2],[Model_3]
            ,[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12]
            UNION ALL 
              SELECT
                    format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
            ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model,
                    max([ball_c1_ok])*8 as MaxOut1,
                    max([ball_c2_ok])*8 as MaxOut2,
                    max([ball_c3_ok])*8 as MaxOut3,
                    max([ball_c4_ok])*8 as MaxOut4,
                    max([ball_c5_ok])*8 as MaxOut5
               FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
                where ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
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
              +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%6002%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
              +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
              +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
              +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%630%'  ) 
              AND (format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') BETWEEN CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, 0, getdate())-1, 0), 23) AND CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, -1, getdate())-1, -1), 23))
                GROUP BY
                    format(iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd'), [Model_1],[Model_2],[Model_3]
            ,[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12]
              UNION ALL 
              SELECT
                    format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
            ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model,
                    max([ball_c1_ok])*9 as MaxOut1,
                    max([ball_c2_ok])*9 as MaxOut2,
                    max([ball_c3_ok])*9 as MaxOut3,
                    max([ball_c4_ok])*9 as MaxOut4,
                    max([ball_c5_ok])*9 as MaxOut5
               FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
                where ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
              +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
              +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
              +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1680%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
              +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
              +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
              +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1660%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
              +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
              +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
              +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1060%' ) 
              AND (format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') BETWEEN CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, 0, getdate())-1, 0), 23) AND CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, -1, getdate())-1, -1), 23))
                GROUP BY
                    format(iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd'), [Model_1],[Model_2],[Model_3]
            ,[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12]
              UNION ALL 
              SELECT
                    format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
            ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model,
                    max([ball_c1_ok])*10 as MaxOut1,
                    max([ball_c2_ok])*10 as MaxOut2,
                    max([ball_c3_ok])*10 as MaxOut3,
                    max([ball_c4_ok])*10 as MaxOut4,
                    max([ball_c5_ok])*10 as MaxOut5
               FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
                where ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
              +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
              +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
              +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1889%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
              +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
              +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
              +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1260%') 
              AND (format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') BETWEEN CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, 0, getdate())-1, 0), 23) AND CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, -1, getdate())-1, -1), 23))
                GROUP BY
                    format(iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd'), [Model_1],[Model_2],[Model_3]
            ,[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12]
              UNION ALL 
              SELECT
                    format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
            ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model,
                    max([ball_c1_ok])*11 as MaxOut1,
                    max([ball_c2_ok])*11 as MaxOut2,
                    max([ball_c3_ok])*11 as MaxOut3,
                    max([ball_c4_ok])*11 as MaxOut4,
                    max([ball_c5_ok])*11 as MaxOut5
               FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
                where ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
              +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
              +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
              +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%740%') 
              AND (format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') BETWEEN CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, 0, getdate())-1, 0), 23) AND CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, -1, getdate())-1, -1), 23))
                GROUP BY
                    format(iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd'), [Model_1],[Model_2],[Model_3]
            ,[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12]
             UNION ALL 
             SELECT
                    format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
            ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model,
                    max([ball_c1_ok])*13 as MaxOut1,
                    max([ball_c2_ok])*13 as MaxOut2,
                    max([ball_c3_ok])*13 as MaxOut3,
                    max([ball_c4_ok])*13 as MaxOut4,
                    max([ball_c5_ok])*13 as MaxOut5
               FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
                where ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
              +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
              +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
              +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%850%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
              +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
              +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
              +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%614%') 
              AND (format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') BETWEEN CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, 0, getdate())-1, 0), 23) AND CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, -1, getdate())-1, -1), 23))
                GROUP BY
                    format(iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd'), [Model_1],[Model_2],[Model_3]
            ,[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12]
               UNION ALL 
              SELECT
                    format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') as mfg_date
            ,(CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) as model,
                    max([ball_c1_ok])*15 as MaxOut1,
                    max([ball_c2_ok])*15 as MaxOut2,
                    max([ball_c3_ok])*15 as MaxOut3,
                    max([ball_c4_ok])*15 as MaxOut4,
                    max([ball_c5_ok])*15 as MaxOut5
               FROM [machine_data].[dbo].[DATA_PRODUCTION_ASSY]
                where ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
              +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
              +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
              +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%6803%') 
              AND (format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') BETWEEN CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, 0, getdate())-1, 0), 23) AND CONVERT(VARCHAR, DATEADD(MONTH, DATEDIFF(MONTH, -1, getdate())-1, -1), 23))
                GROUP BY
                    format(iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd'), [Model_1],[Model_2],[Model_3]
            ,[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12]
            ) AS F
          ) AS pri
          CROSS APPLY
        (VALUES ('-5', MaxOut1),
                ('-2.5', MaxOut2),
                ('0', MaxOut3),
                ('2.5', MaxOut4),
                ('5', MaxOut5)
        ) AS UnpivotedData(name, value)
        )
        SELECT mfg_month, name, series, SUM(value) AS usage, ROUND(SUM(value) / NULLIF(SUM(SUM(value)) OVER (PARTITION BY series), 0), 4) AS percen
        FROM data_ball
        GROUP BY mfg_month, name, series
        ORDER BY series ASC, name ASC;
    `
  
      );
      res.json({
        result: db_usage[0],
        api_result: constance.result_ok,
      });
      // if (dbdata !== null) {
      //   res.json({
      //     result: dbdata[0],
      //     api_result: constance.result_ok,
      //   });
      // } else {
      //   res.json({ error, api_result: constance.result_nok });
      // }
    } catch (error) {
      res.json({ result:error, api_result: constance.result_nok });
    }
  });
  router.get("/qry_usage_add_amend/:date_7_days_ago/:yesterday", async (req, res) => {
      // console.log(req.body);
      console.log("==========qry_usage_add_amend=================");
      try {
        let { yesterday } = req.params;
        let { date_7_days_ago } = req.params;
        let resultdata_Ball = await po_table.sequelize.query(
          `-- usage add & amend
          with tb1 as(SELECT
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
             where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${date_7_days_ago}' and '${yesterday}'  and ((CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12])))  like '%830%' OR (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12])))  like '%83o%' )  and datepart(hour,[registered_at]) in ('7' )  -- or model like '')
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
              where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${date_7_days_ago}' and '${yesterday}'  and ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
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
              where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${date_7_days_ago}' and '${yesterday}'  and ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
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
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%6002%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
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
              where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${date_7_days_ago}' and '${yesterday}'  and ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1680%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1660%' or (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%1060%' ) and datepart(hour,[registered_at]) in ('7' ) 
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
              where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${date_7_days_ago}' and '${yesterday}'  and ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
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
              where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${date_7_days_ago}' and '${yesterday}'  and ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
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
              where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${date_7_days_ago}' and '${yesterday}'  and ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
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
              where format (iif(DATEPART(HOUR, [registered_at])<8,dateadd(day,-1,[registered_at]),[registered_at]),'yyyy-MM-dd') between '${date_7_days_ago}' and '${yesterday}'  and ( (CHAR(CONVERT(INT, [Model_1]))+CHAR(CONVERT(INT, [Model_2]))+CHAR(CONVERT(INT, [Model_3]))
            +CHAR(CONVERT(INT, [Model_4]))+CHAR(CONVERT(INT, [Model_5]))+CHAR(CONVERT(INT, [Model_6]))
            +CHAR(CONVERT(INT, [Model_7]))+CHAR(CONVERT(INT, [Model_8]))+CHAR(CONVERT(INT, [Model_9]))
            +CHAR(CONVERT(INT, [Model_10]))+CHAR(CONVERT(INT, [Model_11]))+CHAR(CONVERT(INT, [Model_12]))) like '%6803%') and datepart(hour,[registered_at]) in ('7' ) 
              group by registered_at,[ball_c1_ok],[ball_c2_ok],[ball_c3_ok],[ball_c4_ok],[ball_c5_ok],[mc_no],[Model_1]
            ,[Model_2],[Model_3],[Model_4],[Model_5],[Model_6],[Model_7],[Model_8],[Model_9],[Model_10],[Model_11],[Model_12],datepart(hour,[registered_at])
        )
          ,tb_result as   ( SELECT
                sum(totalSize10) as totalSize10,sum(totalSize20) as totalSize20
                ,sum(totalSize30) as totalSize30,sum(totalSize40) as totalSize40
                ,sum(totalSize50) as totalSize50,[mc_no],model,[mfg_date]
                ,CASE WHEN model LIKE '%DCL-740%' THEN 'DCL-740'
                WHEN model LIKE '%DCL-850%' THEN 'DCL-850'
                WHEN model LIKE '%L-630%' THEN 'L-630'
                WHEN model LIKE '%DCL-614%' THEN 'DCL-614'
                WHEN model LIKE '%1060%' THEN '1060'
                WHEN model LIKE '%840%' THEN '840'
                WHEN model LIKE '%730%' THEN '730'
                WHEN model LIKE '%1889%' THEN '1889'
                WHEN model LIKE '%DDR-830%' OR model LIKE '%DDR-83o%' THEN 'DDR-830'
                WHEN model LIKE '%830%' OR model LIKE '%83o%' THEN '830'
                WHEN model LIKE '%1260%' THEN '1260'
                WHEN model LIKE '%940%' THEN '940'
                WHEN model LIKE '%DDL-740%' THEN 'DDL-740'
                WHEN model LIKE '%DDL-850%' THEN 'DDL-850'
                WHEN model LIKE '%DDL-630%' THEN 'DDL-630'
                WHEN model LIKE '%DDL-614%' THEN 'DDL-614'
                WHEN model LIKE '%DDL-1060%' THEN 'DDL-1060'
                WHEN model LIKE '%608J%' OR model LIKE '%608 J%' OR model LIKE '%608-J%' THEN '608J'
                WHEN model LIKE '%608C%' OR model LIKE '%608 C%' OR model LIKE '%608-C%' THEN '608C'
                WHEN model LIKE '%608%' THEN '608'
                WHEN model LIKE '%627%' THEN '627'
                WHEN model LIKE '%626%' THEN '626'
                WHEN model LIKE '%1560%' THEN '1560'
                WHEN model LIKE '%1340%' THEN '1340'
                WHEN model LIKE '%1680%' THEN '1680'
                WHEN model LIKE '%1660%' THEN '1660'
                WHEN model LIKE '%6803%' THEN '6803'
                WHEN model LIKE '%1350%' THEN '1350'
                WHEN model LIKE '%1360%' THEN '1360'
                WHEN model LIKE '%6001J%' OR model LIKE '%6001 J%' OR model LIKE '%6001-J%' THEN '6001'  -- oversea
                WHEN model LIKE '%6001%' THEN '6001'  -- oversea
                WHEN model LIKE '%6002J%' OR model LIKE '%6002 J%' OR model LIKE '%6002-J%' THEN '6002J'  -- oversea
                WHEN model LIKE '%6002%' THEN '6002'  -- oversea
                WHEN model LIKE '%DDRI-614%' THEN 'DDL-614'
                WHEN model LIKE '%DCRI-614%' THEN 'DCL-614'
                WHEN model LIKE '%6202%' THEN '6202'  -- oversea
            ELSE model
                END as series
              FROM tb1
                group by [mc_no],model,[mfg_date]
          --order by mc_no asc
          )
          SELECT series, SUM(totalSize10) as grade_5,
            SUM(totalSize20) as grade_2,
            SUM(totalSize30) as grade0,
            SUM(totalSize40) as grade2,
            SUM(totalSize50) as grade5
          FROM tb_result
          GROUP BY series
          ORDER BY series asc
      `
          
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
          result: error,
          api_result: constance.result_nok,
        });
      }
    });
module.exports = router;
 