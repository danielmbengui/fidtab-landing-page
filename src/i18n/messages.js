export { LOCALES } from '@/i18n/locales'
import { VAAKAI_STORE_PARTNER } from '@/config/partnerData'
import arContent from '@/i18n/content/ar'
import esContent from '@/i18n/content/es'
import hiContent from '@/i18n/content/hi'
import jaContent from '@/i18n/content/ja'
import lnContent from '@/i18n/content/ln'
import nlContent from '@/i18n/content/nl'
import ruContent from '@/i18n/content/ru'
import zhContent from '@/i18n/content/zh'

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

function withShared(locale) {
  return {
    ...locale,
    cards: sharedCards,
    phoneItems: sharedPhoneItems,
    partnerLogos: sharedPartnerLogos,
    storeCards: sharedStores,
  }
}

export const messages = {
  fr: withShared({
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

  en: withShared({
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

  de: withShared({
    meta: {
      titleSuffix: 'Digitalisieren Sie Ihr Tabakgeschäft',
      description:
        'Die schlüsselfertige Lösung für Ihren Online-Shop und Kundenbindung. Digitale Treuekarte, einfache Verwaltung, eigene Identität.',
    },
    nav: {
      features: 'Funktionen',
      loyalty: 'Treueprogramm',
      how: 'So funktioniert\'s',
      pricing: 'Preise',
      cta: 'Jetzt starten',
    },
    hero: {
      eyebrow: 'Schlüsselfertige Lösung für unabhängige Tabakläden',
      titleLines: ['Ihr Geschäft,', 'in der Tasche', 'Ihrer Kunden.'],
      titleGoldIndex: 1,
      sub: 'Personalisierter Online-Shop, digitale Treuekarte und einfaches Dashboard — alles, um Kunden zu binden und zurückzubringen, ohne technischen Aufwand.',
      ctaPrimary: 'Meinen Online-Shop starten',
      ctaSecondary: 'So funktioniert\'s',
      stats: [
        { num: '+38%', label: 'Stammkunden' },
        { num: '2 Wo.', label: 'bis zum Start' },
        { num: '0 CHF', label: 'versteckte Gebühren' },
      ],
      floatReward: { label: 'Belohnung freigeschaltet', value: '-5 CHF', sub: 'auf Ihre nächste Bestellung' },
      floatOrder: { label: 'Neue Bestellung', value: '14,50 CHF', sub: 'vor 3 Minuten' },
      phoneLoyaltyLabel: 'Treuekarte',
      phonePointsSuffix: 'Punkte',
      phoneNextReward: '120 Pkt. bis zum nächsten Gutschein',
      appStoreName: 'Vaakai Store',
      appOpen: 'Geöffnet',
      appOrderTitle: 'Bestellen',
      appSeeAll: 'Alle',
      appNextRewardLabel: '-5 CHF bald verfügbar',
      appTabHome: 'Start',
      appTabShop: 'Shop',
      appTabLoyalty: 'Treue',
      appTabAccount: 'Konto',
    },
    cardSubs: {
      presse: 'Tabak · Presse',
      librairie: 'Tabak · Buchhandlung',
      epicerie: 'Tabak · Lebensmittel',
      coiffeur: 'Friseur · Salon',
    },
    cardRewardLabel: 'ab {pts} Pkt.',
    logos: {
      label: 'Unabhängige Tabakläden, die {name} vertrauen',
    },
    features: {
      label: 'Funktionen',
      title: 'Alles, was Sie brauchen, um',
      titleEm: 'Ihren Laden zu digitalisieren',
      sub: 'Eine komplette Plattform speziell für unabhängige Tabakläden.',
      comingSoon: 'Demnächst',
      items: [
        { icon: '🛍', name: 'Online-Shop', desc: 'Ihr eigener Shop mit Name, Logo und Farben. Kunden bestellen in wenigen Klicks, rund um die Uhr.' },
        { icon: '💳', name: 'Digitale Treuekarte', desc: 'Automatische Punkte bei jedem Einkauf. Kunden sammeln, Sie wählen die Belohnungen.' },
        { icon: '📊', name: 'Dashboard', desc: 'Verkäufe, treueste Kunden und Bestseller in Echtzeit vom Handy aus verfolgen.' },
        { icon: '📦', name: 'Click & Collect', desc: 'Kunden können bald online bestellen und am Tresen abholen. Funktion wird in Kürze freigeschaltet.' },
        { icon: '🔔', name: 'Push-Benachrichtigungen', desc: 'Gezielte Aktionen direkt auf das Handy Ihrer Kunden. Sofortige Ergebnisse.' },
        { icon: '🗂', name: 'Bestandsverwaltung', desc: 'Produktkatalog einfach verwalten. Hinzufügen, bearbeiten, Ausverkauf — in Sekunden erledigt.' },
        { icon: '⚡', name: 'Schneller Start', desc: 'Ihr Shop ist in unter 2 Wochen bereit. Design, Einrichtung und Schulung übernehmen wir.' },
      ],
    },
    loyalty: {
      label: 'Treuekarte',
      title: 'Die Karte, die',
      titleEm: 'Kunden zurückbringt.',
      desc: 'Jeder Einkauf bringt Punkte. Kunden sehen sie in Echtzeit auf dem Handy und kommen zurück, um Belohnungen freizuschalten. Sie legen die Regeln fest, wir erledigen den Rest.',
      points: [
        { title: 'Automatische Punkte', text: 'Punkte bei jeder Bestellung, ohne Ihr Zutun.' },
        { title: 'Individuelle Belohnungen', text: 'Rabattgutschein, Gratisprodukt, kostenlose Lieferung — Sie entscheiden.' },
        { title: 'Multi-Shop-Karte', text: 'Kunden behalten ihre Karte auch bei Partnerläden.' },
        { title: 'Intelligente Benachrichtigungen', text: 'Automatische Erinnerungen, wenn ein Kunde einer Belohnung nahe ist.' },
      ],
      cta: 'Treuekarte aktivieren',
      pointsLabel: 'Punkte',
      cardTypeLabel: 'Treuekarte',
      cardMemberLabel: 'Inhaber',
      cardNumberLabel: 'Karten-Nr.',
      statReturn: 'Rückkehrrate',
      statActive: 'aktive Karten',
    },
    how: {
      label: 'So funktioniert\'s',
      title: 'Online in',
      titleEm: '3 einfachen Schritten',
      steps: [
        { num: '01', icon: '🎨', title: 'Personalisierung', desc: 'Wir gestalten Ihren Shop nach Ihrem Bild: Logo, Farben, Produktkatalog. Sie genehmigen, wir verfeinern.' },
        { num: '02', icon: '🚀', title: 'Start', desc: 'Ihr Shop geht live. Wir richten die Treuekarte ein und schulen Ihr Team in 1 Stunde.' },
        { num: '03', icon: '📈', title: 'Wachstum', desc: 'Kunden bestellen, sammeln Punkte, kommen zurück. Alles vom Dashboard aus verfolgen.' },
      ],
    },
    stores: {
      label: 'Multi-Shop',
      title: 'Jeder Laden behält',
      titleEm: 'seine eigene Identität',
      sub: 'Ihr Shop, Ihre Farben, Ihre Kundschaft. Nichts Generisches.',
      loyalClients: 'Stammkunden',
      orders: 'Bestellungen',
      online: 'Online',
      visitSite: 'Shop besuchen',
    },
    testimonials: {
      label: 'Partner',
      title: 'FidTab',
      titleEm: 'in Aktion',
      sub: 'Vaakai Store ist bereits live auf der Plattform. Das bringt {name} konkret für ein unabhängiges Geschäft.',
      partnerBadge: 'Live-Partner',
      items: [
        {
          kind: 'partner',
          name: VAAKAI_STORE_PARTNER.name,
          tag: VAAKAI_STORE_PARTNER.tag,
          location: VAAKAI_STORE_PARTNER.location,
          description:
            'Online-Shop mit eigener Identität, Produktkatalog und Bestellungen auf einer Plattform — ohne individuelle Entwicklung.',
          url: VAAKAI_STORE_PARTNER.websiteUrl,
          logoUrl: VAAKAI_STORE_PARTNER.logoUrl,
        },
        {
          kind: 'benefit',
          icon: '🎨',
          title: 'Eigene Identität',
          text: 'Logo, Farben und Name Ihres Geschäfts. Jeder Shop hat seine URL und sein Erscheinungsbild, wie in der Vitrine oben.',
        },
        {
          kind: 'benefit',
          icon: '⚡',
          title: 'Begleiteter Start',
          text: 'Design, Katalog-Setup und Schulung: Ihr Shop ist in weniger als 2 Wochen online, ohne technische Kenntnisse.',
        },
      ],
    },
    pricing: {
      label: 'Preise',
      title: 'Einfach,',
      titleEm: 'transparent',
      sub: 'Ohne Bindung, ohne versteckte Gebühren. Jederzeit kündbar.',
      popular: 'BELIEBT',
      billingMonthly: 'Monatlich',
      billingAnnual: 'Jährlich',
      billingSave: '2 Monate gratis',
      perMonth: '/Monat',
      perYear: '/Jahr',
      plans: [
        { plan: 'Starter', price: '49', priceAnnual: '490', desc: 'Zum Starten und Testen der Lösung.', features: ['Online-Shop', 'Bis zu 50 Produkte', 'Basis-Treuekarte', 'E-Mail-Support'], cta: 'Starten', featured: false },
        { plan: 'Pro', price: '99', priceAnnual: '990', desc: 'Die komplette Lösung zur Kundenbindung.', features: ['Unbegrenzter Online-Shop', 'Unbegrenzte Produkte', 'Erweiterte Treuekarte', 'Push-Benachrichtigungen', 'Analytics-Dashboard', 'Prioritäts-Support'], cta: 'Starten', featured: true },
        { plan: 'Multi', price: '149', priceAnnual: '1490', desc: 'Für mehrere Standorte.', features: ['Bis zu 5 Shops', 'Multi-Marken-Treuekarte', 'Zentrales Dashboard', 'Schulungen inklusive', 'Dedizierter Account Manager'], cta: 'Kontakt', featured: false },
      ],
      websiteOption: {
        label: 'Optionale Zusatzleistung',
        title: 'Individuelle Website-Erstellung',
        desc: 'Eine massgeschneiderte Website in Ihrem Look — Logo, Farben und Inhalte für Ihr Geschäft. Ergänzend zu Ihrem FidTab-Abo.',
        price: '199',
        priceOnce: 'Einmalzahlung',
        cta: 'Angebot anfordern',
      },
    },
    cta: {
      title: 'Bereit, Ihren Laden',
      titleEm: 'zu digitalisieren?',
      sub: 'Schließen Sie sich unabhängigen Tabakläden an, die {name} gewählt haben, um Kunden zu binden und den Umsatz zu steigern.',
      primary: 'Kostenlose Demo anfragen',
      secondary: '📞 Anrufen',
      note: 'Unverbindliche Demo · Live in 2 Wochen · Support inklusive',
    },
    requestDemo: {
      metaTitle: 'Demo anfragen',
      title: 'Lassen Sie uns',
      titleEm: 'starten',
      sub: 'Sagen Sie uns, wie wir Sie erreichen können — wir melden uns schnell, um Ihnen {name} vorzustellen.',
      methodLabel: 'Wie möchten Sie kontaktiert werden?',
      methods: {
        email: { id: 'email', label: 'Per E-Mail', icon: '✉️' },
        phone: { id: 'phone', label: 'Per Telefon', icon: '📞' },
        whatsapp: { id: 'whatsapp', label: 'Per WhatsApp', icon: '💬' },
      },
      fields: {
        shop: 'Name des Geschäfts',
        name: 'Ihr Name',
        email: 'E-Mail-Adresse',
        phone: 'Telefonnummer',
        whatsapp: 'WhatsApp-Nummer',
        emailInvalid: 'Ungültige E-Mail-Adresse.',
        phoneInvalid: 'Ungültige Nummer für das ausgewählte Land.',
        message: 'Nachricht',
        optional: 'optional',
      },
      submit: 'Anfrage senden',
      back: '← Zurück zur Startseite',
      successTitle: 'Anfrage gesendet',
      successText: 'Vielen Dank! Wir melden uns in Kürze über den gewählten Kanal.',
    },
    legalNotice: {
      metaTitle: 'Impressum',
      title: 'Impressum',
      back: '← Zurück zur Startseite',
      updated: 'Letzte Aktualisierung: Mai 2026',
      relatedLabel: 'Verwandte Dokumente',
      sections: [
        {
          title: 'Herausgeber',
          paragraphs: [
            'Die Website {name} wird von FidTab betrieben, einer Digitalisierungslösung für lokale Händler.',
            'Kontakt: contact@fidtab.com',
          ],
        },
        {
          title: 'Hosting',
          paragraphs: [
            'Die Website wird bei einem Cloud-Anbieter gehostet, der aktuelle Sicherheitsstandards erfüllt.',
            'Bei Fragen zum Hosting kontaktieren Sie uns unter der oben genannten Adresse.',
          ],
        },
        {
          title: 'Geistiges Eigentum',
          paragraphs: [
            'Alle Elemente der Website (Texte, Bilder, Logo, Struktur) sind urheberrechtlich geschützt.',
            'Jede Vervielfältigung oder Darstellung, ganz oder teilweise, ohne vorherige schriftliche Genehmigung ist untersagt.',
          ],
        },
        {
          title: 'Haftung',
          paragraphs: [
            'FidTab bemüht sich, genaue und aktuelle Informationen bereitzustellen, kann jedoch Fehler oder Auslassungen nicht ausschließen.',
            'Der Nutzer ist allein verantwortlich für die Nutzung der auf der Website verfügbaren Informationen.',
            'Bei der digitalen Treuekarte hängen gesammelte Punkte und Prämien vom jeweiligen Partner-Tabakgeschäft ab. Der Partnerhändler ist allein verantwortlich für die Kundenregistrierung, das Scannen des QR-Codes und die Alterskontrolle. Details finden Sie in unseren Nutzungsbedingungen.',
          ],
        },
      ],
    },
    terms: {
      metaTitle: 'Allgemeine Geschäftsbedingungen',
      title: 'Allgemeine Nutzungsbedingungen',
      back: '← Zurück zur Startseite',
      updated: 'Letzte Aktualisierung: Mai 2026',
      relatedLabel: 'Verwandte Dokumente',
      sections: [
        {
          title: 'Gegenstand',
          paragraphs: [
            'Diese Bedingungen regeln den Zugang zu und die Nutzung der von {name} angebotenen Dienste für Partnerhändler.',
            'Mit der Nutzung unserer Dienste akzeptieren Sie diese Bedingungen vorbehaltlos.',
          ],
        },
        {
          title: 'Angebotene Dienste',
          paragraphs: [
            '{name} bietet eine schlüsselfertige Lösung mit Online-Shop, digitaler Treuekarte und Verwaltungstools.',
            'Verfügbare Funktionen hängen vom gewählten Abonnement ab.',
          ],
        },
        {
          title: 'Treuekarte',
          paragraphs: [
            'Treuepunkte, die über die digitale {name}-Karte gesammelt werden, hängen vom Partner-Tabakgeschäft ab, in dem der Kunde einkauft. Punktetabellen, Prämien und deren Bedingungen werden von jedem Partnerbetrieb eigenständig festgelegt und angewendet.',
            'Die Anmeldung eines Kunden zum Treueprogramm und die Punktevergabe beim Scannen seines QR-Codes erfolgen durch das Partnergeschäft vor Ort. Der Händler ist allein verantwortlich für die Prüfung der Berechtigung des Kunden, insbesondere für die Kontrolle des gesetzlich vorgeschriebenen Mindestalters für Tabak- und Dampfprodukte und gegebenenfalls für die Teilnahme am Treueprogramm.',
            'Erfüllt ein Kunde das erforderliche Alter nicht, um am Programm teilzunehmen oder die betreffenden Produkte zu kaufen, trägt ausschließlich das Partner-Tabakgeschäft die Verantwortung, da es den Kunden registriert und seinen QR-Code gescannt hat. {name} stellt nur die technische Treue-Lösung bereit und greift weder in das Kaufverhältnis noch in die Kontrollen an der Kasse ein.',
          ],
        },
        {
          title: 'Abonnement und Preise',
          paragraphs: [
            'Die aktuellen Preise für monatliche und jährliche Formeln sowie gegebenenfalls für einmalige Optionen sind auf der Website angegeben. Sie können mit angemessener Frist angepasst werden.',
            'Das Abonnement wird je nach gewählter Formel monatlich oder jährlich abgeschlossen und verlängert sich am Ende der Laufzeit automatisch, sofern es nicht gekündigt wird.',
          ],
        },
        {
          title: 'Pflichten der Parteien',
          paragraphs: [
            'Der Händler verpflichtet sich, korrekte Angaben zu machen und die für seine Tätigkeit geltenden Vorschriften einzuhalten.',
            '{name} verpflichtet sich, die erforderlichen Mittel für Verfügbarkeit und Sicherheit des Dienstes bereitzustellen.',
          ],
        },
        {
          title: 'Personenbezogene Daten',
          paragraphs: [
            'Die Verarbeitung personenbezogener Daten ist in unserer Datenschutzerklärung beschrieben.',
            'Jede Partei bleibt für die von ihr verarbeiteten Daten verantwortlich.',
          ],
        },
        {
          title: 'Anwendbares Recht',
          paragraphs: [
            'Diese Bedingungen unterliegen dem am Sitz von FidTab geltenden Recht.',
            'Im Streitfall bemühen sich die Parteien um eine gütliche Einigung, bevor sie rechtliche Schritte einleiten.',
          ],
        },
      ],
    },
    privacy: {
      metaTitle: 'Datenschutzerklärung',
      title: 'Datenschutzerklärung',
      back: '← Zurück zur Startseite',
      updated: 'Letzte Aktualisierung: Mai 2026',
      relatedLabel: 'Verwandte Dokumente',
      sections: [
        {
          title: 'Verantwortlicher',
          paragraphs: [
            'FidTab ist für die Verarbeitung der über die Website {name} und zugehörige Formulare erhobenen Daten verantwortlich.',
            'Fragen: contact@fidtab.com',
          ],
        },
        {
          title: 'Erhobene Daten',
          paragraphs: [
            'Wir können erheben: Name, Kontaktdaten (E-Mail, Telefon), Geschäftsname, über unsere Formulare gesendete Nachrichten.',
            'Technische Daten (IP-Adresse, Browser) können zu Sicherheits- und Statistikzwecken protokolliert werden.',
          ],
        },
        {
          title: 'Zwecke',
          paragraphs: [
            'Beantwortung von Demo- oder Kontaktanfragen, Pflege der Geschäftsbeziehung und Verbesserung unserer Dienste.',
            'Wir verkaufen Ihre Daten nicht an Dritte.',
          ],
        },
        {
          title: 'Treueprogramm',
          paragraphs: [
            'Im Rahmen des Treueprogramms werden bestimmte Daten (Kundenkennung, Punktestand und -verlauf) vom Partner-Tabakgeschäft verarbeitet, das für deren Erhebung bei der Kundenregistrierung und beim Scannen des QR-Codes im Geschäft verantwortlich ist.',
            'Gesammelte Punkte und zugehörige Prämien richten sich nach den Regeln des jeweiligen Partnergeschäfts. Der Händler ist allein verantwortlich für die Einhaltung gesetzlicher Pflichten, insbesondere die Alterskontrolle vor der Punktevergabe.',
            'Einzelheiten zu den geltenden Verantwortlichkeiten finden Sie in unseren Nutzungsbedingungen.',
          ],
        },
        {
          title: 'Aufbewahrungsdauer',
          paragraphs: [
            'Daten werden so lange aufbewahrt, wie es für die Zwecke der Erhebung erforderlich ist.',
            'Danach werden sie gelöscht oder anonymisiert, sofern keine gesetzliche Aufbewahrungspflicht besteht.',
          ],
        },
        {
          title: 'Ihre Rechte',
          paragraphs: [
            'Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung und Widerspruch gegen die Verarbeitung.',
            'Zur Ausübung Ihrer Rechte kontaktieren Sie uns unter contact@fidtab.com.',
          ],
        },
        {
          title: 'Cookies',
          paragraphs: [
            'Die Website kann technische Cookies für den Betrieb und Mess-Cookies für die Reichweitenmessung verwenden.',
            'Sie können Ihren Browser so einstellen, dass nicht wesentliche Cookies abgelehnt werden.',
          ],
        },
      ],
    },
    contactPage: {
      metaTitle: 'Kontakt',
      title: 'Kontakt',
      titleEm: 'aufnehmen',
      sub: 'Fragen zu {name}? Schreiben Sie uns oder kontaktieren Sie uns per WhatsApp — wir antworten schnell.',
      back: '← Zurück zur Startseite',
      emailSubject: 'FidTab Kontakt',
      methods: {
        email: {
          label: 'Per E-Mail',
          desc: 'Senden Sie uns eine Nachricht — Antwort innerhalb eines Werktags.',
          action: 'E-Mail-App öffnen',
        },
        whatsapp: {
          label: 'Per WhatsApp',
          desc: 'Chatten Sie direkt mit unserem Team auf WhatsApp.',
          action: 'WhatsApp öffnen',
        },
      },
    },
    footer: {
      home: 'Startseite',
      features: 'Funktionen',
      pricing: 'Preise',
      legal: 'Impressum',
      terms: 'AGB',
      privacy: 'Datenschutz',
      contact: 'Kontakt',
      copyright: '© {year} {name}. Alle Rechte vorbehalten.',
    },
  }),

  it: withShared({
    meta: {
      titleSuffix: 'Digitalizza la tua tabaccheria',
      description:
        'La soluzione chiavi in mano per lanciare il tuo negozio online e fidelizzare i clienti. Carta fedeltà digitale, gestione semplice, identità propria.',
    },
    nav: {
      features: 'Funzionalità',
      loyalty: 'Fedeltà',
      how: 'Come funziona',
      pricing: 'Prezzi',
      cta: 'Passa all\'azione',
    },
    hero: {
      eyebrow: 'Soluzione chiavi in mano per tabaccherie indipendenti',
      titleLines: ['Il tuo commercio,', 'in tasca', 'ai tuoi clienti.'],
      titleGoldIndex: 1,
      sub: 'Negozio online personalizzato, carta fedeltà digitale e dashboard semplice — tutto per fidelizzare e far tornare i clienti, senza sforzo tecnico.',
      ctaPrimary: 'Lancia il mio negozio online',
      ctaSecondary: 'Scopri come funziona',
      stats: [
        { num: '+38%', label: 'clienti abituali' },
        { num: '2 sett.', label: 'per andare online' },
        { num: '0 CHF', label: 'costi nascosti' },
      ],
      floatReward: { label: 'Premio sbloccato', value: '-5 CHF', sub: 'sul tuo prossimo ordine' },
      floatOrder: { label: 'Nuovo ordine', value: '14,50 CHF', sub: '3 minuti fa' },
      phoneLoyaltyLabel: 'Carta fedeltà',
      phonePointsSuffix: 'punti',
      phoneNextReward: '120 pt al prossimo buono',
      appStoreName: 'Vaakai Store',
      appOpen: 'Aperto',
      appOrderTitle: 'Ordina',
      appSeeAll: 'Vedi tutto',
      appNextRewardLabel: '-5 CHF presto disponibile',
      appTabHome: 'Home',
      appTabShop: 'Negozio',
      appTabLoyalty: 'Fedeltà',
      appTabAccount: 'Profilo',
    },
    cardSubs: {
      presse: 'Tabaccheria · Stampa',
      librairie: 'Tabaccheria · Libreria',
      epicerie: 'Tabaccheria · Alimentari',
      coiffeur: 'Parrucchiere · Salone',
    },
    cardRewardLabel: 'a {pts} pt',
    logos: {
      label: 'Tabaccherie indipendenti che si fidano di {name}',
    },
    features: {
      label: 'Funzionalità',
      title: 'Tutto ciò che serve per',
      titleEm: 'digitalizzare la tua tabaccheria',
      sub: 'Una piattaforma completa pensata appositamente per le tabaccherie indipendenti.',
      comingSoon: 'Prossimamente',
      items: [
        { icon: '🛍', name: 'Negozio online', desc: 'Il tuo negozio con il tuo nome, logo e colori. I clienti ordinano in pochi clic, 24 ore su 24.' },
        { icon: '💳', name: 'Carta fedeltà digitale', desc: 'Punti automatici ad ogni acquisto. I clienti accumulano, tu scegli i premi.' },
        { icon: '📊', name: 'Dashboard', desc: 'Monitora vendite, clienti più fedeli e bestseller in tempo reale dal telefono.' },
        { icon: '📦', name: 'Click & Collect', desc: 'I clienti potranno presto ordinare online e ritirare al banco. Funzionalità in arrivo a breve.' },
        { icon: '🔔', name: 'Notifiche push', desc: 'Promozioni mirate direttamente sul telefono dei clienti. Risultati immediati.' },
        { icon: '🗂', name: 'Gestione scorte', desc: 'Gestisci facilmente il catalogo prodotti. Aggiunta, modifica, esaurimento — tutto in pochi secondi.' },
        { icon: '⚡', name: 'Avvio rapido', desc: 'Il tuo negozio è pronto in meno di 2 settimane. Ci occupiamo di design, configurazione e formazione.' },
      ],
    },
    loyalty: {
      label: 'Carta fedeltà',
      title: 'La carta che fa',
      titleEm: 'tornare i clienti.',
      desc: 'Ogni acquisto fa guadagnare punti. I clienti li vedono in tempo reale sul telefono e tornano per sbloccare i premi. Tu definisci le regole, noi gestiamo il resto.',
      points: [
        { title: 'Punti automatici', text: 'Punti assegnati ad ogni ordine, senza alcuna azione da parte tua.' },
        { title: 'Premi personalizzati', text: 'Buono sconto, prodotto omaggio, consegna gratuita — decidi tu.' },
        { title: 'Carta multi-tabaccheria', text: 'I clienti mantengono la carta anche cambiando tabaccheria partner.' },
        { title: 'Notifiche intelligenti', text: 'Promemoria automatici quando un cliente è vicino a un premio.' },
      ],
      cta: 'Attiva la carta fedeltà',
      pointsLabel: 'punti',
      cardTypeLabel: 'Carta fedeltà',
      cardMemberLabel: 'Titolare',
      cardNumberLabel: 'N° carta',
      statReturn: 'tasso di ritorno',
      statActive: 'carte attive',
    },
    how: {
      label: 'Come funziona',
      title: 'Online in',
      titleEm: '3 semplici passi',
      steps: [
        { num: '01', icon: '🎨', title: 'Personalizzazione', desc: 'Creiamo il tuo negozio a tua immagine: logo, colori, catalogo prodotti. Tu approvi, noi perfezioniamo.' },
        { num: '02', icon: '🚀', title: 'Lancio', desc: 'Il tuo negozio va online. Configuriamo la carta fedeltà e formiamo il tuo team in 1 ora.' },
        { num: '03', icon: '📈', title: 'Crescita', desc: 'I clienti ordinano, accumulano punti, tornano. Segui tutto dalla dashboard.' },
      ],
    },
    stores: {
      label: 'Multi-tabaccheria',
      title: 'Ogni tabaccheria mantiene',
      titleEm: 'la propria identità',
      sub: 'Il tuo negozio, i tuoi colori, la tua clientela. Niente di generico.',
      loyalClients: 'clienti fedeli',
      orders: 'ordini',
      online: 'Online',
      visitSite: 'Visita il negozio',
    },
    testimonials: {
      label: 'Partner',
      title: 'FidTab',
      titleEm: 'in azione',
      sub: 'Vaakai Store è già online sulla piattaforma. Ecco cosa {name} offre concretamente a un negozio indipendente.',
      partnerBadge: 'Partner online',
      items: [
        {
          kind: 'partner',
          name: VAAKAI_STORE_PARTNER.name,
          tag: VAAKAI_STORE_PARTNER.tag,
          location: 'Ginevra',
          description:
            'Negozio online con identità propria, catalogo prodotti e ordini gestiti su un\'unica piattaforma — senza sviluppo su misura.',
          url: VAAKAI_STORE_PARTNER.websiteUrl,
          logoUrl: VAAKAI_STORE_PARTNER.logoUrl,
        },
        {
          kind: 'benefit',
          icon: '🎨',
          title: 'Identità propria',
          text: 'Logo, colori e nome del tuo negozio. Ogni boutique ha il suo URL e il suo look, come nella vetrina sopra.',
        },
        {
          kind: 'benefit',
          icon: '⚡',
          title: 'Lancio accompagnato',
          text: 'Design, configurazione del catalogo e formazione: il tuo negozio è online in meno di 2 settimane, senza competenze tecniche.',
        },
      ],
    },
    pricing: {
      label: 'Prezzi',
      title: 'Semplice,',
      titleEm: 'trasparente',
      sub: 'Senza impegno, senza costi nascosti. Disdetta in qualsiasi momento.',
      popular: 'POPOLARE',
      billingMonthly: 'Mensile',
      billingAnnual: 'Annuale',
      billingSave: '2 mesi gratis',
      perMonth: '/mese',
      perYear: '/anno',
      plans: [
        { plan: 'Starter', price: '49', priceAnnual: '490', desc: 'Per iniziare e testare la soluzione.', features: ['Negozio online', 'Fino a 50 prodotti', 'Carta fedeltà base', 'Supporto email'], cta: 'Inizia', featured: false },
        { plan: 'Pro', price: '99', priceAnnual: '990', desc: 'La soluzione completa per fidelizzare.', features: ['Negozio online illimitato', 'Prodotti illimitati', 'Carta fedeltà avanzata', 'Notifiche push', 'Dashboard analytics', 'Supporto prioritario'], cta: 'Inizia', featured: true },
        { plan: 'Multi', price: '149', priceAnnual: '1490', desc: 'Per gestire più punti vendita.', features: ['Fino a 5 negozi', 'Carta fedeltà multi-brand', 'Dashboard centralizzata', 'Formazione inclusa', 'Account manager dedicato'], cta: 'Contattaci', featured: false },
      ],
      websiteOption: {
        label: 'Opzione aggiuntiva',
        title: 'Realizzazione di un sito web personalizzato',
        desc: 'Un sito su misura per il tuo brand — logo, colori e contenuti adattati al tuo negozio. In aggiunta al tuo abbonamento FidTab.',
        price: '199',
        priceOnce: 'forfait unico',
        cta: 'Richiedi un preventivo',
      },
    },
    cta: {
      title: 'Pronto a digitalizzare',
      titleEm: 'la tua tabaccheria?',
      sub: 'Unisciti alle tabaccherie indipendenti che hanno scelto {name} per fidelizzare i clienti e aumentare il fatturato.',
      primary: 'Richiedi una demo gratuita',
      secondary: '📞 Chiamaci',
      note: 'Demo senza impegno · Online in 2 settimane · Supporto incluso',
    },
    requestDemo: {
      metaTitle: 'Richiedi una demo',
      title: 'Passiamo',
      titleEm: 'all\'azione',
      sub: 'Dicci come contattarti — ti richiamiamo presto per presentarti {name}.',
      methodLabel: 'Come preferisci essere ricontattato?',
      methods: {
        email: { id: 'email', label: 'Via e-mail', icon: '✉️' },
        phone: { id: 'phone', label: 'Via telefono', icon: '📞' },
        whatsapp: { id: 'whatsapp', label: 'Via WhatsApp', icon: '💬' },
      },
      fields: {
        shop: 'Nome del negozio',
        name: 'Il tuo nome',
        email: 'Indirizzo e-mail',
        phone: 'Numero di telefono',
        whatsapp: 'Numero WhatsApp',
        emailInvalid: 'Indirizzo e-mail non valido.',
        phoneInvalid: 'Numero non valido per il paese selezionato.',
        message: 'Messaggio',
        optional: 'facoltativo',
      },
      submit: 'Invia la mia richiesta',
      back: '← Torna alla home',
      successTitle: 'Richiesta inviata',
      successText: 'Grazie! Ti ricontatteremo a breve sul canale scelto.',
    },
    legalNotice: {
      metaTitle: 'Note legali',
      title: 'Note legali',
      back: '← Torna alla home',
      updated: 'Ultimo aggiornamento: maggio 2026',
      relatedLabel: 'Documenti correlati',
      sections: [
        {
          title: 'Editore del sito',
          paragraphs: [
            'Il sito {name} è edito da FidTab, soluzione di digitalizzazione per negozi locali.',
            'Contatto: contact@fidtab.com',
          ],
        },
        {
          title: 'Hosting',
          paragraphs: [
            'Il sito è ospitato da un provider cloud conforme agli standard di sicurezza vigenti.',
            'Per domande sull\'hosting, contattaci all\'indirizzo indicato sopra.',
          ],
        },
        {
          title: 'Proprietà intellettuale',
          paragraphs: [
            'Tutti gli elementi del sito (testi, immagini, logo, struttura) sono protetti dalla legge sulla proprietà intellettuale.',
            'Qualsiasi riproduzione o rappresentazione, totale o parziale, senza autorizzazione scritta è vietata.',
          ],
        },
        {
          title: 'Responsabilità',
          paragraphs: [
            'FidTab si impegna a fornire informazioni accurate e aggiornate, senza tuttavia garantire l\'assenza di errori o omissioni.',
            'L\'utente è l\'unico responsabile dell\'uso delle informazioni disponibili sul sito.',
            'Per quanto riguarda la carta fedeltà digitale, i punti guadagnati e i premi dipendono da ciascun tabaccheria partner. Il commerciante partner è l\'unico responsabile della registrazione dei clienti, della scansione del codice QR e del controllo dell\'età minima richiesta. Vedi le nostre condizioni generali d\'uso per i dettagli.',
          ],
        },
      ],
    },
    terms: {
      metaTitle: 'Condizioni generali',
      title: 'Condizioni generali d\'uso',
      back: '← Torna alla home',
      updated: 'Ultimo aggiornamento: maggio 2026',
      relatedLabel: 'Documenti correlati',
      sections: [
        {
          title: 'Oggetto',
          paragraphs: [
            'Le presenti condizioni regolano l\'accesso e l\'utilizzo dei servizi offerti da {name} ai commercianti partner.',
            'Utilizzando i nostri servizi, accetti senza riserve le presenti condizioni.',
          ],
        },
        {
          title: 'Servizi offerti',
          paragraphs: [
            '{name} propone una soluzione chiavi in mano con negozio online, carta fedeltà digitale e strumenti di gestione.',
            'Le funzionalità disponibili dipendono dal piano di abbonamento sottoscritto.',
          ],
        },
        {
          title: 'Carta fedeltà',
          paragraphs: [
            'I punti fedeltà ottenuti tramite la carta digitale {name} dipendono dal tabaccheria o commerciante partner presso cui il cliente effettua i suoi acquisti. La scala di attribuzione dei punti, i premi e le relative condizioni sono definiti e applicati da ciascun esercizio partner, sotto la sua esclusiva responsabilità.',
            'L\'iscrizione di un cliente al programma fedeltà e l\'attribuzione dei punti durante la scansione del suo codice QR sono effettuate dal tabaccheria partner, in negozio. Il commerciante è l\'unico responsabile del controllo dell\'idoneità del cliente, in particolare della verifica dell\'età legale minima richiesta per l\'acquisto di prodotti del tabacco, del vape e, se del caso, per la partecipazione al programma fedeltà.',
            'Se un cliente non ha l\'età richiesta per beneficiare del programma o per acquistare i prodotti interessati, la responsabilità spetta esclusivamente al tabaccheria partner, in quanto commerciante che ha registrato il cliente e scansionato il suo codice QR. {name} fornisce lo strumento tecnico di fedeltà ma non interviene nel rapporto commerciale né nei controlli effettuati alla cassa.',
          ],
        },
        {
          title: 'Abbonamento e tariffe',
          paragraphs: [
            'Le tariffe in vigore sono indicate sul sito per le formule mensili e annuali, nonché per le eventuali opzioni una tantum. Possono essere modificate con un preavviso ragionevole.',
            'L\'abbonamento è sottoscritto con durata mensile o annuale, a seconda della formula scelta, e si rinnova tacitamente a scadenza salvo disdetta.',
          ],
        },
        {
          title: 'Obblighi delle parti',
          paragraphs: [
            'Il commerciante si impegna a fornire informazioni corrette e a rispettare la normativa applicabile alla propria attività.',
            '{name} si impegna a mettere in atto i mezzi necessari per garantire disponibilità e sicurezza del servizio.',
          ],
        },
        {
          title: 'Dati personali',
          paragraphs: [
            'Il trattamento dei dati personali è descritto nella nostra informativa sulla privacy.',
            'Ciascuna parte resta responsabile dei dati che tratta nell\'ambito della propria attività.',
          ],
        },
        {
          title: 'Diritto applicabile',
          paragraphs: [
            'Le presenti condizioni sono soggette al diritto applicabile presso la sede di FidTab.',
            'In caso di controversia, le parti cercheranno una soluzione amichevole prima di qualsiasi azione legale.',
          ],
        },
      ],
    },
    privacy: {
      metaTitle: 'Informativa sulla privacy',
      title: 'Informativa sulla privacy',
      back: '← Torna alla home',
      updated: 'Ultimo aggiornamento: maggio 2026',
      relatedLabel: 'Documenti correlati',
      sections: [
        {
          title: 'Titolare del trattamento',
          paragraphs: [
            'FidTab è responsabile del trattamento dei dati raccolti tramite il sito {name} e i moduli associati.',
            'Domande: contact@fidtab.com',
          ],
        },
        {
          title: 'Dati raccolti',
          paragraphs: [
            'Possiamo raccogliere: nome, recapiti (e-mail, telefono), nome del negozio, messaggi inviati tramite i nostri moduli.',
            'Dati tecnici (indirizzo IP, browser) possono essere registrati per sicurezza e statistiche.',
          ],
        },
        {
          title: 'Finalità',
          paragraphs: [
            'Rispondere alle richieste di demo o contatto, gestire il rapporto commerciale e migliorare i nostri servizi.',
            'Non vendiamo i tuoi dati a terzi.',
          ],
        },
        {
          title: 'Programma fedeltà',
          paragraphs: [
            'Nell\'ambito del programma fedeltà, alcuni dati (identificativo cliente, saldo e storico punti) sono trattati dal tabaccheria partner, responsabile della loro raccolta durante la registrazione del cliente e la scansione del codice QR in negozio.',
            'I punti guadagnati e i premi associati dipendono dalle regole fissate da ciascun tabaccheria partner. Il commerciante è l\'unico responsabile del rispetto degli obblighi legali, in particolare della verifica dell\'età del cliente prima dell\'attribuzione dei punti.',
            'Per i dettagli sulle responsabilità applicabili, consulta le nostre condizioni generali d\'uso.',
          ],
        },
        {
          title: 'Periodo di conservazione',
          paragraphs: [
            'I dati sono conservati per il tempo necessario alle finalità per cui sono stati raccolti.',
            'Successivamente vengono cancellati o anonimizzati, salvo obblighi legali di conservazione.',
          ],
        },
        {
          title: 'I tuoi diritti',
          paragraphs: [
            'Hai diritto di accesso, rettifica, cancellazione, limitazione e opposizione al trattamento.',
            'Per esercitare i tuoi diritti, contattaci a contact@fidtab.com.',
          ],
        },
        {
          title: 'Cookie',
          paragraphs: [
            'Il sito può utilizzare cookie tecnici necessari al funzionamento e cookie di misurazione del pubblico.',
            'Puoi configurare il browser per rifiutare i cookie non essenziali.',
          ],
        },
      ],
    },
    contactPage: {
      metaTitle: 'Contatto',
      title: 'Contattaci',
      titleEm: 'subito',
      sub: 'Hai una domanda su {name}? Scrivici o contattaci su WhatsApp — rispondiamo rapidamente.',
      back: '← Torna alla home',
      emailSubject: 'Contatto FidTab',
      methods: {
        email: {
          label: 'Via e-mail',
          desc: 'Inviaci un messaggio — rispondiamo entro un giorno lavorativo.',
          action: 'Apri la mia e-mail',
        },
        whatsapp: {
          label: 'Via WhatsApp',
          desc: 'Chatta direttamente con il nostro team su WhatsApp.',
          action: 'Apri WhatsApp',
        },
      },
    },
    footer: {
      home: 'Home',
      features: 'Funzionalità',
      pricing: 'Prezzi',
      legal: 'Note legali',
      terms: 'Condizioni',
      privacy: 'Privacy',
      contact: 'Contatto',
      copyright: '© {year} {name}. Tutti i diritti riservati.',
    },
  }),

  pt: withShared({
    meta: {
      titleSuffix: 'Digitalize a sua tabacaria',
      description:
        'A solução chave na mão para lançar a sua loja online e fidelizar os seus clientes. Cartão de fidelidade digital, gestão simples, identidade própria.',
    },
    nav: {
      features: 'Funcionalidades',
      loyalty: 'Fidelidade',
      how: 'Como funciona',
      pricing: 'Preços',
      cta: 'Passar à ação',
    },
    hero: {
      eyebrow: 'Solução chave na mão para tabacarias independentes',
      titleLines: ['O seu comércio,', 'no bolso', 'dos seus clientes.'],
      titleGoldIndex: 1,
      sub: 'Loja online personalizada, cartão de fidelidade digital e painel simples — tudo o que precisa para fidelizar e fazer os clientes voltar, sem complicações técnicas.',
      ctaPrimary: 'Lançar a minha tabacaria online',
      ctaSecondary: 'Ver como funciona',
      stats: [
        { num: '+38%', label: 'de clientes recorrentes' },
        { num: '2 sem.', label: 'para estar online' },
        { num: '0 CHF', label: 'de taxas ocultas' },
      ],
      floatReward: { label: 'Recompensa desbloqueada', value: '-5 CHF', sub: 'na sua próxima encomenda' },
      floatOrder: { label: 'Nova encomenda', value: '14,50 CHF', sub: 'há 3 minutos' },
      phoneLoyaltyLabel: 'Cartão de fidelidade',
      phonePointsSuffix: 'pontos',
      phoneNextReward: '120 pts para o próximo vale',
      appStoreName: 'Vaakai Store',
      appOpen: 'Aberto',
      appOrderTitle: 'Encomendar',
      appSeeAll: 'Ver tudo',
      appNextRewardLabel: '-5 CHF em breve',
      appTabHome: 'Início',
      appTabShop: 'Loja',
      appTabLoyalty: 'Fidelidade',
      appTabAccount: 'Conta',
    },
    cardSubs: {
      presse: 'Tabacaria · Imprensa',
      librairie: 'Tabacaria · Livraria',
      epicerie: 'Tabacaria · Mercearia',
      coiffeur: 'Cabeleireiro · Salão',
    },
    cardRewardLabel: 'a {pts} pts',
    logos: {
      label: 'Tabacarias independentes que confiam na {name}',
    },
    features: {
      label: 'Funcionalidades',
      title: 'Tudo o que precisa para',
      titleEm: 'digitalizar a sua tabacaria',
      sub: 'Uma plataforma completa pensada especialmente para tabacarias independentes.',
      comingSoon: 'Em breve',
      items: [
        { icon: '🛍', name: 'Loja online', desc: 'A sua própria loja com o seu nome, logótipo e cores. Os clientes encomendam em poucos cliques, 24 h por dia.' },
        { icon: '💳', name: 'Cartão de fidelidade digital', desc: 'Pontos automáticos em cada compra. Os clientes acumulam, você escolhe as recompensas.' },
        { icon: '📊', name: 'Painel de controlo', desc: 'Acompanhe vendas, clientes mais fiéis e produtos mais vendidos em tempo real a partir do telemóvel.' },
        { icon: '📦', name: 'Click & Collect', desc: 'Os clientes poderão encomendar online e levantar no balcão. Funcionalidade em implementação.' },
        { icon: '🔔', name: 'Notificações push', desc: 'Envie promoções direcionadas diretamente para o telemóvel dos clientes. Resultados imediatos.' },
        { icon: '🗂', name: 'Gestão de stocks', desc: 'Gira o catálogo de produtos facilmente. Adicionar, editar, rutura de stock — tudo em segundos.' },
        { icon: '⚡', name: 'Lançamento rápido', desc: 'A sua loja fica pronta em menos de 2 semanas. Tratamos do design, configuração e formação.' },
      ],
    },
    loyalty: {
      label: 'Cartão de fidelidade',
      title: 'O cartão que faz',
      titleEm: 'os clientes voltar.',
      desc: 'Cada compra rende pontos. Os clientes vêem-nos em tempo real no telemóvel e voltam para desbloquear recompensas. Você define as regras, nós tratamos do resto.',
      points: [
        { title: 'Pontos automáticos', text: 'Pontos atribuídos em cada encomenda, sem ação da sua parte.' },
        { title: 'Recompensas personalizadas', text: 'Vale de desconto, produto oferecido, entrega grátis — você decide.' },
        { title: 'Cartão multi-tabacarias', text: 'Os clientes mantêm o cartão mesmo ao mudar de tabacaria parceira.' },
        { title: 'Notificações inteligentes', text: 'Lembretes automáticos quando um cliente está perto de uma recompensa.' },
      ],
      cta: 'Ativar o cartão de fidelidade',
      pointsLabel: 'pontos',
      cardTypeLabel: 'Cartão de fidelidade',
      cardMemberLabel: 'Titular',
      cardNumberLabel: 'N.º cartão',
      statReturn: 'de taxa de retorno',
      statActive: 'cartões ativos',
    },
    how: {
      label: 'Como funciona',
      title: 'Online em',
      titleEm: '3 passos simples',
      steps: [
        { num: '01', icon: '🎨', title: 'Personalização', desc: 'Criamos a sua loja à sua imagem: logótipo, cores, catálogo de produtos. Você valida, nós aperfeiçoamos.' },
        { num: '02', icon: '🚀', title: 'Lançamento', desc: 'A sua loja fica online. Configuramos o cartão de fidelidade e formamos a sua equipa em 1 hora.' },
        { num: '03', icon: '📈', title: 'Crescimento', desc: 'Os clientes encomendam, acumulam pontos, voltam. Acompanhe tudo a partir do painel de controlo.' },
      ],
    },
    stores: {
      label: 'Multi-tabacarias',
      title: 'Cada tabacaria mantém',
      titleEm: 'a sua própria identidade',
      sub: 'A sua loja, as suas cores, a sua clientela. Nada genérico.',
      loyalClients: 'clientes fiéis',
      orders: 'encomendas',
      online: 'Online',
      visitSite: 'Visitar a loja',
    },
    testimonials: {
      label: 'Parceiros',
      title: 'FidTab',
      titleEm: 'em ação',
      sub: 'A Vaakai Store já está online na plataforma. Eis o que a {name} oferece concretamente a um comércio independente.',
      partnerBadge: 'Parceiro online',
      items: [
        {
          kind: 'partner',
          name: VAAKAI_STORE_PARTNER.name,
          tag: VAAKAI_STORE_PARTNER.tag,
          location: VAAKAI_STORE_PARTNER.location,
          description:
            'Loja online com identidade própria, catálogo de produtos e encomendas geridas numa única plataforma — sem desenvolvimento à medida.',
          url: VAAKAI_STORE_PARTNER.websiteUrl,
          logoUrl: VAAKAI_STORE_PARTNER.logoUrl,
        },
        {
          kind: 'benefit',
          icon: '🎨',
          title: 'Identidade própria',
          text: 'Logótipo, cores e nome do seu comércio. Cada loja tem o seu URL e aspeto, como na vitrine acima.',
        },
        {
          kind: 'benefit',
          icon: '⚡',
          title: 'Lançamento acompanhado',
          text: 'Design, configuração do catálogo e formação: a sua loja fica online em menos de 2 semanas, sem competências técnicas.',
        },
      ],
    },
    pricing: {
      label: 'Preços',
      title: 'Simples,',
      titleEm: 'transparente',
      sub: 'Sem compromisso, sem taxas ocultas. Cancelável a qualquer momento.',
      popular: 'POPULAR',
      billingMonthly: 'Mensal',
      billingAnnual: 'Anual',
      billingSave: '−2 meses',
      perMonth: '/mês',
      perYear: '/ano',
      plans: [
        { plan: 'Starter', price: '49', priceAnnual: '490', desc: 'Para começar e testar a solução.', features: ['Loja online', 'Até 50 produtos', 'Cartão de fidelidade básico', 'Suporte por e-mail'], cta: 'Começar', featured: false },
        { plan: 'Pro', price: '99', priceAnnual: '990', desc: 'A solução completa para fidelizar.', features: ['Loja online ilimitada', 'Produtos ilimitados', 'Cartão de fidelidade avançado', 'Notificações push', 'Painel de analytics', 'Suporte prioritário'], cta: 'Começar', featured: true },
        { plan: 'Multi', price: '149', priceAnnual: '1490', desc: 'Para gerir vários pontos de venda.', features: ['Até 5 lojas', 'Cartão de fidelidade multi-marca', 'Painel centralizado', 'Formação incluída', 'Gestor de conta dedicado'], cta: 'Contactar', featured: false },
      ],
      websiteOption: {
        label: 'Opção à la carte',
        title: 'Criação de um site web personalizado',
        desc: 'Um site à medida da sua marca — logótipo, cores e conteúdos adaptados à sua tabacaria. Em complemento da sua subscrição FidTab.',
        price: '199',
        priceOnce: 'taxa única',
        cta: 'Pedir orçamento',
      },
    },
    cta: {
      title: 'Pronto para digitalizar',
      titleEm: 'a sua tabacaria?',
      sub: 'Junte-se às tabacarias independentes que escolheram a {name} para fidelizar clientes e aumentar o volume de negócios.',
      primary: 'Pedir uma demo gratuita',
      secondary: '📞 Ligue-nos',
      note: 'Demo sem compromisso · Online em 2 semanas · Suporte incluído',
    },
    requestDemo: {
      metaTitle: 'Pedir uma demo',
      title: 'Vamos',
      titleEm: 'à ação',
      sub: 'Diga-nos como contactá-lo — respondemos rapidamente para apresentar a {name} e esclarecer as suas dúvidas.',
      methodLabel: 'Como prefere ser contactado?',
      methods: {
        email: { id: 'email', label: 'Por e-mail', icon: '✉️' },
        phone: { id: 'phone', label: 'Por telefone', icon: '📞' },
        whatsapp: { id: 'whatsapp', label: 'Por WhatsApp', icon: '💬' },
      },
      fields: {
        shop: 'Nome do comércio',
        name: 'O seu nome',
        email: 'Endereço de e-mail',
        phone: 'Número de telefone',
        whatsapp: 'Número WhatsApp',
        emailInvalid: 'Endereço de e-mail inválido.',
        phoneInvalid: 'Número inválido para o país selecionado.',
        message: 'Mensagem',
        optional: 'opcional',
      },
      submit: 'Enviar o meu pedido',
      back: '← Voltar ao início',
      successTitle: 'Pedido enviado',
      successText: 'Obrigado! Entraremos em contacto em breve pelo canal escolhido.',
    },
    legalNotice: {
      metaTitle: 'Aviso legal',
      title: 'Aviso legal',
      back: '← Voltar ao início',
      updated: 'Última atualização: maio de 2026',
      relatedLabel: 'Documentos relacionados',
      sections: [
        {
          title: 'Editor do site',
          paragraphs: [
            'O site {name} é editado pela FidTab, solução de digitalização para comércios de proximidade.',
            'Contacto: contact@fidtab.com',
          ],
        },
        {
          title: 'Alojamento',
          paragraphs: [
            'O site é alojado por um fornecedor cloud conforme aos padrões de segurança em vigor.',
            'Para questões relacionadas com o alojamento, contacte-nos no endereço indicado acima.',
          ],
        },
        {
          title: 'Propriedade intelectual',
          paragraphs: [
            'Todos os elementos do site (textos, imagens, logótipo, estrutura) estão protegidos pelo direito de propriedade intelectual.',
            'Qualquer reprodução ou representação, total ou parcial, sem autorização escrita prévia é proibida.',
          ],
        },
        {
          title: 'Responsabilidade',
          paragraphs: [
            'A FidTab esforça-se por fornecer informações exatas e atualizadas, sem garantir contudo a ausência de erros ou omissões.',
            'O utilizador é o único responsável pelo uso que faz das informações disponíveis no site.',
            'Quanto ao cartão de fidelidade digital, os pontos ganhos e as recompensas dependem de cada tabacaria parceira. O comerciante parceiro é o único responsável pelo registo de clientes, pela leitura do código QR e pela verificação da idade mínima exigida. Consulte os nossos termos de utilização para mais detalhes.',
          ],
        },
      ],
    },
    terms: {
      metaTitle: 'Termos de utilização',
      title: 'Termos e condições de utilização',
      back: '← Voltar ao início',
      updated: 'Última atualização: maio de 2026',
      relatedLabel: 'Documentos relacionados',
      sections: [
        {
          title: 'Objeto',
          paragraphs: [
            'Os presentes termos regem o acesso e a utilização dos serviços oferecidos pela {name} aos comerciantes parceiros.',
            'Ao utilizar os nossos serviços, aceita sem reservas os presentes termos.',
          ],
        },
        {
          title: 'Serviços oferecidos',
          paragraphs: [
            'A {name} propõe uma solução chave na mão com loja online, cartão de fidelidade digital e ferramentas de gestão.',
            'As funcionalidades disponíveis dependem do plano de subscrição contratado.',
          ],
        },
        {
          title: 'Cartão de fidelidade',
          paragraphs: [
            'Os pontos de fidelidade obtidos através do cartão digital {name} dependem da tabacaria ou comerciante parceiro onde o cliente efetua as suas compras. A escala de atribuição de pontos, as recompensas e as respetivas condições são definidas e aplicadas por cada estabelecimento parceiro, sob a sua exclusiva responsabilidade.',
            'O registo de um cliente no programa de fidelidade e a atribuição de pontos durante a leitura do seu código QR são realizados pela tabacaria parceira, no ponto de venda. O comerciante é o único responsável pela verificação da elegibilidade do cliente, nomeadamente da confirmação da idade legal mínima exigida para a compra de produtos de tabaco, de vape e, se aplicável, para a participação no programa de fidelidade.',
            'Se um cliente não tiver a idade exigida para beneficiar do programa ou para comprar os produtos em causa, a responsabilidade cabe exclusivamente à tabacaria parceira, enquanto comerciante que registou o cliente e leu o seu código QR. A {name} fornece a ferramenta técnica de fidelidade, mas não intervém na relação comercial nem nos controlos efetuados no caixa.',
          ],
        },
        {
          title: 'Subscrição e preços',
          paragraphs: [
            'Os preços em vigor são indicados no site para os planos mensais e anuais, bem como para as opções pontuais, se aplicável. Podem ser revistos com um aviso prévio razoável.',
            'A subscrição é contratada por um período mensal ou anual, consoante o plano escolhido, e renova-se tacitamente no fim de cada período, salvo cancelamento.',
          ],
        },
        {
          title: 'Obrigações das partes',
          paragraphs: [
            'O comerciante compromete-se a fornecer informações exatas e a respeitar a regulamentação aplicável à sua atividade.',
            'A {name} compromete-se a implementar os meios necessários para garantir a disponibilidade e a segurança do serviço.',
          ],
        },
        {
          title: 'Dados pessoais',
          paragraphs: [
            'O tratamento de dados pessoais é descrito na nossa política de privacidade.',
            'Cada parte permanece responsável pelos dados que trata no âmbito da sua atividade.',
          ],
        },
        {
          title: 'Direito aplicável',
          paragraphs: [
            'Os presentes termos estão sujeitos ao direito aplicável na sede da FidTab.',
            'Em caso de litígio, as partes procurarão uma solução amigável antes de qualquer ação judicial.',
          ],
        },
      ],
    },
    privacy: {
      metaTitle: 'Política de privacidade',
      title: 'Política de privacidade',
      back: '← Voltar ao início',
      updated: 'Última atualização: maio de 2026',
      relatedLabel: 'Documentos relacionados',
      sections: [
        {
          title: 'Responsável pelo tratamento',
          paragraphs: [
            'A FidTab é responsável pelo tratamento dos dados recolhidos através do site {name} e dos formulários associados.',
            'Questões: contact@fidtab.com',
          ],
        },
        {
          title: 'Dados recolhidos',
          paragraphs: [
            'Podemos recolher: nome, contactos (e-mail, telefone), nome do comércio, mensagens enviadas através dos nossos formulários.',
            'Dados técnicos (endereço IP, navegador) podem ser registados para fins de segurança e estatísticas.',
          ],
        },
        {
          title: 'Finalidades',
          paragraphs: [
            'Responder aos seus pedidos de demo ou contacto, gerir a relação comercial e melhorar os nossos serviços.',
            'Não vendemos os seus dados a terceiros.',
          ],
        },
        {
          title: 'Programa de fidelidade',
          paragraphs: [
            'No âmbito do programa de fidelidade, alguns dados (identificador do cliente, saldo e histórico de pontos) são tratados pela tabacaria parceira, responsável pela sua recolha durante o registo do cliente e a leitura do código QR na loja.',
            'Os pontos ganhos e as recompensas associadas dependem das regras fixadas por cada tabacaria parceira. O comerciante é o único responsável pelo cumprimento das obrigações legais, nomeadamente pela verificação da idade do cliente antes da atribuição de pontos.',
            'Para mais detalhes sobre as responsabilidades aplicáveis, consulte os nossos termos de utilização.',
          ],
        },
        {
          title: 'Período de conservação',
          paragraphs: [
            'Os dados são conservados durante o tempo necessário às finalidades para as quais foram recolhidos.',
            'Depois disso, são eliminados ou anonimizados, salvo obrigação legal de conservação.',
          ],
        },
        {
          title: 'Os seus direitos',
          paragraphs: [
            'Tem direito de acesso, retificação, eliminação, limitação e oposição ao tratamento.',
            'Para exercer os seus direitos, contacte-nos em contact@fidtab.com.',
          ],
        },
        {
          title: 'Cookies',
          paragraphs: [
            'O site pode utilizar cookies técnicos necessários ao funcionamento e cookies de medição de audiência.',
            'Pode configurar o navegador para recusar cookies não essenciais.',
          ],
        },
      ],
    },
    contactPage: {
      metaTitle: 'Contacto',
      title: 'Entre em',
      titleEm: 'contacto',
      sub: 'Tem uma questão sobre a {name}? Escreva-nos ou contacte-nos no WhatsApp — respondemos rapidamente.',
      back: '← Voltar ao início',
      emailSubject: 'Contacto FidTab',
      methods: {
        email: {
          label: 'Por e-mail',
          desc: 'Envie-nos uma mensagem — respondemos no prazo de um dia útil.',
          action: 'Abrir o meu e-mail',
        },
        whatsapp: {
          label: 'Por WhatsApp',
          desc: 'Converse diretamente com a nossa equipa no WhatsApp.',
          action: 'Abrir WhatsApp',
        },
      },
    },
    footer: {
      home: 'Início',
      features: 'Funcionalidades',
      pricing: 'Preços',
      legal: 'Aviso legal',
      terms: 'Termos',
      privacy: 'Privacidade',
      contact: 'Contacto',
      copyright: '© {year} {name}. Todos os direitos reservados.',
    },
  }),

  es: withShared(esContent),
  nl: withShared(nlContent),
  ru: withShared(ruContent),
  hi: withShared(hiContent),
  zh: withShared(zhContent),
  ja: withShared(jaContent),
  ln: withShared(lnContent),
  ar: withShared(arContent),
}

export function interpolate(text, vars = {}) {
  if (typeof text !== 'string') return text
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    text
  )
}
