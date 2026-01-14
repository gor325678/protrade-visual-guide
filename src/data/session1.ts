
import {
  BookOpen,
  Target,
  Scale,
  Lightbulb,
  Wrench,
  Star,
  BarChart2,
  Activity,
  Scroll,
  AlertTriangle,
  Rocket,
  Brain,
  Settings,
  Clock,
  PenTool,
  Book,
  ThumbsUp,
  Flag
} from "lucide-react";

export const session1Content = [
  {
    id: "welcome",
    title: "Приветствие",
    icon: BookOpen,
    content: `
      <p class="mb-4">Этот раздел знакомит вас с курсом ProTrader Systems ETF. Мы рассмотрим философию, лежащую в основе системы ProTrader Systems, и ключевые принципы, необходимые для успеха в трейдинге.</p>
      <blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-500/10 rounded-r italic text-gray-300">
        "Недостаточно иметь знания, нужно еще и применять их. Недостаточно просто иметь желания, нужно еще и добиваться их исполнения." — Иоганн Вольфганг фон Гете
      </blockquote>
      <p class="mb-4">Курс ProTrader Systems ETF Course был создан в 2023 году и впоследствии улучшен командой ProTrader Systems.</p>
      <div class="mt-6">
        <h3 class="text-xl font-semibold mb-3 text-white">Ключ к успеху:</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="flex items-center gap-2 text-gray-300"><span class="text-green-500">🏆</span> Работа и преданность делу</div>
          <div class="flex items-center gap-2 text-gray-300"><span class="text-green-500">⚖️</span> Дисциплина</div>
          <div class="flex items-center gap-2 text-gray-300"><span class="text-green-500">🧘</span> Терпение</div>
          <div class="flex items-center gap-2 text-gray-300"><span class="text-green-500">💪</span> Настойчивость</div>
          <div class="flex items-center gap-2 text-gray-300"><span class="text-green-500">🎯</span> Концентрация</div>
          <div class="flex items-center gap-2 text-gray-300"><span class="text-green-500">💡</span> Уверенность</div>
          <div class="flex items-center gap-2 text-gray-300"><span class="text-green-500">🚀</span> Убежденность и смелость</div>
        </div>
      </div>
    `
  },
  {
    id: "goals",
    title: "Цели Курса",
    icon: Target,
    content: `
      <p class="mb-4">Закладывание прочного фундамента для дальнейшего изучения системы ProTrader Systems и освоение простого, но эффективного метода торговли.</p>
      <ul class="space-y-3 mt-4">
        <li class="flex items-start gap-3">
          <span class="bg-blue-500/20 p-1 rounded text-blue-400 mt-1">🌟</span>
          <span>Первое знакомство с базовыми понятиями.</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="bg-blue-500/20 p-1 rounded text-blue-400 mt-1">🏗️</span>
          <span>Закладка фундамента перед изучением других уровней.</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="bg-blue-500/20 p-1 rounded text-blue-400 mt-1">🧭</span>
          <span>Использование тенденций.</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="bg-blue-500/20 p-1 rounded text-blue-400 mt-1">🛡️</span>
          <span>Применение базовой техники RMM (Risk and Money Management).</span>
        </li>
      </ul>
    `
  },
  {
    id: "rules",
    title: "Организация и Правила",
    icon: Scale,
    content: `
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold text-white mb-2">Организация</h3>
          <p class="text-gray-300">Постепенное представление правил, иллюстрации на графиках, практика и домашние задания.</p>
        </div>
        
        <div class="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-yellow-500 mb-2">Важно</h3>
          <p class="text-gray-300">Не пытайтесь бежать впереди дистанции! Будьте терпеливы!</p>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-white mb-2">Основные правила</h3>
          <ul class="list-disc list-inside space-y-2 text-gray-300 marker:text-blue-500">
            <li>Следуйте инструкциям.</li>
            <li>Используйте предоставленные шаблоны.</li>
            <li>Не меняйте настройки индикаторов.</li>
            <li>Выполняйте домашнее задание точно по примерам.</li>
          </ul>
        </div>
      </div>
    `
  },
  {
    id: "what-is",
    title: "Что такое ProTrader Systems?",
    icon: Lightbulb,
    content: `
      <p class="mb-4 text-lg">Метод следования за трендом (<span class="text-blue-400 font-semibold">Момент - Сопровождение - Выход</span>).</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div class="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
          <h3 class="text-lg font-semibold text-green-400 mb-3">Характеристики</h3>
          <ul class="space-y-2 text-gray-300">
            <li class="flex items-center gap-2">✅ Включает контртрендовую торговлю</li>
            <li class="flex items-center gap-2">✅ Строгий риск-менеджмент</li>
            <li class="flex items-center gap-2">✅ Применим на любом рынке и таймфрейме</li>
          </ul>
        </div>

        <div class="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
          <h3 class="text-lg font-semibold text-red-400 mb-3">Не является</h3>
          <ul class="space-y-2 text-gray-300">
            <li class="flex items-center gap-2">❌ Новостным методом</li>
            <li class="flex items-center gap-2">❌ Элементарной системой покупки/продажи</li>
          </ul>
        </div>
      </div>
    `
  },
  {
    id: "method",
    title: "Определение Торгового Метода",
    icon: Wrench,
    content: `
      <ol class="space-y-4">
        <li class="flex items-center gap-4 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
          <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">1</div>
          <span class="text-gray-200">🔍 Определение движений рынка (трендов).</span>
        </li>
        <li class="flex items-center gap-4 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
          <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">2</div>
          <span class="text-gray-200">⏱️ Определение сетапов и времени их действия.</span>
        </li>
        <li class="flex items-center gap-4 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
          <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">3</div>
          <span class="text-gray-200">⚙️ Управление сделкой (снижение риска, оптимизация прибыли).</span>
        </li>
        <li class="flex items-center gap-4 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
          <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">4</div>
          <span class="text-gray-200">🏁 Определение конца тренда.</span>
        </li>
      </ol>
    `
  },
  {
    id: "expectations",
    title: "Ожидания от ProTrader Systems",
    icon: Star,
    content: `
      <p class="mb-4">Цель — успешная и прибыльная торговля.</p>
      <div class="bg-gradient-to-r from-green-900/20 to-blue-900/20 p-6 rounded-xl border border-green-800/30 text-center">
        <h3 class="text-2xl font-bold text-white mb-2">Главный принцип</h3>
        <p class="text-xl text-green-400 italic">"Ждите, пока рынок сам придет к вам."</p>
      </div>
      <p class="mt-4 text-gray-300">В системе представлены примеры сделок с потенциалом прибыли от <span class="text-green-400 font-bold">220</span> до <span class="text-green-400 font-bold">1737</span> пунктов.</p>
    `
  },
  {
    id: "regimes",
    title: "Ценовые Режимы",
    icon: BarChart2,
    content: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-trading-card rounded-lg border border-gray-700">
          <h3 class="font-bold text-blue-400 mb-2">Локальные</h3>
          <ul class="space-y-1 text-gray-300">
            <li>• Тренд</li>
            <li>• Контр-тренд</li>
            <li>• Консолидация (LCZ/TCZ)</li>
          </ul>
        </div>
        <div class="p-4 bg-trading-card rounded-lg border border-gray-700">
          <h3 class="font-bold text-purple-400 mb-2">Мировые</h3>
          <ul class="space-y-1 text-gray-300">
            <li>• "Choppy" (прерывистый)</li>
            <li>• "Spaghetti Zone" (зона спагетти)</li>
          </ul>
        </div>
      </div>
      <p class="mt-4 text-sm text-gray-400">Каждый режим требует особого подхода, сетапов и оценки риска.</p>
    `
  },
  {
    id: "indicators",
    title: "MA и BBs",
    icon: Activity,
    content: `
      <div class="space-y-4">
        <div class="flex items-start gap-4">
          <div class="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-white">Скользящая Средняя (MA)</h3>
            <p class="text-gray-300">Сглаживает шум, определяет тренд и уровни поддержки/сопротивления.</p>
          </div>
        </div>

        <div class="flex items-start gap-4">
          <div class="p-2 bg-purple-500/10 rounded-lg text-purple-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-white">Полосы Боллинджера (BBs)</h3>
            <p class="text-gray-300">Оценивают волатильность, определяют перекупленность/перепроданность и подтверждают сигналы.</p>
          </div>
        </div>
      </div>
    `
  },
  {
    id: "classic",
    title: "Классический ProTrader Systems",
    icon: Scroll,
    content: `
      <ul class="space-y-3">
        <li class="bg-gray-800/30 p-3 rounded-lg border border-gray-700/50">
          <strong class="text-blue-400 block mb-1">Индикаторы</strong>
          <span class="text-gray-300">233 EMA (Канал Homebase), 21 EMA (Линия моментума), Полосы Боллинджера (Training Wheels).</span>
        </li>
        <li class="bg-gray-800/30 p-3 rounded-lg border border-gray-700/50">
          <strong class="text-blue-400 block mb-1">Числа</strong>
          <span class="text-gray-300">Все используемые параметры основаны на числах Фибоначчи.</span>
        </li>
        <li class="bg-gray-800/30 p-3 rounded-lg border border-gray-700/50">
          <strong class="text-blue-400 block mb-1">Начало тренда</strong>
          <span class="text-gray-300">Пересечение канала HB и появление Momentum Original Entry (MOE).</span>
        </li>
      </ul>
    `
  },
  {
    id: "problems",
    title: "Проблемы Классического ProTrader",
    icon: AlertTriangle,
    content: `
      <p class="mb-3 text-gray-300">Ограничения классических МА:</p>
      <ul class="list-disc list-inside text-gray-400 space-y-1">
        <li>"Плохое" ценовое действие</li>
        <li>Пропуск значительных изменений</li>
        <li>Сложности в различении тренда и контртренда</li>
      </ul>
    `
  },
  {
    id: "solution",
    title: "ProTrader Systems ETF: Решение",
    icon: Rocket,
    content: `
      <div class="bg-gradient-to-br from-blue-900/10 to-green-900/10 p-5 rounded-xl border border-blue-500/20">
        <h3 class="text-xl font-bold text-white mb-4">Преимущества версии ETF</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">🎯</div>
            <span class="text-gray-200">Лучшее определение движений</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">⚡</div>
            <span class="text-gray-200">Более ранние входы</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">💰</div>
            <span class="text-gray-200">Лучшие показатели RRR</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">🔄</div>
            <span class="text-gray-200">Новые настройки для разворотов</span>
          </div>
        </div>
      </div>
    `
  },
  {
    id: "theory",
    title: "Теория ETF",
    icon: Brain,
    content: `
      <p class="mb-4">ETF — это цепочка из трех вложенных друг в друга EMA, где каждая последующая сглаживает предыдущую. Это фильтрует рыночный шум и обеспечивает более надежное подтверждение тренда.</p>
      <div class="bg-gray-900 p-4 rounded text-center font-mono text-sm text-blue-300 border border-gray-700">
        Цена ≈ k₀EMA + k₁EMA(EMA) + k₂EMA(EMA(EMA))
      </div>
    `
  },
  {
    id: "setups",
    title: "Сетапы Входа ETF",
    icon: Settings,
    content: `
      <div class="space-y-4">
        <div class="bg-trading-card border border-l-4 border-l-blue-500 border-gray-700 p-4 rounded">
          <h3 class="font-bold text-lg text-white">ETF S&P MOE</h3>
          <p class="text-sm text-gray-400 mb-2">Первая обоснованная сделка в новом тренде.</p>
          <p class="text-gray-300">Требуется пересечение линий ETF, откат и подтверждение индикатором Bias Companion.</p>
        </div>

        <div class="bg-trading-card border border-l-4 border-l-green-500 border-gray-700 p-4 rounded">
          <h3 class="font-bold text-lg text-white">ETF REMOE</h3>
          <p class="text-sm text-gray-400 mb-2">Вход на возобновление тренда.</p>
          <p class="text-gray-300">После отката к линиям ETF.</p>
        </div>

        <div class="bg-red-500/10 border border-red-500/30 p-4 rounded text-sm text-gray-300">
          <strong class="text-red-400 block mb-1">Важно:</strong>
          Не входите на длинных свечах (дождитесь отката) или в зонах консолидации.
        </div>
      </div>
    `
  },
  {
    id: "instruments",
    title: "Инструменты и Время",
    icon: Clock,
    content: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-semibold text-white mb-3">Пары</h3>
          <div class="space-y-2">
            <div class="flex justify-between items-center bg-gray-800/50 p-2 rounded">
              <span class="text-gray-300">EURUSD, GBPUSD</span>
              <span class="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">Основные</span>
            </div>
            <div class="flex justify-between items-center bg-gray-800/50 p-2 rounded">
              <span class="text-gray-300">EURJPY, GBPJPY</span>
              <span class="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">Доп.</span>
            </div>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-white mb-3">Время</h3>
          <p class="text-gray-300">Сессии EUR (Европейская) и USD (Американская).</p>
        </div>
      </div>
    `
  },
  {
    id: "homework",
    title: "Домашнее Задание",
    icon: PenTool,
    content: `
      <div class="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-6 rounded-xl border border-purple-500/20">
        <h3 class="text-xl font-bold text-white mb-4">Подготовить 3 графика (M5)</h3>
        <ul class="space-y-2 text-gray-300 mb-4">
          <li class="flex items-center gap-2">1️⃣ ETF S&P MOE</li>
          <li class="flex items-center gap-2">2️⃣ ETF REMOE</li>
          <li class="flex items-center gap-2">3️⃣ ETF BO REMOE</li>
        </ul>
        <p class="text-sm text-gray-400 border-t border-purple-500/20 pt-4">
          Отметить 6 ценовых режимов, точки входа и стоп-лоссы (ESL).
        </p>
      </div>
    `
  },
  {
    id: "glossary",
    title: "Глоссарий",
    icon: Book,
    content: `
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div class="bg-gray-800/30 p-2 rounded border border-gray-700">
          <strong class="text-white">ML</strong> <span class="text-gray-400">- Линия Моментума</span>
        </div>
        <div class="bg-gray-800/30 p-2 rounded border border-gray-700">
          <strong class="text-white">HB</strong> <span class="text-gray-400">- Канал домашней базы</span>
        </div>
        <div class="bg-gray-800/30 p-2 rounded border border-gray-700">
          <strong class="text-white">CZ / SZ</strong> <span class="text-gray-400">- Зона консолидации / спагетти</span>
        </div>
        <div class="bg-gray-800/30 p-2 rounded border border-gray-700">
          <strong class="text-white">MX / X</strong> <span class="text-gray-400">- Частичный / Полный выход</span>
        </div>
      </div>
    `
  },
  {
    id: "dos-donts",
    title: "Что Делать и Чего Не Делать",
    icon: ThumbsUp,
    content: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-green-900/10 border border-green-500/30 p-4 rounded-xl">
          <h3 class="text-green-400 font-bold mb-3 flex items-center gap-2">✓ ДЕЛАТЬ</h3>
          <ul class="space-y-2 text-gray-300 text-sm">
            <li>• Открывать сделки по установке</li>
            <li>• Закрывать при сомнениях</li>
            <li>• Практиковаться</li>
          </ul>
        </div>
        <div class="bg-red-900/10 border border-red-500/30 p-4 rounded-xl">
          <h3 class="text-red-400 font-bold mb-3 flex items-center gap-2">⦸ НЕ ДЕЛАТЬ</h3>
          <ul class="space-y-2 text-gray-300 text-sm">
            <li>• Торговать в "зоне спагетти"</li>
            <li>• Торговать на длинных барах</li>
            <li>• Торговать на новостях</li>
          </ul>
        </div>
      </div>
    `
  },
  {
    id: "conclusion",
    title: "Заключение",
    icon: Flag,
    content: `
      <p class="mb-4">Первая сессия заложила фундамент. Помните о дисциплине.</p>
      <blockquote class="text-xl text-center font-serif text-blue-300 italic py-6">
        "Не желай, чтобы было легче, желай, чтобы ты был лучше."<br/>
        <span class="text-sm text-gray-400 not-italic mt-2 block">— Джим Рон</span>
      </blockquote>
    `
  }
];
