import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })

// Using the correct Supabase project URL
const supabaseUrl = 'https://uptdhzqzmfyrcmhfeuuy.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdGRoenF6bWZ5cmNtaGZldXV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjM4MTc0NSwiZXhwIjoyMDcxOTU3NzQ1fQ.JVEaeTaYN3u-lZRnvamK6_wb0c1x4E1dPG1XdMgVsKc'

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  console.log('Please make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file')
  process.exit(1)
}

console.log('🔗 Connecting to Supabase...')
console.log('   URL:', supabaseUrl)
console.log('   Key length:', supabaseServiceKey.length)

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'apikey': supabaseServiceKey
    }
  }
})

async function updateUserToAdmin(email: string) {
  console.log(`\n🔄 Updating user role for: ${email}`)
  
  try {
    // First, check if user exists in profiles
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking profile:', checkError)
      return
    }

    if (!existingProfile) {
      console.log('⚠️  User profile not found. Creating profile...')
      
      // Get user from auth
      const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
      
      if (authError) {
        console.error('❌ Error fetching auth users:', authError)
        return
      }

      const authUser = users.find(u => u.email === email)
      
      if (!authUser) {
        console.error('❌ User not found in auth.users')
        return
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
        console.error('❌ Error creating profile:', createError)
        return
      }

      console.log('✅ Profile created with admin role:', newProfile)
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
        console.error('❌ Error updating profile:', updateError)
        return
      }

      console.log('✅ Profile updated to admin role:', updatedProfile)
    }

    // Also update user metadata in auth
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
    
    if (!authError) {
      const authUser = users.find(u => u.email === email)
      if (authUser) {
        const { error: metadataError } = await supabase.auth.admin.updateUserById(
          authUser.id,
          {
            user_metadata: {
              ...authUser.user_metadata,
              role: 'admin'
            }
          }
        )

        if (metadataError) {
          console.error('⚠️  Warning: Could not update auth metadata:', metadataError)
        } else {
          console.log('✅ Auth metadata updated')
        }
      }
    }

    console.log('\n🎉 Successfully granted admin rights to:', email)
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the update
updateUserToAdmin('romain.cano33@gmail.com')
  .then(() => {
    console.log('\n✨ Script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })