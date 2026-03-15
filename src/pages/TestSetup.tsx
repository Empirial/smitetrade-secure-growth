import { useState } from 'react';
import { seedTestUsers, SeedResult } from '@/lib/seedTestUsers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TestSetup = () => {
  const [results, setResults] = useState<SeedResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    const res = await seedTestUsers();
    setResults(res);
    setDone(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Test User Setup</CardTitle>
          <p className="text-sm text-muted-foreground">
            Creates one test account for every role. All accounts use password: <strong>Test1234!</strong>
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!done ? (
            <Button onClick={handleSeed} disabled={loading} className="w-full">
              {loading ? 'Creating test accounts...' : 'Create All Test Users'}
            </Button>
          ) : (
            <div className="space-y-2">
              {results.map((r) => (
                <div
                  key={r.role}
                  className={`flex items-center justify-between rounded-md border px-4 py-2 text-sm ${
                    r.success ? 'border-green-500/40 bg-green-500/10' : 'border-red-500/40 bg-red-500/10'
                  }`}
                >
                  <div>
                    <span className="font-semibold capitalize">{r.role}</span>
                    <span className="ml-2 text-muted-foreground">{r.email}</span>
                  </div>
                  <span>{r.success ? '✓ Created' : `✗ ${r.error?.includes('already-in-use') ? 'Already exists' : r.error}`}</span>
                </div>
              ))}
              <div className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700">
                All accounts use password: <strong>Test1234!</strong><br />
                Delete <code>/test-setup</code> route before going live.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestSetup;
