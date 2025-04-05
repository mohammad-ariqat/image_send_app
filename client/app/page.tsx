"use client";
import { useState, useEffect } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export default function Home() {
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [csrfToken, setCsrfToken] = useState<string | null>(null);

    // Fetch CSRF token on component mount
    useEffect(() => {
        const getCsrfToken = async () => {
            try {
                const response = await fetch('http://localhost:8000/csrf-token');
                const data = await response.json();
                setCsrfToken(data.csrf_token);
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };

        getCsrfToken();

        // Set up Pusher/Echo
        (window as any).Pusher = Pusher;
        const echo = new Echo({
            broadcaster: 'reverb',
            key: 'app-key',
            wsHost: 'localhost',
            wsPort: 8080,
            wssPort: 8080,
            forceTLS: false,
            enabledTransports: ['ws'],
        });

        echo.channel('images').listen('ImageUploaded', (e: { imagePath: string }) => {
            setImageUrl(`http://localhost/storage/${e.imagePath}`);
        });

        return () => {
            echo.leave('images');
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image || !csrfToken) return;

        const formData = new FormData();
        formData.append('image', image);

        try {
            const res = await fetch('http://localhost:8000/images', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': csrfToken,  // Pass the CSRF token in the headers
                },
                credentials: 'same-origin',
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            setImageUrl(`http://localhost:8000/storage/${data.path}`);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
                <button type="submit">Upload</button>
            </form>
            {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '500px' }} />}
        </div>
    );
}
