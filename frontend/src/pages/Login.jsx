// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate                 = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login.php', {
        method: 'POST',
        credentials: 'include',            // para enviar/recibir cookies de sesión
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Si tu backend devuelve, por ejemplo, { success: true }
        // y establece la sesión con cookies, simplemente redirigimos:
        navigate('/dashboard', { replace: true });
      } else {
        // Muestra mensaje de error de backend o uno genérico
        setError(data.message || 'Email o contraseña incorrectos');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>

        {error && <div className="error">{error}</div>}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Validando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
