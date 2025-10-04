'use client';

import { useTranslations } from 'next-intl';
import { DashboardHeader } from '../../components/DashboardHeader';
import { DashboardCard } from '../../components/DashboardCard';
import { WeatherForecast } from '../../components/WeatherForecast';
import { FarmMetricsChart } from '../../components/FarmMetricsChart';
import { UpcomingActivities } from '../../components/UpcomingActivities';
import { AICropRecommendations } from '../../components/AICropRecommendations';

export default function HomePage() {
  const t = useTranslations();
  
  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <DashboardHeader title={t('dashboard.title')} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title={t('dashboard.weather_forecast')}>
          <WeatherForecast />
        </DashboardCard>
        
        <DashboardCard title={t('dashboard.upcoming_activities')}>
          <UpcomingActivities />
        </DashboardCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCard title={t('dashboard.farm_metrics')}>
            <FarmMetricsChart />
          </DashboardCard>
        </div>
        
        <div>
          <DashboardCard title={t('dashboard.crop_recommendations')}>
            <AICropRecommendations />
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
