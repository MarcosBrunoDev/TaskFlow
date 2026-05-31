import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role === 'PENDING') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  })

  return NextResponse.json(logs)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role === 'PENDING') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { action, detail, taskId, taskTitle } = await req.json()

  const log = await prisma.activityLog.create({
    data: {
      action,
      detail: detail || null,
      taskId: taskId || null,
      taskTitle: taskTitle || null,
      userId: session.user.id,
    },
  })

  return NextResponse.json(log, { status: 201 })
}