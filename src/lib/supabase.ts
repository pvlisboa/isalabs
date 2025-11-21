import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para o banco de dados
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
  plan: 'free' | 'premium';
  trial_end_date?: string;
  subscription_date?: string;
}

export interface ChildProfile {
  id: string;
  user_id: string;
  name: string;
  birth_date: string;
  interests: string[];
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  age_group: string;
  line_id: string;
  time_minutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  is_indoor: boolean;
  materials: string[];
  instructions: string[];
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  child_id: string;
  activity_id: string;
  completed_at: string;
  rating?: number;
  notes?: string;
}

export interface Badge {
  id: string;
  user_id: string;
  child_id: string;
  badge_type: string;
  badge_name: string;
  earned_at: string;
}

export interface Feedback {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  trial_day: number;
  created_at: string;
}

// Funções de autenticação
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

// Funções de usuário
export async function createOrUpdateUser(authUser: any) {
  const { data, error } = await supabase
    .from('users')
    .upsert({
      id: authUser.id,
      email: authUser.email,
      name: authUser.user_metadata?.full_name || authUser.email,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  return { data, error };
}

// Função específica para buscar por email
export async function getUserProfileByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  return { data, error };
}

// Função para criar ou atualizar usuário do app
export async function createOrUpdateAppUser(email: string, name: string) {
  const { data, error } = await supabase
    .from('users')
    .upsert({
      email,
      name,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'email'
    })
    .select()
    .single();

  return { data, error };
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
}

export async function updateUserPlan(userId: string, plan: 'free' | 'premium', subscriptionDate?: string) {
  const updates: any = {
    plan,
    updated_at: new Date().toISOString()
  };

  if (subscriptionDate) {
    updates.subscription_date = subscriptionDate;
  }

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
}

// Funções de perfil da criança
export async function createChildProfile(userId: string, profile: Omit<ChildProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('child_profiles')
    .insert({
      user_id: userId,
      ...profile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  return { data, error };
}

export async function getChildProfiles(userId: string) {
  const { data, error } = await supabase
    .from('child_profiles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function updateChildProfile(childId: string, updates: Partial<ChildProfile>) {
  const { data, error } = await supabase
    .from('child_profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', childId)
    .select()
    .single();

  return { data, error };
}

// Funções de atividades
export async function getActivities(ageGroup?: string, lineId?: string) {
  let query = supabase.from('activities').select('*');

  if (ageGroup) {
    query = query.eq('age_group', ageGroup);
  }

  if (lineId) {
    query = query.eq('line_id', lineId);
  }

  const { data, error } = await query.order('created_at', { ascending: true });
  return { data, error };
}

export async function getActivity(activityId: string) {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', activityId)
    .single();

  return { data, error };
}

// Funções de progresso
export async function getUserProgress(userId: string, childId?: string) {
  let query = supabase
    .from('user_progress')
    .select(`
      *,
      activities (
        id,
        title,
        age_group,
        line_id,
        time_minutes
      )
    `)
    .eq('user_id', userId);

  if (childId) {
    query = query.eq('child_id', childId);
  }

  const { data, error } = await query.order('completed_at', { ascending: false });
  return { data, error };
}

export async function markActivityComplete(userId: string, childId: string, activityId: string, rating?: number, notes?: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .insert({
      user_id: userId,
      child_id: childId,
      activity_id: activityId,
      completed_at: new Date().toISOString(),
      rating,
      notes
    })
    .select()
    .single();

  return { data, error };
}

// Funções de badges
export async function getUserBadges(userId: string, childId?: string) {
  let query = supabase
    .from('badges')
    .select('*')
    .eq('user_id', userId);

  if (childId) {
    query = query.eq('child_id', childId);
  }

  const { data, error } = await query.order('earned_at', { ascending: false });
  return { data, error };
}

export async function awardBadge(userId: string, childId: string, badgeType: string, badgeName: string) {
  const { data, error } = await supabase
    .from('badges')
    .insert({
      user_id: userId,
      child_id: childId,
      badge_type: badgeType,
      badge_name: badgeName,
      earned_at: new Date().toISOString()
    })
    .select()
    .single();

  return { data, error };
}

// Funções de feedback
export async function saveFeedback(userId: string, feedback: Omit<Feedback, 'id' | 'user_id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('feedback')
    .insert({
      user_id: userId,
      ...feedback,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  return { data, error };
}

export async function getUserFeedbacks(userId: string) {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}