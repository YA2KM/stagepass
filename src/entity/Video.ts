export default class Video {
    file: File
    key: string

    constructor(file: File) {
        this.file = file
        this.key = crypto.randomUUID()
    }


    getTitle() {
        return this.file.name
    }
}