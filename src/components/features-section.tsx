import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    title: "Сайты под ключ",
    description: "Разрабатываем лендинги, корпоративные сайты и интернет-магазины — от дизайна до запуска.",
    icon: "globe",
    badge: "Полный цикл",
  },
  {
    title: "Современный дизайн",
    description: "Уникальный дизайн под ваш бренд: красиво, стильно и удобно для пользователей.",
    icon: "target",
    badge: "UI/UX",
  },
  {
    title: "Быстрая загрузка",
    description: "Оптимизируем сайты для скорости — ваши клиенты не будут ждать.",
    icon: "zap",
    badge: "Скорость",
  },
  {
    title: "SEO-продвижение",
    description: "Настраиваем сайт так, чтобы он попадал в топ поисковых систем и приводил клиентов.",
    icon: "brain",
    badge: "SEO",
  },
  {
    title: "Техподдержка",
    description: "После запуска остаёмся на связи — обновления, правки и помощь в любой момент.",
    icon: "link",
    badge: "24/7",
  },
  {
    title: "Безопасность",
    description: "SSL-сертификаты, защита от взломов и регулярные резервные копии вашего сайта.",
    icon: "lock",
    badge: "Защита",
  },
]

export function FeaturesSection() {
  return (
    <section id="services" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-sans">Что мы делаем</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Всё что нужно для вашего присутствия в интернете — в одном месте
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glow-border hover:shadow-lg transition-all duration-300 slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">
                    {feature.icon === "brain" && "&#128269;"}
                    {feature.icon === "lock" && "&#128274;"}
                    {feature.icon === "globe" && "&#127760;"}
                    {feature.icon === "zap" && "&#9889;"}
                    {feature.icon === "link" && "&#128279;"}
                    {feature.icon === "target" && "&#127912;"}
                  </span>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
