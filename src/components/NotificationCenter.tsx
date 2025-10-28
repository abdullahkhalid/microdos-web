import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, X, Clock, Mail, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAll, setShowAll] = useState(false);

  // Fetch notifications
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiClient.getNotifications(showAll ? 50 : 10),
  });

  // Mark as sent mutation
  const markAsSentMutation = useMutation({
    mutationFn: (notificationId: string) => apiClient.markNotificationSent(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: 'Notification marked as sent',
        description: 'The notification has been marked as sent.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to mark notification as sent.',
        variant: 'destructive',
      });
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) => apiClient.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: 'Notification deleted',
        description: 'The notification has been deleted.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete notification.',
        variant: 'destructive',
      });
    },
  });

  const notifications = notificationsData?.notifications || [];
  const pendingNotifications = notifications.filter(n => n.status === 'scheduled');
  const sentNotifications = notifications.filter(n => n.status === 'sent');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Bell className="h-4 w-4" />;
      case 'reflection':
        return <Clock className="h-4 w-4" />;
      case 'assessment':
        return <Mail className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="text-blue-600 border-blue-200">Scheduled</Badge>;
      case 'sent':
        return <Badge variant="outline" className="text-green-600 border-green-200">Sent</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="text-purple-600 border-purple-200">Delivered</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Benachrichtigungen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-slate-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Benachrichtigungen
            </CardTitle>
            <CardDescription>
              {pendingNotifications.length} ausstehend, {sentNotifications.length} gesendet
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Weniger anzeigen' : 'Alle anzeigen'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Keine Benachrichtigungen</p>
            <p className="text-sm text-slate-400">Ihre Benachrichtigungen werden hier angezeigt</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification: any) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-slate-900 truncate">
                      {notification.title}
                    </h4>
                    {getStatusBadge(notification.status)}
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {formatDate(notification.scheduledFor)}
                    </span>
                    <div className="flex space-x-2">
                      {notification.status === 'scheduled' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsSentMutation.mutate(notification.id)}
                          disabled={markAsSentMutation.isPending}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Markieren
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteNotificationMutation.mutate(notification.id)}
                        disabled={deleteNotificationMutation.isPending}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
