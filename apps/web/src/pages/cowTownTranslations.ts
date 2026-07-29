export type CowTownLanguage = "en" | "es" | "fr";

type TranslationEntry = readonly [english: string, spanish: string, french: string];

const entries: TranslationEntry[] = [
  ["Livestock Recovery System", "Sistema de Recuperaci\u00f3n de Ganado", "Syst\u00e8me de R\u00e9cup\u00e9ration du B\u00e9tail"],
  ["See Live Tag", "Ver Etiqueta Activa", "Voir l\u2019\u00c9tiquette Active"],
  ["Livestock identification connected to real recovery", "Identificaci\u00f3n de ganado conectada a una recuperaci\u00f3n real", "Identification du b\u00e9tail reli\u00e9e \u00e0 une vraie r\u00e9cup\u00e9ration"],
  ["Help your livestock", "Ayuda a tu ganado", "Aidez votre b\u00e9tail"],
  ["get home faster.", "a volver a casa m\u00e1s r\u00e1pido.", "\u00e0 rentrer plus vite."],
  ["If livestock gets out, someone can scan the ear tag, share the location and help the ranch take the right next action.", "Si el ganado se escapa, alguien puede escanear la etiqueta, compartir la ubicaci\u00f3n y ayudar al rancho a tomar la siguiente acci\u00f3n correcta.", "Si du b\u00e9tail s\u2019\u00e9chappe, une personne peut scanner l\u2019\u00e9tiquette, partager l\u2019emplacement et aider la ferme \u00e0 prendre la bonne prochaine mesure."],
  ["See CT-0847 Live", "Ver CT-0847 Activo", "Voir CT-0847 en Direct"],
  ["Protect My Herd", "Proteger Mi Reba\u00f1o", "Prot\u00e9ger Mon Troupeau"],
  ["No public app needed", "No se necesita aplicaci\u00f3n p\u00fablica", "Aucune application publique requise"],
  ["Scan and report", "Escanear y reportar", "Scanner et signaler"],
  ["Reach the ranch fast", "Contactar al rancho r\u00e1pido", "Joindre la ferme rapidement"],
  ["Real livestock. Real recovery.", "Ganado real. Recuperaci\u00f3n real.", "Du vrai b\u00e9tail. Une vraie r\u00e9cup\u00e9ration."],
  ["One visible tag can change what happens next.", "Una etiqueta visible puede cambiar lo que sucede despu\u00e9s.", "Une \u00e9tiquette visible peut changer la suite des \u00e9v\u00e9nements."],
  ["See how it works", "Mira c\u00f3mo funciona", "Voyez comment \u00e7a fonctionne"],
  ["If someone finds your livestock,", "Si alguien encuentra tu ganado,", "Si quelqu\u2019un trouve votre b\u00e9tail,"],
  ["this is all they do.", "esto es todo lo que debe hacer.", "voici tout ce qu\u2019il doit faire."],
  ["They see the tag, scan it with their phone and the animal\u2019s public recovery page opens.", "Ve la etiqueta, la escanea con su tel\u00e9fono y se abre la p\u00e1gina p\u00fablica de recuperaci\u00f3n del animal.", "La personne voit l\u2019\u00e9tiquette, la scanne avec son t\u00e9l\u00e9phone et la page publique de r\u00e9cup\u00e9ration de l\u2019animal s\u2019ouvre."],
  ["They see the tag.", "Ve la etiqueta.", "Elle voit l\u2019\u00e9tiquette."],
  ["A visible animal number and recovery QR code.", "Un n\u00famero visible del animal y un c\u00f3digo QR de recuperaci\u00f3n.", "Un num\u00e9ro d\u2019animal visible et un code QR de r\u00e9cup\u00e9ration."],
  ["They scan it.", "La escanea.", "Elle la scanne."],
  ["The camera opens the public livestock page.", "La c\u00e1mara abre la p\u00e1gina p\u00fablica del ganado.", "La cam\u00e9ra ouvre la page publique du b\u00e9tail."],
  ["Scan the visible tag", "Escanea la etiqueta visible", "Scannez l\u2019\u00e9tiquette visible"],
  ["The livestock page opens.", "Se abre la p\u00e1gina del ganado.", "La page du b\u00e9tail s\u2019ouvre."],
  ["The finder sees exactly what to do next.", "La persona sabe exactamente qu\u00e9 hacer despu\u00e9s.", "La personne sait exactement quoi faire ensuite."],
  ["No app. No account. Just scan and help.", "Sin aplicaci\u00f3n. Sin cuenta. Solo escanea y ayuda.", "Aucune application. Aucun compte. Il suffit de scanner et d\u2019aider."],
  ["The finder gets the information and safe next action needed to help the ranch.", "La persona recibe la informaci\u00f3n y la siguiente acci\u00f3n segura necesaria para ayudar al rancho.", "La personne obtient l\u2019information et la prochaine mesure s\u00e9curitaire n\u00e9cessaire pour aider la ferme."],
  ["Try the live tag", "Probar la etiqueta activa", "Essayer l\u2019\u00e9tiquette active"],
  ["Active and ready", "Activo y listo", "Actif et pr\u00eat"],
  ["The tag is connected", "La etiqueta est\u00e1 conectada", "L\u2019\u00e9tiquette est connect\u00e9e"],
  ["One visible tag.", "Una etiqueta visible.", "Une \u00e9tiquette visible."],
  ["A live recovery page for your livestock.", "Una p\u00e1gina activa de recuperaci\u00f3n para tu ganado.", "Une page de r\u00e9cup\u00e9ration active pour votre b\u00e9tail."],
  ["The ear tag connects directly to the animal\u2019s public page. If the animal gets out, the person who finds it has one clear place to identify the livestock and help the ranch.", "La etiqueta se conecta directamente con la p\u00e1gina p\u00fablica del animal. Si el animal se escapa, quien lo encuentre tiene un lugar claro para identificarlo y ayudar al rancho.", "L\u2019\u00e9tiquette se connecte directement \u00e0 la page publique de l\u2019animal. Si l\u2019animal s\u2019\u00e9chappe, la personne qui le trouve dispose d\u2019un endroit clair pour l\u2019identifier et aider la ferme."],
  ["Animal identity", "Identidad del animal", "Identit\u00e9 de l\u2019animal"],
  ["Cow Town ID, animal number, species and identifying details.", "ID de Cow Town, n\u00famero del animal, especie y detalles de identificaci\u00f3n.", "Identifiant Cow Town, num\u00e9ro de l\u2019animal, esp\u00e8ce et d\u00e9tails d\u2019identification."],
  ["Reach the ranch", "Contactar al rancho", "Joindre la ferme"],
  ["Give the finder a direct way to call or text the ranch.", "Dale a quien lo encuentre una forma directa de llamar o enviar un mensaje al rancho.", "Donnez \u00e0 la personne un moyen direct d\u2019appeler la ferme ou de lui envoyer un message."],
  ["Report location", "Reportar ubicaci\u00f3n", "Signaler l\u2019emplacement"],
  ["Share where the animal was seen and its direction of travel.", "Comparte d\u00f3nde fue visto el animal y hacia d\u00f3nde se dirig\u00eda.", "Partagez l\u2019endroit o\u00f9 l\u2019animal a \u00e9t\u00e9 vu et sa direction."],
  ["Lost mode", "Modo perdido", "Mode perdu"],
  ["Show the last known location and the information that matters.", "Muestra la \u00faltima ubicaci\u00f3n conocida y la informaci\u00f3n importante.", "Affichez le dernier emplacement connu et les renseignements importants."],
  ["Keep it current", "Mantenerlo actualizado", "Gardez les renseignements \u00e0 jour"],
  ["Update status, safety notes and recovery information.", "Actualiza el estado, las notas de seguridad y la informaci\u00f3n de recuperaci\u00f3n.", "Mettez \u00e0 jour l\u2019\u00e9tat, les notes de s\u00e9curit\u00e9 et les renseignements de r\u00e9cup\u00e9ration."],
  ["See the Live Livestock Page", "Ver la P\u00e1gina Activa del Ganado", "Voir la Page Active du B\u00e9tail"],
  ["When livestock is found", "Cuando se encuentra ganado", "Lorsqu\u2019on trouve du b\u00e9tail"],
  ["Scan the tag.", "Escanea la etiqueta.", "Scannez l\u2019\u00e9tiquette."],
  ["Report the location right away.", "Reporta la ubicaci\u00f3n de inmediato.", "Signalez imm\u00e9diatement l\u2019emplacement."],
  ["The public page opens immediately with the information and safe actions needed to help the ranch respond.", "La p\u00e1gina p\u00fablica se abre de inmediato con la informaci\u00f3n y las acciones seguras necesarias para ayudar al rancho.", "La page publique s\u2019ouvre imm\u00e9diatement avec les renseignements et les mesures s\u00e9curitaires n\u00e9cessaires pour aider la ferme."],
  ["No app to download", "No hay aplicaci\u00f3n que descargar", "Aucune application \u00e0 t\u00e9l\u00e9charger"],
  ["No finder account or login", "Sin cuenta ni inicio de sesi\u00f3n", "Aucun compte ni connexion"],
  ["Call or text the ranch", "Llama o env\u00eda un mensaje al rancho", "Appelez la ferme ou envoyez-lui un message"],
  ["Report a current or earlier sighting", "Reporta un avistamiento actual o anterior", "Signalez une observation actuelle ou ant\u00e9rieure"],
  ["Add movement, condition and safety details", "Agrega detalles de movimiento, condici\u00f3n y seguridad", "Ajoutez des d\u00e9tails sur le d\u00e9placement, l\u2019\u00e9tat et la s\u00e9curit\u00e9"],
  ["Location reported", "Ubicaci\u00f3n reportada", "Emplacement signal\u00e9"],
  ["The ranch now knows where to begin.", "El rancho ahora sabe por d\u00f3nde empezar.", "La ferme sait maintenant par o\u00f9 commencer."],
  ["More than a QR code", "M\u00e1s que un c\u00f3digo QR", "Plus qu\u2019un code QR"],
  ["The scan is only", "El escaneo es solo", "Le scan n\u2019est que"],
  ["the beginning.", "el comienzo.", "le d\u00e9but."],
  ["A public scan or location report becomes active information inside the ranch system. The recovery can be reviewed, assigned, coordinated and preserved from beginning to outcome.", "Un escaneo p\u00fablico o reporte de ubicaci\u00f3n se convierte en informaci\u00f3n activa dentro del sistema del rancho. La recuperaci\u00f3n puede revisarse, asignarse, coordinarse y conservarse desde el inicio hasta el resultado.", "Un scan public ou un signalement d\u2019emplacement devient une information active dans le syst\u00e8me de la ferme. La r\u00e9cup\u00e9ration peut \u00eatre examin\u00e9e, assign\u00e9e, coordonn\u00e9e et conserv\u00e9e du d\u00e9but au r\u00e9sultat."],
  ["Origin \u2192 action \u2192 recovery \u2192 outcome", "Origen \u2192 acci\u00f3n \u2192 recuperaci\u00f3n \u2192 resultado", "Origine \u2192 action \u2192 r\u00e9cup\u00e9ration \u2192 r\u00e9sultat"],
  ["CT-0847 \u00b7 LIVE ACTIVITY", "CT-0847 \u00b7 ACTIVIDAD EN VIVO", "CT-0847 \u00b7 ACTIVIT\u00c9 EN DIRECT"],
  ["Loose livestock recovery", "Recuperaci\u00f3n de ganado suelto", "R\u00e9cup\u00e9ration de b\u00e9tail en libert\u00e9"],
  ["LIVE", "EN VIVO", "EN DIRECT"],
  ["Tag scanned", "Etiqueta escaneada", "\u00c9tiquette scann\u00e9e"],
  ["Public livestock page opened from a phone.", "La p\u00e1gina p\u00fablica del ganado se abri\u00f3 desde un tel\u00e9fono.", "La page publique du b\u00e9tail a \u00e9t\u00e9 ouverte depuis un t\u00e9l\u00e9phone."],
  ["Animal seen near a roadway and moving east.", "Animal visto cerca de una carretera y movi\u00e9ndose hacia el este.", "Animal vu pr\u00e8s d\u2019une route et se dirigeant vers l\u2019est."],
  ["Ranch notified", "Rancho notificado", "Ferme avis\u00e9e"],
  ["Report entered the recovery Live Board.", "El reporte entr\u00f3 al Live Board de recuperaci\u00f3n.", "Le signalement a \u00e9t\u00e9 ajout\u00e9 au Live Board de r\u00e9cup\u00e9ration."],
  ["Recovery underway", "Recuperaci\u00f3n en curso", "R\u00e9cup\u00e9ration en cours"],
  ["Ranch team dispatched to the reported location.", "El equipo del rancho fue enviado a la ubicaci\u00f3n reportada.", "L\u2019\u00e9quipe de la ferme a \u00e9t\u00e9 envoy\u00e9e \u00e0 l\u2019emplacement signal\u00e9."],
  ["Animal safely contained", "Animal contenido de forma segura", "Animal contenu en toute s\u00e9curit\u00e9"],
  ["Identity confirmed as CT-0847.", "Identidad confirmada como CT-0847.", "Identit\u00e9 confirm\u00e9e comme CT-0847."],
  ["Recovery complete", "Recuperaci\u00f3n completa", "R\u00e9cup\u00e9ration termin\u00e9e"],
  ["Animal returned and incident closed.", "Animal devuelto e incidente cerrado.", "Animal ramen\u00e9 et incident ferm\u00e9."],
  ["Two ways to begin", "Dos formas de comenzar", "Deux fa\u00e7ons de commencer"],
  ["Start with new Cow Town Tags or", "Comienza con nuevas Cow Town Tags o", "Commencez avec de nouvelles Cow Town Tags ou"],
  ["upgrade the tags already being worn.", "mejora las etiquetas que ya est\u00e1n usando.", "am\u00e9liorez les \u00e9tiquettes d\u00e9j\u00e0 port\u00e9es."],
  ["Ranchers should not have to discard a working identification system just to gain modern recovery capability.", "Los rancheros no deber\u00edan tener que desechar un sistema de identificaci\u00f3n que funciona para obtener una capacidad moderna de recuperaci\u00f3n.", "Les producteurs ne devraient pas avoir \u00e0 abandonner un syst\u00e8me d\u2019identification fonctionnel pour profiter d\u2019une capacit\u00e9 moderne de r\u00e9cup\u00e9ration."],
  ["Complete Cow Town ear tag", "Etiqueta auricular Cow Town completa", "\u00c9tiquette auriculaire Cow Town compl\u00e8te"],
  ["Cow Town Tag", "Cow Town Tag", "Cow Town Tag"],
  ["A brand-new oversized livestock ear tag built specifically for identification and public recovery. The large animal number can be read quickly, while the built-in QR code gives anyone who finds the animal a clear next step: scan the tag, identify the ranch and report the animal\u2019s location.", "Una etiqueta auricular grande y nueva, creada espec\u00edficamente para identificaci\u00f3n y recuperaci\u00f3n p\u00fablica. El n\u00famero grande puede leerse r\u00e1pidamente y el c\u00f3digo QR integrado le da a quien encuentre el animal un siguiente paso claro: escanear, identificar el rancho y reportar la ubicaci\u00f3n.", "Une toute nouvelle grande \u00e9tiquette auriculaire con\u00e7ue pour l\u2019identification et la r\u00e9cup\u00e9ration publique. Le grand num\u00e9ro se lit rapidement et le code QR int\u00e9gr\u00e9 donne une prochaine \u00e9tape claire: scanner l\u2019\u00e9tiquette, identifier la ferme et signaler l\u2019emplacement."],
  ["Large animal number that can be read quickly", "N\u00famero grande del animal que puede leerse r\u00e1pidamente", "Grand num\u00e9ro d\u2019animal facile \u00e0 lire"],
  ["Built-in QR code, not an added sticker", "C\u00f3digo QR integrado, no una calcoman\u00eda agregada", "Code QR int\u00e9gr\u00e9, pas un autocollant ajout\u00e9"],
  ["Clear \u201cFOUND? SCAN ME\u201d instructions", "Instrucciones claras \u201c\u00bfENCONTRADO? ESCAN\u00c9AME\u201d", "Instructions claires \u00ab TROUV\u00c9? SCANNEZ-MOI \u00bb"],
  ["Permanent Cow Town recovery ID", "ID permanente de recuperaci\u00f3n Cow Town", "Identifiant permanent de r\u00e9cup\u00e9ration Cow Town"],
  ["Designed for future RFID expansion", "Dise\u00f1ado para futura expansi\u00f3n RFID", "Con\u00e7u pour une future expansion RFID"],
  ["Keep the tag. Add the recovery system.", "Conserva la etiqueta. Agrega el sistema de recuperaci\u00f3n.", "Gardez l\u2019\u00e9tiquette. Ajoutez le syst\u00e8me de r\u00e9cup\u00e9ration."],
  ["Cow Town Sticker Upgrade", "Mejora con Calcoman\u00eda Cow Town", "Mise \u00e0 Niveau avec Autocollant Cow Town"],
  ["A durable QR sticker applied directly to the livestock ear tag the animal already wears. The ranch keeps its existing animal number and numbering system, while the sticker adds a unique Cow Town recovery ID and the clear instruction \u201cSCAN FOR RANCH.\u201d", "Una calcoman\u00eda QR duradera aplicada directamente a la etiqueta que el animal ya usa. El rancho conserva su n\u00famero y sistema existentes, mientras la calcoman\u00eda agrega un ID \u00fanico de recuperaci\u00f3n Cow Town y la instrucci\u00f3n clara \u201cESCANEAR PARA CONTACTAR AL RANCHO\u201d.", "Un autocollant QR durable appliqu\u00e9 directement sur l\u2019\u00e9tiquette d\u00e9j\u00e0 port\u00e9e. La ferme conserve son num\u00e9ro et son syst\u00e8me existants, tandis que l\u2019autocollant ajoute un identifiant Cow Town unique et l\u2019instruction claire \u00ab SCANNER POUR JOINDRE LA FERME \u00bb."],
  ["Attaches directly to the existing ear tag", "Se adhiere directamente a la etiqueta existente", "Se fixe directement \u00e0 l\u2019\u00e9tiquette existante"],
  ["Keeps the original animal number in place", "Mantiene el n\u00famero original del animal", "Conserve le num\u00e9ro original de l\u2019animal"],
  ["Clearly labeled \u201cSCAN FOR RANCH\u201d", "Claramente marcado \u201cESCANEAR PARA EL RANCHO\u201d", "Clairement indiqu\u00e9 \u00ab SCANNER POUR LA FERME \u00bb"],
  ["Waterproof and UV-resistant QR sticker", "Calcoman\u00eda QR impermeable y resistente a rayos UV", "Autocollant QR imperm\u00e9able et r\u00e9sistant aux UV"],
  ["Each sticker opens that animal\u2019s live recovery page", "Cada calcoman\u00eda abre la p\u00e1gina activa de recuperaci\u00f3n de ese animal", "Chaque autocollant ouvre la page active de r\u00e9cup\u00e9ration de cet animal"],
  ["Lower-cost way to activate an existing herd", "Una forma de menor costo para activar un reba\u00f1o existente", "Une fa\u00e7on moins co\u00fbteuse d\u2019activer un troupeau existant"],
  ["Built beyond the tag", "Construido m\u00e1s all\u00e1 de la etiqueta", "Con\u00e7u au-del\u00e0 de l\u2019\u00e9tiquette"],
  ["A livestock recovery system that can grow into a complete ranch operating system.", "Un sistema de recuperaci\u00f3n de ganado que puede crecer hasta convertirse en un sistema operativo completo para el rancho.", "Un syst\u00e8me de r\u00e9cup\u00e9ration du b\u00e9tail qui peut devenir un syst\u00e8me d\u2019exploitation complet pour la ferme."],
  ["Animal records, public sightings, lost and escaped livestock, safe recovery, ranch assignments, proof, activity timelines, Intelligence and future RFID support can remain connected.", "Los registros de animales, avistamientos p\u00fablicos, ganado perdido o escapado, recuperaci\u00f3n segura, asignaciones, pruebas, l\u00edneas de tiempo, Intelligence y futuro soporte RFID pueden permanecer conectados.", "Les dossiers d\u2019animaux, observations publiques, animaux perdus ou \u00e9chapp\u00e9s, r\u00e9cup\u00e9ration s\u00e9curitaire, affectations, preuves, chronologies, Intelligence et futur soutien RFID peuvent rester connect\u00e9s."],
  ["Explore Tag Options", "Explorar Opciones de Etiquetas", "Explorer les Options d\u2019\u00c9tiquettes"],
  ["Built on HomePlanet for real livestock recovery.", "Construido en HomePlanet para una recuperaci\u00f3n real de ganado.", "Con\u00e7u sur HomePlanet pour une vraie r\u00e9cup\u00e9ration du b\u00e9tail."],
  ["Questions about Cow Town Tags?", "\u00bfPreguntas sobre Cow Town Tags?", "Des questions sur Cow Town Tags?"],
  ["Contact Us", "Cont\u00e1ctanos", "Nous Joindre"],
  ["Message received", "Mensaje recibido", "Message re\u00e7u"],
  ["We will get back to you soon.", "Nos comunicaremos contigo pronto.", "Nous vous r\u00e9pondrons bient\u00f4t."],
  ["Done", "Listo", "Termin\u00e9"],
  ["Send a quick message and tell us how we can reach you.", "Env\u00eda un mensaje breve y dinos c\u00f3mo podemos comunicarnos contigo.", "Envoyez un court message et dites-nous comment vous joindre."],
  ["Your name", "Tu nombre", "Votre nom"],
  ["Phone number or email", "N\u00famero de tel\u00e9fono o correo electr\u00f3nico", "Num\u00e9ro de t\u00e9l\u00e9phone ou courriel"],
  ["Ranch or business name", "Nombre del rancho o negocio", "Nom de la ferme ou de l\u2019entreprise"],
  ["Optional", "Opcional", "Facultatif"],
  ["Message", "Mensaje", "Message"],
  ["Sending...", "Enviando...", "Envoi en cours..."],
  ["Send Message", "Enviar Mensaje", "Envoyer le Message"],
  ["Close contact form", "Cerrar formulario de contacto", "Fermer le formulaire de contact"]
];

const index = {
  es: new Map<string, string>(),
  fr: new Map<string, string>(),
};

const reverse = {
  es: new Map<string, string>(),
  fr: new Map<string, string>(),
};

for (const [english, spanish, french] of entries) {
  index.es.set(english, spanish);
  index.fr.set(english, french);
  reverse.es.set(spanish, english);
  reverse.fr.set(french, english);
}

function normalize(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function translateValue(value: string, language: CowTownLanguage) {
  const normalized = normalize(value);

  if (!normalized) {
    return value;
  }

  let english = normalized;

  for (const map of Object.values(reverse)) {
    english = map.get(english) || english;
  }

  if (language === "en") {
    return english;
  }

  return index[language].get(english) || english;
}

function preserveWhitespace(original: string, translated: string) {
  const leading = original.match(/^\s*/)?.[0] || "";
  const trailing = original.match(/\s*$/)?.[0] || "";

  return leading + translated + trailing;
}

export function translateCowTownPage(
  root: HTMLElement,
  language: CowTownLanguage
) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT
  );

  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }

  for (const node of textNodes) {
    const current = node.nodeValue || "";
    const translated = translateValue(current, language);

    if (normalize(current) !== translated) {
      node.nodeValue = preserveWhitespace(current, translated);
    }
  }

  const attributes = ["aria-label", "alt", "title", "placeholder"];

  for (const element of root.querySelectorAll<HTMLElement>("*")) {
    for (const attribute of attributes) {
      const current = element.getAttribute(attribute);

      if (!current) {
        continue;
      }

      const translated = translateValue(current, language);

      if (translated !== normalize(current)) {
        element.setAttribute(attribute, translated);
      }
    }
  }
}
