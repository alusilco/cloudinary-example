const api_key = "776864232541471";
const cloud_name = "dixygtlro";

document.querySelector("#upload-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  // Resto del código para cargar la imagen

  try {
    // Obtener la firma (signature) de Cloudinary
    const signatureResponse = await axios.get("/get-signature");

    const data = new FormData();
    data.append("file", document.querySelector("#file-field").files[0]);
    data.append("api_key", api_key);
    data.append("signature", signatureResponse.data.signature);
    data.append("timestamp", signatureResponse.data.timestamp);

    // Realizar la carga de la imagen a Cloudinary
    const cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: function (e) {
        console.log(e.loaded / e.total);
      },
    });

    // Verificar si la carga se completó exitosamente
    if (cloudinaryResponse.data && cloudinaryResponse.data.public_id) {
      // Mostrar una alerta de éxito
      alert("¡La foto se ha subido exitosamente!");

      // Resto del código para procesar la respuesta de Cloudinary y enviar información al servidor
      const photoData = {
        public_id: cloudinaryResponse.data.public_id,
        version: cloudinaryResponse.data.version,
        signature: cloudinaryResponse.data.signature,
      };
      axios.post("/do-something-with-photo", photoData);
    } else {
      // Mostrar una alerta de error si la carga falla
      alert("Hubo un problema al subir la foto. Inténtalo de nuevo.");
    }
  } catch (error) {
    console.error("Error al subir la foto:", error);
  }
});

