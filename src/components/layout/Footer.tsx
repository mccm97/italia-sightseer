import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="mt-auto py-6 bg-background border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} WayWonder. Tutti i diritti riservati.
          </div>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">
              Termini di Servizio
            </Link>
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/cookie-policy" className="hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}