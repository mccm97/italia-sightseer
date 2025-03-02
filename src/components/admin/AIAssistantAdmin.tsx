
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Check, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateCityInfo, generateMonumentInfo } from '@/services/openai';
import { useTranslation } from 'react-i18next';

interface AIAssistantAdminProps {
  onCityDataGenerated?: (cityData: any) => void;
  onMonumentDataGenerated?: (monumentData: any) => void;
}

export function AIAssistantAdmin({ 
  onCityDataGenerated,
  onMonumentDataGenerated
}: AIAssistantAdminProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('city');
  const [cityName, setCityName] = useState('');
  const [countryName, setCountryName] = useState('');
  const [monumentName, setMonumentName] = useState('');
  const [monumentCity, setMonumentCity] = useState('');
  const [generatedData, setGeneratedData] = useState<any>(null);
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  const handleGenerateCity = async () => {
    if (!cityName || !countryName) {
      toast({
        title: t('admin.ai.missingFields'),
        description: t('admin.ai.enterCityAndCountry'),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { content, error } = await generateCityInfo(
        cityName,
        countryName,
        i18n.language
      );

      if (error) {
        throw new Error(error);
      }

      try {
        const cityData = JSON.parse(content);
        setGeneratedData(cityData);
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        toast({
          title: t('admin.ai.parseError'),
          description: t('admin.ai.invalidFormat'),
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating city data:', error);
      toast({
        title: t('admin.ai.error'),
        description: t('admin.ai.errorGeneration'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateMonument = async () => {
    if (!monumentName || !monumentCity) {
      toast({
        title: t('admin.ai.missingFields'),
        description: t('admin.ai.enterMonumentAndCity'),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { content, error } = await generateMonumentInfo(
        monumentName,
        monumentCity,
        i18n.language
      );

      if (error) {
        throw new Error(error);
      }

      try {
        const monumentData = JSON.parse(content);
        setGeneratedData(monumentData);
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        toast({
          title: t('admin.ai.parseError'),
          description: t('admin.ai.invalidFormat'),
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating monument data:', error);
      toast({
        title: t('admin.ai.error'),
        description: t('admin.ai.errorGeneration'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseData = () => {
    if (activeTab === 'city' && onCityDataGenerated) {
      onCityDataGenerated(generatedData);
    } else if (activeTab === 'monument' && onMonumentDataGenerated) {
      onMonumentDataGenerated(generatedData);
    }

    setIsOpen(false);
    setGeneratedData(null);
    toast({
      title: t('admin.ai.dataApplied'),
      description: t('admin.ai.dataUpdated'),
    });
  };

  const resetForm = () => {
    setCityName('');
    setCountryName('');
    setMonumentName('');
    setMonumentCity('');
    setGeneratedData(null);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          setIsOpen(true);
          resetForm();
        }}
        className="flex items-center gap-1"
      >
        <Sparkles className="h-4 w-4" />
        <span>{t('admin.ai.assistant')}</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('admin.ai.assistantTitle')}</DialogTitle>
            <DialogDescription>
              {t('admin.ai.assistantDescription')}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value);
            setGeneratedData(null);
          }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="city">{t('admin.ai.generateCity')}</TabsTrigger>
              <TabsTrigger value="monument">{t('admin.ai.generateMonument')}</TabsTrigger>
            </TabsList>

            <TabsContent value="city" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>{t('admin.ai.cityName')}</Label>
                <Input
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  placeholder={t('admin.ai.enterCityName')}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('admin.ai.countryName')}</Label>
                <Input
                  value={countryName}
                  onChange={(e) => setCountryName(e.target.value)}
                  placeholder={t('admin.ai.enterCountryName')}
                />
              </div>

              <Button 
                onClick={handleGenerateCity} 
                disabled={isLoading || !cityName || !countryName} 
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('admin.ai.generating')}
                  </>
                ) : (
                  t('admin.ai.generateData')
                )}
              </Button>
            </TabsContent>

            <TabsContent value="monument" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>{t('admin.ai.monumentName')}</Label>
                <Input
                  value={monumentName}
                  onChange={(e) => setMonumentName(e.target.value)}
                  placeholder={t('admin.ai.enterMonumentName')}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('admin.ai.cityOfMonument')}</Label>
                <Input
                  value={monumentCity}
                  onChange={(e) => setMonumentCity(e.target.value)}
                  placeholder={t('admin.ai.enterCityOfMonument')}
                />
              </div>

              <Button 
                onClick={handleGenerateMonument} 
                disabled={isLoading || !monumentName || !monumentCity} 
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('admin.ai.generating')}
                  </>
                ) : (
                  t('admin.ai.generateData')
                )}
              </Button>
            </TabsContent>
          </Tabs>

          {generatedData && (
            <div className="space-y-2 mt-4">
              <Label>{t('admin.ai.generatedData')}</Label>
              <Textarea
                value={JSON.stringify(generatedData, null, 2)}
                className="min-h-[200px] font-mono text-sm"
                readOnly
              />
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              {t('common.cancel')}
            </Button>
            {generatedData && (
              <Button onClick={handleUseData}>
                <Check className="mr-2 h-4 w-4" />
                {t('admin.ai.useData')}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
