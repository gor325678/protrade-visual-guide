
-- Проверим и исправим настройки схемы для PostgREST
-- Убедимся, что таблица materials доступна через API
SELECT schemaname, tablename FROM pg_tables WHERE tablename = 'materials';

-- Проверим RLS политики
SELECT schemaname, tablename, policyname, cmd, permissive, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'materials';

-- Убедимся, что таблица materials существует и доступна
\d public.materials;

-- Проверим настройки PostgREST
SELECT current_setting('app.settings.postgrest_exposed_schemas', true);
