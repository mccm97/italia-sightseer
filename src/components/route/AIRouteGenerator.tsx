
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Sparkles, Check, X, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateRouteContent } from '@/services/openai';
import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import { CreateRouteFormData } from '@/types/route';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AIRouteGeneratorProps {
  form: UseFormReturn<CreateRouteFormData>;
  cityName: string | undefined;
}

export function AIRouteGenerator({ form, cityName }: AIRouteGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attractionsCount, setAttractionsCount] = useState(5);
  const [showDemoAlert, setShowDemoAlert] = useState(false);
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  const handleGenerate = async () => {
    if (!cityName) {
      toast({
        title: t('routes.ai.noCitySelected'),
        description: t('routes.ai.pleaseSelectCity'),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setShowDemoAlert(true);

    try {
      console.log(`Generating route for city: ${cityName} with ${attractionsCount} attractions in ${i18n.language}`);
      const { content, error } = await generateRouteContent(
        cityName,
        attractionsCount,
        i18n.language
      );

      if (error) {
        console.error("Error from OpenAI service:", error);
        throw new Error(error);
      }

      // Try to parse the JSON response from OpenAI
      try {
        const routeData = JSON.parse(content);
        
        // Set the form values
        if (routeData.routeName) {
          form.setValue('name', routeData.routeName);
        }
        
        if (routeData.attractions && Array.isArray(routeData.attractions)) {
          // First set the attractions count
          form.setValue('attractionsCount', routeData.attractions.length);
          
          // Then update each attraction
          routeData.attractions.forEach((attraction: any, index: number) => {
            if (index < routeData.attractions.length) {
              form.setValue(`attractions.${index}.name`, attraction.name);
              form.setValue(`attractions.${index}.inputType`, 'name');
              form.setValue(`attractions.${index}.visitDuration`, attraction.visitDuration || 60);
              form.setValue(`attractions.${index}.price`, attraction.price || 0);
            }
          });
        }

        toast({
          title: t('routes.ai.success'),
          description: t('routes.ai.routeGenerated'),
        });

        setIsOpen(false);
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        toast({
          title: t('routes.ai.parseError'),
          description: t('routes.ai.invalidFormat'),
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating route:', error);
      toast({
        title: t('routes.ai.error'),
        description: t('routes.ai.errorGeneration'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1"
        type="button"
      >
        <Sparkles className="h-4 w-4" />
        <span>{t('routes.ai.assistant')}</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('routes.ai.assistantTitle')}</DialogTitle>
            <DialogDescription>
              {t('routes.ai.assistantDescription')}
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
              <Label>{t('routes.ai.selectedCity')}</Label>
              <div className="p-2 border rounded-md">
                {cityName || t('routes.ai.noCity')}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('routes.ai.attractionsCount')}</Label>
              <Input
                type="number"
                value={attractionsCount}
                onChange={(e) => setAttractionsCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                min={1}
                max={10}
              />
              <p className="text-sm text-gray-500">{t('routes.ai.attractionsCountNote')}</p>
            </div>

            <div className="pt-4">
              <Button onClick={handleGenerate} disabled={isLoading || !cityName} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('routes.ai.generating')}
                  </>
                ) : (
                  t('routes.ai.generate')
                )}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              {t('common.cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
