import React, { useState } from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import { UploadedUppyFile } from "@uppy/core";
// import { Cloudinary } from "@cloudinary/url-gen";

interface UploadedFile
  extends UploadedUppyFile<Record<string, unknown>, Record<string, unknown>> {
  preview?: string;
}

const UploadImageComponent: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const uppy = new Uppy({
    autoProceed: true,
    restrictions: {
      maxNumberOfFiles: 9,
      allowedFileTypes: ["image/*"],
    },
  });

  //   const cloudinary = new Cloudinary({
  //     cloud: {
  //       cloudName: "your_cloudinary_cloud_name",
  //     },
  //   });

  //   uppy.use(Uppy.Dashboard, {
  //     inline: true,
  //     target: "#drag-drop-area",
  //     note: "Images only, up to 9 files",
  //   });

  uppy.on("complete", (result) => {
    const uploadedImages = result.successful;
    setUploadedFiles(uploadedImages);
  });

  const removeImage = (fileId: string) => {
    uppy.removeFile(fileId);
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== fileId));
  };

  return (
    <div className="upload-image-component">
      <div className="grid grid-cols-3 gap-4">
        {uploadedFiles.map((file) => (
          <div key={file.id} className="relative">
            <img
              src={file.preview}
              alt={file.name}
              className="w-full h-32 object-cover rounded"
            />
            <button
              className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
              onClick={() => removeImage(file.id)}
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
        {uploadedFiles.length < 9 && (
          <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded">
            {uploadedFiles.length === 0 ? (
              <div className="text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto"
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
            ) : (
              <div className="text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mx-auto"
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
        )}
      </div>
      <div id="drag-drop-area" className="mt-4"></div>
    </div>
  );
};

export default UploadImageComponent;
