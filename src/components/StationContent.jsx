import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { useParams, useNavigate } from 'react-router-dom';

const StationContent = ({ onStart }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const stationNum = id ? parseInt(id, 10) : 0;

    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [zoomedImage, setZoomedImage] = useState(null);

    useEffect(() => {
        if (!id) {
            setContent('');
            setZoomedImage(null);
            return;
        }

        const fetchStation = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/stations/${stationNum}.md`);
                if (!response.ok) {
                    throw new Error(`Failed to load station ${stationNum}`);
                }
                const text = await response.text();
                setContent(marked.parse(text));
                setZoomedImage(null); // Reset zoom on station change
            } catch (err) {
                console.error(err);
                setError('Erro ao carregar a estação.');
            } finally {
                setLoading(false);
            }
        };

        fetchStation();
    }, [stationNum, id]);

    const handleContentClick = (e) => {
        if (e.target.tagName === 'IMG') {
            setZoomedImage(e.target.src);
        }
    };

    if (!id) {
        return (
            <div className="welcome-screen">
                <h3>Bem-vindo à Via Sacra</h3>
                <p>Jovens Santos que nos inspiram.</p>
                <button className="btn-start" onClick={() => navigate('/station/1')}>
                    Iniciar Via Sacra
                </button>
            </div>
        );
    }

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>A carregar...</div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;
    }

    return (
        <>
            <div
                className="station-content"
                dangerouslySetInnerHTML={{ __html: content }}
                onClick={handleContentClick}
            />

            {zoomedImage && (
                <div className="image-overlay" onClick={() => setZoomedImage(null)}>
                    <div className="overlay-content">
                        <img src={zoomedImage} alt="Zoomed" />
                        <button className="close-overlay">✕</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default StationContent;
