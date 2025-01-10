import React from 'react';
import { CitySearchSection } from '@/components/home/CitySearchSection';
import { useNavigate } from 'react-router-dom';
import { MainMenu } from '@/components/MainMenu';
import { Header } from '@/components/layout/Header';

export default function Search() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <MainMenu />
      <Header user={null} />
      <CitySearchSection 
        setSelectedCity={(city) => {
          if (city) {
            navigate('/', { state: { selectedCity: city } });
          }
        }} 
      />
    </div>
  );
}