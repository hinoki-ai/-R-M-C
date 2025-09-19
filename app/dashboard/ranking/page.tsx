'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { IconTrophy, IconTrendingUp, IconUsers, IconAlertCircle } from '@tabler/icons-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useMemo, memo } from 'react'

// Loading skeleton component
function RankingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🏆</div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Ranking de Miembros
        </h1>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                </div>
                <div className="flex gap-8">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Error component
function RankingsError({ error }: { error: string }) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Error al Cargar Rankings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          No se pudieron cargar los rankings de miembros
        </p>
      </div>

      <Alert>
        <IconAlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    </div>
  )
}

// Stats card component
function StatsCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: any }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

// Main component
const RankingPage = memo(function RankingPage() {
  const rankingsQuery = useQuery(api.community.getMemberRankings)

  // Memoized calculations
  const stats = useMemo(() => {
    if (!rankingsQuery) return null

    const rankCounts = rankingsQuery.reduce((acc, member) => {
      acc[member.rank] = (acc[member.rank] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const totalDonations = rankingsQuery.reduce((sum, member) => sum + member.totalDonations, 0)

    return {
      totalMembers: rankingsQuery.length,
      totalDonations,
      apellinadoCount: rankCounts['Apellinado'] || 0,
      rankCounts
    }
  }, [rankingsQuery])

  // Handle loading state
  if (rankingsQuery === undefined) {
    return <RankingsSkeleton />
  }

  // Handle error state
  if (rankingsQuery === null || rankingsQuery instanceof Error) {
    return <RankingsError error="No se pudieron cargar los datos. Verifica tu conexión." />
  }

  // Handle empty state
  if (rankingsQuery.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🏆</div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Ranking de Miembros
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            No hay datos de ranking disponibles
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🏆</div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Ranking de Miembros
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Reconoce a los miembros más comprometidos de la comunidad
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Miembros"
          value={stats?.totalMembers || 0}
          icon={IconUsers}
        />
        <StatsCard
          title="Donaciones Totales"
          value={`$${(stats?.totalDonations || 0).toLocaleString()}`}
          icon={IconTrendingUp}
        />
        <StatsCard
          title="Apellidados"
          value={stats?.apellinadoCount || 0}
          icon={IconTrophy}
        />
      </div>

      {/* Rankings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTrophy className="h-5 w-5" />
            Ranking por Categorías
          </CardTitle>
          <CardDescription>
            Miembros ordenados por rango, donaciones y meses consecutivos de suscripción
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table aria-label="Tabla de rankings de miembros de la comunidad">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16" scope="col">Posición</TableHead>
                  <TableHead scope="col">Miembro</TableHead>
                  <TableHead className="w-32" scope="col">Rango</TableHead>
                  <TableHead className="text-right w-32" scope="col">Donaciones Totales</TableHead>
                  <TableHead className="text-right w-32" scope="col">Meses Consecutivos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankingsQuery.map((member, index) => (
                  <TableRow key={member.userId}>
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell className="font-medium">{member.userName}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          member.rank === 'Apellinado' ? 'default' :
                          member.rank === 'Roble' ? 'secondary' :
                          member.rank === 'Hualle' ? 'outline' : 'outline'
                        }
                        className="font-medium"
                      >
                        {member.rank}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${member.totalDonations.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {member.consecutiveMonths}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Rank Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-300 flex items-center gap-2">
              🌱 Semilla
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Miembros nuevos en la comunidad. Menos de $15,000 en donaciones y menos de 6 meses consecutivos de suscripción.
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="text-orange-700 dark:text-orange-300 flex items-center gap-2">
              🌿 Hualle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Miembros en crecimiento. $15,000+ en donaciones o 6+ meses consecutivos de suscripción.
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
              🌳 Roble
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Miembros establecidos. $50,000+ en donaciones o 12+ meses consecutivos de suscripción.
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-purple-700 dark:text-purple-300 flex items-center gap-2">
              🌲 Apellinado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Líderes de la comunidad. $150,000+ en donaciones o 24+ meses consecutivos de suscripción.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
})

RankingPage.displayName = 'RankingPage'

export default RankingPage