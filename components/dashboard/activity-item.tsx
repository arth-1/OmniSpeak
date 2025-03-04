'use client';

import { Clock } from 'lucide-react';

export function ActivityItem({ icon, title, description, timestamp }: ActivityItemProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="bg-primary/10 p-2 rounded-full">{icon}</div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center">
        <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{timestamp}</span>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  timestamp: string;
}