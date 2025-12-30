import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { VoiceSettings } from "@/components/voice-settings";
import { VoiceQualityTips } from "@/components/voice-quality-tips";
import { SubtitlePreview } from "@/components/subtitle-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";
import { useToast } from "@/hooks/use-toast";
import { Download, AudioWaveform, TrendingUp } from "lucide-react";

const Index = () => {
  const [subtitleFile, setSubtitleFile] = useState<File | null>(null);
  const [subtitleContent, setSubtitleContent] = useState<string>("");
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    voice: "ru-RU-Wavenet-B",
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    useStressDict: true,
    language: "ru-RU",
  });
  const [generatedAudio, setGeneratedAudio] = useState<Blob | null>(null);
  
  const { 
    isPlaying, 
    isGenerating, 
    speak, 
    stop, 
    generateAudio, 
    downloadAudio, 
    availableVoices,
    voiceQuality,
    setVoiceQuality,
    getQualityRecommendations
  } = useTextToSpeech();
  const { toast } = useToast();

  const handleFileSelect = (file: File, content: string) => {
    setSubtitleFile(file);
    setSubtitleContent(content);
    toast({
      title: "Файл загружен",
      description: `${file.name} успешно загружен и готов для озвучивания.`,
    });
  };

  const extractTextFromSubtitles = (content: string): string => {
    const blocks = content.trim().split('\n\n');
    return blocks.map(block => {
      const lines = block.split('\n');
      if (lines.length >= 3) {
        return lines.slice(2).join(' ');
      }
      return '';
    }).filter(text => text.trim() !== '').join(' ');
  };

  const handleGenerateAudio = async () => {
    if (!subtitleContent) {
      toast({
        title: "Ошибка",
        description: "Сначала загрузите файл субтитров.",
        variant: "destructive",
      });
      return;
    }

    if (availableVoices.length === 0) {
      toast({
        title: "Голоса не загружены",
        description: "Подождите, пока загрузятся доступные голоса, или обновите страницу.",
        variant: "destructive",
      });
      return;
    }

    try {
      const textToSpeak = extractTextFromSubtitles(subtitleContent);
      
      if (!textToSpeak.trim()) {
        toast({
          title: "Пустой текст",
          description: "В файле субтитров не найден текст для озвучивания.",
          variant: "destructive",
        });
        return;
      }

      console.log('Начинается генерация аудио с настройками:', voiceSettings);
      console.log('Текст для озвучивания:', textToSpeak.substring(0, 100) + '...');
      
      const audioBlob = await generateAudio(textToSpeak, voiceSettings);
      setGeneratedAudio(audioBlob);
      
      toast({
        title: "Аудио сгенерировано",
        description: `Аудиофайл готов для скачивания! Использован голос: ${voiceSettings.voice}`,
      });
    } catch (error: any) {
      console.error('Ошибка генерации аудио:', error);
      toast({
        title: "Ошибка генерации",
        description: error.message || "Не удалось сгенерировать аудиофайл. Попробуйте выбрать другой голос или обновить страницу.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (generatedAudio && subtitleFile) {
      const fileName = `${subtitleFile.name.replace(/\.[^/.]+$/, "")}-audio.wav`;
      downloadAudio(generatedAudio, fileName);
    }
  };

  const handlePreview = (text: string) => {
    speak(text, voiceSettings);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-gradient-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Trading Voice Generator
              </h1>
              <p className="text-muted-foreground">
                Профессиональная озвучка субтитров для трейдинг-лекций
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <FileUpload 
              onFileSelect={handleFileSelect}
              acceptedTypes={['.srt', '.vtt', '.txt']}
            />
            
            <VoiceSettings
              settings={voiceSettings}
              onSettingsChange={setVoiceSettings}
              onPreview={handlePreview}
              isPlaying={isPlaying}
              onStop={stop}
              availableVoices={availableVoices}
              voiceQuality={voiceQuality}
              onQualityChange={setVoiceQuality}
            />
          </div>

          {/* Center Column */}
          <div className="space-y-6">
            {subtitleContent && (
              <SubtitlePreview 
                content={subtitleContent}
                fileName={subtitleFile?.name}
              />
            )}

            {/* Generation Controls */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <AudioWaveform className="h-5 w-5" />
                  Генерация аудио
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleGenerateAudio}
                  disabled={!subtitleContent || isGenerating}
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                      Генерация аудио...
                    </>
                  ) : (
                    <>
                      <AudioWaveform className="w-4 h-4 mr-2" />
                      Сгенерировать аудио
                    </>
                  )}
                </Button>

                {generatedAudio && (
                  <Button
                    onClick={handleDownload}
                    variant="secondary"
                    className="w-full"
                    size="lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Скачать аудиофайл
                  </Button>
                )}

                <div className="text-xs text-muted-foreground text-center pt-2">
                  💡 Аудио будет сгенерировано с выбранными настройками голоса
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Voice Quality Tips */}
          <div className="space-y-6">
            <VoiceQualityTips 
              currentQuality={voiceQuality}
              availableVoices={availableVoices}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
