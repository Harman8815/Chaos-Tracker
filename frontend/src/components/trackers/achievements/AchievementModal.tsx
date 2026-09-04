import React, { useState, useEffect } from 'react';
import { Achievement } from '../../../types';
import Button from '../../ui/Button';

interface AchievementModalProps {
    achievement?: Achievement | null;
    onClose: () => void;
    onSave: (achievement: Omit<Achievement, 'id'> & { id?: string }) => void;
    onDelete: (id: string) => void;
}

const AchievementModal: React.FC<AchievementModalProps> = ({ achievement, onClose, onSave, onDelete }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [tags, setTags] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [images, setImages] = useState('');
    
    useEffect(() => {
        if (achievement) {
            setTitle(achievement.title);
            setDescription(achievement.description);
            setDate(achievement.date);
            setTags(achievement.tags.join(', '));
            setCoverImage(achievement.coverImage || '');
            setImages(achievement.images.join('\n'));
        }
    }, [achievement]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !date) return;
        
        onSave({
            id: achievement?.id,
            title,
            description,
            date,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            coverImage: coverImage.trim() || undefined,
            images: images.split('\n').map(url => url.trim()).filter(Boolean)
        });
    };
    
    const handleDelete = () => {
        if (achievement?.id) {
            onDelete(achievement.id);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-[rgba(15,10,30,0.75)] backdrop-blur-xl border border-[rgba(139,92,246,0.35)] rounded-xl shadow-[0_0_25px_rgba(124,58,237,0.35)] w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-white">{achievement ? 'Edit' : 'Create'} Achievement</h2>
                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-4 -mr-4">
                    <div>
                        <label className="text-sm text-[#e9d5ff]">Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full mt-1 p-2 rounded-md bg-[rgba(15,10,30,0.6)] border border-[rgba(139,92,246,0.35)]" required />
                    </div>
                     <div>
                        <label className="text-sm text-[#e9d5ff]">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full mt-1 p-2 rounded-md bg-[rgba(15,10,30,0.6)] border border-[rgba(139,92,246,0.35)] h-24" />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="text-sm text-[#e9d5ff]">Date</label>
                             <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full mt-1 p-2 rounded-md bg-[rgba(15,10,30,0.6)] border border-[rgba(139,92,246,0.35)]" required />
                        </div>
                        <div>
                            <label className="text-sm text-[#e9d5ff]">Tags (comma-separated)</label>
                            <input type="text" value={tags} onChange={e => setTags(e.target.value)} className="w-full mt-1 p-2 rounded-md bg-[rgba(15,10,30,0.6)] border border-[rgba(139,92,246,0.35)]" />
                        </div>
                     </div>
                       <div>
                        <label className="text-sm text-[#e9d5ff]">Cover Image URL</label>
                        <input type="text" value={coverImage} onChange={e => setCoverImage(e.target.value)} className="w-full mt-1 p-2 rounded-md bg-[rgba(15,10,30,0.6)] border border-[rgba(139,92,246,0.35)]" />
                    </div>
                    <div>
                        <label className="text-sm text-[#e9d5ff]">Gallery Image URLs (one per line)</label>
                        <textarea value={images} onChange={e => setImages(e.target.value)} className="w-full mt-1 p-2 rounded-md bg-[rgba(15,10,30,0.6)] border border-[rgba(139,92,246,0.35)] h-24" />
                    </div>
                    <div className="flex justify-between items-center pt-4 mt-auto">
                        <div>
                           {achievement && (
                             <Button type="button" onClick={handleDelete} className="bg-red-500/20 text-red-400 hover:bg-red-500/40">Delete</Button>
                           )}
                        </div>
                        <div className="flex gap-4">
                            <Button type="button" onClick={onClose} className="bg-[rgba(15,10,30,0.6)] text-white hover:bg-[rgba(139,92,246,0.35)]">Cancel</Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AchievementModal;