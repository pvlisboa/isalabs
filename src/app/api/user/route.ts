import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { getUserProfileByEmail, createOrUpdateAppUser } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Busca o usuário no banco
    const { data: user, error } = await getUserProfileByEmail(session.user.email);

    if (error) {
      console.error('Erro ao buscar usuário:', error);
      return NextResponse.json({ error: 'Erro ao buscar usuário' }, { status: 500 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Erro na API:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    // Cria ou atualiza o usuário
    const { data: user, error } = await createOrUpdateAppUser(
      session.user.email,
      name || session.user.name || session.user.email
    );

    if (error) {
      console.error('Erro ao criar/atualizar usuário:', error);
      return NextResponse.json({ error: 'Erro ao salvar usuário' }, { status: 500 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Erro na API:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}