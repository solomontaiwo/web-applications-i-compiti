import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AssignmentTable({ assignments, error }) {
    const { t } = useTranslation();

    if (error) {
        return (
            <div className="alert alert-danger m-3" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
            </div>
        );
    }

    if (!assignments || assignments.length === 0) {
        return (
            <div className="text-center py-5">
                <div className="mb-3">
                    <i className="bi bi-clipboard-x text-muted" style={{ fontSize: '4rem' }}></i>
                </div>
                <h5 className="text-muted mb-2">{t('teacher.assignments.noAssignments.title', 'No assignments created yet')}</h5>
                <p className="text-muted">
                    {t('teacher.assignments.noAssignments.description', 'Create your first assignment to get started.')}
                </p>
            </div>
        );
    }

    const getPriority = (assignment) => {
        if (assignment.hasResponse && assignment.score === null) return 'high';
        if (assignment.hasResponse && assignment.score !== null) return 'low';
        return 'medium';
    };



    const getStatusBadge = (assignment) => {
        if (assignment.status === 'closed') {
            return (
                <span className="badge bg-success">
                    <i className="bi bi-check-circle me-1"></i>
                    {t('teacher.assignments.status.closed', 'Closed')}
                </span>
            );
        } else {
            return (
                <span className="badge bg-warning">
                    <i className="bi bi-clock me-1"></i>
                    {t('teacher.assignments.status.open', 'Open')}
                </span>
            );
        }
    };

    const getScoreBadge = (score) => {
        if (score === null) {
            return (
                <span className="badge bg-secondary">
                    <i className="bi bi-dash me-1"></i>
                    {t('teacher.assignments.score.notEvaluated', 'Not evaluated')}
                </span>
            );
        }

        let color = 'secondary';
        if (score >= 28) color = 'success';
        else if (score >= 24) color = 'primary';
        else if (score >= 20) color = 'warning';
        else if (score >= 18) color = 'info';
        else color = 'danger';

        return (
            <span className={`badge bg-${color}`}>
                <i className="bi bi-star-fill me-1"></i>
                {score}/30
            </span>
        );
    };

    const getPriorityOrder = (assignment) => {
        const priority = getPriority(assignment);
        switch (priority) {
            case 'high': return 1;
            case 'medium': return 2;
            case 'low': return 3;
            default: return 4;
        }
    };

    const sortedAssignments = [...assignments].sort((a, b) => {
        const priorityA = getPriorityOrder(a);
        const priorityB = getPriorityOrder(b);
        if (priorityA !== priorityB) return priorityA - priorityB;
        return b.id - a.id; // Più recenti prima
    });

    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                    <tr>
                        <th className="px-3 py-3 border-0 text-center" style={{ width: '60px' }}>
                            #
                        </th>
                        <th className="px-3 py-3 border-0" style={{ width: '35%' }}>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-question-circle me-1"></i>
                                <span>{t('teacher.assignments.table.question', 'Question')}</span>
                            </div>
                        </th>
                        <th className="px-3 py-3 border-0" style={{ width: '20%' }}>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-people me-1"></i>
                                <span>{t('teacher.assignments.table.students', 'Students')}</span>
                            </div>
                        </th>
                        <th className="px-3 py-3 border-0 text-center" style={{ width: '12%' }}>
                            <div className="d-flex align-items-center justify-content-center">
                                <i className="bi bi-chat-left-text me-1"></i>
                                <span>{t('teacher.assignments.table.response', 'Response')}</span>
                            </div>
                        </th>
                        <th className="px-3 py-3 border-0 text-center" style={{ width: '12%' }}>
                            <div className="d-flex align-items-center justify-content-center">
                                <i className="bi bi-award me-1"></i>
                                <span>{t('teacher.assignments.table.score', 'Score')}</span>
                            </div>
                        </th>
                        <th className="px-3 py-3 border-0 text-center" style={{ width: '12%' }}>
                            <div className="d-flex align-items-center justify-content-center">
                                <i className="bi bi-flag me-1"></i>
                                <span>{t('teacher.assignments.table.status', 'Status')}</span>
                            </div>
                        </th>
                        <th className="px-3 py-3 border-0 text-center" style={{ width: '9%' }}>
                            <div className="d-flex align-items-center justify-content-center">
                                <i className="bi bi-gear me-1"></i>
                                <span>{t('teacher.assignments.table.actions', 'Actions')}</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedAssignments.map((assignment, index) => (
                        <tr key={assignment.id} className="border-bottom">
                            <td className="px-3 py-3 text-center">
                                <span className="badge bg-primary rounded-pill">{index + 1}</span>
                            </td>
                            <td className="px-3 py-3">
                                <div className="fw-medium text-dark" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                    {assignment.question}
                                </div>
                            </td>
                            <td className="px-3 py-3">
                                <div className="small text-muted">
                                    {assignment.students || t('teacher.assignments.table.noStudents', 'No students assigned')}
                                </div>
                            </td>
                            <td className="px-3 py-3 text-center">
                                {assignment.hasResponse ? (
                                    <span className="badge bg-success">
                                        <i className="bi bi-check-circle me-1"></i>
                                        {t('teacher.assignments.response.yes', 'Yes')}
                                    </span>
                                ) : (
                                    <span className="badge bg-secondary">
                                        <i className="bi bi-x-circle me-1"></i>
                                        {t('teacher.assignments.response.no', 'No')}
                                    </span>
                                )}
                            </td>
                            <td className="px-3 py-3 text-center">
                                {getScoreBadge(assignment.score)}
                            </td>
                            <td className="px-3 py-3 text-center">
                                {getStatusBadge(assignment)}
                            </td>
                            <td className="px-3 py-3 text-center">
                                <Link
                                    to={`/teacher/assignments/${assignment.id}`}
                                    className="btn btn-sm btn-outline-primary"
                                    title={t('teacher.assignments.actions.viewDetails', 'View details')}
                                >
                                    <i className="bi bi-eye"></i>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}