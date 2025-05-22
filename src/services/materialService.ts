
import { Material, MaterialType } from '../types/material';

// Initial dummy data
const initialMaterials: Material[] = [
  {
    id: '1',
    title: 'Основы технического анализа',
    description: 'Введение в теханализ для начинающих трейдеров',
    type: 'video',
    url: 'https://example.com/video1',
    dateAdded: new Date('2023-01-15')
  },
  {
    id: '2',
    title: 'Свечные паттерны',
    description: 'Как распознавать и использовать японские свечные модели',
    type: 'article',
    url: 'https://example.com/article1',
    dateAdded: new Date('2023-02-10')
  },
  {
    id: '3',
    title: 'Полный курс по Price Action',
    description: 'Торговля на основе ценового действия без индикаторов',
    type: 'course',
    url: 'https://example.com/course1',
    dateAdded: new Date('2023-03-05')
  },
  {
    id: '4',
    title: 'График GBP/NZD',
    description: 'График торговой пары для анализа',
    type: 'image',
    imageUrl: '/lovable-uploads/bc061cd0-6147-4c2b-8788-9fbadd5d9608.png',
    dateAdded: new Date('2023-04-01')
  }
];

// In-memory storage
let materials = [...initialMaterials];

// Service functions
export const getAllMaterials = (): Material[] => {
  return [...materials];
};

export const getMaterialById = (id: string): Material | undefined => {
  return materials.find(material => material.id === id);
};

export const addMaterial = (material: Omit<Material, 'id' | 'dateAdded'>): Material => {
  const newMaterial = {
    ...material,
    id: Date.now().toString(), // Simple ID generation
    dateAdded: new Date()
  };
  
  materials = [...materials, newMaterial];
  return newMaterial;
};

export const updateMaterial = (id: string, updates: Partial<Omit<Material, 'id' | 'dateAdded'>>): Material | null => {
  const index = materials.findIndex(material => material.id === id);
  if (index === -1) return null;
  
  const updatedMaterial = { ...materials[index], ...updates };
  materials = [...materials.slice(0, index), updatedMaterial, ...materials.slice(index + 1)];
  return updatedMaterial;
};

export const deleteMaterial = (id: string): boolean => {
  const initialLength = materials.length;
  materials = materials.filter(material => material.id !== id);
  return materials.length !== initialLength;
};

// Функция для получения изображений
export const getImages = (): Material[] => {
  return materials.filter(material => material.type === 'image');
};

