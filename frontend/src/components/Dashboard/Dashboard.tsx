import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const todayVibes = {
  userA: { mood: 4, note: "Feeling pretty good today!" },
  userB: { mood: 5, note: "Amazing day!" },
};

const last7DaysVibes = [
  { date: '2025-08-17', userA: 4, userB: 3 },
  { date: '2025-08-18', userA: 3, userB: 4 },
  { date: '2025-08-19', userA: 5, userB: 5 },
  { date: '2025-08-20', userA: 2, userB: 3 },
  { date: '2025-08-21', userA: 4, userB: 4 },
  { date: '2025-08-22', userA: 5, userB: 4 },
  { date: '2025-08-23', userA: 4, userB: 5 },
];

const emojis = ['😩', '😟', '😐', '🙂', '😊'];

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg mb-8">You’re both feeling balanced this week.</p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Today's Vibe</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-around">
          <div className="text-center">
            <p className="text-6xl">{emojis[todayVibes.userA.mood - 1]}</p>
            <p className="font-bold">You</p>
            <p className="text-sm text-gray-500">{todayVibes.userA.note}</p>
          </div>
          <div className="text-center">
            <p className="text-6xl">{emojis[todayVibes.userB.mood - 1]}</p>
            <p className="font-bold">Your Partner</p>
            <p className="text-sm text-gray-500">{todayVibes.userB.note}</p>
          </div>
        </CardContent>
      </Card>

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
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="userA" name="You" stroke="#8884d8" />
              <Line type="monotone" dataKey="userB" name="Your Partner" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
