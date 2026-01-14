import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
    id: number;
    filename: string;
    title: string;
    category: string;
    path: string;
}

// Function to clean title: remove technical suffixes and dates
const cleanTitle = (filename: string): string => {
    return filename
        .replace(/\.(png|jpg|jpeg|gif|webp)$/i, '')
        .replace(/\s*\(convert\.io\)\s*/gi, '')
        .replace(/\bmax\b/gi, '')
        .replace(/\betf\b/gi, '')
        .replace(/-?primer/gi, '')
        .replace(/flash\s*card\s*-?\s*/gi, '')
        .replace(/\bzome\b/gi, 'zone')
        .replace(/\s*-?\s*\d{8}\s*-?\s*/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^-\s*/, '')
        .replace(/\s*-\s*$/, '');
};

// Determine category from filename
const getCategory = (filename: string): string => {
    const lower = filename.toLowerCase();
    if (lower.includes('ts') && lower.includes('bs')) return 'Exit: TS-BS';
    if (lower.includes('ms') && lower.includes('ws')) return 'Exit: MS-WS';
    if (lower.includes('e.div') || lower.includes('divs') || lower.includes('div')) return 'Exit: Divergence';
    if (lower.includes('lb')) return 'Exit: LB';
    if (lower.includes('hb') || lower.includes('rejection')) return 'Exit: HB Rejection';
    if (lower.includes('tp')) return 'Exit: TP';
    if (lower.includes('etr') || lower.includes('trend reversal')) return 'Exit: Trend Reversal';
    if (lower.includes('smoothed')) return 'Smoothed Movement';
    if (lower.includes('how to mark')) return 'Chart Marking';
    return 'Другое';
};

// All images data
const generateGalleryImages = (): GalleryImage[] => {
    const basePath = '/images/course/Session 2/ProTrader_Systems - Session 2 - Other Screenshots/';
    const flashCardsBase = '/images/course/Session 2/ProTrader_Systems - Session 2 - Flash Cards/';

    const otherScreenshots = [
        '1 - different types of ts and bs - 20200629 - example 1 (convert.io).png',
        '2 - different types of ts and bs - 20200629 - example 2 (convert.io).png',
        '3 - exit technique with storsi ts-bs - 20200629 - example 1 (convert.io).png',
        '4 - exit technique with storsi ts-bs - 20200629 - example 2 (convert.io).png',
        '5 - exit technique with storsi ms - ws - 20200629 - example 1 (convert.io).png',
        '6 - exit technique with storsi ms - ws - 20200629 - example 2 (convert.io).png',
        '7 - exit technique with storsi divs - 20200629 - example 1 (convert.io).png',
        '8 - exit technique with storsi divs - 20200629 - example 2 (convert.io).png',
        '9 - exit technique with storsi divs - 20200629 - example 3 (convert.io).png',
        '10 - exit technique with storsi divs - 20200629 - example 4 (convert.io).png',
        '11 - exit technique with lb - 20200629 - example 1 (convert.io).png',
        '12 - exit technique with lb - 20200629 - example 2 (convert.io).png',
        '13 - exit technique with lb - 20200629 - example 3 (convert.io).png',
        '14 - exit technique with hb rejection - 20200629 - example 1 (convert.io).png',
        '15 - exit technique with hb rejection - 20200629 - example 2 (convert.io).png',
        '16 - exit technique with tp - 20200629 - example 1 (convert.io).png',
        '17 - exit technique with tp - 20200629 - example 2 (convert.io).png',
        '18 - exit technique with etf trend reversal - 20200629 - example 1 (convert.io).png',
        '19 - exit technique with etf trend reversal - 20200629 - example 2 (convert.io).png',
        '20 - putting it all together - how to mark a chart - 20200629 - example 1 (convert.io).png',
        '21 - putting it all together - how to mark a chart - 20200629 - example 2 (convert.io).png',
        '22 - smoothed movement - good one - 20200629 - example 1 (convert.io).png',
        '23 - not smoothed movement - not good one - 20200629 - example 1 (convert.io).png',
    ];

    const flashCards = [
        '3 - exit setup with ts - bs - part 1 - exit setup bar.png',
        '3 - exit setup with ts - bs - part 2 - exit trigger bar.png',
        '3 - exit setup with ts - bs - part 3 - movement.png',
        '4 - exit setup with ts - bs - part 1 - exit setup bar.png',
        '4 - exit setup with ts - bs - part 2 - exit trigger bar.png',
        '4 - exit setup with ts - bs - part 3 - movement.png',
        '5 - exit setup with ms - ws - part 1 - exit setup bar.png',
        '5 - exit setup with ms - ws - part 2 - exit trigger bar.png',
        '5 - exit setup with ms - ws - part 3 - movement.png',
        '6 - exit setup with ms - ws - part 1 - exit setup bar.png',
        '6 - exit setup with ms - ws - part 2 - exit trigger bar.png',
        '6 - exit setup with ms - ws - part 3 - movement.png',
        '7 - exit setup with div - part 1 - exit setup bar.png',
        '7 - exit setup with div - part 2 - exit trigger bar.png',
        '7 - exit setup with div - part 3 - movement.png',
        '8 - exit setup with div - part 1 - exit setup bar.png',
        '8 - exit setup with div - part 2 - exit trigger bar.png',
        '8 - exit setup with div - part 3 - movement.png',
        '9 - exit setup with e.div - part 1 - exit setup bar.png',
        '9 - exit setup with e.div - part 2 - exit trigger bar.png',
        '9 - exit setup with e.div - part 3 - movement.png',
        '10 - exit setup with e.div - part 1 - exit setup bar.png',
        '10 - exit setup with e.div - part 2 - exit trigger bar.png',
        '10 - exit setup with e.div - part 3 - movement.png',
        '11 - exit setup with lb - part 1 - exit setup bar.png',
        '11 - exit setup with lb - part 2 - exit no trigger bar.png',
        '11 - exit setup with lb - part 3 - movement.png',
        '12 - exit setup with lb - part 1 - exit setup bar.png',
        '12 - exit setup with lb - part 2 - exit trigger bar.png',
        '12 - exit setup with lb - part 3 - movement.png',
        '13 - exit setup with lb - part 1 - exit setup bar.png',
        '13 - exit setup with lb - part 2 - exit trigger bar.png',
        '13 - exit setup with lb - part 3 - movement.png',
        '14 - exit setup with tp - part 1 - exit setup bar.png',
        '14 - exit setup with tp - part 2 - exit trigger bar.png',
        '14 - exit setup with tp - part 3 - movement.png',
        '15 - exit setup with tp - part 1 - exit setup bar.png',
        '15 - exit setup with tp - part 2 - exit trigger bar.png',
        '15 - exit setup with tp - part 3 - movement.png',
        '16 - exit setup with hb rej - part 1 - exit setup bar.png',
        '16 - exit setup with hb rej - part 2 - exit trigger bar.png',
        '16 - exit setup with hb rej - part 3 - movement.png',
        '17 - exit setup with hb rej - part 1 - exit setup bar.png',
        '17 - exit setup with hb rej - part 2 - exit trigger bar.png',
        '17 - exit setup with hb rej - part 3 - movement.png',
        '18 - exit setup with etr - part 1 - exit setup bar.png',
        '18 - exit setup with etr - part 2 - exit trigger bar.png',
        '18 - exit setup with etr - part 3 - movement.png',
        '19 - exit setup with etr - part 1 - exit setup bar.png',
        '19 - exit setup with etr - part 2 - exit trigger bar.png',
        '19 - exit setup with etr - part 3 - movement.png',
    ];

    let id = 1;
    const images: GalleryImage[] = [];

    otherScreenshots.forEach(filename => {
        images.push({
            id: id++,
            filename,
            title: cleanTitle(filename),
            category: getCategory(filename),
            path: basePath + filename
        });
    });

    flashCards.forEach(filename => {
        images.push({
            id: id++,
            filename,
            title: cleanTitle(filename),
            category: getCategory(filename),
            path: flashCardsBase + filename
        });
    });

    return images;
};

const allImages = generateGalleryImages();

const Session2Gallery = () => {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const fromCourseId = location.state?.fromCourse;

    const categories = useMemo(() => {
        const cats = Array.from(new Set(allImages.map(img => img.category)));
        return ['all', ...cats];
    }, []);

    const filteredImages = useMemo(() => {
        if (activeCategory === 'all') return allImages;
        return allImages.filter(img => img.category === activeCategory);
    }, [activeCategory]);

    const getCategoryCount = (cat: string): number => {
        if (cat === 'all') return allImages.length;
        return allImages.filter(img => img.category === cat).length;
    };

    const getCategoryLabel = (cat: string): string => {
        if (cat === 'all') return 'Все материалы';
        return cat;
    };

    const handlePrevImage = () => {
        if (!lightboxImage) return;
        const currentIndex = filteredImages.findIndex(img => img.id === lightboxImage.id);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
        setLightboxImage(filteredImages[prevIndex]);
    };

    const handleNextImage = () => {
        if (!lightboxImage) return;
        const currentIndex = filteredImages.findIndex(img => img.id === lightboxImage.id);
        const nextIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
        setLightboxImage(filteredImages[nextIndex]);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') handlePrevImage();
        if (e.key === 'ArrowRight') handleNextImage();
        if (e.key === 'Escape') setLightboxImage(null);
    };

    const handleDownloadAll = () => {
        alert('Функция скачивания архива будет добавлена позже');
    };

    const handleBack = () => {
        if (fromCourseId) {
            navigate(`/course/${fromCourseId}`);
        } else {
            navigate('/account');
        }
    };

    return (
        <div className="min-h-screen bg-trading-dark flex flex-col text-white" onKeyDown={handleKeyDown} tabIndex={0}>
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    className="mb-6 hover:bg-gray-800 text-gray-400 hover:text-white"
                    onClick={handleBack}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Назад
                </Button>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Скриншоты графиков</h1>
                    <p className="text-gray-400">Session 2 - Техники выхода и анализ тренда</p>
                </div>

                {/* Category Filters + Download Button */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={activeCategory === cat ? 'default' : 'outline'}
                            className={`
                                ${activeCategory === cat
                                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                    : 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'}
                            `}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {getCategoryLabel(cat)}
                            <Badge variant="secondary" className="ml-2 bg-black/30">
                                {getCategoryCount(cat)}
                            </Badge>
                        </Button>
                    ))}

                    <Button
                        className="ml-auto bg-green-600 hover:bg-green-700 text-white"
                        onClick={handleDownloadAll}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Скачать все архивом
                    </Button>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredImages.map(image => (
                        <div
                            key={image.id}
                            className="group relative aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
                            onClick={() => setLightboxImage(image)}
                        >
                            <img
                                src={image.path}
                                alt={image.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-sm text-white font-medium line-clamp-2">{image.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />

            {/* Lightbox Modal */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={() => setLightboxImage(null)}
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-50"
                        onClick={() => setLightboxImage(null)}
                    >
                        <X className="h-8 w-8" />
                    </button>

                    {/* Navigation Buttons */}
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                    >
                        <ChevronLeft className="h-8 w-8 text-white" />
                    </button>

                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                    >
                        <ChevronRight className="h-8 w-8 text-white" />
                    </button>

                    {/* Image */}
                    <div className="max-w-[90vw] max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={lightboxImage.path}
                            alt={lightboxImage.title}
                            className="max-w-full max-h-[75vh] object-contain rounded-lg"
                        />
                        <div className="mt-4 text-center">
                            <h3 className="text-xl font-semibold text-white">{lightboxImage.title}</h3>
                            <Badge className="mt-2 bg-purple-600">{lightboxImage.category}</Badge>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Session2Gallery;
