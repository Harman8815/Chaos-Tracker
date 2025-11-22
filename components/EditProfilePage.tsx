import React, { useContext, useState } from 'react';
import { DataContext } from '../App';
import Card from './ui/Card';
import Button from './ui/Button';

const EditProfilePage: React.FC = () => {
    const { userProfile, setUserProfile, setSelectedPage } = useContext(DataContext);

    // Initialize local state with userProfile data
    const [name, setName] = useState(userProfile.name || '');
    const [email, setEmail] = useState(userProfile.email || '');
    const [location, setLocation] = useState(userProfile.location || '');
    const [bio, setBio] = useState(userProfile.bio || '');
    const [avatar, setAvatar] = useState(userProfile.avatar || '');
    const [skills, setSkills] = useState<string[]>(userProfile.skills || []);
    const [newSkill, setNewSkill] = useState('');
    const [socials, setSocials] = useState({
        github: userProfile.socials?.github || '',
        linkedin: userProfile.socials?.linkedin || '',
        twitter: userProfile.socials?.twitter || '',
        website: userProfile.socials?.website || '',
    });

    const handleSave = () => {
        setUserProfile(prev => ({
            ...prev,
            name,
            email,
            location,
            bio,
            avatar,
            skills,
            socials,
        }));
        setSelectedPage('profile');
    };

    const handleCancel = () => {
        setSelectedPage('profile');
    };

    const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
        if ((e.type === 'click' || (e as React.KeyboardEvent).key === 'Enter') && newSkill.trim()) {
            e.preventDefault();
            if (!skills.includes(newSkill.trim())) {
                setSkills([...skills, newSkill.trim()]);
            }
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    return (
        <div className="p-6 h-full overflow-y-auto animate-fade-in max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Edit Profile</h1>
                <div className="flex gap-3">
                    <Button onClick={handleCancel} className="bg-input-bg text-text-primary hover:bg-border">Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Avatar & Basic Info */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <h3 className="font-bold text-lg mb-4">Profile Picture</h3>
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-sidebar-bg shadow-lg">
                                <img 
                                    src={avatar || `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=7c3aed&color=fff&size=128`} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <div className="w-full">
                                <label className="block text-xs text-text-secondary mb-1">Image URL</label>
                                <input
                                    type="text"
                                    value={avatar}
                                    onChange={(e) => setAvatar(e.target.value)}
                                    placeholder="https://example.com/avatar.jpg"
                                    className="w-full p-2 rounded bg-input-bg border border-border text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                                />
                                <p className="text-[10px] text-text-secondary mt-1 text-center">Leave empty to use generated avatar.</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-bold text-lg mb-4">Social Links</h3>
                        <div className="space-y-3">
                             <div>
                                <label className="block text-xs text-text-secondary mb-1">GitHub</label>
                                <input
                                    type="text"
                                    value={socials.github}
                                    onChange={(e) => setSocials({ ...socials, github: e.target.value })}
                                    className="w-full p-2 rounded bg-input-bg border border-border text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                                    placeholder="https://github.com/username"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-text-secondary mb-1">LinkedIn</label>
                                <input
                                    type="text"
                                    value={socials.linkedin}
                                    onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })}
                                    className="w-full p-2 rounded bg-input-bg border border-border text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-text-secondary mb-1">Twitter / X</label>
                                <input
                                    type="text"
                                    value={socials.twitter}
                                    onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                                    className="w-full p-2 rounded bg-input-bg border border-border text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                                    placeholder="https://twitter.com/username"
                                />
                            </div>
                             <div>
                                <label className="block text-xs text-text-secondary mb-1">Website</label>
                                <input
                                    type="text"
                                    value={socials.website}
                                    onChange={(e) => setSocials({ ...socials, website: e.target.value })}
                                    className="w-full p-2 rounded bg-input-bg border border-border text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                                    placeholder="https://mywebsite.com"
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Detailed Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <h3 className="font-bold text-lg mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-text-secondary mb-1">Display Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-2 rounded bg-input-bg border border-border text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-text-secondary mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-2 rounded bg-input-bg border border-border text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                                />
                            </div>
                             <div className="sm:col-span-2">
                                <label className="block text-xs text-text-secondary mb-1">Location</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full p-2 rounded bg-input-bg border border-border text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                                    placeholder="e.g. New York, USA"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs text-text-secondary mb-1">Bio</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full p-2 rounded bg-input-bg border border-border text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary h-32 resize-none"
                                    placeholder="Tell us a little about yourself..."
                                />
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-bold text-lg mb-4">Skills</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {skills.map(skill => (
                                <div key={skill} className="flex items-center px-3 py-1 rounded-full bg-input-bg border border-border text-sm group hover:border-accent-primary transition-colors">
                                    <span>{skill}</span>
                                    <button 
                                        onClick={() => handleRemoveSkill(skill)}
                                        className="ml-2 text-text-secondary hover:text-red-500 focus:outline-none"
                                        aria-label={`Remove ${skill}`}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            {skills.length === 0 && <p className="text-text-secondary text-sm italic">No skills added yet.</p>}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyDown={handleAddSkill}
                                placeholder="Add a skill (e.g., React, Design)..."
                                className="flex-grow p-2 rounded bg-input-bg border border-border text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                            />
                            <Button onClick={handleAddSkill} className="px-4 py-1 text-sm">Add</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;