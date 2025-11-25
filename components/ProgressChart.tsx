'use client'

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Stage, Lesson, UserProgress } from '../types';
import { STAGE_LABELS } from '../constants/lessons';

interface ProgressChartProps {
  lessons: Lesson[];
  progress: Record<string, UserProgress> | null;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ lessons, progress }) => {
  // Calculate stats
  const stats = lessons.reduce((acc, lesson) => {
    const p = progress?.[lesson.id];
    if (!acc[lesson.stage]) acc[lesson.stage] = { total: 0, completed: 0, reviews: 0 };

    acc[lesson.stage].total += 1;
    if (p && p.isCompleted) {
      acc[lesson.stage].completed += 1;
      acc[lesson.stage].reviews += p.reviewCount;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number; reviews: number }>);

  const data = Object.entries(STAGE_LABELS).map(([key, label]) => ({
    name: label,
    completed: stats[key as Stage]?.completed || 0,
    total: stats[key as Stage]?.total || 0,
    reviews: stats[key as Stage]?.reviews || 0,
  }));

  return (
    <div className="h-72 w-full bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Learning Activity</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: -15, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="completed" name="Lessons Completed" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
          <Bar dataKey="reviews" name="Total Reviews" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};