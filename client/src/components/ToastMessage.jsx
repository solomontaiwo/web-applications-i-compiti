export default function ToastMessage({ message, onClose, type = 'auto' }) {
    if (!message) return null;

    const isSuccess = type === 'success' || (type === 'auto' && (
        message.includes('successo') || message.includes('salvata') || message.includes('creato') ||
        message.includes('success') || message.includes('saved') || message.includes('created') ||
        message.includes('✅')
    ));
    const isError = type === 'error' || (type === 'auto' && (
        message.includes('Errore') || message.includes('errore') ||
        message.includes('Error') || message.includes('error')
    ));

    const getToastStyles = () => {
        if (isSuccess) {
            return {
                background: 'rgba(40, 167, 69, 0.1)',
                border: '1px solid rgba(40, 167, 69, 0.2)',
                color: '#28a745',
                iconColor: '#28a745',
                icon: 'check-circle-fill'
            };
        } else if (isError) {
            return {
                background: 'rgba(220, 53, 69, 0.1)',
                border: '1px solid rgba(220, 53, 69, 0.2)',
                color: '#dc3545',
                iconColor: '#dc3545',
                icon: 'x-circle-fill'
            };
        } else {
            return {
                background: 'rgba(102, 126, 234, 0.1)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                color: '#667eea',
                iconColor: '#667eea',
                icon: 'info-circle-fill'
            };
        }
    };

    const styles = getToastStyles();

    return (
        <div className="toast-container">
            <div
                className="toast align-items-center show"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                style={{
                    background: styles.background,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: styles.border,
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px 0 rgba(108, 117, 125, 0.15)',
                    color: styles.color,
                    fontWeight: '500'
                }}
            >
                <div className="d-flex align-items-center">
                    <div className="toast-body flex-grow-1" style={{ color: styles.color }}>
                        {message}
                    </div>
                    <button
                        type="button"
                        className="btn-close me-2"
                        aria-label="Close"
                        onClick={onClose}
                        style={{
                            filter: 'none',
                            opacity: 0.6,
                            fontSize: '0.8rem'
                        }}
                    ></button>
                </div>
            </div>
        </div>
    );
}