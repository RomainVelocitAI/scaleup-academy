import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Using the correct Supabase project URL and service role key
const supabaseUrl = 'https://uptdhzqzmfyrcmhfeuuy.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdGRoenF6bWZ5cmNtaGZldXV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjM4MTc0NSwiZXhwIjoyMDcxOTU3NzQ1fQ.JVEaeTaYN3u-lZRnvamK6_wb0c1x4E1dPG1XdMgVsKc'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Create Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // First, check if user exists in profiles
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Error checking profile', details: checkError }, { status: 500 })
    }

    if (!existingProfile) {
      // Get user from auth
      const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
      
      if (authError) {
        return NextResponse.json({ error: 'Error fetching auth users', details: authError }, { status: 500 })
      }

      const authUser = users.find(u => u.email === email)
      
      if (!authUser) {
        return NextResponse.json({ error: 'User not found in auth.users' }, { status: 404 })
      }

      // Create profile with admin role
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: authUser.id,
          email: email,
          role: 'admin',
          full_name: authUser.user_metadata?.full_name || email.split('@')[0],
          avatar_url: authUser.user_metadata?.avatar_url || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) {
        return NextResponse.json({ error: 'Error creating profile', details: createError }, { status: 500 })
      }

      // Update user metadata
      await supabase.auth.admin.updateUserById(authUser.id, {
        user_metadata: {
          ...authUser.user_metadata,
          role: 'admin'
        }
      })

      return NextResponse.json({ 
        message: 'Profile created with admin role', 
        profile: newProfile 
      })
    } else {
      // Update existing profile
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          role: 'admin',
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .select()
        .single()

      if (updateError) {
        return NextResponse.json({ error: 'Error updating profile', details: updateError }, { status: 500 })
      }

      // Update user metadata
      const { data: { users } } = await supabase.auth.admin.listUsers()
      const authUser = users.find(u => u.email === email)
      
      if (authUser) {
        await supabase.auth.admin.updateUserById(authUser.id, {
          user_metadata: {
            ...authUser.user_metadata,
            role: 'admin'
          }
        })
      }

      return NextResponse.json({ 
        message: 'Profile updated to admin role', 
        profile: updatedProfile 
      })
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Unexpected error occurred', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}