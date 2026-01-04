import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CourseModule } from '@/types/material';
import ModuleCard from '@/components/course/ModuleCard';
import ModuleForm from '@/components/course/ModuleForm';
import ModuleHistoryDialog from '@/components/course/ModuleHistoryDialog';
import { useLanguage } from '@/contexts/LanguageContext';
// Імпортуємо наш клієнт Supabase
import { supabase } from '@/lib/supabaseClient';

const CourseStructure = () => {
  const { t } = useLanguage();
  // Початковий стан - порожній масив, чекаємо завантаження
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | undefined>(undefined);
  const [historyModule, setHistoryModule] = useState<CourseModule | undefined>(undefined);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { toast } = useToast();

  // 1. ЗАВАНТАЖЕННЯ ДАНИХ З SUPABASE
  const fetchModules = async () => {
    try {
      setLoading(true);
      // Запит до таблиці 'courses' (припускаємо, що модулі це курси)
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Мапимо дані з БД у формат твого інтерфейсу
      setModules(data as CourseModule[]);
    } catch (error: any) {
      console.error('Error fetching modules:', error);
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити модулі",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Викликаємо завантаження при старті
  useEffect(() => {
    fetchModules();
  }, []);

  // 2. ДОДАВАННЯ МОДУЛЯ
  const handleAddModule = async (moduleData: Omit<CourseModule, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('modules')
        .insert([{
          course_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          title: moduleData.title,
          description: moduleData.description,
          is_published: true
        }])
        .select();

      if (error) throw error;

      if (data) {
        setModules([...modules, data[0] as CourseModule]);
        toast({
          title: t('course-structure.module-added'),
          description: `"${data[0].title}" ${t('course-structure.module-added-desc')}`,
        });
      }
    } catch (error: any) {
      toast({ title: "Помилка", description: error.message, variant: "destructive" });
    }
  };

  // 3. ОНОВЛЕННЯ МОДУЛЯ
  const handleUpdateModule = async (moduleData: Omit<CourseModule, 'id'>) => {
    if (!editingModule) return;

    try {
      const { data, error } = await supabase
        .from('modules')
        .update({
          title: moduleData.title,
          description: moduleData.description,
        })
        .eq('id', editingModule.id)
        .select();

      if (error) throw error;

      if (data) {
        // Оновлюємо список локально
        setModules(modules.map(m => m.id === editingModule.id ? (data[0] as CourseModule) : m));

        toast({
          title: t('course-structure.module-updated'),
          description: `"${data[0].title}" оновлено успішно`,
        });
      }
    } catch (error: any) {
      toast({ title: "Помилка", description: error.message, variant: "destructive" });
    }
  };

  // 4. ВИДАЛЕННЯ МОДУЛЯ
  const handleDeleteModule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setModules(modules.filter(m => m.id !== id));
      toast({
        title: t('course-structure.module-deleted'),
        description: t('course-structure.module-deleted-desc'),
      });
    } catch (error: any) {
      toast({ title: "Помилка", description: error.message, variant: "destructive" });
    }
  };

  const handleEditModule = (module: CourseModule) => {
    setEditingModule(module);
    setIsFormOpen(true);
  };

  const handleViewHistory = (module: CourseModule) => {
    setHistoryModule(module);
    setIsHistoryOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingModule(undefined);
  };

  const handleFormSave = (moduleData: Omit<CourseModule, 'id'>) => {
    if (editingModule) {
      handleUpdateModule(moduleData);
    } else {
      handleAddModule(moduleData);
    }
  };

  const handleHistoryClose = () => {
    setIsHistoryOpen(false);
    setHistoryModule(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col bg-trading-dark text-white">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{t('course-structure.title')}</h1>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> {t('course-structure.add')}
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-10">Завантаження...</div>
        ) : modules.length === 0 ? (
          <div className="text-center p-10 border border-dashed border-gray-700 rounded-lg">
            <p className="text-gray-400">{t('course-structure.no-modules')}</p>
            <Button className="mt-4" onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> {t('course-structure.add')}
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map(module => (
              <ModuleCard
                key={module.id}
                module={module}
                onEdit={handleEditModule}
                onDelete={handleDeleteModule}
                onViewHistory={handleViewHistory}
              />
            ))}
          </div>
        )}

        <div className="mt-12 max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-300 leading-relaxed italic">
            "Обучение в этой системе напоминает сборку высокоточного механизма..."
          </p>
        </div>

        <ModuleForm
          open={isFormOpen}
          onClose={handleFormClose}
          onSave={handleFormSave}
          editingModule={editingModule}
        />

        <ModuleHistoryDialog
          module={historyModule}
          isOpen={isHistoryOpen}
          onClose={handleHistoryClose}
        />
      </main>

      <Footer />
    </div>
  );
};

export default CourseStructure;
