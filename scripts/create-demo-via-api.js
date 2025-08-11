const fetch = require('node-fetch');

// Configuration
const SUPABASE_URL = 'https://ekaxtxiattlkvtgagfjo.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrYXh0eGlhdHRsa3Z0Z2FnZmpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDgzNDA3MywiZXhwIjoyMDcwNDEwMDczfQ.BIPfK7YAzpi-wziicbKp-X9CjUiJGuS-_Y_e-mrqerg';

async function createDemoUser() {
  console.log('🚀 Création du compte de démonstration via API REST...\n');

  try {
    // Créer l'utilisateur
    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`
      },
      body: JSON.stringify({
        email: 'demo@scaleupacademy.com',
        password: 'DemoPass123!',
        email_confirm: true,
        user_metadata: {
          full_name: 'Utilisateur Démo'
        },
        app_metadata: {
          provider: 'email'
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.msg?.includes('already been registered')) {
        console.log('⚠️  L\'utilisateur existe déjà');
        console.log('\n📧 Connexion avec les identifiants :');
        console.log('   Email    : demo@scaleupacademy.com');
        console.log('   Password : DemoPass123!');
      } else {
        console.error('❌ Erreur:', data.msg || data.error || 'Erreur inconnue');
        console.log('Response:', JSON.stringify(data, null, 2));
      }
    } else {
      console.log('✅ Utilisateur créé avec succès !');
      console.log('   ID:', data.id);
      
      // Créer le profil
      if (data.id) {
        const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            id: data.id,
            full_name: 'Utilisateur Démo',
            role: 'user'
          })
        });

        if (profileResponse.ok) {
          console.log('✅ Profil créé/mis à jour');
        }
      }

      console.log('\n═══════════════════════════════════════════');
      console.log('📧 COMPTE DE DÉMONSTRATION CRÉÉ');
      console.log('═══════════════════════════════════════════\n');
      console.log('Email    : demo@scaleupacademy.com');
      console.log('Password : DemoPass123!');
      console.log('\n🔗 Connexion :');
      console.log('   http://localhost:3000/auth/login');
      console.log('\n✨ Dashboard :');
      console.log('   http://localhost:3000/dashboard');
      console.log('\n═══════════════════════════════════════════');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

createDemoUser();