import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '~/lib/api';
import { useUser } from '~/contexts/UserContext';
import RelationshipManager from '~/components/RelationshipManager';

const emojis = ['😩', '😟', '😐', '🙂', '😊'];

export default function Dashboard() {
  const { user, relationship } = useUser();
  const [todayVibes, setTodayVibes] = useState<any>(null);
  const [last7DaysVibes, setLast7DaysVibes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVibes = async () => {
      if (!relationship) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/vibes/${relationship.id}`);
        const vibesData = response.data;

        // Process today's vibes
        const today = new Date().toISOString().split('T')[0];
        const todayVibeData = vibesData.find((vibe: any) => vibe.date === today);
        
        if (todayVibeData && user) {
          const userVibe = todayVibeData[user.id];
          const partner = relationship.users.find((u: any) => u.id !== user.id);
          const partnerVibe = partner ? todayVibeData[partner.id] : null;
          
          setTodayVibes({
            user: userVibe,
            partner: partnerVibe
          });
        }

        // Process last 7 days vibes for chart
        const chartData = vibesData.map((vibe: any) => {
          const userVibe = user && vibe[user.id] ? vibe[user.id].mood : null;
          const partner = relationship.users.find((u: any) => u.id !== user?.id);
          const partnerVibe = partner && vibe[partner.id] ? vibe[partner.id].mood : null;
          
          return {
            date: vibe.date,
            user: userVibe,
            partner: partnerVibe
          };
        });

        setLast7DaysVibes(chartData);
      } catch (error) {
        console.error('Failed to fetch vibes', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVibes();
  }, [user, relationship]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading dashboard...</div>;
  }

  if (!relationship) {
    return <RelationshipManager />;
  }

  const partner = relationship.users.find((u: any) => u.id !== user?.id);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg mb-8">You're both feeling balanced this week.</p>

      {todayVibes && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Today's Vibe</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-around">
            <div className="text-center">
              <p className="text-6xl">{todayVibes.user ? emojis[todayVibes.user.mood - 1] : '😐'}</p>
              <p className="font-bold">You</p>
              <p className="text-sm text-gray-500">{todayVibes.user?.note || 'No note'}</p>
            </div>
            <div className="text-center">
              <p className="text-6xl">{todayVibes.partner ? emojis[todayVibes.partner.mood - 1] : '😐'}</p>
              <p className="font-bold">{partner?.name || 'Partner'}</p>
              <p className="text-sm text-gray-500">{todayVibes.partner?.note || 'No note'}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>7-Day Mood History</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={last7DaysVibes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tickFormatter={(value) => emojis[value - 1]} />
              <Tooltip 
                formatter={(value) => [emojis[(value as number) - 1], 'Mood']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line type="monotone" dataKey="user" name="You" stroke="#8884d8" />
              <Line type="monotone" dataKey="partner" name={partner?.name || 'Partner'} stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
