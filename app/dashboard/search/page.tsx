// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

import {
  IconFileText,
  IconSearch,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import { BackButton } from '@/components/shared/back-button';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SearchPage() {
  return (
    <>
      <BackButton className="mb-6" />
      <div className="space-y-8">
        <div className="px-4 lg:px-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Search</h1>
            <p className="text-muted-foreground">
              Global search across all platform data, users, and content.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconSearch className="h-5 w-5" />
                Global Search
              </CardTitle>
              <CardDescription>
                Search across all platform content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4M</div>
              <p className="text-sm text-muted-foreground">Searchable items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconFileText className="h-5 w-5" />
                Document Search
              </CardTitle>
              <CardDescription>Search documents and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,231</div>
              <p className="text-sm text-muted-foreground">Documents indexed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUsers className="h-5 w-5" />
                User Search
              </CardTitle>
              <CardDescription>
                Find users and customer profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,847</div>
              <p className="text-sm text-muted-foreground">User profiles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconSettings className="h-5 w-5" />
                Advanced Filters
              </CardTitle>
              <CardDescription>
                Advanced search filters and options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-sm text-muted-foreground">Filter options</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
