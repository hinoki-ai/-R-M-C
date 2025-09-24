'use client';

import { BackButton } from '@/components/shared/back-button';
import { DASHBOARD_SPACING } from '@/lib/dashboard-spacing';

export default function CommunityPage() {
  return (
    <div className={DASHBOARD_SPACING.page.container}>
      <BackButton className="mb-6" />
      <div className={`${DASHBOARD_SPACING.page.header} text-center py-8`}>
        <div className="text-4xl mb-4">🤝🇨🇱</div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Comunidad Pinto Los Pellines
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Conoce a tus vecinos y participa en la vida comunitaria
        </p>
      </div>
      <div className={DASHBOARD_SPACING.element.loose}>
        <div
          className={`${DASHBOARD_SPACING.card.padding} border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20`}
        >
          <h4 className="font-semibold mb-2">🎗️ Presidenta Junta de Vecinos</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Doña Rosa del Carmen Pérez Muñoz
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Directiva 2024-2026 • Tel: +56 9 8889 6773
          </p>
        </div>
        <div
          className={`${DASHBOARD_SPACING.card.padding} border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20`}
        >
          <h4 className="font-semibold mb-2">📋 Secretaría</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sr. Juan Carlos Rodríguez Soto
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Encargado de actas y comunicaciones
          </p>
        </div>
        <div
          className={`${DASHBOARD_SPACING.card.padding} border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20`}
        >
          <h4 className="font-semibold mb-2">💰 Tesorero</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sra. María Elena González Vidal
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Administración fondos comunitarios
          </p>
        </div>
        <div
          className={`${DASHBOARD_SPACING.card.padding} border rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20`}
        >
          <h4 className="font-semibold mb-2">🏛️ Próxima Asamblea General</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sábado 14 de diciembre 2025
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Salón Comunitario - 19:00 hrs • Orden del día: Presupuesto 2026
          </p>
        </div>
      </div>
    </div>
  );
}
