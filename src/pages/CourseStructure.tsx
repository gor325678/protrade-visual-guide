
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CourseModule } from '@/types/material';
import ModuleCard from '@/components/course/ModuleCard';
import ModuleForm from '@/components/course/ModuleForm';
import { 
  getAllModules, 
  addModule, 
  updateModule, 
  deleteModule 
} from '@/services/courseService';

const CourseStructure = () => {
  const [modules, setModules] = useState<CourseModule[]>(getAllModules());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | undefined>(undefined);
  const { toast } = useToast();

  const handleAddModule = (moduleData: Omit<CourseModule, 'id'>) => {
    const newModule = addModule(moduleData);
    setModules(getAllModules());
    toast({
      title: "Модуль добавлен",
      description: `"${newModule.title}" успешно добавлен в структуру курса.`,
    });
  };

  const handleUpdateModule = (moduleData: Omit<CourseModule, 'id'>) => {
    if (!editingModule) return;
    
    const updatedModule = updateModule(editingModule.id, moduleData);
    if (updatedModule) {
      setModules(getAllModules());
      toast({
        title: "Модуль обновлен",
        description: `"${updatedModule.title}" успешно обновлен.`,
      });
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
        title: "Модуль удален",
        description: "Модуль был успешно удален из структуры курса.",
      });
    }
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

  return (
    <div className="min-h-screen flex flex-col bg-trading-dark text-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Управление структурой курса</h1>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Добавить модуль
          </Button>
        </div>
        
        {modules.length === 0 ? (
          <div className="text-center p-10 border border-dashed border-gray-700 rounded-lg">
            <p className="text-gray-400">Модули курса отсутствуют. Добавьте свой первый модуль.</p>
            <Button className="mt-4" onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Добавить модуль
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
              />
            ))}
          </div>
        )}
        
        <ModuleForm
          open={isFormOpen}
          onClose={handleFormClose}
          onSave={handleFormSave}
          editingModule={editingModule}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseStructure;
