import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Icon from "@/components/ui/icon"

interface Request {
  id: number
  name: string
  phone: string
  comment: string
  status: string
  admin_reply: string
  created_at: string
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "Новая", color: "bg-red-500" },
  in_progress: { label: "В работе", color: "bg-yellow-500" },
  done: { label: "Завершена", color: "bg-green-600" },
  cancelled: { label: "Отменена", color: "bg-gray-500" },
}

export default function Admin() {
  const { toast } = useToast()
  const [token, setToken] = useState("")
  const [authed, setAuthed] = useState(false)
  const [requests, setRequests] = useState<Request[]>([])
  const [selected, setSelected] = useState<Request | null>(null)
  const [reply, setReply] = useState("")
  const [status, setStatus] = useState("new")
  const [loading, setLoading] = useState(false)
  const [apiUrl, setApiUrl] = useState("")

  useEffect(() => {
    fetch("/func2url.json")
      .then(r => r.json())
      .then(d => setApiUrl(d["submit-request"] || ""))
      .catch(() => {})
  }, [])

  const login = async () => {
    setLoading(true)
    try {
      const res = await fetch(apiUrl || "/api/submit-request", {
        headers: { "x-admin-token": token },
      })
      if (res.ok) {
        const data = await res.json()
        setRequests(data.requests || [])
        setAuthed(true)
        localStorage.setItem("admin_token", token)
      } else {
        toast({ title: "Неверный пароль", variant: "destructive" })
      }
    } catch {
      toast({ title: "Ошибка подключения", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const loadRequests = async () => {
    const t = token || localStorage.getItem("admin_token") || ""
    const res = await fetch(apiUrl || "/api/submit-request", {
      headers: { "x-admin-token": t },
    })
    if (res.ok) {
      const data = await res.json()
      setRequests(data.requests || [])
    }
  }

  const openRequest = (r: Request) => {
    setSelected(r)
    setReply(r.admin_reply || "")
    setStatus(r.status || "new")
  }

  const saveReply = async () => {
    if (!selected) return
    setLoading(true)
    const t = token || localStorage.getItem("admin_token") || ""
    try {
      const res = await fetch(apiUrl || "/api/submit-request", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-token": t },
        body: JSON.stringify({ id: selected.id, status, admin_reply: reply }),
      })
      if (res.ok) {
        toast({ title: "Сохранено!" })
        setSelected(null)
        await loadRequests()
      }
    } catch {
      toast({ title: "Ошибка сохранения", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <Card className="w-full max-w-sm bg-zinc-900 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-white font-orbitron text-center">
              Web<span className="text-red-500">Studio</span> Админка
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Пароль администратора"
              value={token}
              onChange={e => setToken(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
              className="bg-black border-red-500/30 text-white placeholder:text-gray-500"
            />
            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white border-0"
              onClick={login}
              disabled={loading}
            >
              {loading ? "Вхожу..." : "Войти"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold font-orbitron">
            Web<span className="text-red-500">Studio</span> — Заявки
          </h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={loadRequests} className="border-red-500/30 text-white hover:bg-red-500/10">
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Обновить
            </Button>
            <Button variant="outline" onClick={() => { setAuthed(false); setToken("") }} className="border-red-500/30 text-gray-400 hover:bg-red-500/10">
              Выйти
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(STATUS_LABELS).map(([key, val]) => (
            <div key={key} className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
              <div className="text-sm text-gray-400 mb-1">{val.label}</div>
              <div className="text-2xl font-bold">{requests.filter(r => r.status === key).length}</div>
            </div>
          ))}
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <div className="text-sm text-gray-400 mb-1">Всего</div>
            <div className="text-2xl font-bold">{requests.length}</div>
          </div>
        </div>

        {selected ? (
          <Card className="bg-zinc-900 border-red-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Заявка #{selected.id} — {selected.name}</CardTitle>
                <Button variant="ghost" onClick={() => setSelected(null)} className="text-gray-400">
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Имя</div>
                  <div className="text-white">{selected.name}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Телефон / Email</div>
                  <div className="text-white">{selected.phone}</div>
                </div>
              </div>
              {selected.comment && (
                <div>
                  <div className="text-xs text-gray-400 mb-1">Комментарий клиента</div>
                  <div className="text-white bg-black/40 rounded p-3">{selected.comment}</div>
                </div>
              )}
              <div>
                <div className="text-xs text-gray-400 mb-2">Статус заявки</div>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="bg-black border-red-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                    {Object.entries(STATUS_LABELS).map(([key, val]) => (
                      <SelectItem key={key} value={key}>{val.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-2">Ваш ответ / заметки</div>
                <Textarea
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder="Напишите ответ или заметку по этой заявке..."
                  rows={4}
                  className="bg-black border-red-500/30 text-white placeholder:text-gray-500 resize-none"
                />
              </div>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white border-0"
                onClick={saveReply}
                disabled={loading}
              >
                {loading ? "Сохраняю..." : "Сохранить"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {requests.length === 0 && (
              <div className="text-center text-gray-500 py-16">Заявок пока нет</div>
            )}
            {requests.map(r => (
              <div
                key={r.id}
                onClick={() => openRequest(r)}
                className="bg-zinc-900 border border-zinc-800 hover:border-red-500/40 rounded-lg p-4 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm">#{r.id}</span>
                    <span className="font-semibold text-white">{r.name}</span>
                    <span className="text-gray-400 text-sm">{r.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString("ru-RU")}</span>
                    <Badge className={`${STATUS_LABELS[r.status]?.color || "bg-gray-500"} text-white border-0 text-xs`}>
                      {STATUS_LABELS[r.status]?.label || r.status}
                    </Badge>
                  </div>
                </div>
                {r.comment && (
                  <p className="text-gray-400 text-sm mt-2 truncate">{r.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
