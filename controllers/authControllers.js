const mssql = require('mssql');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {v4} = require('uuid');
const { createUsersTable } = require('../Database/Tables/createTables');
const { sqlConfig } = require('../config/config');
const dotenv = require('dotenv');
const { loginSchema, registerSchema } = require('../validators/validators');
dotenv.config()



const registerUsers = async (req,res) =>{
    try {
        // console.log("why now");
        // createUsersTable()

        const id = v4();
        console.log("why now");
        
        const {full_name,email,password} = req.body

        const {error} = registerSchema.validate(req.body)
        if(error){
            return res.status(422).json(error.details)
        }

        console.log(full_name);

        const hashedPwd = await bcrypt.hash(password, 5);

        const pool = await mssql.connect(sqlConfig);

        
        
        const result = await pool.request()
        .input('id',id)
        .input('full_name',mssql.VarChar,full_name)
        .input('email',mssql.VarChar,email)
        .input('password',mssql.VarChar,hashedPwd)
        .execute('registerUsersProc');

        console.log(result);

        if(result.rowsAffected == 1){
            return res.status(200).json({ message: "User registered successfully"})
        }else{
            return res.status(200).json({ message: "Registration failed"})
        }




    } catch (error) {
        return res.json({Error:error.message})
    }
}


const userLogin = async(req,res)=>{
    try {
        const{email,password} = req.body

        const {error} = loginSchema.validate(req.body)
        if(error){
            return res.status(422).json(error.details)
        }
        const pool = await mssql.connect(sqlConfig)

       const user = (await pool.request().input('email',mssql.VarChar, email).execute('userLogin')).recordset[0]

    //    console.log(user);
        const hashedPwd = user.password

        if(user){
            const comparePwd = await bcrypt.compare(password,hashedPwd)
            // console.log(comparePwd)
            if(comparePwd){
                const {password , ...payload} = user
                const token = jwt.sign(payload, process.env.SECRET, {expiresIn : '3600s'})

                if(user.role == 'user'){
                    
                }

                return res.status(200).json({
                    message: 'logged in',
                    token
                })
            }else{
                return res.status(400).json({
                    message: 'Invalid login credentials'
                })
            }
        }else{
            return res.status(400).json({message: "Email does not exist"})
        }

    } catch (error) {
        return res.json({Error:error.message})
    }
}


const checkUser = async(req, res)=>{
    if(req.info){
        res.json({
            info:req.info
            // name:req.info.e_name,
            // email: req.info.email,
            // role: req.info.role
        })
    }
}


module.exports = {
    registerUsers,
    userLogin,
    checkUser
}