@echo off
REM Запуск Ollama сервера на http://localhost:11434
ollama serve

REM Если нужно сразу загрузить модель, раскомментируйте следующую строку:
REM ollama run llama3

pause
