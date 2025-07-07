import { useState, useEffect, useRef } from 'react';
import { createAssignment, getStudents } from '../api/teacherAPI';
import { useTranslation } from 'react-i18next';
import ToastMessage from './ToastMessage';

export default function AssignmentCreation({ onAssignmentCreated }) {
    const { t } = useTranslation();
    const [question, setQuestion] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [students, setStudents] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const dropdownRef = useRef(null);
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [loadingStudents, setLoadingStudents] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await getStudents();
                setStudents(data);
            } catch (err) {
                setMessage(t('teacher.creation.errorLoadingStudents', 'Error loading students: ') + err.message);
            } finally {
                setLoadingStudents(false);
            }
        };

        fetchStudents();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        const handleScroll = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleStudent = (id) => {
        setSelectedStudents(prev => 
            prev.includes(id) 
                ? prev.filter(studentId => studentId !== id)
                : [...prev, id]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!question.trim()) {
            setMessage(t('teacher.creation.errorEmptyQuestion', 'Please enter a question.'));
            return;
        }

        if (selectedStudents.length === 0) {
            setMessage(t('teacher.creation.errorNoStudents', 'Please select at least one student.'));
            return;
        }

        setLoading(true);
        setLoadingSpinner(true);
        try {
            await createAssignment(question, selectedStudents);
            setQuestion('');
            setSelectedStudents([]);
            setMessage(t('teacher.creation.successAssignmentCreated', 'Assignment created successfully!'));
            onAssignmentCreated();
        } catch (err) {
            setMessage(t('teacher.creation.errorCreatingAssignment', 'Error creating assignment: ') + err.message);
        } finally {
            setLoading(false);
            setLoadingSpinner(false);
        }
    };

    const getSelectedStudentsText = () => {
        if (selectedStudents.length === 0) {
            return t('teacher.creation.selectStudents', 'Select students...');
        }
        const selectedNames = students
            .filter(s => selectedStudents.includes(s.id))
            .map(s => s.name);
        return selectedNames.join(', ');
    };

    const getValidationStatus = () => {
        if (!question.trim()) return 'error';
        if (selectedStudents.length === 0) return 'error';
        return 'success';
    };

    return (
        <div className="mb-4">
            <form onSubmit={handleSubmit}>
                <div className="row g-4">
                    {/* Campo Domanda */}
                    <div className="col-md-6">
                        <label className="form-label fw-medium">
                            <i className="bi bi-question-circle me-2 text-primary"></i>
                            {t('teacher.creation.question', 'Question')}
                        </label>
                        <div className="position-relative">
                            <textarea
                                className={`form-control ${getValidationStatus() === 'success' ? 'is-valid' : question.trim().length > 0 ? 'is-invalid' : ''}`}
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder={t('teacher.creation.questionPlaceholder', 'Enter the assignment question here...')}
                                rows={3}
                                disabled={loading}
                                style={{ resize: 'vertical' }}
                            />
                            <div className="position-absolute bottom-0 end-0 p-2">
                                <small className="text-muted">
                                    {question.length}/500
                                </small>
                            </div>
                        </div>
                        {question.trim().length > 0 && (
                            <div className={`form-text ${getValidationStatus() === 'success' ? 'text-success' : 'text-danger'}`}>
                                <i className={`bi ${getValidationStatus() === 'success' ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                                {getValidationStatus() === 'success' ? t('teacher.creation.validQuestion', 'Valid question') : t('teacher.creation.enterValidQuestion', 'Enter a valid question')}
                            </div>
                        )}
                    </div>

                    {/* Selezione Studenti */}
                    <div className="col-md-4">
                        <label className="form-label fw-medium">
                            <i className="bi bi-people me-2 text-success"></i>
                            {t('teacher.creation.students', 'Students')}
                        </label>
                        <div className="position-relative" ref={dropdownRef}>
                            <button
                                type="button"
                                className={`form-control text-start d-flex justify-content-between align-items-center ${getValidationStatus() === 'error' ? 'border-danger' : 'border-success'}`}
                                onClick={() => setShowDropdown(!showDropdown)}
                                disabled={loading || loadingStudents}
                                style={{ minHeight: '45px' }}
                            >
                                <span className="text-truncate">
                                    {loadingStudents ? t('teacher.creation.loadingStudents', 'Loading students...') : getSelectedStudentsText()}
                                </span>
                                <i className={`bi ${showDropdown ? 'bi-chevron-up' : 'bi-chevron-down'} ms-2`}></i>
                            </button>

                            {showDropdown && !loadingStudents && (
                                <div className="dropdown-menu show w-100 border shadow-lg" style={{
                                    maxHeight: '300px',
                                    overflowY: 'auto',
                                    zIndex: 10000,
                                    position: 'absolute',
                                    bottom: '100%',
                                    marginBottom: '4px',
                                    top: 'auto'
                                }}>
                                    <div className="dropdown-header d-flex justify-content-between align-items-center">
                                        <span className="fw-medium">{t('teacher.creation.selectStudents', 'Select students (2-6)')}</span>
                                        <span className="badge bg-primary rounded-pill">{selectedStudents.length}</span>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    {students.map((student) => (
                                        <div key={student.id} className="dropdown-item-text">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id={`student-${student.id}`}
                                                    checked={selectedStudents.includes(student.id)}
                                                    onChange={() => toggleStudent(student.id)}
                                                />
                                                <label className="form-check-label w-100 user-select-none" htmlFor={`student-${student.id}`}>
                                                    <div className="d-flex align-items-center">
                                                        <div className="me-2">
                                                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                                                <i className="bi bi-person text-muted"></i>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="fw-medium">{student.name}</div>
                                                            <small className="text-muted">{student.email}</small>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                    {students.length === 0 && (
                                        <div className="dropdown-item-text text-center text-muted py-3">
                                            <i className="bi bi-inbox"></i>
                                            <p className="mb-0">{t('teacher.creation.noStudentsAvailable', 'No students available')}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Studenti selezionati */}
                        {selectedStudents.length > 0 && (
                            <div className="mt-2">
                                <div className="d-flex flex-wrap gap-1">
                                    {students
                                        .filter(s => selectedStudents.includes(s.id))
                                        .map(student => (
                                            <span key={student.id} className="badge bg-light text-dark border d-flex align-items-center">
                                                <i className="bi bi-person-fill me-1"></i>
                                                {student.name}
                                                <button
                                                    type="button"
                                                    className="btn-close btn-close-sm ms-1"
                                                    onClick={() => toggleStudent(student.id)}
                                                    style={{ fontSize: '0.6rem' }}
                                                ></button>
                                            </span>
                                        ))
                                    }
                                </div>
                            </div>
                        )}

                        <div className={`form-text ${getValidationStatus() === 'success' ? 'text-success' : 'text-danger'}`}>
                            <i className={`bi ${getValidationStatus() === 'success' ? 'bi-check-circle' : 'bi-info-circle'} me-1`}></i>
                            {selectedStudents.length < 2 ? t('teacher.creation.selectAtLeastTwoStudents', 'Select at least 2 students') :
                                selectedStudents.length > 6 ? t('teacher.creation.maxSixStudentsAllowed', 'Maximum 6 students allowed') :
                                    t('teacher.creation.validGroup', 'Valid group')}
                        </div>
                    </div>

                    {/* Pulsante Creazione */}
                                                            <div className="col-md-2">
                                            <label className="form-label invisible">{t('teacher.creation.action', 'Action')}</label>
                        <div className="d-grid">
                            <button
                                type="submit"
                                className={`btn btn-lg ${getValidationStatus() === 'success' ? 'btn-success' : 'btn-outline-secondary'}`}
                                disabled={loading || getValidationStatus() === 'error'}
                                style={{ minHeight: '45px' }}
                            >
                                {loadingSpinner ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        {t('teacher.creation.creating', 'Creating...')}
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-plus-circle me-2"></i>
                                        {t('teacher.creation.createAssignment', 'Create Assignment')}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Riepilogo */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card border-0 bg-light">
                            <div className="card-body py-3">
                                <div className="row align-items-center">
                                    <div className="col-md-8">
                                        <h6 className="mb-1 text-muted">
                                            <i className="bi bi-info-circle me-2"></i>
                                            {t('teacher.creation.assignmentSummary', 'Assignment Summary')}
                                        </h6>
                                        <div className="small text-muted">
                                            <span className="me-3">
                                                <i className="bi bi-question-circle me-1"></i>
                                                {t('teacher.creation.question', 'Question')}: {getValidationStatus() === 'success' ? '✓' : '✗'}
                                            </span>
                                            <span className="me-3">
                                                <i className="bi bi-people me-1"></i>
                                                {t('teacher.creation.students', 'Students')}: {selectedStudents.length}/6
                                            </span>
                                            <span>
                                                <i className="bi bi-check-circle me-1"></i>
                                                {t('teacher.creation.status', 'Status')}: {getValidationStatus() === 'success' ? t('teacher.creation.ready', 'Ready') : t('teacher.creation.incomplete', 'Incomplete')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4 text-end">
                                        <div className="progress" style={{ height: '8px' }}>
                                            <div
                                                className="progress-bar bg-success"
                                                role="progressbar"
                                                style={{
                                                    width: `${(() => {
                                                        let progress = 0;
                                                        if (getValidationStatus() === 'success') progress += 50;
                                                        return progress;
                                                    })()}%`
                                                }}
                                            ></div>
                                        </div>
                                        <small className="text-muted">
                                                                                            {getValidationStatus() === 'success' ? t('teacher.creation.allReady', 'All ready!') :
                                                    (() => {
                                                        let completed = 0;
                                                        if (getValidationStatus() === 'success') completed++;
                                                        return t('teacher.creation.fieldsCompleted', '{{completed}}/2 fields completed', { completed });
                                                    })()}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* Toast Message */}
            <ToastMessage message={message} onClose={() => setMessage(null)} />
        </div>
    );
}