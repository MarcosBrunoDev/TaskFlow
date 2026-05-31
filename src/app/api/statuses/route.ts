import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role === 'PENDING') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const statuses = await prisma.status.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(statuses)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role === 'PENDING') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const { name, color, order } = await req.json()
  const status = await prisma.status.create({ data: { name, color, order: order || 0 } })
  return NextResponse.json(status, { status: 201 })
}