
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const FeedbackButton = () => {
  const { t } = useLanguage();
  const { authState } = useAuth();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string>('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!category || !message.trim()) {
      toast.error(t('feedback.error') || 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-feedback', {
        body: {
          category,
          message: message.trim(),
          name: name.trim() || undefined,
          email: email.trim() || undefined,
        }
      });

      if (error) {
        throw error;
      }

      console.log('Feedback submitted successfully:', data);
      toast.success(t('feedback.thankYou') || 'Thank you for your feedback!');
      
      // Reset form and close dialog
      setOpen(false);
      setCategory('');
      setMessage('');
      setName('');
      setEmail('');
    } catch (error: any) {
      console.error('Feedback submission error:', error);
      toast.error(t('feedback.error') || 'Failed to send feedback. Please try again.');
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
          className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
        >
          <MessageSquare className="h-4 w-4" />
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
            <Label htmlFor="category">{t('feedback.category')} *</Label>
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

          {/* Show name/email fields for non-authenticated users */}
          {!authState.isAuthenticated && (
            <>
              <div>
                <Label htmlFor="name">{t('auth.yourName')} (optional)</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="email">{t('auth.email')} (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="message">{t('feedback.message')} *</Label>
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
