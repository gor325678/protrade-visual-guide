import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import PreRegistrationForm from '@/components/forms/PreRegistrationForm';

interface PreRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PreRegistrationModal: React.FC<PreRegistrationModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-900/95 backdrop-blur-xl text-white border-gray-800 sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold leading-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        {t('modal.title')}
                    </DialogTitle>
                </DialogHeader>

                <PreRegistrationForm onSuccess={onClose} />
            </DialogContent>
        </Dialog>
    );
};

export default PreRegistrationModal;


