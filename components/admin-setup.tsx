'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import { useClerk } from '@clerk/nextjs';

export function AdminSetup() {
  const { user: clerkUser } = useUser();
  const { user: clerk } = useClerk();
  const createAdminUser = useMutation(api.users.createAdminUser);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSetupAdmin = async () => {
    if (!clerkUser || !clerk) {
      alert('No user logged in');
      return;
    }

    setLoading(true);
    try {
      // Create admin user in Convex database
      const result = await createAdminUser({
        name: clerkUser.firstName + ' ' + (clerkUser.lastName || ''),
        externalId: clerkUser.id,
        role: 'admin',
      });
      setResult(result);
      alert('Admin setup complete! You are now an admin.');
    } catch (error) {
      console.error('Error setting up admin:', error);
      alert('Error setting up admin: ' + error);
    } finally {
      setLoading(false);
    }
  };

  if (!clerkUser) {
    return <div>Please log in first</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Admin Setup</h2>
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Email: {clerkUser.primaryEmailAddress?.emailAddress}
        </p>
        <p className="text-sm text-gray-600">User ID: {clerkUser.id}</p>
      </div>

      {!result ? (
        <button
          onClick={handleSetupAdmin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Setting up...' : 'Make Me Admin'}
        </button>
      ) : (
        <div className="text-green-600">
          <p>✅ Admin setup complete!</p>
          <p>User ID: {result._id}</p>
          <p>Role: {result.role}</p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>This component should be removed after setup.</p>
      </div>
    </div>
  );
}
