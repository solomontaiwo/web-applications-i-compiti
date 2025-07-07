import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/UseAuth';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const { t, i18n } = useTranslation();

    if (!user) return null;

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <>
            {/* Spacer per evitare che il contenuto vada sotto la navbar flottante */}
            <div style={{ height: '80px' }}></div>

            <nav className="navbar navbar-expand-lg fixed-top" style={{
                background: 'rgba(248, 249, 250, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(108, 117, 125, 0.1)',
                boxShadow: '0 2px 20px rgba(0, 0, 0, 0.08)',
                zIndex: 1030
            }}>
                <div className="container-fluid px-4">
                    {/* Brand */}
                    <Link
                        className="navbar-brand fw-bold d-flex align-items-center"
                        to={user.role === 'teacher' ? '/teacher' : '/student'}
                        style={{
                            fontSize: '1.5rem',
                            color: '#667eea'
                        }}
                    >
                        <i className="bi bi-list-check me-2" style={{ color: '#667eea', fontWeight: 'bold' }}></i>
                        Compiti
                    </Link>

                    {/* Toggle button per mobile */}
                    <button
                        className="navbar-toggler border-0"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navLinks"
                        style={{
                            boxShadow: 'none',
                            padding: '8px 12px'
                        }}
                    >
                        <div style={{ width: '20px', height: '20px', position: 'relative' }}>
                            <span style={{
                                display: 'block',
                                position: 'absolute',
                                height: '2px',
                                width: '100%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '1px',
                                opacity: 1,
                                left: 0,
                                transform: 'rotate(0deg)',
                                transition: '.25s ease-in-out',
                                top: '4px'
                            }}></span>
                            <span style={{
                                display: 'block',
                                position: 'absolute',
                                height: '2px',
                                width: '100%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '1px',
                                opacity: 1,
                                left: 0,
                                transform: 'rotate(0deg)',
                                transition: '.25s ease-in-out',
                                top: '9px'
                            }}></span>
                            <span style={{
                                display: 'block',
                                position: 'absolute',
                                height: '2px',
                                width: '100%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '1px',
                                opacity: 1,
                                left: 0,
                                transform: 'rotate(0deg)',
                                transition: '.25s ease-in-out',
                                top: '14px'
                            }}></span>
                        </div>
                    </button>

                    <div className="collapse navbar-collapse" id="navLinks">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {user.role === 'teacher' && (
                                <>
                                    <li className="nav-item mx-1">
                                        <Link
                                            className={`nav-link px-3 py-2 rounded-pill fw-medium transition-all ${location.pathname === '/teacher'
                                                    ? 'active'
                                                    : ''
                                                }`}
                                            to="/teacher"
                                            style={{
                                                color: location.pathname === '/teacher'
                                                    ? '#667eea'
                                                    : '#6c757d',
                                                background: location.pathname === '/teacher'
                                                    ? 'rgba(102, 126, 234, 0.1)'
                                                    : 'transparent',
                                                boxShadow: location.pathname === '/teacher'
                                                    ? '0 2px 8px rgba(102, 126, 234, 0.15)'
                                                    : 'none',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <i className="bi bi-house-door me-2"></i>
                                            {t('navbar.teacher')}
                                        </Link>
                                    </li>
                                    <li className="nav-item mx-1">
                                        <Link
                                            className={`nav-link px-3 py-2 rounded-pill fw-medium transition-all ${location.pathname === '/teacher/class-status'
                                                    ? 'active'
                                                    : ''
                                                }`}
                                            to="/teacher/class-status"
                                            style={{
                                                color: location.pathname === '/teacher/class-status'
                                                    ? '#667eea'
                                                    : '#6c757d',
                                                background: location.pathname === '/teacher/class-status'
                                                    ? 'rgba(102, 126, 234, 0.1)'
                                                    : 'transparent',
                                                boxShadow: location.pathname === '/teacher/class-status'
                                                    ? '0 2px 8px rgba(102, 126, 234, 0.15)'
                                                    : 'none',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <i className="bi bi-graph-up me-2"></i>
                                            {t('navbar.stats', 'Statistics')}
                                        </Link>
                                    </li>
                                </>
                            )}

                            {user.role === 'student' && (
                                <>
                                    <li className="nav-item mx-1">
                                        <Link
                                            className={`nav-link px-3 py-2 rounded-pill fw-medium transition-all ${location.pathname === '/student'
                                                    ? 'active'
                                                    : ''
                                                }`}
                                            to="/student"
                                            style={{
                                                color: location.pathname === '/student'
                                                    ? '#667eea'
                                                    : '#6c757d',
                                                background: location.pathname === '/student'
                                                    ? 'rgba(102, 126, 234, 0.1)'
                                                    : 'transparent',
                                                boxShadow: location.pathname === '/student'
                                                    ? '0 2px 8px rgba(102, 126, 234, 0.15)'
                                                    : 'none',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <i className="bi bi-house-door me-2"></i>
                                            {t('navbar.student')}
                                        </Link>
                                    </li>
                                    <li className="nav-item mx-1">
                                        <Link
                                            className={`nav-link px-3 py-2 rounded-pill fw-medium transition-all ${location.pathname === '/student/results'
                                                    ? 'active'
                                                    : ''
                                                }`}
                                            to="/student/results"
                                            style={{
                                                color: location.pathname === '/student/results'
                                                    ? '#667eea'
                                                    : '#6c757d',
                                                background: location.pathname === '/student/results'
                                                    ? 'rgba(102, 126, 234, 0.1)'
                                                    : 'transparent',
                                                boxShadow: location.pathname === '/student/results'
                                                    ? '0 2px 8px rgba(102, 126, 234, 0.15)'
                                                    : 'none',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <i className="bi bi-award me-2"></i>
                                            {t('navbar.mygrades', 'My grades')}
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>

                        {/* Language switcher */}
                        <div className="d-flex align-items-center me-3">
                            <button className="btn btn-link p-1 me-1" onClick={() => changeLanguage('it')} aria-label="Italiano" style={{fontWeight: i18n.language === 'it' ? 'bold' : 'normal'}}>IT</button>
                            <span style={{color: '#6c757d'}}>|</span>
                            <button className="btn btn-link p-1 ms-1" onClick={() => changeLanguage('en')} aria-label="English" style={{fontWeight: i18n.language === 'en' ? 'bold' : 'normal'}}>EN</button>
                        </div>

                        {/* User info e logout */}
                        <div className="d-flex align-items-center">
                            <div className="me-3 d-flex flex-column px-3 py-2 rounded-pill" style={{
                                background: 'rgba(108, 117, 125, 0.05)',
                                border: '1px solid rgba(108, 117, 125, 0.1)'
                            }}>
                                <span className="fw-medium text-dark" style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                                    {user.name}
                                </span>
                                <span className="text-muted" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                                    {user.role === 'teacher' ? t('navbar.role_teacher', 'Teacher') : t('navbar.role_student', 'Student')}
                                </span>
                            </div>

                            <button
                                className="btn rounded-pill px-3 py-2 fw-medium"
                                onClick={logout}
                                style={{
                                    background: 'rgba(220, 53, 69, 0.1)',
                                    border: '1px solid rgba(220, 53, 69, 0.2)',
                                    color: '#dc3545',
                                    boxShadow: '0 2px 8px rgba(220, 53, 69, 0.15)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(220, 53, 69, 0.15)';
                                    e.target.style.transform = 'translateY(-1px)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'rgba(220, 53, 69, 0.1)';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 2px 8px rgba(220, 53, 69, 0.15)';
                                }}
                            >
                                <i className="bi bi-box-arrow-right me-2"></i>
                                {t('navbar.logout')}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}