import { useEffect, useState } from 'react';
import { getMyResults } from '../../api/studentAPI.mjs';
import { useTranslation } from 'react-i18next';

export default function StudentResultsPage() {
    const { t } = useTranslation();
    const [results, setResults] = useState([]);
    const [average, setAverage] = useState(null);
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        // Ritarda la visualizzazione dello spinner per evitare flickering
        const spinnerTimeout = setTimeout(() => {
            setShowSpinner(true);
        }, 200);

        getMyResults().then(({ results, average }) => {
            setResults(results);
            setAverage(average);
            setShowSpinner(false);
            clearTimeout(spinnerTimeout);
        });

        return () => clearTimeout(spinnerTimeout);
    }, []);

    // Funzione per determinare il colore del badge basato sul voto
    const getGradeBadgeClass = (score) => {
        if (score >= 28) return 'bg-success';
        if (score >= 24) return 'bg-primary';
        if (score >= 20) return 'bg-warning';
        if (score >= 18) return 'bg-info';
        return 'bg-danger';
    };

    // Funzione per calcolare la percentuale per la progress bar
    const getProgressPercentage = (score) => {
        return (score / 30) * 100;
    };

    if (showSpinner) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 text-center">
                        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                            <span className="visually-hidden">{t('common.loading')}</span>
                        </div>
                        <p className="mt-3 text-muted">{t('student.results.loadingGrades', 'Loading your grades...')}</p>
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
                                    {t('student.results.title', 'My Grades')}
                                </h1>
                                <p className="text-muted mb-0">{t('student.results.description', 'View all your results and monitor your progress')}</p>
                            </div>
                        </div>
                        <div className="text-end">
                            <div className="bg-light rounded-3 px-3 py-2 border">
                                <div className="small text-muted">{t('student.results.evaluatedAssignments', 'Evaluated assignments')}</div>
                                <div className="h4 mb-0 text-primary fw-bold">{results.length}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {results.length === 0 ? (
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body text-center py-5">
                                <div className="mb-4">
                                    <i className="bi bi-clipboard-x text-muted" style={{ fontSize: '4rem' }}></i>
                                </div>
                                <h4 className="text-muted mb-3">{t('student.results.noEvaluatedAssignments.title', 'No evaluated assignments')}</h4>
                                <p className="text-muted">
                                    {t('student.results.noEvaluatedAssignments.description', 'You don\'t have any evaluated assignments yet. Your grades will appear here once teachers have graded your submissions.')}
                                </p>
                                <div className="mt-4">
                                    <a href="/student" className="btn btn-primary btn-lg">
                                        <i className="bi bi-arrow-left me-2"></i>
                                        {t('student.results.backToDashboard', 'Back to Dashboard')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Statistiche Media */}
                    {average && (
                        <div className="row mb-3">
                            <div className="col-12">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body py-3">
                                        <h6 className="card-title mb-2">
                                            <i className="bi bi-trophy-fill text-warning me-2"></i>
                                            {t('student.results.weightedAverage', 'Weighted Average')}
                                        </h6>
                                        <div className="progress mb-2" style={{ height: '15px' }}>
                                            <div
                                                className={`progress-bar ${average >= 24 ? 'bg-success' : average >= 20 ? 'bg-warning' : 'bg-danger'}`}
                                                role="progressbar"
                                                style={{ width: `${getProgressPercentage(average)}%` }}
                                                aria-valuenow={average}
                                                aria-valuemin="0"
                                                aria-valuemax="30"
                                            >
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="small text-muted">
                                                {t('student.results.averageScore', 'Average score')}: <strong>{average}</strong>/30
                                            </span>
                                            <span className="small text-muted">
                                                {t('student.results.progress', 'Progress')}: <strong>{Math.round(getProgressPercentage(average))}%</strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lista Risultati */}
                    <div className="row">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-white border-bottom py-3">
                                    <h5 className="card-title mb-0 fw-semibold">
                                        <i className="bi bi-list-check text-primary me-2"></i>
                                        {t('student.results.resultsList', 'Results List')}
                                    </h5>
                                </div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="px-4 py-3 border-0">#</th>
                                                    <th className="px-4 py-3 border-0">
                                                        <i className="bi bi-question-circle me-1"></i>
                                                        {t('student.results.table.question', 'Question')}
                                                    </th>
                                                    <th className="px-4 py-3 border-0">
                                                        <i className="bi bi-person-workspace me-1"></i>
                                                        {t('student.results.table.teacher', 'Teacher')}
                                                    </th>
                                                    <th className="px-4 py-3 border-0">
                                                        <i className="bi bi-people me-1"></i>
                                                        {t('student.results.table.group', 'Group')}
                                                    </th>
                                                    <th className="px-4 py-3 border-0">
                                                        <i className="bi bi-pencil-square me-1"></i>
                                                        {t('student.results.table.answer', 'Answer')}
                                                    </th>
                                                    <th className="px-4 py-3 border-0 text-center">
                                                        <i className="bi bi-award me-1"></i>
                                                        {t('student.results.table.score', 'Score')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {results.map((r, index) => (
                                                    <tr key={index} className="border-bottom">
                                                        <td className="px-4 py-3 text-center">
                                                            <span className="badge bg-primary rounded-pill">{index + 1}</span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="fw-medium text-dark">{r.question}</div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="small text-muted">{r.teacher}</div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="small">
                                                                {r.group.map((member, i) => (
                                                                    <span key={i} className="badge bg-light text-dark me-1">
                                                                        {member}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3" style={{ maxWidth: '300px' }}>
                                                            <div className="position-relative">
                                                                <div
                                                                    className="text-truncate small text-muted p-2 bg-light rounded"
                                                                    style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}
                                                                    title={r.answer}
                                                                >
                                                                    {r.answer ?? t('student.results.table.notAvailable', 'Not available')}
                                                                </div>
                                                                {r.answer && r.answer.length > 100 && (
                                                                    <button
                                                                        className="btn btn-sm btn-link p-0 position-absolute top-0 end-0 mt-1 me-1"
                                                                        data-bs-toggle="tooltip"
                                                                        title={t('student.results.table.viewFullAnswer', 'Click to see full answer')}
                                                                    >
                                                                        <i className="bi bi-eye"></i>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className={`badge ${getGradeBadgeClass(r.score)} px-3 py-2`}>
                                                                {r.score}/30
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}