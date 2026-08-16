import type { LocalizedText } from "./conferences";

/**
 * Cultural excursion program to Samarkand, offered within the framework of
 * the international scientific and practical conference "Current Issues of
 * Science and Technology" (October 8–10, Karshi, Uzbekistan).
 *
 * Source: the organisers' excursion program document; stop times are local
 * and approximate.
 */

export type ExcursionStop = {
  id: string;
  /** Visit window, local time. */
  time: string;
  name: LocalizedText;
  /** One or two paragraphs per stop. */
  description: { uz: string[]; en: string[] };
  image: string;
};

export const excursionStops: ExcursionStop[] = [
  {
    id: "gur-emir",
    time: "13:30 – 14:15",
    name: {
      uz: "Amir Temur maqbarasi — Goʻri Amir majmuasi",
      en: "Amir Temur Mausoleum — Gur-i Amir Complex",
    },
    description: {
      en: [
        "The Gur-i Amir Complex in Samarkand, Uzbekistan, is a monumental 15th-century masterpiece serving as the final resting place of the legendary conqueror Amir Temur (Tamerlane). The mausoleum also houses the tombs of his sons, his spiritual mentor Mir Said Baraka, and his astronomer grandson Ulugh Beg. Originally built by Temur for his beloved grandson Muhammad Sultan, the complex features a magnificent 64-ribbed turquoise dome, an arched portal, and tall minarets.",
        "Inside, breathtaking gold leaf, onyx, and geometric tilework surround Tamerlane’s central tombstone — a rare block of dark green jade — with the actual graves protected in an underground crypt below. Renowned for its architectural elegance and historical significance, Gur-i Amir directly inspired iconic landmarks, including India’s famous Taj Mahal.",
      ],
      uz: [
        "Samarqanddagi Goʻri Amir majmuasi — XV asrning muhtasham durdonasi boʻlib, buyuk sohibqiron Amir Temurning soʻnggi qoʻnim topgan maskani. Maqbarada shuningdek uning oʻgʻillari, piri Mir Said Baraka va munajjim nabirasi Mirzo Ulugʻbek dafn etilgan. Aslida Temur suyukli nabirasi Muhammad Sulton uchun bunyod ettirgan majmua 64 qirrali feruza gumbazi, ravoqli peshtoqi va baland minoralari bilan ajralib turadi.",
        "Ichkarida zarhal, oniks va geometrik koshinkorlik Amir Temurning markaziy qabrtoshi — noyob toʻq yashil nefrit toshi atrofini bezab turadi; haqiqiy qabrlar esa pastdagi yer osti daxmasida saqlanadi. Meʼmoriy nafisligi va tarixiy ahamiyati bilan mashhur Goʻri Amir Hindistonning mashhur Toj Mahali kabi timsollarga bevosita ilhom bergan.",
      ],
    },
    image: "/img/excursion/01-gur-emir.jpg",
  },
  {
    id: "registan",
    time: "14:15 – 15:00",
    name: {
      uz: "Registon ansambli",
      en: "Registan Ensemble",
    },
    description: {
      en: [
        "The Registan Ensemble in Samarkand, Uzbekistan, is the grand heart of the ancient Silk Road and one of Central Asia’s most iconic architectural wonders. Meaning “sandy place” in Persian, this historic public square is framed by three grand, brilliantly tiled madrasahs built over two centuries.",
        "To the west stands the 15th-century Ulugh Beg Madrasah, an early center of astronomy and mathematics. Facing it is the 17th-century Sher-Dor Madrasah, famous for its striking mosaics depicting tigers pursuing stags beneath human-faced suns. Completing the trio is the central Tilya-Kori Madrasah, renowned for its lavishly gilded mosque interior. Together, their soaring portals, turquoise domes, and intricate geometric tilework form a breathtaking masterpiece of Islamic architecture.",
      ],
      uz: [
        "Samarqanddagi Registon ansambli — qadimgi Ipak yoʻlining yuragi va Markaziy Osiyoning eng mashhur meʼmoriy moʻjizalaridan biri. Forschada “qumli joy” maʼnosini anglatuvchi bu tarixiy maydonni ikki asr davomida qurilgan uchta muhtasham, koshinlar bilan bezatilgan madrasa oʻrab turadi.",
        "Gʻarbda XV asrga oid, oʻz davrida astronomiya va matematika markazi boʻlgan Ulugʻbek madrasasi qad rostlagan. Uning roʻparasida XVII asrda qurilgan, odam yuzli quyoshlar ostida ohularni quvayotgan yoʻlbarslar tasvirlangan mozaikalari bilan mashhur Sherdor madrasasi joylashgan. Uchlikni markazdagi, zarhal bezakli masjid interyeri bilan dong taratgan Tillakori madrasasi yakunlaydi. Ularning osmonoʻpar peshtoqlari, feruza gumbazlari va nafis geometrik koshinkorligi islom meʼmorchiligining betakror durdonasini tashkil etadi.",
      ],
    },
    image: "/img/excursion/02-registan.jpg",
  },
  {
    id: "bibi-khanym",
    time: "15:00 – 15:45",
    name: {
      uz: "Bibixonim majmuasi",
      en: "Bibi-Khanym Complex",
    },
    description: {
      en: [
        "The Bibi-Khanym Mosque Complex in Samarkand, Uzbekistan, is one of the most monumental architectural achievements of the Timurid era. Commissioned in 1399 by Amir Temur following his successful Indian campaign, this colossal mosque was intended to be the grandest place of worship in the Islamic world and named in honor of his chief wife. Constructed using 95 war elephants to transport heavy stone, the complex pushed medieval engineering to its limits.",
        "Today, visitors are greeted by a breathtaking 35-meter-high entrance portal leading to a vast courtyard. At its center stands a famous carved marble stand that once held the ancient Uthman Quran. With its soaring turquoise domes, cobalt mosaics, and dramatic scale, Bibi-Khanym remains an unmissable Silk Road treasure.",
      ],
      uz: [
        "Samarqanddagi Bibixonim jome masjidi majmuasi — Temuriylar davrining eng ulugʻvor meʼmoriy yodgorliklaridan biri. 1399-yilda Amir Temur Hindiston yurishidan zafar bilan qaytgach qurdirgan bu ulkan masjid islom olamining eng katta ibodatxonasi boʻlishi koʻzda tutilgan va sohibqironning bosh xotini sharafiga nomlangan. Ogʻir toshlarni tashish uchun 95 ta jangovar fil jalb etilgan qurilish oʻrta asr muhandisligini imkoniyatlari chegarasigacha olib chiqqan.",
        "Bugun mehmonlarni keng hovliga olib boruvchi 35 metrli peshtoq qarshi oladi. Hovli markazida qadimiy Usmon Qurʼoni qoʻyilgan mashhur oʻymakor marmar lavh turadi. Feruza gumbazlari, kobalt mozaikalari va ulkan koʻlami bilan Bibixonim Ipak yoʻlining koʻrmasa boʻlmas javohiri sanaladi.",
      ],
    },
    image: "/img/excursion/03-bibi-khanym.jpg",
  },
  {
    id: "siyob-bazaar",
    time: "15:45 – 16:30",
    name: {
      uz: "Siyob bozori",
      en: "Siyob Bazaar",
    },
    description: {
      en: [
        "Siyob Bazaar (Siyob Bozori) in Samarkand is the city’s largest and oldest open-air market, carrying on a vibrant trading tradition that dates back to the height of the Silk Road. Bustling beneath colorful, covered pavilions right beside the historic Bibi-Khanym Mosque, this sensory haven offers tourists an authentic immersion into daily Uzbek culture. Rows of welcoming vendors proudly display overflowing sacks of aromatic spices, dried fruits, toasted nuts, sweet halva, and fresh seasonal produce.",
        "The bazaar is most famous for its legendary Samarkand non, the thick, golden flatbread baked fresh in traditional clay tandoor ovens and celebrated for remaining fresh for weeks. Wandering through its lively aisles provides an unforgettable taste of Central Asian hospitality, colors, and flavors.",
      ],
      uz: [
        "Samarqanddagi Siyob bozori — shaharning eng katta va eng qadimiy ochiq bozori boʻlib, Ipak yoʻli gullagan davrlardan beri davom etib kelayotgan qizgʻin savdo anʼanasini saqlab kelmoqda. Tarixiy Bibixonim masjidi yonida, rang-barang ravoqlar ostida qaynagan bu maskan sayyohlarga oʻzbek kundalik madaniyatiga chinakam shoʻngʻish imkonini beradi. Ochiq chehrali sotuvchilar xushboʻy ziravorlar, quritilgan mevalar, qovurilgan yongʻoqlar, shirin holva va yangi mavsumiy mahsulotlarga toʻla qoplarni faxr bilan namoyish etadi.",
        "Bozor ayniqsa afsonaviy Samarqand noni bilan mashhur — anʼanaviy tandirda yopiladigan qalin, tillarang non haftalab dasturxonda tarovatini yoʻqotmasligi bilan eʼzozlanadi. Uning gavjum rastalari boʻylab sayr Markaziy Osiyo mehmondoʻstligi, ranglari va taʼmlaridan unutilmas taassurot qoldiradi.",
      ],
    },
    image: "/img/excursion/04-siyob-bazaar.jpg",
  },
  {
    id: "hazrat-khizr",
    time: "16:30 – 17:15",
    name: {
      uz: "Hazrati Xizr masjidi",
      en: "Hazrat Khizr Mosque",
    },
    description: {
      en: [
        "The Hazrat Khizr Mosque in Samarkand, Uzbekistan, stands dramatically on an ancient hill overlooking the Siyob Bazaar and the Afrasiyab settlement. Originally built in the 8th century and meticulously restored in the 19th century, it is named after the legendary patron saint of travelers. Renowned for its wooden columned iwan, beautifully carved ceilings, and colorful ganch stucco, the mosque offers sweeping panoramic views of the city’s historic skyline.",
        "Adjacent to the complex is the modern mausoleum of Islam Karimov, Uzbekistan’s first president, built with exquisite marble and precious stones. Flanked by an ancient cemetery and picturesque viewing terraces, this serene landmark seamlessly blends early Islamic history, refined craft traditions, and modern national heritage, making it a captivating stop for travelers.",
      ],
      uz: [
        "Samarqanddagi Hazrati Xizr masjidi Siyob bozori va Afrosiyob shahristoniga qaragan qadimiy tepalikda salobat bilan qad rostlagan. Dastlab VIII asrda bunyod etilib, XIX asrda sinchkovlik bilan qayta tiklangan masjid yoʻlovchilarning afsonaviy homiysi nomi bilan ataladi. Yogʻoch ustunli ayvoni, nafis oʻymakor shiftlari va rang-barang ganch bezaklari bilan mashhur bu maskandan shaharning tarixiy manzarasi kaftdek koʻrinadi.",
        "Majmua yonida Oʻzbekistonning birinchi prezidenti Islom Karimovning nafis marmar va qimmatbaho toshlardan bunyod etilgan zamonaviy maqbarasi joylashgan. Qadimiy qabriston va goʻzal manzarali ayvonlar bilan oʻralgan bu sokin maskan ilk islom tarixi, yuksak hunarmandchilik anʼanalari va zamonaviy milliy merosni oʻzida uygʻun jamlagan.",
      ],
    },
    image: "/img/excursion/05-hazrat-khizr.jpg",
  },
  {
    id: "shah-i-zinda",
    time: "17:15 – 18:00",
    name: {
      uz: "Shohizinda majmuasi",
      en: "Shah-i-Zinda Complex",
    },
    description: {
      en: [
        "The Shah-i-Zinda Complex in Samarkand, Uzbekistan, is a breathtaking avenue of mausoleums that stands among Central Asia’s most sacred pilgrimage sites and architectural wonders. Meaning “The Living King,” the complex is centered around the 7th-century tomb of Kusam ibn Abbas, a cousin of the Prophet Muhammad credited with bringing Islam to the region.",
        "Developed across nine centuries, from the 11th to the 19th century, this hill-bound ensemble features an ascending pathway lined with exquisite shrines built for Timurid nobility, generals, and royal women. Visitors ascend a grand stone stairway into a narrow open-air gallery renowned for possessing the finest tilework in the Islamic world. Adorned with dazzling turquoise ceramics, deeply carved majolica, and gold leaf, Shah-i-Zinda offers an unforgettable fusion of deep spirituality, royal history, and artistic perfection.",
      ],
      uz: [
        "Samarqanddagi Shohizinda majmuasi — Markaziy Osiyoning eng tabarruk ziyoratgohlari va meʼmoriy moʻjizalari qatoridan oʻrin olgan maqbaralar xiyoboni. “Tirik shoh” maʼnosini anglatuvchi majmua markazida Muhammad paygʻambarning amakivachchasi, oʻlkaga islomni olib kirgan Qusam ibn Abbosning VII asrga oid qabri joylashgan.",
        "XI asrdan XIX asrgacha — toʻqqiz asr davomida shakllangan bu tepalik ansambli temuriy zodagonlar, sarkardalar va malikalar uchun qurilgan nafis maqbaralar tizilgan yuksalib boruvchi yoʻlakdan iborat. Ziyoratchilar ulkan tosh zinapoyadan koʻtarilib, islom olamidagi eng nafis koshinkorlik namunalari jamlangan tor ochiq galereyaga kiradilar. Koʻzni qamashtiruvchi feruza sopol, chuqur oʻyilgan mayolika va zarhal bilan bezatilgan Shohizinda teran maʼnaviyat, shohona tarix va badiiy barkamollikning unutilmas uygʻunligini taqdim etadi.",
      ],
    },
    image: "/img/excursion/06-shah-i-zinda.jpg",
  },
];

/** Overall program window shown in the page facts strip. */
export const excursionTimeRange = "13:30 – 18:00";
