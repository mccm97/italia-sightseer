
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function BlogPostBackButton() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <Button 
      variant="ghost" 
      onClick={() => navigate('/blog')}
      className="mb-6"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {t('blog.backToBlog')}
    </Button>
  );
}
