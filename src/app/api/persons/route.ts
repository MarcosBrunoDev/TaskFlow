import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role === 'PENDING') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const persons = await prisma.person.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(persons)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role === 'PENDING') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const { name, role, email } = await req.json()
  const person = await prisma.person.create({ data: { name, role, email } })
  return NextResponse.json(person, { status: 201 })
}