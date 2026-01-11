
import {
  BookOpen,
  TrendingUp,
  Activity,
  LogOut,
  Zap,
  BarChart,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
  Calculator,
  Globe,
  PlayCircle,
  PenTool,
  HelpCircle,
  Info
} from "lucide-react";

export const session2Content = [
  {
    id: "recap-session1",
    title: "Итоги Сессии 1",
    icon: BookOpen,
    content: `
      <p class="mb-4">Этот раздел кратко напоминает ключевые моменты, рассмотренные в первой сессии, чтобы обеспечить плавный переход к новым темам.</p>
      <ul class="space-y-3 mt-4 text-gray-300">
        <li class="flex items-start gap-3">
          <span class="bg-blue-500/20 p-1 rounded text-blue-400 mt-1">💡</span>
          <span>Основные понятия ProTrader Systems.</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="bg-blue-500/20 p-1 rounded text-blue-400 mt-1">🛠️</span>
          <span>Базовые индикаторы: Канал Homebase (HB), Линия Моментума (ML), Полосы Боллинджера (BBs).</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="bg-blue-500/20 p-1 rounded text-blue-400 mt-1">🎯</span>
          <span>Введение в концепцию ProTrader Systems ETF.</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="bg-blue-500/20 p-1 rounded text-blue-400 mt-1">⚙️</span>
          <span>Начальные сетапы входа: ETF S&P MOE, ETF REMOE.</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="bg-blue-500/20 p-1 rounded text-blue-400 mt-1">🛡️</span>
          <span>Важность начального стоп-лосса (ESL).</span>
        </li>
      </ul>
    `
  },
  {
    id: "trend-definition",
    title: "Как определить тенденцию",
    icon: TrendingUp,
    content: `
      <p class="mb-4">Четкое определение текущей тенденции (тренда) является краеугольным камнем успешной торговли.</p>
      
      <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-6">
        <h3 class="text-xl font-semibold text-white mb-4">Компоненты анализа тренда</h3>
        <ul class="space-y-3 text-gray-300">
          <li class="flex items-center gap-2">📈 Взаимное расположение цены и ключевых скользящих средних (EMA).</li>
          <li class="flex items-center gap-2">🧭 Наклон и пересечение линий ETF.</li>
          <li class="flex items-center gap-2">📊 Показания индикатора-компаньона (Bias Companion).</li>
          <li class="flex items-center gap-2">👁️ Визуальный анализ структуры ценовых максимумов и минимумов.</li>
        </ul>
      </div>

      <div class="flex items-start gap-3 p-4 bg-green-900/10 border border-green-500/30 rounded-lg">
        <svg class="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <p class="text-green-300 text-sm leading-relaxed">Торговля в направлении доминирующего тренда значительно повышает вероятность успеха.</p>
      </div>
    `
  },
  {
    id: "price-regimes",
    title: "Ценовые режимы (обзор)",
    icon: Activity,
    content: `
      <p class="mb-6">Правильная идентификация режима критически важна для выбора тактики выхода.</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-5 bg-trading-card rounded-xl border border-gray-700">
          <h3 class="font-bold text-lg text-blue-400 mb-3 flex items-center gap-2">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            Локальные режимы
          </h3>
          <ul class="space-y-2 text-gray-300">
            <li>• 📈 Режим тренда</li>
            <li>• 📉 Режим контр-тренда</li>
            <li>• ↔️ Зона консолидации (CZ)</li>
          </ul>
        </div>
        
        <div class="p-5 bg-trading-card rounded-xl border border-gray-700">
          <h3 class="font-bold text-lg text-purple-400 mb-3 flex items-center gap-2">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Глобальные режимы
          </h3>
          <ul class="space-y-2 text-gray-300">
            <li>• 🌪️ "Choppy" (неровный)</li>
            <li>• 🍝 "Spaghetti Zone" (зона спагетти)</li>
          </ul>
        </div>
      </div>
    `
  },
  {
    id: "exit-techniques",
    title: "Техники выхода ProTrader Systems",
    icon: LogOut,
    content: `
      <p class="mb-4 text-lg text-gray-300">Правильный выход из сделки не менее важен, чем вход.</p>

      <div class="space-y-4">
        <div class="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50 hover:bg-gray-800/50 transition-colors">
          <h4 class="font-bold text-white mb-2">📊 Индикатор StoRSI</h4>
          <p class="text-gray-400 text-sm">Использование паттернов перекупленности/перепроданности и дивергенций.</p>
        </div>
        
        <div class="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50 hover:bg-gray-800/50 transition-colors">
          <h4 class="font-bold text-white mb-2">🕯️ Price Action</h4>
          <p class="text-gray-400 text-sm">Правило LB (Длинного Бара) и шаблон TP (Take Profit).</p>
        </div>

        <div class="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50 hover:bg-gray-800/50 transition-colors">
          <h4 class="font-bold text-white mb-2">🛡️ Аварийная остановка (ESL)</h4>
          <p class="text-gray-400 text-sm">Корректировка и трейлинг стоп-лосса.</p>
        </div>
      </div>
    `
  },
  {
    id: "storsi",
    title: "StoRSI и его паттерны",
    icon: Zap,
    content: `
      <ul class="space-y-4">
        <li class="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
          <strong class="text-blue-400 block mb-1">🔼 Верхняя / Нижняя Граница (OB/OS)</strong>
          <span class="text-gray-300">Сигналы о возможной перекупленности или перепроданности.</span>
        </li>
        <li class="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
          <strong class="text-blue-400 block mb-1">〽️ Паттерны "Ms / Ws"</strong>
          <span class="text-gray-300">Формации, указывающие на возможное ослабление или разворот тренда.</span>
        </li>
        <li class="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
          <strong class="text-blue-400 block mb-1">↔️ Регулярные расхождения (дивергенции)</strong>
          <span class="text-gray-300">Расхождение между движением цены и индикатора.</span>
        </li>
      </ul>
    `
  },
  {
    id: "price-action",
    title: "Price Action: Правило LB, Шаблон TP",
    icon: BarChart,
    content: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-xl font-bold text-white mb-3">Правило LB</h3>
          <p class="text-gray-400 mb-2 font-medium">Длинный Бар / Свеча</p>
          <p class="text-sm text-gray-500">Появление аномально длинного бара, особенно против позиции или после длительного движения, сигнализирует об истощении тренда. Рассмотрите выход.</p>
        </div>
        <div>
          <h3 class="text-xl font-bold text-white mb-3">Шаблон TP</h3>
          <p class="text-gray-400 mb-2 font-medium">Take Profit</p>
          <ul class="text-sm text-gray-500 space-y-2">
            <li>• 🎯 Ключевые уровни поддержки/сопротивления.</li>
            <li>• 🏁 Риск/Прибыль достиг планируемого.</li>
            <li>• 📉 Отклонение от Канала HB.</li>
          </ul>
        </div>
      </div>
    `
  },
  {
    id: "trend-reversal",
    title: "Разворот тренда ETF",
    icon: RefreshCcw,
    content: `
      <p class="mb-4">Сигналы, указывающие на возможный разворот и необходимость закрытия позиций.</p>
      <div class="bg-red-900/10 border border-red-500/30 p-5 rounded-xl">
        <h4 class="text-red-400 font-bold mb-3">Ключевые признаки:</h4>
        <ul class="space-y-2 text-gray-300">
          <li class="flex items-center gap-2">🔄 Пересечение линий ETF в обратном направлении.</li>
          <li class="flex items-center gap-2">🚦 Смена цвета/смещения на Bias Companion.</li>
          <li class="flex items-center gap-2">📉 Пробой ценой ключевых уровней ETF.</li>
        </ul>
      </div>
    `
  },
  {
    id: "esl-adjustments",
    title: "Корректировки ESL",
    icon: ShieldAlert,
    content: `
      <p class="mb-4">Начальный стоп-лосс не статичен. Корректируйте его ("трейлите") для защиты прибыли.</p>
      
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="p-4 bg-gray-800 rounded text-center">
          <div class="text-2xl mb-2">🔒</div>
          <div class="text-sm text-gray-300">Перенос в безубыток</div>
        </div>
        <div class="p-4 bg-gray-800 rounded text-center">
          <div class="text-2xl mb-2">📈</div>
          <div class="text-sm text-gray-300">Трейлинг за уровнями</div>
        </div>
        <div class="p-4 bg-gray-800 rounded text-center">
          <div class="text-2xl mb-2">📊</div>
          <div class="text-sm text-gray-300">Трейлинг по волатильности</div>
        </div>
      </div>
    `
  },
  {
    id: "risk-types",
    title: "Виды риска и минимизация",
    icon: ShieldCheck,
    content: `
      <div class="space-y-4">
        <div class="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6 rounded-xl border border-blue-500/20">
          <h3 class="text-xl font-bold text-white mb-4">Принципы минимизации</h3>
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-300">
            <li>🛡️ Всегда используйте стоп-лосс (ESL).</li>
            <li>💰 Фиксируйте прибыль ("Bank profit").</li>
            <li>⚖️ Правильно определяйте размер позиции.</li>
            <li>📰 Избегайте торговли на новостях.</li>
          </ul>
        </div>
        
        <div>
          <h4 class="font-bold text-white mb-2">Убыточные серии</h4>
          <p class="text-gray-400 text-sm">Важно понимать вероятность убыточных серий для психологической устойчивости. Чем выше процент выигрышных сделок (Win Rate), тем короче средняя серия убытков.</p>
        </div>
      </div>
    `
  },
  {
    id: "position-sizing",
    title: "Определение размера позиции",
    icon: Calculator,
    content: `
      <p class="mb-4 text-gray-300">Контролируйте убытки, соотнося их с капиталом.</p>
      
      <div class="bg-gray-800/50 p-5 rounded-lg border border-gray-700 space-y-4 font-mono text-sm">
        <div class="flex flex-col gap-2">
          <span class="text-gray-400">// Формула</span>
          <span class="text-green-400">Размер Сделки = Риск ($) / (SL (пп) * Стоимость пп)</span>
        </div>
        
        <div class="border-t border-gray-700 pt-4">
          <p class="text-white mb-2">Пример:</p>
          <ul class="space-y-1 text-gray-400">
            <li>Счет: $10,000</li>
            <li>Риск: 2% ($200)</li>
            <li>SL: 45 пунктов</li>
            <li>Цена пункта: $10 (лот)</li>
            <li><span class="text-yellow-400">Результат: 0.44 лота</span></li>
          </ul>
        </div>
      </div>
    `
  },
  {
    id: "global-context",
    title: "Глобальный контекст",
    icon: Globe,
    content: `
      <ul class="space-y-3">
        <li class="flex items-start gap-3">
          <span class="bg-blue-500/20 p-1 rounded text-blue-400 mt-1">⏳</span>
          <div>
            <strong class="text-white block">Старшие таймфреймы</strong>
            <span class="text-gray-400 text-sm">Анализ D1, W1, MN1 для понимания общей картины.</span>
          </div>
        </li>
        <li class="flex items-start gap-3">
          <span class="bg-blue-500/20 p-1 rounded text-blue-400 mt-1">📰</span>
          <div>
            <strong class="text-white block">Фундаментальные факторы</strong>
            <span class="text-gray-400 text-sm">Новости, экономические события, сентимент.</span>
          </div>
        </li>
      </ul>
    `
  },
  {
    id: "practice",
    title: "Практика и Симулятор",
    icon: PlayCircle,
    content: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-trading-card p-5 rounded-xl border border-gray-700">
          <h3 class="text-lg font-bold text-white mb-3">Ручная прокрутка</h3>
          <p class="text-gray-400 text-sm mb-4">"Scrolling charts" - прокрутка графика свеча за свечой.</p>
          <ul class="text-sm text-gray-500 space-y-1">
            <li>• Тренировка глаза</li>
            <li>• Анализ истории</li>
            <li>• Развитие интуиции</li>
          </ul>
        </div>
        
        <div class="bg-trading-card p-5 rounded-xl border border-gray-700">
          <h3 class="text-lg font-bold text-white mb-3">Симулятор FX</h3>
          <p class="text-gray-400 text-sm mb-4">Торговля на исторических данных в реальном времени.</p>
          <ul class="text-sm text-gray-500 space-y-1">
            <li>• Отработка правил без риска</li>
            <li>• Ускоренное обучение</li>
          </ul>
        </div>
      </div>
    `
  },
  {
    id: "homework-session2",
    title: "Домашнее Задание",
    icon: PenTool,
    content: `
      <div class="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-6 rounded-xl border border-purple-500/20">
        <h3 class="text-xl font-bold text-white mb-4">Закрепление материала</h3>
        <ul class="space-y-2 text-gray-300 mb-6">
          <li class="flex items-center gap-2">🖥️ Выберите 2 графика (любая пара/ТФ).</li>
          <li class="flex items-center gap-2">✍️ Отметьте сделки (Входы, Выходы, ESL).</li>
          <li class="flex items-center gap-2">💰 Укажите результат по каждой сделке.</li>
        </ul>
        
        <div class="grid grid-cols-2 gap-4 text-sm mt-4 border-t border-purple-500/20 pt-4">
          <div>
            <strong class="text-green-400 block mb-1">✓ ДЕЛАТЬ</strong>
            <ul class="text-gray-400 space-y-1">
              <li>• Торговать чистые сетапы</li>
              <li>• Закрывать при сомнениях</li>
            </ul>
          </div>
          <div>
            <strong class="text-red-400 block mb-1">⦸ НЕ ДЕЛАТЬ</strong>
            <ul class="text-gray-400 space-y-1">
              <li>• Торговать в "спагетти"</li>
              <li>• Входить на длинных барах</li>
            </ul>
          </div>
        </div>
      </div>
    `
  },
  {
    id: "qa-session2",
    title: "Вопросы и Ответы",
    icon: HelpCircle,
    content: `
      <p class="mb-4 text-gray-300">Записывайте вопросы по ходу изучения. Не стесняйтесь уточнять любые моменты по Сессии 1 и 2.</p>
      <div class="bg-blue-500/10 p-4 rounded text-center">
        <p class="text-blue-300 italic">"Глупый вопрос - это тот, который не был задан."</p>
      </div>
    `
  }
];
