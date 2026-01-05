import React, { useRef } from 'react';
import { Download, Award, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import html2canvas from 'html2canvas';

interface CertificateProps {
    studentName: string;
    courseTitle: string;
    completionDate: Date;
    instructorName?: string;
}

export const Certificate: React.FC<CertificateProps> = ({
    studentName,
    courseTitle,
    completionDate,
    instructorName = 'ProTrader Systems'
}) => {
    const { t, language } = useLanguage();
    const certificateRef = useRef<HTMLDivElement>(null);

    const downloadCertificate = async () => {
        if (!certificateRef.current) return;

        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2,
                backgroundColor: '#0f172a'
            });

            const link = document.createElement('a');
            link.download = `certificate-${studentName.replace(/\s+/g, '-')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Error generating certificate:', error);
        }
    };

    const formattedDate = completionDate.toLocaleDateString(
        language === 'uk' ? 'uk-UA' : 'ru-RU',
        { year: 'numeric', month: 'long', day: 'numeric' }
    );

    return (
        <div className="space-y-4">
            {/* Certificate Preview */}
            <div
                ref={certificateRef}
                className="relative bg-gradient-to-br from-gray-900 via-blue-900/30 to-gray-900 border-4 border-yellow-500/50 rounded-xl p-8 md:p-12 overflow-hidden"
            >
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500" />
                <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500" />

                {/* Corner decorations */}
                <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-yellow-500/50" />
                <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-yellow-500/50" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-yellow-500/50" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-yellow-500/50" />

                <div className="text-center relative z-10">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <Award className="h-16 w-16 text-yellow-400" />
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                        {t('certificate.title')}
                    </h2>
                    <p className="text-gray-400 text-sm mb-8">{t('certificate.subtitle')}</p>

                    {/* Student Name */}
                    <p className="text-gray-300 mb-2">{t('certificate.presented_to')}</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 font-serif">
                        {studentName}
                    </h3>

                    {/* Course */}
                    <p className="text-gray-300 mb-2">{t('certificate.for_completing')}</p>
                    <h4 className="text-xl text-blue-400 font-semibold mb-8">
                        {courseTitle}
                    </h4>

                    {/* Completion badge */}
                    <div className="inline-flex items-center gap-2 bg-green-900/30 border border-green-700 rounded-full px-4 py-2 mb-8">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="text-green-400 font-medium">
                            {t('certificate.completed')}
                        </span>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-end">
                        <div className="text-left">
                            <p className="text-xs text-gray-500">{t('certificate.date')}</p>
                            <p className="text-gray-300">{formattedDate}</p>
                        </div>
                        <div className="text-center">
                            <div className="w-32 border-t border-gray-600 pt-2">
                                <p className="text-gray-300 font-medium">{instructorName}</p>
                                <p className="text-xs text-gray-500">{t('certificate.instructor')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Download Button */}
            <Button
                onClick={downloadCertificate}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
            >
                <Download className="h-4 w-4 mr-2" />
                {t('certificate.download')}
            </Button>
        </div>
    );
};

export default Certificate;
