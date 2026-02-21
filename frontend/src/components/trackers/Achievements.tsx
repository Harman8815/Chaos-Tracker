import React, { useState, useMemo, useEffect } from 'react';
import { TRACKERS } from '../../constants';
import { Achievement } from '../../types';
import TrackerWrapper from '../TrackerWrapper';
import TimelineView from './achievements/TimelineView';
import GridView from './achievements/GridView';
import GalleryModal from './achievements/GalleryModal';
import AchievementModal from './achievements/AchievementModal';
import Card from '../ui/Card';
import Button from '../ui/Button';
import achievementService from '../../services/achievementService';

type View = 'timeline' | 'grid';
type SortOrder = 'asc' | 'desc';

const Achievements: React.FC = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<View>('timeline');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [gallery, setGallery] = useState<{ images: string[], title: string } | null>(null);
    const [modalState, setModalState] = useState<{ achievement?: Achievement | null } | null>(null);

    // Fetch achievements on mount
    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                setIsLoading(true);
                const data = await achievementService.getAllAchievements();
                setAchievements(data);
            } catch (error) {
                console.error("Failed to fetch achievements:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        achievements.forEach(a => a.tags.forEach(t => tags.add(t)));
        return Array.from(tags).sort();
    }, [achievements]);

    const filteredAchievements = useMemo(() => {
        return [...achievements]
            .filter(a => selectedTags.length === 0 || a.tags.some(t => selectedTags.includes(t)))
            .sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            });
    }, [achievements, sortOrder, selectedTags]);

    const handleTagClick = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSaveAchievement = async (achievementToSave: Omit<Achievement, 'id'> & { id?: string }) => {
        try {
            if (achievementToSave.id) { // Editing existing
                const updated = await achievementService.updateAchievement(achievementToSave.id, achievementToSave as Achievement);
                setAchievements(prev => prev.map(a => a.id === updated.id ? updated : a));
            } else {
                // Creating new
                const newAchievement = await achievementService.createAchievement(achievementToSave);
                setAchievements(prev => [...prev, newAchievement]);
            }
            setModalState(null);
        } catch (error) {
            console.error("Failed to save achievement:", error);
            alert("Failed to save achievement. Please try again.");
        }
    };

    const handleDeleteAchievement = async (achievementId: string) => {
        if (window.confirm("Are you sure you want to delete this achievement?")) {
            try {
                await achievementService.deleteAchievement(achievementId);
                setAchievements(prev => prev.filter(a => a.id !== achievementId));
                setModalState(null);
            } catch (error) {
                console.error("Failed to delete achievement:", error);
                alert("Failed to delete achievement. Please try again.");
            }
        }
    };

    const trackerInfo = TRACKERS.find(t => t.id === 'achievements')!;

    if (isLoading) {
        return (
            <TrackerWrapper tracker={trackerInfo}>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary"></div>
                </div>
            </TrackerWrapper>
        );
    }

    return (
        <TrackerWrapper tracker={trackerInfo}>
            {gallery && <GalleryModal gallery={gallery} onClose={() => setGallery(null)} />}
            {modalState && (
                <AchievementModal
                    achievement={modalState.achievement}
                    onClose={() => setModalState(null)}
                    onSave={handleSaveAchievement}
                    onDelete={handleDeleteAchievement}
                />
            )}
            <Card className="mb-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex space-x-1 bg-input-bg p-1 rounded-lg">
                            {(['timeline', 'grid'] as View[]).map(v => (
                                <button key={v} onClick={() => setView(v)} className={`px-4 py-2 text-sm rounded-md capitalize transition-colors ${view === v ? 'bg-accent-primary text-white shadow' : 'hover:bg-border'}`}>
                                    {v} View
                                </button>
                            ))}
                        </div>
                        <Button onClick={() => setModalState({ achievement: null })}>+ New Achievement</Button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-text-secondary">Sort by Date:</span>
                        <select
                            value={sortOrder}
                            onChange={e => setSortOrder(e.target.value as SortOrder)}
                            className="p-2 rounded-md bg-input-bg border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        >
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm font-medium text-text-secondary mr-2">Filter by Tag:</span>
                        {allTags.length > 0 ? (
                            allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagClick(tag)}
                                    className={`px-3 py-1 text-xs rounded-full capitalize border transition-colors ${selectedTags.includes(tag) ? 'bg-accent-primary border-accent-primary text-white' : 'bg-input-bg border-border hover:bg-border'}`}
                                >
                                    {tag}
                                </button>
                            ))
                        ) : (
                            <span className="text-xs text-text-secondary italic">No tags available</span>
                        )}
                        {selectedTags.length > 0 && (
                            <button onClick={() => setSelectedTags([])} className="text-xs text-text-secondary hover:text-text-primary underline">Clear</button>
                        )}
                    </div>
                </div>
            </Card>

            <div className="h-[calc(100vh-18rem)] overflow-y-auto -mr-6 pr-6">
                {view === 'timeline' ? (
                    <TimelineView
                        achievements={filteredAchievements}
                        onImageClick={setGallery}
                        onEdit={(ach) => setModalState({ achievement: ach })}
                    />
                ) : (
                    <GridView
                        achievements={filteredAchievements}
                        onImageClick={setGallery}
                        onEdit={(ach) => setModalState({ achievement: ach })}
                    />
                )}
            </div>
        </TrackerWrapper>
    );
};

export default Achievements;
