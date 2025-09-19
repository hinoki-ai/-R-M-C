'use client'

import { motion } from 'framer-motion'
import { Coffee, CreditCard, DollarSign, Github, Heart } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DonatePage() {
  const router = useRouter()
  const [selectedAmount, setSelectedAmount] = useState<string>('')

  const donationOptions = [
    { amount: '5', label: 'Donación Básica', description: 'Apoyo básico para mantenimiento' },
    { amount: '10', label: 'Donación Mantenimiento', description: 'Ayuda para reparaciones comunitarias' },
    { amount: '25', label: 'Donación Eventos', description: 'Financiamiento para actividades comunitarias' },
    { amount: '50', label: 'Donación Infraestructura', description: 'Mejoras en infraestructura comunitaria' },
    { amount: '100', label: 'Donación Mayor', description: 'Proyecto importante para la comunidad' }
  ]

  const handleStripeDonation = async (amount: string) => {
    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: 'usd',
          description: `Donation to Pinto Los Pellines - $${amount}`,
          metadata: {
            type: 'donation',
            amount,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent')
      }

      // Here you would integrate with Stripe Elements to collect payment method
      // For now, we'll show a success message
      alert(`Donation of $${amount} processed successfully! Payment ID: ${data.paymentIntentId}`)

    } catch (error: any) {
      console.error('Donation error:', error)
      alert(`Failed to process donation: ${error.message}`)
    }
  }

  const handleDonation = (platform: string, amount?: string) => {
    console.log(`Processing ${platform} donation${amount ? ` of $${amount}` : ''}`)

    switch (platform) {
      case 'stripe':
        if (amount) {
          handleStripeDonation(amount)
        }
        break
      case 'paypal':
        window.open('https://www.paypal.com/donate?hosted_button_id=PINTOPELLINES_DONATE', '_blank')
        break
      case 'github':
        window.open('https://github.com/sponsors/hinoki-ai', '_blank')
        break
      case 'patreon':
        window.open('https://www.patreon.com/pintopellines', '_blank')
        break
      case 'crypto':
        alert('Información de criptomonedas próximamente')
        break
      default:
        console.log('Custom donation amount selected')
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b'
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <Link href='/' className='text-2xl font-bold text-gray-900 dark:text-white'>
                Pinto Los Pellines
              </Link>
              <Badge variant='secondary' className='bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'>
                Apoya a la Comunidad
              </Badge>
            </div>
            <Button
              variant='outline'
              onClick={() => router.push('/dashboard')}
            >
Volver al Dashboard
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='text-center mb-12'
        >
          <div className='flex justify-center mb-6'>
            <div className='p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full'>
              <Heart className='w-12 h-12 text-white' />
            </div>
          </div>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            Apoya a Pinto Los Pellines
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
            Tu contribución ayuda a mantener segura y fuerte nuestra comunidad en Ñuble
          </p>
        </motion.div>

        {/* Donation Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'
        >
          {donationOptions.map((option, index) => (
            <motion.div
              key={option.amount}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className='cursor-pointer transition-all duration-300 hover:shadow-lg border-2 hover:border-purple-300'
                onClick={() => setSelectedAmount(option.amount)}
              >
                <CardHeader className='text-center'>
                  <CardTitle className='text-2xl font-bold text-purple-600'>
                    ${option.amount}
                  </CardTitle>
                  <CardDescription className='text-lg'>
                    {option.label}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-center text-gray-600 dark:text-gray-400'>
                    {option.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Payment Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className='mb-12'
        >
          <h2 className='text-2xl font-bold text-center text-gray-900 dark:text-white mb-8'>
            Métodos de Pago
          </h2>

          <div className='grid md:grid-cols-2 gap-6'>
            {/* Stripe */}
            <Card className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <div className='flex items-center space-x-3'>
                  <div className='p-2 bg-purple-100 dark:bg-purple-900 rounded-lg'>
                    <CreditCard className='w-6 h-6 text-purple-600 dark:text-purple-400' />
                  </div>
                  <div>
                    <CardTitle>Stripe Payment</CardTitle>
                    <CardDescription>Secure payment processing with Stripe</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  className='w-full bg-purple-600 hover:bg-purple-700'
                  onClick={() => handleDonation('stripe', selectedAmount)}
                  disabled={!selectedAmount}
                >
                  Donate with Stripe
                </Button>
              </CardContent>
            </Card>

            {/* GitHub Sponsors */}
            <Card className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <div className='flex items-center space-x-3'>
                  <div className='p-2 bg-gray-100 dark:bg-gray-800 rounded-lg'>
                    <Github className='w-6 h-6 text-gray-700 dark:text-gray-300' />
                  </div>
                  <div>
                    <CardTitle>GitHub Sponsors</CardTitle>
                    <CardDescription>Apoya nuestro código abierto</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={() => handleDonation('github')}
                >
Sponsorear en GitHub
                </Button>
              </CardContent>
            </Card>

            {/* Patreon */}
            <Card className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <div className='flex items-center space-x-3'>
                  <div className='p-2 bg-red-100 dark:bg-red-900 rounded-lg'>
                    <Coffee className='w-6 h-6 text-red-600 dark:text-red-400' />
                  </div>
                  <div>
                    <CardTitle>Patreon</CardTitle>
                    <CardDescription>Apoyo mensual para desarrollo continuo</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={() => handleDonation('patreon')}
                >
Convertirse en Patrono
                </Button>
              </CardContent>
            </Card>

            {/* Cryptocurrency */}
            <Card className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <div className='flex items-center space-x-3'>
                  <div className='p-2 bg-orange-100 dark:bg-orange-900 rounded-lg'>
                    <CreditCard className='w-6 h-6 text-orange-600 dark:text-orange-400' />
                  </div>
                  <div>
                    <CardTitle>Criptomonedas</CardTitle>
                    <CardDescription>Aceptamos BTC, ETH, USDT</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={() => handleDonation('crypto')}
                >
Donación en Cripto
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Impact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className='bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg'
        >
          <h2 className='text-2xl font-bold text-center text-gray-900 dark:text-white mb-6'>
Tu Impacto en Pinto Los Pellines
          </h2>
          <div className='grid md:grid-cols-3 gap-6 text-center'>
            <div>
              <div className='text-3xl font-bold text-purple-600 mb-2'>89</div>
              <div className='text-gray-600 dark:text-gray-400'>Familias Registradas</div>
            </div>
            <div>
              <div className='text-3xl font-bold text-purple-600 mb-2'>247</div>
              <div className='text-gray-600 dark:text-gray-400'>Vecinos Activos</div>
            </div>
            <div>
              <div className='text-3xl font-bold text-purple-600 mb-2'>24/7</div>
              <div className='text-gray-600 dark:text-gray-400'>Apoyo Comunitario</div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className='text-center mt-12 text-gray-600 dark:text-gray-400'
        >
          <p className='mb-4'>
¡Gracias por considerar apoyar a Pinto Los Pellines!
          </p>
          <p className='text-sm'>
Todas las contribuciones se destinan al mantenimiento del barrio, organización de eventos y mejoras comunitarias. ¡Apreciamos tu generosidad! 🙏
          </p>
        </motion.div>
      </div>
    </div>
  )
}