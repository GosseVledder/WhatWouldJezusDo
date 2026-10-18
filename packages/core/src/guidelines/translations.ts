import type { BibleSource, JesusGuideline } from './types';

export const SUPPORTED_LANGUAGES = ['nl', 'en', 'de', 'fr', 'es', 'it', 'pt'] as const;
export type SupportedLang = (typeof SUPPORTED_LANGUAGES)[number];

export function normalizeLang(lang: string | undefined): SupportedLang {
  const base = (lang ?? 'nl').toLowerCase().split('-')[0] ?? 'nl';
  if ((SUPPORTED_LANGUAGES as readonly string[]).includes(base)) {
    return base as SupportedLang;
  }
  return lang ? 'en' : 'nl';
}

const BOOK_NAMES: Record<Exclude<SupportedLang, 'nl'>, Record<string, string>> = {
  en: {
    Exodus: 'Exodus',
    Matteüs: 'Matthew',
    Marcus: 'Mark',
    Lucas: 'Luke',
    Johannes: 'John',
  },
  de: {
    Exodus: '2. Mose',
    Matteüs: 'Matthäus',
    Marcus: 'Markus',
    Lucas: 'Lukas',
    Johannes: 'Johannes',
  },
  fr: {
    Exodus: 'Exode',
    Matteüs: 'Matthieu',
    Marcus: 'Marc',
    Lucas: 'Luc',
    Johannes: 'Jean',
  },
  es: {
    Exodus: 'Éxodo',
    Matteüs: 'Mateo',
    Marcus: 'Marcos',
    Lucas: 'Lucas',
    Johannes: 'Juan',
  },
  it: {
    Exodus: 'Esodo',
    Matteüs: 'Matteo',
    Marcus: 'Marco',
    Lucas: 'Luca',
    Johannes: 'Giovanni',
  },
  pt: {
    Exodus: 'Êxodo',
    Matteüs: 'Mateus',
    Marcus: 'Marcos',
    Lucas: 'Lucas',
    Johannes: 'João',
  },
};

/** Standard BibleGateway translation version per language. */
export const BIBLE_VERSIONS: Record<Exclude<SupportedLang, 'nl'>, string> = {
  en: 'NIV',
  de: 'HOF',
  fr: 'BDS',
  es: 'NVI',
  it: 'NR2006',
  pt: 'NVI-PT',
};

export function localizeBibleReference(nlReference: string, lang: SupportedLang): string {
  if (lang === 'nl') return nlReference;
  const map = BOOK_NAMES[lang];
  for (const [nlBook, translatedBook] of Object.entries(map)) {
    if (nlReference.startsWith(nlBook + ' ')) {
      return translatedBook + nlReference.slice(nlBook.length);
    }
  }
  return nlReference;
}

export function buildBibleUrl(
  nlReference: string,
  nlUrl: string,
  lang: SupportedLang,
): string {
  if (lang === 'nl') return nlUrl;
  const localizedRef = localizeBibleReference(nlReference, lang);
  const version = BIBLE_VERSIONS[lang];
  const params = new URLSearchParams({
    search: localizedRef,
    version,
  });
  return `https://www.biblegateway.com/passage/?${params.toString()}`;
}

export const GUIDELINE_TITLES: Record<
  Exclude<SupportedLang, 'nl'>,
  Record<string, string>
> = {
  en: {
    'cmd-01-no-other-gods': 'No other gods (Love God and the good above all)',
    'cmd-02-no-idols': 'No idols (Purity of faith, do not abuse religion)',
    'cmd-03-gods-name-oaths': "Do not misuse God's name & Integrity of promises (Let your 'yes' be 'yes')",
    'cmd-04-sabbath-mercy': 'Honor the Sabbath / Humanity and mercy above rigid rules',
    'cmd-05-honor-parents': 'Honor your father and mother (Care for parents and vulnerable family bonds)',
    'cmd-06-do-not-kill': 'You shall not murder (Nor with anger, hate speech, or warmongering)',
    'cmd-07-no-adultery': 'You shall not commit adultery (Relational faithfulness, purity of intention)',
    'cmd-08-do-not-steal': 'You shall not steal (Justice, fairness, and restitution)',
    'cmd-09-truthfulness': 'You shall not bear false witness (Do not lie or contradict yourself)',
    'cmd-10-do-not-covet': 'You shall not covet (Freedom from greed, envy, and expansionism)',
    'nt-01-love-neighbor': 'Love your neighbor as yourself (Including the stranger and outsider)',
    'nt-02-golden-rule': 'The Golden Rule (Treat others as you want to be treated)',
    'nt-03-love-enemies': 'Love your enemies and pray for those who persecute you',
    'nt-04-turn-other-cheek': 'Turn the other cheek (Non-violence and de-escalation)',
    'nt-05-peacemakers': 'Blessed are the peacemakers (Active peace and reconciliation)',
    'nt-06-forgiveness': 'Forgiveness (Forgive seventy times seven)',
    'nt-07-do-not-judge': 'Do not judge (First take the plank out of your own eye)',
    'nt-08-care-for-poor': 'Care for the poor, hungry, and oppressed',
    'nt-09-reject-hypocrisy': 'Rejection of hypocrisy (Words and deeds must match)',
    'nt-10-humility-service': 'Humility and servant leadership',
    'nt-11-meekness-mercy': 'Meekness and mercy',
    'nt-12-power-of-words': 'Accountability for every spoken word',
    'nt-13-faithful-stewardship': 'Faithful stewardship and trustworthiness in small things',
    'nt-14-hunger-righteousness': 'Hunger and thirst for righteousness',
    'nt-15-protect-children-vulnerable': 'Protection of children and the vulnerable',
  },
  de: {
    'cmd-01-no-other-gods': 'Keine anderen Götter (Gott und das Gute über alles lieben)',
    'cmd-02-no-idols': 'Keine Götzenbilder (Reinheit des Glaubens, Religion nicht missbrauchen)',
    'cmd-03-gods-name-oaths': 'Gottes Namen nicht missbrauchen & Ehrlichkeit der Versprechen (Euer Ja sei ein Ja)',
    'cmd-04-sabbath-mercy': 'Ehre den Ruhetag / Menschlichkeit und Barmherzigkeit über starre Regeln',
    'cmd-05-honor-parents': 'Ehre Vater und Mutter (Fürsorge für Eltern und schutzbedürftige Familienbande)',
    'cmd-06-do-not-kill': 'Du sollst nicht töten (Auch nicht mit Zorn, Hassrede oder Kriegstreiberei)',
    'cmd-07-no-adultery': 'Du sollst nicht ehebrechen (Treue in Beziehungen, Reinheit der Absicht)',
    'cmd-08-do-not-steal': 'Du sollst nicht stehlen (Gerechtigkeit, niemanden übervorteilen und Wiedergutmachung)',
    'cmd-09-truthfulness': 'Du sollst kein falsches Zeugnis reden (Nicht lügen und sich nicht selbst widersprechen)',
    'cmd-10-do-not-covet': 'Du sollst nicht begehren (Frei von Habgier, Neid und Expansionsdrang)',
    'nt-01-love-neighbor': 'Liebe deinen Nächsten wie dich selbst (Einschließlich Fremder und Außenseiter)',
    'nt-02-golden-rule': 'Die Goldene Regel (Behandle andere so, wie du selbst behandelt werden möchtest)',
    'nt-03-love-enemies': 'Liebt eure Feinde und betet für die, die euch verfolgen',
    'nt-04-turn-other-cheek': 'Halte auch die andere Wange hin (Gewaltlosigkeit und Deeskalation)',
    'nt-05-peacemakers': 'Selig sind die Friedensstifter (Aktiver Frieden und Versöhnung)',
    'nt-06-forgiveness': 'Vergebungsbereitschaft (Siebzigmal siebenmal vergeben)',
    'nt-07-do-not-judge': 'Richtet nicht (Zieh zuerst den Balken aus deinem eigenen Auge)',
    'nt-08-care-for-poor': 'Fürsorge für Arme, Hungrige und Unterdrückte',
    'nt-09-reject-hypocrisy': 'Ablehnung von Heuchelei (Worte und Taten müssen übereinstimmen)',
    'nt-10-humility-service': 'Demut und dienende Führung',
    'nt-11-meekness-mercy': 'Sanftmut und Barmherzigkeit',
    'nt-12-power-of-words': 'Verantwortung für jedes gesprochene Wort',
    'nt-13-faithful-stewardship': 'Gute Haushalterschaft und Treue im Kleinen',
    'nt-14-hunger-righteousness': 'Hungern und dürsten nach Gerechtigkeit',
    'nt-15-protect-children-vulnerable': 'Schutz von Kindern und Wehrlosen',
  },
  fr: {
    'cmd-01-no-other-gods': "Pas d'autres dieux (Aimer Dieu et le bien par-dessus tout)",
    'cmd-02-no-idols': "Pas d'idoles (Pureté de la foi, ne pas instrumentaliser la religion)",
    'cmd-03-gods-name-oaths': 'Ne pas abuser du nom de Dieu & Sincérité des promesses (Que votre oui soit oui)',
    'cmd-04-sabbath-mercy': 'Honorer le jour du repos / Humanité et miséricorde avant les règles rigides',
    'cmd-05-honor-parents': 'Honore ton père et ta mère (Soin des parents et des liens familiaux)',
    'cmd-06-do-not-kill': 'Tu ne commettras pas de meurtre (Ni par la colère, les discours de haine ou le bellicisme)',
    'cmd-07-no-adultery': "Tu ne commettras pas d'adultère (Fidélité relationnelle et pureté d'intention)",
    'cmd-08-do-not-steal': 'Tu ne voleras pas (Justice, équité et réparation)',
    'cmd-09-truthfulness': 'Tu ne porteras pas de faux témoignage (Ne pas mentir ni se contredire)',
    'cmd-10-do-not-covet': 'Tu ne convoiteras pas (Libre de cupidité, de jalousie et d’expansionnisme)',
    'nt-01-love-neighbor': "Aime ton prochain comme toi-même (Y compris l'étranger et l'exclu)",
    'nt-02-golden-rule': "La Règle d'Or (Traitez les autres comme vous voudriez être traités)",
    'nt-03-love-enemies': 'Aimez vos ennemis et priez pour ceux qui vous persécutent',
    'nt-04-turn-other-cheek': "Tendre l'autre joue (Non-violence et désescalade)",
    'nt-05-peacemakers': 'Heureux les artisans de paix (Paix active et réconciliation)',
    'nt-06-forgiveness': 'Le pardon (Pardonner soixante-dix fois sept fois)',
    'nt-07-do-not-judge': "Ne jugez pas (Ôte d'abord la poutre de ton propre œil)",
    'nt-08-care-for-poor': 'Prendre soin des pauvres, des affamés et des opprimés',
    'nt-09-reject-hypocrisy': "Rejet de l'hypocrisie (Les paroles et les actes doivent concorder)",
    'nt-10-humility-service': 'Humilité et leadership serviteur',
    'nt-11-meekness-mercy': 'Douceur et miséricorde',
    'nt-12-power-of-words': 'Responsabilité de chaque parole prononcée',
    'nt-13-faithful-stewardship': 'Bonne intendance et fidélité dans les petites choses',
    'nt-14-hunger-righteousness': 'Avoir faim et soif de justice',
    'nt-15-protect-children-vulnerable': 'Protection des enfants et des personnes vulnérables',
  },
  es: {
    'cmd-01-no-other-gods': 'No tendrás otros dioses (Amar a Dios y el bien sobre todas las cosas)',
    'cmd-02-no-idols': 'No harás ídolos (Pureza de la fe, no abusar de la religión)',
    'cmd-03-gods-name-oaths': 'No tomar el nombre de Dios en vano y honestidad en las promesas (Que su sí sea sí)',
    'cmd-04-sabbath-mercy': 'Honrar el día de reposo / Humanidad y misericordia por encima de reglas rígidas',
    'cmd-05-honor-parents': 'Honra a tu padre y a tu madre (Cuidado de los padres y mayores)',
    'cmd-06-do-not-kill': 'No matarás (Tampoco con ira, discurso de odio o belicismo)',
    'cmd-07-no-adultery': 'No cometerás adulterio (Fidelidad relacional y pureza de intención)',
    'cmd-08-do-not-steal': 'No robarás (Justicia, equidad y restitución)',
    'cmd-09-truthfulness': 'No darás falso testimonio (No mentir ni contradecirse a sí mismo)',
    'cmd-10-do-not-covet': 'No codiciarás (Libre de avaricia, envidia y afán expansionista)',
    'nt-01-love-neighbor': 'Ama a tu prójimo como a ti mismo (Incluido el extranjero y el marginado)',
    'nt-02-golden-rule': 'La Regla de Oro (Trata a los demás como quieres que te traten a ti)',
    'nt-03-love-enemies': 'Amen a sus enemigos y oren por quienes los persiguen',
    'nt-04-turn-other-cheek': 'Poner la otra mejilla (No violencia y desescalada)',
    'nt-05-peacemakers': 'Dichosos los que trabajan por la paz (Paz activa y reconciliación)',
    'nt-06-forgiveness': 'El perdón (Perdonar setenta veces siete)',
    'nt-07-do-not-judge': 'No juzguen (Saca primero la viga de tu propio ojo)',
    'nt-08-care-for-poor': 'Cuidado de los pobres, hambrientos y oprimidos',
    'nt-09-reject-hypocrisy': 'Rechazo de la hipocresía (Las palabras y los hechos deben coincidir)',
    'nt-10-humility-service': 'Humildad y liderazgo de servicio',
    'nt-11-meekness-mercy': 'Mansedumbre y misericordia',
    'nt-12-power-of-words': 'Responsabilidad por cada palabra pronunciada',
    'nt-13-faithful-stewardship': 'Buena mayordomía y fidelidad en lo poco',
    'nt-14-hunger-righteousness': 'Hambre y sed de justicia',
    'nt-15-protect-children-vulnerable': 'Protección de los niños y los vulnerables',
  },
  it: {
    'cmd-01-no-other-gods': 'Non avere altri dèi (Amare Dio e il bene sopra ogni cosa)',
    'cmd-02-no-idols': 'Non farti idoli (Purezza della fede, non strumentalizzare la religione)',
    'cmd-03-gods-name-oaths': 'Non abusare del nome di Dio e sincerità delle promesse (Il vostro sì sia sì)',
    'cmd-04-sabbath-mercy': 'Onora il giorno di riposo / Umanità e misericordia sopra le regole rigide',
    'cmd-05-honor-parents': 'Onora tuo padre e tua madre (Cura dei genitori e degli anziani)',
    'cmd-06-do-not-kill': "Non uccidere (Neppure con l'ira, l'incitamento all'odio o il bellicismo)",
    'cmd-07-no-adultery': 'Non commettere adulterio (Fedeltà nelle relazioni e purezza di intenzione)',
    'cmd-08-do-not-steal': 'Non rubare (Giustizia, equità e riparazione)',
    'cmd-09-truthfulness': 'Non dire falsa testimonianza (Non mentire né contraddirsi)',
    'cmd-10-do-not-covet': 'Non desiderare ciò che appartiene ad altri (Libero da avidità e invidia)',
    'nt-01-love-neighbor': 'Ama il tuo prossimo come te stesso (Incluso lo straniero e chi è ai margini)',
    'nt-02-golden-rule': "La Regola d'Oro (Tratta gli altri come vorresti essere trattato)",
    'nt-03-love-enemies': 'Amate i vostri nemici e pregate per quelli che vi perseguitano',
    'nt-04-turn-other-cheek': "Porgi l'altra guancia (Non violenza e de-escalation)",
    'nt-05-peacemakers': 'Beati gli operatori di pace (Pace attiva e riconciliazione)',
    'nt-06-forgiveness': 'Il perdono (Perdonare settanta volte sette)',
    'nt-07-do-not-judge': 'Non giudicate (Togli prima la trave dal tuo occhio)',
    'nt-08-care-for-poor': 'Cura dei poveri, degli affamati e degli oppressi',
    'nt-09-reject-hypocrisy': "Rifiuto dell'ipocrisia (Le parole e i fatti devono corrispondere)",
    'nt-10-humility-service': 'Umiltà e leadership di servizio',
    'nt-11-meekness-mercy': 'Mitezza e misericordia',
    'nt-12-power-of-words': 'Responsabilità per ogni parola pronunciata',
    'nt-13-faithful-stewardship': 'Buona amministrazione e fedeltà nelle piccole cose',
    'nt-14-hunger-righteousness': 'Fame e sete di giustizia',
    'nt-15-protect-children-vulnerable': 'Protezione dei bambini e dei più deboli',
  },
  pt: {
    'cmd-01-no-other-gods': 'Não terás outros deuses (Amar a Deus e o bem acima de tudo)',
    'cmd-02-no-idols': 'Não farás ídolos (Pureza da fé, não abusar da religião)',
    'cmd-03-gods-name-oaths': 'Não tomar o nome de Deus em vão e honestidade nas promessas (Seja o vosso sim, sim)',
    'cmd-04-sabbath-mercy': 'Honrar o dia de descanso / Humanidade e misericórdia acima de regras rígidas',
    'cmd-05-honor-parents': 'Honra teu pai e tua mãe (Cuidado com os pais e idosos)',
    'cmd-06-do-not-kill': 'Não matarás (Nem com ira, discurso de ódio ou belicismo)',
    'cmd-07-no-adultery': 'Não adulterarás (Fidelidade relacional e pureza de intenção)',
    'cmd-08-do-not-steal': 'Não furtarás (Justiça, equidade e restituição)',
    'cmd-09-truthfulness': 'Não dirás falso testemunho (Não mentir nem se contradizer)',
    'cmd-10-do-not-covet': 'Não cobiçarás (Livre de ganância, inveja e expansionismo)',
    'nt-01-love-neighbor': 'Ama o teu próximo como a ti mesmo (Incluindo o estrangeiro e o excluído)',
    'nt-02-golden-rule': 'A Regra de Ouro (Trate os outros como gostaria de ser tratado)',
    'nt-03-love-enemies': 'Amem os seus inimigos e orem por aqueles que os perseguem',
    'nt-04-turn-other-cheek': 'Dar a outra face (Não violência e desescalada)',
    'nt-05-peacemakers': 'Bem-aventurados os pacificadores (Paz ativa e reconciliação)',
    'nt-06-forgiveness': 'O perdão (Perdoar setenta vezes sete)',
    'nt-07-do-not-judge': 'Não julguem (Tire primeiro a trave do seu próprio olho)',
    'nt-08-care-for-poor': 'Cuidado com os pobres, famintos e oprimidos',
    'nt-09-reject-hypocrisy': 'Rejeição da hipocrisia (Palavras e obras devem coincidir)',
    'nt-10-humility-service': 'Humildade e liderança servidora',
    'nt-11-meekness-mercy': 'Mansidão e misericórdia',
    'nt-12-power-of-words': 'Responsabilidade por cada palavra proferida',
    'nt-13-faithful-stewardship': 'Boa mordomia e fidelidade no pouco',
    'nt-14-hunger-righteousness': 'Fome e sede de justiça',
    'nt-15-protect-children-vulnerable': 'Proteção das crianças e dos vulneráveis',
  },
};

export const BIBLE_QUOTES: Record<Exclude<SupportedLang, 'nl'>, Record<string, string>> = {
  en: {
    'Exodus 20:2-3': 'I am the LORD your God. You shall have no other gods before me.',
    'Matteüs 22:37-38':
      'Love the Lord your God with all your heart and with all your soul and with all your mind. This is the first and greatest commandment.',
    'Matteüs 6:24': 'No one can serve two masters. You cannot serve both God and money.',
    'Lucas 4:8': 'It is written: "Worship the Lord your God and serve him only."',
    'Exodus 20:4-6': 'You shall not make for yourself an image in the form of anything in heaven above.',
    'Johannes 4:23-24':
      'True worshipers will worship the Father in the Spirit and in truth, for they are the kind of worshipers the Father seeks.',
    'Matteüs 21:12-13':
      'It is written, "My house will be called a house of prayer," but you are making it "a den of robbers."',
    'Exodus 20:7': 'You shall not misuse the name of the LORD your God.',
    'Matteüs 5:33-37':
      'All you need to say is simply "Yes" or "No"; anything beyond this comes from the evil one.',
    'Matteüs 7:21':
      'Not everyone who says to me, "Lord, Lord," will enter the kingdom of heaven, but only the one who does the will of my Father.',
    'Exodus 20:8-11': 'Remember the Sabbath day by keeping it holy.',
    'Marcus 2:27-28':
      'The Sabbath was made for man, not man for the Sabbath. So the Son of Man is Lord even of the Sabbath.',
    'Matteüs 12:11-12':
      'If any of you has a sheep and it falls into a pit on the Sabbath, will you not take hold of it and lift it out? How much more valuable is a person than a sheep!',
    'Exodus 20:12': 'Honor your father and your mother.',
    'Marcus 7:9-13':
      'You have a fine way of setting aside the commands of God in order to observe your own traditions!... Thus you nullify the word of God.',
    'Johannes 19:26-27':
      'When Jesus saw his mother there, he said to her, "Woman, here is your son," and to the disciple, "Here is your mother."',
    'Exodus 20:13': 'You shall not murder.',
    'Matteüs 5:21-22':
      'You have heard that it was said, "You shall not murder." But I tell you that anyone who is angry with a brother or sister will be subject to judgment.',
    'Matteüs 26:52':
      'Put your sword back in its place, for all who draw the sword will die by the sword.',
    'Lucas 9:54-56':
      'They asked, "Lord, do you want us to call fire down from heaven to destroy them?" But Jesus turned and rebuked them.',
    'Exodus 20:14': 'You shall not commit adultery.',
    'Matteüs 5:27-28':
      'You have heard that it was said, "You shall not commit adultery." But I tell you that anyone who looks at a woman lustfully has already committed adultery with her in his heart.',
    'Matteüs 19:4-6': 'Therefore what God has joined together, let no one separate.',
    'Exodus 20:15': 'You shall not steal.',
    'Marcus 10:19': 'You know the commandments: Do not steal, do not defraud...',
    'Lucas 19:8-9':
      'Zacchaeus said, "Look, Lord! Here and now I give half of my possessions to the poor, and if I have cheated anybody out of anything, I will pay back four times the amount."',
    'Johannes 10:10':
      'The thief comes only to steal and kill and destroy; I have come that they may have life, and have it to the full.',
    'Exodus 20:16': 'You shall not give false testimony against your neighbor.',
    'Matteüs 5:37':
      'All you need to say is simply "Yes" or "No"; anything beyond this comes from the evil one.',
    'Johannes 8:44':
      'When he lies, he speaks his native language, for he is a liar and the father of lies.',
    'Johannes 14:6': 'Jesus answered, "I am the way and the truth and the life."',
    'Matteüs 15:18-19':
      'Out of the heart come evil thoughts—murder, adultery, sexual immorality, theft, false testimony, slander.',
    'Exodus 20:17':
      "You shall not covet your neighbor's house... or anything that belongs to your neighbor.",
    'Lucas 12:15':
      'Watch out! Be on your guard against all kinds of greed; life does not consist in an abundance of possessions.',
    'Matteüs 6:19-21':
      'Do not store up for yourselves treasures on earth... For where your treasure is, there your heart will be also.',
    'Matteüs 22:39-40':
      'And the second is like it: "Love your neighbor as yourself." All the Law and the Prophets hang on these two commandments.',
    'Lucas 10:27-37':
      'Which of these three do you think was a neighbor to the man?... Jesus told him, "Go and do likewise."',
    'Johannes 13:34-35':
      'A new command I give you: Love one another. As I have loved you, so you must love one another.',
    'Matteüs 7:12':
      'So in everything, do to others what you would have them do to you, for this sums up the Law and the Prophets.',
    'Lucas 6:31': 'Do to others as you would have them do to you.',
    'Matteüs 5:43-45':
      'But I tell you, love your enemies and pray for those who persecute you, that you may be children of your Father in heaven.',
    'Lucas 6:27-28':
      'Love your enemies, do good to those who hate you, bless those who curse you, pray for those who mistreat you.',
    'Lucas 23:34': 'Jesus said, "Father, forgive them, for they do not know what they are doing."',
    'Matteüs 5:38-39':
      'You have heard that it was said, "Eye for eye, and tooth for tooth." But I tell you, do not resist an evil person. If anyone slaps you on the right cheek, turn to them the other cheek also.',
    'Lucas 6:29-30': 'If someone slaps you on one cheek, turn to them the other also.',
    'Johannes 18:36':
      'My kingdom is not of this world. If it were, my servants would fight to prevent my arrest.',
    'Matteüs 5:9': 'Blessed are the peacemakers, for they will be called children of God.',
    'Marcus 9:50': 'Be at peace with each other.',
    'Johannes 14:27':
      'Peace I leave with you; my peace I give you. I do not give to you as the world gives.',
    'Matteüs 18:21-22':
      'Peter asked, "Lord, how many times shall I forgive my brother or sister who sins against me? Up to seven times?" Jesus answered, "I tell you, not seven times, but seventy-seven times."',
    'Matteüs 6:14-15':
      'For if you forgive other people when they sin against you, your heavenly Father will also forgive you. But if you do not forgive others their sins, your Father will not forgive your sins.',
    'Lucas 17:3-4':
      'If your brother or sister sins against you, rebuke them; and if they repent, forgive them.',
    'Matteüs 7:1-5':
      'Do not judge, or you too will be judged... Why do you look at the speck of sawdust in your brother’s eye and pay no attention to the plank in your own eye?',
    'Johannes 8:7': 'Let any one of you who is without sin be the first to throw a stone at her.',
    'Lucas 6:37':
      'Do not judge, and you will not be judged. Do not condemn, and you will not be condemned. Forgive, and you will be forgiven.',
    'Matteüs 25:35-40':
      'For I was hungry and you gave me something to eat... Truly I tell you, whatever you did for one of the least of these brothers and sisters of mine, you did for me.',
    'Lucas 14:13-14':
      'When you give a banquet, invite the poor, the crippled, the lame, the blind, and you will be blessed.',
    'Lucas 4:18':
      'The Spirit of the Lord is on me, because he has anointed me to proclaim good news to the poor.',
    'Matteüs 23:3':
      'So you must be careful to do everything they tell you. But do not do what they do, for they do not practice what they preach.',
    'Matteüs 7:16-20':
      'By their fruit you will recognize them... Every good tree bears good fruit, but a bad tree bears bad fruit.',
    'Lucas 12:1': 'Be on your guard against the yeast of the Pharisees, which is hypocrisy.',
    'Marcus 10:42-45':
      'Whoever wants to become great among you must be your servant... For even the Son of Man did not come to be served, but to serve.',
    'Lucas 14:11':
      'For all those who exalt themselves will be humbled, and those who humble themselves will be exalted.',
    'Johannes 13:14-15':
      'Now that I, your Lord and Teacher, have washed your feet, you also should wash one another’s feet. I have set you an example.',
    'Matteüs 5:5': 'Blessed are the meek, for they will inherit the earth.',
    'Matteüs 5:7': 'Blessed are the merciful, for they will be shown mercy.',
    'Lucas 6:36': 'Be merciful, just as your Father is merciful.',
    'Matteüs 12:34-37':
      'For the mouth speaks what the heart is full of... Everyone will have to give account on the day of judgment for every empty word they have spoken.',
    'Matteüs 15:11':
      'What goes into someone’s mouth does not defile them, but what comes out of their mouth, that is what defiles them.',
    'Lucas 16:10':
      'Whoever can be trusted with very little can also be trusted with much, and whoever is dishonest with very little will also be dishonest with much.',
    'Matteüs 25:21':
      'Well done, good and faithful servant! You have been faithful with a few things; I will put you in charge of many things.',
    'Lucas 12:48':
      'From everyone who has been given much, much will be demanded; and from the one who has been entrusted with much, much more will be asked.',
    'Matteüs 5:6': 'Blessed are those who hunger and thirst for righteousness, for they will be filled.',
    'Matteüs 23:23':
      'Woe to you... You give a tenth of your spices, but you have neglected the more important matters of the law—justice, mercy and faithfulness.',
    'Johannes 7:24': 'Stop judging by mere appearances, evaluation must be right and just.',
    'Matteüs 18:5-6':
      'And whoever welcomes one such child in my name welcomes me. If anyone causes one of these little ones—those who believe in me—to stumble, it would be better for them to have a large millstone hung around their neck.',
    'Matteüs 19:14':
      'Let the little children come to me, and do not hinder them, for the kingdom of heaven belongs to such as these.',
    'Marcus 9:36-37':
      'He took a little child whom he placed among them. Taking the child in his arms, he said to them, "Whoever welcomes one of these little children in my name welcomes me."',
  },
  de: {
    'Exodus 20:2-3': 'Ich bin der HERR, dein Gott. Du sollst keine anderen Götter haben neben mir.',
    'Matteüs 22:37-38':
      'Du sollst den Herrn, deinen Gott, lieben von ganzem Herzen, von ganzer Seele und von ganzem Gemüt. Dies ist das höchste und größte Gebot.',
    'Matteüs 6:24': 'Niemand kann zwei Herren dienen. Ihr könnt nicht Gott dienen und dem Mammon.',
    'Lucas 4:8': 'Es steht geschrieben: „Du sollst den Herrn, deinen Gott, anbeten und ihm allein dienen.“',
    'Exodus 20:4-6': 'Du sollst dir kein Bildnis noch irgendein Gleichnis machen.',
    'Johannes 4:23-24':
      'Die wahren Anbeter werden den Vater anbeten im Geist und in der Wahrheit; denn auch der Vater will solche Anbeter haben.',
    'Matteüs 21:12-13':
      'Es steht geschrieben: „Mein Haus soll ein Bethaus heißen“; ihr aber macht eine Räuberhöhle daraus!',
    'Exodus 20:7': 'Du sollst den Namen des HERRN, deines Gottes, nicht missbrauchen.',
    'Matteüs 5:33-37':
      'Eure Rede aber sei: Ja, ja; nein, nein. Was darüber ist, das ist vom Übel.',
    'Matteüs 7:21':
      'Nicht jeder, der zu mir sagt: „Herr, Herr!“, wird in das Himmelreich kommen, sondern wer den Willen meines Vaters im Himmel tut.',
    'Exodus 20:8-11': 'Gedenke des Sabbattages, dass du ihn heiligst.',
    'Marcus 2:27-28':
      'Der Sabbat ist um des Menschen willen gemacht und nicht der Mensch um des Sabbats willen.',
    'Matteüs 12:11-12':
      'Welcher Mensch ist unter euch, der ein Schaf hat, und wenn es am Sabbat in eine Grube fällt, der es nicht ergreift und herauszieht? Wie viel mehr ist nun ein Mensch wert als ein Schaf!',
    'Exodus 20:12': 'Du sollst deinen Vater und deine Mutter ehren.',
    'Marcus 7:9-13':
      'Trefflich hebt ihr das Gebot Gottes auf, damit ihr eure Überlieferung haltet!... Und so hebt ihr Gottes Wort auf.',
    'Johannes 19:26-27':
      'Als nun Jesus seine Mutter sah, spricht er zu seiner Mutter: „Frau, siehe, das ist dein Sohn!“ Danach spricht er zu dem Jünger: „Siehe, das ist deine Mutter!“',
    'Exodus 20:13': 'Du sollst nicht töten.',
    'Matteüs 5:21-22':
      'Ihr habt gehört, dass gesagt ist: „Du sollst nicht töten.“ Ich aber sage euch: Wer mit seinem Bruder zürnt, der ist des Gerichts schuldig.',
    'Matteüs 26:52':
      'Stecke dein Schwert an seinen Ort! Denn wer das Schwert nimmt, der wird durchs Schwert umkommen.',
    'Lucas 9:54-56':
      'Sie sprachen: „Herr, willst du, so wollen wir sagen, dass Feuer vom Himmel falle und sie verzehre.“ Jesus aber wandte sich um und wies sie zurecht.',
    'Exodus 20:14': 'Du sollst nicht ehebrechen.',
    'Matteüs 5:27-28':
      'Ihr habt gehört, dass gesagt ist: „Du sollst nicht ehebrechen.“ Ich aber sage euch: Wer eine Frau ansieht, sie zu begehren, der hat schon mit ihr die Ehe gebrochen in seinem Herzen.',
    'Matteüs 19:4-6': 'Was nun Gott zusammengefügt hat, das soll der Mensch nicht scheiden.',
    'Exodus 20:15': 'Du sollst nicht stehlen.',
    'Marcus 10:19': 'Du kennst die Gebote: Du sollst nicht stehlen, du sollst niemanden berauben...',
    'Lucas 19:8-9':
      'Zachäus sprach: „Siehe, Herr, die Hälfte meiner Güter gebe ich den Armen, und wenn ich jemanden betrogen habe, so gebe ich es vierfach zurück.“',
    'Johannes 10:10':
      'Ein Dieb kommt nur, um zu stehlen, zu schlachten und umzubringen; ich bin gekommen, damit sie das Leben und volle Genüge haben sollen.',
    'Exodus 20:16': 'Du sollst kein falsches Zeugnis reden wider deinen Nächsten.',
    'Matteüs 5:37':
      'Eure Rede aber sei: Ja, ja; nein, nein. Was darüber ist, das ist vom Übel.',
    'Johannes 8:44':
      'Wenn er die Lüge redet, so redet er aus dem Eigenen; denn er ist ein Lügner und der Vater der Lüge.',
    'Johannes 14:6': 'Jesus spricht: „Ich bin der Weg und die Wahrheit und das Leben.“',
    'Matteüs 15:18-19':
      'Aus dem Herzen kommen böse Gedanken, Mord, Ehebruch, Unzucht, Diebstahl, falsches Zeugnis, Lästerung.',
    'Exodus 20:17': 'Du sollst nicht begehren deines Nächsten Haus... noch alles, was dein Nächster hat.',
    'Lucas 12:15':
      'Seht zu und hütet euch vor aller Habgier; denn niemand lebt davon, dass er viele Güter hat.',
    'Matteüs 6:19-21':
      'Sammelt euch nicht Schätze auf Erden... Denn wo dein Schatz ist, da wird auch dein Herz sein.',
    'Matteüs 22:39-40':
      'Das andere aber ist dem gleich: „Du sollst deinen Nächsten lieben wie dich selbst.“ In diesen zwei Geboten hängt das ganze Gesetz und die Propheten.',
    'Lucas 10:27-37':
      'Wer von diesen dreien, meinst du, ist der Nächste gewesen dem, der unter die Räuber gefallen war?... Da sprach Jesus: „So geh hin und tu desgleichen!“',
    'Johannes 13:34-35':
      'Ein neues Gebot gebe ich euch, dass ihr euch untereinander liebt, wie ich euch geliebt habe.',
    'Matteüs 7:12':
      'Alles nun, was ihr wollt, dass euch die Leute tun sollen, das tut ihr ihnen auch! Das ist das Gesetz und die Propheten.',
    'Lucas 6:31': 'Und wie ihr wollt, dass euch die Leute tun sollen, so tut ihnen auch!',
    'Matteüs 5:43-45':
      'Ich aber sage euch: Liebt eure Feinde und bittet für die, die euch verfolgen, damit ihr Kinder seid eures Vaters im Himmel.',
    'Lucas 6:27-28':
      'Liebt eure Feinde; tut wohl denen, die euch hassen; segnet, die euch verfluchen; bittet für die, die euch beleidigen.',
    'Lucas 23:34': 'Jesus aber sprach: „Vater, vergib ihnen; denn sie wissen nicht, was sie tun!“',
    'Matteüs 5:38-39':
      'Ihr habt gehört, dass gesagt ist: „Auge um Auge, Zahn um Zahn.“ Ich aber sage euch, dass ihr nicht widerstreben sollt dem Übel, sondern: wenn dich jemand auf deine rechte Backe schlägt, dem biete die andere auch dar.',
    'Lucas 6:29-30': 'Und wer dich auf die eine Backe schlägt, dem biete die andere auch dar.',
    'Johannes 18:36':
      'Mein Reich ist nicht von dieser Welt. Wäre mein Reich von dieser Welt, meine Diener würden darum kämpfen.',
    'Matteüs 5:9': 'Selig sind die Friedfertigen; denn sie werden Gottes Kinder heißen.',
    'Marcus 9:50': 'Habt Frieden untereinander!',
    'Johannes 14:27':
      'Frieden lasse ich euch, meinen Frieden gebe ich euch. Nicht gebe ich euch, wie die Welt gibt.',
    'Matteüs 18:21-22':
      'Petrus sprach: „Herr, wie oft muss ich denn meinem Bruder, der an mir sündigt, vergeben? Ist’s genug siebenmal?“ Jesus sprach zu ihm: „Ich sage dir: nicht siebenmal, sondern siebzigmal siebenmal.“',
    'Matteüs 6:14-15':
      'Denn wenn ihr den Menschen ihre Verfehlungen vergebt, so wird euch euer himmlischer Vater auch vergeben. Wenn ihr aber den Menschen nicht vergebt, so wird euch euer Vater eure Verfehlungen auch nicht vergeben.',
    'Lucas 17:3-4':
      'Wenn dein Bruder sündigt, so weise ihn zurecht; und wenn es ihn reut, so vergib ihm.',
    'Matteüs 7:1-5':
      'Richtet nicht, damit ihr nicht gerichtet werdet!... Was siehst du aber den Splitter in deines Bruders Auge und nimmst nicht wahr den Balken in deinem Auge?',
    'Johannes 8:7': 'Wer unter euch ohne Sünde ist, der werfe den ersten Stein auf sie.',
    'Lucas 6:37':
      'Richtet nicht, so werdet ihr auch nicht gerichtet. Verdammt nicht, so werdet ihr nicht verdammt. Vergebt, so wird euch vergeben.',
    'Matteüs 25:35-40':
      'Denn ich bin hungrig gewesen und ihr habt mir zu essen gegeben... Wahrlich, ich sage euch: Was ihr getan habt einem von diesen meinen geringsten Brüdern, das habt ihr mir getan.',
    'Lucas 14:13-14':
      'Wenn du ein Mahl machst, so lade die Armen, die Krüppel, die Lahmen und die Blinden ein, dann wirst du selig sein.',
    'Lucas 4:18':
      'Der Geist des Herrn ist auf mir, weil er mich gesalbt hat, zu verkündigen das Evangelium den Armen.',
    'Matteüs 23:3':
      'Alles nun, was sie euch sagen, das tut und haltet; aber nach ihren Werken sollt ihr nicht tun; denn sie sagen’s wohl, und tun’s nicht.',
    'Matteüs 7:16-20':
      'An ihren Früchten sollt ihr sie erkennen... So bringt jeder gute Baum gute Früchte; aber ein fauler Baum bringt schlechte Früchte.',
    'Lucas 12:1': 'Hütet euch vor dem Sauerteig der Pharisäer, das ist die Heuchelei.',
    'Marcus 10:42-45':
      'Wer groß sein will unter euch, der soll euer Diener sein... Denn auch der Menschensohn ist nicht gekommen, dass er sich dienen lasse, sondern dass er diene.',
    'Lucas 14:11':
      'Denn wer sich selbst erhöht, der wird erniedrigt werden; und wer sich selbst erniedrigt, der wird erhöht werden.',
    'Johannes 13:14-15':
      'Wenn nun ich, euer Herr und Meister, euch die Füße gewaschen habe, so sollt auch ihr euch untereinander die Füße waschen. Ein Beispiel habe ich euch gegeben.',
    'Matteüs 5:5': 'Selig sind die Sanftmütigen; denn sie werden das Erdreich besitzen.',
    'Matteüs 5:7': 'Selig sind die Barmherzigen; denn sie werden Barmherzigkeit erlangen.',
    'Lucas 6:36': 'Seid barmherzig, wie auch euer Vater barmherzig ist.',
    'Matteüs 12:34-37':
      'Wes das Herz voll ist, des geht der Mund über... Ich sage euch aber, dass die Menschen Rechenschaft geben müssen am Tage des Gerichts von jedem nichtsnutzigen Wort, das sie geredet haben.',
    'Matteüs 15:11':
      'Nicht was zum Mund eingeht, macht den Menschen unrein; sondern was zum Mund ausgeht, das macht den Menschen unrein.',
    'Lucas 16:10':
      'Wer im Geringsten treu ist, der ist auch im Großen treu; und wer im Geringsten ungerecht ist, der ist auch im Großen ungerecht.',
    'Matteüs 25:21':
      'Recht so, du tüchtiger und treuer Knecht, du bist über wenigem treu gewesen, ich will dich über viel setzen.',
    'Lucas 12:48':
      'Wem viel gegeben ist, bei dem wird man viel suchen; und wem viel anvertraut ist, von dem wird man umso mehr fordern.',
    'Matteüs 5:6': 'Selig sind, die da hungert und dürstet nach der Gerechtigkeit; denn sie sollen satt werden.',
    'Matteüs 23:23':
      'Wehe euch... Ihr gebt den Zehnten von Minze, Dill und Kümmel und lasst das Wichtigste im Gesetz beiseite, nämlich das Recht, die Barmherzigkeit und den Glauben.',
    'Johannes 7:24': 'Richtet nicht nach dem Augenschein, sondern fällt ein gerechtes Urteil.',
    'Matteüs 18:5-6':
      'Wer ein solches Kind aufnimmt in meinem Namen, der nimmt mich auf. Wer aber einen dieser Kleinen, die an mich glauben, zum Abfall verführt, für den wäre es besser, dass ein Mühlstein an seinen Hals gehängt würde.',
    'Matteüs 19:14':
      'Lasst die Kinder und wehrt ihnen nicht, zu mir zu kommen; denn solchen gehört das Himmelreich.',
    'Marcus 9:36-37':
      'Und er nahm ein Kind, stellte es mitten unter sie, herzte es und sprach zu ihnen: „Wer ein solches Kind in meinem Namen aufnimmt, der nimmt mich auf.“',
  },
  fr: {
    'Exodus 20:2-3': "Je suis l'Éternel, ton Dieu. Tu n'auras pas d'autres dieux devant ma face.",
    'Matteüs 22:37-38':
      "Tu aimeras le Seigneur, ton Dieu, de tout ton cœur, de toute ton âme et de toute ta pensée. C'est le premier et le plus grand commandement.",
    'Matteüs 6:24': 'Nul ne peut servir deux maîtres. Vous ne pouvez servir Dieu et Mammon.',
    'Lucas 4:8': 'Il est écrit : « Tu adoreras le Seigneur, ton Dieu, et tu le serviras lui seul. »',
    'Exodus 20:4-6': "Tu ne te feras point d'image taillée, ni de représentation quelconque.",
    'Johannes 4:23-24':
      'Les vrais adorateurs adoreront le Père en esprit et en vérité ; car ce sont là les adorateurs que le Père demande.',
    'Matteüs 21:12-13':
      "Il est écrit : « Ma maison sera appelée une maison de prière », mais vous, vous en faites une caverne de voleurs !",
    'Exodus 20:7': "Tu ne prendras point le nom de l'Éternel, ton Dieu, en vain.",
    'Matteüs 5:33-37':
      'Que votre parole soit oui, oui, non, non ; ce qu’on y ajoute vient du malin.',
    'Matteüs 7:21':
      'Ceux qui me disent : « Seigneur, Seigneur ! » n’entreront pas tous dans le royaume des cieux, mais celui-là seul qui fait la volonté de mon Père.',
    'Exodus 20:8-11': 'Souviens-toi du jour du repos, pour le sanctifier.',
    'Marcus 2:27-28':
      "Le sabbat a été fait pour l'homme, et non l'homme pour le sabbat, de sorte que le Fils de l'homme est maître même du sabbat.",
    'Matteüs 12:11-12':
      "Lequel d'entre vous, s'il n'a qu'une brebis et qu'elle tombe dans une fosse le jour du sabbat, ne la saisira pour l'en retirer ? Combien un homme ne vaut-il pas plus qu'une brebis !",
    'Exodus 20:12': 'Honore ton père et ta mère.',
    'Marcus 7:9-13':
      'Vous anéantissez fort bien le commandement de Dieu, pour garder votre tradition !... Vous annulez ainsi la parole de Dieu.',
    'Johannes 19:26-27':
      'Jésus, voyant sa mère, dit à sa mère : « Femme, voilà ton fils. » Puis il dit au disciple : « Voilà ta mère. »',
    'Exodus 20:13': 'Tu ne tueras point.',
    'Matteüs 5:21-22':
      'Vous avez entendu qu’il a été dit : « Tu ne tueras point. » Mais moi, je vous dis que quiconque se met en colère contre son frère mérite d’être puni par les juges.',
    'Matteüs 26:52':
      'Remets ton épée à sa place ; car tous ceux qui prendront l’épée périront par l’épée.',
    'Lucas 9:54-56':
      'Ils dirent : « Seigneur, veux-tu que nous commandions que le feu descende du ciel et les consume ? » Jésus se tourna vers eux, et les réprimanda.',
    'Exodus 20:14': "Tu ne commettras point d'adultère.",
    'Matteüs 5:27-28':
      "Vous avez entendu qu'il a été dit : « Tu ne commettras point d'adultère. » Mais moi, je vous dis que quiconque regarde une femme pour la convoiter a déjà commis un adultère avec elle dans son cœur.",
    'Matteüs 19:4-6': "Que l'homme ne sépare donc pas ce que Dieu a joint.",
    'Exodus 20:15': 'Tu ne déroberas point.',
    'Marcus 10:19': 'Tu connais les commandements : Tu ne déroberas point ; tu ne feras tort à personne...',
    'Lucas 19:8-9':
      "Zachée dit : « Voici, Seigneur, je donne aux pauvres la moitié de mes biens, et, si j'ai fait tort de quelque chose à quelqu'un, je lui rends le quadruple. »",
    'Johannes 10:10':
      "Le voleur ne vient que pour dérober, égorger et détruire ; moi, je suis venu afin que les brebis aient la vie, et qu'elles soient dans l'abondance.",
    'Exodus 20:16': 'Tu ne porteras point de faux témoignage contre ton prochain.',
    'Matteüs 5:37':
      'Que votre parole soit oui, oui, non, non ; ce qu’on y ajoute vient du malin.',
    'Johannes 8:44':
      'Lorsqu’il profère le mensonge, il parle de son propre fonds ; car il est menteur et le père du mensonge.',
    'Johannes 14:6': 'Jésus lui dit : « Je suis le chemin, la vérité, et la vie. »',
    'Matteüs 15:18-19':
      'C’est du cœur que viennent les mauvaises pensées, les meurtres, les adultères, les impudicités, les vols, les faux témoignages, les calomnies.',
    'Exodus 20:17': 'Tu ne convoiteras point la maison de ton prochain... ni aucune chose qui appartienne à ton prochain.',
    'Lucas 12:15':
      'Gardez-vous avec soin de toute avarice ; car la vie d’un homme ne dépend pas de ses biens.',
    'Matteüs 6:19-21':
      'Ne vous amassez pas des trésors sur la terre... Car là où est ton trésor, là aussi sera ton cœur.',
    'Matteüs 22:39-40':
      'Et voici le second, qui lui est semblable : « Tu aimeras ton prochain comme toi-même. » De ces deux commandements dépendent toute la loi et les prophètes.',
    'Lucas 10:27-37':
      'Lequel de ces trois te semble avoir été le prochain de celui qui était tombé au milieu des brigands ?... Jésus lui dit : « Va, et toi, fais de même. »',
    'Johannes 13:34-35':
      'Je vous donne un commandement nouveau : Aimez-vous les uns les autres ; comme je vous ai aimés, vous aussi, aimez-vous les uns les autres.',
    'Matteüs 7:12':
      'Tout ce que vous voulez que les hommes fassent pour vous, faites-le de même pour eux, car c’est la loi et les prophètes.',
    'Lucas 6:31': 'Ce que vous voulez que les hommes fassent pour vous, faites-le de même pour eux.',
    'Matteüs 5:43-45':
      'Mais moi, je vous dis : Aimez vos ennemis, bénissez ceux qui vous maudissent, priez pour ceux qui vous maltraitent et qui vous persécutent.',
    'Lucas 6:27-28':
      'Aimez vos ennemis, faites du bien à ceux qui vous haïssent, bénissez ceux qui vous maudissent, priez pour ceux qui vous maltraitent.',
    'Lucas 23:34': 'Jésus dit : « Père, pardonne-leur, car ils ne savent ce qu’ils font. »',
    'Matteüs 5:38-39':
      'Vous avez entendu qu’il a été dit : « Œil pour œil, et dent pour dent. » Mais moi, je vous dis de ne pas résister au méchant. Si quelqu’un te frappe sur la joue droite, présente-lui aussi l’autre.',
    'Lucas 6:29-30': 'Si quelqu’un te frappe sur une joue, présente-lui aussi l’autre.',
    'Johannes 18:36':
      'Mon royaume n’est pas de ce monde. Si mon royaume était de ce monde, mes serviteurs auraient combattu.',
    'Matteüs 5:9': 'Heureux ceux qui procurent la paix, car ils seront appelés fils de Dieu !',
    'Marcus 9:50': 'Soyez en paix les uns avec les autres.',
    'Johannes 14:27':
      'Je vous laisse la paix, je vous donne ma paix. Je ne vous donne pas comme le monde donne.',
    'Matteüs 18:21-22':
      'Pierre lui dit : « Seigneur, combien de fois pardonnerai-je à mon frère, lorsqu’il péchera contre moi ? Sera-ce jusqu’à sept fois ? » Jésus lui dit : « Je ne te dis pas jusqu’à sept fois, mais jusqu’à septante fois sept fois. »',
    'Matteüs 6:14-15':
      'Si vous pardonnez aux hommes leurs offenses, votre Père céleste vous pardonnera aussi ; mais si vous ne pardonnez pas aux hommes, votre Père ne vous pardonnera pas non plus vos offenses.',
    'Lucas 17:3-4':
      'Si ton frère a péché, reprends-le ; et, s’il se repent, pardonne-lui.',
    'Matteüs 7:1-5':
      'Ne jugez point, afin que vous ne soyez point jugés... Pourquoi vois-tu la paille qui est dans l’œil de ton frère, et n’aperçois-tu pas la poutre qui est dans ton œil ?',
    'Johannes 8:7': 'Que celui de vous qui est sans péché jette le premier la pierre contre elle.',
    'Lucas 6:37':
      'Ne jugez point, et vous ne serez point jugés ; ne condamnez point, et vous ne serez point condamnés ; absolvez, et vous serez absous.',
    'Matteüs 25:35-40':
      'Car j’ai eu faim, et vous m’avez donné à manger... Je vous le dis en vérité, toutes les fois que vous avez fait ces choses à l’un de ces plus petits de mes frères, c’est à moi que vous les avez faites.',
    'Lucas 14:13-14':
      'Lorsque tu donnes un festin, invite des pauvres, des estropiés, des boiteux, des aveugles. Et tu seras heureux.',
    'Lucas 4:18':
      'L’Esprit du Seigneur est sur moi, parce qu’il m’a oint pour annoncer une bonne nouvelle aux pauvres.',
    'Matteüs 23:3':
      'Faites donc et observez tout ce qu’ils vous disent ; mais n’agissez pas selon leurs œuvres. Car ils disent, et ne font pas.',
    'Matteüs 7:16-20':
      'Vous les reconnaîtrez à leurs fruits... Tout bon arbre porte de bons fruits, mais le mauvais arbre porte de mauvais fruits.',
    'Lucas 12:1': 'Gardez-vous du levain des pharisiens, qui est l’hypocrisie.',
    'Marcus 10:42-45':
      'Quiconque veut être grand parmi vous, qu’il soit votre serviteur... Car le Fils de l’homme est venu, non pour être servi, mais pour servir.',
    'Lucas 14:11':
      'Car quiconque s’élève sera abaissé, et quiconque s’abaisse sera élevé.',
    'Johannes 13:14-15':
      'Si donc je vous ai lavé les pieds, moi, le Seigneur et le Maître, vous devez aussi vous laver les pieds les uns aux autres ; car je vous ai donné un exemple.',
    'Matteüs 5:5': 'Heureux les débonnaires, car ils hériteront la terre !',
    'Matteüs 5:7': 'Heureux les miséricordieux, car ils obtiendront miséricorde !',
    'Lucas 6:36': 'Soyez donc miséricordieux, comme votre Père est miséricordieux.',
    'Matteüs 12:34-37':
      'Car c’est de l’abondance du cœur que la bouche parle... Au jour du jugement, les hommes rendront compte de toute parole vaine qu’ils auront proférée.',
    'Matteüs 15:11':
      'Ce n’est pas ce qui entre dans la bouche qui souille l’homme ; mais ce qui sort de la bouche, c’est ce qui souille l’homme.',
    'Lucas 16:10':
      'Celui qui est fidèle dans les moindres choses l’est aussi dans les grandes, et celui qui est injuste dans les moindres choses l’est aussi dans les grandes.',
    'Matteüs 25:21':
      'C’est bien, bon et fidèle serviteur ; tu as été fidèle en peu de chose, je te confierai beaucoup.',
    'Lucas 12:48':
      'On demandera beaucoup à qui l’on a beaucoup donné, et on exigera davantage de celui à qui l’on a beaucoup confié.',
    'Matteüs 5:6': 'Heureux ceux qui ont faim et soif de la justice, car ils seront rassasiés !',
    'Matteüs 23:23':
      'Malheur à vous... parce que vous payez la dîme de la menthe, de l’aneth et du cumin, et que vous laissez ce qui est plus important dans la loi, la justice, la miséricorde et la fidélité.',
    'Johannes 7:24': 'Ne jugez pas selon l’apparence, mais jugez selon la justice.',
    'Matteüs 18:5-6':
      'Quiconque reçoit en mon nom un petit enfant comme celui-ci, me reçoit moi-même. Mais, si quelqu’un scandalisait un de ces petits qui croient en moi, il vaudrait mieux pour lui qu’on suspendît à son cou une meule de moulin.',
    'Matteüs 19:14':
      'Laissez les petits enfants, et ne les empêchez pas de venir à moi ; car le royaume des cieux est pour ceux qui leur ressemblent.',
    'Marcus 9:36-37':
      'Il prit un petit enfant, le plaça au milieu d’eux, et l’ayant pris dans ses bras, il leur dit : « Quiconque reçoit en mon nom un de ces petits enfants me reçoit moi-même. »',
  },
  es: {
    'Exodus 20:2-3': 'Yo soy el SEÑOR tu Dios. No tengas otros dioses además de mí.',
    'Matteüs 22:37-38':
      'Ama al Señor tu Dios con todo tu corazón, con toda tu alma y con toda tu mente. Este es el primero y el más importante de los mandamientos.',
    'Matteüs 6:24': 'Nadie puede servir a dos señores. No pueden servir a la vez a Dios y a las riquezas.',
    'Lucas 4:8': 'Escrito está: «Adora al Señor tu Dios y sírvele solamente a él».',
    'Exodus 20:4-6': 'No te hagas ningún ídolo, ni nada que guarde semejanza con lo que hay arriba en el cielo.',
    'Johannes 4:23-24':
      'Los verdaderos adoradores rendirán culto al Padre en espíritu y en verdad, porque así quiere el Padre que sean los que le adoren.',
    'Matteüs 21:12-13':
      'Escrito está: «Mi casa será llamada casa de oración», ¡pero ustedes la están convirtiendo en cueva de ladrones!',
    'Exodus 20:7': 'No pronuncies el nombre del SEÑOR tu Dios a la ligera.',
    'Matteüs 5:33-37':
      'Cuando digan «sí», que sea realmente sí; y, cuando digan «no», que sea no. Cualquier cosa de más proviene del maligno.',
    'Matteüs 7:21':
      'No todo el que me dice: «Señor, Señor», entrará en el reino de los cielos, sino solo el que hace la voluntad de mi Padre.',
    'Exodus 20:8-11': 'Acuérdate del sábado, para consagrarlo.',
    'Marcus 2:27-28':
      'El sábado se hizo para el hombre, y no el hombre para el sábado. Así que el Hijo del hombre es Señor incluso del sábado.',
    'Matteüs 12:11-12':
      'Si alguno de ustedes tiene una oveja y en sábado se le cae en un hoyo, ¿no la agarra y la saca? ¡Cuánto más vale una persona que una oveja!',
    'Exodus 20:12': 'Honra a tu padre y a tu madre.',
    'Marcus 7:9-13':
      '¡Qué buena manera tienen ustedes de dejar a un lado los mandamientos de Dios para mantener sus propias tradiciones!... Así anulan la palabra de Dios.',
    'Johannes 19:26-27':
      'Cuando Jesús vio a su madre, le dijo: «Mujer, ahí tienes a tu hijo». Luego dijo al discípulo: «Ahí tienes a tu madre».',
    'Exodus 20:13': 'No mates.',
    'Matteüs 5:21-22':
      'Ustedes han oído que se dijo: «No mates». Pero yo les digo que todo el que se enoje con su hermano quedará sujeto al juicio.',
    'Matteüs 26:52':
      'Vuelve tu espada a su sitio, porque todos los que empuñan la espada, a espada morirán.',
    'Lucas 9:54-56':
      'Le preguntaron: «Señor, ¿quieres que mandemos que caiga fuego del cielo y los destruya?» Pero él se volvió y los reprendió.',
    'Exodus 20:14': 'No cometas adulterio.',
    'Matteüs 5:27-28':
      'Ustedes han oído que se dijo: «No cometas adulterio». Pero yo les digo que cualquiera que mira a una mujer y la codicia ya ha cometido adulterio con ella en el corazón.',
    'Matteüs 19:4-6': 'Por lo tanto, lo que Dios ha unido, que no lo separe el hombre.',
    'Exodus 20:15': 'No robes.',
    'Marcus 10:19': 'Ya sabes los mandamientos: No robes, no estafes...',
    'Lucas 19:8-9':
      'Zaqueo dijo: «Mira, Señor: ahora mismo voy a dar a los pobres la mitad de mis bienes y, si en algo he defraudado a alguien, le devolveré cuatro veces la cantidad que sea».',
    'Johannes 10:10':
      'El ladrón no viene más que a robar, matar y destruir; yo he venido para que tengan vida, y la tengan en abundancia.',
    'Exodus 20:16': 'No des falso testimonio en contra de tu prójimo.',
    'Matteüs 5:37':
      'Cuando digan «sí», que sea realmente sí; y, cuando digan «no», que sea no. Cualquier cosa de más proviene del maligno.',
    'Johannes 8:44':
      'Cuando miente, expresa su propia naturaleza, porque es un mentiroso. ¡Es el padre de la mentira!',
    'Johannes 14:6': 'Jesús contestó: «Yo soy el camino, la verdad y la vida».',
    'Matteüs 15:18-19':
      'Del corazón salen los malos pensamientos, los homicidios, los adulterios, la inmoralidad sexual, los robos, los falsos testimonios y las calumnias.',
    'Exodus 20:17': 'No codicies la casa de tu prójimo... ni nada que le pertenezca.',
    'Lucas 12:15':
      '¡Tengan cuidado! Absténganse de toda avaricia; la vida de una persona no depende de la abundancia de sus bienes.',
    'Matteüs 6:19-21':
      'No acumulen para sí tesoros en la tierra... Porque donde esté tu tesoro, allí estará también tu corazón.',
    'Matteüs 22:39-40':
      'El segundo se parece a este: «Ama a tu prójimo como a ti mismo». De estos dos mandamientos dependen toda la ley y los profetas.',
    'Lucas 10:27-37':
      '¿Cuál de estos tres piensas que demostró ser el prójimo del que cayó en manos de los ladrones?... Jesús le dijo: «Anda y haz tú lo mismo».',
    'Johannes 13:34-35':
      'Este mandamiento nuevo les doy: que se amen los unos a los otros. Así como yo los he amado, también ustedes deben amarse los unos a los otros.',
    'Matteüs 7:12':
      'Así que en todo traten ustedes a los demás tal y como quieren que ellos los traten a ustedes. De hecho, esto es la ley y los profetas.',
    'Lucas 6:31': 'Traten a los demás tal y como quieren que ellos los traten a ustedes.',
    'Matteüs 5:43-45':
      'Pero yo les digo: Amen a sus enemigos y oren por quienes los persiguen, para que sean hijos de su Padre que está en el cielo.',
    'Lucas 6:27-28':
      'Amen a sus enemigos, hagan bien a quienes los odian, bendigan a quienes los maldicen, oren por quienes los maltratan.',
    'Lucas 23:34': 'Jesús dijo: «Padre, perdónalos, porque no saben lo que hacen».',
    'Matteüs 5:38-39':
      'Ustedes han oído que se dijo: «Ojo por ojo y diente por diente». Pero yo les digo: No resistan al que les haga mal. Si alguien te da una bofetada en la mejilla derecha, vuélvele también la otra.',
    'Lucas 6:29-30': 'Si alguien te pega en una mejilla, vuélvele también la otra.',
    'Johannes 18:36':
      'Mi reino no es de este mundo. Si lo fuera, mis propios guardias pelearían para impedir que me arrestaran.',
    'Matteüs 5:9': 'Dichosos los que trabajan por la paz, porque serán llamados hijos de Dios.',
    'Marcus 9:50': 'Vivan en paz unos con otros.',
    'Johannes 14:27':
      'La paz les dejo; mi paz les doy. Yo no se la doy a ustedes como la da el mundo.',
    'Matteüs 18:21-22':
      'Pedro le preguntó: «Señor, ¿cuántas veces tengo que perdonar a mi hermano que peca contra mí? ¿Hasta siete veces?» Jesús le contestó: «No te digo que hasta siete veces, sino hasta setenta veces siete».',
    'Matteüs 6:14-15':
      'Porque si perdonan a otros sus ofensas, también los perdonará a ustedes su Padre celestial. Pero si no perdonan a otros sus ofensas, tampoco su Padre les perdonará a ustedes las suyas.',
    'Lucas 17:3-4':
      'Si tu hermano peca contra ti, repréndelo; y, si se arrepiente, perdónalo.',
    'Matteüs 7:1-5':
      'No juzguen, para que no sean juzgados... ¿Por qué te fijas en la astilla que tiene tu hermano en el ojo y no le das importancia a la viga que está en el tuyo?',
    'Johannes 8:7': 'Aquel de ustedes que esté libre de pecado, que tire la primera piedra.',
    'Lucas 6:37':
      'No juzguen, y no se les juzgará. No condenen, y no se les condenará. Perdonen, y se les perdonará.',
    'Matteüs 25:35-40':
      'Porque tuve hambre, y ustedes me dieron de comer... Les aseguro que todo lo que hicieron por uno de mis hermanos, aun por el más pequeño, lo hicieron por mí.',
    'Lucas 14:13-14':
      'Cuando des un banquete, invita a los pobres, a los inválidos, a los cojos y a los ciegos; entonces serás dichoso.',
    'Lucas 4:18':
      'El Espíritu del Señor está sobre mí, por cuanto me ha ungido para anunciar buenas nuevas a los pobres.',
    'Matteüs 23:3':
      'Así que ustedes deben obedecerlos y hacer todo lo que les digan. Pero no hagan lo que hacen ellos, porque no practican lo que predican.',
    'Matteüs 7:16-20':
      'Por sus frutos los conocerán... Así mismo, todo árbol bueno da fruto bueno, pero el árbol malo da fruto malo.',
    'Lucas 12:1': 'Cuídense de la levadura de los fariseos, es decir, de la hipocresía.',
    'Marcus 10:42-45':
      'El que quiera hacerse grande entre ustedes deberá ser su servidor... Porque ni siquiera el Hijo del hombre vino para que le sirvan, sino para servir.',
    'Lucas 14:11':
      'Porque todo el que a sí mismo se enaltece será humillado, y el que se humilla será enaltecido.',
    'Johannes 13:14-15':
      'Pues si yo, el Señor y el Maestro, les he lavado los pies, también ustedes deben lavarse los pies los unos a los otros. Les he puesto el ejemplo.',
    'Matteüs 5:5': 'Dichosos los humildes, porque recibirán la tierra como herencia.',
    'Matteüs 5:7': 'Dichosos los compasivos, porque serán tratados con compasión.',
    'Lucas 6:36': 'Sean compasivos, así como su Padre es compasivo.',
    'Matteüs 12:34-37':
      'De la abundancia del corazón habla la boca... En el día del juicio todos tendrán que dar cuenta de toda palabra ociosa que hayan pronunciado.',
    'Matteüs 15:11':
      'No es lo que entra en la boca lo que contamina a la persona, sino lo que sale de la boca.',
    'Lucas 16:10':
      'El que es honrado en lo poco también lo será en lo mucho; y el que no es íntegro en lo poco tampoco lo será en lo mucho.',
    'Matteüs 25:21':
      '¡Hiciste bien, siervo bueno y fiel! En lo poco has sido fiel; te pondré a cargo de mucho más.',
    'Lucas 12:48':
      'A todo el que se le ha dado mucho, se le exigirá mucho; y al que se le ha confiado mucho, se le pedirá aún más.',
    'Matteüs 5:6': 'Dichosos los que tienen hambre y sed de justicia, porque serán saciados.',
    'Matteüs 23:23':
      '¡Ay de ustedes!... Dan la décima parte de sus especias, pero han descuidado los asuntos más importantes de la ley, tales como la justicia, la misericordia y la fidelidad.',
    'Johannes 7:24': 'No juzguen por las apariencias; juzguen con justicia.',
    'Matteüs 18:5-6':
      'Y el que recibe en mi nombre a un niño como este, me recibe a mí. Pero, si alguien hace pecar a uno de estos pequeños que creen en mí, más le valdría que le colgaran al cuello una gran piedra de molino.',
    'Matteüs 19:14':
      'Dejen que los niños vengan a mí, y no se lo impidan, porque el reino de los cielos es de quienes son como ellos.',
    'Marcus 9:36-37':
      'Tomó en brazos a un niño y lo puso en medio de ellos. Luego dijo: «El que recibe en mi nombre a uno de estos niños, me recibe a mí».',
  },
  it: {
    'Exodus 20:2-3': 'Io sono il SIGNORE, il tuo Dio. Non avere altri dèi oltre a me.',
    'Matteüs 22:37-38':
      'Ama il Signore Dio tuo con tutto il tuo cuore, con tutta la tua anima e con tutta la tua mente. Questo è il grande e il primo comandamento.',
    'Matteüs 6:24': 'Nessuno può servire due padroni. Non potete servire Dio e Mammona.',
    'Lucas 4:8': 'Sta scritto: «Adora il Signore, il tuo Dio, e a lui solo rendi il tuo culto».',
    'Exodus 20:4-6': 'Non farti scultura, né immagine alcuna delle cose che sono lassù nel cielo.',
    'Johannes 4:23-24':
      'I veri adoratori adoreranno il Padre in spirito e verità; poiché il Padre cerca tali adoratori.',
    'Matteüs 21:12-13':
      'È scritto: «La mia casa sarà chiamata casa di preghiera», ma voi ne fate un covo di ladri!',
    'Exodus 20:7': 'Non pronunciare il nome del SIGNORE, Dio tuo, invano.',
    'Matteüs 5:33-37':
      'Il vostro parlare sia: «Sì, sì; no, no»; poiché il di più viene dal maligno.',
    'Matteüs 7:21':
      'Non chiunque mi dice: «Signore, Signore!» entrerà nel regno dei cieli, ma chi fa la volontà del Padre mio.',
    'Exodus 20:8-11': 'Ricordati del giorno di riposo per santificarlo.',
    'Marcus 2:27-28':
      "Il sabato è stato fatto per l'uomo e non l'uomo per il sabato; perciò il Figlio dell'uomo è signore anche del sabato.",
    'Matteüs 12:11-12':
      'Chi è tra voi quell’uomo che, avendo una pecora, se questa cade in giorno di sabato in una fossa, non la prenda e la tiri fuori? Certo, un uomo vale molto più di una pecora!',
    'Exodus 20:12': 'Onora tuo padre e tua madre.',
    'Marcus 7:9-13':
      'Come sapete bene annullare il comandamento di Dio per osservare la vostra tradizione!... Così annullate la parola di Dio.',
    'Johannes 19:26-27':
      'Gesù dunque, veduta sua madre, disse a sua madre: «Donna, ecco tuo figlio!» Poi disse al discepolo: «Ecco tua madre!»',
    'Exodus 20:13': 'Non uccidere.',
    'Matteüs 5:21-22':
      'Voi avete udito che fu detto: «Non uccidere». Ma io vi dico che chiunque si adira contro suo fratello sarà sottoposto al tribunale.',
    'Matteüs 26:52':
      'Rimetti la tua spada al suo posto, perché tutti quelli che prendono la spada periranno di spada.',
    'Lucas 9:54-56':
      'Dissero: «Signore, vuoi che diciamo che scenda fuoco dal cielo e li consumi?» Ma egli si voltò e li sgridò.',
    'Exodus 20:14': 'Non commettere adulterio.',
    'Matteüs 5:27-28':
      'Voi avete udito che fu detto: «Non commettere adulterio». Ma io vi dico che chiunque guarda una donna per desiderarla, ha già commesso adulterio con lei nel suo cuore.',
    'Matteüs 19:4-6': "Quel che Dio ha unito, l'uomo non lo separi.",
    'Exodus 20:15': 'Non rubare.',
    'Marcus 10:19': 'Tu conosci i comandamenti: Non rubare, non frodare nessuno...',
    'Lucas 19:8-9':
      'Zaccheo disse: «Ecco, Signore, io do la metà dei miei beni ai poveri; e, se ho frodato qualcuno di qualcosa, gli rendo il quadruplo».',
    'Johannes 10:10':
      'Il ladro non viene se non per rubare, ammazzare e distruggere; io sono venuto perché abbiano la vita e l’abbiano in abbondanza.',
    'Exodus 20:16': 'Non attestare il falso contro il tuo prossimo.',
    'Matteüs 5:37':
      'Il vostro parlare sia: «Sì, sì; no, no»; poiché il di più viene dal maligno.',
    'Johannes 8:44':
      'Quando dice il falso, parla di quel che è suo, perché è bugiardo e padre della menzogna.',
    'Johannes 14:6': 'Gesù gli disse: «Io sono la via, la verità e la vita».',
    'Matteüs 15:18-19':
      'Dal cuore vengono pensieri malvagi, omicidi, adultèri, fornicazioni, furti, false testimonianze, maldicenze.',
    'Exodus 20:17': 'Non desiderare la casa del tuo prossimo... né cosa alcuna che sia del tuo prossimo.',
    'Lucas 12:15':
      'Badate e guardatevi da ogni avarizia; perché non è dall’abbondanza dei beni che uno possiede, che egli ha la sua vita.',
    'Matteüs 6:19-21':
      'Non fatevi tesori sulla terra... Perché dov’è il tuo tesoro, lì sarà anche il tuo cuore.',
    'Matteüs 22:39-40':
      'Il secondo, simile a questo, è: «Ama il tuo prossimo come te stesso». Da questi due comandamenti dipendono tutta la legge e i profeti.',
    'Lucas 10:27-37':
      'Chi di questi tre ti pare essere stato il prossimo di colui che s’imbatté nei ladroni?... Gesù gli disse: «Va’ e fa’ anche tu lo stesso».',
    'Johannes 13:34-35':
      'Io vi do un nuovo comandamento: che vi amiate gli uni gli altri. Come io vi ho amati, anche voi amatevi gli uni gli altri.',
    'Matteüs 7:12':
      'Tutte le cose dunque che voi volete che gli uomini vi facciano, fatele anche voi a loro; perché questa è la legge e i profeti.',
    'Lucas 6:31': 'E come volete che gli uomini facciano a voi, fate voi pure a loro.',
    'Matteüs 5:43-45':
      'Ma io vi dico: amate i vostri nemici e pregate per quelli che vi perseguitano, affinché siate figli del Padre vostro che è nei cieli.',
    'Lucas 6:27-28':
      'Amate i vostri nemici, fate del bene a quelli che vi odiano, benedite quelli che vi maledicono, pregate per quelli che vi oltraggiano.',
    'Lucas 23:34': 'Gesù diceva: «Padre, perdona loro, perché non sanno quello che fanno».',
    'Matteüs 5:38-39':
      'Voi avete udito che fu detto: «Occhio per occhio e dente per dente». Ma io vi dico: non contrastate il malvagio; anzi, se uno ti percuote sulla guancia destra, tu porgigli anche l’altra.',
    'Lucas 6:29-30': 'A chi ti percuote su una guancia, porgi anche l’altra.',
    'Johannes 18:36':
      'Il mio regno non è di questo mondo; se il mio regno fosse di questo mondo, i miei servitori combatterebbero.',
    'Matteüs 5:9': 'Beati quelli che si adoperano per la pace, perché saranno chiamati figli di Dio.',
    'Marcus 9:50': 'Siate in pace gli uni con gli altri.',
    'Johannes 14:27':
      'Vi lascio pace; vi do la mia pace. Io non vi do come il mondo dà.',
    'Matteüs 18:21-22':
      'Pietro gli disse: «Signore, quante volte perdonerò mio fratello se pecca contro di me? Fino a sette volte?» E Gesù a lui: «Non ti dico fino a sette volte, ma fino a settanta volte sette».',
    'Matteüs 6:14-15':
      'Perché se voi perdonate agli uomini le loro colpe, il Padre vostro celeste perdonerà anche a voi; ma se voi non perdonate agli uomini, neppure il Padre vostro perdonerà le vostre colpe.',
    'Lucas 17:3-4':
      'Se tuo fratello pecca, riprendilo; e se si ravvede, perdonagli.',
    'Matteüs 7:1-5':
      'Non giudicate, affinché non siate giudicati... Perché guardi la pagliuzza che è nell’occhio di tuo fratello, mentre non scorgi la trave che è nell’occhio tuo?',
    'Johannes 8:7': 'Chi di voi è senza peccato, scagli per primo la pietra contro di lei.',
    'Lucas 6:37':
      'Non giudicate e non sarete giudicati; non condannate e non sarete condannati; perdonate e vi sarà perdonato.',
    'Matteüs 25:35-40':
      'Perché ebbi fame e mi deste da mangiare... In verità vi dico che in quanto lo avete fatto a uno di questi miei minimi fratelli, l’avete fatto a me.',
    'Lucas 14:13-14':
      'Quando fai un convito, chiama i poveri, gli storpi, gli zoppi, i ciechi; e sarai beato.',
    'Lucas 4:18':
      'Lo Spirito del Signore è sopra di me, perché mi ha unto per evangelizzare i poveri.',
    'Matteüs 23:3':
      'Fate dunque e osservate tutte le cose che vi diranno, ma non imitate le loro opere; perché dicono e non fanno.',
    'Matteüs 7:16-20':
      'Li riconoscerete dai loro frutti... Così ogni albero buono fa frutti buoni, ma l’albero cattivo fa frutti cattivi.',
    'Lucas 12:1': 'Guardatevi dal lievito dei farisei, che è ipocrisia.',
    'Marcus 10:42-45':
      'Chiunque vorrà essere grande fra voi, sarà vostro servitore... Poiché anche il Figlio dell’uomo non è venuto per essere servito, ma per servire.',
    'Lucas 14:11':
      'Perché chiunque s’innalza sarà abbassato, e chi si abbassa sarà innalzato.',
    'Johannes 13:14-15':
      'Se dunque io, che sono il Signore e il Maestro, vi ho lavato i piedi, anche voi dovete lavare i piedi gli uni agli altri. Infatti vi ho dato un esempio.',
    'Matteüs 5:5': 'Beati i mansueti, perché erediteranno la terra.',
    'Matteüs 5:7': 'Beati i misericordiosi, perché a loro misericordia sarà fatta.',
    'Lucas 6:36': 'Siate misericordiosi, come è misericordioso il Padre vostro.',
    'Matteüs 12:34-37':
      'Poiché dall’abbondanza del cuore la bocca parla... Io vi dico che di ogni parola oziosa che avranno detta, gli uomini renderanno conto nel giorno del giudizio.',
    'Matteüs 15:11':
      'Non è quel che entra nella bocca che contamina l’uomo; ma quel che esce dalla bocca, questo contamina l’uomo.',
    'Lucas 16:10':
      'Chi è fedele nelle cose minime, è fedele anche nelle grandi; e chi è ingiusto nelle cose minime, è ingiusto anche nelle grandi.',
    'Matteüs 25:21':
      'Bene, servo buono e fedele; tu sei stato fedele in poca cosa, io ti costituirò sopra molte cose.',
    'Lucas 12:48':
      'A chi molto è stato dato, molto sarà richiesto; e a chi molto è stato affidato, tanto più si richiederà.',
    'Matteüs 5:6': 'Beati quelli che sono affamati e assetati di giustizia, perché saranno saziati.',
    'Matteüs 23:23':
      'Guai a voi... poiché pagate la decima della menta, dell’aneto e del cumino, e trascurate le cose più importanti della legge: il giudizio, la misericordia e la fede.',
    'Johannes 7:24': 'Non giudicate secondo l’apparenza, ma giudicate secondo giustizia.',
    'Matteüs 18:5-6':
      'Chi riceve un bambino come questo nel nome mio, riceve me. Ma chi avrà scandalizzato uno di questi piccoli che credono in me, meglio per lui sarebbe che gli fosse appesa al collo una macina da mulino.',
    'Matteüs 19:14':
      'Lasciate i piccoli fanciulli e non vietate loro di venire a me, perché di tali è il regno dei cieli.',
    'Marcus 9:36-37':
      'E preso un bambino, lo mise in mezzo a loro; poi lo abbracciò e disse loro: «Chi riceve uno di questi bambini nel nome mio, riceve me».',
  },
  pt: {
    'Exodus 20:2-3': 'Eu sou o SENHOR, o teu Deus. Não terás outros deuses além de mim.',
    'Matteüs 22:37-38':
      'Ame o Senhor, o seu Deus, de todo o seu coração, de toda a sua alma e de todo o seu entendimento. Este é o primeiro e maior mandamento.',
    'Matteüs 6:24': 'Ninguém pode servir a dois senhores. Vocês não podem servir a Deus e ao dinheiro.',
    'Lucas 4:8': 'Está escrito: «Adore o Senhor, o seu Deus, e só a ele preste culto».',
    'Exodus 20:4-6': 'Não farás para ti nenhum ídolo, nem nenhuma imagem de qualquer coisa no céu.',
    'Johannes 4:23-24':
      'Os verdadeiros adoradores adorarão o Pai em espírito e em verdade; são estes os adoradores que o Pai procura.',
    'Matteüs 21:12-13':
      'Está escrito: «A minha casa será chamada casa de oração», mas vocês estão fazendo dela um covil de ladrões!',
    'Exodus 20:7': 'Não tomarás em vão o nome do SENHOR, o teu Deus.',
    'Matteüs 5:33-37':
      'Seja o seu «sim», sim, e o seu «não», não; o que passar disso vem do Maligno.',
    'Matteüs 7:21':
      'Nem todo aquele que me diz: «Senhor, Senhor», entrará no Reino dos céus, mas apenas aquele que faz a vontade de meu Pai.',
    'Exodus 20:8-11': 'Lembra-te do dia de sábado, para santificá-lo.',
    'Marcus 2:27-28':
      'O sábado foi feito por causa do homem, e não o homem por causa do sábado. Assim, pois, o Filho do homem é Senhor até mesmo do sábado.',
    'Matteüs 12:11-12':
      'Se algum de vocês tiver uma ovelha e ela cair num buraco no sábado, não irá pegá-la e tirá-la de lá? Quanto mais vale um homem do que uma ovelha!',
    'Exodus 20:12': 'Honra teu pai e tua mãe.',
    'Marcus 7:9-13':
      'Vocês estão sempre encontrando uma boa maneira para pôr de lado os mandamentos de Deus, a fim de obedecerem às suas tradições!... Assim vocês anulam a palavra de Deus.',
    'Johannes 19:26-27':
      'Quando Jesus viu sua mãe ali, disse a sua mãe: «Mulher, eis aí o seu filho», e ao discípulo: «Eis aí a sua mãe».',
    'Exodus 20:13': 'Não matarás.',
    'Matteüs 5:21-22':
      'Vocês ouviram o que foi dito: «Não matarás». Mas eu digo que qualquer que se irar contra seu irmão estará sujeito a julgamento.',
    'Matteüs 26:52':
      'Guarde a espada! Pois todos os que empunham a espada, pela espada morrerão.',
    'Lucas 9:54-56':
      'Perguntaram: «Senhor, queres que façamos cair fogo do céu para destruí-los?» Mas Jesus voltou-se e os repreendeu.',
    'Exodus 20:14': 'Não adulterarás.',
    'Matteüs 5:27-28':
      'Vocês ouviram o que foi dito: «Não adulterarás». Mas eu digo que qualquer que olhar para uma mulher e desejá-la, já cometeu adultério com ela no seu coração.',
    'Matteüs 19:4-6': 'Portanto, o que Deus uniu, ninguém separe.',
    'Exodus 20:15': 'Não furtarás.',
    'Marcus 10:19': 'Você conhece os mandamentos: Não furtarás, não defraudarás ninguém...',
    'Lucas 19:8-9':
      'Zaqueu disse: «Senhor, aqui e agora dou metade dos meus bens aos pobres, e se em alguma coisa tenho defraudado alguém, vou restituir quatro vezes mais».',
    'Johannes 10:10':
      'O ladrão vem apenas para roubar, matar e destruir; eu vim para que tenham vida, e a tenham plenamente.',
    'Exodus 20:16': 'Não darás falso testemunho contra o teu próximo.',
    'Matteüs 5:37':
      'Seja o seu «sim», sim, e o seu «não», não; o que passar disso vem do Maligno.',
    'Johannes 8:44':
      'Quando mente, fala a sua própria língua, pois é mentiroso e pai da mentira.',
    'Johannes 14:6': 'Respondeu Jesus: «Eu sou o caminho, a verdade e a vida».',
    'Matteüs 15:18-19':
      'Do coração saem os maus pensamentos, os homicídios, os adultérios, as imoralidades sexuais, os roubos, os falsos testemunhos e as calúnias.',
    'Exodus 20:17': 'Não cobiçarás a casa do teu próximo... nem coisa alguma que lhe pertença.',
    'Lucas 12:15':
      'Tenham cuidado! Guardem-se de toda espécie de ganância; a vida de um homem não consiste na quantidade dos seus bens.',
    'Matteüs 6:19-21':
      'Não acumulem para vocês tesouros na terra... Pois onde estiver o seu tesouro, aí também estará o seu coração.',
    'Matteüs 22:39-40':
      'E o segundo é semelhante a ele: «Ame o seu próximo como a si mesmo». Destes dois mandamentos dependem toda a Lei e os Profetas.',
    'Lucas 10:27-37':
      'Qual destes três você acha que foi o próximo do homem que caiu nas mãos dos assaltantes?... Jesus lhe disse: «Vá e faça o mesmo».',
    'Johannes 13:34-35':
      'Um novo mandamento dou a vocês: Amem-se uns aos outros. Como eu os amei, vocês devem amar-se uns aos outros.',
    'Matteüs 7:12':
      'Assim, em tudo, façam aos outros o que vocês querem que eles façam a vocês; pois esta é a Lei e os Profetas.',
    'Lucas 6:31': 'Como vocês querem que os outros lhes façam, façam também vocês a eles.',
    'Matteüs 5:43-45':
      'Mas eu digo: Amem os seus inimigos e orem por aqueles que os perseguem, para que vocês venham a ser filhos de seu Pai que está nos céus.',
    'Lucas 6:27-28':
      'Amem os seus inimigos, façam o bem aos que os odeiam, abençoem os que os amaldiçoam, orem por aqueles que os maltratam.',
    'Lucas 23:34': 'Jesus disse: «Pai, perdoa-lhes, pois não sabem o que estão fazendo».',
    'Matteüs 5:38-39':
      'Vocês ouviram o que foi dito: «Olho por olho e dente por dente». Mas eu digo: Não resistam ao perverso. Se alguém o ferir na face direita, ofereça-lhe também a outra.',
    'Lucas 6:29-30': 'Se alguém bater em você numa face, ofereça-lhe também a outra.',
    'Johannes 18:36':
      'O meu Reino não é deste mundo. Se fosse, os meus servos lutariam para impedir que eu fosse preso.',
    'Matteüs 5:9': 'Bem-aventurados os pacificadores, pois serão chamados filhos de Deus.',
    'Marcus 9:50': 'Vivam em paz uns com os outros.',
    'Johannes 14:27':
      'Deixo a paz a vocês; a minha paz dou a vocês. Não a dou como o mundo a dá.',
    'Matteüs 18:21-22':
      'Pedro perguntou: «Senhor, quantas vezes deverei perdoar a meu irmão quando ele pecar contra mim? Até sete vezes?» Jesus respondeu: «Eu digo a você: Não até sete, mas até setenta vezes sete».',
    'Matteüs 6:14-15':
      'Pois se perdoarem as ofensas uns dos outros, o Pai celestial também perdoará vocês. Mas se não perdoarem uns aos outros, o Pai celestial não perdoará as ofensas de vocês.',
    'Lucas 17:3-4':
      'Se o seu irmão pecar, repreenda-o e, se ele se arrepender, perdoe-lhe.',
    'Matteüs 7:1-5':
      'Não julguem, para que vocês não sejam julgados... Por que você repara no cisco que está no olho do seu irmão e não se dá conta da viga que está em seu próprio olho?',
    'Johannes 8:7': 'Se algum de vocês estiver sem pecado, seja o primeiro a atirar pedra nela.',
    'Lucas 6:37':
      'Não julguem, e vocês não serão julgados. Não condenem, e não serão condenados. Perdoem, e serão perdoados.',
    'Matteüs 25:35-40':
      'Pois eu tive fome, e vocês me deram de comer... Digo a verdade: O que vocês fizeram a algum dos meus menores irmãos, a mim o fizeram.',
    'Lucas 14:13-14':
      'Quando você der um banquete, convide os pobres, os aleijados, os mancos e os cegos. Feliz será você.',
    'Lucas 4:18':
      'O Espírito do Senhor está sobre mim, porque ele me ungiu para pregar boas-novas aos pobres.',
    'Matteüs 23:3':
      'Portanto, obedeçam-lhes e façam tudo o que eles dizem a vocês. Mas não façam o que eles fazem, pois não praticam o que pregam.',
    'Matteüs 7:16-20':
      'Pelos seus frutos vocês os reconhecerão... Assim, toda árvore boa dá frutos bons, mas a árvore ruim dá frutos ruins.',
    'Lucas 12:1': 'Tenham cuidado com o fermento dos fariseus, que é a hipocrisia.',
    'Marcus 10:42-45':
      'Quem quiser tornar-se importante entre vocês deverá ser servo... Pois nem mesmo o Filho do homem veio para ser servido, mas para servir.',
    'Lucas 14:11':
      'Pois todo o que se exalta será humilhado, e o que se humilha será exaltado.',
    'Johannes 13:14-15':
      'Pois bem, se eu, sendo Senhor e Mestre de vocês, lavei os seus pés, vocês também devem lavar os pés uns dos outros. Eu dei o exemplo.',
    'Matteüs 5:5': 'Bem-aventurados os humildes, pois eles receberão a terra por herança.',
    'Matteüs 5:7': 'Bem-aventurados os misericordiosos, pois obterão misericórdia.',
    'Lucas 6:36': 'Sejam misericordiosos, assim como o Pai de vocês é misericordioso.',
    'Matteüs 12:34-37':
      'Pois a boca fala do que está cheio o coração... Mas eu digo que, no dia do juízo, os homens haverão de dar conta de toda palavra inútil que tiverem falado.',
    'Matteüs 15:11':
      'O que entra pela boca não torna o homem impuro; mas o que sai de sua boca, isto o torna impuro.',
    'Lucas 16:10':
      'Quem é fiel no pouco, também é fiel no muito, e quem é desonesto no pouco, também é desonesto no muito.',
    'Matteüs 25:21':
      'Muito bem, servo bom e fiel! Você foi fiel no pouco; eu o porei sobre o muito.',
    'Lucas 12:48':
      'A quem muito foi dado, muito será exigido; e a quem muito foi confiado, muito mais será pedido.',
    'Matteüs 5:6': 'Bem-aventurados os que têm fome e sede de justiça, pois serão satisfeitos.',
    'Matteüs 23:23':
      'Ai de vocês... porque dão o dízimo da hortelã, do endro e do cominho, mas têm negligenciado os preceitos mais importantes da lei: a justiça, a misericórdia e a fidelidade.',
    'Johannes 7:24': 'Não julguem apenas pela aparência, mas façam julgamentos justos.',
    'Matteüs 18:5-6':
      'E quem receber uma destas crianças em meu nome, está me recebendo. Mas se alguém fizer tropeçar um destes pequeninos que creem em mim, melhor lhe seria amarrar uma pedra de moinho no pescoço.',
    'Matteüs 19:14':
      'Deixem vir a mim as crianças e não as impeçam; pois o Reino dos céus pertence aos que são semelhantes a elas.',
    'Marcus 9:36-37':
      'Tomou uma criança e a colocou no meio deles. Pegando-a nos braços, disse-lhes: «Quem recebe uma destas crianças em meu nome, está me recebendo».',
  },
};

export function localizeBibleSource(source: BibleSource, lang: SupportedLang): BibleSource {
  if (lang === 'nl') return source;
  const reference = localizeBibleReference(source.reference, lang);
  const url = buildBibleUrl(source.reference, source.url, lang);
  const quote =
    BIBLE_QUOTES[lang][source.reference] ??
    BIBLE_QUOTES.en[source.reference] ??
    source.quote;
  return {
    ...source,
    reference,
    quote,
    url,
  };
}

export function localizeGuideline(
  guideline: JesusGuideline,
  lang: SupportedLang,
): JesusGuideline {
  if (lang === 'nl') return guideline;
  const title =
    GUIDELINE_TITLES[lang][guideline.id] ??
    GUIDELINE_TITLES.en[guideline.id] ??
    guideline.title;
  return {
    ...guideline,
    title,
    sources: guideline.sources.map((s) => localizeBibleSource(s, lang)),
  };
}
