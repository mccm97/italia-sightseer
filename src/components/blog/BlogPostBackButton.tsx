
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BlogPostBackButton() {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="ghost" 
      onClick={() => navigate('/blog')}
      className="mb-6"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Torna al blog
    </Button>
  );
}
