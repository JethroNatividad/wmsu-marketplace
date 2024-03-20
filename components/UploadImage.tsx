import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

// interface UploadImageProps {
//   onImagesUpload: (files: File[]) => void;
// }

// const UploadImage: React.FC<UploadImageProps> = ({ onImagesUpload }) => {
const UploadImage = () => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const newImages = [...uploadedImages, ...acceptedFiles];
    setUploadedImages(newImages.slice(0, 9)); // Limit to 9 images
    // onImagesUpload(newImages.slice(0, 9));
  };

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
    // onImagesUpload(newImages);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed border-gray-400 p-4 rounded-md w-full h-full max-h-[400px] ${
          isDragActive ? "bg-gray-100" : ""
        }`}
      >
        <input {...getInputProps()} />
        <div className="grid grid-cols-3 gap-4 grid-rows-3">
          {uploadedImages.map((file, index) => (
            <div key={file.name} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
          {uploadedImages.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
          )}
          {uploadedImages.length > 0 && uploadedImages.length < 9 && (
            <div className="flex items-center justify-center h-32">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
