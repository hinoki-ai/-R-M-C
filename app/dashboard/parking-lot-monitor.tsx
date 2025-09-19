"use client";

import { IconCar, IconMapPin, IconAlertTriangle } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock parking data
const parkingLevels = [
  {
    id: "level-1",
    name: "Level 1",
    totalSpaces: 50,
    occupiedSpaces: 32,
    infractions: 2,
    spaces: Array.from({ length: 50 }, (_, i) => ({
      id: `L1-${String(i + 1).padStart(2, '0')}`,
      occupied: Math.random() > 0.3,
      infraction: Math.random() > 0.95,
    })),
  },
  {
    id: "level-2",
    name: "Level 2",
    totalSpaces: 50,
    occupiedSpaces: 28,
    infractions: 1,
    spaces: Array.from({ length: 50 }, (_, i) => ({
      id: `L2-${String(i + 1).padStart(2, '0')}`,
      occupied: Math.random() > 0.4,
      infraction: Math.random() > 0.96,
    })),
  },
  {
    id: "level-3",
    name: "Level 3",
    totalSpaces: 50,
    occupiedSpaces: 15,
    infractions: 0,
    spaces: Array.from({ length: 50 }, (_, i) => ({
      id: `L3-${String(i + 1).padStart(2, '0')}`,
      occupied: Math.random() > 0.7,
      infraction: Math.random() > 0.98,
    })),
  },
];

export function ParkingLotMonitor() {
  const totalSpaces = parkingLevels.reduce((sum, level) => sum + level.totalSpaces, 0);
  const totalOccupied = parkingLevels.reduce((sum, level) => sum + level.occupiedSpaces, 0);
  const totalInfractions = parkingLevels.reduce((sum, level) => sum + level.infractions, 0);
  const occupancyRate = Math.round((totalOccupied / totalSpaces) * 100);

  return (
    <div className="space-y-6">
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconMapPin className="h-5 w-5" />
              Parking Lot Monitor
            </CardTitle>
            <CardDescription>
              Real-time parking space status and occupancy tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3">
                <IconCar className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{totalOccupied}/{totalSpaces}</p>
                  <p className="text-sm text-muted-foreground">Occupied Spaces</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{occupancyRate}%</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">{occupancyRate}%</p>
                  <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <IconAlertTriangle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{totalInfractions}</p>
                  <p className="text-sm text-muted-foreground">Active Infractions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-4 lg:px-6 grid gap-6 md:grid-cols-3">
        {parkingLevels.map((level) => (
          <Card key={level.id}>
            <CardHeader>
              <CardTitle className="text-lg">{level.name}</CardTitle>
              <CardDescription>
                {level.occupiedSpaces}/{level.totalSpaces} spaces occupied
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Visual representation of parking spaces */}
                <div className="grid grid-cols-10 gap-1">
                  {level.spaces.map((space) => (
                    <div
                      key={space.id}
                      className={`aspect-square rounded border-2 flex items-center justify-center text-xs font-medium ${
                        space.infraction
                          ? 'bg-red-500 border-red-600 text-white'
                          : space.occupied
                          ? 'bg-blue-500 border-blue-600 text-white'
                          : 'bg-green-100 border-green-300 text-green-700'
                      }`}
                      title={`Space ${space.id}: ${space.infraction ? 'Infraction' : space.occupied ? 'Occupied' : 'Available'}`}
                    >
                      {space.infraction && <IconAlertTriangle className="h-3 w-3" />}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {level.totalSpaces - level.occupiedSpaces} Available
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {level.occupiedSpaces} Occupied
                    </Badge>
                  </div>
                  {level.infractions > 0 && (
                    <Badge variant="destructive">
                      {level.infractions} Infractions
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}