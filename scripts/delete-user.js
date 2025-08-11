#!/usr/bin/env node

/**
 * Script pour supprimer un utilisateur de Supabase
 * Usage: node scripts/delete-user.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Email de l'utilisateur à supprimer
const EMAIL_TO_DELETE = 'romain.cano33@gmail.com';

async function deleteUser() {
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
    console.log(`🔍 Recherche de l'utilisateur avec l'email: ${EMAIL_TO_DELETE}`);
    
    // Récupérer l'utilisateur par email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw listError;
    }

    const userToDelete = users.find(user => user.email === EMAIL_TO_DELETE);
    
    if (!userToDelete) {
      console.log(`⚠️  Aucun utilisateur trouvé avec l'email: ${EMAIL_TO_DELETE}`);
      return;
    }

    console.log(`✅ Utilisateur trouvé: ${userToDelete.id}`);
    console.log(`📧 Email: ${userToDelete.email}`);
    console.log(`📅 Créé le: ${userToDelete.created_at}`);

    // Supprimer d'abord le profil (à cause des contraintes de clé étrangère)
    console.log('🗑️  Suppression du profil...');
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userToDelete.id);

    if (profileError && profileError.code !== 'PGRST116') { // Ignorer si le profil n'existe pas
      console.error('⚠️  Erreur lors de la suppression du profil:', profileError.message);
    } else {
      console.log('✅ Profil supprimé');
    }

    // Supprimer l'utilisateur de l'authentification
    console.log('🗑️  Suppression de l\'utilisateur...');
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userToDelete.id);

    if (deleteError) {
      throw deleteError;
    }

    console.log('✅ Utilisateur supprimé avec succès!');
    console.log(`🎉 L'utilisateur ${EMAIL_TO_DELETE} a été complètement supprimé de la base de données.`);

  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
deleteUser();