
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import MaterialCard from '@/components/materials/MaterialCard';
import MaterialForm from '@/components/materials/MaterialForm';
import { Material } from '@/types/material';
import { 
  getAllMaterials, 
  addMaterial, 
  updateMaterial, 
  deleteMaterial 
} from '@/services/materialService';

const MaterialsManager = () => {
  const [materials, setMaterials] = useState<Material[]>(getAllMaterials());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | undefined>(undefined);
  const { toast } = useToast();

  const handleAddMaterial = (materialData: Omit<Material, 'id' | 'dateAdded'>) => {
    const newMaterial = addMaterial(materialData);
    setMaterials(getAllMaterials());
    toast({
      title: "Материал добавлен",
      description: `"${newMaterial.title}" успешно добавлен в библиотеку.`,
    });
  };

  const handleUpdateMaterial = (materialData: Omit<Material, 'id' | 'dateAdded'>) => {
    if (!editingMaterial) return;
    
    const updatedMaterial = updateMaterial(editingMaterial.id, materialData);
    if (updatedMaterial) {
      setMaterials(getAllMaterials());
      toast({
        title: "Материал обновлен",
        description: `"${updatedMaterial.title}" успешно обновлен.`,
      });
    }
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setIsFormOpen(true);
  };

  const handleDeleteMaterial = (id: string) => {
    const success = deleteMaterial(id);
    if (success) {
      setMaterials(getAllMaterials());
      toast({
        title: "Материал удален",
        description: "Материал был успешно удален из библиотеки.",
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

  return (
    <div className="min-h-screen flex flex-col bg-trading-dark text-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Управление материалами</h1>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Добавить материал
          </Button>
        </div>
        
        {materials.length === 0 ? (
          <div className="text-center p-10 border border-dashed border-gray-700 rounded-lg">
            <p className="text-gray-400">Материалы отсутствуют. Добавьте свой первый материал.</p>
            <Button className="mt-4" onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Добавить материал
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
