# StudCash - Application Mobile Étudiant

**StudCash Student** est l'application mobile centrale de l'écosystème GNS, conçue pour les étudiants. Elle remplace la monnaie physique sur le campus en offrant un portefeuille numérique sécurisé et facile d'accès.

## 🚀 Fonctionnalités Principales

- **Génération de QR Code (Paiement)** : Les étudiants peuvent générer un QR Code unique pour payer instantanément dans les points de vente partenaires (commerçants StudCash).
- **Consultation des Boutiques** : Liste interactive des boutiques partenaires et de leur catalogue de produits directement depuis l'application.
- **Téléversement KYC** : Interface simplifiée pour uploader et mettre à jour les documents obligatoires (Carte Étudiante, RIB, Pièce d'Identité) directement depuis son smartphone.
- **Historique et Solde** : Suivi en temps réel du solde disponible et de l'historique complet des transactions (dépôts, paiements, retraits).
- **PWA Ready** : Peut être installée directement depuis un navigateur web (Chrome/Safari) sans nécessiter d'App Store.

## 🛠️ Stack Technique

- **Framework Front-End** : Angular 18
- **Framework Mobile** : Ionic Framework & Capacitor
- **Styling** : TailwindCSS, SCSS
- **Génération de QR Code** : `angularx-qrcode`
- **Déploiement PWA** : Configuré avec `@angular/service-worker` et `vercel.json`

## ⚙️ Installation & Démarrage

1. **Cloner le projet**
   ```bash
   git clone https://github.com/J-Cicero/gns_mobile.git
   cd gns_mobile
   ```

2. **Installer les dépendances**
   *(Note: Utilisez `--legacy-peer-deps` si vous rencontrez des erreurs de conflits avec Angular PWA)*
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Lancer le serveur de développement web**
   ```bash
   ng serve
   ```

4. **Développement Mobile (Capacitor)**
   ```bash
   npm run build
   npx cap sync android
   npx cap open android
   ```

## 📦 Déploiement (Vercel / PWA)

L'application est prête à être déployée sur Vercel. Le fichier `vercel.json` est configuré pour gérer le mode production Angular ainsi que les contraintes de sécurité et de routage requises pour une PWA.
