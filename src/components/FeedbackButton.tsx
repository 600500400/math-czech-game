
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";

const FeedbackButton = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string>('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!category || !message.trim()) {
      toast.error(t('common.error'));
      return;
    }

    setLoading(true);
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(t('feedback.thankYou'));
      setOpen(false);
      setCategory('');
      setMessage('');
    } catch (error) {
      toast.error(t('feedback.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 shadow-lg bg-white hover:bg-gray-50 border-2 border-brand-200 hover:border-brand-300 transition-all duration-200 hover:scale-105"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{t('feedback.title')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('feedback.title')}</DialogTitle>
          <DialogDescription>
            {t('feedback.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="category">{t('feedback.category')}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t('feedback.category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">{t('feedback.bug')}</SelectItem>
                <SelectItem value="feature">{t('feedback.feature')}</SelectItem>
                <SelectItem value="general">{t('feedback.general')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="message">{t('feedback.message')}</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('feedback.messagePlaceholder')}
              rows={4}
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !category || !message.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t('feedback.sending')}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {t('feedback.send')}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackButton;
