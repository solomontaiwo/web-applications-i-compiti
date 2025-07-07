import { useState } from 'react';
import { useAuth } from '../context/UseAuth';
import { useTranslation } from 'react-i18next';

export default function LoginForm() {
    const { t } = useTranslation();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
        } catch {
            setError(t('login.invalidCredentials', 'Invalid credentials'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            position: 'relative'
        }}>
            {/* Background Pattern Sottile */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.03
            }}></div>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="card border-0" style={{
                            background: 'rgba(248, 249, 250, 0.85)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(108, 117, 125, 0.1)',
                            boxShadow: '0 8px 32px 0 rgba(108, 117, 125, 0.15)',
                            borderRadius: '16px'
                        }}>
                            <div className="card-body p-5">
                                {/* Titolo */}
                                <div className="text-center mb-4">
                                    <h2 className="mb-2 fw-bold text-dark">{t('login.title')}</h2>
                                    <p className="text-muted">Compiti</p>
                                </div>

                                {/* Alert errore */}
                                {error && (
                                    <div className="alert text-center" role="alert" style={{
                                        background: 'rgba(220, 53, 69, 0.1)',
                                        color: '#dc3545',
                                        border: '1px solid rgba(220, 53, 69, 0.2)',
                                        borderRadius: '12px'
                                    }}>
                                        {error}
                                    </div>
                                )}

                                {/* Form di login */}
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label text-dark fw-medium">{t('login.email')}</label>
                                        <input
                                            id="email"
                                            type="email"
                                            className="form-control"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={t('login.emailPlaceholder', 'your@email.com')}
                                            required
                                            disabled={loading}
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.8)',
                                                border: '1px solid rgba(108, 117, 125, 0.25)',
                                                color: '#495057',
                                                borderRadius: '12px',
                                                backdropFilter: 'blur(10px)',
                                                WebkitBackdropFilter: 'blur(10px)',
                                                padding: '12px 16px'
                                            }}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label text-dark fw-medium">{t('login.password')}</label>
                                        <div className="input-group">
                                            <input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                className="form-control"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder={t('login.passwordPlaceholder', 'Enter your password')}
                                                required
                                                disabled={loading}
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.8)',
                                                    border: '1px solid rgba(108, 117, 125, 0.25)',
                                                    color: '#495057',
                                                    borderTopLeftRadius: '12px',
                                                    borderBottomLeftRadius: '12px',
                                                    borderRight: 'none',
                                                    backdropFilter: 'blur(10px)',
                                                    WebkitBackdropFilter: 'blur(10px)',
                                                    padding: '12px 16px'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="btn"
                                                onClick={() => setShowPassword(!showPassword)}
                                                disabled={loading}
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.8)',
                                                    border: '1px solid rgba(108, 117, 125, 0.25)',
                                                    color: '#6c757d',
                                                    borderTopRightRadius: '12px',
                                                    borderBottomRightRadius: '12px',
                                                    borderLeft: 'none',
                                                    backdropFilter: 'blur(10px)',
                                                    WebkitBackdropFilter: 'blur(10px)'
                                                }}
                                            >
                                                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="d-grid">
                                        <button
                                            type="submit"
                                            className="btn btn-lg"
                                            disabled={loading || !email || !password}
                                            style={{
                                                background: 'rgba(102, 126, 234, 0.1)',
                                                border: '1px solid rgba(102, 126, 234, 0.2)',
                                                color: '#667eea',
                                                borderRadius: '12px',
                                                backdropFilter: 'blur(10px)',
                                                WebkitBackdropFilter: 'blur(10px)',
                                                fontWeight: '600',
                                                transition: 'all 0.3s ease',
                                                padding: '12px 24px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = 'rgba(102, 126, 234, 0.15)';
                                                e.target.style.transform = 'translateY(-2px)';
                                                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    {t('login.loading', 'Signing in...')}
                                                </>
                                            ) : (
                                                t('login.button')
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}