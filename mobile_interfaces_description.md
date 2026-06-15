# Description des Interfaces Mobiles (GNS Mobile)

L'application mobile GNS est conçue pour deux types d'utilisateurs distincts : les **Étudiants** (bénéficiaires de bourses) et les **Commerçants / Boutiques** (qui reçoivent des paiements).

## 1. Pages d'Authentification
* **`/login`** : Connexion pour les étudiants et les commerçants. Fait appel à l'`AuthService` pour récupérer le token et le rôle de l'utilisateur.
* **`/register`** : Inscription d'un nouvel utilisateur (généralement un étudiant ou un nouveau commerçant).

## 2. Espace Étudiant (`/student`)
Cet espace permet aux étudiants de gérer leur bourse, leurs documents et d'effectuer des paiements via QR code.

* **`/student/documents`** : Page de soumission et de gestion des documents requis (RIB, carte d'étudiant, etc.). Fait appel au `DocumentService`.
* **`/student/waiting`** : Page d'attente (affichée lorsque le compte de l'étudiant est en cours de validation par l'administration).
* **`/student/no-active-year`** : Page affichée si aucune année universitaire n'est active pour l'étudiant.
* **`/student/eligibility`** : Vérification de l'éligibilité de l'étudiant à la bourse.
* **`/student/wallet`** : Portefeuille numérique (Tableau de bord principal). Affiche le solde actuel et les dernières opérations. Fait appel au `WalletService`.
* **`/student/qr-code`** : Scanner ou générateur de QR Code pour payer dans une boutique partenaire. Fait appel au `TransactionService`.
* **`/student/reinscription`** : Interface permettant à l'étudiant de se réinscrire pour une nouvelle année universitaire.
* **`/student/history`** : Historique complet des transactions (achats, versements reçus).
* **`/student/profile`** : Gestion du profil de l'étudiant (informations personnelles, mot de passe).

## 3. Espace Commerçant / Boutique (`/merchant`)
Cet espace permet aux gérants de boutiques d'encaisser les paiements des étudiants et de gérer leur commerce.

* **`/merchant/dashboard`** : Tableau de bord du commerçant affichant les ventes du jour, le chiffre d'affaires et les statistiques rapides.
* **`/merchant/caisse`** : Interface de caisse. Génère un QR Code dynamique pour qu'un étudiant puisse scanner et payer le montant saisi. Fait appel au `TransactionService`.
* **`/merchant/finance`** : Gestion financière de la boutique (historique détaillé des encaissements, demandes de liquidation/virement vers le compte bancaire du commerçant). Fait appel au `FinanceService` ou `LiquidationService`.
* **`/merchant/catalogue`** : Gestion du catalogue de produits de la boutique (si applicable). Fait appel au `CatalogueService`.
* **`/merchant/profile`** : Gestion du profil du commerçant et des paramètres de la boutique.
