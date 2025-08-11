#!/usr/bin/env node

/**
 * Script pour lister tous les utilisateurs de Supabase
 * Usage: node scripts/list-users.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function listUsers() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Erreur: Variables d\'environnement manquantes');
    console.error('Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définis dans .env.local');
    process.exit(1);
  }

  // Créer un client Supabase avec la clé de service (admin)
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    console.log('🔍 Récupération de la liste des utilisateurs...\n');
    
    // Récupérer tous les utilisateurs
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      throw error;
    }

    if (!users || users.length === 0) {
      console.log('📭 Aucun utilisateur trouvé dans la base de données');
      return;
    }

    console.log(`📊 ${users.length} utilisateur(s) trouvé(s):\n`);
    console.log('═'.repeat(80));
    
    users.forEach((user, index) => {
      console.log(`\n👤 Utilisateur ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email || 'Non défini'}`);
      console.log(`   Créé le: ${new Date(user.created_at).toLocaleString('fr-FR')}`);
      console.log(`   Dernière connexion: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('fr-FR') : 'Jamais'}`);
      console.log(`   Email confirmé: ${user.email_confirmed_at ? '✅ Oui' : '❌ Non'}`);
      
      if (user.user_metadata && Object.keys(user.user_metadata).length > 0) {
        console.log(`   Métadonnées utilisateur:`, user.user_metadata);
      }
    });
    
    console.log('\n' + '═'.repeat(80));

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des utilisateurs:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
listUsers();