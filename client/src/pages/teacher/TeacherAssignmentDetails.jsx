import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssignmentResponse, evaluateAssignment } from '../../api/teacherAPI.mjs';
import ToastMessage from '../../components/ToastMessage';
import { useTranslation } from 'react-i18next';

export default function AssignmentDetails() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [score, setScore] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [evaluating, setEvaluating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const assignmentData = await getAssignmentResponse(id);
                setData(assignmentData);
                setLoading(false);
            } catch (err) {
                setMessage(t('teacher.details.errorLoadingAssignment', 'Error loading assignment: ') + err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleEval = async () => {
        if (!score || score < 0 || score > 30) {
            setMessage(t('teacher.details.invalidScore', 'Please enter a valid score between 0 and 30.'));
            return;
        }

        setEvaluating(true);
        try {
            await evaluateAssignment(id, parseInt(score));
            setMessage(t('teacher.details.evaluationSubmitted', 'Evaluation submitted successfully!'));
            // Ricarica i dati per aggiornare lo stato
            const updatedData = await getAssignmentResponse(id);
            setData(updatedData);
        } catch (err) {
            setMessage(t('teacher.details.errorSubmittingEvaluation', 'Error submitting evaluation: ') + err.message);
        } finally {
            setEvaluating(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 28) return 'text-success';
        if (score >= 24) return 'text-primary';
        if (score >= 20) return 'text-warning';
        if (score >= 18) return 'text-info';
        return 'text-danger';
    };

    const getScoreProgress = (score) => {
        return (score / 30) * 100;
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 text-center">
                        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                            <span className="visually-hidden">{t('common.loading')}</span>
                        </div>
                        <p className="mt-3 text-muted">{t('teacher.details.loadingAssignment', 'Loading assignment details...')}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body text-center py-5">
                                <div className="mb-4">
                                    <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '4rem' }}></i>
                                </div>
                                <h4 className="text-muted mb-3">{t('teacher.details.assignmentNotFound.title', 'Assignment not found')}</h4>
                                <p className="text-muted">{t('teacher.details.assignmentNotFound.description', 'The requested assignment is not available or does not exist.')}</p>
                                <div className="mt-4">
                                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/teacher')}>
                                        <i className="bi bi-arrow-left me-2"></i>
                                        {t('teacher.details.backToDashboard', 'Back to Dashboard')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 fade-in">
            {/* Toast Message */}
            {message && <ToastMessage message={message} onClose={() => setMessage(null)} />}

            {/* Page Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-3">
                        <div>
                            <div>
                                <h1 className="h3 mb-1 fw-bold text-dark">
                                    <i className="bi bi-file-earmark-text text-primary me-2"></i>
                                    {t('teacher.details.title', 'Assignment Details')}
                                </h1>
                                <p className="text-muted mb-0">
                                    {data.score !== null 
                                        ? t('teacher.details.viewEvaluated', 'View the details of the evaluated assignment')
                                        : t('teacher.details.evaluateResponse', 'Evaluate the group response and assign a score')
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="text-end">
                            <div className="bg-light rounded-3 px-3 py-2 border">
                                <div className="small text-muted">{t('teacher.details.assignmentId', 'Assignment ID')}</div>
                                <div className="h4 mb-0 text-primary fw-bold">#{id}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    {/* Sezione Domanda e Risposta */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-white border-bottom py-3">
                            <h5 className="card-title mb-0 fw-semibold">
                                <i className="bi bi-question-circle text-primary me-2"></i>
                                {t('teacher.details.questionAndAnswer', 'Question and Answer')}
                            </h5>
                        </div>
                        <div className="card-body">
                            {/* Domanda */}
                            <div className="mb-4">
                                <h6 className="fw-medium text-dark mb-2">
                                    <i className="bi bi-question-circle text-primary me-2"></i>
                                    {t('teacher.details.question', 'Question')}
                                </h6>
                                <div className="bg-light p-3 rounded border">
                                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{data.question}</p>
                                </div>
                            </div>

                            {/* Risposta */}
                            {data.answer ? (
                                <div>
                                    <h6 className="fw-medium text-dark mb-2">
                                        <i className="bi bi-chat-left-text text-success me-2"></i>
                                        {t('teacher.details.answer', 'Answer')}
                                    </h6>
                                    <div className="bg-light p-3 rounded border">
                                        <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{data.answer}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <div className="mb-3">
                                        <i className="bi bi-hourglass-split text-muted" style={{ fontSize: '3rem' }}></i>
                                    </div>
                                    <h5 className="text-muted mb-2">{t('teacher.details.noResponseYet.title', 'No response submitted yet')}</h5>
                                    <p className="text-muted">
                                        {t('teacher.details.noResponseYet.description', 'The group has not provided a response for this assignment yet.')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sezione Gruppo */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-bottom py-3">
                            <h5 className="card-title mb-0 fw-semibold">
                                <i className="bi bi-people text-primary me-2"></i>
                                {t('teacher.details.groupMembers', 'Group Members')}
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {data.group.map((member) => (
                                    <div key={member.id} className="col-md-6 mb-3">
                                        <div className="d-flex align-items-center p-3 bg-light rounded border">
                                            <div className="flex-shrink-0">
                                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                    <i className="bi bi-person-fill"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <div className="fw-medium text-dark">{member.name}</div>
                                                <div className="small text-muted">{member.email}</div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <span className="badge bg-secondary">#{member.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    {/* Sezione Valutazione */}
                    {data.answer && (
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-bottom py-3">
                                <h5 className="card-title mb-0 fw-semibold">
                                    <i className="bi bi-star-fill text-warning me-2"></i>
                                    {t('teacher.details.evaluation', 'Evaluation')}
                                </h5>
                            </div>
                            <div className="card-body">
                                {data.score !== null ? (
                                    <div>
                                        <div className="text-center mb-4">
                                            <div className="mb-3">
                                                <div className="position-relative d-inline-block">
                                                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px' }}>
                                                        <div className="text-center">
                                                            <div className={`h2 mb-0 fw-bold ${getScoreColor(data.score)}`}>{data.score}</div>
                                                            <div className="small text-muted">/30</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="progress mb-3" style={{ height: '8px' }}>
                                                <div
                                                    className={`progress-bar ${getScoreColor(data.score).replace('text-', 'bg-')}`}
                                                    role="progressbar"
                                                    style={{ width: `${getScoreProgress(data.score)}%` }}
                                                ></div>
                                            </div>
                                            <div className={`fw-medium ${getScoreColor(data.score)}`}>
                                                {data.score >= 28 ? t('teacher.details.grade.excellent', 'Excellent') :
                                                 data.score >= 24 ? t('teacher.details.grade.distinguished', 'Distinguished') :
                                                 data.score >= 20 ? t('teacher.details.grade.good', 'Good') :
                                                 data.score >= 18 ? t('teacher.details.grade.sufficient', 'Sufficient') :
                                                 t('teacher.details.grade.insufficient', 'Insufficient')}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="mb-3">
                                            <label htmlFor="score" className="form-label fw-medium">
                                                {t('teacher.details.score', 'Score')} (0-30)
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="score"
                                                min="0"
                                                max="30"
                                                value={score}
                                                onChange={(e) => setScore(e.target.value)}
                                                placeholder={t('teacher.details.scorePlaceholder', 'Enter score...')}
                                            />
                                        </div>
                                        <div className="d-grid">
                                            <button
                                                className="btn btn-success btn-lg"
                                                onClick={handleEval}
                                                disabled={evaluating || !score || score < 0 || score > 30}
                                            >
                                                {evaluating ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                        {t('teacher.details.evaluating', 'Evaluating...')}
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-check-circle me-2"></i>
                                                        {t('teacher.details.submitEvaluation', 'Submit Evaluation')}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 pt-3 border-top">
                                    <h6 className="small text-muted mb-2">{t('teacher.details.gradingScale', 'Grading Scale:')}</h6>
                                    <div className="small">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-danger">0-17</span>
                                            <span className="text-muted">{t('teacher.details.grade.insufficient', 'Insufficient')}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-info">18-19</span>
                                            <span className="text-muted">{t('teacher.details.grade.sufficient', 'Sufficient')}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-warning">20-23</span>
                                            <span className="text-muted">{t('teacher.details.grade.good', 'Good')}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-primary">24-27</span>
                                            <span className="text-muted">{t('teacher.details.grade.distinguished', 'Distinguished')}</span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-success">28-30</span>
                                            <span className="text-muted">{t('teacher.details.grade.excellent', 'Excellent')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}