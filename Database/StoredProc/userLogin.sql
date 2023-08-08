CREATE OR ALTER PROCEDURE userLogin(@email VARCHAR(200))
AS
BEGIN
    SELECT * FROM usersTable WHERE email = @email
END