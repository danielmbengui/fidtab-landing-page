export { LOCALES } from '@/i18n/locales'
import { VAAKAI_STORE_PARTNER } from '@/config/partnerData'
import { getAdminTranslations } from '@/i18n/admin/translations'

const sharedCards = [
  {
    theme: 'card-theme-1',
    logoClass: 'blc-logo-1',
    logo: '🛒',
    store: 'Vaakai Store',
    subKey: 'epicerie',
    points: '680',
    reward: '-5 CHF',
    rewardAt: '800',
    barWidth: '85%',
    accentColor: '#B8892A',
    cardNumber: '4821 9036',
    memberName: 'Marie L.',
  },
  {
    theme: 'card-theme-2',
    logoClass: 'blc-logo-2',
    logo: '🚬',
    store: 'Tabac Rhein',
    subKey: 'presse',
    points: '320',
    reward: '-3 CHF',
    rewardAt: '500',
    barWidth: '64%',
    accentColor: '#2B7CB8',
    cardNumber: '7194 2250',
    memberName: 'Jean P.',
  },
  {
    theme: 'card-theme-3',
    logoClass: 'blc-logo-3',
    logo: '🏪',
    store: 'Swiss Tabac',
    subKey: 'librairie',
    points: '1 240',
    reward: '-10 CHF',
    rewardAt: '2000',
    barWidth: '62%',
    accentColor: '#7B3FB8',
    cardNumber: '3056 8841',
    memberName: 'Sophie R.',
  },
]

const sharedPhoneItems = [
  { icon: '🗞', name: 'Le Temps', price: '3.50 CHF' },
  { icon: '🍫', name: 'Ovomaltine', price: '4.90 CHF' },
  { icon: '🎟', name: 'Swisslos', price: '5.00 CHF' },
]

const sharedPartnerLogos = [
  'Vaakai Store',
  'Tabac Rhein',
  'Swiss Tabac',
  'Tabac Cornavin',
  'Tabac Servette',
  'Tabac Eaux-Vives',
  'Tabac Champel',
  'Tabac Genève Rive',
  'Tabac Plainpalais',
  'Tabac du Centre',
  'Tabac de la Gare',
  'La Civette',
  'Le Terminus',
  'La Pipe Dorée',
  'Tabac Montchoisi',
  'Le Petit Tabac',
  'Tabac des Alpes',
  'La Cloche',
  'Le Tabac du Lac',
]

const sharedStores = [
  {
    cls: 'sc-vaakai',
    logo: 'Vaakai',
    logoUrl: VAAKAI_STORE_PARTNER.logoUrl,
    name: VAAKAI_STORE_PARTNER.name,
    tag: VAAKAI_STORE_PARTNER.tag,
    addr: VAAKAI_STORE_PARTNER.address,
    url: VAAKAI_STORE_PARTNER.websiteUrl,
    online: true,
  },
  {
    cls: 'sc-amber',
    logo: 'Rhein',
    name: 'Tabac Rhein',
    tag: 'Cigares · Genève centre',
    addr: 'Rue du Mont-Blanc 3, 1201 Genève',
    clients: '520',
    orders: '1.1k',
  },
  {
    cls: 'sc-blue',
    logo: 'Swiss Tabac',
    name: 'Swiss Tabac',
    tag: 'Tabac · Épicerie',
    addr: 'Rue de Berne 46, 1201 Genève',
    clients: '430',
    orders: '960',
  },
]

function withShared(localeKey, locale) {
  const admin = getAdminTranslations(localeKey)
  return {
    ...locale,
    meta: { ...locale.meta, ...admin.meta },
    nav: { ...locale.nav, ...admin.nav },
    login: admin.login,
    theme: admin.theme,
    dashboard: admin.dashboard,
    products: admin.products,
    brands: admin.brands,
    companies: admin.companies,
    customers: admin.customers,
    loyalty: admin.loyalty,
    cards: sharedCards,
    phoneItems: sharedPhoneItems,
    partnerLogos: sharedPartnerLogos,
    storeCards: sharedStores,
  }
}

export const messages = {
  fr: withShared('fr', {
    meta: {
      titleSuffix: 'Digitalisez votre tabac',
      description:
        'La solution clé en main pour lancer votre boutique en ligne et fidéliser vos clients. Carte de fidélité digitale, gestion simple, identité propre.',
    },
    nav: {
      features: 'Fonctionnalités',
      loyalty: 'Fidélité',
      how: 'Comment ça marche',
      pricing: 'Tarifs',
      cta: 'Passer à l\'action',
    },
    hero: {
      eyebrow: 'Solution clé en main pour tabacs indépendants',
      titleLines: ['Votre commerce,', 'dans la poche', 'de vos clients.'],
      titleGoldIndex: 1,
      sub: 'Boutique en ligne personnalisée, carte de fidélité digitale et tableau de bord simple — tout ce qu\'il faut pour fidéliser et faire revenir vos clients, sans effort technique.',
      ctaPrimary: 'Lancer mon tabac en ligne',
      ctaSecondary: 'Voir comment ça marche',
      stats: [
        { num: '+38%', label: 'de clients récurrents' },
        { num: '2 sem.', label: 'pour être en ligne' },
        { num: '0 CHF', label: 'de frais cachés' },
      ],
      floatReward: { label: 'Récompense débloquée', value: '-5 CHF', sub: 'sur votre prochaine commande' },
      floatOrder: { label: 'Nouvelle commande', value: '14.50 CHF', sub: 'il y a 3 minutes' },
      phoneLoyaltyLabel: 'Carte fidélité',
      phonePointsSuffix: 'points',
      phoneNextReward: '120 pts pour votre prochain bon',
      appStoreName: 'Vaakai Store',
      appOpen: 'Ouvert',
      appOrderTitle: 'Commander',
      appSeeAll: 'Tout voir',
      appNextRewardLabel: '-5 CHF bientôt disponible',
      appTabHome: 'Accueil',
      appTabShop: 'Boutique',
      appTabLoyalty: 'Fidélité',
      appTabAccount: 'Compte',
    },
    cardSubs: {
      presse: 'Tabac · Presse',
      librairie: 'Tabac · Librairie',
      epicerie: 'Tabac · Épicerie',
      coiffeur: 'Coiffeur · Salon',
    },
    cardRewardLabel: 'à {pts} pts',
    logos: {
      label: 'Des tabacs indépendants qui font confiance à {name}',
    },
    features: {
      label: 'Fonctionnalités',
      title: 'Tout ce qu\'il faut pour',
      titleEm: 'digitaliser votre tabac',
      sub: 'Une plateforme complète pensée spécialement pour les tabacs indépendants.',
      comingSoon: 'Bientôt disponible',
      items: [
        { icon: '🛍', name: 'Boutique en ligne', desc: 'Votre propre boutique avec votre nom, votre logo et vos couleurs. Vos clients commandent en quelques clics, 24h/24.' },
        { icon: '💳', name: 'Carte de fidélité digitale', desc: 'Un système de points automatique à chaque achat. Vos clients accumulent, vous choisissez les récompenses.' },
        { icon: '📊', name: 'Tableau de bord', desc: 'Suivez vos ventes, vos clients les plus fidèles et vos meilleures ventes en temps réel depuis votre téléphone.' },
        { icon: '📦', name: 'Click & Collect', desc: 'Vos clients pourront commander en ligne et retirer leur panier au comptoir. Fonctionnalité en cours de déploiement.' },
        { icon: '🔔', name: 'Notifications push', desc: 'Envoyez des promotions ciblées directement sur le téléphone de vos clients. Résultats immédiats.' },
        { icon: '🗂', name: 'Gestion des stocks', desc: 'Gérez votre catalogue produits facilement. Ajout, modification, rupture de stock — tout se fait en quelques secondes.' },
        { icon: '⚡', name: 'Mise en ligne rapide', desc: 'Votre boutique est prête en moins de 2 semaines. On s\'occupe de tout : design, paramétrage et formation.' },
      ],
    },
    loyalty: {
      label: 'Carte de fidélité',
      title: 'La carte qui fait',
      titleEm: 'revenir vos clients.',
      desc: 'Chaque achat rapporte des points. Vos clients les voient en temps réel sur leur téléphone et reviennent pour débloquer leurs récompenses. Vous définissez les règles, nous gérons tout le reste.',
      points: [
        { title: 'Points automatiques', text: 'Des points attribués à chaque commande, sans action de votre part.' },
        { title: 'Récompenses personnalisées', text: 'Bon de réduction, produit offert, livraison gratuite — vous décidez.' },
        { title: 'Carte multi-tabacs', text: 'Vos clients gardent leur carte même s\'ils changent de tabac partenaire.' },
        { title: 'Notifications intelligentes', text: 'Rappels automatiques quand un client est proche d\'une récompense.' },
      ],
      cta: 'Activer la carte de fidélité',
      pointsLabel: 'points',
      cardTypeLabel: 'Carte de fidélité',
      cardMemberLabel: 'Titulaire',
      cardNumberLabel: 'N° carte',
      statReturn: 'de taux de retour',
      statActive: 'cartes actives',
    },
    how: {
      label: 'Comment ça marche',
      title: 'En ligne en',
      titleEm: '3 étapes simples',
      steps: [
        { num: '01', icon: '🎨', title: 'Personnalisation', desc: 'On crée votre boutique à votre image : logo, couleurs, catalogue produits. Vous validez, on peaufine.' },
        { num: '02', icon: '🚀', title: 'Lancement', desc: 'Votre boutique est mise en ligne. On configure la carte de fidélité et on forme votre équipe en 1h.' },
        { num: '03', icon: '📈', title: 'Croissance', desc: 'Vos clients commandent, accumulent des points, reviennent. Vous suivez tout depuis votre tableau de bord.' },
      ],
    },
    stores: {
      label: 'Multi-tabacs',
      title: 'Chaque tabac garde',
      titleEm: 'sa propre identité',
      sub: 'Votre boutique, vos couleurs, votre clientèle. Rien de générique.',
      loyalClients: 'clients fidèles',
      orders: 'commandes',
      online: 'En ligne',
      visitSite: 'Visiter la boutique',
    },
    testimonials: {
      label: 'Partenaires',
      title: 'FidTab',
      titleEm: 'en action',
      sub: 'Vaakai Store est déjà en ligne sur la plateforme. Voici ce que {name} apporte concrètement à un commerce indépendant.',
      partnerBadge: 'Partenaire en ligne',
      items: [
        {
          kind: 'partner',
          name: VAAKAI_STORE_PARTNER.name,
          tag: VAAKAI_STORE_PARTNER.tag,
          location: VAAKAI_STORE_PARTNER.location,
          description:
            'Boutique en ligne avec identité propre, catalogue produits et commandes gérées sur une seule plateforme — sans développement sur mesure.',
          url: VAAKAI_STORE_PARTNER.websiteUrl,
          logoUrl: VAAKAI_STORE_PARTNER.logoUrl,
        },
        {
          kind: 'benefit',
          icon: '🎨',
          title: 'Identité propre',
          text: 'Logo, couleurs et nom de votre commerce. Chaque boutique a son URL et son apparence, comme dans la vitrine ci-dessus.',
        },
        {
          kind: 'benefit',
          icon: '⚡',
          title: 'Mise en ligne accompagnée',
          text: 'Design, paramétrage du catalogue et formation : votre boutique est prête en moins de 2 semaines, sans compétence technique.',
        },
      ],
    },
    pricing: {
      label: 'Tarifs',
      title: 'Simple,',
      titleEm: 'transparent',
      sub: 'Sans engagement, sans frais cachés. Résiliable à tout moment.',
      popular: 'POPULAIRE',
      billingMonthly: 'Mensuel',
      billingAnnual: 'Annuel',
      billingSave: '−2 mois',
      perMonth: '/mois',
      perYear: '/an',
      plans: [
        { plan: 'Starter', price: '49', priceAnnual: '490', desc: 'Pour démarrer et tester la solution.', features: ['Boutique en ligne', 'Jusqu\'à 50 produits', 'Carte de fidélité basique', 'Support par email'], cta: 'Commencer', featured: false },
        { plan: 'Pro', price: '99', priceAnnual: '990', desc: 'La solution complète pour fidéliser.', features: ['Boutique en ligne illimitée', 'Produits illimités', 'Carte de fidélité avancée', 'Notifications push', 'Tableau de bord analytics', 'Support prioritaire'], cta: 'Commencer', featured: true },
        { plan: 'Multi', price: '149', priceAnnual: '1490', desc: 'Pour gérer plusieurs points de vente.', features: ['Jusqu\'à 5 boutiques', 'Carte fidélité multi-enseignes', 'Tableau de bord centralisé', 'Formations incluses', 'Account manager dédié'], cta: 'Contacter', featured: false },
      ],
      websiteOption: {
        label: 'Option à la carte',
        title: 'Réalisation d\'un site internet personnalisé',
        desc: 'Un site sur mesure à votre image — logo, couleurs et contenus adaptés à votre tabac. En complément de votre abonnement FidTab.',
        price: '199',
        priceOnce: 'forfait unique',
        cta: 'Demander un devis',
      },
    },
    cta: {
      title: 'Prêt à digitaliser',
      titleEm: 'votre commerce ?',
      sub: 'Rejoignez les tabacs indépendants qui ont choisi {name} pour fidéliser leurs clients et augmenter leur chiffre d\'affaires.',
      primary: 'Demander une démo gratuite',
      secondary: '📞 Nous appeler',
      note: 'Démo sans engagement · Mise en ligne en 2 semaines · Support inclus',
    },
    requestDemo: {
      metaTitle: 'Demander une démo',
      title: 'Passons à',
      titleEm: 'l\'action',
      sub: 'Dites-nous comment vous joindre : nous vous rappelons rapidement pour présenter {name} et répondre à vos questions.',
      methodLabel: 'Comment souhaitez-vous être rappelé ?',
      methods: {
        email: { id: 'email', label: 'Par e-mail', icon: '✉️' },
        phone: { id: 'phone', label: 'Par téléphone', icon: '📞' },
        whatsapp: { id: 'whatsapp', label: 'Par WhatsApp', icon: '💬' },
      },
      fields: {
        shop: 'Nom du commerce',
        name: 'Votre nom',
        email: 'Adresse e-mail',
        phone: 'Numéro de téléphone',
        whatsapp: 'Numéro WhatsApp',
        emailInvalid: 'Adresse e-mail invalide.',
        phoneInvalid: 'Numéro invalide pour le pays sélectionné.',
        message: 'Message',
        optional: 'optionnel',
      },
      submit: 'Envoyer ma demande',
      back: '← Retour à l\'accueil',
      successTitle: 'Demande envoyée',
      successText: 'Merci ! Nous vous recontactons très vite par le canal choisi.',
    },
    legalNotice: {
      metaTitle: 'Mentions légales',
      title: 'Mentions légales',
      back: '← Retour à l\'accueil',
      updated: 'Dernière mise à jour : mai 2026',
      relatedLabel: 'Documents associés',
      sections: [
        {
          title: 'Éditeur du site',
          paragraphs: [
            'Le site {name} est édité par FidTab, solution de digitalisation pour commerces de proximité.',
            'Contact : contact@fidtab.com',
          ],
        },
        {
          title: 'Hébergement',
          paragraphs: [
            'Le site est hébergé par un prestataire cloud conforme aux standards de sécurité en vigueur.',
            'Pour toute question relative à l\'hébergement, contactez-nous à l\'adresse indiquée ci-dessus.',
          ],
        },
        {
          title: 'Propriété intellectuelle',
          paragraphs: [
            'L\'ensemble des éléments du site (textes, visuels, logo, structure) est protégé par le droit de la propriété intellectuelle.',
            'Toute reproduction ou représentation, totale ou partielle, sans autorisation écrite préalable est interdite.',
          ],
        },
        {
          title: 'Responsabilité',
          paragraphs: [
            'FidTab s\'efforce de fournir des informations exactes et à jour. Toutefois, nous ne pouvons garantir l\'absence d\'erreurs ou d\'omissions.',
            'L\'utilisateur reste seul responsable de l\'usage qu\'il fait des informations disponibles sur le site.',
            'Concernant la carte de fidélité digitale, les points gagnés et les récompenses dépendent de chaque tabac partenaire. Le commerçant partenaire est seul responsable de l\'enregistrement des clients, du scan du code QR et du contrôle de l\'âge requis. Voir les conditions générales d\'utilisation pour le détail.',
          ],
        },
      ],
    },
    terms: {
      metaTitle: 'Conditions générales',
      title: 'Conditions générales d\'utilisation',
      back: '← Retour à l\'accueil',
      updated: 'Dernière mise à jour : mai 2026',
      relatedLabel: 'Documents associés',
      sections: [
        {
          title: 'Objet',
          paragraphs: [
            'Les présentes conditions régissent l\'accès et l\'utilisation des services proposés par {name} aux commerçants partenaires.',
            'En utilisant nos services, vous acceptez sans réserve les présentes conditions.',
          ],
        },
        {
          title: 'Services proposés',
          paragraphs: [
            '{name} propose une solution clé en main comprenant boutique en ligne, carte de fidélité digitale et outils de gestion.',
            'Les fonctionnalités disponibles dépendent de la formule d\'abonnement souscrite.',
          ],
        },
        {
          title: 'Carte de fidélité',
          paragraphs: [
            'Les points de fidélité obtenus via la carte digitale {name} dépendent du tabac ou commerçant partenaire auprès duquel le client effectue ses achats. Le barème d\'attribution des points, les récompenses et leurs conditions sont définis et appliqués par chaque établissement partenaire, sous sa seule responsabilité.',
            'L\'inscription d\'un client au programme de fidélité et l\'attribution de points lors du scan de son code QR sont réalisées par le tabac partenaire, en point de vente. Ce dernier est seul responsable du contrôle de l\'éligibilité du client, notamment de la vérification de l\'âge légal requis pour l\'achat de produits du tabac, du vape et, le cas échéant, pour la participation au programme de fidélité.',
            'Si un client n\'a pas l\'âge requis pour bénéficier du programme ou pour acheter les produits concernés, la responsabilité incombe exclusivement au tabac partenaire, en sa qualité de commerçant ayant procédé à l\'enregistrement du client et au scan de son code QR. {name} fournit l\'outil technique de fidélité mais n\'intervient pas dans la relation commerciale ni dans les contrôles effectués en caisse.',
          ],
        },
        {
          title: 'Abonnement et tarifs',
          paragraphs: [
            'Les tarifs en vigueur sont indiqués sur le site pour les formules mensuelles et annuelles, ainsi que pour les options ponctuelles le cas échéant. Ils peuvent être révisés avec un préavis raisonnable.',
            'L\'abonnement est conclu pour une durée mensuelle ou annuelle, selon la formule choisie, renouvelable tacitement à son échéance sauf résiliation.',
          ],
        },
        {
          title: 'Obligations des parties',
          paragraphs: [
            'Le commerçant s\'engage à fournir des informations exactes et à respecter la réglementation applicable à son activité.',
            '{name} s\'engage à mettre en œuvre les moyens nécessaires pour assurer la disponibilité et la sécurité du service.',
          ],
        },
        {
          title: 'Données personnelles',
          paragraphs: [
            'Le traitement des données personnelles est décrit dans notre politique de confidentialité.',
            'Chaque partie reste responsable des données qu\'elle traite dans le cadre de son activité.',
          ],
        },
        {
          title: 'Droit applicable',
          paragraphs: [
            'Les présentes conditions sont soumises au droit applicable au siège de FidTab.',
            'En cas de litige, les parties s\'efforceront de trouver une solution amiable avant toute action judiciaire.',
          ],
        },
      ],
    },
    privacy: {
      metaTitle: 'Politique de confidentialité',
      title: 'Politique de confidentialité',
      back: '← Retour à l\'accueil',
      updated: 'Dernière mise à jour : mai 2026',
      relatedLabel: 'Documents associés',
      sections: [
        {
          title: 'Responsable du traitement',
          paragraphs: [
            'FidTab est responsable du traitement des données collectées via le site {name} et les formulaires associés.',
            'Pour toute question : contact@fidtab.com',
          ],
        },
        {
          title: 'Données collectées',
          paragraphs: [
            'Nous pouvons collecter : nom, coordonnées (e-mail, téléphone), nom du commerce, messages envoyés via nos formulaires.',
            'Des données techniques (adresse IP, navigateur) peuvent être enregistrées à des fins de sécurité et de statistiques.',
          ],
        },
        {
          title: 'Finalités',
          paragraphs: [
            'Répondre à vos demandes de démo ou de contact, gérer la relation commerciale et améliorer nos services.',
            'Nous ne vendons pas vos données à des tiers.',
          ],
        },
        {
          title: 'Programme de fidélité',
          paragraphs: [
            'Dans le cadre du programme de fidélité, certaines données (identifiant client, solde et historique de points) sont traitées par le tabac partenaire, responsable de leur collecte lors de l\'enregistrement du client et du scan de son code QR en magasin.',
            'Les points gagnés et les récompenses associées dépendent des règles fixées par chaque tabac partenaire. Le commerçant est seul responsable du respect des obligations légales, notamment la vérification de l\'âge du client avant l\'attribution de points.',
            'Pour le détail des responsabilités applicables, consultez nos conditions générales d\'utilisation.',
          ],
        },
        {
          title: 'Durée de conservation',
          paragraphs: [
            'Les données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées.',
            'Au-delà, elles sont supprimées ou anonymisées, sauf obligation légale de conservation.',
          ],
        },
        {
          title: 'Vos droits',
          paragraphs: [
            'Vous disposez d\'un droit d\'accès, de rectification, d\'effacement, de limitation et d\'opposition au traitement.',
            'Pour exercer vos droits, contactez-nous à contact@fidtab.com.',
          ],
        },
        {
          title: 'Cookies',
          paragraphs: [
            'Le site peut utiliser des cookies techniques nécessaires à son fonctionnement et des cookies de mesure d\'audience.',
            'Vous pouvez configurer votre navigateur pour refuser les cookies non essentiels.',
          ],
        },
      ],
    },
    contactPage: {
      metaTitle: 'Contact',
      title: 'Nous',
      titleEm: 'contacter',
      sub: 'Une question sur {name} ? Écrivez-nous ou contactez-nous sur WhatsApp — nous répondons rapidement.',
      back: '← Retour à l\'accueil',
      emailSubject: 'Contact FidTab',
      methods: {
        email: {
          label: 'Par e-mail',
          desc: 'Envoyez-nous un message, nous vous répondons sous 24 h ouvrées.',
          action: 'Ouvrir ma messagerie',
        },
        whatsapp: {
          label: 'Par WhatsApp',
          desc: 'Discutez directement avec notre équipe sur WhatsApp.',
          action: 'Ouvrir WhatsApp',
        },
      },
    },
    footer: {
      home: 'Accueil',
      features: 'Fonctionnalités',
      pricing: 'Tarifs',
      legal: 'Mentions légales',
      terms: 'CGU',
      privacy: 'Confidentialité',
      contact: 'Contact',
      copyright: '© {year} {name}. Tous droits réservés.',
    },
  }),

  en: withShared('en', {
    meta: {
      titleSuffix: 'Digitize your tobacco shop',
      description:
        'The turnkey solution to launch your online store and retain your customers. Digital loyalty card, simple management, your own brand identity.',
    },
    nav: {
      features: 'Features',
      loyalty: 'Loyalty',
      how: 'How it works',
      pricing: 'Pricing',
      cta: 'Take action',
    },
    hero: {
      eyebrow: 'Turnkey solution for independent tobacco shops',
      titleLines: ['Your business,', 'in your customers\'', 'pockets.'],
      titleGoldIndex: 1,
      sub: 'Personalized online store, digital loyalty card and simple dashboard — everything you need to retain customers and bring them back, with zero technical hassle.',
      ctaPrimary: 'Launch my online shop',
      ctaSecondary: 'See how it works',
      stats: [
        { num: '+38%', label: 'returning customers' },
        { num: '2 wks', label: 'to go live' },
        { num: 'CHF 0', label: 'hidden fees' },
      ],
      floatReward: { label: 'Reward unlocked', value: '-5 CHF', sub: 'on your next order' },
      floatOrder: { label: 'New order', value: '14.50 CHF', sub: '3 minutes ago' },
      phoneLoyaltyLabel: 'Loyalty card',
      phonePointsSuffix: 'points',
      phoneNextReward: '120 pts until your next voucher',
      appStoreName: 'Vaakai Store',
      appOpen: 'Open',
      appOrderTitle: 'Order now',
      appSeeAll: 'See all',
      appNextRewardLabel: '-5 CHF reward soon',
      appTabHome: 'Home',
      appTabShop: 'Shop',
      appTabLoyalty: 'Loyalty',
      appTabAccount: 'Account',
    },
    cardSubs: {
      presse: 'Tobacco · News',
      librairie: 'Tobacco · Books',
      epicerie: 'Tobacco · Grocery',
      coiffeur: 'Hair salon · Barber',
    },
    cardRewardLabel: 'at {pts} pts',
    logos: {
      label: 'Independent tobacco shops that trust {name}',
    },
    features: {
      label: 'Features',
      title: 'Everything you need to',
      titleEm: 'digitize your shop',
      sub: 'A complete platform designed specifically for independent tobacco retailers.',
      comingSoon: 'Coming soon',
      items: [
        { icon: '🛍', name: 'Online store', desc: 'Your own shop with your name, logo and colors. Customers order in a few clicks, 24/7.' },
        { icon: '💳', name: 'Digital loyalty card', desc: 'Automatic points on every purchase. Customers accumulate, you choose the rewards.' },
        { icon: '📊', name: 'Dashboard', desc: 'Track sales, your most loyal customers and top products in real time from your phone.' },
        { icon: '📦', name: 'Click & Collect', desc: 'Customers will soon order online and pick up at your counter. Feature rolling out shortly.' },
        { icon: '🔔', name: 'Push notifications', desc: 'Send targeted promotions directly to your customers\' phones. Immediate results.' },
        { icon: '🗂', name: 'Stock management', desc: 'Manage your product catalog easily. Add, edit, out-of-stock — all in seconds.' },
        { icon: '⚡', name: 'Fast launch', desc: 'Your shop is ready in under 2 weeks. We handle design, setup and training.' },
      ],
    },
    loyalty: {
      label: 'Loyalty card',
      title: 'The card that brings',
      titleEm: 'customers back.',
      desc: 'Every purchase earns points. Customers see them in real time on their phone and return to unlock rewards. You set the rules, we handle the rest.',
      points: [
        { title: 'Automatic points', text: 'Points awarded on every order, with no action required from you.' },
        { title: 'Custom rewards', text: 'Discount vouchers, free products, free delivery — you decide.' },
        { title: 'Multi-shop card', text: 'Customers keep their card even when visiting partner shops.' },
        { title: 'Smart notifications', text: 'Automatic reminders when a customer is close to a reward.' },
      ],
      cta: 'Activate loyalty card',
      pointsLabel: 'points',
      cardTypeLabel: 'Loyalty card',
      cardMemberLabel: 'Cardholder',
      cardNumberLabel: 'Card no.',
      statReturn: 'return rate',
      statActive: 'active cards',
    },
    how: {
      label: 'How it works',
      title: 'Online in',
      titleEm: '3 simple steps',
      steps: [
        { num: '01', icon: '🎨', title: 'Customization', desc: 'We build your shop to match your brand: logo, colors, product catalog. You approve, we refine.' },
        { num: '02', icon: '🚀', title: 'Launch', desc: 'Your shop goes live. We set up the loyalty card and train your team in 1 hour.' },
        { num: '03', icon: '📈', title: 'Growth', desc: 'Customers order, earn points, come back. You track everything from your dashboard.' },
      ],
    },
    stores: {
      label: 'Multi-shop',
      title: 'Every shop keeps',
      titleEm: 'its own identity',
      sub: 'Your store, your colors, your customers. Nothing generic.',
      loyalClients: 'loyal customers',
      orders: 'orders',
      online: 'Live',
      visitSite: 'Visit store',
    },
    testimonials: {
      label: 'Partners',
      title: 'FidTab',
      titleEm: 'in action',
      sub: 'Vaakai Store is already live on the platform. Here is what {name} concretely delivers for an independent shop.',
      partnerBadge: 'Live partner',
      items: [
        {
          kind: 'partner',
          name: VAAKAI_STORE_PARTNER.name,
          tag: VAAKAI_STORE_PARTNER.tag,
          location: VAAKAI_STORE_PARTNER.location,
          description:
            'Online store with its own brand identity, product catalog and orders managed on one platform — no custom development required.',
          url: VAAKAI_STORE_PARTNER.websiteUrl,
          logoUrl: VAAKAI_STORE_PARTNER.logoUrl,
        },
        {
          kind: 'benefit',
          icon: '🎨',
          title: 'Your own identity',
          text: 'Logo, colors and shop name. Each store has its own URL and look, just like in the showcase above.',
        },
        {
          kind: 'benefit',
          icon: '⚡',
          title: 'Guided launch',
          text: 'Design, catalog setup and training: your shop goes live in under 2 weeks, with no technical skills required.',
        },
      ],
    },
    pricing: {
      label: 'Pricing',
      title: 'Simple,',
      titleEm: 'transparent',
      sub: 'No commitment, no hidden fees. Cancel anytime.',
      popular: 'POPULAR',
      billingMonthly: 'Monthly',
      billingAnnual: 'Annual',
      billingSave: '2 months free',
      perMonth: '/month',
      perYear: '/year',
      plans: [
        { plan: 'Starter', price: '49', priceAnnual: '490', desc: 'To get started and test the solution.', features: ['Online store', 'Up to 50 products', 'Basic loyalty card', 'Email support'], cta: 'Get started', featured: false },
        { plan: 'Pro', price: '99', priceAnnual: '990', desc: 'The complete solution for customer retention.', features: ['Unlimited online store', 'Unlimited products', 'Advanced loyalty card', 'Push notifications', 'Analytics dashboard', 'Priority support'], cta: 'Get started', featured: true },
        { plan: 'Multi', price: '149', priceAnnual: '1490', desc: 'To manage multiple locations.', features: ['Up to 5 stores', 'Multi-brand loyalty card', 'Centralized dashboard', 'Training included', 'Dedicated account manager'], cta: 'Contact us', featured: false },
      ],
      websiteOption: {
        label: 'Optional add-on',
        title: 'Custom website design & build',
        desc: 'A bespoke site tailored to your brand — logo, colors and content adapted to your store. In addition to your FidTab subscription.',
        price: '199',
        priceOnce: 'one-time fee',
        cta: 'Request a quote',
      },
    },
    cta: {
      title: 'Ready to digitize',
      titleEm: 'your shop?',
      sub: 'Join independent tobacco shops that chose {name} to retain customers and grow revenue.',
      primary: 'Request a free demo',
      secondary: '📞 Call us',
      note: 'No-commitment demo · Live in 2 weeks · Support included',
    },
    requestDemo: {
      metaTitle: 'Request a demo',
      title: 'Let\'s take',
      titleEm: 'action',
      sub: 'Tell us how to reach you — we\'ll get back quickly to walk you through {name}.',
      methodLabel: 'How would you like to be contacted?',
      methods: {
        email: { id: 'email', label: 'By email', icon: '✉️' },
        phone: { id: 'phone', label: 'By phone', icon: '📞' },
        whatsapp: { id: 'whatsapp', label: 'By WhatsApp', icon: '💬' },
      },
      fields: {
        shop: 'Shop name',
        name: 'Your name',
        email: 'Email address',
        phone: 'Phone number',
        whatsapp: 'WhatsApp number',
        emailInvalid: 'Invalid email address.',
        phoneInvalid: 'Invalid number for the selected country.',
        message: 'Message',
        optional: 'optional',
      },
      submit: 'Send my request',
      back: '← Back to home',
      successTitle: 'Request sent',
      successText: 'Thank you! We\'ll contact you shortly via your chosen channel.',
    },
    legalNotice: {
      metaTitle: 'Legal notice',
      title: 'Legal notice',
      back: '← Back to home',
      updated: 'Last updated: May 2026',
      relatedLabel: 'Related documents',
      sections: [
        {
          title: 'Site publisher',
          paragraphs: [
            'The {name} website is published by FidTab, a digitalization solution for local retailers.',
            'Contact: contact@fidtab.com',
          ],
        },
        {
          title: 'Hosting',
          paragraphs: [
            'The site is hosted by a cloud provider meeting current security standards.',
            'For any hosting-related questions, contact us at the address above.',
          ],
        },
        {
          title: 'Intellectual property',
          paragraphs: [
            'All site elements (text, visuals, logo, structure) are protected by intellectual property law.',
            'Any reproduction or representation, in whole or in part, without prior written consent is prohibited.',
          ],
        },
        {
          title: 'Liability',
          paragraphs: [
            'FidTab strives to provide accurate, up-to-date information but cannot guarantee the absence of errors or omissions.',
            'Users remain solely responsible for how they use information available on the site.',
            'Regarding the digital loyalty card, points earned and rewards depend on each partner tobacco shop. The partner merchant is solely responsible for registering customers, scanning QR codes and verifying the required minimum age. See our terms of use for details.',
          ],
        },
      ],
    },
    terms: {
      metaTitle: 'Terms of use',
      title: 'Terms and conditions of use',
      back: '← Back to home',
      updated: 'Last updated: May 2026',
      relatedLabel: 'Related documents',
      sections: [
        {
          title: 'Purpose',
          paragraphs: [
            'These terms govern access to and use of services offered by {name} to partner merchants.',
            'By using our services, you accept these terms without reservation.',
          ],
        },
        {
          title: 'Services offered',
          paragraphs: [
            '{name} provides a turnkey solution including online store, digital loyalty card and management tools.',
            'Available features depend on the subscribed plan.',
          ],
        },
        {
          title: 'Loyalty card',
          paragraphs: [
            'Loyalty points earned through the {name} digital card depend on the partner tobacco shop or merchant where the customer makes purchases. Point allocation, rewards and their conditions are defined and applied by each partner establishment, under its sole responsibility.',
            'Customer registration to the loyalty program and point allocation when scanning the customer\'s QR code are performed by the partner shop at the point of sale. The merchant is solely responsible for checking customer eligibility, including verifying the legal minimum age required to purchase tobacco and vaping products and, where applicable, to participate in the loyalty program.',
            'If a customer does not meet the required age to benefit from the program or to purchase the relevant products, liability lies exclusively with the partner shop, as the merchant who registered the customer and scanned their QR code. {name} provides the loyalty technology but does not intervene in the commercial relationship or checks performed at checkout.',
          ],
        },
        {
          title: 'Subscription and pricing',
          paragraphs: [
            'Current prices are shown on the site for monthly and annual plans, as well as one-time options where applicable. They may be revised with reasonable notice.',
            'Subscriptions are taken out on a monthly or annual basis, depending on the chosen plan, and renew automatically at the end of each period unless cancelled.',
          ],
        },
        {
          title: 'Parties\' obligations',
          paragraphs: [
            'Merchants agree to provide accurate information and comply with regulations applicable to their business.',
            '{name} commits to implementing the means necessary to ensure service availability and security.',
          ],
        },
        {
          title: 'Personal data',
          paragraphs: [
            'Personal data processing is described in our privacy policy.',
            'Each party remains responsible for data it processes in the course of its activity.',
          ],
        },
        {
          title: 'Applicable law',
          paragraphs: [
            'These terms are governed by the law applicable at FidTab\'s registered office.',
            'In case of dispute, parties will seek an amicable solution before any legal action.',
          ],
        },
      ],
    },
    privacy: {
      metaTitle: 'Privacy policy',
      title: 'Privacy policy',
      back: '← Back to home',
      updated: 'Last updated: May 2026',
      relatedLabel: 'Related documents',
      sections: [
        {
          title: 'Data controller',
          paragraphs: [
            'FidTab is responsible for processing data collected via the {name} site and related forms.',
            'Questions: contact@fidtab.com',
          ],
        },
        {
          title: 'Data collected',
          paragraphs: [
            'We may collect: name, contact details (email, phone), shop name, messages sent via our forms.',
            'Technical data (IP address, browser) may be logged for security and analytics purposes.',
          ],
        },
        {
          title: 'Purposes',
          paragraphs: [
            'To respond to demo or contact requests, manage the business relationship and improve our services.',
            'We do not sell your data to third parties.',
          ],
        },
        {
          title: 'Loyalty program',
          paragraphs: [
            'Under the loyalty program, certain data (customer identifier, points balance and history) is processed by the partner shop, which is responsible for collecting it when registering the customer and scanning their QR code in store.',
            'Points earned and associated rewards depend on rules set by each partner shop. The merchant is solely responsible for complying with legal obligations, including verifying the customer\'s age before awarding points.',
            'For full details on applicable responsibilities, please refer to our terms of use.',
          ],
        },
        {
          title: 'Retention period',
          paragraphs: [
            'Data is kept for as long as necessary for the purposes for which it was collected.',
            'Beyond that, it is deleted or anonymized, unless legally required to retain it.',
          ],
        },
        {
          title: 'Your rights',
          paragraphs: [
            'You have the right to access, rectify, erase, restrict and object to processing.',
            'To exercise your rights, contact us at contact@fidtab.com.',
          ],
        },
        {
          title: 'Cookies',
          paragraphs: [
            'The site may use technical cookies required for operation and audience measurement cookies.',
            'You can configure your browser to refuse non-essential cookies.',
          ],
        },
      ],
    },
    contactPage: {
      metaTitle: 'Contact',
      title: 'Get in',
      titleEm: 'touch',
      sub: 'Have a question about {name}? Email us or reach us on WhatsApp — we reply quickly.',
      back: '← Back to home',
      emailSubject: 'FidTab contact',
      methods: {
        email: {
          label: 'By email',
          desc: 'Send us a message — we reply within one business day.',
          action: 'Open my email app',
        },
        whatsapp: {
          label: 'By WhatsApp',
          desc: 'Chat directly with our team on WhatsApp.',
          action: 'Open WhatsApp',
        },
      },
    },
    footer: {
      home: 'Home',
      features: 'Features',
      pricing: 'Pricing',
      legal: 'Legal notice',
      terms: 'Terms',
      privacy: 'Privacy',
      contact: 'Contact',
      copyright: '© {year} {name}. All rights reserved.',
    },
  }),

}

export function interpolate(text, vars = {}) {
  if (typeof text !== 'string') return text
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    text
  )
}
