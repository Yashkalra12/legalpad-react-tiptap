"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const handleGuestLogin = () => {
    router.push('/product')
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-vettam-purple">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white">Vettam.ai</h1>
        <p className="mt-2 text-lg text-white/80">The Future of Legal Document Management</p>
      </div>
      <div className="mt-8">
        <Button
          onClick={handleGuestLogin}
          size="lg"
          className="bg-vettam-orange text-white hover:bg-vettam-orange/90"
        >
          Login as Guest
        </Button>
      </div>
    </div>
  )
}
