class SettingsService {
  settings = {};

  async loadSettings() {
    this.settings = JSON.parse(await window.fs.readSettings());
  }

  async saveSettings() {
    await window.fs.saveSettings(JSON.stringify(this.settings));
  }
}

let singleton = new SettingsService();
export default singleton;
