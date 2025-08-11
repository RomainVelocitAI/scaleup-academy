# 🔐 Comptes de Démonstration - ScaleUp Academy

## Option 1 : Connexion Rapide avec OAuth (Recommandé)

### ✨ Méthode la plus simple :
1. Allez sur **http://localhost:3000/auth/login**
2. Cliquez sur le bouton **Google** ou **GitHub**
3. Connectez-vous avec votre compte personnel
4. Accès immédiat au dashboard !

> ✅ **Avantage** : Pas besoin de créer de compte, connexion instantanée

---

## Option 2 : Compte de Test Local

### 📧 Identifiants suggérés :
```
Email : demo@scaleupacademy.com
Mot de passe : DemoPass123!
```

### 🚀 Comment créer ce compte de test :

1. **Méthode Interface Web** (Plus simple) :
   - Allez sur http://localhost:3000/auth/register
   - Entrez les informations :
     - Nom complet : "Utilisateur Démo"
     - Email : demo@scaleupacademy.com
     - Mot de passe : DemoPass123!
   - Cliquez sur "S'inscrire"

2. **Méthode Supabase Dashboard** :
   - Connectez-vous à votre dashboard Supabase
   - Allez dans Authentication > Users
   - Cliquez sur "Invite user"
   - Entrez l'email : demo@scaleupacademy.com
   - L'utilisateur recevra un lien pour définir son mot de passe

---

## Option 3 : Créer Plusieurs Comptes de Test

Pour tester différents rôles, vous pouvez créer :

### 👨‍🎓 Compte Étudiant
```
Email : etudiant@test.com
Mot de passe : Test123!
```

### 👨‍🏫 Compte Formateur
```
Email : formateur@test.com
Mot de passe : Test123!
```

### 👨‍💼 Compte Admin
```
Email : admin@test.com
Mot de passe : Test123!
```

> **Note** : Après création, vous pouvez modifier le rôle dans la base de données Supabase (table `profiles`)

---

## 🧪 Accès Rapide au Dashboard

Une fois connecté avec l'une des méthodes ci-dessus :
- **Dashboard** : http://localhost:3000/dashboard
- **Déconnexion** : Cliquez sur le bouton rouge "Se déconnecter"

---

## ⚡ Test Rapide Sans Compte

Si vous voulez juste voir l'interface sans créer de compte :
1. Utilisez OAuth (Google/GitHub) - connexion en 1 clic
2. Le profil sera créé automatiquement
3. Accès immédiat à toutes les fonctionnalités