'use client';

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

import { useQuery } from 'convex/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Calendar,
} from 'lucide-react';
import { BackButton } from '@/components/shared/back-button';
import { CalendarView } from '@/components/calendar/calendar-view';
import { EventDetails } from '@/components/calendar/event-details';
import { EventForm } from '@/components/calendar/event-form';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

type ViewMode = 'calendar' | 'create' | 'edit' | 'details';

export default function CalendarPage() {
  const [currentView, setCurrentView] = useState<ViewMode>('calendar');
  const [selectedEventId, setSelectedEventId] =
    useState<Id<'calendarEvents'> | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get current user info
  const currentUser = useQuery(api.users.current);

  // Get events for organizer check
  const events = useQuery(api.calendar.getEvents, { userId: undefined });

  const handleEventClick = (event: any) => {
    setSelectedEventId(event._id);
    setCurrentView('details');
  };

  const handleCreateEvent = () => {
    setSelectedDate(null);
    setCurrentView('create');
  };

  const handleEditEvent = (eventId: Id<'calendarEvents'>) => {
    setSelectedEventId(eventId);
    setCurrentView('edit');
  };

  const handleSaveEvent = (eventId: Id<'calendarEvents'>) => {
    setCurrentView('calendar');
    setSelectedEventId(null);
    setSelectedDate(null);
  };

  const handleCancel = () => {
    setCurrentView('calendar');
    setSelectedEventId(null);
    setSelectedDate(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        return (
          <Dialog open={true} onOpenChange={handleCancel}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <EventForm
                selectedDate={selectedDate || undefined}
                onSave={handleSaveEvent}
                onCancel={handleCancel}
              />
            </DialogContent>
          </Dialog>
        );

      case 'edit':
        return selectedEventId ? (
          <Dialog open={true} onOpenChange={handleCancel}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <EventForm
                eventId={selectedEventId}
                onSave={handleSaveEvent}
                onCancel={handleCancel}
              />
            </DialogContent>
          </Dialog>
        ) : null;

      case 'details':
        return selectedEventId ? (
          <Dialog open={true} onOpenChange={handleCancel}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <EventDetails
                eventId={selectedEventId}
                onClose={handleCancel}
                onEdit={handleEditEvent}
                isOrganizer={(() => {
                  // Check if current user is organizer
                  const event = events?.find(e => e._id === selectedEventId);
                  return currentUser && event
                    ? currentUser._id === event.organizerId
                    : false;
                })()}
              />
            </DialogContent>
          </Dialog>
        ) : null;

      default:
        return (
          <CalendarView
            onEventClick={handleEventClick}
            onCreateEvent={handleCreateEvent}
            selectedDate={selectedDate || undefined}
            onDateSelect={setSelectedDate}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Calendario Comunitario
          </h1>
          <p className="text-muted-foreground">
            Gestiona eventos, actividades y programaciones de la comunidad
          </p>
        </div>
      </div>

      {/* Calendar Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-card rounded-lg border p-6"
      >
        {renderCurrentView()}
      </motion.div>
    </div>
  );
}
