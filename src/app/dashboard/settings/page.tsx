'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Plus, Trash2, Tag, FolderOpen, User } from 'lucide-react'

function Section({ title, icon, items, onAdd, onDelete, fields }: {
  title: string
  icon: React.ReactNode
  items: any[]
  onAdd: (data: any) => Promise<void>
  onDelete: (id: string) => Promise<void>
  fields: { key: string, label: string, placeholder: string }[]
}) {
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-white font-semibold flex items-center gap-2 mb-5">
        {icon}
        {title}
        <span className="ml-auto bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </h2>

      {/* Form */}
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

      {/* List */}
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
              <button
                onClick={() => onDelete(item.id)}
                className="text-slate-600 hover:text-red-400 transition-colors ml-3"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const [categories, setCategories] = useState<any[]>([])
  const [persons, setPersons] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])

  if (status === 'unauthenticated') redirect('/login')
  if (session?.user.role === 'PENDING') redirect('/pending')

  const fetchAll = async () => {
    const [cats, pers, tgs] = await Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/persons').then(r => r.json()),
      fetch('/api/tags').then(r => r.json()),
    ])
    setCategories(Array.isArray(cats) ? cats : [])
    setPersons(Array.isArray(pers) ? pers : [])
    setTags(Array.isArray(tgs) ? tgs : [])
  }

  useEffect(() => { fetchAll() }, [])

  const addCategory = async (data: any) => {
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    fetchAll()
  }

  const addPerson = async (data: any) => {
    await fetch('/api/persons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    fetchAll()
  }

  const addTag = async (data: any) => {
    await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    fetchAll()
  }

  const deleteItem = async (endpoint: string, id: string) => {
    await fetch(`/api/${endpoint}/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Configuración</h1>
          <p className="text-slate-400 text-sm mt-0.5">Administrá categorías, contactos y tags</p>
        </div>

        <div className="space-y-6">
          <Section
            title="Categorías"
            icon={<FolderOpen className="w-4 h-4 text-blue-400" />}
            items={categories}
            onAdd={addCategory}
            onDelete={(id) => deleteItem('categories', id)}
            fields={[{ key: 'name', label: 'Nombre', placeholder: 'Ej: Pixels pendientes' }]}
          />

          <Section
            title="Contactos"
            icon={<User className="w-4 h-4 text-emerald-400" />}
            items={persons}
            onAdd={addPerson}
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
            onAdd={addTag}
            onDelete={(id) => deleteItem('tags', id)}
            fields={[{ key: 'name', label: 'Nombre', placeholder: 'Ej: wordpress' }]}
          />
        </div>
      </div>
    </div>
  )
}