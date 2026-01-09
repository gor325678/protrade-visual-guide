import React, { useEffect } from 'react';
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

    useEffect(() => {
        if (isOpen) {
            // Load JotForm embed handler script for auto-height
            const script = document.createElement('script');
            script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js';
            script.async = true;
            script.onload = () => {
                // Initialize the handler after script loads
                if (window.jotformEmbedHandler) {
                    window.jotformEmbedHandler(
                        "iframe[id='JotFormIFrame-260054920631045']",
                        "https://form.jotform.com/"
                    );
                }
            };
            document.body.appendChild(script);

            return () => {
                // Cleanup script on unmount
                document.body.removeChild(script);
            };
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-black/95 text-white border-white/10 sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold leading-tight mb-4">
                        {t('modal.title')}
                    </DialogTitle>
                </DialogHeader>

                <div className="w-full min-h-[400px] bg-white rounded-lg overflow-hidden">
                    <iframe
                        id="JotFormIFrame-260054920631045"
                        title="Registration Form"
                        onLoad={() => window.parent.scrollTo(0, 0)}
                        allowTransparency={true}
                        allow="geolocation; microphone; camera; fullscreen; payment"
                        src="https://form.jotform.com/260054920631045"
                        frameBorder="0"
                        style={{
                            minWidth: "100%",
                            maxWidth: "100%",
                            height: "539px",
                            border: "none"
                        }}
                        scrolling="no"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

// Declare jotformEmbedHandler for TypeScript
declare global {
    interface Window {
        jotformEmbedHandler?: (selector: string, baseUrl: string) => void;
    }
}

export default PreRegistrationModal;

