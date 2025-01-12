export const initializeAnalytics = () => {
  if (typeof window !== 'undefined' && (window as any).initGA) {
    (window as any).initGA();
  }
};

export const initializeMarketing = () => {
  console.log('Inizializzazione servizi marketing');
};

export const initializeSocialFeatures = () => {
  console.log('Inizializzazione funzionalità social');
};

export const clearNonEssentialCookies = () => {
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
};