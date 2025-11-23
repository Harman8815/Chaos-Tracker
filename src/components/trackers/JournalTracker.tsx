import React, { useState, useContext, useRef, useMemo } from 'react';
import { DataContext } from '../../context/DataContext';
import { TRACKERS } from '../../constants';
import TrackerWrapper from '../TrackerWrapper';
import Card from '../ui/Card';
import Button from '../ui/Button';

type Tab = 'editor' | 'history';

// A simple markdown parser
const parseMarkdown = (markdown: string) => {
    if (!markdown) return { __html: '' };
    const html = markdown
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-3">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^\* (.*$)/gim, '<ul class="list-disc list-inside"><li>$1</li></ul>')
        .replace(/<\/ul>(\s*)<ul>/gim, '') // Merge consecutive lists
        .replace(/\n/g, '<br />');
    return { __html: html };
};

const JournalEditor: React.FC = () => {
    const { data, setData, today } = useContext(DataContext);
    const todayData = data[today] || { journal: '', points: 0 };
    const [text, setText] = useState(todayData.journal);
    const [feedback, setFeedback] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSave = () => {
        setData(prev => ({ ...prev, [today]: { ...todayData, journal: text } }));
        setFeedback('Saved successfully!');
        setTimeout(() => setFeedback(''), 2000);
    };

    const applyMarkdown = (style: 'bold' | 'italic' | 'h3') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = text.substring(start, end);

        let markdown;
        switch (style) {
            case 'bold':
                markdown = `**${selectedText}**`;
                break;
            case 'italic':
                markdown = `*${selectedText}*`;
                break;
            case 'h3':
                markdown = `### ${selectedText}`;
                break;
        }

        const newText = text.substring(0, start) + markdown + text.substring(end);
        setText(newText);
        textarea.focus();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Editor</h3>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => applyMarkdown('bold')} className="px-3 py-1 bg-input-bg rounded font-bold">B</button>
                        <button onClick={() => applyMarkdown('italic')} className="px-3 py-1 bg-input-bg rounded italic">I</button>
                        <button onClick={() => applyMarkdown('h3')} className="px-3 py-1 bg-input-bg rounded">H3</button>
                    </div>
                </div>
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    rows={15}
                    className="w-full p-3 rounded-md bg-input-bg border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    placeholder="What's on your mind?"
                />
                <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-green-500 h-5">{feedback}</span>
                    <Button onClick={handleSave}>Save</Button>
                </div>
            </Card>
            <Card>
                <h3 className="font-bold text-lg mb-4">Preview</h3>
                <div 
                    className="prose prose-invert prose-sm max-w-none h-[330px] overflow-y-auto p-3 bg-input-bg rounded-md"
                    dangerouslySetInnerHTML={parseMarkdown(text)} 
                />
            </Card>
        </div>
    );
};

const JournalEntryModal: React.FC<{ entry: { date: string, journal: string }, onClose: () => void }> = ({ entry, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-card-bg p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                 <h4 className="font-bold text-xl mb-4 text-text-primary">
                    {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h4>
                <div 
                    className="prose prose-invert prose-sm max-w-none overflow-y-auto pr-4 -mr-4"
                    dangerouslySetInnerHTML={parseMarkdown(entry.journal)}
                />
                 <Button onClick={onClose} className="mt-6 ml-auto">Close</Button>
            </div>
        </div>
    );
}

const JournalHistory: React.FC = () => {
    const { data } = useContext(DataContext);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEntry, setSelectedEntry] = useState<{ date: string, journal: string } | null>(null);

    const { years, months } = useMemo(() => {
        const dataYears = Object.keys(data).reduce((acc, dateStr) => {
            const year = new Date(dateStr).getFullYear();
            if (!acc.includes(year)) {
                acc.push(year);
            }
            return acc;
        }, [] as number[]).sort((a, b) => b - a);

        if (!dataYears.includes(new Date().getFullYear())) {
            dataYears.unshift(new Date().getFullYear());
        }

        return {
            years: dataYears,
            months: Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' }))
        }
    }, [data]);

    const calendarGrid = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({ key: `pad-start-${i}`, empty: true });
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = new Date(year, month, day).toISOString().split('T')[0];
            days.push({
                key: dateString,
                day,
                dateString,
                entry: data[dateString]?.journal,
            });
        }
        return days;
    }, [currentDate, data]);
    
    const handleDateChange = (year?: number, month?: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (year !== undefined) newDate.setFullYear(year);
            if (month !== undefined) newDate.setMonth(month);
            return newDate;
        });
    }
    
    const handleDayClick = (dateString: string) => {
        if (data[dateString]?.journal) {
            setSelectedEntry({ date: dateString, journal: data[dateString].journal });
        }
    }

    const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div>
            <Card>
                <div className="flex justify-between items-center mb-4">
                     <div className="flex items-center gap-2">
                        <select 
                            value={currentDate.getMonth()}
                            onChange={(e) => handleDateChange(undefined, parseInt(e.target.value))}
                            className="p-2 rounded-md bg-input-bg border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        >
                            {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
                        </select>
                         <select 
                            value={currentDate.getFullYear()}
                            onChange={(e) => handleDateChange(parseInt(e.target.value), undefined)}
                            className="p-2 rounded-md bg-input-bg border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <h3 className="font-bold text-lg hidden md:block">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                    {DAY_NAMES.map(day => <div key={day} className="font-semibold text-text-secondary text-sm p-2">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {calendarGrid.map(day => (
                        day.empty ? <div key={day.key}></div> : (
                            <button 
                                key={day.key} 
                                onClick={() => handleDayClick(day.dateString)}
                                disabled={!day.entry}
                                className={`h-28 rounded-lg flex flex-col p-2 text-left transition-colors border ${
                                    day.entry ? 'bg-card-bg border-border hover:bg-border hover:border-accent-primary cursor-pointer' : 'bg-input-bg/50 border-transparent'
                                }`}
                            >
                                <span className={`font-semibold ml-auto ${day.entry ? 'text-text-primary' : 'text-text-disabled'}`}>{day.day}</span>
                                {day.entry && (
                                    <p className="text-xs text-text-secondary overflow-hidden text-ellipsis mt-1">
                                        {day.entry.substring(0, 80)}{day.entry.length > 80 && '...'}
                                    </p>
                                )}
                            </button>
                        )
                    ))}
                </div>
            </Card>
            {selectedEntry && <JournalEntryModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />}
        </div>
    );
};

const JournalTracker: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('editor');
    const trackerInfo = TRACKERS.find(t => t.id === 'journal')!;
    
    return (
        <TrackerWrapper tracker={trackerInfo}>
            <div className="flex border-b border-border mb-6">
                <button
                    onClick={() => setActiveTab('editor')}
                    className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'editor' ? 'border-b-2 border-accent-primary text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                >
                    Today's Entry
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'history' ? 'border-b-2 border-accent-primary text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                >
                    History
                </button>
            </div>

            {activeTab === 'editor' ? <JournalEditor /> : <JournalHistory />}
        </TrackerWrapper>
    );
};

export default JournalTracker;
