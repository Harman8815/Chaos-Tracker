import React, { useState, useEffect } from 'react';

interface GalleryModalProps {
    gallery: { images: string[]; title: string; };
    onClose: () => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ gallery, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => setCurrentIndex(prev => (prev + 1) % gallery.images.length);
    const prevImage = () => setCurrentIndex(prev => (prev - 1 + gallery.images.length) % gallery.images.length);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gallery.images.length]);

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8" onClick={e => e.stopPropagation()}>
                <img 
                    src={gallery.images[currentIndex]} 
                    alt={`${gallery.title} - Image ${currentIndex + 1}`} 
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
                <div className="absolute top-4 left-4 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                    {currentIndex + 1} / {gallery.images.length}
                </div>
                {gallery.images.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center text-2xl hover:bg-black/80">&lt;</button>
                        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center text-2xl hover:bg-black/80">&gt;</button>
                    </>
                )}
                <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center text-xl hover:bg-black/80">&times;</button>
            </div>
        </div>
    );
};

export default GalleryModal;
