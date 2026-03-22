import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "Сколько стоит разработка сайта?",
      answer:
        "Стоимость зависит от типа и сложности сайта. Лендинг — от 30 000 ₽, корпоративный сайт — от 60 000 ₽, интернет-магазин — от 100 000 ₽. После обсуждения вашего проекта мы подготовим точное КП.",
    },
    {
      question: "Сколько времени занимает разработка?",
      answer:
        "Лендинг — 5–7 рабочих дней, корпоративный сайт — 2–3 недели, интернет-магазин — 4–6 недель. Сроки зависят от сложности и скорости согласования материалов.",
    },
    {
      question: "Что нужно предоставить для начала работы?",
      answer:
        "Достаточно рассказать о вашем бизнесе и пожеланиях к сайту. Логотип, фото и тексты — поможем оформить. Если чего-то нет, найдём решение.",
    },
    {
      question: "Сайт будет адаптирован под мобильные устройства?",
      answer:
        "Да, все наши сайты работают идеально на смартфонах, планшетах и компьютерах. Адаптивная вёрстка включена в стоимость.",
    },
    {
      question: "Что происходит после сдачи сайта?",
      answer:
        "Вы получаете 3 месяца бесплатной поддержки: правки, обновления, консультации. После — гибкие тарифы на сопровождение.",
    },
    {
      question: "Можно ли потом самому редактировать сайт?",
      answer:
        "Да! Подключаем удобную панель управления, где вы сможете обновлять тексты, фото и добавлять страницы без технических знаний.",
    },
  ]

  return (
    <section id="faq" className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-orbitron">Частые вопросы</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-space-mono">
            Ответы на вопросы о разработке, стоимости и сроках.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-red-500/20 mb-4">
                <AccordionTrigger className="text-left text-lg font-semibold text-white hover:text-red-400 font-orbitron px-6 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed px-6 pb-4 font-space-mono">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
