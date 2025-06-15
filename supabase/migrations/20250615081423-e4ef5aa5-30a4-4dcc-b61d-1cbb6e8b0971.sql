
-- Создаем таблицу для материалов
CREATE TABLE IF NOT EXISTS public.materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video', 'article', 'course', 'ebook', 'image')),
  url TEXT,
  image_url TEXT,
  date_added TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем Row Level Security
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- Создаем политику, которая разрешает всем читать материалы
CREATE POLICY "Anyone can view materials" 
  ON public.materials 
  FOR SELECT 
  USING (true);

-- Создаем политику, которая разрешает всем добавлять материалы
CREATE POLICY "Anyone can create materials" 
  ON public.materials 
  FOR INSERT 
  WITH CHECK (true);

-- Создаем политику, которая разрешает всем обновлять материалы
CREATE POLICY "Anyone can update materials" 
  ON public.materials 
  FOR UPDATE 
  USING (true);

-- Создаем политику, которая разрешает всем удалять материалы
CREATE POLICY "Anyone can delete materials" 
  ON public.materials 
  FOR DELETE 
  USING (true);
