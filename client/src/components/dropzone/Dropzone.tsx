import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface DropzoneProps {
  setAvatarFile: (file: File | null) => void;
  setPreview: (previewUrl: string | null) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ setAvatarFile, setPreview }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setAvatarFile(file); // Store the file locally
        setPreview(URL.createObjectURL(file)); // Generate preview URL locally
      }
    },
    [setAvatarFile, setPreview]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={{
        width: "100%",
        textAlign: "center",
        border: "2px dashed gray",
        borderRadius: "15px",
        padding: "24px",
        backgroundColor: isDragActive ? "#f0f0f0" : "#fff",
        cursor: "pointer",
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default Dropzone;
