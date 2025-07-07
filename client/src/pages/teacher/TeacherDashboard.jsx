import { useEffect, useState } from 'react';
import { getAllAssignments } from '../../api/teacherAPI.mjs';
import AssignmentCreation from '../../components/AssignmentCreation';
import AssignmentTable from '../../components/AssignmentTable';
import ToastMessage from '../../components/ToastMessage';
import { useTranslation } from 'react-i18next';

export default function TeacherDashboard() {
  const { t } = useTranslation();
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchAssignments = async () => {
    try {
      const data = await getAllAssignments();
      setAssignments(data);
      setError(null);
    } catch (err) {
      setError(t('teacher.errorLoadingAssignments', 'Error loading assignments: ') + err.message);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Funzione per calcolare la percentuale di completamento
  const getProgressPercentage = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  // Calcola le statistiche
  const totalAssignments = assignments.length;
  const respondedAssignments = assignments.filter(a => a.hasResponse).length;
  const evaluatedAssignments = assignments.filter(a => a.score !== null).length;

  return (
    <div className="container mt-4 fade-in">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-3">
            <div>
              <div>
                <h1 className="h3 mb-1 fw-bold text-dark">
                  <i className="bi bi-person-workspace text-primary me-2"></i>
                  {t('teacher.dashboard.title', 'Teacher Dashboard')}
                </h1>
                <p className="text-muted mb-0">{t('teacher.dashboard.description', 'Manage assignments, create new tasks and monitor evaluations')}</p>
              </div>
            </div>
            <div className="text-end">
              <div className="bg-light rounded-3 px-3 py-2 border">
                <div className="small text-muted">{t('teacher.dashboard.createdAssignments', 'Created assignments')}</div>
                <div className="h4 mb-0 text-primary fw-bold">{totalAssignments}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiche Dashboard */}
      <div className="row mb-3">
        <div className="col-lg-3 col-md-6 mb-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center py-3">
              <div className="mb-2">
                <i className="bi bi-clipboard-check text-primary" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <h6 className="card-title mb-1">{totalAssignments}</h6>
              <p className="card-text text-muted small mb-0">{t('teacher.stats.totalAssignments', 'Total Assignments')}</p>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center py-3">
              <div className="mb-2">
                <i className="bi bi-chat-left-text text-success" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <h6 className="card-title mb-1">{respondedAssignments}</h6>
              <p className="card-text text-muted small mb-0">{t('teacher.stats.withResponses', 'With Responses')}</p>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center py-3">
              <div className="mb-2">
                <i className="bi bi-star-fill text-warning" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <h6 className="card-title mb-1">{evaluatedAssignments}</h6>
              <p className="card-text text-muted small mb-0">{t('teacher.stats.evaluated', 'Evaluated')}</p>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center py-3">
              <div className="mb-2">
                <i className="bi bi-graph-up text-info" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <h6 className="card-title mb-1">{totalAssignments > 0 ? Math.round((evaluatedAssignments / totalAssignments) * 100) : 0}%</h6>
              <p className="card-text text-muted small mb-0">{t('teacher.stats.completionRate', 'Completion Rate')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {totalAssignments > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body py-3">
                <h6 className="card-title mb-3">
                  <i className="bi bi-bar-chart text-primary me-2"></i>
                  {t('teacher.progress.title', 'Progress Overview')}
                </h6>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-2">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="small fw-medium">{t('teacher.progress.withResponses', 'Assignments with Responses')}</span>
                        <span className="small text-muted">{respondedAssignments}/{totalAssignments}</span>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: `${getProgressPercentage(respondedAssignments, totalAssignments)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-2">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="small fw-medium">{t('teacher.progress.evaluated', 'Evaluated Assignments')}</span>
                        <span className="small text-muted">{evaluatedAssignments}/{totalAssignments}</span>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{ width: `${getProgressPercentage(evaluatedAssignments, totalAssignments)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Errore se presente */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Toast Message */}
      {message && <ToastMessage message={message} onClose={() => setMessage(null)} />}

      {/* Sezione Creazione Compito */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom py-3">
              <h5 className="card-title mb-0 fw-semibold">
                <i className="bi bi-plus-circle text-success me-2"></i>
                {t('teacher.creation.title', 'Create New Assignment')}
              </h5>
            </div>
            <div className="card-body">
              <AssignmentCreation onAssignmentCreated={fetchAssignments} />
            </div>
          </div>
        </div>
      </div>

      {/* Sezione Lista Compiti */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom py-3">
              <h5 className="card-title mb-0 fw-semibold">
                <i className="bi bi-list-check text-primary me-2"></i>
                {t('teacher.assignments.title', 'All Assignments')}
              </h5>
            </div>
            <div className="card-body p-0">
              <AssignmentTable assignments={assignments} error={error} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}