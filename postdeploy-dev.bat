@echo OFF

echo Authentication Salesforce function space:

echo Logging into the Salesforce function space
cmd.exe /c sf login functions
call :checkForError
@echo:

echo Creating compute enviroment to deploy function
cmd.exe /c sf env create compute --alias s3env --connected-org s3  
call :checkForError
@echo:

echo Deploying function.....
cmd.exe /c sf deploy functions -o s3
call :checkForError
@echo:

echo Deployment sucess

echo You are ready to go!


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
