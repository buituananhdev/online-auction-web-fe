import axios from "axios";

export async function uploadImage(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.addEventListener(
            "load",
            function () {
                let formData = new FormData();
                formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
                formData.append("tags", "pbl5");
                formData.append("file", reader.result);

                let cloudinaryUploadURL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/upload`;
                let requestObj = {
                    url: cloudinaryUploadURL,
                    method: "POST",
                    data: formData,
                    onUploadProgress: function (progressEvent) {
                        let progress = Math.round((progressEvent.loaded * 100.0) / progressEvent.total);
                        console.log("Upload Progress: " + progress + "%");
                    }
                };

                axios(requestObj)
                    .then((response) => {
                        resolve(response.data.secure_url);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            },
            false
        );

        if (file) {
            reader.readAsDataURL(file);
        } else {
            reject("No file selected");
        }
    });
}
