"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("./enums");
const parseComment = (commentFromRequest) => {
    if (!isString(commentFromRequest)) {
        throw new Error('Incorrect or missing comment');
    }
    return commentFromRequest;
};
const parseDate = (dataFromRequest) => {
    if (!isDate(dataFromRequest.date) || !isString(dataFromRequest.comment)) {
        throw new Error('Incorrect of missing date');
    }
    return dataFromRequest.date;
};
const parseWeather = (weatherFromRequest) => {
    if (!isString(weatherFromRequest) || !isWeather(weatherFromRequest)) {
        throw new Error('Incorrect or missing weather');
    }
    return weatherFromRequest;
};
const parseVisibility = (visibilityFromRequest) => {
    if (!isString(visibilityFromRequest) || !isVisibility(visibilityFromRequest)) {
        throw new Error('Incorrect or missing visibility');
    }
    return visibilityFromRequest;
};
const isVisibility = (string) => {
    return Object.values(enums_1.Visibility).includes(string);
};
const isWeather = (string) => {
    return Object.values(enums_1.Weather).includes(string);
};
const isString = (string) => {
    return typeof string === 'string';
};
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
const toNewDiaryEntry = (object) => {
    const newEntry = {
        comment: parseComment(object.comment),
        date: parseDate(object.date),
        weather: parseWeather(object.weather),
        visibility: parseVisibility(object.visibility)
    };
    return newEntry;
};
exports.default = toNewDiaryEntry;
