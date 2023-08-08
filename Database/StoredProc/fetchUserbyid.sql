CREATE PROCEDURE fetchUserByIdProc
    @id VARCHAR(200)
AS
BEGIN
    SELECT id, full_name, email, assignedProject, role
    FROM usersTable
    WHERE id = @id;
END;
