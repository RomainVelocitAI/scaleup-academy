'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { OAuthButtons } from './oauth-buttons'

const authSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  fullName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
})

type AuthFormData = z.infer<typeof authSchema>

interface AuthFormProps {
  mode: 'login' | 'register'
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  })

  const onSubmit = async (data: AuthFormData) => {
    console.log('🔍 Form submitted with data:', data)
    setError(null)
    setLoading(true)

    try {
      if (mode === 'register') {
        console.log('📝 Attempting registration...')
        // Inscription
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName,
            },
          },
        })

        console.log('📬 Signup response:', { authData, signUpError })

        if (signUpError) {
          console.error('❌ Signup error:', signUpError)
          throw signUpError
        }

        if (authData.user) {
          console.log('✅ User created successfully:', authData.user.id)
          // Le profil est créé automatiquement via le trigger PostgreSQL
          // Vérification email désactivée - rediriger directement vers le dashboard
          router.push('/dashboard')
        } else {
          console.warn('⚠️ No user in authData')
        }
      } else {
        console.log('🔐 Attempting login...')
        // Connexion
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })

        if (signInError) {
          console.error('❌ Login error:', signInError)
          throw signInError
        }

        console.log('✅ Login successful')
        router.push('/dashboard')
      }
    } catch (err: any) {
      console.error('❌ Form submission error:', err)
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div>
          <h2 className="text-2xl font-bold text-center mb-8">
            {mode === 'login' ? 'Connexion' : 'Inscription'}
          </h2>
        </div>

        {mode === 'register' && (
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-2">
              Nom complet
            </label>
            <input
              {...register('fullName')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Jean Dupont"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@exemple.com"
            autoComplete="email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Mot de passe
          </label>
          <input
            {...register('password')}
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
        </button>

        <OAuthButtons />

        <div className="text-center text-sm space-y-2">
          {mode === 'login' ? (
            <>
              <p>
                <a href="/auth/forgot-password" className="text-blue-600 hover:underline">
                  Mot de passe oublié ?
                </a>
              </p>
              <p>
                Pas encore de compte ?{' '}
                <a href="/auth/register" className="text-blue-600 hover:underline">
                  S'inscrire
                </a>
              </p>
            </>
          ) : (
            <p>
              Déjà un compte ?{' '}
              <a href="/auth/login" className="text-blue-600 hover:underline">
                Se connecter
              </a>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}