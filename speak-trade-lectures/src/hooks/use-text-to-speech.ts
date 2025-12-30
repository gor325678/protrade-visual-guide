import { useState, useCallback, useRef, useEffect } from 'react';
import { VoiceSettings } from '@/components/voice-settings';
import { normalizeTextForTTS } from '@/utils/stress-dictionary';

// Розширені налаштування голосу
export interface EnhancedVoiceSettings extends VoiceSettings {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  useGoogleTTS?: boolean;
  googleAPIKey?: string;
}

export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceQuality, setVoiceQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('high');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Загружаем доступные голоса при инициализации
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      
      // Сортируем голоса по качеству
      const sortedVoices = voices.sort((a, b) => {
        // Приоритет: Neural > Wavenet > Standard > Basic
        const getQualityScore = (voice: SpeechSynthesisVoice) => {
          const name = voice.name.toLowerCase();
          if (name.includes('neural')) return 4;
          if (name.includes('wavenet')) return 3;
          if (name.includes('standard')) return 2;
          if (name.includes('basic')) return 1;
          return 0;
        };
        
        return getQualityScore(b) - getQualityScore(a);
      });
      
      setAvailableVoices(sortedVoices);
      console.log('Доступные голоса (отсортированы по качеству):', 
        sortedVoices.map(v => ({ 
          name: v.name, 
          lang: v.lang, 
          quality: getVoiceQuality(v)
        }))
      );
    };

    // Загружаем голоса сразу
    loadVoices();
    
    // И также при их изменении
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

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

  // Фильтруем голоса по качеству
  const getFilteredVoices = (minQuality: 'low' | 'medium' | 'high' | 'ultra' = 'low') => {
    const qualityOrder = { low: 0, medium: 1, high: 2, ultra: 3 };
    return availableVoices.filter(voice => 
      qualityOrder[getVoiceQuality(voice)] >= qualityOrder[minQuality]
    );
  };

  const findBestVoice = useCallback((settings: VoiceSettings): SpeechSynthesisVoice | null => {
    if (availableVoices.length === 0) return null;

    // Фильтруем по минимальному качеству
    const qualityVoices = getFilteredVoices(voiceQuality);
    
    // Сначала ищем точное совпадение среди качественных голосов
    let selectedVoice = qualityVoices.find(voice => voice.name === settings.voice);
    
    // Если не найден, ищем по подстроке среди качественных
    if (!selectedVoice) {
      selectedVoice = qualityVoices.find(voice => 
        voice.name.toLowerCase().includes(settings.voice.toLowerCase()) ||
        settings.voice.toLowerCase().includes(voice.name.toLowerCase())
      );
    }
    
    // Ищем русский мужской голос высокого качества
    if (!selectedVoice && settings.language.includes('ru')) {
      selectedVoice = qualityVoices.find(voice => 
        voice.lang.includes('ru') && 
        (voice.name.toLowerCase().includes('male') || 
         voice.name.toLowerCase().includes('мужской') ||
         voice.name.toLowerCase().includes('sergey') ||
         voice.name.toLowerCase().includes('dmitry') ||
         voice.name.toLowerCase().includes('pavel') ||
         voice.name.toLowerCase().includes('vladimir') ||
         voice.name.toLowerCase().includes('boris') ||
         voice.name.toLowerCase().includes('maksim') ||
         voice.name.toLowerCase().includes('aleksandr') ||
         voice.name.toLowerCase().includes('anton'))
      );
    }
    
    // Если все еще не найден, берем любой русский высокого качества
    if (!selectedVoice && settings.language.includes('ru')) {
      selectedVoice = qualityVoices.find(voice => 
        voice.lang.includes('ru') || 
        voice.name.toLowerCase().includes('russian') ||
        voice.name.toLowerCase().includes('русский')
      );
    }
    
    // В крайнем случае берем первый доступный качественный
    if (!selectedVoice) {
      selectedVoice = qualityVoices[0];
    }

    return selectedVoice;
  }, [availableVoices, voiceQuality]);

  // Google Cloud TTS (если доступен API ключ)
  const useGoogleCloudTTS = useCallback(async (text: string, settings: VoiceSettings): Promise<Blob> => {
    // Здесь можно добавить интеграцию с Google Cloud TTS
    // Пока возвращаем fallback
    return new Promise((resolve) => {
      const info = `Google Cloud TTS не настроен. Используйте системные голоса.`;
      resolve(new Blob([info], { type: 'text/plain' }));
    });
  }, []);

  const speak = useCallback((text: string, settings: VoiceSettings) => {
    if ('speechSynthesis' in window) {
      // Останавливаем текущую речь
      window.speechSynthesis.cancel();
      
      const normalizedText = normalizeTextForTTS(text, settings.useStressDict);
      const utterance = new SpeechSynthesisUtterance(normalizedText);
      
      const selectedVoice = findBestVoice(settings);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
        console.log('Использован голос:', selectedVoice.name, selectedVoice.lang, 'Качество:', getVoiceQuality(selectedVoice));
      } else {
        console.warn('Голос не найден, используется стандартный');
      }
      
      // Настройки качества
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;
      
      utterance.onstart = () => {
        console.log('Речь началась');
        setIsPlaying(true);
      };
      
      utterance.onend = () => {
        console.log('Речь завершена');
        setIsPlaying(false);
      };
      
      utterance.onerror = (error) => {
        console.error('Ошибка синтеза речи:', error);
        setIsPlaying(false);
      };
      
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech Synthesis не поддерживается в этом браузере');
    }
  }, [findBestVoice]);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
    
    // Останавливаем запись если активна
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const generateAudio = useCallback(async (text: string, settings: VoiceSettings): Promise<Blob> => {
    setIsGenerating(true);
    audioChunksRef.current = [];

    return new Promise((resolve, reject) => {
      try {
        // Пытаемся захватить аудио с системы (работает в некоторых браузерах)
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          // Альтернативный подход: используем Web Audio API
          generateAudioWithWebAudio(text, settings, resolve, reject);
        } else {
          // Fallback: создаем речь и уведомляем пользователя
          generateAudioFallback(text, settings, resolve, reject);
        }
      } catch (error) {
        setIsGenerating(false);
        reject(error);
      }
    });
  }, [findBestVoice]);

  const generateAudioWithWebAudio = useCallback((
    text: string, 
    settings: VoiceSettings, 
    resolve: (blob: Blob) => void, 
    reject: (error: any) => void
  ) => {
    const normalizedText = normalizeTextForTTS(text, settings.useStressDict);
    const utterance = new SpeechSynthesisUtterance(normalizedText);
    
    const selectedVoice = findBestVoice(settings);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }
    
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    // Создаем аудио контекст для захвата
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const destination = audioContext.createMediaStreamDestination();
    
    // Запускаем речь
    utterance.onstart = () => {
      console.log('Начинается генерация аудио...');
      
      // Начинаем запись
      const mediaRecorder = new MediaRecorder(destination.stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setIsGenerating(false);
        resolve(audioBlob);
      };
      
      mediaRecorder.start();
    };

    utterance.onend = () => {
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 500); // Небольшая задержка для завершения записи
    };

    utterance.onerror = (error) => {
      setIsGenerating(false);
      reject(error);
    };

    window.speechSynthesis.speak(utterance);
  }, [findBestVoice]);

  const generateAudioFallback = useCallback((
    text: string, 
    settings: VoiceSettings, 
    resolve: (blob: Blob) => void, 
    reject: (error: any) => void
  ) => {
    console.warn('Используется fallback метод генерации аудио');
    
    const normalizedText = normalizeTextForTTS(text, settings.useStressDict);
    const utterance = new SpeechSynthesisUtterance(normalizedText);
    
    const selectedVoice = findBestVoice(settings);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }
    
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    utterance.onend = () => {
      setIsGenerating(false);
      
      // Создаем информационный файл вместо настоящего аудио
      const info = `
        Аудио было воспроизведено с настройками:
        Голос: ${selectedVoice?.name || 'Стандартный'}
        Язык: ${selectedVoice?.lang || settings.language}
        Качество: ${selectedVoice ? getVoiceQuality(selectedVoice) : 'неизвестно'}
        Скорость: ${settings.rate}
        Тон: ${settings.pitch}
        Громкость: ${settings.volume}
        
        Для получения реального аудио файла рекомендуется:
        1. Использовать современный браузер (Chrome/Edge)
        2. Настроить захват системного звука
        3. Использовать расширения для записи звука
        4. Настроить Google Cloud TTS для лучшего качества
        
        Текст для озвучивания:
        ${normalizedText}
      `;
      
      const audioBlob = new Blob([info], { type: 'text/plain' });
      resolve(audioBlob);
    };

    utterance.onerror = (error) => {
      setIsGenerating(false);
      reject(error);
    };

    window.speechSynthesis.speak(utterance);
  }, [findBestVoice]);

  const downloadAudio = useCallback((audioBlob: Blob, filename: string = 'generated-audio.wav') => {
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  // Функция для получения рекомендаций по улучшению качества
  const getQualityRecommendations = useCallback(() => {
    const recommendations = [];
    
    if (voiceQuality === 'low') {
      recommendations.push('Обновите браузер до последней версии');
      recommendations.push('Установите дополнительные языковые пакеты Windows');
      recommendations.push('Попробуйте другой браузер (Chrome/Edge)');
    }
    
    if (voiceQuality === 'medium') {
      recommendations.push('Используйте голоса с пометкой "Neural" или "Wavenet"');
      recommendations.push('Настройте Google Cloud TTS для максимального качества');
    }
    
    if (voiceQuality === 'high') {
      recommendations.push('Отличное качество! Можете настроить Google Cloud TTS для еще лучшего результата');
    }
    
    return recommendations;
  }, [voiceQuality]);

  return {
    isPlaying,
    isGenerating,
    availableVoices,
    voiceQuality,
    setVoiceQuality,
    getFilteredVoices,
    getVoiceQuality,
    getQualityRecommendations,
    speak,
    stop,
    generateAudio,
    downloadAudio,
  };
}