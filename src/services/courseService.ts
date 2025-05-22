
import { CourseModule } from '../types/material';

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
    ]
  },
  {
    id: '2',
    title: "Стратегии ProTrader",
    topics: [
      "Трендовые стратегии",
      "Контртрендовые подходы",
      "Торговля на пробой",
      "Свечные паттерны и их интерпретация"
    ]
  },
  {
    id: '3',
    title: "Индикаторы и их применение",
    topics: [
      "Собственные индикаторы системы",
      "Оптимальные настройки для разных рынков",
      "Фильтрация ложных сигналов",
      "Комбинирование индикаторов"
    ]
  },
  {
    id: '4',
    title: "Риск-менеджмент",
    topics: [
      "Калькуляция рисков на позицию",
      "Антимартингейл и защита депозита",
      "Диверсификация торговых инструментов",
      "Построение торгового портфеля"
    ]
  },
  {
    id: '5',
    title: "Психология трейдинга",
    topics: [
      "Контроль эмоций во время торговли",
      "Дисциплина и следование системе",
      "Преодоление психологических барьеров",
      "Дневник трейдера и анализ ошибок"
    ]
  },
  {
    id: '6',
    title: "Продвинутые техники",
    topics: [
      "Взаимосвязь рынков и корреляции",
      "Торговля на новостях и фундаментальный анализ",
      "Сезонность и циклы рынка",
      "Автоматизация торговых стратегий"
    ]
  }
];

// Хранение в памяти
let courseModules = [...initialModules];

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
    id: Date.now().toString()
  };
  
  courseModules = [...courseModules, newModule];
  return newModule;
};

export const updateModule = (id: string, updates: Partial<Omit<CourseModule, 'id'>>): CourseModule | null => {
  const index = courseModules.findIndex(module => module.id === id);
  if (index === -1) return null;
  
  const updatedModule = { ...courseModules[index], ...updates };
  courseModules = [...courseModules.slice(0, index), updatedModule, ...courseModules.slice(index + 1)];
  return updatedModule;
};

export const deleteModule = (id: string): boolean => {
  const initialLength = courseModules.length;
  courseModules = courseModules.filter(module => module.id !== id);
  return courseModules.length !== initialLength;
};

