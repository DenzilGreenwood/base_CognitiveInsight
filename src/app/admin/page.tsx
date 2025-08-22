'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Submission {
  id: string;
  email: string;
  name: string;
  company: string;
  interest: string;
  status: 'pending' | 'contacted' | 'approved' | 'rejected';
  submittedAt: string;
  ip?: string;
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [authenticated, setAuthenticated] = useState(false);

  const fetchSubmissions = async () => {
    if (!apiKey) return;
    
    setLoading(true);
    try {
      const url = filter === 'all' 
        ? '/api/admin/early-access' 
        : `/api/admin/early-access?status=${filter}`;
        
      const response = await fetch(url, {
        headers: {
          'X-API-Key': apiKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions);
        setAuthenticated(true);
      } else {
        alert('Authentication failed');
        setAuthenticated(false);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      alert('Error fetching submissions');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/early-access', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        await fetchSubmissions(); // Refresh the list
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const exportCSV = async () => {
    try {
      const response = await fetch('/api/admin/early-access', {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `early-access-submissions-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to export CSV');
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting CSV');
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchSubmissions();
    }
  }, [filter, authenticated]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'contacted': return 'bg-blue-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Early Access Admin Dashboard</h1>

      {!authenticated ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button onClick={fetchSubmissions} className="w-full">
              Access Dashboard
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex gap-4 items-center">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Submissions</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={fetchSubmissions} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
            
            <Button onClick={exportCSV} variant="outline">
              Export CSV
            </Button>
          </div>

          {/* Submissions List */}
          <div className="grid gap-4">
            {submissions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No submissions found</p>
            ) : (
              submissions.map((submission) => (
                <Card key={submission.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{submission.name}</h3>
                          <Badge className={getStatusColor(submission.status)}>
                            {submission.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Email:</strong> {submission.email}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Company:</strong> {submission.company}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Interest:</strong> {submission.interest}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                        {submission.ip && (
                          <p className="text-sm text-gray-500">
                            <strong>IP:</strong> {submission.ip}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Select
                          value={submission.status}
                          onValueChange={(status) => updateStatus(submission.id, status)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
