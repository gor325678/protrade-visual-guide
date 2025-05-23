
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Clock } from 'lucide-react';
import { CourseModule, ModuleChange } from '@/types/material';
import { format } from 'date-fns';

interface ModuleHistoryDialogProps {
  module?: CourseModule;
  isOpen: boolean;
  onClose: () => void;
}

const ModuleHistoryDialog: React.FC<ModuleHistoryDialogProps> = ({ module, isOpen, onClose }) => {
  if (!module || !module.history) return null;
  
  const history = [...module.history].reverse(); // Show newest first

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] bg-trading-dark text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">
            История изменений: {module.title}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Все изменения модуля отслеживаются и сохраняются
          </DialogDescription>
        </DialogHeader>

        {history.length === 0 ? (
          <div className="py-4 text-center text-gray-400">
            Изменений для этого модуля пока нет
          </div>
        ) : (
          <ScrollArea className="max-h-[50vh] pr-4">
            {history.map((change, index) => (
              <div key={index} className="border-b border-gray-800 py-4 last:border-0">
                <div className="flex items-center gap-2 text-gray-300 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(change.date), 'dd.MM.yyyy')}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{format(new Date(change.date), 'HH:mm')}</span>
                </div>
                
                {change.previousTitle && (
                  <div className="mb-2">
                    <span className="text-sm text-gray-400">Предыдущее название:</span>
                    <div className="text-gray-200">{change.previousTitle}</div>
                  </div>
                )}
                
                {change.previousTopics && change.previousTopics.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-400">Предыдущие темы:</span>
                    <ul className="list-disc ml-5 text-gray-200 text-sm">
                      {change.previousTopics.map((topic, i) => (
                        <li key={i}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>
        )}
        
        <DialogFooter>
          <Button onClick={onClose}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleHistoryDialog;
