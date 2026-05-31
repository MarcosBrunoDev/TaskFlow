'use client'

import { format, isToday, isPast, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { ExternalLink, Calendar, User, Clock, CalendarClock } from 'lucide-react'
import { cn, PRIORITY_LABELS, PRIORITY_COLORS } from '@/lib/utils'

interface TaskCardProps {
  task: any
  onClick: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null
  const isDueToday = dueDate ? isToday(dueDate) : false
  const isOverdue = dueDate ? isPast(dueDate) && !isToday(dueDate) && task.status !== 'DONE' : false
  const daysUntilDue = dueDate ? differenceInDays(dueDate, new Date()) : null

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-slate-900 border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/50',
        isDueToday ? 'border-red-500/50 hover:border-red-400' : 'border-slate-800 hover:border-slate-600'
      )}
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
        {task.status && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={task.status.color
              ? { backgroundColor: task.status.color + '22', color: task.status.color }
              : { backgroundColor: '#1e293b', color: '#94a3b8' }
            }
          >
            {task.status.name}
          </span>
        )}
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
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2 pt-2 border-t border-slate-800">
        {task.person && (
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {task.person.name}
          </span>
        )}

        <span className={cn('flex items-center gap-1 font-medium', task.assignedTo ? 'text-emerald-400' : 'text-slate-600')}>
          {task.assignedTo?.image ? (
            <img src={task.assignedTo.image} alt="" className="w-3.5 h-3.5 rounded-full" />
          ) : (
            <User className="w-3 h-3" />
          )}
          {task.assignedTo ? task.assignedTo.name : 'Sin asignar'}
        </span>

        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {format(new Date(task.createdAt), "dd MMM", { locale: es })}
        </span>

        {dueDate && (
          <span className={cn(
            'flex items-center gap-1 font-medium rounded-full px-2 py-0.5',
            isDueToday
              ? 'bg-red-500/20 text-red-400 animate-pulse'
              : isOverdue
              ? 'bg-red-900/30 text-red-500'
              : daysUntilDue !== null && daysUntilDue <= 2
              ? 'text-amber-400'
              : 'text-slate-400'
          )}>
            <CalendarClock className="w-3 h-3" />
            {isDueToday ? '¡Hoy!' : isOverdue
              ? `Vencida ${format(dueDate, "dd MMM", { locale: es })}`
              : format(dueDate, "dd MMM", { locale: es })
            }
          </span>
        )}

        {task.lastContactDate && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {format(new Date(task.lastContactDate), 'dd MMM', { locale: es })}
          </span>
        )}
      </div>
    </div>
  )
}