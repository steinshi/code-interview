const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("../DB/providers.json");
const db = low(adapter);

db.read().then(() => console.log("Content of my_project/db.json is loaded"));

// export function getAppointment(minScore, specialties, availableDates) {
//   let providers = db.get("providers");
//   providers.filter(provider => provider.score > minScore);
//   return providers;
// }

// export function getAppointment(minScore, specialties, availableDates) {}
