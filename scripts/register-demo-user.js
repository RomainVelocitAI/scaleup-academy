const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuration Supabase avec la clé publique
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function registerDemoUser() {
  console.log('🚀 Inscription du compte de démonstration...\n');

  try {
    // Utiliser la méthode signUp standard (comme le ferait un utilisateur)
    const { data, error } = await supabase.auth.signUp({
      email: 'demo@scaleupacademy.com',
      password: 'DemoPass123!',
      options: {
        data: {
          full_name: 'Utilisateur Démo'
        }
      }
    });

    if (error) {
      if (error.message?.includes('already registered')) {
        console.log('⚠️  Cet email est déjà enregistré');
        console.log('\nEssayez de vous connecter avec :');
        console.log('Email    : demo@scaleupacademy.com');
        console.log('Password : DemoPass123!');
        console.log('\nOu utilisez un autre email pour créer un nouveau compte.');
      } else {
        throw error;
      }
    } else {
      console.log('✅ Inscription réussie !');
      
      if (data.user?.confirmation_sent_at) {
        console.log('📧 Un email de confirmation a été envoyé');
        console.log('   (Pour un compte de test, vous pouvez ignorer la vérification)');
      }

      console.log('\n═══════════════════════════════════════════');
      console.log('📧 COMPTE DE DÉMONSTRATION CRÉÉ');
      console.log('═══════════════════════════════════════════\n');
      console.log('Email    : demo@scaleupacademy.com');
      console.log('Password : DemoPass123!');
      console.log('\n🔗 Connexion :');
      console.log('   http://localhost:3000/auth/login');
      console.log('\n✨ Dashboard (après connexion) :');
      console.log('   http://localhost:3000/dashboard');
      console.log('\n⚠️  Note : Si la vérification par email est activée,');
      console.log('   vous devrez confirmer votre email avant de pouvoir');
      console.log('   vous connecter.');
      console.log('\n═══════════════════════════════════════════');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.log('\n💡 Alternative: Créez un compte manuellement via');
    console.log('   http://localhost:3000/auth/register');
  }
}

registerDemoUser();