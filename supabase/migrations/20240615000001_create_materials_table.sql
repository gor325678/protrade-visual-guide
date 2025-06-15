
-- Create materials table
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('video', 'article', 'course', 'ebook', 'image')),
    url TEXT,
    image_url TEXT,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (you can restrict this later based on your auth requirements)
CREATE POLICY "Allow all operations on materials" ON public.materials
    FOR ALL USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_materials_updated_at
    BEFORE UPDATE ON public.materials
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert initial dummy data
INSERT INTO public.materials (title, description, type, url, image_url) VALUES
('Основы технического анализа', 'Введение в теханализ для начинающих трейдеров', 'video', 'https://example.com/video1', NULL),
('Свечные паттерны', 'Как распознавать и использовать японские свечные модели', 'article', 'https://example.com/article1', NULL),
('Полный курс по Price Action', 'Торговля на основе ценового действия без индикаторов', 'course', 'https://example.com/course1', NULL),
('График GBP/NZD', 'График торговой пары для анализа', 'image', NULL, '/lovable-uploads/bc061cd0-6147-4c2b-8788-9fbadd5d9608.png');
