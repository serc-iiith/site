import React, { useState, useEffect, useCallback } from 'react';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface ImageDropzoneProps {
    onImageUpload: (file: File) => void;
    currentImage?: string;
    isLoading: boolean;
    fallbackImage?: string;
    roundedFull?: boolean;
    maxSize?: number; // in MB
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
    onImageUpload,
    currentImage,
    isLoading,
    fallbackImage = '/images/person_fallback.png',
    roundedFull = false,
    maxSize = 5
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        // Clear the preview when the component unmounts
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files) {
            setIsDragging(true);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            // Check if file is an image
            if (!file.type.match('image.*')) {
                toast.error('Please upload an image file');
                return;
            }

            // Check file size
            if (file.size > maxSize * 1024 * 1024) {
                toast.error(`Image size must be less than ${maxSize}MB`);
                return;
            }

            // Create preview
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(URL.createObjectURL(file));

            // Pass the file to parent component
            onImageUpload(file);
        }
    }, [onImageUpload, previewUrl, maxSize]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Check file size
            if (file.size > maxSize * 1024 * 1024) {
                toast.error(`Image size must be less than ${maxSize}MB`);
                return;
            }

            // Create preview
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(URL.createObjectURL(file));

            // Pass the file to parent component
            onImageUpload(file);
        }
    }, [onImageUpload, previewUrl, maxSize]);

    // Decide what image to show
    const imageToShow = previewUrl || currentImage || fallbackImage;

    return (
        <div
            className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${isDragging
                ? 'border-[color:var(--primary-color)] bg-[color:var(--primary-color)] bg-opacity-10'
                : 'border-[color:var(--border-color)] hover:border-[color:var(--primary-color)]'
                }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                id="image-upload"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
                disabled={isLoading}
            />

            <div className={`mb-4 relative mx-auto w-32 h-32 overflow-hidden ${roundedFull ? 'rounded-full' : 'rounded-md'} bg-gray-100`}>
                <Image
                    src={imageToShow}
                    alt="Image preview"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    unoptimized={true}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== window.location.origin + fallbackImage) {
                            target.src = fallbackImage;
                        }
                    }}
                />
            </div>

            <label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex items-center justify-center gap-2 py-2 px-4 bg-[color:var(--background)] border border-[color:var(--border-color)] rounded-md text-[color:var(--text-color)] hover:bg-[color:var(--hover-bg)] transition-colors"
            >
                <Upload size={16} /> Choose Image
            </label>

            <p className="mt-2 text-sm text-[color:var(--secondary-color)]">
                Drag & drop an image or click to browse
            </p>
            <p className="mt-1 text-xs text-[color:var(--secondary-color)]">
                JPEG, PNG, or WebP (max {maxSize}MB)
            </p>

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[color:var(--primary-color)]"></div>
                </div>
            )}
        </div>
    );
};

export default ImageDropzone;