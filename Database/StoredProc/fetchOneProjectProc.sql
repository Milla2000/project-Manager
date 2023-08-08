CREATE OR ALTER PROCEDURE fetchOneProjectProc (@id VARCHAR(200))
AS  
    BEGIN 
        SELECT * FROM projectsTable WHERE id = @id
    END