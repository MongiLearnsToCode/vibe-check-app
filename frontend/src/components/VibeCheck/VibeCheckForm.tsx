import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Slider } from "~/components/ui/slider";
import api, { checkVibeSubmission } from "~/lib/api";
import { getPendingVibes, savePendingVibe, clearPendingVibes, type PendingVibe } from "~/lib/offline";
import { useUser } from "~/contexts/UserContext";

export default function VibeCheckForm() {
  const { relationship } = useUser();
  const [mood, setMood] = useState(3);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [offlineMessage, setOfflineMessage] = useState('');
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIfAlreadySubmitted = async () => {
      if (!relationship) {
        setLoading(false);
        return;
      }

      try {
        const response = await checkVibeSubmission();
        setAlreadySubmitted(response.data.submitted);
      } catch (error: any) {
        console.error("Failed to check if vibe already submitted", error);
      } finally {
        setLoading(false);
      }
    };

    const syncPendingVibes = async () => {
      if (!relationship) return;
      
      const pendingVibes = getPendingVibes();
      if (pendingVibes.length > 0) {
        // Filter vibes for current relationship
        const relationshipVibes = pendingVibes.filter(vibe => vibe.relationship_id === relationship.id);
        
        // Sync each vibe
        const syncedVibes: PendingVibe[] = [];
        for (const vibe of relationshipVibes) {
          try {
            await api.post('/vibes', {
              mood: vibe.mood,
              note: vibe.note
            });
            syncedVibes.push(vibe);
          } catch (error: any) {
            console.error('Failed to sync vibe', error);
            // If it's a conflict (409), we still want to remove it from pending
            if (error.response && error.response.status === 409) {
              syncedVibes.push(vibe);
            }
            // For other errors, we'll keep it in pendingVibes
          }
        }
        
        // Remove synced vibes from localStorage
        if (syncedVibes.length > 0) {
          const remainingVibes = pendingVibes.filter(vibe => 
            !syncedVibes.some(synced => synced.timestamp === vibe.timestamp)
          );
          if (remainingVibes.length === 0) {
            clearPendingVibes();
          } else {
            localStorage.setItem('pendingVibes', JSON.stringify(remainingVibes));
          }
          console.log(`${syncedVibes.length} pending vibes synced successfully`);
        }
      }
    };

    checkIfAlreadySubmitted();
    syncPendingVibes();
    
    // Set up event listener for when coming back online
    const handleOnline = () => syncPendingVibes();
    window.addEventListener('online', handleOnline);
    
    return () => window.removeEventListener('online', handleOnline);
  }, [relationship]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!relationship) {
      console.error("No relationship found");
      return;
    }
    
    const vibe = { mood, note };
    const vibeWithRelationship = { ...vibe, relationship_id: relationship.id };

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
          savePendingVibe(vibeWithRelationship);
          setOfflineMessage('Vibe saved offline. Will sync when online.');
          setSubmitted(true);
        }
      }
    } else {
      savePendingVibe(vibeWithRelationship);
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

  if (!relationship) {
    return (
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">No Relationship Found</CardTitle>
          <CardDescription>
            You need to be in a relationship to submit a vibe.
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
