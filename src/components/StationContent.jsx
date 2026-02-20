import { useState, useEffect } from 'react';
import { marked } from 'marked';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';

const StationContent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

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

        const stationNum = parseInt(id, 10);
        const fetchStation = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`stations/${stationNum}.md`);
                if (!response.ok) {
                    throw new Error(`Failed to load station ${stationNum}`);
                }
                const text = await response.text();
                const parsedMarkdown = marked.parse(text);
                const sanitizedContent = DOMPurify.sanitize(parsedMarkdown);
                setContent(sanitizedContent);
                setZoomedImage(null); // Reset zoom on station change
            } catch (err) {
                setError('Erro ao carregar a estação.', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStation();
    }, [id]);

    const handleContentClick = (e) => {
        if (e.target.tagName === 'IMG') {
            const imgSrc = e.target.src;
            // Validate that the src is a valid relative or absolute URL
            if (imgSrc && (imgSrc.startsWith('/') || imgSrc.startsWith('http'))) {
                setZoomedImage(imgSrc);
            }
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>A carregar...</div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;
    }

    if (!id) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Estação não encontrada.</p>
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    style={{ marginTop: '1rem' }}
                >
                    Voltar ao início
                </button>
            </div>
        );
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
