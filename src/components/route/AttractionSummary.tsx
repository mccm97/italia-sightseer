import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { generateAttractionSummary } from '@/services/summarization';
import { Attraction } from '@/types/route';

interface AttractionSummaryProps {
  attraction: Attraction;
}

export function AttractionSummary({ attraction }: AttractionSummaryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState('');

  const handleOpen = async () => {
    setIsOpen(true);
    if (!summary) {
      const generatedSummary = await generateAttractionSummary(attraction.name);
      setSummary(generatedSummary);
    }
  };

  return (
    <>
      <button onClick={handleOpen} className="text-blue-500 underline">
        {attraction.name}
      </button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Dettagli Attrazione: {attraction.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{summary}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
