import React, { useState, useContext, useRef, useMemo, useEffect } from 'react';
import { DataContext } from '../../context/DataContext';
import { TRACKERS } from '../../constants';
import TrackerWrapper from '../TrackerWrapper';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { journalService } from '../../api/journalService';

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

const JournalEditor: React.FC<{ targetDate: string }> = ({ targetDate }) => {
    const { data, setData } = useContext(DataContext);
    const entryData = data[targetDate] || { journal: '', points: 0 };
    const [text, setText] = useState(entryData.journal || '');
    const [feedback, setFeedback] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Update local text state when targetDate changes
    useEffect(() => {
        setText(entryData.journal || '');
    }, [targetDate]);

    // Update local text if data loads and text is empty (avoid overwriting user input)
    useEffect(() => {
        if (entryData.journal && text === '') {
            setText(entryData.journal);
        }
    }, [entryData.journal]);

    const handleSave = async () => {
        try {
            await journalService.saveEntry(targetDate, text);
            setData(prev => ({ ...prev, [targetDate]: { ...entryData, journal: text } }));
            setFeedback('Saved successfully!');
            setTimeout(() => setFeedback(''), 2000);
        } catch (error) {
            console.error(error);
            setFeedback('Failed to save.');
            setTimeout(() => setFeedback(''), 2000);
        }
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
                    <h3 className="font-bold text-lg">Editor ({targetDate})</h3>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => applyMarkdown('bold')} className="px-3 py-1 bg-[rgba(15,10,30,0.6)] rounded font-bold">B</button>
                        <button onClick={() => applyMarkdown('italic')} className="px-3 py-1 bg-[rgba(15,10,30,0.6)] rounded italic">I</button>
                        <button onClick={() => applyMarkdown('h3')} className="px-3 py-1 bg-[rgba(15,10,30,0.6)] rounded">H3</button>
                    </div>
                </div>
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    rows={15}
                    className="w-full p-3 rounded-md bg-[rgba(15,10,30,0.6)] border border-[rgba(139,92,246,0.35)] text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    placeholder="What's on your mind?"
                />
                <div className="flex justify-between items-center mt-4">
                    <span className={`text-sm h-5 ${feedback.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>{feedback}</span>
                    <Button onClick={handleSave}>Save</Button>
                </div>
            </Card>
            <Card>
                <h3 className="font-bold text-lg mb-4">Preview</h3>
                <div
                    className="prose prose-invert prose-sm max-w-none h-[330px] overflow-y-auto p-3 bg-[rgba(15,10,30,0.6)] rounded-md"
                    dangerouslySetInnerHTML={parseMarkdown(text)}
                />
            </Card>
        </div>
    );
};

const JournalEntryModal: React.FC<{
    entry: { date: string, journal: string },
    onClose: () => void,
    onEdit: (date: string) => void
}> = ({ entry, onClose, onEdit }) => {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-[rgba(15,10,30,0.75)] p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-xl text-white">
                        {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h4>
                    <Button onClick={() => onEdit(entry.date)} className="bg-accent-primary text-white px-4 py-1 text-sm">
                        Edit
                    </Button>
                </div>
                <div
                    className="prose prose-invert prose-sm max-w-none overflow-y-auto pr-4 -mr-4"
                    dangerouslySetInnerHTML={parseMarkdown(entry.journal)}
                />
                <Button onClick={onClose} className="mt-6 ml-auto">Close</Button>
            </div>
        </div>
    );
}

const JournalHistory: React.FC<{ onEditDate: (date: string) => void }> = ({ onEditDate }) => {
    const { data } = useContext(DataContext);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEntry, setSelectedEntry] = useState<{ date: string, journal: string } | null>(null);

    useEffect(() => {
        console.log('JournalHistory - data context updated:', data);
        console.log('JournalHistory - data keys:', Object.keys(data));
    }, [data]);

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

        console.log('Building calendar grid for:', year, month + 1);
        console.log('Available data keys:', Object.keys(data));

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({ key: `pad-start-${i}`, empty: true });
        }
        for (let day = 1; day <= daysInMonth; day++) {
            // Use local date string construction to match visual date
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const journalContent = data[dateString]?.journal;

            if (journalContent) {
                console.log(`Found journal for ${dateString}:`, journalContent.substring(0, 50));
            }

            days.push({
                key: dateString,
                day,
                dateString,
                entry: journalContent,
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
        } else {
            // If no entry exists, go straight to edit
            onEditDate(dateString);
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
                            className="p-2 rounded-md bg-[rgba(15,10,30,0.6)] border border-[rgba(139,92,246,0.35)] text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        >
                            {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
                        </select>
                        <select
                            value={currentDate.getFullYear()}
                            onChange={(e) => handleDateChange(parseInt(e.target.value), undefined)}
                            className="p-2 rounded-md bg-[rgba(15,10,30,0.6)] border border-[rgba(139,92,246,0.35)] text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <h3 className="font-bold text-lg hidden md:block">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                    {DAY_NAMES.map(day => <div key={day} className="font-semibold text-[#e9d5ff] text-sm p-2">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {calendarGrid.map(day => (
                        day.empty ? <div key={day.key}></div> : (
                            <button
                                key={day.key}
                                onClick={() => handleDayClick(day.dateString!)}
                                className={`h-28 rounded-lg flex flex-col p-2 text-left transition-colors border ${day.entry ? 'bg-[rgba(15,10,30,0.75)] border-[rgba(139,92,246,0.35)] hover:bg-border hover:border-accent-primary cursor-pointer' : 'bg-[rgba(15,10,30,0.6)]/50 border-transparent hover:border-accent-primary cursor-pointer'
                                    }`}
                            >
                                <span className={`font-semibold ml-auto ${day.entry ? 'text-white' : 'text-[#71717a]'}`}>{day.day}</span>
                                {day.entry && (
                                    <p className="text-xs text-[#e9d5ff] overflow-hidden text-ellipsis mt-1">
                                        {day.entry?.substring(0, 80)}{(day.entry?.length || 0) > 80 && '...'}
                                    </p>
                                )}
                            </button>
                        )
                    ))}
                </div>
            </Card>
            {selectedEntry && (
                <JournalEntryModal
                    entry={selectedEntry}
                    onClose={() => setSelectedEntry(null)}
                    onEdit={(date) => {
                        setSelectedEntry(null);
                        onEditDate(date);
                    }}
                />
            )}
        </div>
    );
};

const JournalTracker: React.FC = () => {
    const { setData, today } = useContext(DataContext);
    const [activeTab, setActiveTab] = useState<Tab>('editor');
    const [targetDate, setTargetDate] = useState(today);
    const trackerInfo = TRACKERS.find(t => t.id === 'journal')!;

    useEffect(() => {
        // Update targetDate to today when component mounts or today changes
        setTargetDate(today);
    }, [today]);

    useEffect(() => {
        const fetchJournalData = async () => {
            try {
                const entries = await journalService.getAllEntries();
                console.log('Fetched journal entries:', entries);
                if (entries && entries.length > 0) {
                    setData(prev => {
                        const newData = { ...prev };
                        entries.forEach(entry => {
                            // Ensure date is in YYYY-MM-DD format
                            const dateKey = entry.date;
                            console.log(`Processing entry for date: ${dateKey}, content length: ${entry.content?.length || 0}`);

                            if (!newData[dateKey]) {
                                newData[dateKey] = { journal: entry.content || '' };
                            } else {
                                newData[dateKey] = { ...newData[dateKey], journal: entry.content || '' };
                            }
                        });
                        console.log('Updated data with journal entries:', newData);
                        return newData;
                    });
                }
            } catch (error) {
                console.error("Failed to load journal entries", error);
            }
        };
        fetchJournalData();
    }, [setData]);

    const handleEditDate = (date: string) => {
        setTargetDate(date);
        setActiveTab('editor');
    };

    return (
        <TrackerWrapper tracker={trackerInfo}>
            <div className="flex border-b border-[rgba(139,92,246,0.35)] mb-6">
                <button
                    onClick={() => {
                        setActiveTab('editor');
                        setTargetDate(today); // Reset to today when clicking tab? Or keep selected? 
                        // Usually "Today's Entry" implies today.
                    }}
                    className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'editor' ? 'border-b-2 border-accent-primary text-white' : 'text-[#e9d5ff] hover:text-white'}`}
                >
                    Editor
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'history' ? 'border-b-2 border-accent-primary text-white' : 'text-[#e9d5ff] hover:text-white'}`}
                >
                    History
                </button>
            </div>

            {activeTab === 'editor' ? <JournalEditor targetDate={targetDate} /> : <JournalHistory onEditDate={handleEditDate} />}
        </TrackerWrapper>
    );
};

export default JournalTracker;
