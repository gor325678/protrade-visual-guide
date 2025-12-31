import React, { useState } from 'react';
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
import {
  getAllModules,
  addModule,
  updateModule,
  deleteModule
} from '@/services/courseService';

const CourseStructure = () => {
  const { t } = useLanguage();
  const [modules, setModules] = useState<CourseModule[]>(getAllModules());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | undefined>(undefined);
  const [historyModule, setHistoryModule] = useState<CourseModule | undefined>(undefined);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { toast } = useToast();

  const handleAddModule = (moduleData: Omit<CourseModule, 'id'>) => {
    const newModule = addModule(moduleData);
    setModules(getAllModules());
    toast({
      title: t('course-structure.module-added'),
      description: `"${newModule.title}" ${t('course-structure.module-added-desc')}`,
    });
  };

  const handleUpdateModule = (moduleData: Omit<CourseModule, 'id'>) => {
    if (!editingModule) return;

    const updatedModule = updateModule(editingModule.id, moduleData);
    if (updatedModule) {
      setModules(getAllModules());

      // Special message for the Forex basics module
      if (updatedModule.id === '1' || updatedModule.title === "Основы торговли на Форекс") {
        toast({
          title: t('course-structure.module-updated'),
          description: `"${updatedModule.title}" ${t('course-structure.module-updated-history')}`,
        });
      } else {
        toast({
          title: t('course-structure.module-updated'),
          description: `"${updatedModule.title}" ${t('course-structure.module-updated-desc')}`,
        });
      }
    }
  };

  const handleEditModule = (module: CourseModule) => {
    setEditingModule(module);
    setIsFormOpen(true);
  };

  const handleDeleteModule = (id: string) => {
    const success = deleteModule(id);
    if (success) {
      setModules(getAllModules());
      toast({
        title: t('course-structure.module-deleted'),
        description: t('course-structure.module-deleted-desc'),
      });
    }
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

        {modules.length === 0 ? (
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
            "Обучение в этой системе напоминает сборку высокоточного механизма: сначала вы изучаете каждую деталь (индикаторы), затем понимаете среду, в которой он работает (режимы цены), и только после этого приступаете к запуску (входам) сопровождению и управлению процессом (выходам)."
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
      </main >

      <Footer />
    </div >
  );
};

export default CourseStructure;
