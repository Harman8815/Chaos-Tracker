import { v4 as uuidv4 } from 'uuid';
import { QuoteSource } from '../types';

export const DUMMY_QUOTES: QuoteSource[] = [
    {
        id: 'bleach',
        title: 'Bleach',
        type: 'Web Series',
        coverImage: 'https://placehold.co/400x600/0a0a0a/7c3aed/png?text=Bleach',
        quotes: [
            { id: uuidv4(), text: "If miracles only happen once, what are they called the second time?", author: "Ichigo Kurosaki", tags: ["philosophy", "determination"] },
            { id: uuidv4(), text: "Fear is not evil. It tells you what your weakness is. And once you know your weakness, you can become stronger as well as kinder.", author: "Gildarts Clive", tags: ["fear", "strength"] },
            { id: uuidv4(), text: "Arrogance destroys the footholds of victory.", author: "Byakuya Kuchiki", tags: ["wisdom", "warning"] },
            { id: uuidv4(), text: "We are all like fireworks: we climb, we shine and always go our separate ways and become further apart. But even when that time comes, let's not disappear like a firework and continue to shine... forever.", author: "Toshiro Hitsugaya", tags: ["friendship", "philosophy"] },
            { id: uuidv4(), text: "There is no such thing as 'truth' or 'lies' in this world; there never has been. There is only plain, hard facts. And yet, all beings who exist in this world take only those 'facts' that are convenient to them, and take them to be the 'truth'.", author: "Sosuke Aizen", tags: ["philosophy", "truth"] },
        ]
    },
    {
        id: 'the-office',
        title: 'The Office',
        type: 'Web Series',
        coverImage: 'https://placehold.co/400x600/0a0a0a/7c3aed/png?text=The+Office',
        quotes: [
            { id: uuidv4(), text: "Would I rather be feared or loved? Easy. Both. I want people to be afraid of how much they love me.", author: "Michael Scott", tags: ["funny", "love"] },
            { id: uuidv4(), text: "I'm not superstitious, but I am a little stitious.", author: "Michael Scott", tags: ["funny", "superstition"] },
            { id: uuidv4(), text: "Bears. Beets. Battlestar Galactica.", author: "Jim Halpert", tags: ["funny", "impersonation"] },
            { id: uuidv4(), text: "Identity theft is not a joke, Jim! Millions of families suffer every year!", author: "Dwight Schrute", tags: ["funny", "warning"] },
        ]
    },
    {
        id: 'breaking-bad',
        title: 'Breaking Bad',
        type: 'Web Series',
        coverImage: 'https://placehold.co/400x600/0a0a0a/7c3aed/png?text=Breaking+Bad',
        quotes: [
            { id: uuidv4(), text: "I am not in danger, Skyler. I am the danger.", author: "Walter White", tags: ["power", "iconic", "danger"] },
            { id: uuidv4(), text: "Say my name.", author: "Walter White", tags: ["power", "iconic"] },
            { id: uuidv4(), text: "Yeah, bitch! Magnets!", author: "Jesse Pinkman", tags: ["funny", "science"] },
            { id: uuidv4(), text: "No more half measures.", author: "Mike Ehrmantraut", tags: ["wisdom", "determination", "warning"] },
        ]
    },
    {
        id: 'interstellar',
        title: 'Interstellar',
        type: 'Movie',
        coverImage: 'https://placehold.co/400x600/0a0a0a/7c3aed/png?text=Interstellar',
        quotes: [
            { id: uuidv4(), text: "Do not go gentle into that good night; Old age should burn and rave at close of day. Rage, rage against the dying of the light.", author: "Professor Brand", tags: ["poetry", "determination", "hope"] },
            { id: uuidv4(), text: "We used to look up at the sky and wonder at our place in the stars. Now we just look down and worry about our place in the dirt.", author: "Cooper", tags: ["humanity", "philosophy"] },
            { id: uuidv4(), text: "Love is the one thing we're capable of perceiving that transcends dimensions of time and space.", author: "Amelia Brand", tags: ["love", "philosophy", "science"] },
        ]
    }
];