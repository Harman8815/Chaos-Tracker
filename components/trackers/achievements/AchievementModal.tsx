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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-card-bg p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6">{achievement ? 'Edit' : 'Create'} Achievement</h2>
                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-4 -mr-4">
                    <div>
                        <label className="text-sm text-text-secondary">Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full mt-1 p-2 rounded-md bg-input-bg border border-border" required />
                    </div>
                     <div>
                        <label className="text-sm text-text-secondary">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full mt-1 p-2 rounded-md bg-input-bg border border-border h-24" />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="text-sm text-text-secondary">Date</label>
                             <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full mt-1 p-2 rounded-md bg-input-bg border border-border" required />
                        </div>
                        <div>
                            <label className="text-sm text-text-secondary">Tags (comma-separated)</label>
                            <input type="text" value={tags} onChange={e => setTags(e.target.value)} className="w-full mt-1 p-2 rounded-md bg-input-bg border border-border" />
                        </div>
                     </div>
                      <div>
                        <label className="text-sm text-text-secondary">Cover Image URL</label>
                        <input type="text" value={coverImage} onChange={e => setCoverImage(e.target.value)} className="w-full mt-1 p-2 rounded-md bg-input-bg border border-border" />
                    </div>
                    <div>
                        <label className="text-sm text-text-secondary">Gallery Image URLs (one per line)</label>
                        <textarea value={images} onChange={e => setImages(e.target.value)} className="w-full mt-1 p-2 rounded-md bg-input-bg border border-border h-24" />
                    </div>
                    <div className="flex justify-between items-center pt-4 mt-auto">
                        <div>
                           {achievement && (
                             <Button type="button" onClick={handleDelete} className="bg-red-500/20 text-red-400 hover:bg-red-500/40">Delete</Button>
                           )}
                        </div>
                        <div className="flex gap-4">
                            <Button type="button" onClick={onClose} className="bg-input-bg text-text-primary hover:bg-border">Cancel</Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AchievementModal;