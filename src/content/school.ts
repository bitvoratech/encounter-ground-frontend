// Beth-El Institute of the Supernatural, the ministry school of Encounter Ground.
// Single source for the school pages until courses come from the API.
// TODO: confirm the class descriptions, intake dates and format with the ministry.

import { discipleshipClasses } from "./ministry";

export const school = {
  name: "Beth-El Institute of the Supernatural",
  shortName: "Beth-El Institute",
  // Beth-El: "house of God" (Genesis 28:19), where Jacob met God at the gate of heaven.
  meaning: "Beth-El means “house of God”, the place where Jacob saw heaven open and said, “Surely the Lord is in this place.”",
  summary:
    "The ministry school of Encounter Ground. Structured discipleship that takes you from hearing the Word to living it, in intimacy with the Holy Spirit.",
  about: [
    "Beth-El Institute of the Supernatural is an offshoot of Encounter Ground, born from the same mandate: to teach God’s people how to seek Him and find Him, so they can live according to the scroll He has written for them.",
    "The school gathers our discipleship classes into one path of study. Each class builds on a life of prayer, the Word and the presence of God, so that what you learn becomes how you live.",
  ],
  outcomes: [
    { title: "Know Him", body: "Grow in an interactive, loving relationship with the Holy Spirit, beyond knowing about God." },
    { title: "Walk in the Word", body: "Practical teaching of the Bible that moves you from hearing to doing." },
    { title: "Carry His presence", body: "Be trained in prayer and prophetic ministry, and shine as a carrier of His light." },
  ],
};

export type SchoolClass = { name: string; meaning: string; body: string };

// One entry per discipleship class, in the order they appear on the home page.
const classDetails: Record<(typeof discipleshipClasses)[number], Omit<SchoolClass, "name">> = {
  Halak: {
    meaning: "Hebrew for “to walk”",
    body: "The foundations of walking with God: salvation, the Word, prayer and fellowship with the Holy Spirit.",
  },
  Chayil: {
    meaning: "Hebrew for “strength, valour”",
    body: "Standing strong in identity and authority in Christ, and engaging in prayer as a warrior.",
  },
  Becoming: {
    meaning: "For pre-teens and teenagers",
    body: "Identity and purpose for young people, alongside the Who I Am Becoming journals.",
  },
  Whispers: {
    meaning: "Hearing His voice",
    body: "Learning to hear God and journal what He says, alongside Whispers: The Journal.",
  },
};

export const schoolClasses: SchoolClass[] = discipleshipClasses.map((name) => ({ name, ...classDetails[name] }));

export const enrolSteps = [
  { title: "Create your account", body: "One Encounter Ground account holds your classes, books and self-test results." },
  { title: "Choose a class", body: "Start with Halak if you are new, or pick the class that fits where you are." },
  { title: "Learn from your dashboard", body: "Your classes will appear under My courses on your dashboard as they open." },
];

/** The three school pages, for the school's own sub-navigation. */
export const schoolNav = [
  { href: "/school", label: "Overview" },
  { href: "/school/classes", label: "Classes" },
  { href: "/school/enrol", label: "Enrol" },
] as const;
