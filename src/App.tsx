import { useEffect, useState } from 'react'

export function App() {
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    const tg = window.Telegram?.WebApp

    if (tg) {
      tg.ready()
      tg.expand()

      const user = tg.initDataUnsafe?.user
      if (user) {
        setUserName(user.first_name || '')
      }
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 text-zinc-100">
      <h1 className="text-2xl font-bold tracking-tight">Volley Coach</h1>
      <p className="mt-2 text-sm text-zinc-400">
        {userName ? `Привет, ${userName}!` : 'Запущено внутри Telegram'}
      </p>
    </div>
  )
}

export default App