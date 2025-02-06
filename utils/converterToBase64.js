import { fromByteArray } from "base64-js";

// Function to convert an image file to Base64
export const convertImageToBase64 = async (filePath) => {
  try {
    // Read the image file as a buffer
    const fileData = await filePath?.data;
    const mimetype = filePath.mimetype;

    const base64String = `data:${mimetype};base64,${fileData.toString(
      "base64"
    )}`;

    return base64String;
  } catch (error) {
    console.error("Error converting image to Base64:", error.message);
    return null;
  }
};

export function getbase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}
