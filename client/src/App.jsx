import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router';
import { AuthProvider } from './context/AuthProvider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1 fade-in" style={{ marginBottom: '2rem' }}>
            <AppRouter />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}