import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Récupérer l'utilisateur pour vérifier si le profil existe
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Vérifier si le profil existe déjà
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single()
        
        // Si le profil n'existe pas, le créer
        if (!profile) {
          await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
              role: 'client',
            })
        }
      }
      
      // Rediriger vers le dashboard après connexion réussie
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // Erreur ou pas de code, rediriger vers la page de connexion
  return NextResponse.redirect(`${origin}/auth/login?error=Une erreur est survenue lors de la connexion`)
}