CREATE OR ALTER PROCEDURE assignProjectProc
    @project_id VARCHAR(200),
    @userId VARCHAR(200),
    @currentTime DATE
AS
BEGIN
    UPDATE usersTable
    SET assignedProject = @project_id
    WHERE id = @userId;

    UPDATE projectsTable SET assignedStatus = 1, startdate = @currentTime WHERE id = @project_id
END



-- CREATE PROCEDURE updateAssignedStatus
--     @project_id VARCHAR(200),
--     @userId VARCHAR(200)
-- AS
-- BEGIN
--     UPDATE usersTable
--     SET assignedProject = @project_id
--     WHERE id = @userId;
-- END

UPDATE projectsTable SET assignedStatus = TRUE WHERE id = @project_id;
