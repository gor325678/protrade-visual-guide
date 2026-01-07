import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface PreRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PreRegistrationModal: React.FC<PreRegistrationModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-black/95 text-white border-white/10 sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold leading-tight mb-4">
                        {t('modal.title')}
                    </DialogTitle>
                </DialogHeader>

                <div className="w-full h-[600px] bg-white rounded-lg overflow-hidden">
                    <iframe
                        id="JotFormIFrame-260054920631045"
                        title="Registration Form"
                        onLoad={() => window.parent.scrollTo(0, 0)}
                        allowTransparency={true}
                        allow="geolocation; microphone; camera; fullscreen"
                        src="https://form.jotform.com/260054920631045"
                        frameBorder="0"
                        style={{
                            minWidth: "100%",
                            maxWidth: "100%",
                            height: "600px",
                            border: "none"
                        }}
                        scrolling="yes"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PreRegistrationModal;
