import { supabase } from './supabase';

export async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function fetchAll<T>(
  table: string,
  orderBy: { column: string; ascending?: boolean } = {
    column: 'created_at',
    ascending: false,
  }
): Promise<T[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('user_id', userId)
    .order(orderBy.column, { ascending: orderBy.ascending ?? false });

  if (error) {
    console.error(`[sync] fetch ${table} error:`, error);
    return [];
  }
  return (data ?? []) as T[];
}

export async function insertRow<T>(
  table: string,
  row: Record<string, unknown>
): Promise<T | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const { data, error } = await supabase
    .from(table)
    .insert({ ...row, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error(`[sync] insert ${table} error:`, error);
    return null;
  }
  return data as T;
}

export async function updateRow<T>(
  table: string,
  id: string,
  patch: Record<string, unknown>
): Promise<T | null> {
  const { data, error } = await supabase
    .from(table)
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`[sync] update ${table} error:`, error);
    return null;
  }
  return data as T;
}

export async function deleteRow(table: string, id: string): Promise<boolean> {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) {
    console.error(`[sync] delete ${table} error:`, error);
    return false;
  }
  return true;
}