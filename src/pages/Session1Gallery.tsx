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

// Function to clean title: remove "max", "etf", dates, and technical suffixes
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
    if (lower.includes('s&p moe') || lower.includes('s&p moe')) return 'S&P MOE';
    if (lower.includes('remoe')) return 'REMOE';
    if (lower.includes('trend mode') && !lower.includes('counter')) return 'Ценовые режимы';
    if (lower.includes('counter-trend')) return 'Ценовые режимы';
    if (lower.includes('consolidation')) return 'Ценовые режимы';
    if (lower.includes('choppy')) return 'Ценовые режимы';
    if (lower.includes('spaghetti')) return 'Ценовые режимы';
    if (lower.includes('primer')) return 'Ценовые режимы';
    if (lower.includes('movements')) return 'Ценовые режимы';
    if (lower.includes('poor price')) return 'Ценовые режимы';
    if (lower.includes('missed')) return 'Ценовые режимы';
    if (lower.includes('trend vs')) return 'Ценовые режимы';
    return 'Ценовые режимы';
};

// All images data
const generateGalleryImages = (): GalleryImage[] => {
    const basePath = '/images/course/ProTrader_Systems  - Session 1 - Other Screenshots/';
    const flashCardsBaseSP = '/images/course/ProTrader_Systems  - Session 1 - Templates, indicators, pdf, screenshots/ETF S&P MOE Flash Cards/';
    const flashCardsBaseREMOE = '/images/course/ProTrader_Systems  - Session 1 - Templates, indicators, pdf, screenshots/ETF REMOE Flash Cards/';

    const otherScreenshots = [
        '1 - max etf-primer components and shifts - 20200615 (convert.io).png',
        '2 - trend mode - 20200615 - example 1 (convert.io).png',
        '3 - trend mode - 20200615 - example 2 (convert.io).png',
        '4 - counter-trend mode - 20200615 - example 1 (convert.io).png',
        '5 - counter-trend mode - 20200615 - example 2 (convert.io).png',
        '6 - consolidation zome mode - 20200615 - example 1 (convert.io).png',
        '7 - consolidation zome mode - 20200615 - example 2 (convert.io).png',
        '8 - choppy mode - 20200615 - example 1 (convert.io).png',
        '9 - choppy mode - 20200615 - example 2 (convert.io).png',
        '10 - choppy mode - 20200615 - example 3 (convert.io).png',
        '11 - spaghetti zone - 20200615 - example 1 (convert.io).png',
        '12 - spaghetti zone - 20200615 - example 2 (convert.io).png',
        '13 - spaghetti zone - 20200615 - example 3 (convert.io).png',
        '14 - spaghetti zone - 20200615 - example 4 (convert.io).png',
        '15 - the movements the classic max primer looks for - 20200615 - example 1 (convert.io).png',
        '16 - the movements the classic max primer looks for - 20200615 - example 2 (convert.io).png',
        '17 - poor price action - 20200615 - example 1 (convert.io).png',
        '18 - missed ample move - 20200615 - example 1 (convert.io).png',
        '19 - trend vs counter-trend - 20200615 - example 1 (convert.io).png',
        '20 - trend vs counter-trend - 20200615 - example 2 (convert.io).png',
        '21 - trend vs counter-trend - 20200615 - example 3 (convert.io).png',
        '22 - the movements the max etf-primer looks for - 20200615 - example 1 (convert.io) (1).png',
        '23 - the movements the max etf-primer looks for - 20200615 - example 2 (convert.io).png',
        '24 - etf s&p moe - 20200615 - example 1 (convert.io).png',
        '25 - etf s&p moe - 20200615 - example 2 (convert.io).png',
        '26 - etf s&p moe - 20200615 - example 3 (convert.io).png',
        '27 - etf s&p moe - 20200615 - example 4 (convert.io).png',
        '28 - etf remoe moe - 201200615 - example 1 (convert.io).png',
        '29 - etf remoe moe - 201200615 - example 2 (convert.io).png',
        '30 - etf remoe moe - 201200615 - example 3 (convert.io).png',
        '31 - etf remoe moe - 201200615 - example 4 (convert.io).png',
        '32 - etf remoe moe - 201200615 - example 5 (convert.io).png',
    ];

    const spMoeFlashCards = [
        '1 - etf s&p moe - flash card - part 1 - entry setup bar (convert.io).png',
        '1 - etf s&p moe - flash card - part 2 - entry trigger bar (convert.io).png',
        '1 - etf s&p moe - flash card - part 3 - movement (convert.io).png',
        '2 - etf s&p moe - flash card - part 1 - entry setup bar (convert.io).png',
        '2 - etf s&p moe - flash card - part 2 - entry trigger bar (convert.io).png',
        '2 - etf s&p moe - flash card - part 3 - movement (convert.io).png',
        '3 - etf s&p moe - flash card - part 1 - entry setup bar (convert.io).png',
        '3 - etf s&p moe - flash card - part 2 - entry trigger bar (convert.io).png',
        '3 - etf s&p moe - flash card - part 3 - movement (convert.io).png',
        '4 - etf s&p moe - flash card - part 1 - entry setup bar (convert.io).png',
        '4 - etf s&p moe - flash card - part 2 - entry trigger bar (convert.io).png',
        '4 - etf s&p moe - flash card - part 3 - movement (convert.io).png',
    ];

    const remoeFlashCards = [
        '1 - remoe - flash card - part 1 - entry setup bar.png',
        '1 - remoe - flash card - part 2 - entry trigger bar.png',
        '1 - remoe - flash card - part 3 - movement.png',
        '2 - remoe - flash card - part 1 - entry setup bar.png',
        '2 - remoe - flash card - part 2 - entry trigger bar.png',
        '2 - remoe - flash card - part 3 - movement.png',
        '3 - remoe - flash card - part 1 - entry setup bar.png',
        '3 - remoe - flash card - part 2 - entry trigger bar.png',
        '3 - remoe - flash card - part 3 - movement.png',
        '4 - remoe - flash card - part 1 - entry setup bar.png',
        '4 - remoe - flash card - part 2 - entry trigger bar.png',
        '4 - remoe - flash card - part 3 - movement.png',
        '5 - remoe - flash card - part 1 - entry setup bar.png',
        '5 - remoe - flash card - part 2 - entry trigger bar.png',
        '5 - remoe - flash card - part 3 - movement.png',
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

    spMoeFlashCards.forEach(filename => {
        images.push({
            id: id++,
            filename,
            title: cleanTitle(filename),
            category: 'S&P MOE',
            path: flashCardsBaseSP + filename
        });
    });

    remoeFlashCards.forEach(filename => {
        images.push({
            id: id++,
            filename,
            title: cleanTitle(filename),
            category: 'REMOE',
            path: flashCardsBaseREMOE + filename
        });
    });

    return images;
};

const allImages = generateGalleryImages();

const Session1Gallery = () => {
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
        // This would typically trigger a zip download - for now just alert
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
                    <p className="text-gray-400">Session 1 - Визуальные примеры и флэш-карты</p>
                </div>

                {/* Category Filters + Download Button */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={activeCategory === cat ? 'default' : 'outline'}
                            className={`
                                ${activeCategory === cat
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
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
                            className="group relative aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer border border-gray-800 hover:border-blue-500/50 transition-all duration-300"
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
                        type="button"
                        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-50 pointer-events-auto cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); setLightboxImage(null); }}
                        aria-label="Закрыть"
                    >
                        <X className="h-8 w-8" />
                    </button>

                    {/* Navigation Buttons */}
                    <button
                        type="button"
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors pointer-events-auto cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                        aria-label="Предыдущее"
                    >
                        <ChevronLeft className="h-8 w-8 text-white" />
                    </button>

                    <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors pointer-events-auto cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                        aria-label="Следующее"
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
                            <Badge className="mt-2 bg-blue-600">{lightboxImage.category}</Badge>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Session1Gallery;
