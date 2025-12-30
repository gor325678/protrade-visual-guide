import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface SubtitlePreviewProps {
  content: string;
  fileName?: string;
}

export function SubtitlePreview({ content, fileName }: SubtitlePreviewProps) {
  const parseSubtitles = (content: string) => {
    // Simple SRT parser
    const blocks = content.trim().split('\n\n');
    return blocks.map((block, index) => {
      const lines = block.split('\n');
      if (lines.length >= 3) {
        const number = lines[0];
        const timestamp = lines[1];
        const text = lines.slice(2).join(' ');
        return { number, timestamp, text };
      }
      return null;
    }).filter(Boolean);
  };

  const subtitles = parseSubtitles(content);
  const totalWords = subtitles.reduce((acc, sub) => acc + (sub?.text.split(' ').length || 0), 0);
  const estimatedDuration = Math.round(totalWords / 150); // 150 words per minute average

  return (
    <Card className="bg-gradient-card shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-foreground">
          <span className="flex items-center gap-2">
            📄 Предварительный просмотр
          </span>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-trading-blue/20 text-trading-blue border-trading-blue/30">
              {subtitles.length} блоков
            </Badge>
            <Badge variant="secondary" className="bg-trading-green/20 text-trading-green border-trading-green/30">
              ~{estimatedDuration} мин
            </Badge>
          </div>
        </CardTitle>
        {fileName && (
          <p className="text-sm text-muted-foreground">{fileName}</p>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80 w-full rounded-md border border-border bg-muted/30 p-4">
          <div className="space-y-4">
            {subtitles.map((subtitle, index) => (
              <div 
                key={index} 
                className="p-3 rounded-lg bg-card border border-border/50 hover:border-trading-blue/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {subtitle?.number}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    {subtitle?.timestamp}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {subtitle?.text}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}