import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { LogOut, User, Users, BookOpen, Calendar, Settings } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getRoleDisplay = (type: string) => {
    switch (type) {
      case 'admin':
        return { label: 'مدير النظام', variant: 'default' as const };
      case 'Mem':
        return { label: 'معلم التحفيظ', variant: 'secondary' as const };
      case 'Rev':
        return { label: 'معلم المراجعة', variant: 'outline' as const };
      default:
        return { label: 'مستخدم', variant: 'secondary' as const };
    }
  };

  const roleInfo = getRoleDisplay(user.type);

  return (
    <div className="min-h-screen bg-background geometric-pattern">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 gradient-primary rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary font-arabic">
                  نظام إدارة حلقات القرآن
                </h1>
                <p className="text-sm text-muted-foreground">
                  إدارة الطلاب والمعلمين وتتبع التقدم
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Card className="border-primary/20">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{user.userName}</p>
                      <Badge variant={roleInfo.variant} className="text-xs">
                        {roleInfo.label}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button variant="outline" onClick={logout} className="gap-2">
                <LogOut className="h-4 w-4" />
                خروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;