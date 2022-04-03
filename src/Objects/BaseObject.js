export class BaseObject {
  // String, Object, List of Objects
  constructor(fileName, data, rules) {
    this.fileName = fileName;
    this.data = data;
    this.rules = rules;
    this.invalid = [];
  }

  async saveData() {
    await window.fs.writeFile(this.fileName, JSON.stringify(this.data));
  }

  async loadData() {
    this.data = await window.fs.readFile(this.fileName);
  }

  validate() {
    let invalids = [];
    this.rules.forEach((rule) => {
      const datapoint = this.data[rule.target];
      if (datapoint !== undefined) {
        if (rule.minlength) {
          if (datapoint.length < rule.minlength) {
            invalids.push(rule.target);
          }
        }
        if (rule.maxlength) {
          if (datapoint.length > rule.maxlength) {
            invalids.push(rule.target);
          }
        }
        // (number, string, object, list)
        if (rule.type) {
          if (
            rule.type === "list" &&
            datapoint.constructor.target !== "Array"
          ) {
            invalids.push(rule.target);
          }
          if (rule.type !== "list" && typeof datapoint !== rule.type) {
            invalids.push(rule.target);
          }
        }
      }
    });
    this.invalid = invalids;
  }
}
