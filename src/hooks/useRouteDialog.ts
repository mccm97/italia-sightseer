import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function useRouteDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreatePost = () => {
    console.log('Navigating to blog page');
    setIsOpen(false);
    navigate('/blog');
  };

  const handleCreateRoute = () => {
    console.log('Opening route creation dialog');
    setIsOpen(false);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    console.log('Dialog state changing to:', open);
    setIsDialogOpen(open);
    if (!open) {
      setStep('form');
    }
  };

  const showSuccessToast = () => {
    console.log('Showing success toast');
    toast({
      title: "Successo",
      description: "Percorso creato con successo!",
      variant: "default",
    });
  };

  const showErrorToast = () => {
    console.log('Showing error toast');
    toast({
      title: "Errore",
      description: "Si è verificato un errore durante la creazione del percorso.",
      variant: "destructive",
    });
  };

  return {
    isOpen,
    setIsOpen,
    isDialogOpen,
    step,
    setStep,
    handleCreatePost,
    handleCreateRoute,
    handleDialogClose,
    showSuccessToast,
    showErrorToast
  };
}