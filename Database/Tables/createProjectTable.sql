select * from projectsTable

BEGIN 
        TRY
            CREATE TABLE projectsTable(
                id VARCHAR(200) PRIMARY KEY,
                title VARCHAR(500) NOT NULL,
                description VARCHAR(1000) NOT NULL,
                startdate DATE,
                enddate DATE NOT NULL,
                completionStatus BIT DEFAULT 0,
            )
        END TRY
    BEGIN   
        CATCH
            THROW 50001, 'Table already Exists!', 1;
        END CATCH


DROP TABLE IF EXISTS usersTable;
DROP TABLE IF EXISTS projectsTable;



BEGIN 
            TRY
                CREATE TABLE usersTable(
                    id VARCHAR(200) PRIMARY KEY,
                    full_name VARCHAR(200) NOT NULL,
                    email VARCHAR(200) UNIQUE NOT NULL,
                    password VARCHAR(500) NOT NULL,
                    assignedProject VARCHAR(300),
                    role VARCHAR(50) DEFAULT 'user'
                )
            END TRY
        BEGIN CATCH
            THROW 50002, 'Table already exists', 1;
        END CATCH

SELECT * FROM usersTable;
