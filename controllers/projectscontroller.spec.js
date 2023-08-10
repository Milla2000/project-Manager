const { assignProjects, deleteProject } = require("./projectController")
import mssql from 'mssql'

const res = {json: jest.fn()}

describe('assigning a project',()=>{

    it('should return a success message on successfull project assignment',async()=>{
        const req = {
            body:{
                    project_id: "53543c52-4e36-4ec9-ac80-7c70a9c9cfbe",
                    user_id: "a5907d51-f0d0-425e-b601-872d48d53a04"    
            }
        }

        const pool = jest.spyOn(mssql,"connect").mockResolvedValueOnce({
            connected: true,
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                rowsAffected: [1,1]
            })
        })

        await assignProjects(req,res)

        expect(res.json).toHaveBeenCalledWith({
            message:"Project assigned successfully"
        })

        res.json.mockRestore()
    })

    it('should return error message if incase project id is not passed',async()=>{
        const req = {
            body:{
                    user_id: "a5907d51-f0d0-425e-b601-872d48d53a04"    
            }
        }

        const pool = jest.spyOn(mssql,"connect").mockResolvedValueOnce({
            connected: true,
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                rowsAffected: [0]
            })
        })

        await assignProjects(req,res)

        expect(res.json).toHaveBeenCalledWith({
            message:"Project assigning failed"
        })

        res.json.mockRestore()
    })

})



describe("delete a note",()=>{

    it("should delete the project successfully", async()=>{
        const mockedProjectId = '0b3a8000-3557-4ebb-bf4b-2a660c02f41d'
        const req = {
            params:{
                id: mockedProjectId
            }
        }

        jest.spyOn(mssql, "connect").mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                rowsAffected: [1]
            })
        })

        await deleteProject(req, res)

        expect(res.json).toHaveBeenCalledWith({
            message: 'Project deleted successfully'
        })

        res.json.mockRestore()
    })

    it("should return an error when note is not found'", async()=>{
        const mockedNoteId = 'bac727c4-4178-427a-a239-063f5c58ae8ijdfnjknii6'
        const req = {
            params:{
                id: mockedNoteId
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        jest.spyOn(mssql, "connect").mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                rowsAffected: [0]
            })
        })

        await deleteProject(req, res)


        expect(res.json).toHaveBeenCalledWith({
            message: 'Project not found'
        })

        res.json.mockRestore()
    })

})
