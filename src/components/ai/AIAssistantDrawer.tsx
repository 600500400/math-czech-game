
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { AIAssistantChat } from './AIAssistantChat';
import { Bot, MessageCircle } from 'lucide-react';
import { FloatingIcon } from '@/components/ui/microanimations';

interface AIAssistantDrawerProps {
  subject?: 'math' | 'spelling';
  context?: {
    recentErrors?: string[];
    userStats?: any;
  };
  trigger?: React.ReactNode;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  subject,
  context,
  trigger
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultTrigger = (
    <FloatingIcon className="fixed bottom-4 right-4 z-50">
      <Button
        size="lg"
        className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Bot size={24} />
      </Button>
    </FloatingIcon>
  );

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {trigger || defaultTrigger}
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Bot size={20} />
            AI Studentský asistent
            {subject && (
              <span className="text-sm font-normal text-muted-foreground">
                • {subject === 'math' ? 'Matematika' : 'Pravopis'}
              </span>
            )}
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <AIAssistantChat 
            subject={subject} 
            context={context}
            className="h-[60vh] max-h-[500px]"
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
