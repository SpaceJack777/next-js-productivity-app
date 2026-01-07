'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { AppPagination } from '../app-pagination';

import { useMemo, useState } from 'react';

type Pomodoro = {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const PAGE_SIZE = 8;

export function FocusTimerInfo({ sessions }: { sessions: Pomodoro[] }) {
  const [page, setPage] = useState(1);

  const { currentSessions, totalPages } = useMemo(() => {
    const totalPages = Math.ceil(sessions.length / PAGE_SIZE);
    const currentSessions = sessions.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE
    );
    return { currentSessions, totalPages };
  }, [sessions, page]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Pomodoro Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Duration (min)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSessions.length > 0 ? (
                currentSessions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.title}</TableCell>
                    <TableCell>{Math.round(s.duration / 60)} min</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          s.completed
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                        role="status"
                        aria-label={
                          s.completed ? 'Completed session' : 'Failed session'
                        }
                      >
                        {s.completed ? 'Completed' : 'Failed'}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(s.createdAt).toISOString().split('T')[0]}{' '}
                      {new Date(s.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No sessions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
          <AppPagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
      </CardContent>
    </Card>
  );
}
