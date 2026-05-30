import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role === 'PENDING') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const categoryId = searchParams.get('categoryId')
  const priority = searchParams.get('priority')

  const tasks = await prisma.task.findMany({
    where: {
      ...(status && { status: status as any }),
      ...(categoryId && { categoryId }),
      ...(priority && { priority: priority as any }),
    },
    include: {
      category: true,
      person: true,
      assignedTo: { select: { id: true, name: true, email: true, image: true } },
      createdBy: { select: { id: true, name: true, email: true, image: true } },
      tags: { include: { tag: true } },
    },
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
  })

  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role === 'PENDING') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const { title, status, priority, plannerUrl, notes, categoryId, personId, assignedToId, dueDate, lastContactDate, tags } = body

  const task = await prisma.task.create({
    data: {
      title,
      status: status || 'PENDING',
      priority: priority || 'MEDIUM',
      plannerUrl: plannerUrl || null,
      notes: notes || null,
      categoryId: categoryId || null,
      personId: personId || null,
      assignedToId: assignedToId || null,
      createdById: session.user.id,
      dueDate: dueDate ? new Date(dueDate) : null,
      lastContactDate: lastContactDate ? new Date(lastContactDate) : null,
      tags: tags?.length ? {
        create: tags.map((tagId: string) => ({
          tag: { connect: { id: tagId } },
        })),
      } : undefined,
    },
    include: {
      category: true,
      person: true,
      assignedTo: { select: { id: true, name: true, email: true, image: true } },
      tags: { include: { tag: true } },
    },
  })

  return NextResponse.json(task, { status: 201 })
}