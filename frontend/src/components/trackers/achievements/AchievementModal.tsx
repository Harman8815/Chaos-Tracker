import React, { useState, useEffect } from 'react';
import { Achievement } from '../../../types';
import Button from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../../ui/Dialog';
import { Label } from '../../ui/Label';

interface AchievementModalProps {
    achievement?: Achievement | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onClose: () => void;
    onSave: (achievement: Omit<Achievement, 'id'> & { id?: string }) => void;
    onDelete: (id: string) => void;
}

const AchievementModal: React.FC<AchievementModalProps> = ({ achievement, open, onOpenChange, onClose, onSave, onDelete }) => {
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{achievement ? 'Edit' : 'Create'} Achievement</DialogTitle>
                </DialogHeader>
                <DialogClose />
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <Label htmlFor="date">Date</Label>
                             <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <Input id="tags" type="text" value={tags} onChange={e => setTags(e.target.value)} />
                        </div>
                     </div>
                       <div className="space-y-2">
                        <Label htmlFor="coverImage">Cover Image URL</Label>
                        <Input id="coverImage" type="text" value={coverImage} onChange={e => setCoverImage(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="images">Gallery Image URLs (one per line)</Label>
                        <Textarea id="images" value={images} onChange={e => setImages(e.target.value)} />
                    </div>
                    <DialogFooter>
                        {achievement && (
                            <Button type="button" variant="destructive" onClick={handleDelete}>Delete</Button>
                        )}
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AchievementModal;
