import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  Calendar, 
  TrendingUp, 
  Target, 
  CheckCircle, 
  FileText,
  Info,
  Award
} from 'lucide-react';

interface AdherenceData {
  data: { [key: string]: number };
  statistics: {
    overallAdherence: number;
    averageScore: number;
    totalDays: number;
    completedDays: number;
    missedDays: number;
    skippedDays: number;
    journalEntries: number;
  };
  timeRange: {
    start: string;
    end: string;
    days: number;
  };
}

interface AdherenceHeatmapProps {
  data: AdherenceData;
  isLoading?: boolean;
  onTimeRangeChange?: (days: number) => void;
}

export const AdherenceHeatmap: React.FC<AdherenceHeatmapProps> = ({
  data,
  isLoading = false,
  onTimeRangeChange,
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(365);
  const [hoveredDay, setHoveredDay] = useState<{ date: string; value: number; x: number; y: number } | null>(null);

  // Custom color scheme using landing page colors
  const getAdherenceColor = (value: number) => {
    if (value === 0) return '#f1f5f9'; // No activity - light gray
    if (value <= 1) return '#fef3c7'; // Poor adherence - calm yellow
    if (value <= 2) return '#fed7aa'; // Below average - calm peach
    if (value <= 3) return '#a7f3d0'; // Good - calm turquoise
    if (value <= 4) return '#93c5fd'; // Very good - calm lilac
    return '#c084fc'; // Excellent - deep lilac
  };


  const getAdherenceDescription = (value: number) => {
    if (value === 0) return 'Kein Protokoll-Event an diesem Tag';
    if (value <= 1) return 'Event verpasst oder schlecht abgeschlossen';
    if (value <= 2) return 'Event übersprungen oder teilweise abgeschlossen';
    if (value <= 3) return 'Event abgeschlossen, wenig Journaling';
    if (value <= 4) return 'Event abgeschlossen mit gutem Journaling';
    return 'Event abgeschlossen mit exzellentem Journaling';
  };

  // Generate calendar data organized by weeks (like GitHub)
  const generateCalendarData = () => {
    if (!data) return { weeks: [], months: [] };
    
    const startDate = new Date(data.timeRange.start);
    const endDate = new Date(data.timeRange.end);
    
    // Find the start of the week for the start date (Monday = 0)
    const startOfWeek = new Date(startDate);
    const dayOfWeek = startDate.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert Sunday=0 to Monday=0
    startOfWeek.setDate(startDate.getDate() - daysToMonday);
    
    // Find the end of the week for the end date
    const endOfWeek = new Date(endDate);
    const endDayOfWeek = endDate.getDay();
    const daysToSunday = endDayOfWeek === 0 ? 0 : 7 - endDayOfWeek;
    endOfWeek.setDate(endDate.getDate() + daysToSunday);
    
    const weeks = [];
    let currentDate = new Date(startOfWeek);
    
    // Generate weeks first (Monday to Sunday)
    while (currentDate <= endOfWeek) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const dayDate = new Date(currentDate);
        dayDate.setDate(currentDate.getDate() + i);
        
        const dateKey = dayDate.toISOString().split('T')[0];
        const value = data.data[dateKey] || 0;
        
        week.push({
          date: dateKey,
          value: value,
          day: dayDate.getDate(),
          month: dayDate.getMonth(),
          year: dayDate.getFullYear(),
          dayOfWeek: dayDate.getDay(), // 0=Sunday, 1=Monday, etc.
          isInRange: dayDate >= startDate && dayDate <= endDate,
        });
      }
      weeks.push(week);
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    // Generate months based on actual weeks
    const months = [];
    let currentMonth = new Date(startOfWeek);
    currentMonth.setDate(1); // First day of month
    
    while (currentMonth <= endOfWeek) {
      const monthStart = new Date(currentMonth);
      const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      // Find which week columns this month spans
      const monthStartWeek = Math.floor((monthStart.getTime() - startOfWeek.getTime()) / (7 * 24 * 60 * 60 * 1000));
      const monthEndWeek = Math.floor((monthEnd.getTime() - startOfWeek.getTime()) / (7 * 24 * 60 * 60 * 1000));
      
      months.push({
        name: currentMonth.toLocaleDateString('de-DE', { month: 'short' }),
        start: monthStart,
        end: monthEnd,
        startWeek: Math.max(0, monthStartWeek),
        endWeek: Math.min(weeks.length - 1, monthEndWeek),
        span: Math.max(1, monthEndWeek - monthStartWeek + 1),
      });
      
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }
    
    return { weeks, months };
  };

  const { weeks, months } = generateCalendarData();

  const handleTimeRangeChange = (days: number) => {
    setSelectedTimeRange(days);
    onTimeRangeChange?.(days);
  };

  const getAdherenceGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (percentage >= 50) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { grade: 'D', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const adherenceGrade = getAdherenceGrade(data?.statistics?.overallAdherence || 0);

  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md rounded-3xl border border-white/30 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-calm-turquoise-100/20 to-calm-lilac-100/20 backdrop-blur-sm border-b border-white/20">
          <CardTitle className="flex items-center font-soft">
            <div className="w-10 h-10 bg-gradient-to-br from-calm-turquoise-400 to-calm-lilac-400 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-light text-slate-800">
                Adherence-
                <span className="bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 bg-clip-text text-transparent font-medium">
                  Heatmap
                </span>
              </div>
              <CardDescription className="font-soft text-slate-600 mt-1">
                Lade Ihre Protokoll-Adherence-Daten...
              </CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="h-64 bg-slate-200 rounded-2xl"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md rounded-3xl border border-white/30 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-calm-turquoise-100/20 to-calm-lilac-100/20 backdrop-blur-sm border-b border-white/20">
        <CardTitle className="flex items-center font-soft">
          <div className="w-10 h-10 bg-gradient-to-br from-calm-turquoise-400 to-calm-lilac-400 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-xl font-light text-slate-800">
              Adherence-
              <span className="bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 bg-clip-text text-transparent font-medium">
                Heatmap
              </span>
            </div>
            <CardDescription className="font-soft text-slate-600 mt-1">
              Ihre tägliche Protokoll-Adherence und Journaling-Aktivität
            </CardDescription>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Time Range Selector */}
        <div className="mb-6 p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-slate-600" />
              <span className="font-soft font-semibold text-slate-800">Zeitraum:</span>
            </div>
            <div className="flex space-x-2">
              {[90, 180, 365].map((days) => (
                <Button
                  key={days}
                  variant={selectedTimeRange === days ? "default" : "outline"}
                  onClick={() => handleTimeRangeChange(days)}
                  className="rounded-2xl text-sm px-4 py-2"
                >
                  {days === 90 ? '3 Monate' : 
                   days === 180 ? '6 Monate' : '1 Jahr'}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-calm-turquoise-100/50 to-calm-turquoise-200/50 backdrop-blur-sm rounded-2xl border border-calm-turquoise-200/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-calm-turquoise-400 to-calm-turquoise-500 rounded-xl flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-2xl font-soft font-bold text-slate-800">
                  {data?.statistics?.overallAdherence || 0}%
                </div>
                <div className="text-xs font-soft text-slate-600">Gesamt-Adherence</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-calm-lilac-100/50 to-calm-lilac-200/50 backdrop-blur-sm rounded-2xl border border-calm-lilac-200/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-calm-lilac-400 to-calm-lilac-500 rounded-xl flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-2xl font-soft font-bold text-slate-800">
                  {data?.statistics?.averageScore?.toFixed(1) || '0.0'}
                </div>
                <div className="text-xs font-soft text-slate-600">Ø Score</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-100/50 to-green-200/50 backdrop-blur-sm rounded-2xl border border-green-200/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-2xl font-soft font-bold text-slate-800">
                  {data?.statistics?.completedDays || 0}
                </div>
                <div className="text-xs font-soft text-slate-600">Abgeschlossen</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-calm-yellow-100/50 to-calm-yellow-200/50 backdrop-blur-sm rounded-2xl border border-calm-yellow-200/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-calm-yellow-400 to-calm-yellow-500 rounded-xl flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-2xl font-soft font-bold text-slate-800">
                  {data?.statistics?.journalEntries || 0}
                </div>
                <div className="text-xs font-soft text-slate-600">Journal-Einträge</div>
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="mb-6 relative">
          <div className="w-full overflow-x-auto">
            <div className="min-w-max">
              {/* Month headers */}
              <div className="flex mb-2 ml-8">
                {months.map((month, index) => (
                  <div 
                    key={index} 
                    className="text-xs font-medium text-slate-600"
                    style={{ 
                      width: `${month.span * 12}px`,
                      minWidth: '20px'
                    }}
                  >
                    {month.name}
                  </div>
                ))}
              </div>
              
              {/* Day labels */}
              <div className="flex">
                <div className="w-8 flex flex-col gap-1">
                  {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day, index) => (
                    <div key={index} className="h-3 text-xs text-slate-500 flex items-center justify-center">
                      {index % 2 === 0 ? day : ''}
                    </div>
                  ))}
                </div>
                
                {/* Calendar grid - GitHub style */}
                <div className="flex gap-1">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {week.map((day, dayIndex) => (
                        <div
                          key={dayIndex}
                          className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-sm border border-white/20 ${
                            !day.isInRange ? 'opacity-30' : ''
                          }`}
                          style={{ backgroundColor: getAdherenceColor(day.value) }}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredDay({ 
                              date: day.date, 
                              value: day.value,
                              x: rect.left + rect.width / 2,
                              y: rect.top - 10
                            });
                          }}
                          onMouseLeave={() => setHoveredDay(null)}
                          title={`${new Date(day.date).toLocaleDateString('de-DE')}: ${day.value.toFixed(1)}/5.0`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Tooltip */}
          {hoveredDay && (
            <div className="fixed z-50 bg-white/95 backdrop-blur-md border border-white/30 rounded-2xl p-4 shadow-xl pointer-events-none"
                 style={{ 
                   left: `${hoveredDay.x}px`, 
                   top: `${hoveredDay.y}px`, 
                   transform: 'translate(-50%, -100%)',
                   minWidth: '200px'
                 }}>
              <div className="font-soft font-semibold text-slate-800 mb-1">
                {new Date(hoveredDay.date).toLocaleDateString('de-DE', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-sm font-soft text-slate-600 mb-2">
                Adherence-Score: <span className="font-semibold">{hoveredDay.value.toFixed(1)}/5.0</span>
              </div>
              <div className="text-xs font-soft text-slate-500">
                {getAdherenceDescription(hoveredDay.value)}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="p-4 bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
          <h4 className="font-soft font-semibold text-slate-800 mb-3">Legende</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded bg-slate-200"></div>
              <span className="font-soft text-slate-700">Keine Aktivität</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded bg-calm-yellow-300"></div>
              <span className="font-soft text-slate-700">Schlechte Adherence</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded bg-calm-peach-300"></div>
              <span className="font-soft text-slate-700">Unterdurchschnittlich</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded bg-calm-turquoise-300"></div>
              <span className="font-soft text-slate-700">Gute Adherence</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded bg-calm-lilac-300"></div>
              <span className="font-soft text-slate-700">Sehr gute Adherence</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded bg-purple-400"></div>
              <span className="font-soft text-slate-700">Exzellente Adherence</span>
            </div>
          </div>
        </div>

        {/* Adherence Grade */}
        <div className="mt-6 p-4 bg-gradient-to-r from-calm-turquoise-100/30 to-calm-lilac-100/30 backdrop-blur-sm rounded-2xl border border-white/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 ${adherenceGrade.bg} rounded-2xl flex items-center justify-center`}>
                <span className={`text-2xl font-bold ${adherenceGrade.color}`}>
                  {adherenceGrade.grade}
                </span>
              </div>
              <div>
                <div className="font-soft font-semibold text-slate-800">Adherence-Bewertung</div>
                <div className="text-sm font-soft text-slate-600">
                  Basierend auf Protokoll-Einhaltung und Journaling-Qualität
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-soft font-bold text-slate-800">
                {data?.statistics?.overallAdherence || 0}%
              </div>
              <div className="text-sm font-soft text-slate-600">Gesamtbewertung</div>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-6 p-4 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm rounded-2xl border border-white/30">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-soft font-semibold text-slate-800 mb-2">Wie wird die Adherence berechnet?</div>
              <div className="text-sm font-soft text-slate-600 space-y-2">
                <p>
                  <strong>Basis-Score (0-4):</strong> Abgeschlossene Events erhalten 4 Punkte, übersprungene 2 Punkte, verpasste 1 Punkt.
                </p>
                <p>
                  <strong>Journaling-Bonus (+0.5-1.0):</strong> Intentionen (+0.5), Reflexionen (+0.5), Assessments (+1.0) erhöhen den Score.
                </p>
                <p>
                  <strong>Maximaler Score:</strong> 5.0 Punkte für perfekte Adherence mit vollständigem Journaling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
