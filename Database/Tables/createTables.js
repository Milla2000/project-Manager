const mssql = require ('mssql');
const { sqlConfig } = require('../../config/config');


const createProjectsTable = async(req, res)=>{
    try {
        const table = `
        BEGIN 
        TRY
            CREATE TABLE projectsTable(
                id VARCHAR(200) PRIMARY KEY,
                title VARCHAR(500) NOT NULL,
                description VARCHAR(1000) NOT NULL,
                startdate DATE,
                enddate DATE NOT NULL,
                assignedStatus BIT DEFAULT 0,
                completionStatus VarChar(500) ,
            )
        END TRY
    BEGIN   
        CATCH
            THROW 50001, 'Table already Exists!', 1;
        END CATCH`;

    const pool = await mssql.connect(sqlConfig)

    await pool.request().query(table, (err)=>{
        if(err instanceof mssql.RequestError){
            console.log({Error: err.message});
        }else{
            console.log('Table created Successfully');
        }
    })

    } catch (error) {
        return ({Error: error})
    }
}
const createUsersTable = async(req, res)=>{
    try {
        const table = `
        BEGIN 
            TRY
                CREATE TABLE usersTable(
                    id VARCHAR(200) PRIMARY KEY,
                    full_name VARCHAR(200) NOT NULL,
                    email VARCHAR(200) UNIQUE NOT NULL,
                    password VARCHAR(500) NOT NULL,
                    assignedProject VARCHAR(300),
                    role VARCHAR(50) DEFAULT 'user'
                )
            END TRY
        BEGIN CATCH
            THROW 50002, 'Table already exists', 1;
        END CATCH`;

    const pool = await mssql.connect(sqlConfig)

    await pool.request().query(table, (err)=>{
        if(err instanceof mssql.RequestError){
            console.log(err.message);
        }else{
            console.log('Table created Successfully');
        }
    })

    } catch (error) {
        return ({Error: error})
    }
}

module.exports = {
    createProjectsTable,
    createUsersTable
}