'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns';

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  type: 'planting' | 'harvesting' | 'fertilizing' | 'watering' | 'maintenance';
  crop?: string;
  location?: string;
};

export function CalendarView() {
  const t = useTranslations();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  
  // Mock data for demonstration
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Plant Koshihikari Rice',
      date: '2025-05-20',
      type: 'planting',
      crop: 'Rice',
      location: 'North Field'
    },
    {
      id: '2',
      title: 'Fertilize Vegetable Garden',
      date: '2025-05-22',
      type: 'fertilizing',
      crop: 'Mixed Vegetables',
      location: 'South Plot'
    },
    {
      id: '3',
      title: 'Irrigation System Maintenance',
      date: '2025-05-25',
      type: 'maintenance',
      location: 'All Fields'
    },
    {
      id: '4',
      title: 'Harvest Early Vegetables',
      date: '2025-05-28',
      type: 'harvesting',
      crop: 'Leafy Greens',
      location: 'Greenhouse'
    },
    {
      id: '5',
      title: 'Water Newly Planted Areas',
      date: '2025-05-18',
      type: 'watering',
      location: 'East Field'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'planting':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'harvesting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'fertilizing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'watering':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'planting':
        return '🌱';
      case 'harvesting':
        return '🌾';
      case 'fertilizing':
        return '🧪';
      case 'watering':
        return '💧';
      case 'maintenance':
        return '🔧';
      default:
        return '📋';
    }
  };

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  // Generate days for the current month view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return events.filter(event => event.date === dayStr);
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex space-x-1">
            <button
              onClick={previousMonth}
              className="p-1 rounded hover:bg-gray-100"
            >
              ←
            </button>
            <button
              onClick={nextMonth}
              className="p-1 rounded hover:bg-gray-100"
            >
              →
            </button>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={goToCurrentMonth}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg"
          >
            {t('calendar.today')}
          </button>
          <button
            onClick={() => setView('month')}
            className={`px-3 py-1 text-sm rounded-lg ${
              view === 'month'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300'
            }`}
          >
            {t('calendar.month')}
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-3 py-1 text-sm rounded-lg ${
              view === 'week'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300'
            }`}
          >
            {t('calendar.week')}
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div>
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {[
            t('weather.sun'), 
            t('weather.mon'), 
            t('weather.tue'), 
            t('weather.wed'), 
            t('weather.thu'), 
            t('weather.fri'), 
            t('weather.sat')
          ].map((day) => (
            <div key={day} className="text-sm font-medium text-center py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: new Date(monthStart).getDay() }).map((_, index) => (
            <div key={`empty-${index}`} className="h-24 p-1 bg-gray-50"></div>
          ))}

          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            return (
              <div
                key={day.toString()}
                className={`h-24 p-1 border rounded-lg ${
                  isToday(day)
                    ? 'bg-primary-50 border-primary-200'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="text-right">
                  <span
                    className={`text-sm inline-block rounded-full w-6 h-6 text-center leading-6 ${
                      isToday(day) ? 'bg-primary-600 text-white' : ''
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                </div>
                <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-0.5 rounded truncate border ${getTypeColor(
                        event.type
                      )}`}
                    >
                      <span className="mr-1">{getTypeIcon(event.type)}</span>
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex justify-center space-x-4 text-xs text-gray-500">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-green-100 border border-green-200 rounded-full mr-1"></span>
          {t('calendar.planting')}
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded-full mr-1"></span>
          {t('calendar.harvesting')}
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-amber-100 border border-amber-200 rounded-full mr-1"></span>
          {t('calendar.fertilizing')}
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-blue-100 border border-blue-200 rounded-full mr-1"></span>
          {t('calendar.watering')}
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-gray-100 border border-gray-200 rounded-full mr-1"></span>
          {t('calendar.maintenance')}
        </div>
      </div>
    </div>
  );
}
