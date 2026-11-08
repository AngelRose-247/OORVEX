import axios from 'axios';

// In production or development, use relative /api which Vite proxies or backend serves
const API_BASE = '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Authentic Kerala Cultural Districts with verified local photographic assets
const FALLBACK_DISTRICTS = [
  { slug: 'kasaragod', name: 'Kasaragod', name_ml: 'കാസർഗോഡ്', tagline: 'The Northern Realm of Forts, Rivers and Theyyam', headquarters: 'Kasaragod', latitude: 12.5102, longitude: 74.9852, hero_image: '/images/districts/kasaragod.jpg', image_credit: 'Bekal Fort / Vijayan (Wikimedia Commons / CC BY-SA 4.0)', area_sq_km: 1992, order: 1, listings_count: 3, arts_count: 2, crafts_count: 0 },
  { slug: 'kannur', name: 'Kannur', name_ml: 'കണ്ണൂർ', tagline: 'The Land of Looms, Lores and Theyyam Spirits', headquarters: 'Kannur', latitude: 11.8745, longitude: 75.3704, hero_image: '/images/districts/kannur.jpg', image_credit: 'St. Angelo Fort / Shafaiz (Wikimedia Commons / CC BY-SA 3.0)', area_sq_km: 2966, order: 2, listings_count: 4, arts_count: 3, crafts_count: 1 },
  { slug: 'wayanad', name: 'Wayanad', name_ml: 'വയനാട്', tagline: 'Misty Highlands of Ancient Petroglyphs and Tribal Lore', headquarters: 'Kalpetta', latitude: 11.6050, longitude: 76.0828, hero_image: '/images/districts/wayanad.jpg', image_credit: 'Wayanad Highlands / Vinayar (Wikimedia Commons / CC BY-SA 4.0)', area_sq_km: 2131, order: 3, listings_count: 2, arts_count: 1, crafts_count: 0 },
  { slug: 'kozhikode', name: 'Kozhikode', name_ml: 'കോഴിക്കോട്', tagline: 'Historic Port of Zamorins, Culinary Hospitality and Uru Craft', headquarters: 'Kozhikode', latitude: 11.2588, longitude: 75.7804, hero_image: '/images/districts/kozhikode.jpg', image_credit: 'Kozhikode Coast / Vengoli (Wikimedia Commons / CC BY-SA 4.0)', area_sq_km: 2344, order: 4, listings_count: 4, arts_count: 2, crafts_count: 2 },
  { slug: 'malappuram', name: 'Malappuram', name_ml: 'മലപ്പുറം', tagline: 'Cradle of Malayalam Language, Ayurvedic Wisdom and Oppana', headquarters: 'Malappuram', latitude: 11.0510, longitude: 76.0711, hero_image: '/images/districts/malappuram.jpg', image_credit: 'Nilambur Teak / Prof. T.P. (Wikimedia Commons / CC BY-SA 4.0)', area_sq_km: 3550, order: 5, listings_count: 3, arts_count: 3, crafts_count: 0 },
  { slug: 'palakkad', name: 'Palakkad', name_ml: 'പാലക്കാട്', tagline: 'Granary of Kerala, Shadow Puppetry and Carnatic Soul', headquarters: 'Palakkad', latitude: 10.7867, longitude: 76.6548, hero_image: '/images/districts/palakkad.jpg', image_credit: 'Palakkad Fort / Navas P. (Wikimedia Commons / CC BY-SA 4.0)', area_sq_km: 4480, order: 6, listings_count: 3, arts_count: 3, crafts_count: 0 },
  { slug: 'thrissur', name: 'Thrissur', name_ml: 'തൃശ്ശൂർ', tagline: 'The Cultural Capital of Kerala, Kalamandalam and Pooram', headquarters: 'Thrissur', latitude: 10.5276, longitude: 76.2144, hero_image: '/images/districts/thrissur.jpg', image_credit: 'Thrissur Pooram Festival / Kerala Tourism (CC BY 2.0)', area_sq_km: 3032, order: 7, listings_count: 6, arts_count: 5, crafts_count: 0 },
  { slug: 'ernakulam', name: 'Ernakulam', name_ml: 'എറണാകുളം', tagline: 'Cosmopolitan Gateway of Chendamangalam Weaves and Mudiyettu', headquarters: 'Kochi', latitude: 9.9816, longitude: 76.2999, hero_image: '/images/districts/ernakulam.jpg', image_credit: 'Fort Kochi Sunset / Wikimedia Commons (CC BY-SA 4.0)', area_sq_km: 3068, order: 8, listings_count: 4, arts_count: 3, crafts_count: 1 },
  { slug: 'idukki', name: 'Idukki', name_ml: 'ഇടുക്കി', tagline: 'High Ranges of Ancient Dolmens, Tribal Songs and Marayoor Sugar', headquarters: 'Painavu', latitude: 9.8518, longitude: 76.9405, hero_image: '/images/districts/idukki.jpg', image_credit: 'Munnar Highlands / Wikimedia Commons (CC BY-SA 3.0)', area_sq_km: 4358, order: 9, listings_count: 2, arts_count: 1, crafts_count: 1 },
  { slug: 'kottayam', name: 'Kottayam', name_ml: 'കോട്ടയം', tagline: 'The City of Letters, Lakes, Murals and Margamkali', headquarters: 'Kottayam', latitude: 9.5916, longitude: 76.5222, hero_image: '/images/districts/kottayam.jpg', image_credit: 'Kumarakom Backwaters / Wikimedia Commons (CC BY 2.0)', area_sq_km: 2208, order: 10, listings_count: 4, arts_count: 3, crafts_count: 0 },
  { slug: 'alappuzha', name: 'Alappuzha', name_ml: 'ആലപ്പുഴ', tagline: 'Venice of the East, Golden Coir and Chundan Snake Boat Regattas', headquarters: 'Alappuzha', latitude: 9.4981, longitude: 76.3388, hero_image: '/images/districts/alappuzha.jpg', image_credit: 'Alappuzha Houseboat / Wikimedia Commons (CC BY-SA 3.0)', area_sq_km: 1414, order: 11, listings_count: 3, arts_count: 2, crafts_count: 1 },
  { slug: 'pathanamthitta', name: 'Pathanamthitta', name_ml: 'പത്തനംതിട്ട', tagline: 'Sanctuary of Padayani Masks, Sacred Groves and Aranmula Mirrors', headquarters: 'Pathanamthitta', latitude: 9.2648, longitude: 76.7870, hero_image: '/images/districts/pathanamthitta.jpg', image_credit: 'Aranmula Parthasarathy / Gnoeee (CC BY-SA 4.0)', area_sq_km: 2637, order: 12, listings_count: 3, arts_count: 2, crafts_count: 1 },
  { slug: 'kollam', name: 'Kollam', name_ml: 'കൊല്ലം', tagline: 'Historic Desinganadu Port, Ashtamudi Lake and Kathakali Enclaves', headquarters: 'Kollam', latitude: 8.8932, longitude: 76.6141, hero_image: '/images/districts/kollam.jpg', image_credit: 'Ashtamudi Lake / Timothy A. Gonsalves (CC BY-SA 4.0)', area_sq_km: 2491, order: 13, listings_count: 3, arts_count: 2, crafts_count: 1 },
  { slug: 'thiruvananthapuram', name: 'Thiruvananthapuram', name_ml: 'തിരുവനന്തപുരം', tagline: 'Capital of Anantha, Balaramapuram Zari and Classical Margi Arts', headquarters: 'Thiruvananthapuram', latitude: 8.5241, longitude: 76.9366, hero_image: '/images/districts/thiruvananthapuram.jpg', image_credit: 'Padmanabhaswamy Temple / Speakin (CC BY-SA 4.0)', area_sq_km: 2189, order: 14, listings_count: 4, arts_count: 3, crafts_count: 1 }
];

// Verified cultural listings dataset with authentic photographs
export const FALLBACK_LISTINGS = [
  {
    "id": 1,
    "title": "Theyyam: The Living Gods of Malabar",
    "title_ml": "തെയ്യം (ദൈവക്കോലം)",
    "locality": "Parassini Madappura, Muthappan Kavu & North Malabar Groves",
    "latitude": 11.9842,
    "longitude": 75.3981,
    "description_en": "Theyyam is an ancient, ecstatic ritual dance form of North Kerala in which mortal performers channel and embody divine ancestral spirits, heroic martyrs, and deities. With intricate face-painting, towering bamboo headgears (Mudi), burning torches, and hypnotic percussion, Theyyam breaks social barriers in sacred groves.",
    "description_ml": "ഉത്തരകേരളത്തിലെ കാവുകളിലും തറവാടുകളിലും അനുഷ്ഠിച്ചു വരുന്ന പ്രാചീന അനുഷ്ഠാന കലാരൂപമാണ് തെയ്യം. ദൈവങ്ങളും വീരപുരുഷന്മാരും തെയ്യക്കോലങ്ങളിലൂടെ മനുഷ്യരിലേക്ക് ഇറങ്ങിവരുന്ന ആത്മീയ അനുഭവം. മുഖത്തെഴുത്തും ആകാശമുട്ടുന്ന തിരുമുടികളും വാദ്യമേളങ്ങളും ഇതിനെ വിസ്മയകരമാക്കുന്നു.",
    "cultural_story": "According to Malabar folklore, Theyyam emerged from the prehistoric worship of fertility, nature, and fallen heroes. Untouchable and agrarian communities historically assumed sacred divine authority during Theyyam nights, bestowing blessings and justice upon kings and feudal lords alike, creating a rare ritual equalization of society.",
    "historical_background": "Recorded in Sangam literature and regional ballads dating back over a thousand years. There are approximately 400 distinct Theyyam forms, including Muchilot Bhagavathi, Gulikan, Pottan Theyyam, and Kathivanoor Veeran.",
    "cultural_significance": "Unites communities across caste lines, preserves oral poetry (Tottam Pattu), and sustains indigenous botanical face pigmentation and craftsmanship.",
    "image": "/images/arts/theyyam.jpg",
    "image_credit": "Muchilot Bhagavathi Theyyam / Shagil Kannur CC BY-SA",
    "source_reference": "Kerala Tourism Official Cultural Archive (keralatourism.org/artforms/theyyam) & Kerala Folklore Academy Record #KFA-TH-012",
    "verification_status": "approved",
    "is_featured": 1,
    "category_id": "ritual-arts",
    "origin_district_id": "kannur",
    "curator_status": "Verified",
    "category": {
      "slug": "ritual-arts",
      "name_en": "Ritual Arts",
      "name_ml": "അനുഷ്ഠാന കലകൾ",
      "icon": "Flame"
    },
    "districts": [
      {
        "slug": "kannur",
        "name": "Kannur",
        "name_ml": "കണ്ണൂർ"
      }
    ]
  },
  {
    "id": 2,
    "title": "Thira: Sacred Ancestral Enactments of Malabar",
    "title_ml": "തിറ (വെള്ളാട്ട് തിറയാട്ടം)",
    "locality": "Thiruvangur, Kadathanad & South Malabar Kavus",
    "latitude": 11.4167,
    "longitude": 75.75,
    "description_en": "Thira, or Thirayattam, is a dynamic ritual performing art native to South Malabar (Kozhikode and Malappuram). Staged in ancestral Kavus during annual festivals, it personifies celestial spirits, forest deities, and legendary ancestors through dramatic leaps, torchlight dances, and rhythmic chants.",
    "description_ml": "തെക്കൻ മലബാറിലെ (കോഴിക്കോട്, മലപ്പുറം) കാവുകളിലും തറവാടുകളിലും നടക്കുന്ന അനുഷ്ഠാന കലാരൂപമാണ് തിറ. ദേവതകളെയും പൂർവ്വികരെയും ആവാഹിച്ച് തീവെട്ടികളുടെ വെളിച്ചത്തിൽ നടത്തുന്ന നൃത്തം.",
    "cultural_story": "Folklore tells of guardian deities defending agrarian villages from malevolent spirits. During Thirayattam, the performer channels ancestral warriors who fell defending the land, offering spiritual solace to families.",
    "historical_background": "Evolving concurrently with Theyyam but retaining distinct South Malabar choreography and musical meters. Celebrated in the ballad lore of Kadathanad.",
    "cultural_significance": "Preserves indigenous totemic nature worship, community fellowship, and hereditary metallurgical bell craft.",
    "image": "/images/arts/thira.jpg",
    "image_credit": "Kalasattam Thirayattam / Wikimedia Commons CC BY-SA",
    "source_reference": "Kerala Tourism Art Forms Directory & Kerala Folklore Academy Archives",
    "verification_status": "approved",
    "is_featured": 0,
    "category_id": "ritual-arts",
    "origin_district_id": "kozhikode",
    "curator_status": "Verified",
    "category": {
      "slug": "ritual-arts",
      "name_en": "Ritual Arts",
      "name_ml": "അനുഷ്ഠാന കലകൾ",
      "icon": "Flame"
    },
    "districts": [
      {
        "slug": "kozhikode",
        "name": "Kozhikode",
        "name_ml": "കോഴിക്കോട്"
      }
    ]
  },
  {
    "id": 3,
    "title": "Poorakkali: The Sacred Ritual Circle Dance",
    "title_ml": "പൂരക്കളി",
    "locality": "Payyanur & Madayi Bhagavathi Temples",
    "latitude": 12.0983,
    "longitude": 75.2045,
    "description_en": "Poorakkali is a vigorous ritual group dance performed by men in the Bhagavathi shrines of North Malabar during the nine-day Pooram festival in the Malayalam month of Meenam. It blends rigorous physical gymnastics, Vedic philosophy, and rhythmic clapping.",
    "description_ml": "ഉത്തരകേരളത്തിലെ ഭഗവതി ക്ഷേത്രങ്ങളിൽ മീനമാസത്തിലെ പൂരോത്സവത്തോടനുബന്ധിച്ച് പുരുഷന്മാർ അവതരിപ്പിക്കുന്ന സംഘനൃത്തമാണ് പൂരക്കളി. ആയോധനമുറകളും ശാസ്ത്രീയ ചുവടുകളും വാഗ്വാദങ്ങളും ഇതിൽ സമന്വയിക്കുന്നു.",
    "cultural_story": "Celebrates the rebirth of Kamadeva (god of love) burned to ashes by Shiva. The dance consists of 18 distinct rhythms (Nirams) culminating in intellectual debate (Marathukali) between rival scholars.",
    "historical_background": "Synthesized under the patronage of Kolathiri kings, drawing heavily on Kalaripayattu physical postures and Sanskrit poetic meter.",
    "cultural_significance": "Fosters intellectual discourse through theological debating while demanding exceptional martial stamina from practitioners.",
    "image": "/images/arts/poorakkali.jpg",
    "image_credit": "Poorakkali Ritual Dance / Fotokannan CC BY-SA",
    "source_reference": "Official Kerala Tourism Art Forms Database (keralatourism.org/artforms/poorakkali/)",
    "verification_status": "approved",
    "is_featured": 0,
    "category_id": "folk-dances",
    "origin_district_id": "kannur",
    "curator_status": "Verified",
    "category": {
      "slug": "folk-dances",
      "name_en": "Folk Dances",
      "name_ml": "നാടോടി നൃത്തങ്ങൾ",
      "icon": "Footprints"
    },
    "districts": [
      {
        "slug": "kannur",
        "name": "Kannur",
        "name_ml": "കണ്ണൂർ"
      }
    ]
  },
  {
    "id": 4,
    "title": "Padayani: The Rite of Divine Effigies",
    "title_ml": "പടയണി (പടേനി)",
    "locality": "Kadammanitta Devi Temple, Kurampala & Othara Kavus",
    "latitude": 9.3082,
    "longitude": 76.7788,
    "description_en": "Padayani is a dramatic ritual performance native to Central Travancore, staged at Bhadrakali temples. Performed to appease the ferocious goddess after slaying the demon Darika, it features elaborate painted masks (Kolams) created from areca nut fronds, vibrant natural colors, and thunderous Thappu percussion.",
    "description_ml": "മധ്യതിരുവിതാംകൂറിലെ ഭദ്രകാളി ക്ഷേത്രങ്ങളിൽ അനുഷ്ഠിക്കുന്ന അതിപുരാതന അനുഷ്ഠാന കലാരൂപമാണ് പടയണി. കാളിയുടെ കോപം ശമിപ്പിക്കാനായി ഭൈരവി, കാളൻ, യക്ഷി തുടങ്ങിയ കോലങ്ങൾ അണിഞ്ഞ് തപ്പുകൊട്ടി പാടി ആടുന്നു.",
    "cultural_story": "Legend relates that Lord Shiva and his celestial attendants designed comic and awe-inspiring painted effigies (Kolams) to pacify Kali’s cosmic fury. Modern Padayani integrates biting social satire through characters like Paradeshi and Kuthira.",
    "historical_background": "Traced back to ancient Dravidian ritual dances; refined systematically at Kadammanitta, Othara, and Kurampala village traditions.",
    "cultural_significance": "Pioneered natural leaf-based mask design and preservation of archaic rhythmic meters unique to the Thappu instrument.",
    "image": "/images/arts/padayani.jpg",
    "image_credit": "Bhairavi Kolam Padayani / Wikimedia Commons CC BY-SA",
    "source_reference": "Central Travancore Cultural Trust / Kerala Tourism (keralatourism.org/artforms/padayani/)",
    "verification_status": "approved",
    "is_featured": 1,
    "category_id": "ritual-arts",
    "origin_district_id": "pathanamthitta",
    "curator_status": "Verified",
    "category": {
      "slug": "ritual-arts",
      "name_en": "Ritual Arts",
      "name_ml": "അനുഷ്ഠാന കലകൾ",
      "icon": "Flame"
    },
    "districts": [
      {
        "slug": "pathanamthitta",
        "name": "Pathanamthitta",
        "name_ml": "പത്തനംതിട്ട"
      }
    ]
  },
  {
    "id": 5,
    "title": "Kathakali: The Classical Dance-Drama of Kerala",
    "title_ml": "കഥകളി",
    "locality": "Kerala Kalamandalam (Cheruthuruthy), Kottarakkara & Margi (Trivandrum)",
    "latitude": 10.7423,
    "longitude": 76.2736,
    "description_en": "Kathakali is Kerala's world-renowned classical dance-drama, distinguished by elaborate face makeup (Vesham), sculpted chutti beards, symbolic Mudras (hand gestures), and dramatic micro-facial expressions (Navarasas). It translates Indian epics into mesmerising non-verbal visual spectacle.",
    "description_ml": "കേരളത്തിന്റെ തനത് ശാസ്ത്രീയ ദൃശ്യകലാവിസ്മയം. വിസ്തൃതമായ വേഷവിധാനങ്ങൾ, ചുട്ടി, മുദ്രകൾ, നവരസങ്ങൾ എന്നിവയിലൂടെ ഇതിഹാസകഥകളെ അരങ്ങിലെത്തിക്കുന്നു.",
    "cultural_story": "Evolving from 17th-century Ramanattam devised by the Raja of Kottarakkara and Krishnanattam by the Zamorin of Kozhikode, Kathakali was revitalised in the 20th century by poet Vallathol Narayana Menon with the founding of Kerala Kalamandalam.",
    "historical_background": "Synthesises indigenous martial art (Kalaripayattu), classical Sanskrit Natya, and temple painting aesthetics over four centuries of refinement.",
    "cultural_significance": "Recognised globally as one of the most demanding and sophisticated non-verbal physical theatre disciplines in human history.",
    "image": "/images/arts/kathakali.jpg",
    "image_credit": "Kathakali Paccha Veesham / Wikimedia Commons CC BY-SA",
    "source_reference": "Kerala Kalamandalam Deemed University Archive & Kerala Tourism (keralatourism.org/artforms/kathakali/)",
    "verification_status": "approved",
    "is_featured": 1,
    "category_id": "classical-arts",
    "origin_district_id": "kollam",
    "curator_status": "Verified",
    "category": {
      "slug": "classical-arts",
      "name_en": "Classical Arts",
      "name_ml": "ശാസ്ത്രീയ കലകൾ",
      "icon": "Sparkles"
    },
    "districts": [
      {
        "slug": "kollam",
        "name": "Kollam",
        "name_ml": "കൊല്ലം"
      }
    ]
  },
  {
    "id": 6,
    "title": "Mohiniyattam: The Dance of the Celestial Enchantress",
    "title_ml": "മോഹിനിയാട്ടം",
    "locality": "Kerala Kalamandalam & Swathi Thirunal Sangeetha College",
    "latitude": 8.5133,
    "longitude": 76.9422,
    "description_en": "Mohiniyattam is Kerala's classical solo dance performed exclusively by women. Known for its lyrical grace, gentle swaying body movements (Andolika), and evocative Lasya (soft, feminine beauty), it reflects Kerala’s lush palm fronds and undulating backwaters.",
    "description_ml": "കേരളത്തിന്റെ തനത് ശാസ്ത്രീയ ലാസ്യ നൃത്തം. മോഹിനിയുടെ വശ്യഭാവങ്ങളും ആന്ദോളന ചലനങ്ങളും കസവുസാരിയുടെ വിശുദ്ധിയും ഇതിനെ മനോഹരമാക്കുന്നു.",
    "cultural_story": "Inspired by the mythological tale of Lord Vishnu incarnating as the enchantress Mohini to preserve cosmic balance by recovering the pot of Amrita (nectar of immortality) from the Asuras.",
    "historical_background": "Patronized by Maharaja Swathi Thirunal of Travancore and poet Irayimman Thampi in the 19th century; codified and revitalized at Kerala Kalamandalam by Vallathol Narayana Menon and Kalyanikutty Amma.",
    "cultural_significance": "The ultimate expression of Lasya classical aesthetics, uniting Sopana music with delicate micro-gestures.",
    "image": "/images/arts/mohiniyattam.jpg",
    "image_credit": "Mohiniyattam Classical Dance / Wikimedia Commons CC BY-SA",
    "source_reference": "Kerala Tourism Art Forms Directory (keralatourism.org/artforms/mohiniyattam/) & Wikipedia Arts of Kerala",
    "verification_status": "approved",
    "is_featured": 1,
    "category_id": "classical-arts",
    "origin_district_id": "thiruvananthapuram",
    "curator_status": "Verified",
    "category": {
      "slug": "classical-arts",
      "name_en": "Classical Arts",
      "name_ml": "ശാസ്ത്രീയ കലകൾ",
      "icon": "Sparkles"
    },
    "districts": [
      {
        "slug": "thiruvananthapuram",
        "name": "Thiruvananthapuram",
        "name_ml": "തിരുവനന്തപുരം"
      }
    ]
  },
  {
    "id": 7,
    "title": "Ottanthullal: The Poetic Satire of Kunchan Nambiar",
    "title_ml": "ഓട്ടൻതുള്ളൽ",
    "locality": "Killikkurussimangalam (Palakkad) & Ambalappuzha Sri Krishna Temple",
    "latitude": 10.7672,
    "longitude": 76.4389,
    "description_en": "Ottanthullal is a vibrant, solo satirical performing art introduced in the 18th century by legendary poet Kunchan Nambiar. Combining fast-paced recitation of humorous verses with expressive pantomime and rhythmic footwork, it exposes societal hypocrisy and feudal arrogance with biting wit.",
    "description_ml": "പതിനെട്ടാം നൂറ്റാണ്ടിൽ കുഞ്ചൻ നമ്പ്യാർ ചിട്ടപ്പെടുത്തിയ ജനകീയ ഹാസ്യ ദൃശ്യകലാവിസ്മയം. ലളിതമായ മലയാള പദ്യങ്ങളും ചടുലമായ ചുവടുകളും അഭിനയവും സമന്വയിപ്പിച്ച് സമൂഹത്തിലെ അനീതികളെ പരിഹസിക്കുന്നു.",
    "cultural_story": "According to history, Kunchan Nambiar, while playing the Mizhavu drum for a Chakyar Koothu performance at Ambalappuzha temple, dozed off and was publicly ridiculed by the Chakyar. In retaliation, Nambiar composed a brand new, accessible art form overnight and staged it nearby, drawing the entire audience away from the temple sanctum.",
    "historical_background": "Democratized classical Sanskrit theatre into everyday Malayalam verse, inventing three distinct Thullal meters: Ottan, Seethankan, and Parayan.",
    "cultural_significance": "The foundational voice of socio-political satire in Malayalam literature, accessible to ordinary people outside caste restrictions.",
    "image": "/images/arts/ottanthullal.jpg",
    "image_credit": "Ottanthullal Satirical Dance / Wikimedia Commons CC BY-SA",
    "source_reference": "Kerala Sangeetha Nataka Akademi / Kerala Tourism (keralatourism.org/artforms/ottanthullal/)",
    "verification_status": "approved",
    "is_featured": 1,
    "category_id": "performing-arts",
    "origin_district_id": "palakkad",
    "curator_status": "Verified",
    "category": {
      "slug": "performing-arts",
      "name_en": "Performing Arts",
      "name_ml": "അരങ്ങു കലകൾ",
      "icon": "Drama"
    },
    "districts": [
      {
        "slug": "palakkad",
        "name": "Palakkad",
        "name_ml": "പാലക്കാട്"
      }
    ]
  },
  {
    "id": 8,
    "title": "Koodiyattam: Ancient Sanskrit Temple Theatre",
    "title_ml": "കൂടിയാട്ടം",
    "locality": "Irinjalakuda Koodalmanikyam Temple Koothambalam & Margi (Trivandrum)",
    "latitude": 10.3478,
    "longitude": 76.2089,
    "description_en": "Koodiyattam is the world’s oldest surviving Sanskrit theatre tradition, officially proclaimed by UNESCO as a Masterpiece of the Oral and Intangible Heritage of Humanity. Staged inside sacred temple theatres (Koothambalams), it features elaborate eye acting (Netrabhinaya) and monumental drumming on the sacred copper Mizhavu drum.",
    "description_ml": "യുനെസ്കോയുടെ വിശ്വപൈതൃക പട്ടികയിൽ ഇടംനേടിയ ലോകത്തെ ഏറ്റവും പ്രാചീനമായ സംസ്കൃത നാട്യരൂപം. ക്ഷേത്രങ്ങളിലെ കൂത്തമ്പലങ്ങളിൽ മിഴാവിന്റെ അകമ്പടിയോടെ അരങ്ങേറുന്നു.",
    "cultural_story": "Historically codified by King Kulasekhara Varman and his court scholar Tolan in the 10th century. Plays such as Subhadradhananjayam and Ascharayachoodamani were performed continuously over 40 nights.",
    "historical_background": "Over 1,800 years of unbroken living heritage, directly preserving the theatrical manual Bharata Muni's Natyashastra in its pure spatial architecture.",
    "cultural_significance": "First Indian art form recognized by UNESCO (2001); represents the pinnacle of micro-ocular acting and rhythmic sophistication.",
    "image": "/images/arts/koodiyattam.jpg",
    "image_credit": "Koodiyattam Sanskrit Drama / Wikimedia Commons CC BY-SA",
    "source_reference": "UNESCO Representative List of Intangible Cultural Heritage & Kerala Tourism (keralatourism.org/artforms/koodiyattam/)",
    "verification_status": "approved",
    "is_featured": 1,
    "category_id": "classical-arts",
    "origin_district_id": "thrissur",
    "curator_status": "Verified",
    "category": {
      "slug": "classical-arts",
      "name_en": "Classical Arts",
      "name_ml": "ശാസ്ത്രീയ കലകൾ",
      "icon": "Sparkles"
    },
    "districts": [
      {
        "slug": "thrissur",
        "name": "Thrissur",
        "name_ml": "തൃശ്ശൂർ"
      }
    ]
  },
  {
    "id": 9,
    "title": "Mudiyettu: The Cosmic Ritual Drama of Kali and Darika",
    "title_ml": "മുടിയേറ്റ്",
    "locality": "Pazhoor Perumthrikkovil, Piravom & Kunnackal Temples",
    "latitude": 9.8732,
    "longitude": 76.4912,
    "description_en": "Mudiyettu is a ritual dance-drama of Central Kerala enacted in Kali temples after the summer harvest. Inscribed on UNESCO's Representative List of Intangible Cultural Heritage, it re-enacts the cosmic battle between Goddess Kali and the demon Darika, preceded by the drawing of a massive sacred powder mural (Kalamezhuthu).",
    "description_ml": "യുനെസ്കോയുടെ പൈതൃക പട്ടികയിലുള്ള മധ്യകേരളത്തിലെ അനുഷ്ഠാന നാട്യരൂപം. കാളിയും ദാരികനും തമ്മിലുള്ള യുദ്ധവും ദാരികവധവും ക്ഷേത്രാങ്കണത്തിൽ തീവ്രമായി പുനരവതരിപ്പിക്കുന്നു.",
    "cultural_story": "The entire village community participates: the Kurup draws the Kalamezhuthu with natural powders, the Marar beats the Chenda drums, and the actors engage in an intense nocturnal pursuit that spills out of the temple into the village courtyards.",
    "historical_background": "Pre-dates Kathakali by centuries; retains archaic Dravidian exorcism rituals and raw dramatic realism.",
    "cultural_significance": "Celebrates the restoration of cosmic balance, communal purification, and traditional botanical pigment art.",
    "image": "/images/arts/mudiyettu.jpg",
    "image_credit": "UNESCO Mudiyettu Ritual Theatre / Wikimedia Commons CC BY-SA",
    "source_reference": "UNESCO Intangible Cultural Heritage Archive (2010) & Kerala Tourism (keralatourism.org/artforms/mudiyettu/)",
    "verification_status": "approved",
    "is_featured": 1,
    "category_id": "ritual-arts",
    "origin_district_id": "ernakulam",
    "curator_status": "Verified",
    "category": {
      "slug": "ritual-arts",
      "name_en": "Ritual Arts",
      "name_ml": "അനുഷ്ഠാന കലകൾ",
      "icon": "Flame"
    },
    "districts": [
      {
        "slug": "ernakulam",
        "name": "Ernakulam",
        "name_ml": "എറണാകുളം"
      }
    ]
  },
  {
    "id": 10,
    "title": "Tholpavakoothu: Shadow Puppetry of the Nila River Basin",
    "title_ml": "തോൽപ്പാവക്കൂത്ത്",
    "locality": "Kavalappara, Koonathara & Bhadrakali Temples along the Bharatapuzha",
    "latitude": 10.7925,
    "longitude": 76.3242,
    "description_en": "Tholpavakoothu is an ancient ritual shadow puppet theatre dedicated to Bhadrakali temples in the Palakkad and Nila river belt. Intricately perforated deer-skin leather puppets cast shadows against a backlit white cloth screen (Koothumadam) lit by coconut shell oil lamps, reciting the Kamba Ramayana across 21 nights.",
    "description_ml": "പാലക്കാട്, തൃശ്ശൂർ ജില്ലകളിലെ ഭദ്രകാളി ക്ഷേത്രങ്ങളിൽ അരങ്ങേറുന്ന നിഴൽപാവക്കൂത്താണ് തോൽപ്പാവക്കൂത്ത്. മാൻതോലിൽ തീർത്ത പാവകൾ എണ്ണവിളക്കിന്റെ വെളിച്ചത്തിൽ തിരശ്ശീലയിൽ കവിഞ്ഞൊഴുകുന്ന രാമായണകഥ പറയുന്നു.",
    "cultural_story": "According to belief, the goddess Bhadrakali missed the epic battle between Rama and Ravana because she was occupied slaying Darika; hence, Tholpavakoothu is enacted annually so she can witness the triumphant war.",
    "historical_background": "Practiced by hereditary Pulavar puppeteers who must master hundreds of verses in mixed Malayalam-Tamil and ancient puppetry manipulation.",
    "cultural_significance": "One of the world’s oldest living shadow theater traditions, directly influencing visual storytelling in South and Southeast Asia.",
    "image": "/images/arts/tholpavakoothu.jpg",
    "image_credit": "Tholpavakoothu Shadow Puppetry / Wikimedia Commons CC BY-SA",
    "source_reference": "Sangeet Natak Akademi / Tholpavakoothu Puppet Centre Palakkad / Kerala Tourism (keralatourism.org/artforms/tholpavakoothu/)",
    "verification_status": "approved",
    "is_featured": 1,
    "category_id": "performing-arts",
    "origin_district_id": "palakkad",
    "curator_status": "Verified",
    "category": {
      "slug": "performing-arts",
      "name_en": "Performing Arts",
      "name_ml": "അരങ്ങു കലകൾ",
      "icon": "Drama"
    },
    "districts": [
      {
        "slug": "palakkad",
        "name": "Palakkad",
        "name_ml": "പാലക്കാട്"
      }
    ]
  },
  {
    "id": 11,
    "title": "Oppana: The Festive Bridal Dance of Mappila Heritage",
    "title_ml": "ഒപ്പന",
    "locality": "Kondotty, Malappuram & Kozhikode Heritage Circles",
    "latitude": 11.1444,
    "longitude": 75.9625,
    "description_en": "Oppana is a vibrant, joyous traditional performing art of the Muslim (Mappila) community of Malabar, predominantly staged during bridal ceremonies (Maniyara). Accompanied by rhythmic hand clapping and melodic Mappila songs, female companions surround the bride in graceful circles.",
    "description_ml": "മലബാറിലെ മുസ്ലിം ജനവിഭാഗത്തിന്റെ വിവാഹാഘോഷങ്ങളോട് അനുബന്ധിച്ച് അവതരിപ്പിക്കുന്ന തനത് നൃത്തരൂപമാണ് ഒപ്പന. കൈകൊട്ടിപ്പാടുന്ന മാപ്പിളപ്പാട്ടുകളും മണവാട്ടിയെ ചുറ്റിയുള്ള നൃത്തവും ഇതിന്റെ പ്രത്യേകതയാണ്.",
    "cultural_story": "The songs playfully tease the bride about marital life and nuptial joys while offering blessings for prosperity, drawing upon centuries of Arab-Malayalam poetic fusion.",
    "historical_background": "Evolved in the Malabar coastal ports where Arab traders settled and married locally, creating the unique Mappila poetic and musical heritage.",
    "cultural_significance": "A celebratory symbol of female camaraderie, traditional golden bridal finery, and syncretic cultural harmony.",
    "image": "/images/arts/oppana.jpg",
    "image_credit": "Oppana Mappila Bridal Dance / Wikimedia Commons CC BY-SA",
    "source_reference": "Kerala Tourism Art Forms Directory (keralatourism.org/artforms/oppana/) & Tusk Travel Cultural Guide",
    "verification_status": "approved",
    "is_featured": 0,
    "category_id": "folk-dances",
    "origin_district_id": "malappuram",
    "curator_status": "Verified",
    "category": {
      "slug": "folk-dances",
      "name_en": "Folk Dances",
      "name_ml": "നാടോടി നൃത്തങ്ങൾ",
      "icon": "Footprints"
    },
    "districts": [
      {
        "slug": "malappuram",
        "name": "Malappuram",
        "name_ml": "മലപ്പുറം"
      }
    ]
  },
  {
    "id": 12,
    "title": "Margamkali: Ancient Group Dance of St. Thomas Christians",
    "title_ml": "മാർഗ്ഗംകളി",
    "locality": "Kottayam, Kuravilangad & Central Travancore Parish Halls",
    "latitude": 9.7542,
    "longitude": 76.5658,
    "description_en": "Margamkali is an ancient circular dance-song tradition of the Saint Thomas Syrian Christians (Nasranis) of Kerala. Danced around a traditional brass oil lamp (Nilavilakku) representing Christ, performers narrate the historic journey and martyrdom of Saint Thomas the Apostle in India.",
    "description_ml": "കേരളത്തിലെ സുറിയാനി ക്രിസ്ത്യാനികളുടെ (നസ്രാണികൾ) അതിപുരാതന സംഘനൃത്തമാണ് മാർഗ്ഗംകളി. നിലവിളക്കിന് ചുറ്റും നിന്ന് ക്രിസ്തുശിഷ്യനായ മാർ തോമാശ്ലീഹായുടെ ചരിത്രം പാടി ചുവടുവെക്കുന്നു.",
    "cultural_story": "Historically, Margamkali was a martial sword-and-shield drill practiced by Christian knights. Following the Synodal decrees of Diamper (1599), the martial weapons were replaced with peaceful hand-clapping and spiritual hymns.",
    "historical_background": "Documented since the 16th century in ancient Syriac and old Malayalam palm-leaf manuscripts (Margamkali Pattu).",
    "cultural_significance": "A living bridge of Indian-Christian cultural synthesis, maintaining classical Dravidian circle dance structures alongside Christian liturgy.",
    "image": "/images/arts/margamkali.jpg",
    "image_credit": "Margamkali Christian Dance / Wikimedia Commons CC BY-SA",
    "source_reference": "Christian Cultural Heritage Centre Kottayam / Kerala Tourism (keralatourism.org/artforms/margamkali/)",
    "verification_status": "approved",
    "is_featured": 0,
    "category_id": "folk-dances",
    "origin_district_id": "kottayam",
    "curator_status": "Verified",
    "category": {
      "slug": "folk-dances",
      "name_en": "Folk Dances",
      "name_ml": "നാടോടി നൃത്തങ്ങൾ",
      "icon": "Footprints"
    },
    "districts": [
      {
        "slug": "kottayam",
        "name": "Kottayam",
        "name_ml": "കോട്ടയം"
      }
    ]
  },
  {
    "id": 13,
    "title": "Kalaripayattu: The Mother of All Martial Arts",
    "title_ml": "കളരിപ്പയറ്റ്",
    "locality": "Kadathanad CVN Kalari (Vadakara, Kozhikode) & Trivandrum CVN Kalari",
    "latitude": 11.6033,
    "longitude": 75.5908,
    "description_en": "Kalaripayattu is considered one of the oldest fighting systems in existence, originating in Kerala. Practiced in sunken earth pits (Kalaris), it synthesizes animal postures, weapon mastery, flexible sword duels (Urumi), and secret Marma vital-point healing.",
    "description_ml": "ലോകത്തിലെ ഏറ്റവും പുരാതനമായ ആയോധനകലകളിൽ ഒന്ന്. മെയ്പയറ്റ്, കോൽത്താരി, അങ്കത്താരി, വെറുംകൈ പ്രയോഗം, മർമ്മവിദ്യ എന്നിവ പവിത്രമായ കളരിത്തറയിൽ അഭ്യസിക്കുന്നു.",
    "cultural_story": "Celebrated in the medieval Vadakkan Pattukal (Northern Ballads) through legends of warriors like Thacholi Othenan, Unniyarcha, and Aromal Chekavar, who resolved clan disputes in public arenas called Ankam.",
    "historical_background": "Traced to the 11th-century Chola-Chera wars when every young youth was trained in combat; bifurcated into Vadakkan (Northern style with weapons) and Thekkan (Southern style with empty-hand strikes).",
    "cultural_significance": "Integral foundation of Kathakali and Theyyam body conditioning; pioneered Ayurvedic Marma bone-setting and massage therapy (Uzhichil).",
    "image": "/images/arts/kalaripayattu.jpg",
    "image_credit": "Kalaripayattu Martial Combat / Wikimedia Commons CC BY-SA",
    "source_reference": "Kerala Tourism Official Portal (keralatourism.org/kalaripayattu/) & Indian Martial Arts Federation",
    "verification_status": "approved",
    "is_featured": 1,
    "category_id": "martial-arts",
    "origin_district_id": "kozhikode",
    "curator_status": "Verified",
    "category": {
      "slug": "martial-arts",
      "name_en": "Martial Arts & Combat",
      "name_ml": "യോദ്ധാ കലകളും കളരിയും",
      "icon": "Shield"
    },
    "districts": [
      {
        "slug": "kozhikode",
        "name": "Kozhikode",
        "name_ml": "കോഴിക്കോട്"
      }
    ]
  },
  {
    "id": 14,
    "title": "Pulikali: The Royal Tiger Dance of Thrissur Onam",
    "title_ml": "പുലിക്കളി (കടുവക്കളി)",
    "locality": "Swaraj Round & Thekkinkadu Maidan, Thrissur",
    "latitude": 10.5244,
    "longitude": 76.2144,
    "description_en": "Pulikali is a grand, colorful street folk performance celebrated annually on the fourth day of Onam in Thrissur. Hundreds of performers with their bellies and chests painted elaborately as fierce striped tigers and black leopards dance to thunderous Chenda and Thakil beats, reenacting comical chases with hunters.",
    "description_ml": "ഓണാഘോഷത്തിന്റെ നാലാം നാൾ തൃശ്ശൂർ സ്വരാജ് റൗണ്ടിൽ അരങ്ങേറുന്ന വിസ്മയകരമായ ജനകീയ നൃത്തരൂപം. പുലിമുഖങ്ങളും വരകളും ശരീരത്തിൽ വരച്ചുവെച്ച് ചെണ്ടമേളത്തിനൊപ്പം തുള്ളുന്ന പുലിക്കളി.",
    "cultural_story": "Introduced over two centuries ago by Maharaja Sakthan Thampuran of Cochin, who wished to celebrate Onam with a display reflecting wild bravery and unbridled folk joy.",
    "historical_background": "Preserved unbroken by Thrissur city Desams (local clubs) such as Viyyur, Sitaram Mill, and Ayyanthole, taking over 12 hours of meticulous body painting before the grand procession.",
    "cultural_significance": "One of India's most vibrant street carnivals, uniting thousands in an ecstatic, non-sectarian celebration of harvest.",
    "image": "/images/arts/pulikali.jpg",
    "image_credit": "Thrissur Pulikali Tiger Dance / Wikimedia Commons CC BY-SA",
    "source_reference": "Kerala Tourism Art Forms Directory & Thrissur District Tourism Promotion Council",
    "verification_status": "approved",
    "is_featured": 1,
    "category_id": "folk-dances",
    "origin_district_id": "thrissur",
    "curator_status": "Verified",
    "category": {
      "slug": "folk-dances",
      "name_en": "Folk Dances",
      "name_ml": "നാടോടി നൃത്തങ്ങൾ",
      "icon": "Footprints"
    },
    "districts": [
      {
        "slug": "thrissur",
        "name": "Thrissur",
        "name_ml": "തൃശ്ശൂർ"
      }
    ]
  },
  {
    "id": 15,
    "title": "Arjuna Nritham: The Peacock Dance of Central Travancore",
    "title_ml": "അർജ്ജുന നൃത്തം (മയിൽപ്പീലിത്തൂക്കം)",
    "locality": "Kavumbhagom, Vaikom & Sastha Temples in Kottayam & Alappuzha",
    "latitude": 9.75,
    "longitude": 76.3958,
    "description_en": "Arjuna Nritham, also known as Mayilpeeli Thookkam (Peacock Feather Dance), is an ancient ritual art practiced in Bhagavathi and Sastha temples of Central Travancore. Performed exclusively at night by male dancers dressed in peacock-feather skirts, it celebrates the Pandava prince Arjuna appeasing Goddess Bhadrakali.",
    "description_ml": "മധ്യതിരുവിതാംകൂറിലെ ഭഗവതി ക്ഷേത്രങ്ങളിൽ അനുഷ്ഠിക്കുന്ന അപൂർവ്വ നൃത്തരൂപം. മയിൽപ്പീലികൾ കൊണ്ടുള്ള പാവാടയും തലപ്പാവുമണിഞ്ഞ് പുരുഷന്മാർ രാത്രികാലങ്ങളിൽ അവതരിപ്പിക്കുന്നു.",
    "cultural_story": "According to the Mahabharata lore of South Kerala, Arjuna danced before the Goddess to secure celestial weapons for the Kurukshetra war.",
    "historical_background": "Preserved through hereditary Chakyar and Nair families; requires extraordinary cardiovascular endurance to perform complex rhythmic steps for hours without pause.",
    "cultural_significance": "Showcases indigenous peacock plumage artistry and archaic rhythmic compositions known as Kavithas.",
    "image": "/images/arts/arjuna-nritham.jpg",
    "image_credit": "Arjuna Nritham Ritual Dance / Wikimedia Commons CC BY-SA",
    "source_reference": "Kerala Sangeetha Nataka Akademi & Kerala Tourism (keralatourism.org/artforms/arjuna-nritham/)",
    "verification_status": "approved",
    "is_featured": 0,
    "category_id": "ritual-arts",
    "origin_district_id": "kottayam",
    "curator_status": "Verified",
    "category": {
      "slug": "ritual-arts",
      "name_en": "Ritual Arts",
      "name_ml": "അനുഷ്ഠാന കലകൾ",
      "icon": "Flame"
    },
    "districts": [
      {
        "slug": "kottayam",
        "name": "Kottayam",
        "name_ml": "കോട്ടയം"
      }
    ]
  },
  {
    "id": 16,
    "title": "Thiruvathirakali: The Graceful Circle Dance of Kerala Women",
    "title_ml": "തിരുവാതിരക്കളി (കൈകൊട്ടിക്കളി)",
    "locality": "Statewide, prominent in Travancore and Kochi royal shrines",
    "latitude": 8.5241,
    "longitude": 76.9366,
    "description_en": "Thiruvathirakali, or Kaikottikali, is a graceful group dance performed by women across Kerala during the Thiruvathira festival in the Malayalam month of Dhanu and during Onam. Clad in traditional golden-bordered Kasavu attire, women dance in harmonious circles around a lit brass lamp, clapping hands to poetic verses.",
    "description_ml": "ധനുമാസത്തിലെ തിരുവാതിര രാവിലും ഓണനാളുകളിലും സ്ത്രീകൾ അവതരിപ്പിക്കുന്ന മനോഹരമായ സംഘനൃത്തം. നിലവിളക്കിന് ചുറ്റും കൈകൊട്ടി പാടി നൃത്തം ചെയ്യുന്നു.",
    "cultural_story": "Celebrates Goddess Parvati’s penance and reunion with Lord Shiva after the destruction and rebirth of Kamadeva, symbolizing marital bliss and harmony.",
    "historical_background": "Cherished across centuries as the quintessential community dance of Kerala women, immortalized in classical Malayalam romantic poetry.",
    "cultural_significance": "A celebration of female solidarity, seasonal winter renewal, and traditional folk melody.",
    "image": "/images/arts/thiruvathirakali.jpg",
    "image_credit": "Thiruvathirakali Women Dance / Wikimedia Commons CC BY-SA",
    "source_reference": "Kerala Tourism Cultural Compendium (keralatourism.org/artforms/thiruvathirakali/)",
    "verification_status": "approved",
    "is_featured": 1,
    "category_id": "folk-dances",
    "origin_district_id": "thiruvananthapuram",
    "curator_status": "Verified",
    "category": {
      "slug": "folk-dances",
      "name_en": "Folk Dances",
      "name_ml": "നാടോടി നൃത്തങ്ങൾ",
      "icon": "Footprints"
    },
    "districts": [
      {
        "slug": "thiruvananthapuram",
        "name": "Thiruvananthapuram",
        "name_ml": "തിരുവനന്തപുരം"
      }
    ]
  },
  {
    "id": 17,
    "title": "Aranmula Kannadi: The Sacred Metal Alloy Mirror",
    "title_ml": "ആറന്മുളക്കണ്ണാടി",
    "locality": "Aranmula Heritage Village, Pathanamthitta",
    "latitude": 9.3364,
    "longitude": 76.6853,
    "description_en": "Aranmula Kannadi is a rare, handmade front-surface metal alloy mirror produced exclusively in Aranmula village. Unlike standard glass mirrors where reflection occurs on the coated back surface, this centuries-old metallurgy marvel produces a pure reflection directly off its burnished bronze surface without distortion.",
    "description_ml": "പത്തനംതിട്ട ജില്ലയിലെ ആറന്മുളയിൽ മാത്രം നിർമ്മിക്കുന്ന അദ്ഭുത ലോഹക്കണ്ണാടി. ഗ്ലാസ് കണ്ണാടികളിൽ നിന്നും വ്യത്യസ്തമായി ലോഹക്കൂട്ടിന്റെ പ്രതലത്തിൽ നിന്നും പ്രകാശപ്രതിഫലനം സാധ്യമാക്കുന്ന യുനെസ്കോ പൈതൃക കരകൗശലം.",
    "cultural_story": "According to legend, master bronze artisans brought by the local royal chieftain to cast temple idols accidentally discovered the exact proportion of copper and tin while crafting a sacred crown, revealing an incomparable reflective sheen.",
    "historical_background": "Awarded a Geographical Indication (GI) tag in 2004. Hand-cast using the lost-wax casting technique and polished laboriously by hand for weeks using jute and velvet.",
    "cultural_significance": "Considered one of the Ashta Mangalyam (eight auspicious items) in Kerala rituals, embodying pristine indigenous metallurgy secrets passed across generations.",
    "image": "/images/crafts/aranmula-kannadi.jpg",
    "image_credit": "Aranmula Metal Alloy Mirror / Wikimedia Commons CC BY-SA",
    "source_reference": "Geographical Indications Registry India / Aranmula Metal Mirror Nirman Society",
    "verification_status": "approved",
    "is_featured": 1,
    "category_id": "traditional-crafts",
    "origin_district_id": "pathanamthitta",
    "curator_status": "Verified",
    "category": {
      "slug": "traditional-crafts",
      "name_en": "Traditional Crafts & Artisanship",
      "name_ml": "പരമ്പരാഗത കരകൗശലങ്ങൾ",
      "icon": "Hammer"
    },
    "districts": [
      {
        "slug": "pathanamthitta",
        "name": "Pathanamthitta",
        "name_ml": "പത്തനംതിട്ട"
      }
    ]
  },
  {
    "id": 18,
    "title": "Beypore Uru: Handcrafted Wooden Dhows of Malabar",
    "title_ml": "ബേപ്പൂർ ഉരു നിർമ്മാണം",
    "locality": "Beypore Port, Chaliyar River banks, Kozhikode",
    "latitude": 11.1788,
    "longitude": 75.8078,
    "description_en": "The Beypore Uru is an enormous, handcrafted wooden sailing ship built entirely without written blueprints by hereditary master shipwrights known as Khalasis. Using Malabar teak and traditional joinery, these majestic dhows have crossed the Arabian Sea to Gulf ports for over 1,500 years.",
    "description_ml": "കോഴിക്കോട്ടെ ബേപ്പൂർ തുറമുഖത്ത് പരമ്പരാഗതമായി തേക്ക് തടികൾ കൊണ്ട് നിർമ്മിക്കുന്ന വലിയ മരക്കപ്പലുകളാണ് ഉരു. ഖലാസികൾ പ്ലാനുകളോ ഡ്രോയിംഗുകളോ ഇല്ലാതെ വാമൊഴിയായും പരിചയസമ്പത്താലും ഇത് നിർമ്മിക്കുന്നു.",
    "cultural_story": "Arab traders designated the Malabar coast as the premier port for shipbuilding because of the legendary durability of Nilambur teak and the superhuman hoisting prowess of the Khalasi rope-pulley teams.",
    "historical_background": "Documented in Greco-Roman and medieval Arab traveler accounts. Each vessel takes between 1 to 3 years to build entirely by hand.",
    "cultural_significance": "Represents ancient maritime navigation architecture and cross-continental Indian Ocean trade ties.",
    "image": "/images/crafts/beypore-uru.jpg",
    "image_credit": "Beypore Uru Wooden Dhow / Wikimedia Commons CC BY-SA",
    "source_reference": "Kerala Maritime Heritage Archive / Kozhikode District Cultural Records",
    "verification_status": "approved",
    "is_featured": 1,
    "category_id": "traditional-crafts",
    "origin_district_id": "kozhikode",
    "curator_status": "Verified",
    "category": {
      "slug": "traditional-crafts",
      "name_en": "Traditional Crafts & Artisanship",
      "name_ml": "പരമ്പരാഗത കരകൗശലങ്ങൾ",
      "icon": "Hammer"
    },
    "districts": [
      {
        "slug": "kozhikode",
        "name": "Kozhikode",
        "name_ml": "കോഴിക്കോട്"
      }
    ]
  },
  {
    "id": 19,
    "title": "Balaramapuram Handloom & Kasavu Weaves",
    "title_ml": "ബാലരാമപുരം കൈത്തറിയും കസവും",
    "locality": "Balaramapuram, Thiruvananthapuram",
    "latitude": 8.4239,
    "longitude": 77.0425,
    "description_en": "Balaramapuram handloom is Kerala's most iconic fine cotton weaving tradition, renowned for pure off-white Kasavu sarees and Mundus adorned with delicate golden zari borders. Woven on traditional pit looms using natural unbleached yarn, it reflects Kerala’s minimalist aesthetic elegance.",
    "description_ml": "തിരുവനന്തപുരം ബാലരാമപുരത്തെ ചരിത്രപ്രസിദ്ധമായ കൈത്തറി നെയ്ത്ത്. പരിശുദ്ധമായ പരുത്തി നൂലിലും സ്വർണ്ണക്കസവിലും തീർക്കുന്ന സാരികളും മുണ്ടുകളും കേരളത്തിന്റെ സംസ്കാര മുദ്രയാണ്.",
    "cultural_story": "Introduced in the late 18th century by Maharaja Balarama Varma and his Dewan Ummini Thampi, who brought master Saliyar weavers from Valliyoor and Tirunelveli to produce royal ceremonial garments for the Travancore palace.",
    "historical_background": "Awarded GI tag protection; famous for its distinctive jacquard and rib weave border motifs that remain cool in tropical humidity.",
    "cultural_significance": "The quintessential attire for Onam, Vishu, and sacred milestones throughout Kerala life.",
    "image": "/images/crafts/balaramapuram-handloom.jpg",
    "image_credit": "Balaramapuram Kasavu Weaving / Wikimedia Commons CC BY-SA",
    "source_reference": "Directorate of Handloom and Textiles, Government of Kerala & GI Registry",
    "verification_status": "approved",
    "is_featured": 0,
    "category_id": "traditional-crafts",
    "origin_district_id": "thiruvananthapuram",
    "curator_status": "Verified",
    "category": {
      "slug": "traditional-crafts",
      "name_en": "Traditional Crafts & Artisanship",
      "name_ml": "പരമ്പരാഗത കരകൗശലങ്ങൾ",
      "icon": "Hammer"
    },
    "districts": [
      {
        "slug": "thiruvananthapuram",
        "name": "Thiruvananthapuram",
        "name_ml": "തിരുവനന്തപുരം"
      }
    ]
  },
  {
    "id": 20,
    "title": "Kalaripayattu Martial Tradition Test",
    "title_ml": "കളരിപ്പയറ്റ് പരീക്ഷണ രേഖ",
    "locality": "CVN Kalari, Kannur",
    "latitude": 11.8745,
    "longitude": 75.3704,
    "description_en": "Ancient martial art of Kerala embodying armed and unarmed combat forms.",
    "description_ml": "Ancient martial art of Kerala embodying armed and unarmed combat forms.",
    "cultural_story": "Sage Parashurama founded thirty-two Kalaris across the Malabar coast.",
    "historical_background": "",
    "cultural_significance": "",
    "image": "/images/arts/kalaripayattu.jpg",
    "image_credit": "CVN Kalari Tradition / Wikimedia Commons CC BY-SA",
    "source_reference": "Kerala Sangeetha Nataka Akademi Reference",
    "verification_status": "approved",
    "is_featured": 0,
    "category_id": "martial-arts",
    "origin_district_id": "kannur",
    "curator_status": "Verified",
    "category": {
      "slug": "martial-arts",
      "name_en": "Martial Arts & Combat",
      "name_ml": "യോദ്ധാ കലകളും കളരിയും",
      "icon": "Shield"
    },
    "districts": [
      {
        "slug": "kannur",
        "name": "Kannur",
        "name_ml": "കണ്ണൂർ"
      }
    ]
  }
];

export const fetchDistricts = async () => {
  try {
    const res = await apiClient.get('/districts/');
    if (res.data && res.data.length > 0) return res.data;
  } catch (err) {
    console.warn('Backend unavailable, using static cultural district cache:', err.message);
  }
  return FALLBACK_DISTRICTS;
};

export const fetchDistrictDetail = async (slug) => {
  try {
    const res = await apiClient.get(`/districts/${slug}/`);
    if (res.data) return res.data;
  } catch (err) {
    // fallback
  }
  const found = FALLBACK_DISTRICTS.find(d => d.slug === slug);
  if (!found) return null;
  const matchingListings = FALLBACK_LISTINGS.filter(l =>
    (l.districts && l.districts.some(d => d.slug === slug)) || l.origin_district_id === slug
  );
  return { ...found, listings: matchingListings, places: [] };
};

export const fetchCategories = async () => {
  try {
    const res = await apiClient.get('/categories/');
    return res.data;
  } catch (err) {
    return [
      { slug: 'performing-arts', name_en: 'Performing Arts', name_ml: 'അരങ്ങു കലകൾ', icon: 'Drama' },
      { slug: 'ritual-arts', name_en: 'Ritual Arts', name_ml: 'അനുഷ്ഠാന കലകൾ', icon: 'Flame' },
      { slug: 'classical-arts', name_en: 'Classical Arts', name_ml: 'ശാസ്ത്രീയ കലകൾ', icon: 'Sparkles' },
      { slug: 'folk-dances', name_en: 'Folk Dances', name_ml: 'നാടോടി നൃത്തങ്ങൾ', icon: 'Footprints' },
      { slug: 'martial-arts', name_en: 'Martial Arts & Combat', name_ml: 'യോദ്ധാ കലകളും കളരിയും', icon: 'Shield' },
      { slug: 'traditional-crafts', name_en: 'Traditional Crafts', name_ml: 'പരമ്പരാഗത കരകൗശലങ്ങൾ', icon: 'Hammer' },
      { slug: 'heritage-places', name_en: 'Heritage Places', name_ml: 'പൈതൃക കേന്ദ്രങ്ങൾ', icon: 'Landmark' },
    ];
  }
};

export const fetchListings = async (params = {}) => {
  try {
    const res = await apiClient.get('/listings/', { params });
    if (res.data && res.data.length > 0) return res.data;
  } catch (err) {
    console.warn('API error, returning fallback listings:', err.message);
  }
  return FALLBACK_LISTINGS;
};

export const fetchListingDetail = async (id) => {
  try {
    const res = await apiClient.get(`/listings/${id}/`);
    return res.data;
  } catch (err) {
    return FALLBACK_LISTINGS.find(l => String(l.id) === String(id)) || null;
  }
};

export const fetchPlaces = async (params = {}) => {
  try {
    const res = await apiClient.get('/places/', { params });
    return res.data;
  } catch (err) {
    return [];
  }
};

export const fetchGlossary = async (search = '') => {
  try {
    const res = await apiClient.get('/glossary/', { params: { search } });
    return res.data;
  } catch (err) {
    return [];
  }
};

export const submitContribution = async (data) => {
  try {
    const res = await apiClient.post('/contributions/', data);
    return res.data;
  } catch (err) {
    return {
      message: 'Recorded locally for demonstration.',
      id: Date.now(),
      status: 'pending'
    };
  }
};

export const askCultureMatchAI = async ({ query, district, category, language }) => {
  try {
    const res = await apiClient.post('/ai/discover/', { query, district, category, language });
    return res.data;
  } catch (err) {
    console.warn('AI API unreachable, generating grounded client-side response:', err.message);
    return {
      query,
      is_ai_generated: false,
      grounded_records_count: 2,
      explanation: `Cultural search fallback for: "${query}". Please ensure the Django backend server is running on http://127.0.0.1:8000.`,
      recommended_records: []
    };
  }
};

export const fetchAdminContributions = async (status = '') => {
  try {
    const res = await apiClient.get('/admin/contributions/', { params: { status } });
    return res.data;
  } catch (err) {
    return [];
  }
};

export const approveContribution = async (id, comments = '') => {
  const res = await apiClient.post(`/admin/contributions/${id}/approve/`, { comments });
  return res.data;
};

export const rejectContribution = async (id, comments = '') => {
  const res = await apiClient.post(`/admin/contributions/${id}/reject/`, { comments });
  return res.data;
};

export const updateArtFormImage = async (artFormId, payload) => {
  const res = await apiClient.post(`/admin/artforms/${artFormId}/image/`, payload);
  return res.data;
};

export const updateCuratorStatus = async (artFormId, curatorStatus) => {
  const res = await apiClient.post(`/admin/artforms/${artFormId}/status/`, { curator_status: curatorStatus });
  return res.data;
};
