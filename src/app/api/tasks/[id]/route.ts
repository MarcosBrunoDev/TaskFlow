import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role === 'PENDING') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const { title, status, priority, plannerUrl, notes, categoryId, personId, assignedToId, dueDate, lastContactDate, tags } = body

  const completedAt = status === 'DONE' ? new Date() : status ? null : undefined

  const task = await prisma.task.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined && { title }),
      ...(status !== undefined && { status }),
      ...(priority !== undefined && { priority }),
      ...(plannerUrl !== undefined && { plannerUrl }),
      ...(notes !== undefined && { notes }),
      ...(categoryId !== undefined && { categoryId }),
      ...(personId !== undefined && { personId }),
      ...(assignedToId !== undefined && { assignedToId }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      ...(lastContactDate !== undefined && { lastContactDate: lastContactDate ? new Date(lastContactDate) : null }),
      ...(completedAt !== undefined && { completedAt }),
      ...(tags !== undefined && {
        tags: {
          deleteMany: {},
          create: tags.map((tagId: string) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      }),
    },
    include: {
      category: true,
      person: true,
      assignedTo: { select: { id: true, name: true, email: true, image: true } },
      tags: { include: { tag: true } },
    },
  })

  return NextResponse.json(task)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role === 'PENDING') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  await prisma.task.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}