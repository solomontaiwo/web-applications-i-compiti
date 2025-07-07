import { useTranslation } from 'react-i18next';

export default function ClassStatusTable({ students }) {
    const { t } = useTranslation();

    if (!students || students.length === 0) {
        return (
            <div className="text-center py-5">
                <div className="mb-3">
                    <i className="bi bi-people text-muted" style={{ fontSize: '4rem' }}></i>
                </div>
                <h5 className="text-muted mb-2">{t('teacher.classStatus.noStudents.title', 'No students found')}</h5>
                <p className="text-muted">
                    {t('teacher.classStatus.noStudents.description', 'There are no students in the class yet.')}
                </p>
            </div>
        );
    }

    const getGradeColor = (average) => {
        if (average >= 28) return 'success';
        if (average >= 24) return 'primary';
        if (average >= 20) return 'warning';
        if (average >= 18) return 'info';
        return 'danger';
    };

    const getProgressPercentage = (average) => {
        return (average / 30) * 100;
    };

    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                    <tr>
                        <th className="px-3 py-3 border-0 text-center" style={{ width: '60px' }}>
                            #
                        </th>
                        <th className="px-3 py-3 border-0" style={{ width: '25%' }}>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-person me-1"></i>
                                <span>{t('teacher.classStatus.table.student', 'Student')}</span>
                            </div>
                        </th>
                        <th className="px-3 py-3 border-0 text-center" style={{ width: '15%' }}>
                            <div className="d-flex align-items-center justify-content-center">
                                <i className="bi bi-folder2-open me-1"></i>
                                <span>{t('teacher.classStatus.table.open', 'Open')}</span>
                            </div>
                        </th>
                        <th className="px-3 py-3 border-0 text-center" style={{ width: '15%' }}>
                            <div className="d-flex align-items-center justify-content-center">
                                <i className="bi bi-folder-check me-1"></i>
                                <span>{t('teacher.classStatus.table.closed', 'Closed')}</span>
                            </div>
                        </th>
                        <th className="px-3 py-3 border-0 text-center" style={{ width: '15%' }}>
                            <div className="d-flex align-items-center justify-content-center">
                                <i className="bi bi-list-check me-1"></i>
                                <span>{t('teacher.classStatus.table.total', 'Total')}</span>
                            </div>
                        </th>
                        <th className="px-3 py-3 border-0 text-center" style={{ width: '20%' }}>
                            <div className="d-flex align-items-center justify-content-center">
                                <i className="bi bi-trophy me-1"></i>
                                <span>{t('teacher.classStatus.table.average', 'Average')}</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={student.id} className="border-bottom">
                            <td className="px-3 py-3 text-center">
                                <span className="badge bg-primary rounded-pill">{index + 1}</span>
                            </td>
                            <td className="px-3 py-3">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                                            <i className="bi bi-person-fill"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-medium text-dark">{student.name}</div>
                                        <div className="small text-muted">ID: {student.id}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-3 py-3 text-center">
                                <span className="badge bg-warning">
                                    <i className="bi bi-clock me-1"></i>
                                    {student.open}
                                </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                                <span className="badge bg-success">
                                    <i className="bi bi-check-circle me-1"></i>
                                    {student.closed}
                                </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                                <span className="badge bg-info">
                                    <i className="bi bi-list-check me-1"></i>
                                    {student.total}
                                </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                                <div className="d-flex flex-column align-items-center">
                                    <div className="mb-2">
                                        <span className={`badge bg-${getGradeColor(student.average)} px-3 py-2`}>
                                            <i className="bi bi-star-fill me-1"></i>
                                            {student.average ? student.average.toFixed(1) : '0.0'}/30
                                        </span>
                                    </div>
                                    <div className="progress" style={{ width: '80px', height: '6px' }}>
                                        <div
                                            className={`progress-bar bg-${getGradeColor(student.average)}`}
                                            role="progressbar"
                                            style={{ width: `${getProgressPercentage(student.average || 0)}%` }}
                                        ></div>
                                    </div>
                                    <small className="text-muted mt-1">
                                        {student.average ? (
                                            student.average >= 28 ? t('teacher.classStatus.grade.excellent', 'Excellent') :
                                            student.average >= 24 ? t('teacher.classStatus.grade.distinguished', 'Distinguished') :
                                            student.average >= 20 ? t('teacher.classStatus.grade.good', 'Good') :
                                            student.average >= 18 ? t('teacher.classStatus.grade.sufficient', 'Sufficient') :
                                            t('teacher.classStatus.grade.insufficient', 'Insufficient')
                                        ) : t('teacher.classStatus.grade.noGrades', 'No grades')}
                                    </small>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}