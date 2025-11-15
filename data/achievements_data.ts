import { v4 as uuidv4 } from 'uuid';
import { Achievement } from '../types';

export const DUMMY_ACHIEVEMENTS: Achievement[] = [
    {
        id: uuidv4(),
        title: "Launched First Project",
        description: "Successfully deployed the 'Daily Tracker' application, marking a significant milestone in personal development projects. The launch involved setting up the CI/CD pipeline and ensuring a stable production environment.",
        date: "2023-10-26",
        tags: ["professional", "coding", "milestone"],
        coverImage: "https://placehold.co/600x400/7c3aed/ffffff/png?text=Project+Launch",
        images: [
            "https://placehold.co/800x600/1a1a1a/f5f5f5/png?text=Code+Snapshot",
            "https://placehold.co/800x600/262626/a3a3a3/png?text=Deployment+Logs",
            "https://placehold.co/800x600/2e2e2e/f5f5f5/png?text=Live+App+Screenshot"
        ]
    },
    {
        id: uuidv4(),
        title: "Completed a Marathon",
        description: "Ran the annual city marathon, finishing with a personal best time. This was the culmination of 6 months of intense training and dedication.",
        date: "2023-08-15",
        tags: ["personal", "health", "fitness", "milestone"],
        coverImage: "https://placehold.co/600x400/10b981/ffffff/png?text=Marathon+Finish",
        images: [
            "https://placehold.co/800x600/1a1a1a/f5f5f5/png?text=Finish+Line",
            "https://placehold.co/800x600/262626/a3a3a3/png?text=Medal",
            "https://placehold.co/800x600/2e2e2e/f5f5f5/png?text=Training+Route"
        ]
    },
    {
        id: uuidv4(),
        title: "Mountain Summit",
        description: "Reached the summit of Mount Beacon after a challenging 5-hour hike. The views from the top were breathtaking and made the effort worthwhile.",
        date: "2023-06-02",
        tags: ["personal", "travel", "adventure"],
        coverImage: "https://placehold.co/600x400/f59e0b/ffffff/png?text=Mountain+Summit",
        images: [
            "https://placehold.co/800x600/1a1a1a/f5f5f5/png?text=Summit+View",
            "https://placehold.co/800x600/262626/a3a3a3/png?text=Hiking+Trail"
        ]
    },
    {
        id: uuidv4(),
        title: "Learned 3D Modeling",
        description: "Completed an online course on Blender, learning the fundamentals of 3D modeling, texturing, and rendering. Created a small animated short as a final project.",
        date: "2023-03-20",
        tags: ["learning", "creative", "coding"],
        coverImage: "https://placehold.co/600x400/3b82f6/ffffff/png?text=3D+Donut",
        images: [
            "https://placehold.co/800x600/1a1a1a/f5f5f5/png?text=Blender+Screenshot",
            "https://placehold.co/800x600/262626/a3a3a3/png?text=Final+Render"
        ]
    }
];