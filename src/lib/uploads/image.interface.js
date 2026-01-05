/**
 * Generic Image Upload Interface
 * Every provider MUST implement uploadImage()
 */
export class ImageProvider {
    /**
     * @param {File|Buffer} file
     * @returns {Promise<{ url: string, publicId: string }>}
     */
    async uploadImage(file) {
        throw new Error("uploadImage() not implemented");
    }

    async deleteImage(publicId) {
        throw new Error("deleteImage() not implemented");
    }
}
