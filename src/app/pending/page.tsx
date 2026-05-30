'use client'

import { signOut } from 'next-auth/react'

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/20 rounded-2xl mb-4">
          <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Acceso pendiente</h1>
        <p className="text-slate-400 mb-8">
          Tu cuenta fue registrada correctamente. Un administrador debe aprobar tu acceso antes de que puedas ingresar.
        </p>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="text-slate-400 hover:text-white text-sm transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}