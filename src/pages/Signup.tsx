import { Navbar } from '@/components/layout/Navbar';
import { SignupForm } from '@/components/auth/AuthForms';

export default function Signup() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <SignupForm />
      </main>
    </div>
  );
}
