CREATE OR ALTER PROCEDURE updateAssignedStatusProc  (@project_id VARCHAR(200))
AS 
BEGIN
UPDATE projectsTable SET assignedStatus = 1 WHERE id = @project_id
END


