import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

const API_URL = "https://functions.poehali.dev/84a621f9-94ea-42fe-a500-8c7cda20e15b"

export function CTASection() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "", comment: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) {
      toast({ title: "Заполните имя и телефон", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/submit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast({ title: "Заявка отправлена!", description: "Мы свяжемся с вами в течение 2 часов." })
        setForm({ name: "", phone: "", comment: "" })
      } else {
        throw new Error()
      }
    } catch {
      toast({ title: "Ошибка отправки", description: "Попробуйте ещё раз.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-24 px-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
      <div className="max-w-2xl mx-auto text-center">
        <div className="slide-up">
          <h2 className="text-5xl font-bold text-foreground mb-4 font-sans text-balance">Готовы начать?</h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto">
            Оставьте заявку — обсудим ваш проект и подготовим предложение уже сегодня.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <Input
              placeholder="Ваше имя *"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="bg-black/50 border-red-500/30 text-white placeholder:text-gray-500 focus:border-red-500"
            />
            <Input
              placeholder="Телефон или Email *"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="bg-black/50 border-red-500/30 text-white placeholder:text-gray-500 focus:border-red-500"
            />
            <Textarea
              placeholder="Расскажите о вашем проекте (необязательно)"
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
              rows={4}
              className="bg-black/50 border-red-500/30 text-white placeholder:text-gray-500 focus:border-red-500 resize-none"
            />
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full bg-red-500 text-white hover:bg-red-600 pulse-button text-lg py-4 border-0"
            >
              {loading ? "Отправляем..." : "Отправить заявку"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-4">
            Нажимая кнопку, вы соглашаетесь на обработку персональных данных
          </p>
        </div>
      </div>
    </section>
  )
}