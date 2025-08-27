import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useProfilePhoto = (filename: string | undefined) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!filename) {
      setPhotoUrl(null);
      return;
    }

    const fetchPhoto = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch the image with authentication
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/users/photo?filename=${filename}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch photo: ${response.status}`);
        }

        // Convert the response to a blob
        const blob = await response.blob();
        
        // Create a data URL from the blob
        const dataUrl = URL.createObjectURL(blob);
        setPhotoUrl(dataUrl);
      } catch (err) {
        console.error('Error fetching profile photo:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch photo');
        setPhotoUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoto();

    // Cleanup function to revoke the object URL when component unmounts
    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [filename]);

  return { photoUrl, loading, error };
};
