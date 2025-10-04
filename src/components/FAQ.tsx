import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "Gambar berapa keping seorang?",
    answer: "5-10 keping. Minimum. Biasanya lebih dari 10 keping."
  },
  {
    question: "Nanti gambar diberi dalam bentuk apa?",
    answer: "Kami hantar dalam bentuk digital (JPEG, high resolution). Sesuai untuk print, website, dan LinkedIn. Kalau perlukan saiz khas, boleh request."
  },
  {
    question: "Berapa lama satu sesi photoshoot?",
    answer: "Biasanya 5–10 minit seorang. Untuk satu team, bergantung pada jumlah staff."
  },
  {
    question: "Perlu sediakan apa-apa sebelum shoot?",
    answer: "Ruang yang kosong besar meeting room. Kalau takde bilik lobby pun boleh."
  },
  {
    question: "Latar belakang colour apa?",
    answer: "Boleh pilih background jika TEAM PHOTOSHOOT. Kalau individual, kami akan jadikan office sebagai background."
  },
  {
    question: "Macam mana dengan editing?",
    answer: "Setiap gambar akan melalui basic retouching (cahaya, warna, kulit). Extra editing (contoh: tukar background, edit jerawat, kuruskan badan) adalah extra add-on."
  },
  {
    question: "Office saya tak berapa photogenic, boleh ke buat photoshoot?",
    answer: "Kalau office tak sesuai kami akan rekomen untuk buat photoshoot di cafe."
  },
  {
    question: "Berapa lama dapat gambar siap?",
    answer: "Biasanya 3–5 hari bekerja. Kalau urgent, boleh request rush delivery."
  },
  {
    question: "Apa beza photoshoot di pejabat berbanding di studio?",
    answer: "Kami bawa lighting, backdrop, dan semua kelengkapan ke tempat anda. Kualiti sama macam studio, tapi lebih jimat masa sebab team anda tak perlu keluar pejabat."
  },
  {
    question: "Berapa harga pakej?",
    answer: "Harga ikut bilangan orang dan lokasi."
  }
];

export const FAQ: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Soalan Lazim
          </h2>
          <p className="text-gray-300 text-lg">
            Jawapan kepada soalan yang sering ditanya tentang perkhidmatan photoshoot kami
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-gray-700 rounded-xl border-0 px-6 py-4 hover:bg-gray-600 transition-colors"
              >
                <AccordionTrigger className="text-white font-semibold text-left hover:no-underline [&[data-state=open]]:text-white group">
                  <span className="flex-1 text-left">{faq.question}</span>
                  <div className="ml-4 flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    <span className="text-white text-lg font-bold group-data-[state=open]:hidden">+</span>
                    <span className="text-white text-lg font-bold hidden group-data-[state=open]:block">−</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pt-2 pb-0">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
