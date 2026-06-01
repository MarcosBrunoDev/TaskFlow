'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Plus, Trash2, Tag, FolderOpen, User, Activity, ChevronDown, ChevronUp } from 'lucide-react'

function Section({ title, icon, items, onAdd, onDelete, fields, defaultOpen = false }: {
  title: string
  icon: React.ReactNode
  items: any[]
  onAdd: (data: any) => Promise<void>
  onDelete: (id: string) => Promise<void>
  fields: { key: string, label: string, placeholder: string }[]
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const [form, setForm] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!form[fields[0].key]?.trim()) return
    setLoading(true)
    await onAdd(form)
    setForm({})
    setLoading(false)
  }

  return (
    <div className="border border-slate-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 bg-slate-900 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-white font-semibold">{title}</span>
          <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="p-6 bg-slate-950 border-t border-slate-800">
          <div className="flex gap-2 mb-4">
            {fields.map(f => (
              <input
                key={f.key}
                type="text"
                placeholder={f.placeholder}
                value={form[f.key] || ''}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm transition-colors"
              />
            ))}
            <button
              onClick={handleAdd}
              disabled={loading}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>
          <div className="space-y-2">
            {items.length === 0 ? (
              <p className="text-slate-600 text-sm text-center py-4">No hay {title.toLowerCase()} todavía</p>
            ) : (
              items.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between bg-slate-800 rounded-xl px-4 py-2.5">
                  <div>
                    <span className="text-white text-sm">{item.name}</span>
                    {item.role && <span className="text-slate-500 text-xs ml-2">· {item.role}</span>}
                    {item.email && <span className="text-slate-500 text-xs ml-2">· {item.email}</span>}
                  </div>
                  <button onClick={() => onDelete(item.id)} className="text-slate-600 hover:text-red-400 transition-colors ml-3">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function StatusSection({ statuses, onAdd, onDelete, onReorder }: {
  statuses: any[]
  onAdd: (data: any) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onReorder: (id: string, direction: 'up' | 'down') => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '' })
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!form.name.trim()) return
    setLoading(true)
    await onAdd(form)
    setForm({ name: '' })
    setLoading(false)
  }

  return (
    <div className="border border-slate-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 bg-slate-900 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" />
          <span className="text-white font-semibold">Estados</span>
          <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">
            {statuses.length}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="p-6 bg-slate-950 border-t border-slate-800">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Ej: En progreso"
              value={form.name}
              onChange={e => setForm({ name: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm transition-colors"
            />
            <button
              onClick={handleAdd}
              disabled={loading}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>
          <div className="space-y-2">
            {statuses.length === 0 ? (
              <p className="text-slate-600 text-sm text-center py-4">No hay estados todavía</p>
            ) : (
              statuses.map((status: any, index: number) => (
                <div key={status.id} className="flex items-center justify-between bg-slate-800 rounded-xl px-4 py-2.5">
                  <span className="text-white text-sm">{status.name}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => onReorder(status.id, 'up')} disabled={index === 0} className="text-slate-500 hover:text-white disabled:opacity-20 transition-colors p-1">
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => onReorder(status.id, 'down')} disabled={index === statuses.length - 1} className="text-slate-500 hover:text-white disabled:opacity-20 transition-colors p-1">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(status.id)} className="text-slate-600 hover:text-red-400 transition-colors ml-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const [categories, setCategories] = useState<any[]>([])
  const [persons, setPersons] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [statuses, setStatuses] = useState<any[]>([])

  if (status === 'unauthenticated') redirect('/login')
  if (session?.user.role === 'PENDING') redirect('/pending')

  const fetchAll = async () => {
    const [cats, pers, tgs, sts] = await Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/persons').then(r => r.json()),
      fetch('/api/tags').then(r => r.json()),
      fetch('/api/statuses').then(r => r.json()),
    ])
    setCategories(Array.isArray(cats) ? cats : [])
    setPersons(Array.isArray(pers) ? pers : [])
    setTags(Array.isArray(tgs) ? tgs : [])
    setStatuses(Array.isArray(sts) ? sts : [])
  }

  useEffect(() => { fetchAll() }, [])

  const deleteItem = async (endpoint: string, id: string) => {
    await fetch(`/api/${endpoint}/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  const reorderStatus = async (id: string, direction: 'up' | 'down') => {
    const index = statuses.findIndex(s => s.id === id)
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= statuses.length) return
    const current = statuses[index]
    const swap = statuses[swapIndex]
    await Promise.all([
      fetch(`/api/statuses/${current.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: swap.order }) }),
      fetch(`/api/statuses/${swap.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: current.order }) }),
    ])
    fetchAll()
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Configuración</h1>
          <p className="text-slate-400 text-sm mt-0.5">Administrá categorías, contactos, tags y estados</p>
        </div>
        <div className="space-y-3">
          <Section
            title="Categorías"
            icon={<FolderOpen className="w-4 h-4 text-blue-400" />}
            items={categories}
            onAdd={async (data) => { await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); fetchAll() }}
            onDelete={(id) => deleteItem('categories', id)}
            fields={[{ key: 'name', label: 'Nombre', placeholder: 'Ej: Pixels pendientes' }]}
          />
          <Section
            title="Contactos"
            icon={<User className="w-4 h-4 text-emerald-400" />}
            items={persons}
            onAdd={async (data) => { await fetch('/api/persons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); fetchAll() }}
            onDelete={(id) => deleteItem('persons', id)}
            fields={[
              { key: 'name', label: 'Nombre', placeholder: 'Nombre' },
              { key: 'role', label: 'Rol', placeholder: 'Rol (opcional)' },
            ]}
          />
          <Section
            title="Tags"
            icon={<Tag className="w-4 h-4 text-amber-400" />}
            items={tags}
            onAdd={async (data) => { await fetch('/api/tags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); fetchAll() }}
            onDelete={(id) => deleteItem('tags', id)}
            fields={[{ key: 'name', label: 'Nombre', placeholder: 'Ej: wordpress' }]}
          />
          <StatusSection
            statuses={statuses}
            onAdd={async (data) => { await fetch('/api/statuses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, order: statuses.length }) }); fetchAll() }}
            onDelete={(id) => deleteItem('statuses', id)}
            onReorder={reorderStatus}
          />
        </div>
      </div>
    </div>
  )
}