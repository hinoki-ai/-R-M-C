'use client'

import { motion } from 'framer-motion'

import { useDashboardNavigation } from '@/lib/dashboard-navigation'
import { DashboardLayoutProps } from '@/types/dashboard'

interface DashboardLayoutPropsExtended extends DashboardLayoutProps {
  children: React.ReactNode
  showBreadcrumbs?: boolean
  showQuickActions?: boolean
  quickActions?: React.ReactNode
}

export function DashboardLayout({
  children,
  user,
  showBreadcrumbs = true,
  showQuickActions = false,
  quickActions
}: DashboardLayoutPropsExtended) {
  const { getBreadcrumbs } = useDashboardNavigation()

  const breadcrumbs = getBreadcrumbs()

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-blue-950 dark:to-green-950'>
      {/* Chilean Cultural Background Pattern */}
      <div className='absolute inset-0 opacity-5 pointer-events-none overflow-hidden'>
        <div className='absolute top-20 left-10 text-6xl animate-pulse'>🏔️</div>
        <div className='absolute top-32 left-16 text-4xl animate-pulse delay-1000'>🚜</div>
        <div className='absolute top-60 right-16 text-5xl animate-pulse delay-2000'>🇨🇱</div>
        <div className='absolute top-80 left-8 text-3xl animate-pulse delay-3000'>🌻</div>
        <div className='absolute bottom-32 left-20 text-4xl animate-pulse delay-500'>🏞️</div>
        <div className='absolute bottom-40 right-12 text-3xl animate-pulse delay-1500'>🌽</div>
        <div className='absolute bottom-60 left-32 text-3xl animate-pulse delay-2500'>🐑</div>
        <div className='absolute bottom-20 right-24 text-4xl animate-pulse delay-3500'>🏘️</div>
        <div className='absolute top-40 right-8 text-3xl animate-pulse delay-4500'>🌾</div>
        <div className='absolute bottom-80 right-40 text-2xl animate-pulse delay-5500'>🇨🇱</div>
      </div>

      <div className='relative z-10'>
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700'
        >
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center justify-between h-16'>
              <div className='flex items-center space-x-4'>
                {/* Logo/Brand */}
                <div className='flex items-center space-x-2'>
                  <div className='p-2 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg'>
                    <span className='text-white font-bold text-lg'>JV</span>
                  </div>
                  <div>
                    <h1 className='text-lg font-semibold text-gray-900 dark:text-white'>
                      Junta de Vecinos
                    </h1>
                    <p className='text-xs text-gray-600 dark:text-gray-400'>
                      Pinto Los Pellines
                    </p>
                  </div>
                </div>

                {/* Breadcrumbs */}
                {showBreadcrumbs && breadcrumbs.length > 1 && (
                  <nav className='hidden md:flex items-center space-x-2 text-sm'>
                    {breadcrumbs.map((crumb, index) => (
                      <div key={crumb.url} className='flex items-center'>
                        {index > 0 && <span className='mx-2 text-gray-400'>/</span>}
                        <span className={index === breadcrumbs.length - 1
                          ? 'text-gray-900 dark:text-white font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer'
                        }>
                          {crumb.label}
                        </span>
                      </div>
                    ))}
                  </nav>
                )}
              </div>

              {/* User Info */}
              <div className='flex items-center space-x-4'>
                <div className='text-right'>
                  <p className='text-sm font-medium text-gray-900 dark:text-white'>
                    {user.name}
                  </p>
                  <p className='text-xs text-gray-600 dark:text-gray-400'>
                    {user.isAdmin ? 'Administrador' : 'Vecino'}
                  </p>
                </div>
                <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center'>
                  <span className='text-white text-sm font-bold'>
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Quick Actions Bar */}
        {showQuickActions && quickActions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700'
          >
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
              {quickActions}
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}

// Specialized Layouts for Different Dashboard Sections
export function AdminDashboardLayout({
  children,
  user,
  currentSection,
  showQuickActions = true,
  quickActions
}: DashboardLayoutPropsExtended) {
  return (
    <DashboardLayout
      user={user}
      currentSection={currentSection}
      showQuickActions={showQuickActions}
      quickActions={quickActions}
    >
      <div className='space-y-6'>
        {/* Admin-specific header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className='bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white'
        >
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold'>Panel Administrativo</h2>
              <p className='text-purple-100 mt-1'>
                Gestión completa de la comunidad Pinto Los Pellines
              </p>
            </div>
            <div className='hidden md:block'>
              <div className='text-right'>
                <div className='text-3xl font-bold'>📊</div>
                <p className='text-sm text-purple-100'>Admin Access</p>
              </div>
            </div>
          </div>
        </motion.div>

        {children}
      </div>
    </DashboardLayout>
  )
}

export function UserDashboardLayout({
  children,
  user,
  currentSection,
  showQuickActions = true,
  quickActions
}: DashboardLayoutPropsExtended) {
  return (
    <DashboardLayout
      user={user}
      currentSection={currentSection}
      showQuickActions={showQuickActions}
      quickActions={quickActions}
    >
      <div className='space-y-6'>
        {/* User-specific header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className='bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white'
        >
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold'>Mi Comunidad</h2>
              <p className='text-green-100 mt-1'>
                Pinto Los Pellines - Tu hogar rural
              </p>
            </div>
            <div className='hidden md:block'>
              <div className='text-right'>
                <div className='text-3xl font-bold'>🏘️</div>
                <p className='text-sm text-green-100'>Vecino Activo</p>
              </div>
            </div>
          </div>
        </motion.div>

        {children}
      </div>
    </DashboardLayout>
  )
}

// Section-specific Layouts
export function CameraDashboardLayout({ children, user, currentSection }: DashboardLayoutProps) {
  return (
    <DashboardLayout user={user} currentSection={currentSection}>
      <div className='space-y-6'>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className='bg-gradient-to-r from-gray-600 to-slate-600 rounded-lg p-6 text-white'
        >
          <h2 className='text-2xl font-bold flex items-center space-x-2'>
            <span>📹</span>
            <span>Sistema de Videovigilancia</span>
          </h2>
          <p className='text-gray-100 mt-1'>
            Monitoreo y gestión de cámaras de seguridad comunitaria
          </p>
        </motion.div>
        {children}
      </div>
    </DashboardLayout>
  )
}

export function DocumentDashboardLayout({ children, user, currentSection }: DashboardLayoutProps) {
  return (
    <DashboardLayout user={user} currentSection={currentSection}>
      <div className='space-y-6'>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className='bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white'
        >
          <h2 className='text-2xl font-bold flex items-center space-x-2'>
            <span>📄</span>
            <span>Centro de Documentos</span>
          </h2>
          <p className='text-blue-100 mt-1'>
            Documentos oficiales, estatutos y registros comunitarios
          </p>
        </motion.div>
        {children}
      </div>
    </DashboardLayout>
  )
}
