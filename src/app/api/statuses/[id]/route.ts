import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role === 'PENDING') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  await prisma.status.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}