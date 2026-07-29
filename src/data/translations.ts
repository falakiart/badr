import { Language } from '../types';

export interface TranslationDictionary {
  // Header & Navigation
  freeDeliveryBanner: string;
  freeDeliveryTag: string;
  orderBtn: string;
  orderCod: string;
  selectLanguage: string;
  
  // Hero Product Section
  productTitle: string;
  productSubtitle: string;
  specialOffer: string;
  originalPrice: string;
  saveToday: string;
  discountTimer: string;
  stockClaimed: string;
  choosePackage: string;
  buyNowPayCod: string;
  freeShippingBadge: string;
  inStock: string;
  fastShippingNote: string;
  
  // Bundle Titles & Badges
  bundle1Title: string;
  bundle1Subtitle: string;
  bundle2Title: string;
  bundle2Subtitle: string;
  bundle2Badge: string;
  bundle3Title: string;
  bundle3Subtitle: string;
  bundle3Badge: string;
  
  // Benefits
  benefitsTitle: string;
  b1Title: string;
  b1Desc: string;
  b2Title: string;
  b2Desc: string;
  b3Title: string;
  b3Desc: string;
  b4Title: string;
  b4Desc: string;

  // Order Form
  expressOrderTitle: string;
  expressOrderSubtitle: string;
  fullName: string;
  fullNamePlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  city: string;
  selectCity: string;
  address: string;
  addressPlaceholder: string;
  notes: string;
  notesPlaceholder: string;
  confirmOrderBtn: string;
  submitting: string;
  codGuarantee: string;
  satisfactionGuarantee: string;
  requiredFields: string;
  selectedPackage: string;

  // Success Modal
  orderSuccessTitle: string;
  orderSuccessSubtitle: string;
  orderNumber: string;
  customerDetails: string;
  closeModal: string;
  totalToPay: string;

  // Ingredients
  ingredientTitle: string;
  cactusTitle: string;
  cactusRole: string;
  cactusDesc: string;
  aloeTitle: string;
  aloeRole: string;
  aloeDesc: string;

  // Before/After
  beforeAfterTitle: string;
  beforeAfterSubtitle: string;
  beforeLabel: string;
  afterLabel: string;

  // How to use
  howToUseTitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;

  // Comparison
  comparisonTitle: string;
  us: string;
  others: string;
  oils: string;
  feature1: string;
  feature2: string;
  feature3: string;
  feature4: string;
  feature5: string;

  // Reviews
  reviewsTitle: string;
  writeReview: string;
  submitReview: string;
  verifiedPurchase: string;
  yourName: string;
  yourComment: string;

  // FAQ
  faqTitle: string;
  faq1Q: string;
  faq1A: string;
  faq2Q: string;
  faq2A: string;
  faq3Q: string;
  faq3A: string;
  faq4Q: string;
  faq4A: string;

  // Footer & Sticky Bar
  copyright: string;
  secureDelivery: string;
  stickyOrderNow: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  AR: {
    // Header
    freeDeliveryBanner: "توصيل مجاني والدفع عند الاستلام في جميع أنحاء المغرب 🚚",
    freeDeliveryTag: "توصيل مجاني",
    orderBtn: "اطلب الآن",
    orderCod: "الدفع عند الاستلام",
    selectLanguage: "اللغة:",

    // Hero Product
    productTitle: "موس الشعر بالصبار وزيت التين الشوكي – بدون غسل",
    productSubtitle: "رغوة خفيفة ومغذية لترطيب الشعر والقضاء على الهيشان وتغذية الأطراف",
    specialOffer: "عرض خاص لفترة محدودة",
    originalPrice: "السعر الأصلي",
    saveToday: "وفر اليوم",
    discountTimer: "ينتهي الخصم المؤقت خلال:",
    stockClaimed: "86% من المخزون اليومي تم طلبه",
    choosePackage: "اختر العرض المناسب لك:",
    buyNowPayCod: "اطلب الآن - الدفع عند الاستلام",
    freeShippingBadge: "توصيل مجاني متضمن",
    inStock: "متوفر في المخزون (14 قطعة متبقية)",
    fastShippingNote: "توصيل سريع خلال 24-48 ساعة والدفع عند الاستلام",

    // Bundles
    bundle1Title: "علبة واحدة (تجربة)",
    bundle1Subtitle: "عبوة قياسية 150 مل",
    bundle2Title: "علبتان (عرض الثنائي)",
    bundle2Subtitle: "العرض الأكثر طلباً",
    bundle2Badge: "🔥 الأكثر مبيعاً - توفير 45%",
    bundle3Title: "3 علب (اشترِ 2 واحصل على 1 مجاناً)",
    bundle3Subtitle: "أفضل قيمة للعناية بالشعر",
    bundle3Badge: "🎁 اشترِ 2 واحصل على 1 مجاناً (توفير 55%)",

    // Benefits
    benefitsTitle: "مميزات موس الشعر المذهلة",
    b1Title: "ترطيب وتغذية عميقة",
    b1Desc: "يخترق ألياف الشعر ليعيد إليها المرونة والحيوية من الجذور حتى الأطراف.",
    b2Title: "غني بـ زيت التين الشوكي والألوفيرا",
    b2Desc: "مزيج فريد من زيت التين الشوكي الطبيعي وجل الألوفيرا النقي.",
    b3Title: "القضاء على الهيشان والجفاف",
    b3Desc: "يتحكم بالشعيرات المتطايرة ويرطب الشعر المجعد والكيرلي طوال اليوم.",
    b4Title: "نعومة فائقة بدون ملمس دهني",
    b4Desc: "لا يترك أي بقايا خفيفة أو ملمس لزج، يعطي ملمساً حريرياً وطبيعياً.",

    // Order Form
    expressOrderTitle: "استمارة الطلب المباشر – الدفع عند الاستلام",
    expressOrderSubtitle: "أدخل معلوماتك أدناه وسنتصل بك لتأكيد الطلب والتوصيل إلى باب منزلك!",
    fullName: "الاسم الكامل",
    fullNamePlaceholder: "أدخل اسمك الكامل هنا",
    phone: "رقم الهاتف",
    phonePlaceholder: "06XXXXXXXX",
    city: "المدينة",
    selectCity: "اختر مدينتك",
    address: "العنوان الكامل للتوصيل",
    addressPlaceholder: "الحي، الشارع، رقم الدار...",
    notes: "ملاحظات إضافية (اختياري)",
    notesPlaceholder: "أي تعليمات خاصة للتوصيل...",
    confirmOrderBtn: "تأكيد الطلب الآن",
    submitting: "جاري تسجيل الطلب...",
    codGuarantee: "الدفع عند الاستلام + معاينة المنتج عند التسليم",
    satisfactionGuarantee: "ضمان الجودة والرضا 100%",
    requiredFields: "يرجى ملء جميع الحقول المطلوبة",
    selectedPackage: "الباقة المختارة:",

    // Success Modal
    orderSuccessTitle: "تم تسجيل طلبك بنجاح! 🎉",
    orderSuccessSubtitle: "شكراً لثقتك بنا. سيتصل بك فريقنا في أقرب وقت لتأكيد التوصيل.",
    orderNumber: "رقم الطلب",
    customerDetails: "معلومات العميل والطلب",
    closeModal: "متابعة التصفح",
    totalToPay: "المبلغ الإجمالي عند الاستلام",

    // Ingredients
    ingredientTitle: "سر الفعالية: مكونات طبيعية 100%",
    cactusTitle: "زيت التين الشوكي المغربي",
    cactusRole: "ترطيب عميق وحماية من الحرارة",
    cactusDesc: "غني بـ فيتامين E وأحماض أوميغا التي تعيد بناء ألياف الشعر وتغذيه بعمق.",
    aloeTitle: "جل الألوفيرا النقي",
    aloeRole: "ترطيب مكثف ومنع الهيشان",
    aloeDesc: "يرطب الفروة والأطراف بفعالية ويحبس الرطوبة لمنع التقصف والهيشان.",

    // Before/After
    beforeAfterTitle: "نتائج حقيقية لزبنائنا",
    beforeAfterSubtitle: "اسحب الشريط لمشاهدة الفرق المذهل قبل وبعد استعمال موس الشعر",
    beforeLabel: "قبل الاستعمال",
    afterLabel: "بعد الاستعمال",

    // How to use
    howToUseTitle: "طريقة الاستعمال البسيطة",
    step1Title: "رج العبوة جيداً",
    step1Desc: "قم برج العبوة قبل الاستخدام لمزج المكونات الطبيعية والزيوت المغذية.",
    step2Title: "ضغط 2 إلى 4 ضغطات",
    step2Desc: "ضع كمية مناسبة من الرغوة الخفيفة على راحة يدك.",
    step3Title: "التوزيع على الشعر",
    step3Desc: "وزع الرغوة بالتساوي على الشعر المبلل أو الجاف من المنتصف حتى الأطراف.",
    step4Title: "تصفيف بدون غسل",
    step4Desc: "صففي شعرك كالمعتاد وجمالك جاهز طوال اليوم دون الحاجة لغسل الشعر!",

    // Comparison
    comparisonTitle: "لماذا موس الشعر الخاص بنا هو الأفضل؟",
    us: "منتجنا (Vola Mousse)",
    others: "الموس التقليدي",
    oils: "الزيوت العادية",
    feature1: "تركيبة خفيفة بدون غسل",
    feature2: "بدون ملمس دهني أو لزج",
    feature3: "زيت التين الشوكي و ألوفيرا طبيعي",
    feature4: "محاربة الهيشان والتقصف",
    feature5: "مناسب لجميع أنواع الشعر",

    // Reviews
    reviewsTitle: "آراء وتقييمات الزبناء",
    writeReview: "إضافة تقييمك",
    submitReview: "إرسال التقييم",
    verifiedPurchase: "مشتري مؤكد",
    yourName: "اسمك الكامل",
    yourComment: "تعليقك وتجربتك...",

    // FAQ
    faqTitle: "الأسئلة الشائعة",
    faq1Q: "هل يناسب هذا الموس جميع أنواع الشعر؟",
    faq1A: "نعم! تم تصميم تركيبتنا الخفيفة لsuit كل أنواع الشعر (الكيرلي، الناعم، المصبوغ، والمجعد) دون إثقاله.",
    faq2Q: "هل يحتاج إلى غسل الشعر بعد الاستعمال؟",
    faq2A: "لا، هذا موس بدون غسل (Leave-In)، يمكنك وضعه على شعر رطب أو جاف والخروج مباشرة!",
    faq3Q: "كم تدوم مدة التوصيل؟",
    faq3A: "التوصيل سريع ويستغرق من 24 إلى 48 ساعة فقط والدفع يكون نقداً عند استلام الطلب.",
    faq4Q: "هل المنتج طبيعي وآمن؟",
    faq4A: "بالتأكيد، يحتوي على زيت التين الشوكي الخالص وجل الألوفيرا الطبيعي الخالي من المواد الكيميائية الضارة.",

    // Footer & Sticky Bar
    copyright: "جميع الحقوق محفوظة © Vola.ma 2026",
    secureDelivery: "توصيل سريع وآمن والدفع عند الاستلام بالمغرب",
    stickyOrderNow: "اطلب الآن - الدفع عند الاستلام 🚚"
  },

  FR: {
    // Header
    freeDeliveryBanner: "Livraison gratuite & Paiement à la livraison partout au Maroc 🚚",
    freeDeliveryTag: "Livraison Gratuite",
    orderBtn: "Commander",
    orderCod: "Paiement à la livraison",
    selectLanguage: "Langue :",

    // Hero Product
    productTitle: "Mousse Capillaire Sans Rincage – Huile de Figue de Barbarie & Aloe Vera",
    productSubtitle: "Soin mousse ultra-léger pour cheveux hydratés, doux et sans frisottis",
    specialOffer: "Offre Spéciale Limitée",
    originalPrice: "Prix Initial",
    saveToday: "Économisez",
    discountTimer: "La promotion se termine dans :",
    stockClaimed: "86% du stock journalier a été réservé",
    choosePackage: "Choisissez votre pack idéal :",
    buyNowPayCod: "COMMANDER - PAIEMENT À LA LIVRAISON",
    freeShippingBadge: "Livraison Gratuite Incluse",
    inStock: "En Stock (14 unités restantes)",
    fastShippingNote: "Livraison rapide sous 24-48h avec paiement à la livraison",

    // Bundles
    bundle1Title: "1 Flacon (Pack Découverte)",
    bundle1Subtitle: "Flacon Standard 150ml",
    bundle2Title: "2 Flacons (Pack Duo)",
    bundle2Subtitle: "Le choix le plus populaire",
    bundle2Badge: "🔥 MEILLEURE VENTE - ÉCONOMISEZ 45%",
    bundle3Title: "3 Flacons (2 ACHETÉS + 1 OFFERT)",
    bundle3Subtitle: "Meilleure offre soin cheveux",
    bundle3Badge: "🎁 2 ACHETÉS + 1 OFFERT (ÉCONOMISEZ 55%)",

    // Benefits
    benefitsTitle: "Avantages Exceptionnels de Notre Mousse",
    b1Title: "Hydratation & Nutrition Profonde",
    b1Desc: "Pénètre au cœur de la fibre capillaire pour restaurer souplesse et brillance.",
    b2Title: "Enrichi en Figue de Barbarie & Aloe Vera",
    b2Desc: "Alliance naturelle d'huile de figue de barbarie et de gel d'aloe vera pur.",
    b3Title: "Anti-Frisottis Instantané",
    b3Desc: "Discipline les mèches rebelles et protège contre l'humidité jusqu'à 48h.",
    b4Title: "Douceur Sans Effet Gras",
    b4Desc: "Sans résidu collant ni effet carton. Laisse vos cheveux légers et soyeux.",

    // Order Form
    expressOrderTitle: "FORMULAIRE DE COMMANDE – PAIEMENT À LA LIVRAISON",
    expressOrderSubtitle: "Remplissez vos coordonnées ci-dessous. Vous ne payez qu'à la réception de votre colis !",
    fullName: "Nom Complet",
    fullNamePlaceholder: "Entrez votre nom complet",
    phone: "Numéro de Téléphone",
    phonePlaceholder: "06XXXXXXXX",
    city: "Ville de Livraison",
    selectCity: "Sélectionnez votre ville",
    address: "Adresse Complète",
    addressPlaceholder: "Quartier, rue, numéro de maison...",
    notes: "Instructions spéciales (Optionnel)",
    notesPlaceholder: "Remarques pour le livreur...",
    confirmOrderBtn: "CONFIRMER MA COMMANDE",
    submitting: "Validation en cours...",
    codGuarantee: "Paiement à la livraison + Vérification à la réception",
    satisfactionGuarantee: "Garantie Qualité & Satisfaction 100%",
    requiredFields: "Veuillez remplir tous les champs obligatoires",
    selectedPackage: "Pack Sélectionné :",

    // Success Modal
    orderSuccessTitle: "Commande Reçue avec Succès ! 🎉",
    orderSuccessSubtitle: "Merci pour votre confiance. Notre équipe vous contactera sous peu pour confirmer l'expédition.",
    orderNumber: "Numéro de Commande",
    customerDetails: "Détails de la Commande",
    closeModal: "Fermer & Continuer",
    totalToPay: "Total à payer à la livraison",

    // Ingredients
    ingredientTitle: "Ingrédients 100% Naturels & Puissants",
    cactusTitle: "Huile de Figue de Barbarie du Maroc",
    cactusRole: "Hydratation Profonde & Thermoprotection",
    cactusDesc: "Riche en vitamine E et acides gras essentiels pour régénérer la fibre capillaire.",
    aloeTitle: "Gel d'Aloe Vera Pur",
    aloeRole: "Hydratation Intense & Anti-Frisottis",
    aloeDesc: "Hydrate intensément le cuir chevelu et les longueurs sans alourdir.",

    // Before/After
    beforeAfterTitle: "Résultats Réels de Nos Clientes",
    beforeAfterSubtitle: "Glissez le curseur pour voir la transformation spectaculaire avant/après",
    beforeLabel: "Avant",
    afterLabel: "Après",

    // How to use
    howToUseTitle: "Conseils d'Utilisation Simples",
    step1Title: "Bien Secouer",
    step1Desc: "Agitez le flacon avant utilisation pour mélanger les actifs naturels.",
    step2Title: "2 à 4 Pressions",
    step2Desc: "Déposez une noisette de mousse légère au creux de votre main.",
    step3Title: "Appliquer sur Longueurs",
    step3Desc: "Répartissez uniformément sur cheveux humides ou secs.",
    step4Title: "Coiffer Sans Rincer",
    step4Desc: "Coiffez à votre convenance. Pas besoin de rincer !",

    // Comparison
    comparisonTitle: "Pourquoi Notre Mousse Est Supérieure ?",
    us: "Notre Mousse Vola",
    others: "Mousse Classique",
    oils: "Huiles Ordinaires",
    feature1: "Formule légère sans rinçage",
    feature2: "Sans résidu gras ni collant",
    feature3: "Huile de figue de barbarie & aloe vera",
    feature4: "Anti-frisottis & anti-fourches",
    feature5: "Convient à tous types de cheveux",

    // Reviews
    reviewsTitle: "Avis & Témoignages Clients",
    writeReview: "Laisser un Avis",
    submitReview: "Envoyer mon Avis",
    verifiedPurchase: "Achat Vérifié",
    yourName: "Votre Nom Complet",
    yourComment: "Votre commentaire...",

    // FAQ
    faqTitle: "Foire Aux Questions",
    faq1Q: "Est-ce adapté à tous les types de cheveux ?",
    faq1A: "Oui ! Notre formule légère convient à tous les types de cheveux (bouclés, lisses, crépus, colorés) sans les alourdir.",
    faq2Q: "Faut-il rincer les cheveux après application ?",
    faq2A: "Non, c'est un soin sans rinçage (Leave-In). Appliquez sur cheveux humides ou secs et profitez !",
    faq3Q: "Quel est le délai de livraison ?",
    faq3A: "La livraison est très rapide (24 à 48 heures) et le paiement s'effectue en espèces à la livraison.",
    faq4Q: "Le produit est-il naturel et sûr ?",
    faq4A: "Absolument, formulé à base d'huile de figue de barbarie pure et de gel d'aloe vera naturel sans produits chimiques agressifs.",

    // Footer & Sticky Bar
    copyright: "Tous droits réservés © Vola.ma 2026",
    secureDelivery: "Livraison rapide & sécurisée avec paiement à la livraison au Maroc",
    stickyOrderNow: "COMMANDER - PAIEMENT À LA LIVRAISON 🚚"
  },

  EN: {
    // Header
    freeDeliveryBanner: "Free Delivery & Cash on Delivery Everywhere in Morocco 🚚",
    freeDeliveryTag: "Free Shipping",
    orderBtn: "Order Now",
    orderCod: "Cash on Delivery",
    selectLanguage: "Language:",

    // Hero Product
    productTitle: "Leave-In Hair Mousse – Cactus Oil & Aloe Vera",
    productSubtitle: "Nourishing, Lightweight No-Rinse Foam for Frizz-Free, Soft Hair",
    specialOffer: "Limited Time Offer",
    originalPrice: "Original Price",
    saveToday: "You Save",
    discountTimer: "Flash Offer Ends In:",
    stockClaimed: "86% of today's stock claimed",
    choosePackage: "Select Your Preferred Bundle:",
    buyNowPayCod: "ORDER NOW – CASH ON DELIVERY",
    freeShippingBadge: "Free Delivery Included",
    inStock: "In Stock (14 bottles remaining)",
    fastShippingNote: "Fast 24-48h dispatch with Cash on Delivery",

    // Bundles
    bundle1Title: "1 Bottle (Try & Test)",
    bundle1Subtitle: "Standard 150ml Pack",
    bundle2Title: "2 Bottles (Duo Pack)",
    bundle2Subtitle: "Most Popular Choice",
    bundle2Badge: "🔥 BEST SELLER - SAVE 45%",
    bundle3Title: "3 Bottles (BUY 2 GET 1 FREE)",
    bundle3Subtitle: "Ultimate Hair Care Value",
    bundle3Badge: "🎁 BUY 2 GET 1 FREE (SAVE 55%)",

    // Benefits
    benefitsTitle: "Key Product Benefits",
    b1Title: "Deep Hydration & Nourishment",
    b1Desc: "Restores elasticity, shine, and moisture balance from roots to tips.",
    b2Title: "Enriched with Prickly Pear & Aloe Vera",
    b2Desc: "A potent blend of organic cactus oil and pure botanical aloe gel.",
    b3Title: "Frizz & Flyaway Control",
    b3Desc: "Instantly tames stubborn frizz and locks out humidity all day long.",
    b4Title: "Softness Without Residue",
    b4Desc: "Zero sticky feel or crunch. Leaves hair touchably soft and weightless.",

    // Order Form
    expressOrderTitle: "EXPRESS ORDER FORM – CASH ON DELIVERY",
    expressOrderSubtitle: "Fill out your details below. Pay in cash only when your order arrives at your door!",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    phone: "Phone Number",
    phonePlaceholder: "06XXXXXXXX",
    city: "Delivery City",
    selectCity: "Select your city",
    address: "Full Delivery Address",
    addressPlaceholder: "Street, neighborhood, house number...",
    notes: "Special Notes (Optional)",
    notesPlaceholder: "Any instructions for the delivery driver...",
    confirmOrderBtn: "CONFIRM MY ORDER",
    submitting: "Processing order...",
    codGuarantee: "Cash on Delivery + Inspect Before Paying",
    satisfactionGuarantee: "100% Quality & Satisfaction Guarantee",
    requiredFields: "Please fill in all required fields",
    selectedPackage: "Selected Package:",

    // Success Modal
    orderSuccessTitle: "Order Received Successfully! 🎉",
    orderSuccessSubtitle: "Thank you for shopping with us! Our team will call you shortly to confirm delivery.",
    orderNumber: "Order ID",
    customerDetails: "Customer Information",
    closeModal: "Close & Continue Shopping",
    totalToPay: "Total Amount Due on Delivery",

    // Ingredients
    ingredientTitle: "100% Natural Key Ingredients",
    cactusTitle: "Moroccan Prickly Pear Cactus Oil",
    cactusRole: "Deep Moisture & Heat Protection",
    cactusDesc: "Packed with Vitamin E and essential fatty acids to nourish and restore hair.",
    aloeTitle: "Pure Organic Aloe Vera Gel",
    aloeRole: "Weightless Hydration & Frizz Control",
    aloeDesc: "Provides weightless hydration and locks moisture deep into hair strands.",

    // Before/After
    beforeAfterTitle: "Real Customer Transformations",
    beforeAfterSubtitle: "Drag the slider to view the incredible before and after transformation",
    beforeLabel: "Before",
    afterLabel: "After",

    // How to use
    howToUseTitle: "Simple How to Use Guide",
    step1Title: "Shake Well",
    step1Desc: "Shake the bottle well before dispensing to activate active botanical oils.",
    step2Title: "Pump 2-4 Times",
    step2Desc: "Dispense a palm-sized amount of silky micro-foam.",
    step3Title: "Apply to Lengths",
    step3Desc: "Distribute evenly through damp or dry hair focus on mid-lengths to ends.",
    step4Title: "Style & Go (No Rinse)",
    step4Desc: "Style as desired! No rinsing needed.",

    // Comparison
    comparisonTitle: "Why Our Mousse Stands Out",
    us: "Our Vola Mousse",
    others: "Traditional Mousses",
    oils: "Standard Hair Oils",
    feature1: "Lightweight no-rinse formula",
    feature2: "Zero greasy or sticky residue",
    feature3: "Organic cactus oil & aloe vera",
    feature4: "Anti-frizz & split-end control",
    feature5: "Suitable for all hair types",

    // Reviews
    reviewsTitle: "Customer Reviews & Ratings",
    writeReview: "Write a Review",
    submitReview: "Submit Review",
    verifiedPurchase: "Verified Buyer",
    yourName: "Your Full Name",
    yourComment: "Your review & experience...",

    // FAQ
    faqTitle: "Frequently Asked Questions",
    faq1Q: "Is this suitable for all hair types?",
    faq1A: "Yes! Our lightweight formula works on all hair types (curly, straight, coily, color-treated) without weighing it down.",
    faq2Q: "Do I need to rinse my hair after applying?",
    faq2A: "No, this is a Leave-In formula. Simply apply to damp or dry hair and style as usual!",
    faq3Q: "How long does shipping take?",
    faq3A: "Dispatch is fast! Delivery takes 24 to 48 hours anywhere in Morocco, payable on delivery.",
    faq4Q: "Is the product safe and natural?",
    faq4A: "Yes, formulated with pure Moroccan cactus oil and natural aloe vera gel with no harsh chemicals.",

    // Footer & Sticky Bar
    copyright: "All Rights Reserved © Vola.ma 2026",
    secureDelivery: "Fast & Secure Cash on Delivery in Morocco",
    stickyOrderNow: "ORDER NOW – CASH ON DELIVERY 🚚"
  }
};

export function getTranslation(lang?: string): TranslationDictionary {
  if (lang === 'FR') return translations.FR;
  if (lang === 'EN') return translations.EN;
  return translations.AR;
}
