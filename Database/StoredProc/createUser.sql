CREATE OR ALTER PROCEDURE registerUsersProc(@id VARCHAR(200), @full_name VARCHAR(200), @email VARCHAR(200), @password VARCHAR(200))
AS
BEGIN
    INSERT INTO usersTable(id, full_name, email, password) VALUES(@id, @full_name, @email, @password)
END

SELECT * FROM usersTable;



INSERT INTO usersTable(id, full_name, email, password, role)
VALUES (
  'ed53d1f3-5242-420b-bf42-023046a1d8a9',
  'Milla Wachira Siloma',
  'ignit3graphics@gmail.com',
  '$2b$05$nstcZ1IV.eV6b1rYobbUBeL1v2jFSOj/hL4N5zQIrO8cRqLmOqkbu',
  'admin'
);


-- DELETE FROM usersTable
-- WHERE id = 'ed53d1f3-5242-420b-bf42-023046a1d8a9';


SELECT * FROM projectsTable;