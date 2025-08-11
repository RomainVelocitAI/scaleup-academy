import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Charger les variables d'environnement
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Note: Pour créer un compte de démo, nous avons besoin de la clé de service
// qui n'est pas encore configurée dans .env.local

const DEMO_USER = {
  email: 'demo@scaleupacademy.com',
  password: 'DemoPass123!',
  fullName: 'Utilisateur Démo'
}

async function createDemoAccount() {
  console.log('⚠️  IMPORTANT: Pour créer un compte de démo, vous devez:')
  console.log('1. Aller dans votre dashboard Supabase')
  console.log('2. Settings > API > Service role key (secret)')
  console.log('3. Ajouter SUPABASE_SERVICE_ROLE_KEY=<votre-clé> dans .env.local')
  console.log('')
  console.log('Ou vous pouvez créer manuellement un compte de test via l\'interface:')
  console.log('----------------------------------------')
  console.log('📧 Email: demo@scaleupacademy.com')
  console.log('🔑 Mot de passe: DemoPass123!')
  console.log('----------------------------------------')
  console.log('')
  console.log('Pour créer le compte manuellement:')
  console.log('1. Allez sur http://localhost:3000/auth/register')
  console.log('2. Utilisez les identifiants ci-dessus')
  console.log('3. Ou utilisez OAuth avec Google/GitHub pour un accès rapide')
}

createDemoAccount()