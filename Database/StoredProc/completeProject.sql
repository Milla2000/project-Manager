CREATE OR ALTER PROCEDURE completeProjectProc
    @project_id VARCHAR(200),
    @user_id VARCHAR(200)
AS
BEGIN
    DECLARE @completionStatus VARCHAR(1000);

    SELECT @completionStatus = completionStatus
    FROM projectsTable
    WHERE id = @project_id;

    -- Check if @user_id is already present in @completionStatus
    IF @completionStatus IS NULL OR @completionStatus = ''
    BEGIN
        SET @completionStatus = @user_id;
    END
    ELSE IF CHARINDEX(@user_id, @completionStatus) = 0
    BEGIN
        SET @completionStatus = @completionStatus + ',' + @user_id;
    END

    UPDATE projectsTable
    SET completionStatus = @completionStatus
    WHERE id = @project_id;
END;
