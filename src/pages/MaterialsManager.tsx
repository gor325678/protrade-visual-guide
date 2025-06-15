
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import MaterialCard from '@/components/materials/MaterialCard';
import MaterialForm from '@/components/materials/MaterialForm';
import { Material } from '@/types/material';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  getAllMaterials, 
  addMaterial, 
  updateMaterial, 
  deleteMaterial 
} from '@/services/materialService';

const MaterialsManager = () => {
  const { t } = useLanguage();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Загрузка материалов при монтировании компонента
  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setIsLoading(true);
      const data = await getAllMaterials();
      setMaterials(data);
    } catch (error) {
      console.error('Error loading materials:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить материалы',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMaterial = async (materialData: Omit<Material, 'id' | 'dateAdded'>) => {
    try {
      const newMaterial = await addMaterial(materialData);
      if (newMaterial) {
        await loadMaterials(); // Перезагружаем список
        toast({
          title: t('materials.added'),
          description: `"${newMaterial.title}" ${t('materials.added-desc')}`,
        });
      }
    } catch (error) {
      console.error('Error adding material:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить материал',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateMaterial = async (materialData: Omit<Material, 'id' | 'dateAdded'>) => {
    if (!editingMaterial) return;
    
    try {
      const updatedMaterial = await updateMaterial(editingMaterial.id, materialData);
      if (updatedMaterial) {
        await loadMaterials(); // Перезагружаем список
        toast({
          title: t('materials.updated'),
          description: `"${updatedMaterial.title}" ${t('materials.updated-desc')}`,
        });
      }
    } catch (error) {
      console.error('Error updating material:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить материал',
        variant: 'destructive',
      });
    }
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setIsFormOpen(true);
  };

  const handleDeleteMaterial = async (id: string) => {
    try {
      const success = await deleteMaterial(id);
      if (success) {
        await loadMaterials(); // Перезагружаем список
        toast({
          title: t('materials.deleted'),
          description: t('materials.deleted-desc'),
        });
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить материал',
        variant: 'destructive',
      });
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingMaterial(undefined);
  };

  const handleFormSave = (materialData: Omit<Material, 'id' | 'dateAdded'>) => {
    if (editingMaterial) {
      handleUpdateMaterial(materialData);
    } else {
      handleAddMaterial(materialData);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-trading-dark text-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center p-10">
            <p className="text-gray-400">Загрузка материалов...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-trading-dark text-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{t('materials.title')}</h1>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> {t('materials.add')}
          </Button>
        </div>
        
        {materials.length === 0 ? (
          <div className="text-center p-10 border border-dashed border-gray-700 rounded-lg">
            <p className="text-gray-400">{t('materials.no-materials')}</p>
            <Button className="mt-4" onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> {t('materials.add')}
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {materials.map(material => (
              <MaterialCard
                key={material.id}
                material={material}
                onEdit={handleEditMaterial}
                onDelete={handleDeleteMaterial}
              />
            ))}
          </div>
        )}
        
        <MaterialForm
          open={isFormOpen}
          onClose={handleFormClose}
          onSave={handleFormSave}
          editingMaterial={editingMaterial}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default MaterialsManager;
