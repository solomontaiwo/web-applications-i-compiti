import { useEffect, useState } from 'react';
import { getMyOpenAssignments, submitResponse } from '../../api/studentAPI.mjs';
import ToastMessage from '../../components/ToastMessage';
import { useTranslation } from 'react-i18next';

export default function StudentDashboard() {
    const { t } = useTranslation();
    const [assignments, setAssignments] = useState([]);
    const [responses, setResponses] = useState({});
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAssignments = async () => {
        try {
            const data = await getMyOpenAssignments();
            setAssignments(data);
            setLoading(false);
        } catch (err) {
            setMessage(t('student.errorLoadingAssignments', 'Error loading assignments: ') + err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const handleSubmit = async (assignmentId) => {
        const response = responses[assignmentId];
        if (!response || !response.trim()) {
            setMessage(t('student.errorEmptyResponse', 'Please enter a response before submitting.'));
            return;
        }

        try {
            await submitResponse(assignmentId, response);
            setMessage(t('student.successResponseSubmitted', 'Response submitted successfully!'));
            setResponses(prev => ({ ...prev, [assignmentId]: '' }));
            fetchAssignments(); // Ricarica i compiti per aggiornare lo stato
        } catch (err) {
            setMessage(t('student.errorSubmittingResponse', 'Error submitting response: ') + err.message);
        }
    };

    // Funzione per calcolare la percentuale di completamento
    const getProgressPercentage = (completed, total) => {
        if (total === 0) return 0;
        return Math.round((completed / total) * 100);
    };

    const totalAssignments = assignments.length;
    const respondedAssignments = assignments.filter(a => a.lastAnswer).length;

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 text-center">
                        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                            <span className="visually-hidden">{t('common.loading', 'Loading...')}</span>
                        </div>
                        <p className="mt-3 text-muted">{t('student.loadingAssignments', 'Loading your assignments...')}</p>
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
                                    <i className="bi bi-journal-bookmark-fill text-primary me-2"></i>
                                    {t('student.dashboard.title', 'Student Dashboard')}
                                </h1>
                                <p className="text-muted mb-0">{t('student.dashboard.description', 'Manage your assignments and submit your responses')}</p>
                            </div>
                        </div>
                        <div className="text-end">
                            <div className="bg-light rounded-3 px-3 py-2 border">
                                <div className="small text-muted">{t('student.dashboard.assignedAssignments', 'Assigned assignments')}</div>
                                <div className="h4 mb-0 text-primary fw-bold">{totalAssignments}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistiche Rapide */}
            {totalAssignments > 0 && (
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
                                            <h5 className="mb-1 fw-bold">{totalAssignments}</h5>
                                            <small className="text-muted">{t('student.stats.openAssignments', 'Open assignments')}</small>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="d-flex flex-column align-items-center">
                                            <div className="mb-2">
                                                <i className="bi bi-chat-left-text text-success" style={{ fontSize: '1.5rem' }}></i>
                                            </div>
                                            <h5 className="mb-1 fw-bold">{respondedAssignments}</h5>
                                            <small className="text-muted">{t('student.stats.responded', 'Responded')}</small>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="d-flex flex-column align-items-center">
                                            <div className="mb-2">
                                                <i className="bi bi-graph-up text-info" style={{ fontSize: '1.5rem' }}></i>
                                            </div>
                                            <h5 className="mb-1 fw-bold">{getProgressPercentage(respondedAssignments, totalAssignments)}%</h5>
                                            <small className="text-muted">{t('student.stats.completionRate', 'Completion rate')}</small>
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

            {/* Lista Compiti */}
            {totalAssignments === 0 ? (
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body text-center py-5">
                                <div className="mb-4">
                                    <i className="bi bi-clipboard-x text-muted" style={{ fontSize: '4rem' }}></i>
                                </div>
                                <h4 className="text-muted mb-3">{t('student.noAssignments.title', 'No assignments available')}</h4>
                                <p className="text-muted">
                                    {t('student.noAssignments.description', 'You don\'t have any open assignments at the moment. Check back later for new tasks.')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="row">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-bottom py-3">
                                <h5 className="card-title mb-0 fw-semibold">
                                    <i className="bi bi-list-check text-primary me-2"></i>
                                    {t('student.assignments.title', 'Your Open Assignments')}
                                </h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="px-3 py-3 border-0 text-center" style={{ width: '60px' }}>
                                                    #
                                                </th>
                                                <th className="px-3 py-3 border-0" style={{ width: '25%' }}>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bi bi-question-circle me-1"></i>
                                                        <span>{t('student.table.question', 'Question')}</span>
                                                    </div>
                                                </th>
                                                <th className="px-3 py-3 border-0" style={{ width: '12%' }}>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bi bi-person-workspace me-1"></i>
                                                        <span>{t('student.table.teacher', 'Teacher')}</span>
                                                    </div>
                                                </th>
                                                <th className="px-3 py-3 border-0" style={{ width: '22%' }}>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bi bi-people me-1"></i>
                                                        <span>{t('student.table.group', 'Group')}</span>
                                                    </div>
                                                </th>
                                                <th className="px-3 py-3 border-0" style={{ width: '15%' }}>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bi bi-chat-left-text me-1"></i>
                                                        <span>{t('student.table.lastResponse', 'Last Response')}</span>
                                                    </div>
                                                </th>
                                                <th className="px-3 py-3 border-0" style={{ width: '16%' }}>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bi bi-pencil-square me-1"></i>
                                                        <span>{t('student.table.newResponse', 'New Response')}</span>
                                                    </div>
                                                </th>
                                                <th className="px-3 py-3 border-0 text-center" style={{ width: '10%' }}>
                                                    <div className="d-flex align-items-center justify-content-center">
                                                        <i className="bi bi-send me-1"></i>
                                                        <span>{t('student.table.actions', 'Actions')}</span>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {assignments.map((assignment, index) => (
                                                <tr key={assignment.id} className="border-bottom">
                                                    <td className="px-3 py-3 text-center">
                                                        <span className="badge bg-primary rounded-pill">{index + 1}</span>
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <div className="fw-medium text-dark">{assignment.question}</div>
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <div className="small text-muted">{assignment.teacher}</div>
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <div className="small">
                                                            {assignment.group.map((member, i) => (
                                                                <span key={i} className="badge bg-light text-dark me-1">
                                                                    {member}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <div>
                                                            {assignment.lastAnswer ? (
                                                                <div className="small text-muted bg-light p-2 rounded"
                                                                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: '80px', overflow: 'auto' }}
                                                                    title={assignment.lastAnswer}>
                                                                    {assignment.lastAnswer}
                                                                </div>
                                                            ) : (
                                                                <span className="badge bg-warning">{t('student.table.neverSubmitted', 'Never submitted')}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <textarea
                                                            className="form-control form-control-sm"
                                                            rows={3}
                                                            placeholder={t('student.response.placeholder', 'Enter your response here...')}
                                                            value={responses[assignment.id] || ''}
                                                            onChange={(e) => setResponses(prev => ({ ...prev, [assignment.id]: e.target.value }))}
                                                            style={{ fontSize: '0.875rem' }}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-3 text-center">
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => handleSubmit(assignment.id)}
                                                            disabled={!responses[assignment.id] || !responses[assignment.id].trim()}
                                                        >
                                                            <i className="bi bi-send me-1"></i>
                                                            {t('student.response.submit', 'Submit')}
                                                        </button>
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
            )}
        </div>
    );
}
