import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Info,
  Zap,
  Brain,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Set up moment locale
moment.locale('de');

const localizer = momentLocalizer(moment);

interface ProtocolEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'dose' | 'pause' | 'break';
  status: 'scheduled' | 'completed' | 'missed' | 'skipped';
  protocolId: string;
  protocolType: string;
  protocolName: string;
  substance?: string;
  dose?: number;
  doseUnit?: string;
  isRange?: boolean; // For protocol ranges
}

interface ProtocolCalendarProps {
  protocols: any[];
  events: any[];
  onEventSelect?: (event: any) => void;
  onProtocolSelect?: (protocol: any) => void;
}

export const ProtocolCalendar: React.FC<ProtocolCalendarProps> = ({
  protocols,
  events,
  onEventSelect,
  onProtocolSelect,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);
  const navigate = useNavigate();

  // Transform events and protocols into calendar format
  const calendarEvents = useMemo(() => {
    const calendarItems: ProtocolEvent[] = [];

    // Add protocol ranges as background events
    protocols.forEach(protocol => {
      if (protocol.status === 'active' || protocol.status === 'paused') {
        // Create dates without time to avoid timezone issues
        const startDate = new Date(protocol.startDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(protocol.endDate);
        endDate.setHours(0, 0, 0, 0);
        
        calendarItems.push({
          id: `protocol-${protocol.id}`,
          title: `${protocol.name} (${protocol.type})`,
          start: startDate,
          end: endDate,
          type: 'break' as const,
          status: 'scheduled' as const,
          protocolId: protocol.id,
          protocolType: protocol.type,
          protocolName: protocol.name,
          isRange: true,
        });
      }
    });

    // Add individual events
    events.forEach(event => {
      // Create date without time to avoid timezone issues
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      const endDate = new Date(eventDate);
      endDate.setDate(endDate.getDate() + 1); // Full day event

      calendarItems.push({
        id: event.id,
        title: event.type === 'dose' 
          ? `${event.dose} ${event.doseUnit} ${event.substance}`
          : 'Pausentag',
        start: eventDate,
        end: endDate,
        type: event.type,
        status: event.status,
        protocolId: event.protocolId,
        protocolType: protocols.find(p => p.id === event.protocolId)?.type || 'unknown',
        protocolName: protocols.find(p => p.id === event.protocolId)?.name || 'Unknown',
        substance: event.substance,
        dose: event.dose,
        doseUnit: event.doseUnit,
        isRange: false,
      });
    });

    return calendarItems;
  }, [protocols, events]);

  // Event style getter with elegant landing page colors
  const eventStyleGetter = (event: ProtocolEvent) => {
    let backgroundColor = '';
    let borderColor = '';
    let color = '#fff';
    let zIndex = 1;
    let boxShadow = '';

    if (event.isRange) {
      // Protocol ranges - elegant subtle backgrounds
      zIndex = 1;
      switch (event.protocolType) {
        case 'fadiman':
          backgroundColor = 'rgba(99, 179, 237, 0.15)'; // Calm turquoise with 15% opacity
          borderColor = 'rgba(99, 179, 237, 0.4)';
          break;
        case 'stamets':
          backgroundColor = 'rgba(196, 181, 253, 0.15)'; // Calm lilac with 15% opacity
          borderColor = 'rgba(196, 181, 253, 0.4)';
          break;
        case 'custom':
          backgroundColor = 'rgba(252, 211, 77, 0.15)'; // Calm yellow with 15% opacity
          borderColor = 'rgba(252, 211, 77, 0.4)';
          break;
        default:
          backgroundColor = 'rgba(156, 163, 175, 0.1)';
          borderColor = 'rgba(156, 163, 175, 0.3)';
      }
    } else {
      // Individual events - elegant full opacity with gradients
      zIndex = 10;
      switch (event.type) {
        case 'dose':
          switch (event.status) {
            case 'completed':
              backgroundColor = 'linear-gradient(135deg, #10B981, #059669)';
              borderColor = '#059669';
              boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
              break;
            case 'missed':
              backgroundColor = 'linear-gradient(135deg, #EF4444, #DC2626)';
              borderColor = '#DC2626';
              boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
              break;
            case 'skipped':
              backgroundColor = 'linear-gradient(135deg, #F59E0B, #D97706)';
              borderColor = '#D97706';
              boxShadow = '0 2px 8px rgba(245, 158, 11, 0.3)';
              break;
            default:
              backgroundColor = 'linear-gradient(135deg, #63B3ED, #4299E1)'; // Calm turquoise gradient
              borderColor = '#4299E1';
              boxShadow = '0 2px 8px rgba(99, 179, 237, 0.3)';
          }
          break;
        case 'pause':
          backgroundColor = 'linear-gradient(135deg, #A78BFA, #8B5CF6)'; // Calm lilac gradient
          borderColor = '#8B5CF6';
          boxShadow = '0 2px 8px rgba(167, 139, 250, 0.3)';
          break;
        default:
          backgroundColor = 'linear-gradient(135deg, #9CA3AF, #6B7280)';
          borderColor = '#6B7280';
          boxShadow = '0 2px 8px rgba(156, 163, 175, 0.3)';
      }
    }

    return {
      style: {
        background: backgroundColor,
        borderColor,
        color,
        border: `1px solid ${borderColor}`,
        borderRadius: '12px',
        zIndex,
        opacity: event.isRange ? 0.4 : 1,
        fontSize: '11px',
        padding: '4px 8px',
        boxShadow,
        fontWeight: '500',
        backdropFilter: 'blur(4px)',
      },
    };
  };

  // Handle event selection
  const handleSelectEvent = (event: ProtocolEvent) => {
    if (event.isRange) {
      // Protocol range selected
      const protocol = protocols.find(p => p.id === event.protocolId);
      if (protocol && onProtocolSelect) {
        onProtocolSelect(protocol);
      }
    } else {
      // Individual event selected - navigate to daily view
      // Fix timezone issue by creating a new date with local timezone
      const eventDate = new Date(event.start);
      eventDate.setHours(0, 0, 0, 0); // Reset to start of day
      const year = eventDate.getFullYear();
      const month = String(eventDate.getMonth() + 1).padStart(2, '0');
      const day = String(eventDate.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      navigate(`/daily/${dateString}`);
    }
  };

  // Handle date selection (double-click on empty date)
  const handleSelectSlot = (slotInfo: any) => {
    // Fix timezone issue by creating a new date with local timezone
    const selectedDate = new Date(slotInfo.start);
    selectedDate.setHours(0, 0, 0, 0); // Reset to start of day
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    navigate(`/daily/${dateString}`);
  };

  // Custom toolbar
  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
      toolbar.onNavigate('TODAY');
    };

    const handleViewChange = (newView: any) => {
      toolbar.onView(newView);
    };

    return (
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToBack}
            className="rounded-2xl border-white/40 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            className="rounded-2xl border-white/40 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToCurrent}
            className="rounded-2xl border-white/40 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
          >
            Heute
          </Button>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">
            {moment(toolbar.date).format('MMMM YYYY')}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={toolbar.view === Views.MONTH ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange(Views.MONTH)}
            className="rounded-2xl"
          >
            Monat
          </Button>
          <Button
            variant={toolbar.view === Views.WEEK ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange(Views.WEEK)}
            className="rounded-2xl"
          >
            Woche
          </Button>
        </div>
      </div>
    );
  };

  // Custom event component with elegant styling
  const EventComponent = ({ event }: { event: ProtocolEvent }) => {
    const getEventIcon = () => {
      if (event.isRange) {
        switch (event.protocolType) {
          case 'fadiman':
            return <Zap className="w-3 h-3 text-white" />;
          case 'stamets':
            return <Brain className="w-3 h-3 text-white" />;
          case 'custom':
            return <Settings className="w-3 h-3 text-white" />;
          default:
            return <CalendarIcon className="w-3 h-3 text-white" />;
        }
      } else {
        // Individual event icons
        switch (event.type) {
          case 'dose':
            return <span className="text-xs">💊</span>;
          case 'pause':
            return <span className="text-xs">⏸️</span>;
          default:
            return <span className="text-xs">📅</span>;
        }
      }
    };

    return (
      <div className="flex items-center space-x-2 h-full">
        <div className="flex-shrink-0">
          {getEventIcon()}
        </div>
        <span className="truncate text-xs font-medium leading-tight">{event.title}</span>
      </div>
    );
  };

  return (
    <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-calm-turquoise-100/20 to-calm-lilac-100/20 backdrop-blur-sm border-b border-white/20">
        <CardTitle className="flex items-center font-soft">
          <div className="w-10 h-10 bg-gradient-to-br from-calm-turquoise-400 to-calm-lilac-400 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
            <CalendarIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-xl font-light text-slate-800">
              Mikrodosierungs-
              <span className="bg-gradient-to-r from-calm-turquoise-400 to-calm-lilac-400 bg-clip-text text-transparent font-medium">
                Kalender
              </span>
            </div>
            <CardDescription className="font-soft text-slate-600 mt-1">
              Übersicht Ihrer Protokolle und geplanten Einnahmetage
            </CardDescription>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Elegant Legend */}
        <div className="mb-8 p-6 bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-md rounded-3xl border border-white/30 shadow-lg">
          <h4 className="font-soft font-semibold text-slate-800 mb-4 text-lg">Legende</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-3 p-2 rounded-2xl bg-white/40 backdrop-blur-sm">
              <div className="w-5 h-5 rounded-xl bg-gradient-to-br from-calm-turquoise-400 to-calm-turquoise-500 shadow-sm"></div>
              <span className="font-soft text-slate-700">Geplante Einnahme</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-2xl bg-white/40 backdrop-blur-sm">
              <div className="w-5 h-5 rounded-xl bg-gradient-to-br from-green-400 to-green-500 shadow-sm"></div>
              <span className="font-soft text-slate-700">Abgeschlossen</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-2xl bg-white/40 backdrop-blur-sm">
              <div className="w-5 h-5 rounded-xl bg-gradient-to-br from-red-400 to-red-500 shadow-sm"></div>
              <span className="font-soft text-slate-700">Verpasst</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-2xl bg-white/40 backdrop-blur-sm">
              <div className="w-5 h-5 rounded-xl bg-gradient-to-br from-calm-lilac-400 to-calm-lilac-500 shadow-sm"></div>
              <span className="font-soft text-slate-700">Pausentag</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/40">
            <h5 className="font-soft font-medium text-slate-800 mb-3">Protokoll-Bereiche:</h5>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-gradient-to-r from-calm-turquoise-100/50 to-calm-turquoise-200/50 backdrop-blur-sm border border-calm-turquoise-200/30">
                <div className="w-5 h-5 rounded-xl bg-gradient-to-br from-calm-turquoise-300 to-calm-turquoise-400 shadow-sm"></div>
                <span className="font-soft text-slate-700 font-medium">Fadiman</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-gradient-to-r from-calm-lilac-100/50 to-calm-lilac-200/50 backdrop-blur-sm border border-calm-lilac-200/30">
                <div className="w-5 h-5 rounded-xl bg-gradient-to-br from-calm-lilac-300 to-calm-lilac-400 shadow-sm"></div>
                <span className="font-soft text-slate-700 font-medium">Stamets</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-gradient-to-r from-calm-yellow-100/50 to-calm-yellow-200/50 backdrop-blur-sm border border-calm-yellow-200/30">
                <div className="w-5 h-5 rounded-xl bg-gradient-to-br from-calm-yellow-300 to-calm-yellow-400 shadow-sm"></div>
                <span className="font-soft text-slate-700 font-medium">Custom</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="h-[650px] p-2">
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={currentDate}
            onNavigate={setCurrentDate}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            eventPropGetter={eventStyleGetter}
            components={{
              toolbar: CustomToolbar,
              event: EventComponent,
            }}
            views={[Views.MONTH, Views.WEEK]}
            step={60}
            timeslots={1}
            showMultiDayTimes
            popup
            popupOffset={{ x: 10, y: 10 }}
            messages={{
              next: 'Nächster',
              previous: 'Vorheriger',
              today: 'Heute',
              month: 'Monat',
              week: 'Woche',
              day: 'Tag',
              agenda: 'Agenda',
              date: 'Datum',
              time: 'Zeit',
              event: 'Ereignis',
              noEventsInRange: 'Keine Ereignisse in diesem Zeitraum',
              showMore: (total: number) => `+${total} weitere`,
            }}
            style={{ height: '100%' }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
