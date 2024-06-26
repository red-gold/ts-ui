// - Get file Extension
const getExtension = (fileName: string) => {
    const re = /(?:\.([^.]+))?$/;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return re.exec(fileName)![1];
};

// Converts image to canvas returns new canvas element
const convertImageToCanvas = (image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap) => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    canvas.getContext('2d')!.drawImage(image, 0, 0);

    return canvas;
};

/**
 * Check maximum file size in Mega Byte
 */
const checkMaxFileSize = (fileSize: number, maxSize: number) => {
    const fileSizeMB = Number((fileSize / (1024 * 1024)).toFixed(2));
    return fileSizeMB > maxSize;
};

/**
 * Capture video
 */
const captureVideo = (video: HTMLVideoElement, scaleFactor: number | null) => {
    if (scaleFactor == null) {
        scaleFactor = 1;
    }
    const width = video.videoWidth * scaleFactor;
    const height = video.videoHeight * scaleFactor;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
    }
    return canvas;
};

/**
 * Constraint image size
 */
const constraintImage = (file: File, fileName: string) => {
    // Ensure it's an image
    if (file.type.match(/image.*/)) {
        // Load the image
        const reader = new FileReader();
        reader.onload = (readerEvent: any) => {
            const image = new Image();
            image.onload = () => {
                // Resize the image
                const canvas: HTMLCanvasElement = document.createElement('canvas');
                const maxSize = 986; // TODO : pull max size from a site config
                let {width,height} = image;
                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(image, 0, 0, width, height);
                }
                const dataUrl = canvas.toDataURL();
                const resizedImage = dataURLToBlob(dataUrl);

                const evt = new CustomEvent('onSendResizedImage', { detail: { resizedImage, fileName } });
                window.dispatchEvent(evt);
            };
            image.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
    }
};

/**
 * Convert data URL to blob
 * @param {object} dataURL
 */
const dataURLToBlob = (dataURL: string) => {
    const BASE64_MARKER = 'base64,';
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
        const parts = dataURL.split(',');
        const contentType = parts[0].split(':')[1];
        const raw = parts[1];

        return new Blob([raw], { type: contentType });
    }

    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
};

export default {
    dataURLToBlob,
    convertImageToCanvas,
    getExtension,
    constraintImage,
    captureVideo,
    checkMaxFileSize,
};
