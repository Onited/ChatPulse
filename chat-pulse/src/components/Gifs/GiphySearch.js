import React, { useState } from 'react';

const GiphySearch = ({ onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [gifs, setGifs] = useState([]);

    const fetchGifs = async (query) => {
        const apiKey = 'SuI14JxEm3ZL4qfNupRIeJW7dyoIrUdN';
        const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(query)}&limit=10`;

        try {
            const response = await fetch(url);
            const { data } = await response.json();
            setGifs(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des GIFs:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchGifs(searchTerm);
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher un GIF"
                />
                <button type="submit">Rechercher</button>
            </form>
            <div>
                {gifs.map(gif => (
                    <img 
                        key={gif.id} 
                        src={gif.images.fixed_height.url} 
                        alt={gif.title}
                        onClick={() => onSelect(gif)}
                    />
                ))}
            </div>
        </div>
    );
};

export default GiphySearch;
