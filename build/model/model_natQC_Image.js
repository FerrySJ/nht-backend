//Reference
const { Sequelize, DataTypes } = require("sequelize");

//SQL Connection
const icx_database = require("../instance/instance");

//Create Table in SQL
//ชื่อตั่วแปร Const ต้องตรงกับข้างล่าง
const Image_table = icx_database.define(
  "app_qc_inspection",
  // table name

  {
    registered_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    machine_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prod_shift: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    images: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    process: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sub_process: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    mfg_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

 
  }
);

//True : Delete then Create
//False : Only Check then Create

//ชื่อตั่วแปร await,module.exports  ต้องตรงกับข้างบน
(async () => {
  await Image_table.sync({ force: false });
})();

module.exports = Image_table;
