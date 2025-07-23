"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDiary = exports.getEnriesWithoutSensitiveInfo = exports.findById = exports.getEntries = void 0;
const diaries_json_1 = __importDefault(require("./diaries.json"));
const diaries = diaries_json_1.default;
const getEntries = () => diaries;
exports.getEntries = getEntries;
const findById = (id) => {
    const entry = diaries.find(d => d.id === id);
    if (entry != null) {
        const { comment, ...restOfTheDiary } = entry;
        return restOfTheDiary;
    }
    return undefined;
};
exports.findById = findById;
const getEnriesWithoutSensitiveInfo = () => {
    return diaries.map(({ id, date, weather, visibility }) => {
        return { id, date, weather, visibility };
    });
};
exports.getEnriesWithoutSensitiveInfo = getEnriesWithoutSensitiveInfo;
const addDiary = (newDiaryEntry) => {
    const newDiary = {
        id: Math.max(...diaries.map(e => e.id)) + 1,
        ...newDiaryEntry
    };
    diaries.push(newDiary);
    return newDiary;
};
exports.addDiary = addDiary;
