const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuration Supabase avec la clé service (Admin)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrYXh0eGlhdHRsa3Z0Z2FnZmpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDgzNDA3MywiZXhwIjoyMDcwNDEwMDczfQ.BIPfK7YAzpi-wziicbKp-X9CjUiJGuS-_Y_e-mrqerg';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createDemoUser() {
  console.log('🚀 Création du compte de démonstration...\n');

  try {
    let finalUser = null;
    
    // 1. Créer l'utilisateur avec l'API Auth Admin
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'demo@scaleupacademy.com',
      password: 'DemoPass123!',
      email_confirm: true, // Confirmer automatiquement l'email
      user_metadata: {
        full_name: 'Utilisateur Démo'
      }
    });

    if (authError) {
      console.log('⚠️  Erreur lors de la création:', authError.message);
      
      // Si l'utilisateur existe déjà, essayer de le récupérer
      if (authError.message?.includes('already been registered') || 
          authError.message?.includes('Database error')) {
        
        console.log('   Recherche de l\'utilisateur existant...\n');
        
        // Récupérer la liste des utilisateurs pour trouver celui avec cet email
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        
        if (!listError && users) {
          const existingUser = users.find(u => u.email === 'demo@scaleupacademy.com');
          
          if (existingUser) {
            console.log('✅ Utilisateur trouvé !');
            console.log('   ID:', existingUser.id);
            
            // Mettre à jour le mot de passe
            const { error: updateError } = await supabase.auth.admin.updateUserById(
              existingUser.id,
              { 
                password: 'DemoPass123!',
                email_confirm: true
              }
            );
            
            if (!updateError) {
              console.log('✅ Mot de passe mis à jour avec succès');
              finalUser = existingUser;
            } else {
              console.log('⚠️  Impossible de mettre à jour le mot de passe:', updateError.message);
            }
          } else {
            console.log('❌ Utilisateur non trouvé dans la liste');
          }
        }
      }
      
      if (!finalUser) {
        throw authError;
      }
    } else {
      console.log('✅ Utilisateur créé avec succès');
      console.log('   ID:', authData.user.id);
      finalUser = authData.user;
    }

    // 2. Créer le profil dans la base de données
    const userId = finalUser?.id;
    if (userId) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: 'Utilisateur Démo',
          role: 'user',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        console.log('⚠️  Erreur lors de la création du profil:', profileError.message);
      } else {
        console.log('✅ Profil créé/mis à jour avec succès\n');
      }
    }

    console.log('═══════════════════════════════════════════');
    console.log('📧 COMPTE DE DÉMONSTRATION CRÉÉ');
    console.log('═══════════════════════════════════════════\n');
    console.log('Email    : demo@scaleupacademy.com');
    console.log('Password : DemoPass123!');
    console.log('\n🔗 Accès direct:');
    console.log('   http://localhost:3000/auth/login');
    console.log('\n✨ Dashboard:');
    console.log('   http://localhost:3000/dashboard');
    console.log('\n═══════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.log('\n💡 Alternative: Utilisez OAuth (Google/GitHub) pour vous connecter rapidement');
    console.log('   ou créez un compte via http://localhost:3000/auth/register');
  }
}

createDemoUser();