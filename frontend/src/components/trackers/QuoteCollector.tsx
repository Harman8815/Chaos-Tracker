import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Quote, QuoteSource } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import quoteService, { SearchResult } from '../../services/quoteService';

// --- Helper Components ---
const HighlightText: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
    if (!highlight.trim()) return <>{text}</>;
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'));
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ?
                    <span key={i} className="bg-accent-primary/30 text-accent-primary font-bold rounded px-0.5">{part}</span> :
                    part
            )}
        </>
    );
};

// --- Icons ---
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const BackIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="15 18 9 12 15 6"></polyline></svg>
);
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);
const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);


// --- Modals ---
const SourceModal: React.FC<{ source?: QuoteSource | null; onClose: () => void; onSave: (source: QuoteSource) => void; }> = ({ source, onClose, onSave }) => {
    const [title, setTitle] = useState(source?.title || '');
    const [type, setType] = useState<QuoteSource['type']>(source?.type || 'Movie');
    const [coverImage, setCoverImage] = useState(source?.coverImage || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !coverImage) return;
        onSave({
            id: source?.id || uuidv4(),
            title,
            type,
            coverImage,
            quotes: source?.quotes || []
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-card-bg p-8 rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6">{source ? 'Edit' : 'Add'} Source</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 rounded-md bg-input-bg border border-border" required />
                    <select value={type} onChange={e => setType(e.target.value as QuoteSource['type'])} className="w-full p-2 rounded-md bg-input-bg border border-border">
                        <option>Movie</option>
                        <option>Web Series</option>
                        <option>Book</option>
                    </select>
                    <input placeholder="Cover Image URL" value={coverImage} onChange={e => setCoverImage(e.target.value)} className="w-full p-2 rounded-md bg-input-bg border border-border" required />
                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" onClick={onClose} className="bg-input-bg text-text-primary hover:bg-border">Cancel</Button>
                        <Button type="submit">Save Source</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const QuoteModal: React.FC<{ quote?: Quote | null; onClose: () => void; onSave: (quote: Quote) => void; }> = ({ quote, onClose, onSave }) => {
    const [text, setText] = useState(quote?.text || '');
    const [author, setAuthor] = useState(quote?.author || '');
    const [tags, setTags] = useState(quote?.tags?.join(', ') || '');
    const [image, setImage] = useState(quote?.image || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text || !author) return;
        onSave({
            id: quote?.id || uuidv4(),
            text,
            author,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            image: image.trim() || undefined,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-card-bg p-8 rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6">{quote ? 'Edit' : 'Add'} Quote</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea placeholder="Quote text..." value={text} onChange={e => setText(e.target.value)} className="w-full p-2 rounded-md bg-input-bg border border-border h-24" required />
                    <input placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} className="w-full p-2 rounded-md bg-input-bg border border-border" required />
                    <input placeholder="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} className="w-full p-2 rounded-md bg-input-bg border border-border" />
                    <input placeholder="Optional Image URL" value={image} onChange={e => setImage(e.target.value)} className="w-full p-2 rounded-md bg-input-bg border border-border" />
                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" onClick={onClose} className="bg-input-bg text-text-primary hover:bg-border">Cancel</Button>
                        <Button type="submit">Save Quote</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Component ---

const QuoteCollector: React.FC = () => {
    const [allSources, setAllSources] = useState<QuoteSource[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSearch, setActiveSearch] = useState('');
    const [selectedSource, setSelectedSource] = useState<QuoteSource | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [modalState, setModalState] = useState<{
        source?: QuoteSource | null;
        quote?: Quote | null;
    } | null>(null);

    const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Debounced search for suggestions
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length >= 2 && !activeSearch) {
                try {
                    const results = await quoteService.fuzzySearchQuotes(searchQuery, 5);
                    setSuggestions(results);
                    setShowSuggestions(true);
                } catch (err) {
                    // Silent fail for suggestions
                }
            } else {
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, activeSearch]);

    const handleSuggestionClick = (result: SearchResult) => {
        setSelectedSource(result.source);
        setSuggestions([]);
        setShowSuggestions(false);
        setSearchQuery('');
    };

    // Fetch all sources on mount
    useEffect(() => {
        const fetchSources = async () => {
            try {
                setLoading(true);
                const sources = await quoteService.getAllQuoteSources({ include_quotes: true });
                setAllSources(sources);
            } catch (err) {
                console.error('Failed to load quote sources:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSources();
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchQuery.trim() || searchQuery.trim().length < 2) {
            setError('Search query must be at least 2 characters');
            setTimeout(() => setError(null), 3000);
            return;
        }

        try {
            setLoading(true);
            setActiveSearch(searchQuery);
            setSelectedSource(null);

            // Use fuzzy search API
            const results = await quoteService.fuzzySearchQuotes(searchQuery, 20);

            // Extract sources from search results
            const sources = results.map(result => result.source);
            setAllSources(sources);
        } catch (err) {
            console.error('Search failed:', err);
            setError('Search failed');
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const resetToHome = async () => {
        setSearchQuery('');
        setActiveSearch('');
        setSelectedSource(null);

        // Reload all sources
        try {
            setLoading(true);
            const sources = await quoteService.getAllQuoteSources({ include_quotes: true });
            setAllSources(sources);
        } catch (err) {
            console.error('Failed to reload sources:', err);
        } finally {
            setLoading(false);
        }
    };

    const searchResults = useMemo(() => {
        if (!activeSearch) return [];
        return allSources;
    }, [activeSearch, allSources]);

    const groupedQuotes: Record<string, Quote[]> = useMemo(() => {
        const groups: Record<string, Quote[]> = {};
        if (selectedSource) {
            selectedSource.quotes.forEach(quote => {
                const tags = quote.tags.length > 0 ? quote.tags : ['Uncategorized'];
                tags.forEach(tag => {
                    const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
                    if (!groups[capitalizedTag]) {
                        groups[capitalizedTag] = [];
                    }
                    groups[capitalizedTag].push(quote);
                });
            });
        }
        return groups;
    }, [selectedSource]);

    // --- CRUD Operations ---
    const handleSaveSource = useCallback(async (sourceToSave: QuoteSource) => {
        try {
            setLoading(true);
            const exists = allSources.some(s => s.id === sourceToSave.id);

            if (exists) {
                // Update existing source
                await quoteService.updateQuoteSource(sourceToSave.id, {
                    title: sourceToSave.title,
                    type: sourceToSave.type,
                    coverImage: sourceToSave.coverImage,
                });
            } else {
                // Create new source
                await quoteService.createQuoteSource(sourceToSave);
            }

            // Refresh sources
            const sources = await quoteService.getAllQuoteSources({ include_quotes: true });
            setAllSources(sources);

            setModalState(null);

            if (selectedSource?.id === sourceToSave.id) {
                const updated = await quoteService.getQuoteSource(sourceToSave.id);
                setSelectedSource(updated);
            }
        } catch (err) {
            console.error('Failed to save source:', err);
            setError('Failed to save source');
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    }, [allSources, selectedSource]);

    const handleDeleteSource = async (sourceId: string) => {
        if (!window.confirm("Are you sure you want to delete this entire source and all its quotes?")) {
            return;
        }

        try {
            setLoading(true);
            await quoteService.deleteQuoteSource(sourceId);

            // Refresh sources
            const sources = await quoteService.getAllQuoteSources({ include_quotes: true });
            setAllSources(sources);

            resetToHome();
        } catch (err) {
            console.error('Failed to delete source:', err);
            setError('Failed to delete source');
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveQuote = useCallback(async (quoteToSave: Quote) => {
        if (!selectedSource) return;

        try {
            setLoading(true);

            const quoteExists = selectedSource.quotes.some(q => q.id === quoteToSave.id);

            if (quoteExists) {
                // Update existing quote
                await quoteService.updateQuote(quoteToSave.id, {
                    text: quoteToSave.text,
                    author: quoteToSave.author,
                    tags: quoteToSave.tags,
                    image: quoteToSave.image,
                });
            } else {
                // Create new quote
                await quoteService.createQuote(selectedSource.id, quoteToSave);
            }

            // Refresh the source
            const updatedSource = await quoteService.getQuoteSource(selectedSource.id);
            setSelectedSource(updatedSource);

            // Update in allSources
            setAllSources(prev =>
                prev.map(s => s.id === updatedSource.id ? updatedSource : s)
            );

            setModalState(null);
        } catch (err) {
            console.error('Failed to save quote:', err);
            setError('Failed to save quote');
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    }, [selectedSource]);

    const handleDeleteQuote = async (quoteId: string) => {
        if (!selectedSource || !window.confirm("Delete this quote?")) return;

        try {
            setLoading(true);
            await quoteService.deleteQuote(quoteId);

            // Refresh the source
            const updatedSource = await quoteService.getQuoteSource(selectedSource.id);
            setSelectedSource(updatedSource);

            // Update in allSources
            setAllSources(prev =>
                prev.map(s => s.id === updatedSource.id ? updatedSource : s)
            );
        } catch (err) {
            console.error('Failed to delete quote:', err);
            setError('Failed to delete quote');
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    // --- Render Logic ---

    if (selectedSource) {
        return (
            <div className="p-6 h-full overflow-y-auto animate-fade-in relative">
                {modalState?.quote !== undefined && <QuoteModal quote={modalState.quote} onClose={() => setModalState(null)} onSave={handleSaveQuote} />}
                {modalState?.source !== undefined && <SourceModal source={modalState.source} onClose={() => setModalState(null)} onSave={handleSaveSource} />}
                {error && (
                    <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
                        {error}
                    </div>
                )}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <Button onClick={resetToHome} className="bg-input-bg text-text-primary hover:bg-border mr-2 !p-0 w-12 h-12 flex items-center justify-center"><HomeIcon className="w-6 h-6" /></Button>
                        <Button onClick={() => setSelectedSource(null)} className="bg-input-bg text-text-primary hover:bg-border">
                            <BackIcon className="inline-block -ml-1 mr-2 w-5 h-5" />
                            Back to Results
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                    <img src={selectedSource.coverImage} alt={selectedSource.title} className="w-48 rounded-lg shadow-lg object-cover aspect-[2/3]" />
                    <div className="flex-grow">
                        <h1 className="text-4xl font-bold">{selectedSource.title}</h1>
                        <p className="text-text-secondary mb-4">{selectedSource.type}</p>
                        <div className="flex gap-2">
                            <Button onClick={() => setModalState({ quote: null })} className="flex items-center"><PlusIcon className="mr-2" /> Add Quote</Button>
                            <Button onClick={() => setModalState({ source: selectedSource })} className="bg-input-bg text-text-primary hover:bg-border">Edit Source</Button>
                            <Button onClick={() => handleDeleteSource(selectedSource.id)} className="bg-red-500/20 text-red-400 hover:bg-red-500/40">Delete Source</Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {Object.entries(groupedQuotes).map(([tag, quotes]) => (
                        <div key={tag}>
                            <h2 className="text-2xl font-bold text-accent-primary mb-4 pb-2 border-b-2 border-accent-primary/30">{tag}</h2>
                            <div className="space-y-4">
                                {quotes.map(quote => (
                                    <blockquote key={quote.id} className="p-4 border-l-4 border-border bg-card-bg rounded-r-lg shadow-sm group relative">
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setModalState({ quote })} className="p-1 rounded bg-input-bg hover:bg-border"><EditIcon /></button>
                                            <button onClick={() => handleDeleteQuote(quote.id)} className="p-1 rounded bg-input-bg hover:bg-border text-red-400"><TrashIcon /></button>
                                        </div>
                                        {quote.image && <img src={quote.image} alt={`Visual for "${quote.text}"`} className="w-full h-auto max-h-64 object-contain rounded-lg mb-4" />}
                                        <p className="text-lg italic text-text-primary">"{quote.text}"</p>
                                        <cite className="block text-right mt-2 text-text-secondary not-italic">&mdash; {quote.author}</cite>
                                    </blockquote>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (activeSearch) {
        return (
            <div className="p-6 h-full overflow-y-auto animate-fade-in relative">
                {error && (
                    <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
                        {error}
                    </div>
                )}
                <div className="flex justify-between items-center mb-6 sticky top-0 z-10 py-4 bg-background -mt-6 -mx-6 px-6">
                    <Button onClick={resetToHome} className="bg-input-bg text-text-primary hover:bg-border !p-0 w-12 h-12 flex items-center justify-center">
                        <HomeIcon className="w-6 h-6" />
                    </Button>
                    <form onSubmit={handleSearch} className="flex-grow ml-4">
                        <div className="relative">
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search again..." className="w-full p-3 pl-12 rounded-lg bg-input-bg border border-border" />
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-text-secondary" />
                        </div>
                    </form>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {searchResults.length > 0 ? searchResults.map(source => (
                        <Card key={source.id} onClick={() => setSelectedSource(source)} className="p-0 overflow-hidden cursor-pointer group">
                            <img src={source.coverImage} alt={source.title} className="w-full h-auto object-cover aspect-[2/3] transition-transform duration-300 group-hover:scale-105" />
                            <div className="p-4">
                                <h3 className="font-bold text-lg truncate">{source.title}</h3>
                                <p className="text-sm text-text-secondary">{source.quotes.length} quotes</p>
                            </div>
                        </Card>
                    )) : (
                        <div className="col-span-full text-center py-16">
                            <h3 className="text-2xl font-bold">No Results Found</h3>
                            <p className="text-text-secondary">Try searching for something else, or create a new source.</p>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <>
            {modalState?.source !== undefined && <SourceModal source={modalState.source} onClose={() => setModalState(null)} onSave={handleSaveSource} />}
            {error && (
                <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
                    {error}
                </div>
            )}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
                    <div className="bg-card-bg p-6 rounded-lg">
                        <p className="text-lg">Loading...</p>
                    </div>
                </div>
            )}
            <div className="w-full h-full flex flex-col items-center justify-center p-4 quote-bg relative overflow-hidden">
                <div id="stars"></div><div id="stars2"></div><div id="stars3"></div>
                <div className="relative z-10 flex flex-col items-center justify-center text-center">
                    <h1 className="text-5xl font-bold text-white mb-4" style={{ textShadow: '0 0 15px rgba(124, 58, 237, 0.7), 0 0 30px rgba(124, 58, 237, 0.5)' }}>Quote Collector</h1>
                    <p className="text-text-secondary mb-8 max-w-lg">Search for quotes from your favorite sources, or create your own collection.</p>
                    <div className="flex items-center gap-4">
                        <div className="w-full max-w-xl relative">
                            <form onSubmit={handleSearch} className="w-full">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                        placeholder="Search 'Bleach', 'funny', 'Interstellar'..."
                                        className="w-full p-5 pl-14 rounded-full bg-background/50 border-2 border-border backdrop-blur-sm text-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-black"
                                    />
                                    <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-text-secondary" />
                                </div>
                            </form>
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-card-bg rounded-xl shadow-2xl border border-border overflow-hidden z-50 animate-fade-in max-h-96 overflow-y-auto">
                                    {suggestions.map((result, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleSuggestionClick(result)}
                                            className="p-3 hover:bg-input-bg cursor-pointer border-b border-border last:border-0 transition-colors flex items-start gap-3"
                                        >
                                            <img src={result.source.coverImage} alt="" className="w-12 h-16 object-cover rounded-md shadow-sm flex-shrink-0" />
                                            <div className="flex-grow min-w-0">
                                                <h4 className="font-bold text-text-primary truncate">
                                                    <HighlightText text={result.source.title} highlight={searchQuery} />
                                                </h4>
                                                <p className="text-xs text-text-secondary mb-1">{result.source.type}</p>

                                                {result.match_type === 'quote' && result.matched_quotes.length > 0 && (
                                                    <p className="text-sm text-text-secondary line-clamp-2 italic">
                                                        "...<HighlightText text={result.matched_quotes[0].text} highlight={searchQuery} />..."
                                                    </p>
                                                )}
                                                {result.match_type === 'author' && result.matched_quotes.length > 0 && (
                                                    <p className="text-sm text-text-secondary">
                                                        Author: <HighlightText text={result.matched_quotes[0].author} highlight={searchQuery} />
                                                    </p>
                                                )}
                                                {result.match_type === 'tag' && result.matched_quotes.length > 0 && (
                                                    <p className="text-sm text-text-secondary">
                                                        Tag: <HighlightText text={result.matched_quotes[0].tags.find(t => t.toLowerCase().includes(searchQuery.toLowerCase())) || ''} highlight={searchQuery} />
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <Button onClick={() => setModalState({ source: null })} className="!p-0 w-16 h-16 flex items-center justify-center rounded-full" title="Add New Source"><PlusIcon className="w-8 h-8" /></Button>
                    </div>
                </div>
            </div>
            <style>{`.quote-bg{background:#000;background:radial-gradient(ellipse at bottom,var(--color-background) 0%,#090a0f 100%)}@keyframes animate-stars{from{transform:translateY(0)}to{transform:translateY(-2000px)}}#stars,#stars2,#stars3{position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;display:block}#stars{background:transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000"><circle cx="100" cy="100" r="1.5" fill="white"/><circle cx="300" cy="400" r="1" fill="white"/><circle cx="600" cy="200" r="1.2" fill="white"/><circle cx="900" cy="500" r="0.8" fill="white"/><circle cx="1200" cy="300" r="1.5" fill="white"/><circle cx="1500" cy="600" r="1" fill="white"/><circle cx="1800" cy="100" r="1.2" fill="white"/></svg>') repeat;animation:animate-stars 50s linear infinite}#stars2{background:transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000"><circle cx="200" cy="300" r="1" fill="white"/><circle cx="500" cy="100" r="0.8" fill="white"/><circle cx="800" cy="400" r="1.1" fill="white"/><circle cx="1100" cy="600" r="0.9" fill="white"/><circle cx="1400" cy="200" r="1" fill="white"/><circle cx="1700" cy="500" r="0.8" fill="white"/><circle cx="1900" cy="300" r="1.1" fill="white"/></svg>') repeat;animation:animate-stars 100s linear infinite}#stars3{background:transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000"><circle cx="400" cy="500" r="0.6" fill="white"/><circle cx="700" cy="300" r="0.7" fill="white"/><circle cx="1000" cy="100" r="0.5" fill="white"/><circle cx="1300" cy="400" r="0.6" fill="white"/><circle cx="1600" cy="200" r="0.7" fill="white"/><circle cx="1900" cy="600" r="0.5" fill="white"/></svg>') repeat;animation:animate-stars 150s linear infinite}`}</style>
        </>
    );
};

export default QuoteCollector;
