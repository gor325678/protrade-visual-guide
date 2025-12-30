import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  StarHalf, 
  Zap, 
  Download, 
  Globe, 
  Settings, 
  Chrome, 
  Edge,
  Windows,
  Apple,
  Linux
} from "lucide-react";

interface VoiceQualityTipsProps {
  currentQuality: 'low' | 'medium' | 'high' | 'ultra';
  availableVoices: SpeechSynthesisVoice[];
}

export function VoiceQualityTips({ currentQuality, availableVoices }: VoiceQualityTipsProps) {
  const getQualityInfo = (quality: 'low' | 'medium' | 'high' | 'ultra') => {
    switch (quality) {
      case 'ultra':
        return {
          icon: <Zap className="w-5 h-5 text-purple-500" />,
          title: 'Премиум качество',
          description: 'AI-голоса, Neural сети, максимальная естественность',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200'
        };
      case 'high':
        return {
          icon: <Star className="w-5 h-5 text-yellow-500" />,
          title: 'Высокое качество',
          description: 'Wavenet голоса, HD качество, отличная разборчивость',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'medium':
        return {
          icon: <StarHalf className="w-5 h-5 text-orange-500" />,
          title: 'Стандартное качество',
          description: 'Standard голоса, хорошая разборчивость',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        };
      case 'low':
        return {
          icon: <Star className="w-5 h-5 text-gray-400" />,
          title: 'Базовое качество',
          description: 'Basic голоса, минимальная разборчивость',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const qualityInfo = getQualityInfo(currentQuality);
  
  // Подсчитываем голоса по качеству
  const voicesByQuality = availableVoices.reduce((acc, voice) => {
    const quality = getVoiceQuality(voice);
    acc[quality] = (acc[quality] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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

  const getOSRecommendations = () => {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Windows')) {
      return [
        'Установите дополнительные языковые пакеты Windows',
        'Обновите до Windows 11 для лучших голосов',
        'Используйте браузер Edge для максимальной совместимости'
      ];
    } else if (userAgent.includes('Mac')) {
      return [
        'Обновите macOS до последней версии',
        'Установите дополнительные голоса в настройках системы',
        'Используйте Safari для лучшей интеграции'
      ];
    } else if (userAgent.includes('Linux')) {
      return [
        'Установите пакет espeak-ng',
        'Настройте дополнительные голоса через пакетный менеджер',
        'Попробуйте браузер Chrome для лучшей поддержки'
      ];
    }
    
    return [
      'Обновите операционную систему',
      'Установите дополнительные языковые пакеты',
      'Используйте современный браузер'
    ];
  };

  return (
    <Card className="bg-gradient-card shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          🎯 Анализ качества голосов
          <Badge variant="secondary" className="ml-auto">
            {currentQuality === 'ultra' ? 'Премиум' : 
             currentQuality === 'high' ? 'Высокое' :
             currentQuality === 'medium' ? 'Стандарт' : 'Базовое'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Текущее качество */}
        <div className={`p-4 rounded-lg ${qualityInfo.bgColor} border ${qualityInfo.borderColor}`}>
          <div className="flex items-center gap-3">
            {qualityInfo.icon}
            <div>
              <h3 className={`font-semibold ${qualityInfo.color}`}>
                {qualityInfo.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {qualityInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Статистика голосов */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">📊 Доступные голоса по качеству:</h4>
          <div className="grid grid-cols-2 gap-2">
            {(['ultra', 'high', 'medium', 'low'] as const).map((quality) => {
              const count = voicesByQuality[quality] || 0;
              const info = getQualityInfo(quality);
              return (
                <div key={quality} className={`p-3 rounded-lg ${info.bgColor} border ${info.borderColor}`}>
                  <div className="flex items-center gap-2">
                    {info.icon}
                    <span className={`text-sm font-medium ${info.color}`}>
                      {info.title}
                    </span>
                  </div>
                  <div className="text-lg font-bold mt-1">{count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Рекомендации по улучшению */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">🚀 Как улучшить качество голосов:</h4>
          
          {/* Браузеры */}
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Рекомендуемые браузеры</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                <Chrome className="w-3 h-3 mr-1" />
                Chrome
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                <Edge className="w-3 h-3 mr-1" />
                Edge
              </Button>
            </div>
          </div>

          {/* Операционные системы */}
          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Настройки системы</span>
            </div>
            <ul className="text-xs text-green-800 space-y-1">
              {getOSRecommendations().map((rec, index) => (
                <li key={index}>• {rec}</li>
              ))}
            </ul>
          </div>

          {/* Google Cloud TTS */}
          <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Google Cloud TTS</span>
            </div>
            <p className="text-xs text-purple-800 mb-2">
              Для максимального качества настройте интеграцию с Google Cloud TTS
            </p>
            <Button size="sm" variant="outline" className="text-xs">
              <Download className="w-3 h-3 mr-1" />
              Настроить API
            </Button>
          </div>
        </div>

        {/* Полезные ссылки */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">🔗 Полезные ресурсы:</h4>
          <div className="space-y-2">
            <Button variant="link" size="sm" className="text-xs p-0 h-auto">
              📖 Документация по Speech Synthesis API
            </Button>
            <Button variant="link" size="sm" className="text-xs p-0 h-auto">
              🌐 Google Cloud TTS документация
            </Button>
            <Button variant="link" size="sm" className="text-xs p-0 h-auto">
              💡 Советы по улучшению качества голосов
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
