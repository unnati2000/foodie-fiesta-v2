import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { AiFillCamera } from "react-icons/ai";

const ImageDropzone = ({ setImages }) => {
  const onDrop = useCallback((acceptedFiles) => {
    setImages(acceptedFiles);
  }, []);

  const onDropRejected = () => {
    alert("Please drop upto 5 image files only!");
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 5,
    accept: "image/*",
    onDropRejected,
  });

  return (
    <div
      className="bg-white cursor-pointer shadow-md rounded-xl p-8 w-full text-center"
      {...getRootProps()}
    >
      <div className="border-2 border-dashed divide-x rounded-md p-10 border-green-600 flex flex-col justify-center items-center">
        <input {...getInputProps()} />
        <AiFillCamera className="w-16 h-16 mb-4 text-green-600" />
        <p className="text-lg font-semibold mb-1">
          Drop your images here or{" "}
          <span className="text-green-600">browse</span>
        </p>
        <p className="text-md text-gray-400">Maximum 5 image files only</p>
      </div>
    </div>
  );
};

export default ImageDropzone;
