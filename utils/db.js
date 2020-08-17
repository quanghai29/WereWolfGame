const mysql=require('mysql');
const util=require('util');
const config = require('../config/default.json');

const pool = mysql.createPool(config.mysql);
const mysql_query = util.promisify(pool.query).bind(pool);

//Test connect database
pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});

//Câu truy vấn
module.exports={
    load: sql => mysql_query(sql),
    add:(tableName,entity)=>mysql_query(`insert into ${tableName} set ?`, entity),
    loadOnePro:sql=>mysql_query(sql),
    delete:sql=>mysql_query(sql),
    patch:(tableName,entity,condition)=>mysql_query(`update ${tableName} set ? where ?`,[entity,condition]),
    search:sql => mysql_query(sql)
};