import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import PreRegistrationForm from '@/components/forms/PreRegistrationForm';

interface PreRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PreRegistrationModal: React.FC<PreRegistrationModalProps> = ({ isOpen, onClose }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="bg-gray-900/95 backdrop-blur-xl text-white border-gray-800 sm:max-w-xl max-h-[90vh] overflow-y-auto"
                aria-describedby={undefined}
            >
                <DialogTitle className="sr-only">Анкета записи</DialogTitle>
                <PreRegistrationForm onSuccess={onClose} />
            </DialogContent>
        </Dialog>
    );
};

export default PreRegistrationModal;



