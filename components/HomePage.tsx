import React, { useContext } from 'react';
import { DataContext, SettingsContext } from '../App';
import { TRACKERS } from '../constants';
import Card from './ui/Card';
import type { PageId } from '../types';

const HomePage: React.FC = () => {
    const dataContext = useContext(DataContext);
    const settingsContext = useContext(SettingsContext);

    if (!dataContext || !settingsContext) return null;

    const { setSelectedPage } = dataContext;

    const today = new Date();
    const formattedDate = today.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const quickLinks = [
        { id: 'dashboard', name: 'View Dashboard', description: 'See your progress overview.' },
        { id: 'journal', name: 'Write in Journal', description: 'Record your thoughts for the day.' },
    ];

    const QuickLinkCard: React.FC<{
      pageId: PageId,
      title: string,
      description: string
    }> = ({ pageId, title, description }) => (
      <div 
        className="bg-light-secondary dark:bg-secondary p-6 rounded-xl border border-light-border-color dark:border-border-color shadow-lg cursor-pointer transition-all duration-300 hover:border-accent dark:hover:border-accent hover:shadow-accent/20 transform hover:-translate-y-1"
        onClick={() => setSelectedPage(pageId)}
      >
          <h3 className="text-xl font-bold text-light-text-primary dark:text-text-primary mb-2">{title}</h3>
          <p className="text-light-text-secondary dark:text-text-secondary">{description}</p>
      </div>
    );


    return (
        <div className="animate-fadeIn h-full flex flex-col justify-center">
            <div className="max-w-4xl mx-auto text-center">
                <p className="text-lg text-accent font-semibold mb-2">{formattedDate}</p>
                <h1 className="text-5xl font-bold text-light-text-primary dark:text-text-primary mb-4">Welcome Back to ZenTrack</h1>
                <p className="text-xl text-light-text-secondary dark:text-text-secondary max-w-2xl mx-auto">
                    Ready to check in with yourself? Track your habits, mood, and thoughts to cultivate a more mindful day.
                </p>
            </div>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 w-full">
                {quickLinks.map(link => (
                    <QuickLinkCard 
                      key={link.id}
                      pageId={link.id as PageId}
                      title={link.name}
                      description={link.description}
                    />
                ))}
            </div>
        </div>
    );
};

export default HomePage;