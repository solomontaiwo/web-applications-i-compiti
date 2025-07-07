import { useEffect, useState } from 'react';
import { getClassStatus } from '../../api/teacherAPI';
import ToastMessage from '../../components/ToastMessage';
import ClassStatusTable from '../../components/ClassStatusTable';
import { useTranslation } from 'react-i18next';

export default function ClassStatusPage() {
    const { t } = useTranslation();
    const [stats, setStats] = useState([]);
    const [sortBy, setSortBy] = useState('name');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getClassStatus(sortBy);
                setStats(data);
                setLoading(false);
            } catch (err) {
                setMessage(t('teacher.classStatus.errorLoadingStats', 'Error loading class statistics: ') + err.message);
                setLoading(false);
            }
        };

        fetchStats();
    }, [sortBy]);

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 text-center">
                        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                            <span className="visually-hidden">{t('common.loading')}</span>
                        </div>
                        <p className="mt-3 text-muted">{t('teacher.classStatus.loadingStats', 'Loading class statistics...')}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 fade-in">
            {/* Page Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-3">
                        <div>
                            <div>
                                <h1 className="h3 mb-1 fw-bold text-dark">
                                    <i className="bi bi-graph-up-arrow text-primary me-2"></i>
                                    {t('teacher.classStatus.title', 'Class Statistics')}
                                </h1>
                                <p className="text-muted mb-0">{t('teacher.classStatus.description', 'Monitor performance and student progress')}</p>
                            </div>
                        </div>
                        <div className="text-end">
                            <div className="bg-light rounded-3 px-3 py-2 border">
                                <div className="small text-muted">{t('teacher.classStatus.totalStudents', 'Total students')}</div>
                                <div className="h4 mb-0 text-primary fw-bold">{stats.length}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistiche Riepilogative */}
            {stats.length > 0 && (
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body py-3">
                                <div className="row text-center">
                                    <div className="col-md-4">
                                        <div className="d-flex flex-column align-items-center">
                                            <div className="mb-2">
                                                <i className="bi bi-folder2-open text-warning" style={{ fontSize: '1.5rem' }}></i>
                                            </div>
                                            <h5 className="mb-1 fw-bold">{stats.reduce((sum, s) => sum + s.open, 0)}</h5>
                                            <small className="text-muted">{t('teacher.classStatus.openAssignments', 'Open assignments')}</small>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="d-flex flex-column align-items-center">
                                            <div className="mb-2">
                                                <i className="bi bi-folder-check text-success" style={{ fontSize: '1.5rem' }}></i>
                                            </div>
                                            <h5 className="mb-1 fw-bold">{stats.reduce((sum, s) => sum + s.closed, 0)}</h5>
                                            <small className="text-muted">{t('teacher.classStatus.closedAssignments', 'Closed assignments')}</small>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="d-flex flex-column align-items-center">
                                            <div className="mb-2">
                                                <i className="bi bi-trophy text-info" style={{ fontSize: '1.5rem' }}></i>
                                            </div>
                                            <h5 className="mb-1 fw-bold">
                                                {stats.length > 0 
                                                    ? (stats.reduce((sum, s) => sum + s.average, 0) / stats.length).toFixed(1)
                                                    : '0.0'
                                                }
                                            </h5>
                                            <small className="text-muted">{t('teacher.classStatus.averageGrade', 'Average grade')}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Message */}
            {message && <ToastMessage message={message} onClose={() => setMessage(null)} />}

            {/* Tabella Studenti */}
            <div className="row">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-bottom py-3">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <h5 className="card-title mb-0 fw-semibold">
                                        <i className="bi bi-table text-primary me-2"></i>
                                        {t('teacher.classStatus.studentDetails', 'Student Details')}
                                    </h5>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center justify-content-md-end">
                                        <label className="form-label me-2 mb-0 fw-medium text-muted small">
                                            <i className="bi bi-sort-down me-1"></i>
                                            {t('teacher.classStatus.sortBy', 'Sort by:')}
                                        </label>
                                        <select
                                            className="form-select form-select-sm"
                                            style={{ maxWidth: '180px' }}
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                        >
                                            <option value="name">{t('teacher.classStatus.sort.name', 'Name')}</option>
                                            <option value="total">{t('teacher.classStatus.sort.total', 'Total assignments')}</option>
                                            <option value="average">{t('teacher.classStatus.sort.average', 'Average grades')}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <ClassStatusTable students={stats} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}