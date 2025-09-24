'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Coffee, CreditCard, Github, Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { toast } from 'sonner';

import CompactFooter from '../(landing)/compact-footer';
import { AdvancedHeader } from '@/components/layout/advanced-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

const StripeCheckoutForm: React.FC<{
  amount: string;
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe not loaded');
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
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
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        throw new Error(error.message || 'Payment failed');
      }

      toast.success(`¡Gracias! Donación de $${amount} procesada exitosamente`);
      onSuccess();
    } catch (error) {
      console.error('Donation error:', error);
      toast.error(
        `Error al procesar donación: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Información de Tarjeta</label>
        <div className="p-3 border rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1"
        >
          {isProcessing ? 'Procesando...' : `Donar $${amount}`}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default function DonatePage() {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const donationOptions = [
    {
      amount: '5',
      label: 'Donación Básica',
      description: 'Apoyo básico para mantenimiento',
    },
    {
      amount: '10',
      label: 'Donación Mantenimiento',
      description: 'Ayuda para reparaciones comunitarias',
    },
    {
      amount: '25',
      label: 'Donación Eventos',
      description: 'Financiamiento para actividades comunitarias',
    },
    {
      amount: '50',
      label: 'Donación Infraestructura',
      description: 'Mejoras en infraestructura comunitaria',
    },
    {
      amount: '100',
      label: 'Donación Mayor',
      description: 'Proyecto importante para la comunidad',
    },
  ];

  const handleDonation = (platform: string, amount?: string) => {
    console.log(
      `Processing ${platform} donation${amount ? ` of $${amount}` : ''}`
    );

    switch (platform) {
      case 'stripe':
        if (amount) {
          setSelectedAmount(amount);
          setShowPaymentForm(true);
        }
        break;
      case 'paypal':
        window.open(
          'https://www.paypal.com/donate?hosted_button_id=PINTOPELLINES_DONATE',
          '_blank'
        );
        break;
      case 'github':
        window.open('https://github.com/sponsors/hinoki-ai', '_blank');
        break;
      case 'patreon':
        window.open('https://www.patreon.com/pintopellines', '_blank');
        break;
      case 'crypto':
        toast.info('Información de criptomonedas próximamente');
        break;
      default:
        console.log('Custom donation amount selected');
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    setSelectedAmount('');
    router.push('/'); // Redirect to home page
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
  };

  return (
    <>
      <AdvancedHeader />
      <div className="pt-16">
        {' '}
        {/* Add top padding to account for fixed header */}
        <div className="min-h-screen relative">
          {/* Background Image */}
          <div className="fixed inset-0 -z-10">
            <Image
              src="/images/backgrounds/bg6.jpg"
              alt="Donate Page Background"
              fill
              className="object-cover object-center"
              priority
              quality={90}
            />
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                  <Heart className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Apoya a Pinto Los Pellines
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Tu contribución ayuda a mantener segura y fuerte nuestra
                comunidad en Ñuble
              </p>
            </motion.div>

            {/* Donation Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
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
                    className="cursor-pointer transition-all duration-300 hover:shadow-lg border-2 hover:border-purple-300"
                    onClick={() => setSelectedAmount(option.amount)}
                  >
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl font-bold text-purple-600">
                        ${option.amount}
                      </CardTitle>
                      <CardDescription className="text-lg">
                        {option.label}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-center text-muted-foreground">
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
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-center text-foreground mb-8">
                Métodos de Pago
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Stripe */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <CardTitle>Pago con Tarjeta</CardTitle>
                        <CardDescription>
                          Procesamiento seguro con Stripe
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {showPaymentForm ? (
                      <Elements stripe={stripePromise}>
                        <StripeCheckoutForm
                          amount={selectedAmount}
                          onSuccess={handlePaymentSuccess}
                          onCancel={handlePaymentCancel}
                        />
                      </Elements>
                    ) : (
                      <Button
                        variant="gradientPrimary"
                        className="w-full"
                        onClick={() => handleDonation('stripe', selectedAmount)}
                        disabled={!selectedAmount}
                      >
                        Pagar con Tarjeta
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* GitHub Sponsors */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <Github className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div>
                        <CardTitle>GitHub Sponsors</CardTitle>
                        <CardDescription>
                          Apoya nuestro código abierto
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDonation('github')}
                    >
                      Sponsorear en GitHub
                    </Button>
                  </CardContent>
                </Card>

                {/* Patreon */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                        <Coffee className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <CardTitle>Patreon</CardTitle>
                        <CardDescription>
                          Apoyo mensual para desarrollo continuo
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDonation('patreon')}
                    >
                      Convertirse en Patrono
                    </Button>
                  </CardContent>
                </Card>

                {/* Cryptocurrency */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                        <CreditCard className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <CardTitle>Criptomonedas</CardTitle>
                        <CardDescription>
                          Aceptamos BTC, ETH, USDT
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full"
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
              className="bg-card rounded-lg p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-center text-card-foreground mb-6">
                Tu Impacto en Pinto Los Pellines
              </h2>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    89
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Familias Registradas
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    247
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Vecinos Activos
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    24/7
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Apoyo Comunitario
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center mt-12 text-muted-foreground"
            >
              <p className="mb-4">
                ¡Gracias por considerar apoyar a Pinto Los Pellines!
              </p>
              <p className="text-sm">
                Todas las contribuciones se destinan al mantenimiento del
                barrio, organización de eventos y mejoras comunitarias.
                ¡Apreciamos tu generosidad! 🙏
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <CompactFooter />
    </>
  );
}
