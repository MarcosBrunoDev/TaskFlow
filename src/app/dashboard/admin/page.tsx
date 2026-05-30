'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Check, X, Shield, User, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const ROLE_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  MEMBER: 'Miembro',
  ADMIN: 'Admin',
}

const ROLE_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  MEMBER: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  ADMIN: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  if (status === 'unauthenticated') redirect('/login')
  if (session?.user.role !== 'ADMIN') redirect('/dashboard')

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => { setUsers(data); setLoading(false) })
  }, [])

  const updateRole = async (userId: string, role: string) => {
    setUpdating(userId)
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role }),
    })
    const updated = await res.json()
    setUsers(prev => prev.map(u => u.id === updated.id ? { ...u, role: updated.role } : u))
    setUpdating(null)
  }

  const pending = users.filter(u => u.role === 'PENDING')
  const active = users.filter(u => u.role !== 'PENDING')

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Gestión de usuarios</h1>
          <p className="text-slate-400 text-sm mt-0.5">Aprobá o rechazá el acceso de nuevos usuarios</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Pendientes */}
            {pending.length > 0 && (
              <div>
                <h2 className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Esperando aprobación ({pending.length})
                </h2>
                <div className="space-y-3">
                  {pending.map(user => (
                    <div key={user.id} className="bg-slate-900 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                            <User className="w-5 h-5 text-slate-500" />
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-slate-400 text-sm">{user.email}</p>
                          <p className="text-slate-600 text-xs mt-0.5">
                            Registrado {format(new Date(user.createdAt), "d 'de' MMM yyyy", { locale: es })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateRole(user.id, 'MEMBER')}
                          disabled={updating === user.id}
                          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Aprobar
                        </button>
                        <button
                          onClick={() => updateRole(user.id, 'PENDING')}
                          disabled={updating === user.id}
                          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-sm px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Rechazar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Usuarios activos */}
            <div>
              <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Usuarios activos ({active.length})
              </h2>
              <div className="space-y-3">
                {active.map(user => (
                  <div key={user.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-500" />
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${ROLE_COLORS[user.role]}`}>
                        {ROLE_LABELS[user.role]}
                      </span>
                      {user.role !== 'ADMIN' && user.id !== session?.user.id && (
                        <select
                          value={user.role}
                          onChange={e => updateRole(user.id, e.target.value)}
                          disabled={updating === user.id}
                          className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-300 text-sm focus:outline-none"
                        >
                          <option value="MEMBER">Miembro</option>
                          <option value="ADMIN">Admin</option>
                          <option value="PENDING">Suspender</option>
                        </select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}