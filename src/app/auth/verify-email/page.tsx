'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Utiliser setTimeout pour éviter l'avertissement React
          setTimeout(() => {
            router.push('/auth/login')
          }, 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
            ScaleUp Academy
          </h1>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <svg
              className="mx-auto h-12 w-12 text-green-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Vérifiez votre email
            </h2>
            <p className="text-gray-600 mb-4">
              Un email de confirmation a été envoyé à votre adresse. 
              Veuillez cliquer sur le lien dans l'email pour activer votre compte.
            </p>
            <p className="text-sm text-gray-500">
              Si vous ne recevez pas l'email dans les prochaines minutes, 
              vérifiez votre dossier spam.
            </p>
          </div>
          
          <div className="text-sm text-gray-600">
            <p className="mb-2">
              Redirection vers la page de connexion dans {countdown} secondes...
            </p>
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Aller à la page de connexion maintenant
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}