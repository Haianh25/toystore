import React from 'react';
import './Toast.css';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type, onClose }) => {
    return (
        <div className={`toast-item toast-${type}`}>
            <div className="toast-icon">
                {type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
            </div>
            <div className="toast-message">{message}</div>
            <button className="toast-close" onClick={onClose}>
                <FaTimes />
            </button>
        </div>
    );
};

export default Toast;
