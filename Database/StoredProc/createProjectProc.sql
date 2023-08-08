CREATE OR ALTER PROCEDURE createProjectProc(@id VARCHAR(200), @title  VARCHAR(500), @description VARCHAR(1000), @enddate DATE)
AS
BEGIN
    INSERT INTO projectsTable(id, title, description,  enddate) VALUES (@id, @title, @description,  @enddate)
END

SELECT * FROM projectsTable