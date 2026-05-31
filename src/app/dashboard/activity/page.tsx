'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Plus, Pencil, Trash2, Activity } from 'lucide-react'

const ACTION_CONFIG: Record<string, { label: string, icon: React.ReactNode, color: string }> = {
  CREATE: { label: 'Creó', icon: <Plus className="w-3.5 h-3.5" />, color: 'bg-emerald-500/10 text-emerald-400' },
  EDIT:   { label: 'Editó', icon: <Pencil className="w-3.5 h-3.5" />, color: 'bg-blue-500/10 text-blue-400' },
  DELETE: { label: 'Eliminó', icon: <Trash2 className="w-3.5 h-3.5" />, color: 'bg-red-500/10 text-red-400' },
}

export default function ActivityPage() {
  const { data: session, status } = useSession()
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  if (status === 'unauthenticated') redirect('/login')
  if (session?.user.role === 'PENDING') redirect('/pending')

  useEffect(() => {
    fetch('/api/activity')
      .then(r => r.json())
      .then(data => { setLogs(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-400" />
            Actividad
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Últimas 100 acciones del equipo</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">No hay actividad registrada todavía</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log: any) => {
              const config = ACTION_CONFIG[log.action] || { label: log.action, icon: null, color: 'bg-slate-800 text-slate-400' }
              return (
                <div key={log.id} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {log.user?.image ? (
                      <img src={log.user.image} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 text-xs font-bold">
                        {log.user?.name?.[0] ?? '?'}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white text-sm font-medium">{log.user?.name}</span>
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${config.color}`}>
                        {config.icon}
                        {config.label}
                      </span>
                      {log.taskTitle && (
                        <span className="text-slate-300 text-sm truncate">"{log.taskTitle}"</span>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {format(new Date(log.createdAt), "d 'de' MMM yyyy 'a las' HH:mm", { locale: es })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}