import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface HomeFeatureCardProps {
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  title: string;
  description: string;
  route: string;
  delay: number;
}

export function HomeFeatureCard({ 
  icon: Icon, 
  iconColor, 
  bgColor, 
  title, 
  description, 
  route, 
  delay 
}: HomeFeatureCardProps) {
  const navigate = useNavigate();

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      onClick={() => navigate(route)}
      className="p-6 space-y-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
    >
      <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center mx-auto`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground">
        {description}
      </p>
    </motion.article>
  );
}