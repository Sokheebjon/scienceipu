"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import type { LocalizedText } from "@/data/conferences";
import { Modal } from "@/components/ui/Modal";

/**
 * The organiser's terms wording. Kept as data here rather than in the message
 * files: the legal text is one long document, not interface strings.
 */
const TITLE: LocalizedText = {
  uz: "Umumiy foydalanish shartlari",
  en: "General terms and conditions",
};

const INTRO: LocalizedText = {
  uz: "Quyidagi shartlar konferensiya ISHTIROKCHISI va TASHKILOTCHISI oʻrtasidagi munosabatlarga nisbatan qoʻllaniladi. TASHKILOTCHI ushbu qoidalarga oʻzgartirish va qoʻshimchalar kiritishi mumkin; bunday holda ISHTIROKCHILAR ushbu saytda eʼlon qilingan maʼlumotlardan xabardor boʻlib borishlari shart.",
  en: "The following terms and conditions apply to the relations between the PARTICIPANT and the ORGANISER of the conference. The ORGANISER may amend or modify these regulations, in which case the PARTICIPANTS are obliged to keep themselves advised with the information published on this website.",
};

type TermsSection = {
  heading: LocalizedText;
  body?: LocalizedText;
  items?: LocalizedText[];
};

const SECTIONS: TermsSection[] = [
  {
    heading: {
      uz: "Ishtirokchi deb quyidagi shaxslar hisoblanadi:",
      en: "For participants shall be considered persons who:",
    },
    items: [
      {
        uz: "Ushbu saytdagi roʻyxatdan oʻtish shaklini toʻgʻri toʻldirib yuborgan;",
        en: "Have correctly fill out and sent the registration form, found on this website;",
      },
      {
        uz: "TASHKILOTCHIDAN roʻyxatdan oʻtish shakli qabul qilinganligi haqida tasdiq olgan;",
        en: "Have received acknowledgement of receipt for the registration form from the ORGANISER;",
      },
      {
        uz: "Maqola yoki taqdimotini ushbu saytda eʼlon qilingan talablarga muvofiq rasmiylashtirib yuborgan;",
        en: "Have sent their paper or presentation formatted according the requirements published on this website;",
      },
      {
        uz: "TASHKILOTCHIDAN maqola yoki taqdimot qabul qilinganligi haqida tasdiq olgan;",
        en: "Have received acknowledgement of receipt for the paper or presentation from the ORGANISER;",
      },
      {
        uz: "Ushbu shartlar bilan tanishgan va ularga rioya qilishga rozilik bildirgan shaxslar.",
        en: "Are introduced to the terms and conditions described hereof and have accepted their implementation.",
      },
    ],
  },
  {
    heading: {
      uz: "Ishtirokchilarga quyidagilar maʼlum qilinadi:",
      en: "The participants are informed that:",
    },
    items: [
      {
        uz: "Taqdim etilgan barcha shaxsiy maʼlumotlar TASHKILOTCHI tomonidan saqlanadi va qayta ishlanadi;",
        en: "All the consigned personal data will be stored and processed by the ORGANISER;",
      },
      {
        uz: "Qabul qilingan barcha maqola va taqdimotlar TASHKILOTCHI tomonidan saqlanadi, qayta ishlanadi va nashr etiladi;",
        en: "All the received papers and presentations will be stored, processed and published by the ORGANISER;",
      },
      {
        uz: "Tadbir davomida ular suratga olinadi. Ushbu materiallarning bir qismi TASHKILOTCHINING saytida, ijtimoiy tarmoqlarda va boshqa saytlarda eʼlon qilinishi mumkin;",
        en: "They will be photographed during the event. A selection of these visual materials might be published on the ORGANISER’s website, in the social networks and on other sites;",
      },
      {
        uz: "Tadbir davomida har qanday koʻrinishdagi reklama tarqatish TASHKILOTCHINING aniq roziligisiz qatʼiyan taqiqlanadi;",
        en: "The distribution of advertising messages in any form during the event is strictly prohibited, unless done under the explicit assent of the ORGANISER;",
      },
      {
        uz: "Konferensiyaning davomiyligi soʻralgan maʼruzalar soniga hamda mualliflarning ularni taqdim eta olishiga bogʻliq;",
        en: "The duration of the conference depends on the number of presentations requested, as well as the ability of their authors to present them;",
      },
      {
        uz: "Maʼruzalar jadvalini, jumladan sana va vaqtini belgilash faqat TASHKILOTCHINING vakolatidadir. TASHKILOTCHI istaklarni imkon qadar inobatga oladi, biroq yakuniy jadvalni alohida soʻrovlarga mosligini kafolatlamagan holda belgilash huquqini oʻzida saqlab qoladi;",
        en: "The scheduling of presentations, including the date and time, is at the sole discretion of the ORGANISER. While the ORGANISER will make every effort to accommodate preferences, they retain the right to determine the final presentation schedule without guaranteeing compliance with individual requests;",
      },
      {
        uz: "Madaniy dastur tashkil etilishi unga qoʻshilishni istagan ishtirokchilar soniga va ob-havo sharoitiga bogʻliq;",
        en: "The organization of a social program depends on the number of participants willing to join it, as well as the weather conditions;",
      },
      {
        uz: "Dastlabki dasturda koʻrsatilgan maʼruzalar tartibi TASHKILOTCHINING qaroriga koʻra oʻzgartirilishi mumkin;",
        en: "The order of the presentations, listed in the preliminary program, may be changed at ORGANISER’s discretion;",
      },
      {
        uz: "Har bir maqola shaxsan taqdim etilishi kerak. Boshqa shaxslarning maqolalarini taqdim etish TASHKILOTCHINING aniq roziligisiz taqiqlanadi;",
        en: "Each paper should be presented personally. The presentation of other people’s papers is not allowed, unless done under the explicit assent of the ORGANISER;",
      },
      {
        uz: "Konferensiya bilan bogʻliq barcha majburiyatlarni, jumladan maqola taqdimotlari va boshqa chiqishlarni shaxsan bajarishlari shart. Bu majburiyatlarni hammualliflarga, oʻz tashkilotining boshqa aʼzolariga yoki boshqa shaxslarga topshirish TASHKILOTCHINING aniq roziligisiz mumkin emas;",
        en: "They are required to fulfill all conference-related obligations personally, including paper presentations, communications, and other commitments. Delegation of these responsibilities to co-authors, other members of their organizations, or any other individuals cannot be done without explicit approval from the ORGANISER;",
      },
      {
        uz: "ISHTIROKCHI shaxsiy ishtirokini tasdiqlamagan taqdirda, maqolani taqdim etish turi TASHKILOTCHINING qaroriga koʻra oʻzgartirilishi mumkin;",
        en: "The type of presenting a paper may be changed at ORGANISER’s discretion in case there is no confirmation of personal attendance submitted by the PARTICIPANT;",
      },
      {
        uz: "Maqolani roʻyxatdan oʻtish shaklida koʻrsatilgan turdan boshqa turda taqdim etish TASHKILOTCHINING aniq roziligisiz mumkin emas;",
        en: "They cannot present a paper in type other that the statement, submitted in the registration form, unless done under the explicit assent of the ORGANISER;",
      },
      {
        uz: "Maqola nomiga har qanday oʻzgartirish kiritishdan oldin TASHKILOTCHIDAN rozilik olishlari shart;",
        en: "They are required to obtain prior approval from the ORGANISER before making any changes to the title of their paper;",
      },
      {
        uz: "Ogʻzaki maʼruza qiluvchi ishtirokchilardan taqdimotlarini (PowerPoint yoki PDF formatida) saytda koʻrsatilgan muddatgacha oldindan yuborish soʻraladi. Bu TASHKILOTCHIGA texnik tayyorgarlikni oʻz vaqtida koʻrish va maʼruzani dasturga muammosiz kiritish imkonini beradi;",
        en: "Participants with oral presentations are kindly asked to submit their presentations (in PowerPoint or PDF format) in advance, by the deadline stated on the website. This allows the ORGANISER to prepare the technical setup in good time and include the presentation in the programme without difficulty;",
      },
      {
        uz: "Ogʻzaki maʼruzachilar oʻz ishini faqat ogʻzaki bayon qilish bilan cheklanmasdan, koʻrgazmali tarzda ham taqdim etishlari shart. Bu barcha tinglovchilar, jumladan ingliz tili ona tili boʻlmagan va eshitish qobiliyati cheklangan ishtirokchilar ham maʼruzani kuzatib bora olishini taʼminlaydi;",
        en: "Oral presenters are required to provide a visual representation of their work, rather than relying solely on spoken words. This ensures that everyone, including non-native English speakers and those with impaired hearing, can follow the presentation;",
      },
      {
        uz: "Zararli dasturlar va uskunalar mos kelmasligi xavfi tufayli TASHKILOTCHI taqdimotlarni tadbir joyida (USB xotira, tashqi disk va shu kabilardan) yuklashni qabul qilmaydi;",
        en: "The ORGANISER does not accept the uploading (from USB memory sticks, hard drives, etc.) of presentations onsite due to concerns related to malware and hardware incompatibility;",
      },
      {
        uz: "Stend maʼruzachilari posterlarini oldindan PDF formatida yuborishlari shart. Shuningdek, onlayn ishtirokchi boʻlmasalar, posterning bosma nusxasini tadbirga olib kelishlari lozim;",
        en: "Poster presenters must submit their posters in advance, in PDF format. They must also bring a printed version of their poster to the event (if they are not online participants);",
      },
      {
        uz: "Ishtirokka oid hujjatlar roʻyxatdan oʻtishda koʻrsatilgan elektron pochta manziliga yuboriladi. TASHKILOTCHI bu hujjatlarni boshqa manzillarga yoki boshqa shaxslarga yuborish hamda ularning bosma nusxasini taqdim etish majburiyatini olmaydi;",
        en: "They will receive the documents related to their participation at the email address provided during registration. The ORGANISER is not obligated to send these documents to alternative email addresses or other individuals, nor provide hard copies of the same;",
      },
      {
        uz: "Sertifikatlar faqat tadbirda shaxsan qatnashgan va oʻz maqolasini taqdim etgan ISHTIROKCHILARGA beriladi;",
        en: "Certificates are given only to PARTICIPANTS who attended the event personally and presented own papers;",
      },
      {
        uz: "Posterlarni TASHKILOTCHI saytida koʻrsatilgan talablarga muvofiq qogʻozda topshirishlari va stend sessiyasi boshlanishidan 30 daqiqa oldin shu maqsadda ajratilgan panellarga joylashtirishlari kerak;",
        en: "They have to submit their posters on paper according to the specifications, listed in the ORGANISER’s website and display them on the panels provided for that purpose 30 minutes before the poster session starts;",
      },
      {
        uz: "TASHKILOTCHI plagiat va mualliflik huquqini buzishning har qanday koʻrinishini qatʼiyan taqiqlaydi. Maqola va taqdimotlarning originalligi hamda foydalanilgan barcha manbalarga toʻgʻri havola berilishi uchun ISHTIROKCHILAR javobgardir;",
        en: "The ORGANISER strictly prohibits plagiarism and copyright infringement in any form. PARTICIPANTS are responsible for ensuring that their papers and presentations are original and properly attributed to all sources used;",
      },
      {
        uz: "Tadbir davomida professional va hurmatga asoslangan XULQ-ATVOR QOIDALARIGA rioya qilishlari kutiladi. Tartibbuzarlik yoki XULQ-ATVOR QOIDALARINING buzilishi tadbirga kiritmaslikka olib kelishi mumkin, bunda kompensatsiya toʻlanmaydi;",
        en: "They are expected to adhere to a professional and respectful CODE OF CONDUCT during the event. Any disruptive behavior or violation of the event’s CODE OF CONDUCT may lead to denial of access to the event, without compensation;",
      },
      {
        uz: "ISHTIROKCHI va TASHKILOTCHI oʻrtasidagi barcha yozishmalar maxfiy hisoblanadi. Ularni ommaviy ravishda yoki uchinchi shaxslarga oshkor qilish mumkin emas;",
        en: "The entire correspondence between the PARTICIPANT and the ORGANISER is confidential. It must not be disclosed publicly or to any third parties;",
      },
      {
        uz: "18 yoshga toʻlmagan shaxslar tadbirga qoʻyilmaydi.",
        en: "Persons under 18 years of age are not allowed to the event.",
      },
    ],
  },
  {
    heading: {
      uz: "Ishtirokchilar quyidagilarni kafolatlaydilar:",
      en: "The participants engage that:",
    },
    items: [
      {
        uz: "Taqdim etilgan barcha shaxsiy maʼlumotlar toʻgʻri va dolzarb ekanligini;",
        en: "All personal data they provide is valid and current;",
      },
      {
        uz: "Taqdim etilgan barcha maqola va taqdimotlarning muallifi ekanliklarini yoki taqdim etish uchun ushbu umumiy shartlar bilan tanishgan haqiqiy muallif va/yoki hammualliflarning aniq roziligini olganliklarini;",
        en: "They are authors of all the provided papers and presentations or they received the explicit assent for presentation by the actual author and/or co-author, who are also introduced to the general terms and conditions hereof;",
      },
      {
        uz: "Taqdim etilgan maqola va taqdimotlar mazmuni hamda uni oshkor qilishning ehtimoliy oqibatlari uchun toʻliq javobgarlikni oʻz zimmalariga olishlarini.",
        en: "Bear full responsibility for the content of the provided papers and presentations as well as the possible consequences of its disclosure.",
      },
    ],
  },
  {
    heading: {
      uz: "Tashkilotchi quyidagi shaxslarni tadbirga kiritmasligi mumkin:",
      en: "The organiser can deny access to the event for persons who:",
    },
    items: [
      {
        uz: "Amaldagi shaxsni tasdiqlovchi hujjatni koʻrsatmagan;",
        en: "Would not show a valid identification document;",
      },
      {
        uz: "Ishtirok shartlari bajarilganligini tasdiqlovchi amaldagi hujjatni koʻrsatmagan;",
        en: "Would not show a valid document, certifying the proper requirement for participation were met;",
      },
      {
        uz: "TASHKILOTCHINING aniq roziligisiz har qanday turdagi reklama tarqatayotgan;",
        en: "Distribute advertising messages of any kind, unless done under the explicit assent of the ORGANISER;",
      },
      {
        uz: "Tadbirning meʼyorida oʻtishiga xalaqit berayotgan;",
        en: "Hinder the normal occurring of the event;",
      },
      {
        uz: "Mast holatdagi yoki umumiy axloq meʼyorlariga zid harakat qilayotgan;",
        en: "Are in a drunken state or derogate from common morality;",
      },
      {
        uz: "TASHKILOTCHI, ISHTIROKCHILAR yoki boshqa shaxslar va tashkilotlarning obroʻsi va shaʼniga putur yetkazayotgan shaxslar.",
        en: "Derogate from the ORGANISER’s, PARTICIPANTS or other persons and organizations prestige and honor.",
      },
    ],
  },
  {
    heading: {
      uz: "Tashkilotchi quyidagi hollarda maqolani taqdim etishni rad qilishi mumkin:",
      en: "The organiser can deny presenting papers in case:",
    },
    items: [
      {
        uz: "Saytda koʻrsatilgan talablarga javob bermasa;",
        en: "They do not meet the requirements, listed on the website;",
      },
      {
        uz: "Tegishli tadbirning mavzu yoʻnalishiga mos kelmasa;",
        en: "They are not relevant to the thematic area of the corresponding event;",
      },
      {
        uz: "Mualliflik huquqi masalalari noaniq yoki hal etilmagan boʻlsa;",
        en: "They have obscure or unsettled copyright issues;",
      },
      {
        uz: "Uchinchi shaxslar yoki boshqa tashkilotlarning obroʻsi va shaʼniga putur yetkazsa;",
        en: "They derogate from third parties or other organizations prestige and honor;",
      },
      {
        uz: "ISHTIROKCHI yuborgan fayllar texnik uskunalarga zarar yetkazishi mumkin boʻlsa.",
        en: "The submitted by the PARTICIPANT files can have pernicious influence on the technical equipment.",
      },
    ],
  },
  {
    heading: {
      uz: "Tashkilotchi quyidagi hollarda maqolani nashr etishni rad qilishi mumkin:",
      en: "The organiser can deny publishing a paper in case they:",
    },
    items: [
      {
        uz: "Saytda koʻrsatilgan talablarga javob bermasa;",
        en: "Do not meet the requirements, listed on the website;",
      },
      {
        uz: "Tegishli jurnalning mavzu yoʻnalishiga mos kelmasa;",
        en: "Are not relevant to the thematic area of the corresponding journal;",
      },
      {
        uz: "Mualliflik huquqi masalalari noaniq yoki hal etilmagan boʻlsa;",
        en: "Have obscure or unsettled copyright issues;",
      },
      {
        uz: "Uchinchi shaxslar yoki boshqa tashkilotlarning obroʻsi va shaʼniga putur yetkazsa.",
        en: "Derogate from third parties or other organizations prestige and honor.",
      },
    ],
  },
  {
    heading: {
      uz: "Fors-major:",
      en: "Force Majeure:",
    },
    body: {
      uz: "TASHKILOTCHI oʻz nazorati doirasidan tashqaridagi holatlar — tabiiy ofatlar, terrorchilik harakatlari yoki davlat cheklovlari tufayli majburiyatlarini bajara olmagani uchun javobgar boʻlmaydi.",
      en: "The ORGANISER shall not be held liable for any failure to perform its obligations in the event of circumstances beyond their control, such as natural disasters, acts of terrorism, or government restrictions.",
    },
  },
];

const headingClass = "text-primary-800 font-bold tracking-wide uppercase";

export function TermsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeLabel={t("common.close")}
      labelledBy="terms-modal-title"
    >
      <div className="space-y-5 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
        <section className="space-y-2">
          <h2 id="terms-modal-title" className={headingClass}>
            {TITLE[locale]}
          </h2>
          <p>{INTRO[locale]}</p>
        </section>

        {SECTIONS.map((section) => (
          <section key={section.heading.en} className="space-y-2">
            <h3 className={headingClass}>{section.heading[locale]}</h3>
            {section.body ? <p>{section.body[locale]}</p> : null}
            {section.items ? (
              <ul className="list-disc space-y-1.5 pl-5">
                {section.items.map((item) => (
                  <li key={item.en}>{item[locale]}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </Modal>
  );
}
