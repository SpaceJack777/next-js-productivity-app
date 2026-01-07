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
    <Card className="w-full flex flex-col h-full">
      <CardHeader>
        <CardTitle>Recent Pomodoro Sessions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 justify-between min-h-0">
        <div className="flex-1 min-h-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Duration (min)</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSessions.length > 0 ? (
                currentSessions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.title}</TableCell>
                    <TableCell>{Math.round(s.duration / 60)} min</TableCell>
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
                    colSpan={3}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No sessions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 shrink-0 ">
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
