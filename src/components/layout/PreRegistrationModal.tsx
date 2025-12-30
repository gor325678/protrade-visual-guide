
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowUpRight } from 'lucide-react';

interface PreRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PreRegistrationModal: React.FC<PreRegistrationModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        telegram: '',
        termsAccepted: false
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phone || !formData.termsAccepted) {
            toast.error("Please fill in all required fields and accept terms.");
            return;
        }

        // Here you would typically send data to backend
        console.log('Form submitted:', formData);

        toast.success(t('modal.success'));
        onClose();
        setFormData({ name: '', email: '', phone: '', telegram: '', termsAccepted: false });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-black/95 text-white border-white/10 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold leading-tight">
                        {t('modal.title')}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-400 text-xs uppercase tracking-wide">
                            {t('modal.name')}
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <Input
                                id="name"
                                className="bg-zinc-900 border-zinc-800 focus:border-zinc-700 pl-10 h-11"
                                placeholder={t('modal.name_placeholder')}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-400 text-xs uppercase tracking-wide">
                            {t('modal.email')}
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                            </span>
                            <Input
                                id="email"
                                type="email"
                                className="bg-zinc-900 border-zinc-800 focus:border-zinc-700 pl-10 h-11"
                                placeholder={t('modal.email_placeholder')}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-400 text-xs uppercase tracking-wide">
                            {t('modal.phone')}
                        </Label>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 w-28">
                                <span className="text-lg">🇺🇦</span>
                                <span className="text-sm">+380</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 ml-auto"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                            <Input
                                id="phone"
                                className="bg-zinc-900 border-zinc-800 focus:border-zinc-700 flex-1 h-11"
                                placeholder="_ _ _  _ _ _  _ _ _"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="telegram" className="text-gray-400 text-xs uppercase tracking-wide">
                            {t('modal.telegram')}
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.12 6.4-3.5 13.9a1.86 1.86 0 0 1-3.23.47l-4.57-4.23-2.3 2.14a1 1 0 0 1-1.62-.73l.6-5.83 8.2-7.24a.5.5 0 0 0-.69-.74l-9.9 8.35-4.83-1.6a1.3 1.3 0 0 1 .45-2.5l19.5-6.8a1.3 1.3 0 0 1 1.89 1.77Z" /></svg>
                            </span>
                            <Input
                                id="telegram"
                                className="bg-zinc-900 border-zinc-800 focus:border-zinc-700 pl-10 h-11"
                                placeholder={t('modal.telegram_placeholder')}
                                value={formData.telegram}
                                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex items-start space-x-3 pt-2">
                        <Checkbox
                            id="terms"
                            checked={formData.termsAccepted}
                            onCheckedChange={(checked) => setFormData({ ...formData, termsAccepted: checked as boolean })}
                            className="mt-1 border-zinc-700 data-[state=checked]:bg-zinc-200 data-[state=checked]:text-black"
                        />
                        <Label htmlFor="terms" className="text-sm text-gray-400 leading-snug cursor-pointer">
                            {t('modal.terms')}
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-lg mt-4 flex items-center justify-center gap-2"
                    >
                        {t('modal.submit')}
                        <ArrowUpRight size={20} />
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PreRegistrationModal;
