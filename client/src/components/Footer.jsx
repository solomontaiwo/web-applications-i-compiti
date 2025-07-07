import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="mt-auto" style={{
            background: 'rgba(248, 249, 250, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(108, 117, 125, 0.1)',
            boxShadow: '0 -2px 20px rgba(0, 0, 0, 0.08)',
            color: '#6c757d'
        }}>
            <div className="container py-3">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <small style={{ color: '#6c757d' }}>
                            <i className="bi me-1"></i>
                            {t('footer.text')}
                        </small>
                    </div>
                    <div className="col-md-6 text-md-end">
                        <small style={{ color: '#6c757d' }}>
                            <i className="bi bi-code-slash me-1"></i>
                            {t('footer.dev', 'Developed with love and sleepless nights by')}{' '}
                            <a
                                href="https://github.com/solomontaiwo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                                style={{
                                    color: '#495057',
                                    fontWeight: '500',
                                    transition: 'color 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#212529'}
                                onMouseLeave={(e) => e.target.style.color = '#495057'}
                            >
                                Solomon Taiwo
                            </a>
                        </small>
                    </div>
                </div>
            </div>
        </footer>
    );
}