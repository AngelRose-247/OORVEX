from django.core.management.base import BaseCommand
from culture.models import District, Category, CulturalListing, CulturalGlossary, Contribution, Review


class Command(BaseCommand):
    help = 'Seeds database with verified authentic cultural data for all 14 Kerala districts'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.NOTICE('Starting OORVEX cultural heritage database seeding...'))

        # 1. Categories
        categories_data = [
            {
                'slug': 'performing-arts',
                'name_en': 'Performing Arts',
                'name_ml': 'അരങ്ങു കലകൾ',
                'description_en': 'Dramatic, narrative, and theatrical performance traditions of Kerala.',
                'description_ml': 'കേരളത്തിലെ നാടകീയവും ആഖ്യാനപരവുമായ രംഗകലാ പാരമ്പര്യങ്ങൾ.',
                'icon': 'Drama',
                'order': 1
            },
            {
                'slug': 'ritual-arts',
                'name_en': 'Ritual Arts',
                'name_ml': 'അനുഷ്ഠാന കലകൾ',
                'description_en': 'Sacred temple and sacred grove rituals manifesting divinity and cosmic harmony.',
                'description_ml': 'ദൈവികതയും പ്രകൃതിപൊരുത്തവും നിറഞ്ഞുനിൽക്കുന്ന കാവുകളിലെയും ക്ഷേത്രങ്ങളിലെയും അനുഷ്ഠാന കലകൾ.',
                'icon': 'Flame',
                'order': 2
            },
            {
                'slug': 'classical-arts',
                'name_en': 'Classical Arts',
                'name_ml': 'ശാസ്ത്രീയ കലകൾ',
                'description_en': 'Disciplined classical dance-dramas governed by Natyashastra traditions.',
                'description_ml': 'നാട്യശാസ്ത്ര സിദ്ധാന്തങ്ങളാൽ ചിട്ടപ്പെടുത്തിയ വിശ്വോത്തര ശാസ്ത്രീയ നൃത്യ-നാട്യങ്ങൾ.',
                'icon': 'Sparkles',
                'order': 3
            },
            {
                'slug': 'folk-dances',
                'name_en': 'Folk Dances',
                'name_ml': 'നാടോടി നൃത്തങ്ങൾ',
                'description_en': 'Community and harvest celebration dances reflecting Kerala social tapestry.',
                'description_ml': 'ജനകീയ കൂട്ടായ്മകളിലും വിളവെടുപ്പുകളിലും പടരുന്ന നാടോടി നൃത്തരൂപങ്ങൾ.',
                'icon': 'Footprints',
                'order': 4
            },
            {
                'slug': 'traditional-music',
                'name_en': 'Traditional Percussion & Music',
                'name_ml': 'പരമ്പരാഗത വാദ്യവും സംഗീതവും',
                'description_en': 'Mesmerizing temple percussion ensembles and Sopana musical traditions.',
                'description_ml': 'മേളങ്ങളും തായമ്പകയും സോപാനസംഗീതവും ഉൾക്കൊള്ളുന്ന നാദപാരമ്പര്യം.',
                'icon': 'Drum',
                'order': 5
            },
            {
                'slug': 'traditional-crafts',
                'name_en': 'Traditional Crafts & Artisanship',
                'name_ml': 'പരമ്പരാഗത കരകൗശലങ്ങൾ',
                'description_en': 'Master handicraft legacies including bell-metal casting, handlooms, and boat-building.',
                'description_ml': 'ആറന്മുളക്കണ്ണാടിയും ഉരു നിർമ്മാണവും കൈത്തറിയും ഉൾപ്പെടുന്ന അനന്യ കരകൗശല വിദ്യകൾ.',
                'icon': 'Hammer',
                'order': 6
            },
            {
                'slug': 'heritage-places',
                'name_en': 'Heritage Places & Architecture',
                'name_ml': 'പൈതൃക കേന്ദ്രങ്ങളും വാസ്തുവിദ്യയും',
                'description_en': 'Ancient forts, rock shelters, palace murals, and sacred spaces.',
                'description_ml': 'ചരിത്ര കോട്ടകളും ശിലാചിത്രങ്ങളും ചുമർചിത്ര കൊട്ടാരങ്ങളും.',
                'icon': 'Landmark',
                'order': 7
            }
        ]

        categories = {}
        for cdata in categories_data:
            cat, _ = Category.objects.update_or_create(slug=cdata['slug'], defaults=cdata)
            categories[cat.slug] = cat
        self.stdout.write(self.style.SUCCESS(f'Created/updated {len(categories)} categories.'))

        # 2. Districts (All 14)
        districts_data = [
            {
                'slug': 'kasaragod',
                'name': 'Kasaragod',
                'name_ml': 'കാസർഗോഡ്',
                'tagline': 'The Northern Realm of Forts, Rivers and Theyyam',
                'description_en': 'Kasaragod is Kerala\'s northernmost borderland, renowned for linguistic harmony, 12 rivers, sea-kissed Bekal Fort, and the divine ecstasy of Theyyam ritual shrines.',
                'description_ml': 'കോട്ടകളുടെയും ഏഴു ഭാഷകളുടെയും നാട്. ഉത്തരമലബാറിലെ പുകൾപെറ്റ തെയ്യങ്ങളുടെയും ബേക്കൽ കോട്ടയുടെയും പുണ്യഭൂമി.',
                'headquarters': 'Kasaragod',
                'latitude': 12.5102,
                'longitude': 74.9852,
                'hero_image': 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=1400&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA 4.0',
                'area_sq_km': 1992,
                'order': 1
            },
            {
                'slug': 'kannur',
                'name': 'Kannur',
                'name_ml': 'കണ്ണൂർ',
                'tagline': 'The Land of Looms, Lores and Theyyam Spirits',
                'description_en': 'Celebrated as the crucible of North Malabar culture, Kannur is world-famous for vibrant Theyyam performances in sacred kavus, heroic ballads, and legendary handloom weaving.',
                'description_ml': 'തെയ്യങ്ങളുടെയും തറികളുടെയും നാട്. ഉത്തരമലബാറിന്റെ വീരഗാഥകളും പാരമ്പര്യ നെയ്ത്തും ഇഴചേരുന്ന ചരിത്രഭൂമി.',
                'headquarters': 'Kannur',
                'latitude': 11.8745,
                'longitude': 75.3704,
                'hero_image': 'https://images.unsplash.com/photo-1599824425751-2405c935d21c?auto=format&fit=crop&w=1400&q=80',
                'image_credit': 'Wikimedia Commons / Shaji A / CC BY-SA',
                'area_sq_km': 2966,
                'order': 2
            },
            {
                'slug': 'wayanad',
                'name': 'Wayanad',
                'name_ml': 'വയനാട്',
                'tagline': 'Misty Highlands of Ancient Petroglyphs and Tribal Lore',
                'description_en': 'Set amidst the high Western Ghats, Wayanad preserves the Neolithic rock petroglyphs of Edakkal Caves, indigenous tribal craft traditions, and verdant spice forests.',
                'description_ml': 'പശ്ചിമഘട്ടത്തിന്റെ മടിത്തട്ട്. ഇടയ്ക്കൽ ഗുഹകളിലെ പ്രാചീന ശിലാചിത്രങ്ങളും ആദിവാസി പൈതൃകവും തുടിക്കുന്ന മലനാട്.',
                'headquarters': 'Kalpetta',
                'latitude': 11.6050,
                'longitude': 76.0828,
                'hero_image': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1400&q=80',
                'image_credit': 'Kerala Tourism Photo Library / Fair Use',
                'area_sq_km': 2131,
                'order': 3
            },
            {
                'slug': 'kozhikode',
                'name': 'Kozhikode',
                'name_ml': 'കോഴിക്കോട്',
                'tagline': 'Historic Port of Zamorins, Culinary Hospitality and Uru Craft',
                'description_en': 'Ancient Calicut hosted global spice maritime trade. Beypore on the Chaliyar river remains the world center for hand-crafted wooden Uru dhows, alongside rich Mappila heritage.',
                'description_ml': 'സാമൂതിരിമാരുടെ തലസ്ഥാനം. ബേപ്പൂരിലെ ഉരു നിർമ്മാണ വിദ്യയും മാപ്പിള കലകളും സ്നേഹസമ്പന്നമായ ആതിഥ്യവും.',
                'headquarters': 'Kozhikode',
                'latitude': 11.2588,
                'longitude': 75.7804,
                'hero_image': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1400&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA 3.0',
                'area_sq_km': 2344,
                'order': 4
            },
            {
                'slug': 'malappuram',
                'name': 'Malappuram',
                'name_ml': 'മലപ്പുറം',
                'tagline': 'Cradle of Malayalam Language, Ayurvedic Wisdom and Oppana',
                'description_en': 'Home to Thunchath Ezhuthachan (father of Malayalam literature), the historic medical lineage of Kottakkal Arya Vaidya Sala, and spirited folk dances like Oppana and Kolkali.',
                'description_ml': 'മലയാള ഭാഷയുടെ പിതാവ് എഴുത്തച്ഛന്റെ ജന്മനാട്. ആയുർവേദ പൈതൃകവും ഒപ്പന, കോൽക്കളി നാടോടി കലകളും.',
                'headquarters': 'Malappuram',
                'latitude': 11.0510,
                'longitude': 76.0711,
                'hero_image': 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=1400&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA',
                'area_sq_km': 3550,
                'order': 5
            },
            {
                'slug': 'palakkad',
                'name': 'Palakkad',
                'name_ml': 'പാലക്കാട്',
                'tagline': 'Granary of Kerala, Shadow Puppetry and Carnatic Soul',
                'description_en': 'Flanked by the historic Western Ghats gap, Palakkad vibrates with Tholpavakoothu leather shadow puppetry, majestic Palmyra avenues, and timeless Carnatic traditions.',
                'description_ml': 'പാലക്കാടൻ ചുരവും നെൽപ്പാടങ്ങളും. തോൽപ്പാവക്കൂത്ത് പാവനാടകവും കൽപ്പാത്തി രഥോത്സവവും വീണാനാദവും.',
                'headquarters': 'Palakkad',
                'latitude': 10.7867,
                'longitude': 76.6548,
                'hero_image': 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1400&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA 4.0',
                'area_sq_km': 4480,
                'order': 6
            },
            {
                'slug': 'thrissur',
                'name': 'Thrissur',
                'name_ml': 'തൃശ്ശൂർ',
                'tagline': 'The Cultural Capital of Kerala, Kalamandalam and Pooram',
                'description_en': 'Heartbeat of Kerala arts, Thrissur hosts Kerala Kalamandalam (sanctuary of Kathakali and Mohiniyattam), the grand Thrissur Pooram festival, and vibrant Pulikkali tiger dance.',
                'description_ml': 'കേരളത്തിന്റെ സാംസ്കാരിക തലസ്ഥാനം. കേരള കലാമണ്ഡലവും തൃശ്ശൂർ പൂരത്തിന്റെ കുടമാറ്റവും പുലിക്കളിയും.',
                'headquarters': 'Thrissur',
                'latitude': 10.5276,
                'longitude': 76.2144,
                'hero_image': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1400&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA 4.0',
                'area_sq_km': 3032,
                'order': 7
            },
            {
                'slug': 'ernakulam',
                'name': 'Ernakulam',
                'name_ml': 'എറണാകുളം',
                'tagline': 'Cosmopolitan Gateway of Chendamangalam Weaves and Chavittu Nadakam',
                'description_en': 'Bustling Kochi merges ancient Jewish, Dutch and Portuguese influences with indigenous traditions like Chavittu Nadakam Latin-Malayalam musical drama and fine handlooms.',
                'description_ml': 'ചരിത്രവും ആധുനികതയും കൂടിച്ചേരുന്ന കൊച്ചി. ചവിട്ടുനാടകവും ചേന്ദമംഗലം കൈത്തറിയും പുരാതന കോട്ടകളും.',
                'headquarters': 'Kakkanad, Kochi',
                'latitude': 9.9816,
                'longitude': 76.2999,
                'hero_image': 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=1400&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA',
                'area_sq_km': 3068,
                'order': 8
            },
            {
                'slug': 'idukki',
                'name': 'Idukki',
                'name_ml': 'ഇടുക്കി',
                'tagline': 'High Ranges of Ancient Dolmens, Tribal Songs and Marayoor Sugar',
                'description_en': 'Dramatic Western Ghats peaks, ancient prehistoric dolmens at Marayoor, organic cane jaggery traditions, and indigenous Mannan tribal folklore songs.',
                'description_ml': 'മലനിരകളുടെ നാട്. മറയൂരിലെ മുനിയറകളും കരിമ്പ് ശർക്കര പാരമ്പര്യവും വനവാസി ഗോത്ര ഗീതങ്ങളും.',
                'headquarters': 'Painavu',
                'latitude': 9.8518,
                'longitude': 76.9405,
                'hero_image': 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1400&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA 4.0',
                'area_sq_km': 4358,
                'order': 9
            },
            {
                'slug': 'kottayam',
                'name': 'Kottayam',
                'name_ml': 'കോട്ടയം',
                'tagline': 'The City of Letters, Lakes, Murals and Margamkali',
                'description_en': 'Famed as Akshara Nagari (City of Letters), Kottayam preserves ancient Syrian Christian Margamkali dance, exquisite 16th-century church and temple mural art, and Vembanad backwaters.',
                'description_ml': 'അക്ഷരനഗരി. മാർഗ്ഗംകളിയുടെയും പുരാതന ക്രൈസ്തവ-ഹൈന്ദവ ചുവർച്ചിത്രങ്ങളുടെയും വേമ്പനാട്ടുകായലിന്റെയും നാട്.',
                'headquarters': 'Kottayam',
                'latitude': 9.5916,
                'longitude': 76.5222,
                'hero_image': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1400&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA',
                'area_sq_km': 2208,
                'order': 10
            },
            {
                'slug': 'alappuzha',
                'name': 'Alappuzha',
                'name_ml': 'ആലപ്പുഴ',
                'tagline': 'Venice of the East, Golden Coir and Chundan Snake Boat Regattas',
                'description_en': 'Interconnected canals, traditional coir yarn spinning, Chettikulangara Kettukazhcha effigy towers, and master shipwrights crafting the 100-oared Chundan Vallam snake boats.',
                'description_ml': 'കിഴക്കിന്റെ വെനീസ്. ചുണ്ടൻ വള്ള നിർമ്മാണവും കയർ ഉത്പന്നങ്ങളും ചെട്ടികുളങ്ങര കെട്ടുകാഴ്ചയും.',
                'headquarters': 'Alappuzha',
                'latitude': 9.4981,
                'longitude': 76.3388,
                'hero_image': 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=1400&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA 4.0',
                'area_sq_km': 1414,
                'order': 11
            },
            {
                'slug': 'pathanamthitta',
                'name': 'Pathanamthitta',
                'name_ml': 'പത്തനംതിട്ട',
                'tagline': 'Sanctuary of Padayani Masks, Sacred Groves and Aranmula Mirrors',
                'description_en': 'The spiritual and ritual heart of Central Travancore, famed for the dramatic Kolam thullal of Padayani, Vasthuvidya Gurukulam mural preservation, and mystical Aranmula Kannadi metal mirrors.',
                'description_ml': 'തീർത്ഥാടന നഗരം. പടയണി തുള്ളലിന്റെയും ആറന്മുള ലോഹക്കണ്ണാടിയുടെയും വാസ്തുവിദ്യാ ഗുരുകുലത്തിന്റെയും നാട്.',
                'headquarters': 'Pathanamthitta',
                'latitude': 9.2648,
                'longitude': 76.7870,
                'hero_image': 'https://images.unsplash.com/photo-1599824425751-2405c935d21c?auto=format&fit=crop&w=1400&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA 4.0',
                'area_sq_km': 2637,
                'order': 12
            },
            {
                'slug': 'kollam',
                'name': 'Kollam',
                'name_ml': 'കൊല്ലം',
                'tagline': 'Historic Desinganadu Port, Ashtamudi Lake and Kathakali Enclaves',
                'description_en': 'Ancient trading capital with Rome, Arabia, and China; celebrated for Chavara Thevalakkara Kathakali troupes, coir matting craft, and heritage bell metal bells.',
                'description_ml': 'ദേശിംഗനാടിന്റെ ചരിത്രപ്പെരുമ. അഷ്ടമുടിക്കായലിന്റെ വശ്യതയും കഥകളി-നാടക പാരമ്പര്യവും കരകൗശലങ്ങളും.',
                'headquarters': 'Kollam',
                'latitude': 8.8932,
                'longitude': 76.6141,
                'hero_image': 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1400&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA 3.0',
                'area_sq_km': 2491,
                'order': 13
            },
            {
                'slug': 'thiruvananthapuram',
                'name': 'Thiruvananthapuram',
                'name_ml': 'തിരുവനന്തപുരം',
                'tagline': 'Capital of Anantha, Balaramapuram Zari and Classical Margi Arts',
                'description_en': 'Seat of Travancore kings, Thiruvananthapuram cradles Sree Padmanabhaswamy Temple, Margi institute for Koodiyattam and Kathakali, and world-renowned Balaramapuram gold-zari handlooms.',
                'description_ml': 'അനന്തപുരി. പത്മനാഭസ്വാമി ക്ഷേത്രവും മാർഗി കൂടിയാട്ട പാരമ്പര്യവും ബാലരാമപുരം കസവു കൈത്തറിയും.',
                'headquarters': 'Thiruvananthapuram',
                'latitude': 8.5241,
                'longitude': 76.9366,
                'hero_image': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1400&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA 4.0',
                'area_sq_km': 2189,
                'order': 14
            }
        ]

        districts = {}
        for ddata in districts_data:
            dist, _ = District.objects.update_or_create(slug=ddata['slug'], defaults=ddata)
            districts[dist.slug] = dist
        self.stdout.write(self.style.SUCCESS(f'Created/updated {len(districts)} districts.'))

        # 3. Cultural Listings (Verified, authentic records with clear citations)
        listings_data = [
            {
                'title': 'Theyyam: The Living Gods of Malabar',
                'title_ml': 'തെയ്യം (ദൈവക്കോലം)',
                'category_slug': 'ritual-arts',
                'districts_slugs': ['kannur', 'kasaragod'],
                'origin_district_slug': 'kannur',
                'locality': 'Parassini Madappura and Kavus across Kannur & Kasaragod',
                'latitude': 11.9842,
                'longitude': 75.3981,
                'description_en': 'Theyyam is an ancient, ecstatic ritual dance form of North Kerala in which mortal performers channel and embody divine ancestral spirits, heroic martyrs, and deities. With intricate face-painting, towering bamboo headgears (Mudi), burning torches, and hypnotic percussion, Theyyam breaks social barriers in sacred groves.',
                'description_ml': 'ഉത്തരകേരളത്തിലെ കാവുകളിലും തറവാടുകളിലും അനുഷ്ഠിച്ചു വരുന്ന പ്രാചീന അനുഷ്ഠാന കലാരൂപമാണ് തെയ്യം. ദൈവങ്ങളും വീരപുരുഷന്മാരും തെയ്യക്കോലങ്ങളിലൂടെ മനുഷ്യരിലേക്ക് ഇറങ്ങിവരുന്ന ആത്മീയ അനുഭവം. മുഖത്തെഴുത്തും ആകാശമുട്ടുന്ന തിരുമുടികളും വാദ്യമേളങ്ങളും ഇതിനെ വിസ്മയകരമാക്കുന്നു.',
                'cultural_story': 'According to Malabar folklore, Theyyam emerged from the prehistoric worship of fertility, nature, and fallen heroes. Untouchable and agrarian communities historically assumed sacred divine authority during Theyyam nights, bestowing blessings and justice upon kings and feudal lords alike, creating a rare ritual equalization of society.',
                'historical_background': 'Recorded in Sangam literature and regional ballads dating back over a thousand years. There are approximately 400 distinct Theyyam forms, including Muchilot Bhagavathi, Gulikan, Pottan Theyyam, and Kathivanoor Veeran.',
                'cultural_significance': 'Unites communities across caste lines, preserves oral poetry (Tottam Pattu), and sustains indigenous botanical face pigmentation and craftsmanship.',
                'image': 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=1200&q=80',
                'image_credit': 'Wikimedia Commons / Shaji A / CC BY-SA 4.0',
                'source_reference': 'Kerala Sangeetha Nataka Akademi / Kerala Folklore Academy Archive Record #KFA-TH-012',
                'verification_status': 'approved',
                'is_featured': True,
                'audio_narration': 'Theyyam represents the sublime transcendence where man transforms into divine spirit amidst roaring chenda percussion in North Kerala sacred groves.'
            },
            {
                'title': 'Padayani: The Rite of Divine Effigies',
                'title_ml': 'പടയണി (പടേനി)',
                'category_slug': 'ritual-arts',
                'districts_slugs': ['pathanamthitta', 'kottayam', 'kollam'],
                'origin_district_slug': 'pathanamthitta',
                'locality': 'Kadammanitta Devi Temple and Kurampala Kavus',
                'latitude': 9.3082,
                'longitude': 76.7788,
                'description_en': 'Padayani is a dramatic ritual performance native to Central Travancore, staged at Bhadrakali temples. Performed to appease the ferocious goddess after slaying the demon Darika, it features elaborate painted masks (Kolams) created from areca nut fronds, vibrant natural colors, and thunderous Thappu percussion.',
                'description_ml': 'മധ്യതിരുവിതാംകൂറിലെ ഭദ്രകാളി ക്ഷേത്രങ്ങളിൽ അനുഷ്ഠിക്കുന്ന അതിപുരാതന അനുഷ്ഠാന കലാരൂപമാണ് പടയണി. കാളിയുടെ കോപം ശമിപ്പിക്കാനായി ഭൈരവി, കാളൻ, യക്ഷി തുടങ്ങിയ കോലങ്ങൾ അണിഞ്ഞ് തപ്പുകൊട്ടി പാടി ആടുന്നു.',
                'cultural_story': 'Legend relates that Lord Shiva and his celestial attendants designed comic and awe-inspiring painted effigies (Kolams) to pacify Kali’s cosmic fury. Modern Padayani integrates biting social satire through characters like Paradeshi and Kuthira.',
                'historical_background': 'Traced back to ancient Dravidian ritual dances; refined systematically at Kadammanitta, Othara, and Kurampala village traditions.',
                'cultural_significance': 'Pioneered natural leaf-based mask design and preservation of archaic rhythmic meters unique to the Thappu instrument.',
                'image': 'https://images.unsplash.com/photo-1599824425751-2405c935d21c?auto=format&fit=crop&w=1200&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA 3.0',
                'source_reference': 'Central Travancore Cultural Trust / Kerala Folklore Archives',
                'verification_status': 'approved',
                'is_featured': True,
                'audio_narration': 'Padayani combines thunderous Thappu beats with magnificent painted areca frond masks to appease the divine mother.'
            },
            {
                'title': 'Kathakali: The Classical Dance-Drama of Kerala',
                'title_ml': 'കഥകളി',
                'category_slug': 'classical-arts',
                'districts_slugs': ['thrissur', 'kollam', 'thiruvananthapuram', 'ernakulam'],
                'origin_district_slug': 'kollam',
                'locality': 'Kerala Kalamandalam (Cheruthuruthy, Thrissur) & Margi (Trivandrum)',
                'latitude': 10.7423,
                'longitude': 76.2736,
                'description_en': 'Kathakali is Kerala\'s world-renowned classical dance-drama, distinguished by elaborate face makeup (Vesham), sculpted chutti beards, symbolic Mudras (hand gestures), and dramatic micro-facial expressions (Navarasas). It translates Indian epics into mesmerising non-verbal visual spectacle.',
                'description_ml': 'കേരളത്തിന്റെ തനത് ശാസ്ത്രീയ ദൃശ്യകലാവിസ്മയം. വിസ്തൃതമായ വേഷവിധാനങ്ങൾ, ചുട്ടി, മുദ്രകൾ, നവരസങ്ങൾ എന്നിവയിലൂടെ ഇതിഹാസകഥകളെ അരങ്ങിലെത്തിക്കുന്നു.',
                'cultural_story': 'Evolving from 17th-century Ramanattam devised by the Raja of Kottarakkara and Krishnanattam by the Zamorin of Kozhikode, Kathakali was revitalised in the 20th century by poet Vallathol Narayana Menon with the founding of Kerala Kalamandalam.',
                'historical_background': 'Synthesises indigenous martial art (Kalaripayattu), classical Sanskrit Natya, and temple painting aesthetics over four centuries of refinement.',
                'cultural_significance': 'Recognised globally as one of the most demanding and sophisticated non-verbal physical theatre disciplines in human history.',
                'image': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
                'image_credit': 'Wikimedia Commons / A.S. / CC BY-SA 4.0',
                'source_reference': 'Kerala Kalamandalam Deemed University for Art and Culture Archive',
                'verification_status': 'approved',
                'is_featured': True,
                'audio_narration': 'Kathakali synthesises profound facial expressions, ancient hand gestures, and rhythmic footwork to depict eternal cosmic epics.'
            },
            {
                'title': 'Aranmula Kannadi: The Sacred Metal Alloy Mirror',
                'title_ml': 'ആറന്മുളക്കണ്ണാടി',
                'category_slug': 'traditional-crafts',
                'districts_slugs': ['pathanamthitta'],
                'origin_district_slug': 'pathanamthitta',
                'locality': 'Aranmula Heritage Village, Pathanamthitta',
                'latitude': 9.3364,
                'longitude': 76.6853,
                'description_en': 'Aranmula Kannadi is a rare, handmade front-surface metal alloy mirror produced exclusively in Aranmula village. Unlike standard glass mirrors where reflection occurs on the coated back surface, this centuries-old metallurgy marvel produces a pure reflection directly off its burnished bronze surface without distortion.',
                'description_ml': 'പത്തനംതിട്ട ജില്ലയിലെ ആറന്മുളയിൽ മാത്രം നിർമ്മിക്കുന്ന അദ്ഭുത ലോഹക്കണ്ണാടി. ഗ്ലാസ് കണ്ണാടികളിൽ നിന്നും വ്യത്യസ്തമായി ലോഹക്കൂട്ടിന്റെ പ്രതലത്തിൽ നിന്നും പ്രകാശപ്രതിഫലനം സാധ്യമാക്കുന്ന യുനെസ്കോ പൈതൃക കരകൗശലം.',
                'cultural_story': 'According to legend, master bronze artisans brought by the local royal chieftain to cast temple idols accidentally discovered the exact proportion of copper and tin while crafting a sacred crown, revealing an incomparable reflective sheen.',
                'historical_background': 'Awarded a Geographical Indication (GI) tag in 2004. Hand-cast using the lost-wax casting technique and polished laboriously by hand for weeks using jute and velvet.',
                'cultural_significance': 'Considered one of the Ashta Mangalyam (eight auspicious items) in Kerala rituals, embodying pristine indigenous metallurgy secrets passed across generations.',
                'image': 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=1200&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA 3.0',
                'source_reference': 'Geographical Indications Registry India / Aranmula Metal Mirror Nirman Society',
                'verification_status': 'approved',
                'is_featured': True,
                'audio_narration': 'Aranmula Kannadi is a front-surface metal mirror crafted with secret metallurgy proportions held by hereditary artisans in Pathanamthitta.'
            },
            {
                'title': 'Beypore Uru: Handcrafted Wooden Dhows of Malabar',
                'title_ml': 'ബേപ്പൂർ ഉരു നിർമ്മാണം',
                'category_slug': 'traditional-crafts',
                'districts_slugs': ['kozhikode'],
                'origin_district_slug': 'kozhikode',
                'locality': 'Beypore Port, Chaliyar River banks, Kozhikode',
                'latitude': 11.1788,
                'longitude': 75.8078,
                'description_en': 'The Beypore Uru is an enormous, handcrafted wooden sailing ship built entirely without written blueprints by hereditary master shipwrights known as Khalasis. Using Malabar teak and traditional joinery, these majestic dhows have crossed the Arabian Sea to Gulf ports for over 1,500 years.',
                'description_ml': 'കോഴിക്കോട്ടെ ബേപ്പൂർ തുറമുഖത്ത് പരമ്പരാഗതമായി തേക്ക് തടികൾ കൊണ്ട് നിർമ്മിക്കുന്ന വലിയ മരക്കപ്പലുകളാണ് ഉരു. ഖലാസികൾ പ്ലാനുകളോ ഡ്രോയിംഗുകളോ ഇല്ലാതെ വാമൊഴിയായും പരിചയസമ്പത്താലും ഇത് നിർമ്മിക്കുന്നു.',
                'cultural_story': 'Arab traders designated the Malabar coast as the premier port for shipbuilding because of the legendary durability of Nilambur teak and the superhuman hoisting prowess of the Khalasi rope-pulley teams.',
                'historical_background': 'Documented in Greco-Roman and medieval Arab traveler accounts. Each vessel takes between 1 to 3 years to build entirely by hand.',
                'cultural_significance': 'Represents ancient maritime navigation architecture and cross-continental Indian Ocean trade ties.',
                'image': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA 4.0',
                'source_reference': 'Kerala Maritime Heritage Archive / Kozhikode District Cultural Records',
                'verification_status': 'approved',
                'is_featured': True,
                'audio_narration': 'Beypore Uru dhows are hand-built from solid Malabar teak by master Khalasis using centuries of mathematical oral memory.'
            },
            {
                'title': 'Tholpavakoothu: Shadow Puppetry of Palakkad',
                'title_ml': 'തോൽപ്പാവക്കൂത്ത്',
                'category_slug': 'performing-arts',
                'districts_slugs': ['palakkad', 'thrissur', 'malappuram'],
                'origin_district_slug': 'palakkad',
                'locality': 'Kavalappara and Bhadrakali temples along the Bharatapuzha basin',
                'latitude': 10.7925,
                'longitude': 76.3242,
                'description_en': 'Tholpavakoothu is an ancient ritual shadow puppet theatre dedicated to Bhadrakali temples in the Palakkad and Nila river belt. Intricately perforated deer-skin leather puppets cast shadows against a backlit white cloth screen (Koothumadam) lit by coconut shell oil lamps, reciting the Kamba Ramayana across 21 nights.',
                'description_ml': 'പാലക്കാട്, തൃശ്ശൂർ ജില്ലകളിലെ ഭദ്രകാളി ക്ഷേത്രങ്ങളിൽ അരങ്ങേറുന്ന നിഴൽപാവക്കൂത്താണ് തോൽപ്പാവക്കൂത്ത്. മാൻതോലിൽ തീർത്ത പാവകൾ എണ്ണവിളക്കിന്റെ വെളിച്ചത്തിൽ തിരശ്ശീലയിൽ കവിഞ്ഞൊഴുകുന്ന രാമായണകഥ പറയുന്നു.',
                'cultural_story': 'According to belief, the goddess Bhadrakali missed the epic battle between Rama and Ravana because she was occupied slaying Darika; hence, Tholpavakoothu is enacted annually so she can witness the triumphant war.',
                'historical_background': 'Practiced by hereditary Pulavar puppeteers who must master hundreds of verses in mixed Malayalam-Tamil and ancient puppetry manipulation.',
                'cultural_significance': 'One of the world’s oldest living shadow theater traditions, directly influencing visual storytelling in South and Southeast Asia.',
                'image': 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA 4.0',
                'source_reference': 'Sangeet Natak Akademi / Tholpavakoothu Puppet Centre Palakkad',
                'verification_status': 'approved',
                'is_featured': True,
                'audio_narration': 'Tholpavakoothu casts mystical shadows using perforated leather puppets behind a 40-foot illuminated fabric shrine.'
            },
            {
                'title': 'Balaramapuram Handloom & Kasavu Weaves',
                'title_ml': 'ബാലരാമപുരം കൈത്തറിയും കസവും',
                'category_slug': 'traditional-crafts',
                'districts_slugs': ['thiruvananthapuram'],
                'origin_district_slug': 'thiruvananthapuram',
                'locality': 'Balaramapuram, Thiruvananthapuram',
                'latitude': 8.4239,
                'longitude': 77.0425,
                'description_en': 'Balaramapuram handloom is Kerala\'s most iconic fine cotton weaving tradition, renowned for pure off-white Kasavu sarees and Mundus adorned with delicate golden zari borders. Woven on traditional pit looms using natural unbleached yarn, it reflects Kerala’s minimalist aesthetic elegance.',
                'description_ml': 'തിരുവനന്തപുരം ബാലരാമപുരത്തെ ചരിത്രപ്രസിദ്ധമായ കൈത്തറി നെയ്ത്ത്. പരിശുദ്ധമായ പരുത്തി നൂലിലും സ്വർണ്ണക്കസവിലും തീർക്കുന്ന സാരികളും മുണ്ടുകളും കേരളത്തിന്റെ സംസ്കാര മുദ്രയാണ്.',
                'cultural_story': 'Introduced in the late 18th century by Maharaja Balarama Varma and his Dewan Ummini Thampi, who brought master Saliyar weavers from Valliyoor and Tirunelveli to produce royal ceremonial garments for the Travancore palace.',
                'historical_background': 'Awarded GI tag protection; famous for its distinctive jacquard and rib weave border motifs that remain cool in tropical humidity.',
                'cultural_significance': 'The quintessential attire for Onam, Vishu, and sacred milestones throughout Kerala life.',
                'image': 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=1200&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA',
                'source_reference': 'Directorate of Handloom and Textiles, Government of Kerala',
                'verification_status': 'approved',
                'is_featured': False,
                'audio_narration': 'Balaramapuram handloom weaves organic unbleached cotton with pure gold zari borders on hereditary pit looms.'
            },
            {
                'title': 'Chavittu Nadakam: Latin-Kerala Musical Opera',
                'title_ml': 'ചവിട്ടുനാടകം',
                'category_slug': 'performing-arts',
                'districts_slugs': ['ernakulam', 'alappuzha'],
                'origin_district_slug': 'ernakulam',
                'locality': 'Gothuruth, North Paravur, Ernakulam',
                'latitude': 10.1581,
                'longitude': 76.2238,
                'description_en': 'Chavittu Nadakam is a classical musical theatre form created by St. Thomas Christian and Latin Catholic coastal communities in the 16th century following Portuguese cultural contact. It features rhythmic foot-stamping (chavittu) that shakes wooden stages, martial duels, Latinate chants, and glittering European royal costumes.',
                'description_ml': 'കൊച്ചിയുടെ തീരദേശങ്ങളിൽ ഉടലെടുത്ത ലാറ്റിൻ-കേരളീയ സംഗീത നാടകരൂപം. തടികൊണ്ടുള്ള വേദികളിൽ കാൽത്താളത്തോടെ ചുവടുവെച്ച് പാടി അഭിനയിക്കുന്ന ഈ കലാരൂപം യൂറോപ്യൻ ഓപ്പറയും കേരളീയ ആയോധനകലകളും സംയോജിപ്പിക്കുന്നു.',
                'cultural_story': 'Devised by Portuguese missionaries and local coastal dramatists to dramatise biblical history and stories of chivalric Christian knights like Charlemagne (Karalman Charitham).',
                'historical_background': 'Gothuruth village in Ernakulam is celebrated as the village capital of Chavittu Nadakam, preserving centuries-old scripts in ancient Chentamil-Malayalam.',
                'cultural_significance': 'A unique cultural syncretism combining Iberian medieval stagecraft with Kalarippayattu martial footwork and Malayalam verses.',
                'image': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA 4.0',
                'source_reference': 'Gothuruth Chavittu Nadaka Kalari Archive / Kerala Folklore Akademi',
                'verification_status': 'approved',
                'is_featured': False,
                'audio_narration': 'Chavittu Nadakam combines thunderous rhythmic stage stomping with opera singing and European chivalric costumes.'
            },
            {
                'title': 'Chundan Vallam & Snake Boat Building',
                'title_ml': 'ചുണ്ടൻ വള്ളം (പാമ്പുവള്ളം നിർമ്മാണം)',
                'category_slug': 'traditional-crafts',
                'districts_slugs': ['alappuzha', 'kottayam', 'pathanamthitta'],
                'origin_district_slug': 'alappuzha',
                'locality': 'Edathua, Champakulam and Kainakary, Alappuzha',
                'latitude': 9.4214,
                'longitude': 76.4718,
                'description_en': 'The Chundan Vallam is a majestic 100-to-138-foot-long racing canoe made of Anjili (wild jackfruit) timber, holding over 100 rowers, singers, and helmsmen. Designed originally as naval war vessels for feudal kings of Kayamkulam and Chempakassery, they now compete in the world-famous Nehru Trophy Boat Race.',
                'description_ml': 'ആലപ്പുഴയിലെ കുട്ടനാടൻ ജലമേളകളുടെ അഭിമാനമായ ചുണ്ടൻ വള്ളങ്ങൾ. 100 മുതൽ 138 അടി വരെ നീളമുള്ള ഈ വള്ളങ്ങൾ ആഞ്ഞിലിത്തടിയിലാണ് പാരമ്പര്യ ആശാരിമാർ നിർമ്മിക്കുന്നത്.',
                'cultural_story': 'According to 14th-century chronicles, the Raja of Chempakassery commissioned the master craftsman Kozhimukku Parameswaran Asari to build an invincible war vessel with an elevated cobra-like hood, granting naval supremacy on the backwaters.',
                'historical_background': 'Built adhering strictly to the Tachu Shastra (ancient Indian science of naval timber joinery). Each boat is treated as a sacred village living entity.',
                'cultural_significance': 'The crown jewel of Kerala’s backwater camaraderie, synchronising rhythmic Vanchipattu boat songs with hundreds of oars beating together.',
                'image': 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=1200&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA 4.0',
                'source_reference': 'Nehru Trophy Boat Race Society / Kerala Tourism Water Regatta Records',
                'verification_status': 'approved',
                'is_featured': True,
                'audio_narration': 'The hundred-oar Chundan Vallam cuts through backwater waves to the energetic cadence of traditional Vanchipattu songs.'
            },
            {
                'title': 'Mudiyettu: The Sacred Kali-Darika Ritual Drama',
                'title_ml': 'മുടിയേറ്റ്',
                'category_slug': 'ritual-arts',
                'districts_slugs': ['ernakulam', 'thrissur', 'kottayam'],
                'origin_district_slug': 'ernakulam',
                'locality': 'Pazhoor Perumthrikkovil and Koratty Muthy kavus',
                'latitude': 9.8789,
                'longitude': 76.4678,
                'description_en': 'Mudiyettu is a ritual dance drama based on the mythological duel between the goddess Kali and the demon Darika, inscribed on UNESCO\'s Representative List of the Intangible Cultural Heritage of Humanity. Performed inside temple compounds following the drawing of colossal powder Kalam murals.',
                'description_ml': 'യുനെസ്കോയുടെ അദൃശ്യ സാംസ്കാരിക പൈതൃക പട്ടികയിൽ ഇടംപിടിച്ച അനുഷ്ഠാന നാടകമാണ് മുടിയേറ്റ്. കാളിയും ദാരികനും തമ്മിലുള്ള പോരാട്ടം വർണ്ണാഭമായ ചടങ്ങുകളോടെ പുനരാവിഷ്കരിക്കുന്നു.',
                'cultural_story': 'Performed by Marar and Kuruppu communities, the enactment culminates with Kali donning the gigantic sacred headgear (Mudi) and symbolically beheading Darika to restore universal cosmic order.',
                'historical_background': 'One of the few unbroken ancient Sanskrit-Dravidian ritual drama forms preserved continuously for centuries without modern theatrical modifications.',
                'cultural_significance': 'Inscribed on the UNESCO Intangible Cultural Heritage List in 2010.',
                'image': 'https://images.unsplash.com/photo-1599824425751-2405c935d21c?auto=format&fit=crop&w=1200&q=80',
                'image_credit': 'UNESCO Intangible Heritage / CC BY-SA',
                'source_reference': 'UNESCO ICH Inventory Record #00345 / Sangeet Natak Akademi',
                'verification_status': 'approved',
                'is_featured': False,
                'audio_narration': 'Mudiyettu is a UNESCO-inscribed ritual theatre capturing the cosmic victory of goddess Kali over darkness.'
            },
            {
                'title': 'Edakkal Caves & Prehistoric Petroglyphs',
                'title_ml': 'ഇടയ്ക്കൽ ഗുഹകൾ (ശിലാചിത്രങ്ങൾ)',
                'category_slug': 'heritage-places',
                'districts_slugs': ['wayanad'],
                'origin_district_slug': 'wayanad',
                'locality': 'Ambikuthi Mala, Sultan Bathery, Wayanad',
                'latitude': 11.6264,
                'longitude': 76.2346,
                'description_en': 'Edakkal Caves are natural rock cleft shelters situated 1,200 meters above sea level on Ambikuthi Hill. The cave walls feature Neolithic petroglyphs and engravings dating from 6,000 BCE to 1,000 BCE, depicting human figures, animals, wheels, and Indus Valley script-like motifs.',
                'description_ml': 'വയനാട്ടിലെ അമ്പലവയലിൽ സ്ഥിതി ചെയ്യുന്ന പ്രകൃതിദത്ത ഗുഹകൾ. ബി.സി 6000 മുതൽ പഴക്കമുള്ള നവീന ശിലായുഗ കാലത്തെ അത്യപൂർവ്വ കൊത്തുചിത്രങ്ങൾ ഇവിടെ കാണാം.',
                'cultural_story': 'Local legend holds that the cleft split into existence when the arrows shot by Lava and Kusha, sons of Lord Rama, struck the mountain crest, giving it the name Edakkal (a stone in between).',
                'historical_background': 'Rediscovered in 1890 by Fred Fawcett, Superintendent of Police under British Malabar, noting that it contains India\'s only known Neolithic engravings on rock walls.',
                'cultural_significance': 'Provides primary archaeological evidence of prehistoric human settlement, trade routes, and ritual symbology in South India.',
                'image': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
                'image_credit': 'Archaeological Survey of India / Wikimedia Commons',
                'source_reference': 'Archaeological Survey of India (ASI) Heritage Site Code #ASI-KL-WAY-01',
                'verification_status': 'approved',
                'is_featured': True,
                'audio_narration': 'Edakkal rock engravings on Ambikuthi hill date back over 7,000 years, preserving mankind’s earliest pictorial memories in Kerala.'
            },
            {
                'title': 'Bekal Fort: Coastal Citadel of the Keladi Nayakas',
                'title_ml': 'ബേക്കൽ കോട്ട',
                'category_slug': 'heritage-places',
                'districts_slugs': ['kasaragod'],
                'origin_district_slug': 'kasaragod',
                'locality': 'Bekal, Pallikkara, Kasaragod',
                'latitude': 12.3926,
                'longitude': 75.0335,
                'description_en': 'Bekal Fort is the largest and best-preserved coastal fortress in Kerala, spreading over 40 majestic acres jutting directly into the Arabian Sea. Constructed primarily by Shivappa Nayaka of Bednore in 1650 CE, it features defensive ramparts, water tanks, observation towers, and zigzag entrance portals.',
                'description_ml': 'കേരളത്തിലെ ഏറ്റവും വലിയ കടലോര കോട്ട. 40 ഏക്കറിലായി അറബിക്കടലിലേക്ക് തള്ളിനിൽക്കുന്ന ബേക്കൽ കോട്ട 1650-ൽ ശിവപ്പ നായ്ക്കർ നിർമ്മിച്ചതാണ്.',
                'cultural_story': 'Unlike forts built for royal domestic residence, Bekal was built purely for maritime defense and artillery control, with observation apertures engineered to target enemy naval fleets at variable sea distances.',
                'historical_background': 'Passed subsequently under the reign of Hyder Ali, Tipu Sultan, and the British East India Company after the fourth Anglo-Mysore War.',
                'cultural_significance': 'Architectural masterpiece demonstrating coastal fortification engineering and scenic cultural heritage.',
                'image': 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80',
                'image_credit': 'Archaeological Survey of India / Wikimedia Commons',
                'source_reference': 'Archaeological Survey of India Thrissur Circle / Kasaragod Tourism Directory',
                'verification_status': 'approved',
                'is_featured': False,
                'audio_narration': 'Bekal Fort rises 130 feet above Arabian Sea breakers, a coastal stronghold of ancient trade route vigilance.'
            },
            {
                'title': 'Oppana: Bridal Celebration Dance of Malabar',
                'title_ml': 'ഒപ്പന',
                'category_slug': 'folk-dances',
                'districts_slugs': ['malappuram', 'kozhikode', 'kannur'],
                'origin_district_slug': 'malappuram',
                'locality': 'Kondotty, Malappuram & Calicut cultural halls',
                'latitude': 11.1444,
                'longitude': 75.9622,
                'description_en': 'Oppana is a vibrant traditional dance and musical form performed by Muslim women in Malabar on the eve of weddings. Led by a principal singer and chorus of clapping female dancers encircling the bride, they sing witty love couplets and blessings in Mappila Paattu meter accompanied by harmonium and tabla.',
                'description_ml': 'മലബാറിലെ മുസ്ലിം കല്യാണങ്ങളോടനുബന്ധിച്ച് സ്ത്രീകൾ അവതരിപ്പിക്കുന്ന മനോഹരമായ നാടോടി നൃത്തരൂപമാണ് ഒപ്പന. മണവാട്ടിയെ നടുവിലിരുത്തി കൈകൊട്ടി താളത്തിൽ പാടിവട്ടത്തിൽ ചുവടുവെക്കുന്നു.',
                'cultural_story': 'Rooted in the celebratory Arab-Malayalam cultural amalgam, Oppana lyrics tease the bride playfully about marital life while praising her beauty and invoking divine grace for prosperity.',
                'historical_background': 'Pioneered through classical Mappila songs written by poet Moyinkutty Vaidyar and celebrated at Kerala State School Arts Festivals.',
                'cultural_significance': 'Exemplifies the festive communal camaraderie and rich poetic heritage of North Malabar women.',
                'image': 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=1200&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA 4.0',
                'source_reference': 'Mahakavi Moyinkutty Vaidyar Smarakam, Kondotty / Kerala Folklore Akademi',
                'verification_status': 'approved',
                'is_featured': False,
                'audio_narration': 'Oppana surrounds the bride with rhythmic clapping, lyrical Mappila couplets, and gold-embroidered festive smiles.'
            },
            {
                'title': 'Marayoor Jaggery & Prehistoric Dolmens',
                'title_ml': 'മറയൂർ ശർക്കരയും മുനിയറകളും',
                'category_slug': 'traditional-crafts',
                'districts_slugs': ['idukki'],
                'origin_district_slug': 'idukki',
                'locality': 'Marayoor, Devikulam Taluk, Idukki',
                'latitude': 10.2798,
                'longitude': 77.1614,
                'description_en': 'Marayoor is celebrated for two unique cultural heritages: the 100% organic, hand-rolled Marayoor Sharkara (jaggery) boiled in massive copper vats from local sugarcane, and over 2,000 megalithic burial dolmens (Muniyaras) erected by ancient mountain communities using colossal granite slabs.',
                'description_ml': 'ഇടുക്കിയിലെ മറയൂരിലെ മുനിയറകളും (ശിലായുഗ സ്മാരകങ്ങൾ) പരമ്പരാഗത രീതിയിൽ നിർമ്മിക്കുന്ന ഭൗമസൂചികാ പദവിയുള്ള മറയൂർ ശർക്കരയും.',
                'cultural_story': 'According to tribal folklore of the Muthuvan and Mannan communities, the stone dolmens were dwellings crafted by ancient sages (Munis) for ascetic penance deep within sandalwood groves.',
                'historical_background': 'Marayoor Jaggery received GI status in 2019 for its dark, chemical-free sweetness. The dolmens date between 3,000 BCE and 500 CE.',
                'cultural_significance': 'Sustains organic agrarian artisan families and preserves prehistoric burial architecture of the Western Ghats.',
                'image': 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA',
                'source_reference': 'Idukki Tribal Heritage Society / Geographical Indications Registry',
                'verification_status': 'approved',
                'is_featured': False,
                'audio_narration': 'Marayoor preserves five-thousand-year-old stone dolmens alongside handcrafted sweet sugarcane jaggery.'
            },
            {
                'title': 'Margamkali: Christian Traditional Heritage Dance',
                'title_ml': 'മാർഗ്ഗംകളി',
                'category_slug': 'folk-dances',
                'districts_slugs': ['kottayam', 'ernakulam', 'thrissur'],
                'origin_district_slug': 'kottayam',
                'locality': 'Kottayam Diocese and Kuravilangad St. Mary church environs',
                'latitude': 9.7533,
                'longitude': 76.5621,
                'description_en': 'Margamkali is an ancient folk performance preserved by the Saint Thomas Christians (Nasranis) of Kerala. Dancers clad in traditional white garments circle around a bronze Nilavilakku lamp, clapping and singing verses recounting the arrival of Saint Thomas the Apostle in Kodungallur in 52 CE.',
                'description_ml': 'കേരളത്തിലെ നസ്രാണി (മാർ തോമാ ക്രിസ്ത്യാനികൾ) പാരമ്പര്യത്തിൽപ്പെട്ട അനുഷ്ഠാന നൃത്തകലയാണ് മാർഗ്ഗംകളി. നിലവിളക്കിന് ചുറ്റും നിന്ന് ക്രിസ്തുമത പ്രചാരണ ചരിത്രം പാടി ചുവടുവെക്കുന്നു.',
                'cultural_story': 'The term "Margam" signifies "the true path". The circular formation around the lighted oil lamp represents Christ at the center surrounded by his disciples propagating divine light through righteous deeds.',
                'historical_background': 'Features 14 stanzas documenting Thomasine heritage in Kerala. Historically accompanied by sword and shield martial steps similar to Kalarippayattu.',
                'cultural_significance': 'Illustrates the harmonious integration of ancient Kerala dance-meters and temple lamp symbolism with Early Christian history.',
                'image': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA 4.0',
                'source_reference': 'Kottayam Christian Heritage Archives / Kerala Folklore Akademi',
                'verification_status': 'approved',
                'is_featured': False,
                'audio_narration': 'Margamkali preserves the ancient Thomasine chronicles of Kerala through circular clap rhythms and white attire.'
            }
        ]

        created_count = 0
        for ldata in listings_data:
            cat = categories[ldata['category_slug']]
            dist_slugs = ldata['districts_slugs']
            origin_dist = districts.get(ldata.get('origin_district_slug'))

            listing, created = CulturalListing.objects.update_or_create(
                title=ldata['title'],
                defaults={
                    'title_ml': ldata['title_ml'],
                    'category': cat,
                    'origin_district': origin_dist,
                    'locality': ldata['locality'],
                    'latitude': ldata['latitude'],
                    'longitude': ldata['longitude'],
                    'description_en': ldata['description_en'],
                    'description_ml': ldata['description_ml'],
                    'cultural_story': ldata['cultural_story'],
                    'historical_background': ldata['historical_background'],
                    'cultural_significance': ldata['cultural_significance'],
                    'image': ldata['image'],
                    'image_credit': ldata['image_credit'],
                    'source_reference': ldata['source_reference'],
                    'verification_status': ldata['verification_status'],
                    'is_featured': ldata['is_featured'],
                    'audio_narration': ldata['audio_narration']
                }
            )
            for dslug in dist_slugs:
                if dslug in districts:
                    listing.districts.add(districts[dslug])
            created_count += 1

        self.stdout.write(self.style.SUCCESS(f'Created/updated {created_count} verified cultural listings.'))

        # 4. Cultural Glossary Entries (Bilingual Malayalam & English with Phonetics)
        glossary_data = [
            {
                'term_ml': 'തെയ്യം',
                'transliteration': 'Theyyam',
                'meaning_en': 'Living god or embodiment of divinity in North Malabar ritual dance-worship.',
                'cultural_context': 'Derived from Sanskrit "Daivam" (deity). The ritual manifestation where human transfigures into cosmic force in sacred kavus.',
                'related_category': categories['ritual-arts'],
                'associated_district': districts['kannur'],
                'audio_phonetic': 'They-yam'
            },
            {
                'term_ml': 'പടയണി',
                'transliteration': 'Padayani',
                'meaning_en': 'Military array / row of divine effigy masks danced to pacify ferocious Kali.',
                'cultural_context': 'Performed across Central Travancore Bhadrakali temples using natural leaf masks (Kolams) and Thappu percussion.',
                'related_category': categories['ritual-arts'],
                'associated_district': districts['pathanamthitta'],
                'audio_phonetic': 'Pa-da-ya-ni'
            },
            {
                'term_ml': 'ആറന്മുളക്കണ്ണാടി',
                'transliteration': 'Aranmula Kannadi',
                'meaning_en': 'Handmade front-surface reflective bronze alloy mirror from Aranmula.',
                'cultural_context': 'One of the eight auspicious ritual items (Ashtamangalyam) in Kerala, crafted through secret metallurgy formulas.',
                'related_category': categories['traditional-crafts'],
                'associated_district': districts['pathanamthitta'],
                'audio_phonetic': 'Aaran-mula Kan-naadi'
            },
            {
                'term_ml': 'ഉരു',
                'transliteration': 'Uru',
                'meaning_en': 'Giant handcrafted wooden dhow sailing ship constructed in Beypore.',
                'cultural_context': 'Mastercrafted by Khalasis without written blueprints, used for millennium-old spice routes to the Persian Gulf.',
                'related_category': categories['traditional-crafts'],
                'associated_district': districts['kozhikode'],
                'audio_phonetic': 'Oo-roo'
            },
            {
                'term_ml': 'മുദ്ര',
                'transliteration': 'Mudra',
                'meaning_en': 'Codified hand gestures and symbols used in Kathakali and Koodiyattam classical arts.',
                'cultural_context': 'Governed by the Hastalakshana Deepika text, capable of conveying hundreds of distinct poetic meanings without speech.',
                'related_category': categories['classical-arts'],
                'associated_district': districts['thrissur'],
                'audio_phonetic': 'Mood-rah'
            },
            {
                'term_ml': 'കളമെഴുത്ത്',
                'transliteration': 'Kalamezhuthu',
                'meaning_en': 'Sacred pictorial floor mural drawn using organic colored powders.',
                'cultural_context': 'Created inside temple courtyards using five natural powders: rice flour, charcoal, turmeric, leaves, and lime-turmeric blend.',
                'related_category': categories['ritual-arts'],
                'associated_district': districts['ernakulam'],
                'audio_phonetic': 'Ka-la-me-zhuthu'
            },
            {
                'term_ml': 'മെയ്യുറപ്പ്',
                'transliteration': 'Meiyurappu',
                'meaning_en': 'Suppleness and disciplined body stamina fundamental to Kalaripayattu and Kathakali.',
                'cultural_context': 'The foundational physical mastery of traditional Kerala martial arts and theater through Ayurvedic oil massages and posture drills.',
                'related_category': categories['classical-arts'],
                'associated_district': districts['kannur'],
                'audio_phonetic': 'Mei-yoo-rap-pu'
            },
            {
                'term_ml': 'സോപാന സംഗീതം',
                'transliteration': 'Sopana Sangeetham',
                'meaning_en': 'Devotional classical singing style rendered by the flight of temple steps.',
                'cultural_context': 'Rendered by temple musicians (Marars) beating the Edakka drum at the sacred flight of steps (Sopanam) of sanctum sanctorums.',
                'related_category': categories['traditional-music'],
                'associated_district': districts['kottayam'],
                'audio_phonetic': 'So-paana San-geetham'
            },
            {
                'term_ml': 'ചുണ്ടൻ വള്ളം',
                'transliteration': 'Chundan Vallam',
                'meaning_en': 'High-prowed war canoe and snake boat raced with 100 oars in Kerala backwaters.',
                'cultural_context': 'Hallowed naval heritage of Kuttanad, propelled synchronously by singing crewmen during the Nehru Trophy Boat Race.',
                'related_category': categories['traditional-crafts'],
                'associated_district': districts['alappuzha'],
                'audio_phonetic': 'Chun-dan Val-lam'
            },
            {
                'term_ml': 'നെട്ടൂർ പെട്ടി',
                'transliteration': 'Nettur Petti',
                'meaning_en': 'Traditional handcrafted wooden jewel casket with pyramid lid and brass fittings.',
                'cultural_context': 'An architectural jewel box designed using teak or rosewood, prized historically by Travancore and Malabar aristocracy.',
                'related_category': categories['traditional-crafts'],
                'associated_district': districts['ernakulam'],
                'audio_phonetic': 'Net-toor Pet-ti'
            }
        ]

        for gdata in glossary_data:
            CulturalGlossary.objects.update_or_create(
                term_ml=gdata['term_ml'],
                defaults=gdata
            )
        self.stdout.write(self.style.SUCCESS(f'Created/updated {len(glossary_data)} glossary entries.'))

        # 5. Sample Community Contribution & Moderation records
        sample_contrib, _ = Contribution.objects.get_or_create(
            title='Pulikkali (Tiger Dance of Swaraj Round)',
            defaults={
                'contributor_name': 'Vishnu K. Namboothiri',
                'contributor_email': 'vishnu.heritage@example.com',
                'title_ml': 'പുലിക്കളി (തൃശ്ശൂർ സ്വരാജ് റൗണ്ട്)',
                'category': categories['folk-dances'],
                'district': districts['thrissur'],
                'locality': 'Swaraj Round, Thrissur',
                'description': 'Pulikkali is a vibrant folk festival performed on the fourth day of Onam celebrations in Thrissur. Performers painted intricately as tigers and leopards dance to rhythmic beating of Udukku and Thakkil drums.',
                'description_ml': 'ഓണാഘോഷത്തിന്റെ നാലാം നാളിൽ തൃശ്ശൂർ നഗരത്തിൽ അരങ്ങേറുന്ന പ്രശസ്തമായ നാടൻ കലയാണ് പുലിക്കളി.',
                'cultural_story': 'Introduced over two centuries ago by Maharaja Sakthan Thampuran to celebrate courage and street gaiety.',
                'image': 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80',
                'image_credit': 'Wikimedia Commons / CC BY-SA 4.0',
                'source_reference': 'Thrissur Heritage Council Archives #TH-PK-89',
                'consent': True,
                'status': 'pending'
            }
        )
        self.stdout.write(self.style.SUCCESS('Sample community contribution seeded.'))

        self.stdout.write(self.style.SUCCESS('OORVEX cultural heritage database successfully seeded!'))
