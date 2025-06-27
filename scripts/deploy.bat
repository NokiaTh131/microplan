@echo off
REM Windows batch wrapper for deployment script

if "%1"=="" (
    echo Usage: %0 {deploy^|rollback^|backup^|status^|health^|cleanup^|logs}
    echo.
    echo Commands:
    echo   deploy   - Deploy the application ^(with backup^)
    echo   rollback - Rollback to previous version
    echo   backup   - Create backup only
    echo   status   - Show service status
    echo   health   - Check application health
    echo   cleanup  - Clean unused Docker resources
    echo   logs     - Show service logs
    exit /b 1
)

REM Check if PowerShell is available
where powershell >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: PowerShell is required but not found
    exit /b 1
)

REM Execute PowerShell script
powershell -ExecutionPolicy Bypass -File "%~dp0deploy.ps1" -Action %1 %2 %3 %4 %5