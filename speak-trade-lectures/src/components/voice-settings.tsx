import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Square, AlertCircle, Star, StarHalf, Zap, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface VoiceSettings {
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
  useStressDict: boolean;
  language: string;
}

interface VoiceSettingsProps {
  settings: VoiceSettings;
  onSettingsChange: (settings: VoiceSettings) => void;
  onPreview: (text: string) => void;
  isPlaying: boolean;
  onStop: () => void;
  availableVoices?: SpeechSynthesisVoice[];
  voiceQuality?: 'low' | 'medium' | 'high' | 'ultra';
  onQualityChange?: (quality: 'low' | 'medium' | 'high' | 'ultra') => void;
}

// Группировка голосов по языкам и типам
const groupVoicesByLanguage = (voices: SpeechSynthesisVoice[]) => {
  const groups: { [key: string]: SpeechSynthesisVoice[] } = {};
  
  voices.forEach(voice => {
    let groupKey = 'Другие';
    
    if (voice.lang.includes('ru')) {
      groupKey = 'Русский';
    } else if (voice.lang.includes('en')) {
      groupKey = 'Английский';
    } else if (voice.lang.includes('de')) {
      groupKey = 'Немецкий';
    } else if (voice.lang.includes('fr')) {
      groupKey = 'Французский';
    } else if (voice.lang.includes('es')) {
      groupKey = 'Испанский';
    } else if (voice.lang.includes('it')) {
      groupKey = 'Итальянский';
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(voice);
  });
  
  return groups;
};

// Определение пола голоса
const getVoiceGender = (voice: SpeechSynthesisVoice): 'male' | 'female' | 'unknown' => {
  const name = voice.name.toLowerCase();
  
  // Мужские маркеры
  const maleKeywords = [
    'male', 'man', 'sergey', 'dmitry', 'pavel', 'vladimir', 'андрей', 'sergei',
    'boris', 'maksim', 'aleksandr', 'anton', 'boy', 'men', 'guy'
  ];
  
  // Женские маркеры
  const femaleKeywords = [
    'female', 'woman', 'elena', 'marina', 'anna', 'татьяна', 'елена',
    'svetlana', 'girl', 'women', 'lady'
  ];
  
  if (maleKeywords.some(keyword => name.includes(keyword))) {
    return 'male';
  }
  
  if (femaleKeywords.some(keyword => name.includes(keyword))) {
    return 'female';
  }
  
  return 'unknown';
};

// Определяем качество голоса
const getVoiceQuality = (voice: SpeechSynthesisVoice): 'low' | 'medium' | 'high' | 'ultra' => {
  const name = voice.name.toLowerCase();
  
  if (name.includes('neural') || name.includes('ai') || name.includes('premium')) {
    return 'ultra';
  }
  if (name.includes('wavenet') || name.includes('hd')) {
    return 'high';
  }
  if (name.includes('standard') || name.includes('enhanced')) {
    return 'medium';
  }
  return 'low';
};

// Иконка качества
const QualityIcon = ({ quality }: { quality: 'low' | 'medium' | 'high' | 'ultra' }) => {
  switch (quality) {
    case 'ultra':
      return <Zap className="w-4 h-4 text-purple-500" />;
    case 'high':
      return <Star className="w-4 h-4 text-yellow-500" />;
    case 'medium':
      return <StarHalf className="w-4 h-4 text-orange-500" />;
    case 'low':
      return <Star className="w-4 h-4 text-gray-400" />;
  }
};

export function VoiceSettings({ 
  settings, 
  onSettingsChange, 
  onPreview, 
  isPlaying,
  onStop,
  availableVoices = [],
  voiceQuality = 'high',
  onQualityChange
}: VoiceSettingsProps) {
  const [previewText] = useState("Привет! Это пример голоса для трейдинг-лекций. Скорость и тон можно настроить. Проверяем ударения: замОк и зАмок, банкИр и договОр.");
  const [localVoices, setLocalVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>(voiceQuality);
  const [showAllVoices, setShowAllVoices] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setLocalVoices(voices);
      
      // Если голос еще не выбран, выбираем первый русский мужской
      if (!settings.voice && voices.length > 0) {
        const russianMaleVoice = voices.find(voice => 
          voice.lang.includes('ru') && getVoiceGender(voice) === 'male'
        );
        
        const defaultVoice = russianMaleVoice || voices.find(voice => voice.lang.includes('ru')) || voices[0];
        
        if (defaultVoice) {
          updateSetting('voice', defaultVoice.name);
          updateSetting('language', defaultVoice.lang);
        }
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const updateSetting = (key: keyof VoiceSettings, value: number | string | boolean) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const voicesToUse = availableVoices.length > 0 ? availableVoices : localVoices;
  
  // Фильтруем голоса по качеству
  const getFilteredVoices = (minQuality: 'low' | 'medium' | 'high' | 'ultra' = 'low') => {
    const qualityOrder = { low: 0, medium: 1, high: 2, ultra: 3 };
    return voicesToUse.filter(voice => 
      qualityOrder[getVoiceQuality(voice)] >= qualityOrder[minQuality]
    );
  };

  const qualityVoices = getFilteredVoices(selectedQuality);
  const groupedVoices = groupVoicesByLanguage(qualityVoices);
  
  // Фильтруем мужские голоса
  const maleVoices = qualityVoices.filter(voice => {
    const gender = getVoiceGender(voice);
    return gender === 'male' || gender === 'unknown'; // включаем неопределенные, так как многие мужские голоса не имеют явных маркеров
  });

  const maleVoiceGroups = groupVoicesByLanguage(maleVoices);

  const totalVoices = voicesToUse.length;
  const totalQualityVoices = qualityVoices.length;
  const totalMaleVoices = maleVoices.length;

  const handleQualityChange = (quality: 'low' | 'medium' | 'high' | 'ultra') => {
    setSelectedQuality(quality);
    onQualityChange?.(quality);
  };

  return (
    <Card className="bg-gradient-card shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          🎤 Настройки голоса
          <Badge variant="secondary" className="ml-auto">
            {totalQualityVoices} из {totalVoices} голосов
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {voicesToUse.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Голоса загружаются... Если проблема не исчезает, попробуйте обновить страницу.
            </AlertDescription>
          </Alert>
        )}

        {/* Фильтр качества */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">
            🎯 Минимальное качество голоса
          </Label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high', 'ultra'] as const).map((quality) => (
              <Button
                key={quality}
                variant={selectedQuality === quality ? "default" : "outline"}
                size="sm"
                onClick={() => handleQualityChange(quality)}
                className="flex items-center gap-2"
              >
                <QualityIcon quality={quality} />
                {quality === 'low' && 'Базовое'}
                {quality === 'medium' && 'Стандарт'}
                {quality === 'high' && 'Высокое'}
                {quality === 'ultra' && 'Премиум'}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Показываются только голоса с выбранным качеством и выше
          </p>
        </div>

        {/* Переключатель показа всех голосов */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
          <div className="space-y-1">
            <Label className="text-sm font-medium text-foreground">
              👥 Показать все голоса
            </Label>
            <p className="text-xs text-muted-foreground">
              Включая женские и неопределенные
            </p>
          </div>
          <Switch
            checked={showAllVoices}
            onCheckedChange={setShowAllVoices}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="voice-select" className="text-sm font-medium text-foreground">
            Голос ({totalMaleVoices} мужских доступно)
          </Label>
          <Select 
            value={settings.voice} 
            onValueChange={(value) => {
              const selectedVoice = voicesToUse.find(v => v.name === value);
              updateSetting('voice', value);
              if (selectedVoice) {
                updateSetting('language', selectedVoice.lang);
              }
            }}
          >
            <SelectTrigger className="bg-muted border-border">
              <SelectValue placeholder="Выберите голос" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border max-h-80">
              {Object.entries(maleVoiceGroups).map(([groupName, voices]) => (
                <div key={groupName}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                    {groupName} ({voices.length})
                  </div>
                  {voices.map((voice) => {
                    const gender = getVoiceGender(voice);
                    const quality = getVoiceQuality(voice);
                    return (
                      <SelectItem key={voice.name} value={voice.name} className="pl-4">
                        <div className="flex items-center gap-2">
                          <span>{voice.name}</span>
                          {gender === 'male' && (
                            <Badge variant="outline" className="text-xs">М</Badge>
                          )}
                          <QualityIcon quality={quality} />
                          <span className="text-xs text-muted-foreground">({voice.lang})</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                  <Separator className="my-1" />
                </div>
              ))}
              
              {/* Показываем все голоса если включено или мужских мало */}
              {(showAllVoices || totalMaleVoices < 3) && (
                <div>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-yellow-100/50 sticky top-0">
                    Все голоса (включая женские)
                  </div>
                  {Object.entries(groupedVoices).map(([groupName, voices]) => 
                    voices.map((voice) => {
                      const gender = getVoiceGender(voice);
                      const quality = getVoiceQuality(voice);
                      return (
                        <SelectItem key={`all-${voice.name}`} value={voice.name} className="pl-4">
                          <div className="flex items-center gap-2">
                            <span>{voice.name}</span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${gender === 'male' ? 'bg-blue-100' : gender === 'female' ? 'bg-pink-100' : ''}`}
                            >
                              {gender === 'male' ? 'М' : gender === 'female' ? 'Ж' : '?'}
                            </Badge>
                            <QualityIcon quality={quality} />
                            <span className="text-xs text-muted-foreground">({voice.lang})</span>
                          </div>
                        </SelectItem>
                      );
                    })
                  )}
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-foreground">
                📚 Словарь ударений
              </Label>
              <p className="text-xs text-muted-foreground">
                Автоматическая расстановка ударений для лучшего произношения
              </p>
            </div>
            <Switch
              checked={settings.useStressDict}
              onCheckedChange={(checked) => updateSetting('useStressDict', checked)}
            />
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Основные</TabsTrigger>
            <TabsTrigger value="advanced">Расширенные</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Скорость речи: {settings.rate.toFixed(1)}x
              </Label>
              <Slider
                value={[settings.rate]}
                onValueChange={([value]) => updateSetting('rate', value)}
                max={2}
                min={0.5}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Медленно</span>
                <span>Нормально</span>
                <span>Быстро</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Высота тона: {settings.pitch.toFixed(1)}
              </Label>
              <Slider
                value={[settings.pitch]}
                onValueChange={([value]) => updateSetting('pitch', value)}
                max={2}
                min={0.5}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Низкий</span>
                <span>Нормальный</span>
                <span>Высокий</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Громкость: {Math.round(settings.volume * 100)}%
              </Label>
              <Slider
                value={[settings.volume]}
                onValueChange={([value]) => updateSetting('volume', value)}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-200/50">
              <div className="text-sm font-medium text-blue-900 mb-2">
                🚀 Рекомендации для улучшения качества:
              </div>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Используйте голоса с пометкой "Neural" или "Wavenet"</li>
                <li>• Установите дополнительные языковые пакеты Windows</li>
                <li>• Попробуйте браузеры Chrome или Edge</li>
                <li>• Настройте Google Cloud TTS для максимального качества</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t border-border">
          <div className="flex gap-2">
            <Button 
              onClick={() => isPlaying ? onStop() : onPreview(previewText)}
              variant={isPlaying ? "destructive" : "default"}
              className={isPlaying ? "" : "bg-gradient-primary hover:opacity-90"}
              size="sm"
              disabled={voicesToUse.length === 0}
            >
              {isPlaying ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Остановить
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Тест голоса
                </>
              )}
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground">
            💡 Выбранный голос: {settings.voice || 'Не выбран'}
          </div>
          
          {/* Информационный блок */}
          <div className="mt-4 p-3 rounded-lg bg-blue-50/50 border border-blue-200/50">
            <div className="text-sm font-medium text-blue-900 mb-2">
              📝 Советы по настройке голоса:
            </div>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Используйте скорость 0.8-1.2x для лучшего понимания</li>
              <li>• Мужские голоса обычно лучше подходят для деловых лекций</li>
              <li>• Увімкніть словник ударений для лучшего произношения</li>
              <li>• Протестируйте голос перед генерацией длинного аудио</li>
              {totalMaleVoices === 0 && (
                <li className="text-orange-600">• ⚠️ Мужские голоса не найдены, используйте любой доступный</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}