import { CourseModule, ModuleChange } from '../types/material';

// Ключи для localStorage
const MODULE_STORAGE_KEY = 'course_modules';

// Начальные данные для модулей курса
const initialModules: CourseModule[] = [
  {
    id: '1',
    title: "Этап 1: Философия и этика торговой системы",
    topics: [
      "Фундаментальные принципы: Изучение концепции, основанной на трех китах: рыночном импульсе, ускорении прибыли и своевременном выходе.",
      "Дисциплина трейдера: Изучение «десяти заповедей», которые включают обязательное следование инструкциям, работу с графическими шаблонами и важность выполнения практических заданий.",
      "Процесс обучения: Понимание того, что система собирается как «пазл», где каждый новый элемент опирается на предыдущий."
    ],
    history: []
  },
  {
    id: '2',
    title: "Этап 2: Инструментарий и техническая база",
    topics: [
      "Долгосрочный ориентир: Использование индикатора с большим периодом, который выступает в роли «базового уровня», к которому цена стремится вернуться.",
      "Среднесрочный фильтр: Использование индикатора для определения текущего момента и краткосрочного направления движения.",
      "Реактивные линии тренда: Применение пары сверхбыстрых линий, основанных на ценах открытия и закрытия, для максимально точного определения точек входа с минимальным запаздыванием.",
      "Полосы волатильности: Использование внешних границ ценового канала для оценки силы движения и внутренних «тренировочных» границ для подтверждения достаточной волатильности.",
      "Индикаторы рыночного уклона: Изучение двух инструментов, один из которых показывает состояние текущего временного интервала, а другой — более высокого (в 4–6 раз больше рабочего), для определения «истинного технического тренда».",
      "Информационная панель импульса: Анализ сводных данных о состоянии рынка на всех таймфреймах одновременно (от минутного до дневного) для подтверждения входа."
    ],
    history: []
  },
  {
    id: '3',
    title: "Этап 3: Анализ рыночного контекста (Ценовые режимы)",
    topics: [
      "Трендовый режим: Состояние, при котором полосы волатильности расширяются или направлены в одну сторону вместе с ценой.",
      "Контр-трендовый режим: Кратковременное движение цены и средних линий против основного технического направления.",
      "Зона консолидации: Сужение полос волатильности, указывающее на временное затишье и подготовку к прорыву.",
      "«Прерывистый» рынок: Непредсказуемое поведение цены с частой сменой цвета индикаторов смещения и отсутствием чёткого направления.",
      "Зона застоя: Длительное нахождение цены в очень узком диапазоне непосредственно вокруг долгосрочного индикатора."
    ],
    history: []
  },
  {
    id: '4',
    title: "Этап 4: Стратегии входа в сделку",
    topics: [
      "Вход в начале нового тренда: Метод, требующий пересечения быстрых линий, специфического паттерна (не более чем за 5 баров) и согласованности большинства подтверждающих факторов (индикаторов смещения и импульса).",
      "Вход на продолжение движения: Метод открытия позиции внутри уже существующего тренда, когда цена касается или пересекает быстрые трендовые линии после небольшой паузы.",
      "Вход на прорыве консолидации: Специальная техника для ситуаций, когда цена выходит из узкого бокового диапазона, подтвержденная полосами волатильности.",
      "Фильтрация сделок: Обязательная проверка на отсутствие «аномально длинных свечей», которые часто предшествуют глубоким откатам и делают вход опасным."
    ],
    history: []
  },
  {
    id: '5',
    title: "Этап 5: Управление рисками и выход из позиций",
    topics: [
      "Определение уровней: Правила установки защитного стоп-лосса (минимум 12–15 пунктов для пятиминутного графика) и расчета «допуска на вход» выше или ниже сигнальной свечи.",
      "Сопровождение сделки: Использование динамического ценового канала для подтягивания стоп-лосса и защиты прибыли.",
      "Техника частичного закрытия: Разделение позиции на части, где одна фиксируется при достижении целей, а вторая остается в рынке («раннер») для максимизации прибыли от тренда.",
      "Глобальный контекст: Учет новостей, решений центральных банков и геополитических факторов для понимания того, стоит ли вообще открывать сделку в данный день."
    ],
    history: []
  },
  {
    id: '6',
    title: "Этап 6: Продвинутые методы",
    topics: [
      "Масштабирование: Техника добавления новых единиц к уже прибыльной позиции, что позволяет кратно увеличить итоговый результат при сохранении контролируемого риска.",
      "Специализированные каналы: Использование дополнительных графических инструментов для определения зон экстремального истощения тренда и финального выхода из рынка."
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
