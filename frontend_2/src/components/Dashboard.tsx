import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from './layout/DashboardLayout';
import AdminDashboard from './dashboard/AdminDashboard';
import TeacherDashboard from './dashboard/TeacherDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const renderDashboardContent = () => {
    switch (user.type) {
      case 'admin':
        return <AdminDashboard />;
      case 'Mem':
      case 'Rev':
        return <TeacherDashboard />;
      default:
        return <TeacherDashboard />;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboardContent()}
    </DashboardLayout>
  );
};

export default Dashboard;