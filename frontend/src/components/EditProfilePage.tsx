import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './ui/Card';
import Button from './ui/Button';
import { profileService, ProfileUpdateData } from '../services/profileService';
import { UserProfile } from '../types';

const EditProfilePage: React.FC = () => {
    const { userProfile, setUserProfile, setSelectedPage } = useContext(DataContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Initialize local state with userProfile data
    const [name, setName] = useState(userProfile?.name || '');
    const [email, setEmail] = useState(userProfile?.email || '');
    const [location, setLocation] = useState(userProfile?.location || '');
    const [bio, setBio] = useState(userProfile?.bio || '');
    const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatar || '');
    const [website, setWebsite] = useState(userProfile?.socials?.website || '');
    
    // Load profile data on mount
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profile = await profileService.getProfile();
                if (profile) {
                    // Map profileService fields to types.ts UserProfile fields
                    const mappedProfile: UserProfile = {
                        name: profile.first_name + ' ' + profile.last_name,
                        email: profile.email,
                        joinDate: profile.created_at,
                        avatar: profile.avatar_url,
                        bio: profile.bio,
                        location: profile.location,
                        socials: {
                            website: profile.website
                        }
                    };
                    setUserProfile(mappedProfile);
                    setName(profile.first_name + ' ' + profile.last_name || '');
                    setEmail(profile.email || '');
                    setLocation(profile.location || '');
                    setBio(profile.bio || '');
                    setAvatarUrl(profile.avatar_url || '');
                    setWebsite(profile.website || '');
                }
            } catch (err) {
                setError('Failed to load profile data');
            }
        };
        
        loadProfile();
    }, [setUserProfile]);

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        try {
            const updateData: ProfileUpdateData = {
                first_name: name,
                last_name: '', // Since types.ts UserProfile doesn't split name, we'll use empty string
                bio,
                avatar_url: avatarUrl,
                location,
                website,
            };
            
            const updatedProfile = await profileService.updateProfile(updateData);
            
            if (updatedProfile) {
                    // Map profileService fields to types.ts UserProfile fields
                    const mappedProfile: UserProfile = {
                        name: updatedProfile.first_name + ' ' + updatedProfile.last_name,
                        email: updatedProfile.email,
                        joinDate: updatedProfile.created_at,
                        avatar: updatedProfile.avatar_url,
                        bio: updatedProfile.bio,
                        location: updatedProfile.location,
                        socials: {
                            website: updatedProfile.website
                        }
                    };
                    setUserProfile(mappedProfile);
                    setSuccess('Profile updated successfully!');
                    setTimeout(() => {
                        setSelectedPage('profile');
                    }, 1500);
                } else {
                setError('Failed to update profile');
            }
        } catch (err) {
            setError('An error occurred while updating your profile');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setSelectedPage('profile');
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

            {/* Error and Success Messages */}
            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Avatar & Basic Info */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <h3 className="font-bold text-lg mb-4">Profile Picture</h3>
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-sidebar-bg shadow-lg">
                                <img 
                                    src={avatarUrl || `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=7c3aed&color=fff&size=128`} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <div className="w-full">
                                <label className="block text-xs text-text-secondary mb-1">Image URL</label>
                                <input
                                    type="text"
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                    placeholder="https://example.com/avatar.jpg"
                                    className="w-full p-2 rounded bg-input-bg border border-border text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                                />
                                <p className="text-[10px] text-text-secondary mt-1 text-center">Leave empty to use generated avatar.</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-bold text-lg mb-4">Basic Information</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-text-secondary mb-1">Website</label>
                                <input
                                    type="text"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
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
                                <label className="block text-xs text-text-secondary mb-1">Name</label>
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
                                    disabled
                                    className="w-full p-2 rounded bg-input-bg border border-border text-sm text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                                    title="Email cannot be changed here"
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
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;
