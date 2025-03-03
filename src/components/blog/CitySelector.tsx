
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import CitySearch from "@/components/CitySearch";
import { useTranslation } from "react-i18next";

interface CitySelectorProps {
  isAboutCity: boolean;
  setIsAboutCity: (value: boolean) => void;
  selectedCity: any;
  setSelectedCity: (city: any) => void;
}

export function CitySelector({ 
  isAboutCity, 
  setIsAboutCity, 
  selectedCity, 
  setSelectedCity 
}: CitySelectorProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          id="city-mode"
          checked={isAboutCity}
          onCheckedChange={setIsAboutCity}
        />
        <Label htmlFor="city-mode" className="flex items-center space-x-2">
          <MapPin className="h-4 w-4" />
          <span>{t('blog.writePost.selectCity')}</span>
        </Label>
      </div>

      {isAboutCity && (
        <div className="mt-4">
          <Label>{t('blog.writePost.chooseCity')}</Label>
          <CitySearch onCitySelect={setSelectedCity} />
        </div>
      )}
    </>
  );
}
