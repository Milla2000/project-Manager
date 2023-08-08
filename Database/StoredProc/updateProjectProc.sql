CREATE OR ALTER PROCEDURE updateProjectProc (@id VARCHAR(200), @title  VARCHAR(500), @description VARCHAR(1000), @enddate DATE)
AS
    BEGIN
        UPDATE projectsTable SET  title = @title, description = @description,   enddate = @enddate WHERE id= @id
    END