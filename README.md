# ScaleUp Academy

📚 Plateforme de formation en ligne avec aspect communautaire - Next.js 15 + Supabase + Stripe

## 🚀 Getting Started

### Prérequis
- Node.js 18+ et npm
- Compte Supabase avec projet créé
- Variables d'environnement configurées (.env.local)

### Installation

```bash
# Installation des dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Architecture

- **Framework**: Next.js 15 avec App Router
- **Base de données & Auth**: Supabase
- **Paiements**: Stripe (prévu)
- **Styling**: Tailwind CSS v4
- **Gestion d'état**: Zustand + React Query

## 📁 Structure du Projet

```
src/
├── app/           # Routes Next.js
├── components/    # Composants React
├── lib/          # Utilitaires et configuration
└── scripts/      # Scripts utilitaires
```

## 🔐 Authentification

Le système supporte :
- Email/Password
- OAuth (Google, GitHub)
- Rôles multiples (Admin, Professeur, Étudiant)

## 🧪 Comptes de Test

Voir `demo-credentials.md` pour les instructions de création de comptes de démonstration.

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🚀 Déploiement

Le projet est prêt pour un déploiement sur [Vercel](https://vercel.com) ou toute autre plateforme compatible Next.js.

## 📝 License

MIT
