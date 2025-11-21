import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret',
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account?.providerAccountId) {
        token.sub = account.providerAccountId;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only',
  debug: false, // Desabilitar debug para evitar logs excessivos
};

// Função para verificar se o usuário está no período de trial
export function isTrialActive(trialEndDate: string): boolean {
  const now = new Date();
  const trialEnd = new Date(trialEndDate);
  return now < trialEnd;
}

// Função para calcular dias restantes do trial
export function getTrialDaysRemaining(trialEndDate: string): number {
  const now = new Date();
  const trialEnd = new Date(trialEndDate);
  const diffTime = trialEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

// Função para verificar se usuário pode acessar atividade
export function canAccessActivity(
  userPlan: 'free' | 'premium',
  isTrialActive: boolean,
  completedActivities: number,
  lastActivityDate?: string | null
): boolean {
  // Premium sempre pode acessar
  if (userPlan === 'premium') return true;
  
  // Durante trial pode acessar
  if (isTrialActive) return true;
  
  // Usuário gratuito: máximo 1 atividade
  const freeLimit = 1;
  if (completedActivities < freeLimit) return true;
  
  // Após limite: 1 atividade a cada 15 dias
  if (lastActivityDate) {
    const lastActivity = new Date(lastActivityDate);
    const now = new Date();
    const daysSinceLastActivity = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceLastActivity >= 15;
  }
  
  return false;
}

// Função para verificar se pode acessar relatórios
export function canAccessReports(userPlan: 'free' | 'premium', isTrialActive: boolean): boolean {
  return userPlan === 'premium' || isTrialActive;
}