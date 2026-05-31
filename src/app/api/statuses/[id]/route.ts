import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role === 'PENDING') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const { name, order } = await req.json()
  const status = await prisma.status.update({
    where: { id: params.id },
    data: {
      ...(name !== undefined && { name }),
      ...(order !== undefined && { order }),
    },
  })
  return NextResponse.json(status)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role === 'PENDING') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  await prisma.status.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}