export function dataURLToBlob(dataURL: string) {
    const [header, base64] = dataURL.split(',')
    const mime = header.match(/:(.*?);/)![1]
    const byteCharacters = atob(base64)
    const byteNumbers = new Uint8Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    return new Blob([byteNumbers], { type: mime })
}
