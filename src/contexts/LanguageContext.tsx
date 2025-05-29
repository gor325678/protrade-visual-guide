
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
    'course.big-trading-description': 'Крупнейший бесплатный курс по трейдингу от практикующих трейдеров. За 8 модулей ты получишь системные знания, разберешься в рынках и поймешь, какой стиль торговли подходит именно тебе.',
    
    // BeginnerTraining page
    'beginner.title': 'Обучение для начинающих',
    'beginner.subtitle': 'Базовые знания и концепции для тех, кто только начинает знакомство с торговлей на Форекс',
    'beginner.add-topic': 'Добавить тему',
    'beginner.video-materials': 'Видео материалы:',
    'beginner.watch': 'Смотреть',
    'beginner.add-video': 'Добавить видео',
    'beginner.edit': 'Изменить',
    'beginner.delete': 'Удалить',
    'beginner.no-topics': 'Темы для обучения отсутствуют. Добавьте вашу первую тему.',
    'beginner.edit-topic': 'Редактировать тему',
    'beginner.add-new-topic': 'Добавить новую тему',
    'beginner.edit-description': 'Внесите изменения в учебную тему и сохраните их.',
    'beginner.add-description': 'Заполните информацию для новой учебной темы.',
    'beginner.topic-title': 'Название темы',
    'beginner.content': 'Содержание',
    'beginner.difficulty': 'Уровень сложности',
    'beginner.difficulty.beginner': 'Начинающий',
    'beginner.difficulty.intermediate': 'Средний',
    'beginner.difficulty.advanced': 'Продвинутый',
    'beginner.cancel': 'Отмена',
    'beginner.save-changes': 'Сохранить изменения',
    'beginner.add-topic-btn': 'Добавить тему',
    'beginner.topic-added': 'Тема добавлена',
    'beginner.topic-added-desc': 'Новая учебная тема была успешно добавлена.',
    'beginner.topic-updated': 'Тема обновлена',
    'beginner.topic-updated-desc': 'Учебная тема была успешно обновлена.',
    'beginner.topic-deleted': 'Тема удалена',
    'beginner.topic-deleted-desc': 'Учебная тема была удалена из системы.',
    'beginner.video-added': 'Видео добавлено',
    'beginner.video-added-desc': 'Видео было успешно добавлено к теме.',
    
    // Psychology page
    'psychology.title': 'Психология трейдинга',
    'psychology.description': 'Эта страница будет содержать материалы о психологии трейдинга.',
    
    // Risk Management page
    'risk.title': 'Риск-менеджмент',
    'risk.description': 'Эта страница будет содержать материалы о управлении рисками в трейдинге.',
    
    // About page
    'about.title': 'О системе ProTrader',
    'about.description': 'Эта страница будет содержать информацию о системе ProTrader.',
    
    // Materials Manager page
    'materials.title': 'Управление материалами',
    'materials.add': 'Добавить материал',
    'materials.no-materials': 'Материалы отсутствуют. Добавьте свой первый материал.',
    'materials.added': 'Материал добавлен',
    'materials.added-desc': 'успешно добавлен в библиотеку.',
    'materials.updated': 'Материал обновлен',
    'materials.updated-desc': 'успешно обновлен.',
    'materials.deleted': 'Материал удален',
    'materials.deleted-desc': 'Материал был успешно удален из библиотеки.',
    
    // Course Structure page
    'course-structure.title': 'Управление структурой курса',
    'course-structure.add': 'Добавить модуль',
    'course-structure.no-modules': 'Модули курса отсутствуют. Добавьте свой первый модуль.',
    'course-structure.module-added': 'Модуль добавлен',
    'course-structure.module-added-desc': 'успешно добавлен в структуру курса.',
    'course-structure.module-updated': 'Модуль обновлен',
    'course-structure.module-updated-desc': 'успешно обновлен.',
    'course-structure.module-updated-history': 'успешно обновлен. Изменения сохранены в истории.',
    'course-structure.module-deleted': 'Модуль удален',
    'course-structure.module-deleted-desc': 'Модуль был успешно удален из структуры курса.',
    
    // Home page
    'home.course-structure': 'Структура курса',
    'home.course-description': 'Комплексная программа обучения, охватывающая все аспекты торговли на Форекс — от базовых концепций до продвинутых стратегий и психологии трейдинга'
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
    'course.big-trading-description': 'Найбільший безкоштовний курс з трейдингу від практикуючих трейдерів. За 8 модулів ти отримаєш системні знання, розберешся в ринках і зрозумієш, який стиль торгівлі підходить саме тобі.',
    
    // BeginnerTraining page
    'beginner.title': 'Навчання для початківців',
    'beginner.subtitle': 'Базові знання та концепції для тих, хто тільки починає знайомство з торгівлею на Форекс',
    'beginner.add-topic': 'Додати тему',
    'beginner.video-materials': 'Відео матеріали:',
    'beginner.watch': 'Дивитися',
    'beginner.add-video': 'Додати відео',
    'beginner.edit': 'Змінити',
    'beginner.delete': 'Видалити',
    'beginner.no-topics': 'Теми для навчання відсутні. Додайте вашу першу тему.',
    'beginner.edit-topic': 'Редагувати тему',
    'beginner.add-new-topic': 'Додати нову тему',
    'beginner.edit-description': 'Внесіть зміни в навчальну тему та збережіть їх.',
    'beginner.add-description': 'Заповніть інформацію для нової навчальної теми.',
    'beginner.topic-title': 'Назва теми',
    'beginner.content': 'Зміст',
    'beginner.difficulty': 'Рівень складності',
    'beginner.difficulty.beginner': 'Початківець',
    'beginner.difficulty.intermediate': 'Середній',
    'beginner.difficulty.advanced': 'Просунутий',
    'beginner.cancel': 'Скасувати',
    'beginner.save-changes': 'Зберегти зміни',
    'beginner.add-topic-btn': 'Додати тему',
    'beginner.topic-added': 'Тему додано',
    'beginner.topic-added-desc': 'Нову навчальну тему було успішно додано.',
    'beginner.topic-updated': 'Тему оновлено',
    'beginner.topic-updated-desc': 'Навчальну тему було успішно оновлено.',
    'beginner.topic-deleted': 'Тему видалено',
    'beginner.topic-deleted-desc': 'Навчальну тему було видалено із системи.',
    'beginner.video-added': 'Відео додано',
    'beginner.video-added-desc': 'Відео було успішно додано до теми.',
    
    // Psychology page
    'psychology.title': 'Психологія трейдингу',
    'psychology.description': 'Ця сторінка міститиме матеріали про психологію трейдингу.',
    
    // Risk Management page
    'risk.title': 'Ризик-менеджмент',
    'risk.description': 'Ця сторінка міститиме матеріали про управління ризиками в трейдингу.',
    
    // About page
    'about.title': 'Про систему ProTrader',
    'about.description': 'Ця сторінка міститиме інформацію про систему ProTrader.',
    
    // Materials Manager page
    'materials.title': 'Управління матеріалами',
    'materials.add': 'Додати матеріал',
    'materials.no-materials': 'Матеріали відсутні. Додайте свій перший матеріал.',
    'materials.added': 'Матеріал додано',
    'materials.added-desc': 'успішно додано до бібліотеки.',
    'materials.updated': 'Матеріал оновлено',
    'materials.updated-desc': 'успішно оновлено.',
    'materials.deleted': 'Матеріал видалено',
    'materials.deleted-desc': 'Матеріал було успішно видалено з бібліотеки.',
    
    // Course Structure page
    'course-structure.title': 'Управління структурою курсу',
    'course-structure.add': 'Додати модуль',
    'course-structure.no-modules': 'Модулі курсу відсутні. Додайте свій перший модуль.',
    'course-structure.module-added': 'Модуль додано',
    'course-structure.module-added-desc': 'успішно додано до структури курсу.',
    'course-structure.module-updated': 'Модуль оновлено',
    'course-structure.module-updated-desc': 'успішно оновлено.',
    'course-structure.module-updated-history': 'успішно оновлено. Зміни збережено в історії.',
    'course-structure.module-deleted': 'Модуль видалено',
    'course-structure.module-deleted-desc': 'Модуль було успішно видалено зі структури курсу.',
    
    // Home page
    'home.course-structure': 'Структура курсу',
    'home.course-description': 'Комплексна програма навчання, що охоплює всі аспекти торгівлі на Форекс — від базових концепцій до просунутих стратегій та психології трейдингу'
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
