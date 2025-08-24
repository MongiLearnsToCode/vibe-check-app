import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { createRelationship, joinRelationship } from "~/lib/api";
import { useUser } from "~/contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function RelationshipManager() {
  const { relationship, setRelationship } = useUser();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreateRelationship = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await createRelationship();
      setRelationship(response.data);
      setSuccess("Relationship created successfully! Share the code with your partner.");
    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to create relationship. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRelationship = async () => {
    if (!code) {
      setError("Please enter a code");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await joinRelationship(code);
      setRelationship(response.data);
      setSuccess("Successfully joined the relationship!");
      // Redirect to dashboard after joining
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to join relationship. Please check the code and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (relationship) {
    return (
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">In a Relationship</CardTitle>
          <CardDescription>
            You're already in a relationship with another user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Relationship Setup</CardTitle>
        <CardDescription>
          Create a new relationship or join an existing one
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Button 
              onClick={handleCreateRelationship} 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Creating..." : "Create New Relationship"}
            </Button>
            <p className="text-sm text-gray-500 text-center">
              Create a new relationship and get a code to share with your partner
            </p>
          </div>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="code">Join with Code</Label>
            <Input
              id="code"
              placeholder="Enter relationship code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button 
              onClick={handleJoinRelationship} 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Joining..." : "Join Relationship"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}