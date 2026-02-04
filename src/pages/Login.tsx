import { Navbar } from '@/components/layout/Navbar';
import { LoginForm } from '@/components/auth/AuthForms';

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <LoginForm />
      </main>
    </div>
  );
}
