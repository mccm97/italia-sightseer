
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Check, X, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateBlogPostContent, improveText } from '@/services/openai';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AIAssistantButtonProps {
  currentContent: string;
  onContentUpdate: (content: string) => void;
  selectedCity?: { id: string; name: string } | null;
}

export function AIAssistantButton({ currentContent, onContentUpdate, selectedCity }: AIAssistantButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<'write' | 'improve'>('write');
  const [generatedContent, setGeneratedContent] = useState('');
  const [showDemoAlert, setShowDemoAlert] = useState(false);
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  const handleGenerate = async () => {
    setIsLoading(true);
    setShowDemoAlert(true);
    
    try {
      if (action === 'write') {
        if (!selectedCity) {
          toast({
            title: t('blog.ai.noCitySelected'),
            description: t('blog.ai.pleaseSelectCity'),
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        
        console.log(`Generating content for city: ${selectedCity.name} in language: ${i18n.language}`);
        const { content, error } = await generateBlogPostContent(selectedCity.name, i18n.language);
        
        if (error) {
          console.error("Error from OpenAI service:", error);
          throw new Error(error);
        }
        
        setGeneratedContent(content);
      } else if (action === 'improve') {
        if (!currentContent.trim()) {
          toast({
            title: t('blog.ai.noContent'),
            description: t('blog.ai.pleaseEnterContent'),
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        
        console.log(`Improving content in language: ${i18n.language}`);
        const { content, error } = await improveText(currentContent, i18n.language);
        
        if (error) {
          console.error("Error from OpenAI service:", error);
          throw new Error(error);
        }
        
        setGeneratedContent(content);
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: t('blog.ai.error'),
        description: t('blog.ai.errorGeneration'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseContent = () => {
    onContentUpdate(generatedContent);
    setIsOpen(false);
    setGeneratedContent('');
    setShowDemoAlert(false);
    toast({
      title: t('blog.ai.contentApplied'),
      description: t('blog.ai.contentUpdated'),
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1"
      >
        <Sparkles className="h-4 w-4" />
        <span>{t('blog.ai.assistant')}</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('blog.ai.assistantTitle')}</DialogTitle>
            <DialogDescription>
              {t('blog.ai.assistantDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            {showDemoAlert && (
              <Alert variant="warning" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {i18n.language === 'it' 
                    ? "Questa è una funzionalità dimostrativa che genera contenuti anche senza un API key valida."
                    : "This is a demo feature that generates content even without a valid API key."}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>{t('blog.ai.selectAction')}</Label>
              <Select
                value={action}
                onValueChange={(value) => setAction(value as 'write' | 'improve')}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('blog.ai.selectAction')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="write">{t('blog.ai.writeArticle')}</SelectItem>
                  <SelectItem value="improve">{t('blog.ai.improveText')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {action === 'write' && (
              <div className="space-y-2">
                <Label>{t('blog.ai.selectedCity')}</Label>
                <div className="p-2 border rounded-md">
                  {selectedCity ? selectedCity.name : t('blog.ai.noCity')}
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('blog.ai.generating')}
                  </>
                ) : (
                  t('blog.ai.generate')
                )}
              </Button>
            </div>

            {generatedContent && (
              <div className="space-y-2 pt-4">
                <Label>{t('blog.ai.generatedContent')}</Label>
                <Textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="min-h-[200px]"
                  readOnly={isLoading}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              {t('common.cancel')}
            </Button>
            {generatedContent && (
              <Button onClick={handleUseContent}>
                <Check className="mr-2 h-4 w-4" />
                {t('blog.ai.useContent')}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
