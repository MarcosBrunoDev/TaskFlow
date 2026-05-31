'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { TaskCard } from '@/components/TaskCard'
import { TaskModal } from '@/components/TaskModal'
import { cn, STATUS_LABELS } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [tasks, setTasks] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [persons, setPersons] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  if (status === 'unauthenticated') redirect('/login')
  if (session?.user.role === 'PENDING') redirect('/pending')

  const fetchTasks = useCallback(async () => {
    const params = new URLSearchParams()
    if (filterStatus) params.set('status', filterStatus)
    if (filterCategory) params.set('categoryId', filterCategory)
    if (filterPriority) params.set('priority', filterPriority)
    const res = await fetch(`/api/tasks?${params}`)
    const data = await res.json()
    setTasks(data)
    setLoading(false)
  }, [filterStatus, filterCategory, filterPriority])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/persons').then(r => r.json()),
      fetch('/api/tags').then(r => r.json()),
      fetch('/api/admin/users').then(r => r.json()),
    ]).then(([cats, pers, tgs, usrs]) => {
      setCategories(Array.isArray(cats) ? cats : [])
      setPersons(Array.isArray(pers) ? pers : [])
      setTags(Array.isArray(tgs) ? tgs : [])
      setUsers(Array.isArray(usrs) ? usrs : [])
    })
  }, [])

  const logActivity = async (action: string, detail: string, taskId?: string, taskTitle?: string) => {
    await fetch('/api/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, detail, taskId, taskTitle }),
    })
  }

  const handleSave = async (data: any) => {
    if (selectedTask) {
      await fetch(`/api/tasks/${selectedTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      await logActivity('EDIT', `Editó la tarea`, selectedTask.id, selectedTask.title)
    } else {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const task = await res.json()
      await logActivity('CREATE', `Creó la tarea`, task.id, task.title)
    }
    setShowModal(false)
    setSelectedTask(null)
    fetchTasks()
  }

  const handleDelete = async () => {
    if (!selectedTask) return
    await fetch(`/api/tasks/${selectedTask.id}`, { method: 'DELETE' })
    await logActivity('DELETE', `Eliminó la tarea`, selectedTask.id, selectedTask.title)
    setShowModal(false)
    setSelectedTask(null)
    fetchTasks()
  }

  const filtered = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.notes?.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = filtered.reduce((acc: any, task: any) => {
    const key = task.category?.name || 'Sin categoría'
    if (!acc[key]) acc[key] = []
    acc[key].push(task)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Tareas</h1>
            <p className="text-slate-400 text-sm mt-0.5">{filtered.length} tareas encontradas</p>
          </div>
          <button
            onClick={() => { setSelectedTask(null); setShowModal(true) }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva tarea
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-slate-600 text-sm"
            />
          </div>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-slate-600 text-sm"
          >
            <option value="">Todos los estados</option>
            {Object.entries(STATUS_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>

          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-slate-600 text-sm"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-slate-600 text-sm"
          >
            <option value="">Todas las prioridades</option>
            <option value="HIGH">Alta</option>
            <option value="MEDIUM">Media</option>
            <option value="LOW">Baja</option>
          </select>
        </div>

        {/* Tareas agrupadas por categoría */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">No hay tareas que coincidan con los filtros</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([category, categoryTasks]: any) => (
              <div key={category}>
                <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>{category}</span>
                  <span className="bg-slate-800 text-slate-500 text-xs px-2 py-0.5 rounded-full">
                    {categoryTasks.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {categoryTasks.map((task: any) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => { setSelectedTask(task); setShowModal(true) }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <TaskModal
          task={selectedTask}
          categories={categories}
          persons={persons}
          tags={tags}
          users={users}
          onClose={() => { setShowModal(false); setSelectedTask(null) }}
          onSave={handleSave}
          onDelete={selectedTask ? handleDelete : undefined}
        />
      )}
    </div>
  )
}