"use client";
import { generateCode } from "./code";

export function generateSeed() {
    return generateCode().toString() + getUtcTime();
}

function getUtcTime() { // todo: round it up
    const now = new Date();
    const formattedDate = now.toISOString().replace(/\D/g, '').slice(0, 12);
    return formattedDate;
}