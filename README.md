# TabacDigital — Landing Page

Landing page Next.js (App Router, JavaScript) pour vendre une solution de boutique en ligne + carte de fidélité aux tabacs indépendants.

## Démarrage rapide

```bash
# Installation des dépendances
npm install

# Serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Stack

- **Next.js 14** — App Router, mode JavaScript
- **Google Fonts** — Cormorant Garamond (display) + DM Sans (corps)
- **CSS natif** — variables CSS, animations, responsive

## Structure

```
app/
  layout.js      → Layout racine + polices Google
  page.js        → Page complète (1 composant client)
  globals.css    → Tous les styles
```

## Sections

1. **Hero** — Accroche + mockup téléphone animé
2. **Logos** — Tabacs partenaires
3. **Fonctionnalités** — Grille 6 fonctionnalités
4. **Carte de fidélité** — Section mise en avant avec carte rotative
5. **Comment ça marche** — 3 étapes
6. **Vitrine multi-tabacs** — 3 exemples avec identités différentes
7. **Témoignages** — 3 avis gérants
8. **Tarifs** — 3 plans
9. **CTA final** — Formulaire de contact
10. **Footer**

## Personnalisation

- Modifiez les couleurs dans les variables CSS (`:root` dans `globals.css`)
- Remplacez les noms de tabacs dans `page.js`
- Mettez à jour l'email de contact dans la section CTA
- Adaptez les tarifs selon votre offre réelle
