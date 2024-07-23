import { useState, useEffect, useCallback } from "react";

interface FileItem {
  type: string;
  name: string;
  download_url: string;
}

const useTokens = () => {
  const [imageFiles, setImageFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    const fetchImageFiles = async () => {
      const apiUrl =
        "https://api.github.com/repos/Switcheo/token-icons/contents/tokens";

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: FileItem[] = await response.json();
        // Filter for image files based on common image extensions
        const imageFiles: FileItem[] = data
          .filter(
            (item) =>
              item.type === "file" &&
              /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(item.name)
          )
          .map((item) => {
            return {
              download_url: item.download_url,
              name: item.name,
              type: item.type,
            };
          });

        setImageFiles(imageFiles);
      } catch (error) {
        console.log(error);
      }
    };

    fetchImageFiles();
  }, []);

  const getImage = useCallback(
    (currency: string | null) => {
      const imgURL = imageFiles.find(
        (item) => item.name.split(".")[0] === currency
      )?.download_url;
      return imgURL;
    },
    [imageFiles]
  );

  return { imageFiles, getImage };
};

export default useTokens;
