
import { supabase } from "@/integrations/supabase/client";

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Error signing out:', error.message);
  return { error };
}
