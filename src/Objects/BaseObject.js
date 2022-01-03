export class BaseObject {
    constructor(fileName) {
        this.fileName = fileName;
        this.data = {exampleStuff: "example"};
    }

    async saveFile() {
        await window.fs.writeFile(this.fileName, JSON.stringify(this.data));
        this.loadFile()
    }

    async loadFile() {
        this.data = await window.fs.readFile(this.fileName);
        console.log(this.data)
    }
}