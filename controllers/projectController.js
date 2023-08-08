const {v4} = require('uuid');
const mssql = require ('mssql');
const { createProjectsTable } = require('../Database/Tables/createTables');
const { sqlConfig } = require('../config/config');
const { hereIsYourNewProject } = require('../EmailService/newUser');


const projects = [];

// class project{
//     constructor(id,title,decription,startdate,enddate,status){
//         this.id = id
//         this.title = title
//         this.decription = decription
//         this.startdate = startdate
//         this.enddate = enddate
//         this.status = status
//     }
// }

const createNewProject = async (req,res)=>{
    try {
        createProjectsTable()
        const id = v4();
        const currentTime = new Date();
        const {title,description,enddate} = req.body

        const pool = await mssql.connect(sqlConfig)

        // console.log('b4 proc');

        if(pool.connected){
            const result = await pool.request()
            .input('id',mssql.VarChar, id)
            .input('title', mssql.VarChar,title)
            .input('description', mssql.VarChar, description)
            .input('enddate', mssql.Date, enddate)
            .execute('createProjectProc')
            
            
            console.log("inside");

            if(result.rowsAffected==1){
                return res.json({
                    message: "Project created successfully"
                })
            }else{
                return res.json({message: "Project creation failed"})
            }

        }
        
    } catch (error) {
        return res.json({error})
    }
}



const assignProjects = async (req,res)=>{
    try {
        const {project_id, user_id} = req.body
        const currentTime = new Date();

        // console.log(project_id, user_id);
          
        const pool = await mssql.connect(sqlConfig)

        if(pool.connected){
            const pool_result = await pool.request()
            .input('project_id',mssql.VarChar, project_id)
            .input('userId', mssql.VarChar,user_id)
            .input('currentTime',mssql.Date,currentTime)
            .execute('assignProjectProc')

            console.log(pool_result.rowsAffected);
            
            if (pool_result.rowsAffected[0] === 1 && pool_result.rowsAffected[1] === 1){
                const sent = hereIsYourNewProject(user_id)
                console.log(sent);
                return res.json({
                    message: "Project assigned successfully"
                })
            }else{
                return res.json({message: "Project assigning failed"})
            }
        }
        // console.log("connected");

        



    } catch (error) {
        return res.json({Error:error.message})
    }
}



const viewOneProject = async (req,res)=>{
    try {

        const { id } = req.params; // User ID

        const pool = await mssql.connect(sqlConfig);

        // Fetch assigned project ID from the usersTable
        const user = (await pool.request().input('id', id).execute('fetchUserByIdProc')).recordset[0];

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const assignedProjectId = user.assignedProject;


        // const {id} = req.params

        // const pool = await mssql.connect(sqlConfig);
        console.log("VIEW ONE");

        const project = (await pool.request().input('id', assignedProjectId).execute('fetchOneProjectProc')).recordset;

        return res.json({
            project: project
        })
    } catch (error) {
        return res.json({error})
    }
}
const viewAllProjects = async (req,res)=>{
    try {
        const pool = await (mssql.connect(sqlConfig))

        const allproject = (await pool.request().execute('fetchAllProjectsProc')).recordset
        
        res.json({projects: allproject})
    } catch (error) {
        return res.json({error})
    }
}
const updateProject = async (req,res)=>{
    try {
        const {id} = req.params

        const {title, description,  enddate} = req.body

        const pool = await mssql.connect(sqlConfig)

        const result = (await pool.request()
        .input('id', mssql.VarChar, id)
        .input('title', mssql.VarChar, title)
        .input('description', mssql.VarChar, description)
        .input('enddate', mssql.Date, enddate)

        .execute('updateProjectProc'));

        console.log(result);

        if(result.rowsAffected == 1){
            res.json({
                message: 'project updated successfully'
            })
        }else{
            res.json({
                message: 'project not found'
            })
        }
    } catch (error) {
        return res.json({error})
    }
}
const deleteProject = async (req,res)=>{
    try {
        const id = req.params.id

        const pool = await mssql.connect(sqlConfig)

        const result = await pool.request()
        .input('id', id)
        .execute('deleteProjectProc')
      
        if(result.rowsAffected == 1){
            res.json({
                    message: 'Project deleted successfully'
            })
        }else{
            res.json({
                message: 'Project not found'
        })
        }
    } catch (error) {
        return res.json({error})
    }
}


module.exports = {
    createNewProject,
    viewAllProjects,
    viewOneProject,
    updateProject,
    deleteProject,
    assignProjects
}