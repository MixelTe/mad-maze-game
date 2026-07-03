@echo off
call tsc

IF %errorlevel% NEQ 0 (
    echo [ERROR] TypeScript compilation failed. Aborting build.
    exit /b %errorlevel%
)
echo [SUCCESS] TypeScript compiled successfully. Building Go binary...

set GOOS=linux
set GOARCH=amd64
call go build -ldflags="-X 'main.Environment=prod' -s -w" -o build\madmazeeditor

IF %errorlevel% NEQ 0 (
    echo [ERROR] Go build failed. Aborting windows build.
    exit /b %errorlevel%
)
echo [SUCCESS] Go binary built successfully. Building Windows executable...

set GOOS=windows
set GOARCH=amd64
call go build -ldflags="-X 'main.Environment=prod' -s -w" -o build\madmazeeditor.exe

echo [SUCCESS] Windows executable built successfully. Build complete!
