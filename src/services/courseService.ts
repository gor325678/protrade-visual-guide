
import { CourseModule, ModuleChange } from '../types/material';

// Ключи для localStorage
const MODULE_STORAGE_KEY = 'course_modules';

// Начальные данные для модулей курса
const initialModules: CourseModule[] = [
  {
    id: '1',
    title: "Основы торговли на Форекс",
    topics: [
      "Структура и участники рынка Форекс",
      "Типы ордеров и их исполнение",
      "Торговые сессии и ликвидность",
      "Основы технического анализа"
    ],
    history: []
  },
  {
    id: '2',
    title: "Стратегии ProTrader",
    topics: [
      "Трендовые стратегии",
      "Контртрендовые подходы",
      "Торговля на пробой",
      "Свечные паттерны и их интерпретация"
    ],
    history: []
  },
  {
    id: '3',
    title: "Индикаторы и их применение",
    topics: [
      "Собственные индикаторы системы",
      "Оптимальные настройки для разных рынков",
      "Фильтрация ложных сигналов",
      "Комбинирование индикаторов"
    ],
    history: []
  },
  {
    id: '4',
    title: "Риск-менеджмент",
    topics: [
      "Калькуляция рисков на позицию",
      "Антимартингейл и защита депозита",
      "Диверсификация торговых инструментов",
      "Построение торгового портфеля"
    ],
    history: []
  },
  {
    id: '5',
    title: "Психология трейдинга",
    topics: [
      "Контроль эмоций во время торговли",
      "Дисциплина и следование системе",
      "Преодоление психологических барьеров",
      "Дневник трейдера и анализ ошибок"
    ],
    history: []
  },
  {
    id: '6',
    title: "Продвинутые техники",
    topics: [
      "Взаимосвязь рынков и корреляции",
      "Торговля на новостях и фундаментальный анализ",
      "Сезонность и циклы рынка",
      "Автоматизация торговых стратегий"
    ],
    history: []
  }
];

// Получение модулей из localStorage или использование начальных данных
const getStoredModules = (): CourseModule[] => {
  try {
    const stored = localStorage.getItem(MODULE_STORAGE_KEY);
    if (stored) {
      const parsedModules = JSON.parse(stored);
      
      // Преобразование строковых дат обратно в объекты Date
      return parsedModules.map((module: any) => ({
        ...module,
        history: module.history ? module.history.map((change: any) => ({
          ...change,
          date: new Date(change.date)
        })) : []
      }));
    }
  } catch (error) {
    console.error("Ошибка получения модулей из localStorage:", error);
  }
  return [...initialModules];
};

// Сохранение модулей в localStorage
const saveModulesToStorage = (modules: CourseModule[]) => {
  try {
    localStorage.setItem(MODULE_STORAGE_KEY, JSON.stringify(modules));
  } catch (error) {
    console.error("Ошибка при сохранении модулей в localStorage:", error);
  }
};

// Инициализация модулей из хранилища
let courseModules = getStoredModules();

// Сервисные функции
export const getAllModules = (): CourseModule[] => {
  return [...courseModules];
};

export const getModuleById = (id: string): CourseModule | undefined => {
  return courseModules.find(module => module.id === id);
};

export const addModule = (module: Omit<CourseModule, 'id'>): CourseModule => {
  const newModule = {
    ...module,
    id: Date.now().toString(),
    history: []
  };
  
  courseModules = [...courseModules, newModule];
  // Сохранение в localStorage
  saveModulesToStorage(courseModules);
  return newModule;
};

export const updateModule = (id: string, updates: Partial<Omit<CourseModule, 'id' | 'history'>>): CourseModule | null => {
  const index = courseModules.findIndex(module => module.id === id);
  if (index === -1) return null;
  
  const currentModule = courseModules[index];
  
  // Create a history entry if this is "Основы торговли на Форекс" or has id '1'
  if (currentModule.id === '1' || currentModule.title === "Основы торговли на Форекс") {
    const historyEntry: ModuleChange = {
      date: new Date(),
      previousTitle: currentModule.title,
      previousTopics: [...currentModule.topics]
    };
    
    const updatedModule = { 
      ...currentModule, 
      ...updates,
      history: [...(currentModule.history || []), historyEntry]
    };
    
    courseModules = [...courseModules.slice(0, index), updatedModule, ...courseModules.slice(index + 1)];
    // Сохранение в localStorage
    saveModulesToStorage(courseModules);
    return updatedModule;
  } else {
    // For other modules, just update without tracking history
    const updatedModule = { ...currentModule, ...updates };
    courseModules = [...courseModules.slice(0, index), updatedModule, ...courseModules.slice(index + 1)];
    // Сохранение в localStorage
    saveModulesToStorage(courseModules);
    return updatedModule;
  }
};

export const deleteModule = (id: string): boolean => {
  const initialLength = courseModules.length;
  courseModules = courseModules.filter(module => module.id !== id);
  
  // Сохранение в localStorage, если были изменения
  if (courseModules.length !== initialLength) {
    saveModulesToStorage(courseModules);
    return true;
  }
  return false;
};

export const getModuleHistory = (id: string): ModuleChange[] | null => {
  const module = getModuleById(id);
  return module?.history || null;
};

export const getForexBasicsHistory = (): ModuleChange[] => {
  const forexModule = courseModules.find(m => m.id === '1' || m.title === "Основы торговли на Форекс");
  return forexModule?.history || [];
};
