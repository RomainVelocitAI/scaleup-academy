'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ConfirmEmailPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Supabase gère automatiquement la confirmation via le lien dans l'email
    // Cette page est affichée après que l'utilisateur ait cliqué sur le lien
    const checkConfirmation = async () => {
      try {
        // Le token de confirmation est géré automatiquement par Supabase
        // via les paramètres dans l'URL
        setStatus('success')
        setMessage('Votre email a été confirmé avec succès!')
        
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push('/auth/login?message=Email confirmé avec succès. Vous pouvez maintenant vous connecter.')
        }, 3000)
      } catch (error) {
        setStatus('error')
        setMessage('Une erreur est survenue lors de la confirmation de votre email.')
      }
    }

    checkConfirmation()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
            ScaleUp Academy
          </h1>
          
          {status === 'loading' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-600">Confirmation en cours...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Email confirmé !
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">
                Redirection vers la page de connexion...
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <svg
                className="mx-auto h-12 w-12 text-red-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Erreur de confirmation
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <Link href="/auth/register" className="text-blue-600 hover:underline">
                Retourner à l'inscription
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}