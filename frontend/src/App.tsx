import { useUser } from '~/contexts/UserContext'
import { Button } from '~/components/ui/button'
import RelationshipManager from '~/components/RelationshipManager'
import './App.css'

function App() {
  const { user, logout } = useUser()

  return (
    <>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Vibe Check</h1>
        {user && (
          <div className="flex items-center gap-4">
            <span>Welcome, {user.name}!</span>
            <Button onClick={logout} variant="outline">Logout</Button>
          </div>
        )}
      </div>
      <div className="container mx-auto p-4">
        {!user ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Vibe Check</h1>
            <p className="text-lg mb-8">Check in with your partner daily to share how you're feeling.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">How it works</h2>
                <ul className="text-left list-disc pl-5 space-y-2">
                  <li>Sign up and create a relationship</li>
                  <li>Share the invite code with your partner</li>
                  <li>Check in daily with a mood and optional note</li>
                  <li>View your combined vibes on the dashboard</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Your Daily Vibe</h2>
                <p className="mb-4">Select how you're feeling today:</p>
                <div className="flex justify-center space-x-4 text-4xl">
                  <span>😩</span>
                  <span>😟</span>
                  <span>😐</span>
                  <span>🙂</span>
                  <span>😊</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-screen items-center justify-center">
            <RelationshipManager />
          </div>
        )}
      </div>
    </>
  )
}

export default App
