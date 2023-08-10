const ejs = require("ejs");
const mssql = require("mssql");
const { sendMail } = require("../Helpers/email");
const { sqlConfig } = require("../config/config");
const { json } = require("express");

const projectCompleteNotifier = async (system_user) => {
  console.log('Mophat',system_user)
  const pool = await mssql.connect(sqlConfig);
  console.log("users teyhgvjsjv");
  
  console.log(system_user);

  if (pool.connected) {
    console.log("connected  to db");
  
    
    const users = (
      await pool.request()
      .query("SELECT email FROM usersTable WHERE role = 'admin' ")
    ).recordset;
    console.log('below jackpot');
    console.log(system_user);

    const users_name = (
      await pool.request()
      .input('system_user',system_user)
      .query(`SELECT full_name FROM usersTable WHERE id = 'system_user' `)
    ).recordset;

    for (let user of users) {
      ejs.renderFile(
        "./Templates/projectComplete.ejs",
        { email: user.email },
        async (err, html) => {
          const message = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `A project has been completed by ${system_user.full_name}`,
            html,
          };
          try {
            
            // await sendMail(message);
            console.log(users_name);
            console.log(message);
            // await pool
            //   .request()
            //   .query(
            //     `UPDATE usersTable SET issent = 1 WHERE email = '${user.email}'`
            //   );
          } catch (error) {
            console.log(error);
          }
        }
      );
    }
  }else{
    console.log('not connected to db');
  }
};


const hereIsYourNewProject = async (user) => {
  const pool = await mssql.connect(sqlConfig);

  if (pool.connected) {
    console.log("connected connected to db");
  
    
    const users = (
      await pool.request()
      .input('userId',user)
      .query('SELECT email FROM usersTable WHERE id = @userId')
    ).recordset;
    console.log(users);

    for (let user of users) {
      ejs.renderFile(
        "./Templates/welcomeUser.ejs",
        { email: user.email },
        async (err, html) => {
          const message = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Here Is Your New Project",
            html,
          };
          try {
            
            await sendMail(message);
            // await pool
            //   .request()
            //   .query(
            //     `UPDATE usersTable SET issent = 1 WHERE email = '${user.email}'`
            //   );
          } catch (error) {
            console.log(error);
          }
        }
      );
    }
  }else{
    console.log('not connected to db');
  }
};
const new_user= async (user) => {
  const pool = await mssql.connect(sqlConfig);

  if (pool.connected) {
    console.log("connected connected to db");
  
    
    const users = (
      await pool.request()
      .input('userId',user)
      .query('SELECT email FROM usersTable WHERE id = @userId')
    ).recordset;
    console.log(users);

    for (let user of users) {
      ejs.renderFile(
        "./Templates/welcome.ejs",
        { email: user.email },
        async (err, html) => {
          const message = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `Welcome aboard`,
            html,
          };
          try {
            
            await sendMail(message);
            console.log('sent email to user');
            // await pool
            //   .request()
            //   .query(
            //     `UPDATE usersTable SET issent = 1 WHERE email = '${user.email}'`
            //   );
          } catch (error) {
            console.log(error);
          }
        }
      );
    }
  }else{
    console.log('not connected to db');
  }
};

module.exports = {
  projectCompleteNotifier,
  hereIsYourNewProject,
  new_user
};

