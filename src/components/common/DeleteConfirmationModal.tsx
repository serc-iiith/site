import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isLoading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    isLoading = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
            <div
                className="bg-[color:var(--background)] rounded-lg shadow-xl max-w-md w-full p-6 animate-slideIn"
                onClick={(e) => e.stopPropagation()} // Prevent clicks from propagating to backdrop
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                        <div className="mr-3 bg-red-100 p-2 rounded-full">
                            <AlertTriangle size={24} className="text-[color:var(--error-color)]" />
                        </div>
                        <h3 className="text-lg font-semibold text-[color:var(--text-color)]">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[color:var(--secondary-color)] hover:text-[color:var(--text-color)]"
                        disabled={isLoading}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mt-3 mb-5">
                    <p className="text-[color:var(--secondary-color)]">{message}</p>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-[color:var(--border-color)] rounded-md text-[color:var(--text-color)] hover:bg-[color:var(--hover-bg)]"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-[color:var(--error-color)] text-white rounded-md hover:bg-opacity-90 disabled:opacity-70"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
