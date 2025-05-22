
import React, { useState } from 'react';
import { Eye, Lock } from 'lucide-react';

// Component to prevent copying or downloading content
const ProtectionOverlay: React.FC = () => {
  const [warning, setWarning] = useState<string | null>(null);
  
  const showWarning = (message: string) => {
    setWarning(message);
    setTimeout(() => setWarning(null), 3000);
  };

  React.useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showWarning('Контекстное меню отключено для защиты контента');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect Ctrl+S, Ctrl+C, Ctrl+P, PrintScreen
      if ((e.ctrlKey || e.metaKey) && 
          (e.key === 's' || e.key === 'c' || e.key === 'p')) {
        e.preventDefault();
        showWarning('Сохранение и копирование контента отключено');
      } else if (e.key === 'PrintScreen') {
        showWarning('Снимки экрана ограничены');
      }
    };
    
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      showWarning('Копирование контента отключено');
    };
    
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('selectstart', handleSelectStart);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, []);

  return (
    <>
      {/* Protected content watermark */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10">
        <div className="w-full h-full flex items-center justify-center transform -rotate-45">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="absolute inset-0">
              {[...Array(20)].map((_, j) => (
                <div 
                  key={j} 
                  className="text-gray-500 font-bold text-sm absolute"
                  style={{
                    top: `${(i * 10) + (j * 10)}%`, 
                    left: `${(j * 10)}%`
                  }}
                >
                  PROTRADER
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Warning popup */}
      {warning && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-trading-card border border-red-500/50 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-red-400" />
            <p className="text-sm text-red-400">{warning}</p>
          </div>
        </div>
      )}
      
      {/* Bottom protection indicator */}
      <div className="fixed bottom-2 right-2 bg-gray-900/80 border border-gray-800 px-3 py-1 rounded-full z-40">
        <div className="flex items-center space-x-2">
          <Eye size={14} className="text-blue-400" />
          <span className="text-xs text-blue-400">Защищённый просмотр</span>
        </div>
      </div>
    </>
  );
};

export default ProtectionOverlay;
