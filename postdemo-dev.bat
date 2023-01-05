@echo OFF

echo Authentication Salesforce function space:

echo Logging into the Salesforce function space
cmd.exe /c sf login functions
call :checkForError
@echo:

echo Deleting Compute enviroment to save up space ..... 
cmd.exe /c sf env delete -e s3env
call :checkForError
@echo:

echo Deleted sucessfully


rem Check exit code
@echo:
if ["%errorlevel%"]==["0"] (
  echo Installation completed.
  @echo:
  cmd.exe /c sfdx force:org:open -u %ORG_ALIAS%
)

:: ======== FN ======
GOTO :EOF

rem if the app has failed
:checkForError
if NOT ["%errorlevel%"]==["0"] (
    echo Installation failed.
    exit /b %errorlevel%
)
