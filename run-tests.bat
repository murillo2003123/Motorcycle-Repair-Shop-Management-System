@echo off
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    node tests/run-tests.js
) else (
    set ELECTRON_RUN_AS_NODE=1
    "C:\Users\User\AppData\Local\Programs\Microsoft VS Code\Code.exe" tests/run-tests.js
)
