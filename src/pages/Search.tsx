import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CitySearchSection } from '@/components/home/CitySearchSection';
import { useNavigate } from 'react-router-dom';
import { Plane } from 'lucide-react';

export default function Search() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="container mx-auto p-4"
      >
        <motion.div
          initial={{ scale: 0, y: -100 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            delay: 0,
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          className="flex justify-center mb-8"
        >
          <Plane className="w-12 h-12 transform rotate-45" />
        </motion.div>
        
        <CitySearchSection 
          setSelectedCity={(city) => {
            if (city) {
              navigate('/', { state: { selectedCity: city } });
            }
          }} 
        />
      </motion.div>
    </div>
  );
}