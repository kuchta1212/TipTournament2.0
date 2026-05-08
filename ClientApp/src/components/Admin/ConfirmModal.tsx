import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface ConfirmModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'primary';
}

export class ConfirmModal extends React.Component<ConfirmModalProps> {
    public render() {
        const variant = this.props.variant || 'warning';
        const confirmText = this.props.confirmText || 'Potvrdit';
        const cancelText = this.props.cancelText || 'Zrusit';

        return ReactDOM.createPortal(
            <div className="confirm-modal-overlay" onClick={this.props.onCancel}>
                <div className="confirm-modal glass" onClick={(e) => e.stopPropagation()}>
                    <div className={`confirm-modal-header confirm-modal-header--${variant}`}>
                        <span className="confirm-modal-icon">
                            {variant === 'danger' ? '\u26A0' : variant === 'warning' ? '\u2753' : '\u2139'}
                        </span>
                        <h5>{this.props.title}</h5>
                    </div>
                    <div className="confirm-modal-body">
                        <p>{this.props.message}</p>
                    </div>
                    <div className="confirm-modal-footer">
                        <button className="btn btn-outline-secondary" onClick={this.props.onCancel}>
                            {cancelText}
                        </button>
                        <button className={`btn btn-${variant}`} onClick={this.props.onConfirm}>
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        );
    }
}
