import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Slider } from "~/components/ui/slider";
import api from "~/lib/api";
import { getPendingVibes, savePendingVibe, clearPendingVibes } from "~/lib/offline";

export default function VibeCheckForm() {
  const [mood, setMood] = useState(3);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [offlineMessage, setOfflineMessage] = useState('');

  useEffect(() => {
    const syncPendingVibes = async () => {
      const pendingVibes = getPendingVibes();
      if (pendingVibes.length > 0) {
        try {
          await Promise.all(pendingVibes.map(vibe => api.post('/vibes', vibe)));
          clearPendingVibes();
        } catch (error) {
          console.error('Failed to sync pending vibes', error);
        }
      }
    };

    syncPendingVibes();
    window.addEventListener('online', syncPendingVibes);
    return () => window.removeEventListener('online', syncPendingVibes);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Get relationshipId from somewhere
    const relationshipId = 1;
    const vibe = { mood, note, relationship_id: relationshipId };

    if (navigator.onLine) {
      try {
        await api.post('/vibes', vibe);
        setSubmitted(true);
      } catch (error) {
        console.error(error);
        savePendingVibe(vibe);
        setOfflineMessage('Vibe saved offline. Will sync when online.');
        setSubmitted(true);
      }
    } else {
      savePendingVibe(vibe);
      setOfflineMessage('Vibe saved offline. Will sync when online.');
      setSubmitted(true);
    }
  };

  const emojis = ['😩', '😟', '😐', '🙂', '😊'];

  if (submitted) {
    return (
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{offlineMessage ? 'Saved Offline' : 'Vibe Submitted!'}</CardTitle>
          <CardDescription>
            {offlineMessage || 'Thanks for checking in. See you tomorrow!'}
          </CardDescription>
        </CardHeader>
      </CardContent>
    </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">How are you feeling?</CardTitle>
        <CardDescription>
          Check in with your partner by sharing your vibe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="mood">Your Vibe: {emojis[mood - 1]}</Label>
            <Slider
              id="mood"
              min={1}
              max={5}
              step={1}
              value={[mood]}
              onValueChange={(value) => setMood(value[0])}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              placeholder="Anything to share?"
              maxLength={140}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Submit Vibe
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
