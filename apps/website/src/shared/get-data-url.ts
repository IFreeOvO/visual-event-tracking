export function getDataUrl(file: Blob): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function () {
            resolve(reader.result as string)
        }
    })
}
