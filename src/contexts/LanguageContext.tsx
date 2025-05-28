
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ru' | 'uk';

interface Translation {
  [key: string]: string;
}

interface Translations {
  ru: Translation;
  uk: Translation;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Translations = {
  ru: {
    // Header
    'nav.overview': 'Обзор',
    'nav.beginner-training': 'Обучение для начинающих',
    'nav.my-courses': 'Мои курсы',
    'nav.psychology': 'Психология',
    'nav.risk-management': 'Риск-менеджмент',
    'nav.materials': 'Материалы',
    'nav.course-structure': 'Структура курса',
    'nav.protected-view': 'Protected View',
    
    // My Courses page
    'mycourses.title': 'Мои курсы',
    'mycourses.breadcrumb': 'Мои курсы',
    'mycourses.lessons': 'Уроков',
    'mycourses.tests': 'Тестов',
    'mycourses.blocks': 'блока',
    'mycourses.status.in-progress': 'В процессе',
    'mycourses.status.completed': 'Завершен',
    'mycourses.status.not-started': 'Не начат',
    'mycourses.progress': 'Прогресс Курса:',
    'mycourses.continue': 'Продолжить курс',
    'mycourses.no-courses': 'У вас пока нет активных курсов',
    'mycourses.find-courses': 'Найти курсы',
    
    // Footer
    'footer.rights': '© 2025 ProTrader Systems. Все права защищены.',
    'footer.disclaimer': 'Только для образовательных целей. Не является финансовой консультацией.',
    
    // Course details
    'course.big-trading-title': 'Big trading course',
    'course.big-trading-description': 'Крупнейший бесплатный курс по трейдингу от практикующих трейдеров. За 8 модулей ты получишь системные знания, разберешься в рынках и поймешь, какой стиль торговли подходит именно тебе.'
  },
  uk: {
    // Header
    'nav.overview': 'Огляд',
    'nav.beginner-training': 'Навчання для початківців',
    'nav.my-courses': 'Мої курси',
    'nav.psychology': 'Психологія',
    'nav.risk-management': 'Ризик-менеджмент',
    'nav.materials': 'Матеріали',
    'nav.course-structure': 'Структура курсу',
    'nav.protected-view': 'Захищений вигляд',
    
    // My Courses page
    'mycourses.title': 'Мої курси',
    'mycourses.breadcrumb': 'Мої курси',
    'mycourses.lessons': 'Уроків',
    'mycourses.tests': 'Тестів',
    'mycourses.blocks': 'блоки',
    'mycourses.status.in-progress': 'В процесі',
    'mycourses.status.completed': 'Завершено',
    'mycourses.status.not-started': 'Не розпочато',
    'mycourses.progress': 'Прогрес курсу:',
    'mycourses.continue': 'Продовжити курс',
    'mycourses.no-courses': 'У вас поки немає активних курсів',
    'mycourses.find-courses': 'Знайти курси',
    
    // Footer
    'footer.rights': '© 2025 ProTrader Systems. Всі права захищені.',
    'footer.disclaimer': 'Тільки для освітніх цілей. Не є фінансовою консультацією.',
    
    // Course details
    'course.big-trading-title': 'Big trading course',
    'course.big-trading-description': 'Найбільший безкоштовний курс з трейдингу від практикуючих трейдерів. За 8 модулів ти отримаєш системні знання, розберешся в ринках і зрозумієш, який стиль торгівлі підходить саме тобі.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ru');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
