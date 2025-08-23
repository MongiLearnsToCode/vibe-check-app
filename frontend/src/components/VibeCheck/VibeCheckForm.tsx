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
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIfAlreadySubmitted = async () => {
      // TODO: Get relationshipId from somewhere
      const relationshipId = 1;
      
      try {
        // Check if user has already submitted a vibe today
        // For now, we'll just simulate this check
        // In a real implementation, we would call an API endpoint to check this
        // Example API call:
        // const response = await api.get(`/vibes/${relationshipId}/check`);
        // setAlreadySubmitted(response.data.alreadySubmitted);
        
        // Simulating the check for now
        setAlreadySubmitted(false);
      } catch (error) {
        console.error("Failed to check if vibe already submitted", error);
      } finally {
        setLoading(false);
      }
    };

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

    checkIfAlreadySubmitted();
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
        setAlreadySubmitted(true);
      } catch (error: any) {
        if (error.response && error.response.status === 409) {
          // Conflict - already submitted today
          setAlreadySubmitted(true);
        } else {
          console.error(error);
          savePendingVibe(vibe);
          setOfflineMessage('Vibe saved offline. Will sync when online.');
          setSubmitted(true);
        }
      }
    } else {
      savePendingVibe(vibe);
      setOfflineMessage('Vibe saved offline. Will sync when online.');
      setSubmitted(true);
    }
  };

  const emojis = ['😩', '😟', '😐', '🙂', '😊'];

  if (loading) {
    return (
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Loading...</CardTitle>
          <CardDescription>
            Checking your vibe status for today.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (alreadySubmitted) {
    return (
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Vibe Already Submitted</CardTitle>
          <CardDescription>
            You've already checked in today. Come back tomorrow!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{offlineMessage ? 'Saved Offline' : 'Vibe Submitted!'}</CardTitle>
          <CardDescription>
            {offlineMessage || 'Thanks for checking in. See you tomorrow!'}
          </CardDescription>
        </CardHeader>
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
