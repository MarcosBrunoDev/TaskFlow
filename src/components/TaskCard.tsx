'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ExternalLink, Calendar, User, Clock } from 'lucide-react'
import { cn, STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from '@/lib/utils'

interface TaskCardProps {
  task: any
  onClick: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/50"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-white font-medium text-sm leading-snug flex-1">{task.title}</h3>
        {task.plannerUrl && (
            <a
            href={task.plannerUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-slate-500 hover:text-blue-400 transition-colors flex-shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', STATUS_COLORS[task.status])}>
          {STATUS_LABELS[task.status]}
        </span>
        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', PRIORITY_COLORS[task.priority])}>
          {PRIORITY_LABELS[task.priority]}
        </span>
        {task.category && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {task.category.name}
          </span>
        )}
      </div>

      {/* Tags */}
      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map(({ tag }: any) => (
            <span key={tag.id} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        {task.person && (
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {task.person.name}
          </span>
        )}
        {task.dueDate && (
          <span className="flex items-center gap-1 text-amber-500">
            <Calendar className="w-3 h-3" />
            {format(new Date(task.dueDate), 'dd MMM', { locale: es })}
          </span>
        )}
        {task.lastContactDate && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {format(new Date(task.lastContactDate), 'dd MMM', { locale: es })}
          </span>
        )}
      </div>
    </div>
  )
}