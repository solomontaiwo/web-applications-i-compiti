import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UseAuth';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useTranslation();

    const handleGoHome = () => {
        if (user) {
            // Reindirizza alla dashboard appropriata in base al ruolo
            navigate(user.role === 'teacher' ? '/teacher' : '/student');
        } else {
            // Se non autenticato, vai alla home page di login
            navigate('/');
        }
    };

    const handleGoBack = () => {
        navigate(-1);
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
                            <div className="card-body text-center p-5">
                                {/* Titolo */}
                                <div className="mb-4">
                                    <div className="position-relative d-inline-block">
                                        <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{
                                            width: '80px',
                                            height: '80px',
                                            background: 'rgba(108, 117, 125, 0.1)',
                                            border: '1px solid rgba(108, 117, 125, 0.2)',
                                            color: '#6c757d'
                                        }}>
                                            <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem' }}></i>
                                        </div>
                                        <div className="position-absolute top-0 start-100 translate-middle">
                                            <span className="badge rounded-pill px-2 py-1 fs-7" style={{
                                                background: 'rgba(108, 117, 125, 0.2)',
                                                color: '#6c757d',
                                                border: '1px solid rgba(108, 117, 125, 0.3)',
                                                fontSize: '0.75rem'
                                            }}>404</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Titolo e descrizione */}
                                <h2 className="mb-2 fw-bold text-dark">{t('notfound.oops', 'Oops!')}</h2>
                                <p className="text-muted mb-4">{t('notfound.pageNotFound', 'Page not found')}</p>
                                <p className="text-muted mb-4 fs-6">
                                    {t('notfound.description', 'The page you are looking for does not exist or has been moved.')}
                                </p>

                                {/* Azioni */}
                                <div className="d-grid gap-2">
                                    <button
                                        className="btn btn-lg"
                                        onClick={handleGoHome}
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
                                        <i className="bi bi-house-door me-2"></i>
                                        {user ? t('notfound.backToDashboard', 'Back to Dashboard') : t('notfound.goToHome', 'Go to Home')}
                                    </button>

                                    <button
                                        className="btn btn-lg"
                                        onClick={handleGoBack}
                                        style={{
                                            background: 'rgba(108, 117, 125, 0.1)',
                                            border: '1px solid rgba(108, 117, 125, 0.2)',
                                            color: '#6c757d',
                                            borderRadius: '12px',
                                            backdropFilter: 'blur(10px)',
                                            WebkitBackdropFilter: 'blur(10px)',
                                            fontWeight: '600',
                                            transition: 'all 0.3s ease',
                                            padding: '12px 24px'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'rgba(108, 117, 125, 0.15)';
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(108, 117, 125, 0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'rgba(108, 117, 125, 0.1)';
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        {t('notfound.goBack', 'Go Back')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}