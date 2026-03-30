"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDomain = void 0;
const extractDomain = (url) => {
    const domainRegex = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/im;
    const match = url.match(domainRegex);
    if (!match) {
        throw new Error('Invalid URL');
    }
    return match[1];
};
exports.extractDomain = extractDomain;
