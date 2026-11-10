// Ministry copy supplied by Encounter Ground (Oct 2026).
// Single source for the public pages until the admin-editable `site_content`
// API is wired up in week 2. Keep wording as the ministry gave it.

export const contact = {
  email: "info@encounterground.org",
  phoneDisplay: "0818 517 6780",
  phoneHref: "tel:+234-818-517-6780",
  socials: [
    { name: "Instagram", handle: "@encounter_ground", href: "https://www.instagram.com/encounter_ground" },
    // Confirmed 17 Oct 2026: @EncounterGroundTV and @encountergroundtv are the same channel.
    { name: "YouTube", handle: "EncounterGroundTV", href: "https://www.youtube.com/@EncounterGroundTV" },
    { name: "TikTok", handle: "@encounterground", href: "https://www.tiktok.com/@encounterground" },
    { name: "WhatsApp channel", handle: "Encounter Ground", href: "https://whatsapp.com/channel/0029VbDonGGKmCPZKguofK3T" },
  ],
} as const;

/** Encounter Ground TV. The media page shows its latest uploads (streams become replays). */
export const youtubeChannel = {
  name: "Encounter Ground TV",
  id: "UCIKDW3WCWV10Qe25NUuSrdQ",
  url: "https://www.youtube.com/@EncounterGroundTV",
  subscribeUrl: "https://www.youtube.com/@EncounterGroundTV?sub_confirmation=1",
};

export const mandate = "Teach My people how to seek Me and find Me, so they can live according to the scroll I have written for them.";

export const story = [
  "After I gave my life to Christ, an indescribable hunger for God began to grow within me. I found myself seeking Him earnestly, longing to know Him deeply and personally.",
  "Along that journey, God began to stir certain burdens in my heart, divine promptings that revealed a powerful truth: every person has a scroll (an ordained design, purpose, and path) written by God specifically for them.",
  "As this revelation unfolded, the Lord entrusted me with a clear assignment: “Teach My people how to seek Me and find Me, so they can live according to the scroll I have written for them.”",
  "This ministry was born out of that mandate: to awaken hearts, equip lives, and guide people, young and old, into a life of divine alignment, where they walk in purpose, live with power, and shine with the light of Christ.",
];

export const vision =
  "To raise a mighty army of women, children, and men from spiritual slumber into their God-given purpose, empowering them to boldly reveal the reality of Jesus and fill the earth with the knowledge of God’s glory, as the waters cover the sea.";

export const mission = [
  "To awaken and equip individuals through intentional discipleship and prophetic teaching of God’s Word, nurturing them to embrace their identity in Christ, walk in intimacy with God, and shine as carriers of His light.",
  "Through this process, they become empowered to bring hope to those in darkness and fulfill their divine purpose on the earth.",
];

export const values = [
  "Intimacy with God",
  "Love towards man",
  "Honor",
  "Holiness",
  "Community",
  "Truth",
  "Excellence",
  "Boldness",
  "Faith",
  "Surrendered life",
  "Embracing the supernatural",
];

export type Programme = {
  slug: string;
  name: string;
  when: string;      // short label for the schedule column
  detail: string;
  where?: string;
};

// Regular meetings, in the order they come round.
export const programmes: Programme[] = [
  { slug: "zoe-healing-stream", name: "Zoe Healing Stream", when: "Wednesdays", detail: "Every Wednesday" },
  { slug: "10-hours-prayer-stretch", name: "10 Hours Prayer Stretch", when: "Fridays", detail: "Every Friday", where: "Live on YouTube" },
  { slug: "24-hours-prayer-stretch", name: "24 Hours Prayer Stretch", when: "Quarterly", detail: "First Saturday of every quarter" },
  { slug: "yada-intimacy-conference-2026", name: "YADA Intimacy Conference", when: "December", detail: "Yearly conference" },
];

export const discipleshipClasses = ["Halak", "Chayil", "Becoming", "Whispers"] as const;

export const yada = {
  slug: "yada-intimacy-conference-2026",
  name: "YADA Intimacy Conference",
  year: 2026,
  theme: "Reviving the Ancient Well Of True Worship",
  registerUrl: "https://tinyurl.com/RegisterforYADA2026",
  when: "Dec. 18th – 20th, 2026",
  time: "2:00 PM – 7:00 PM WAT",
  timezone: "Africa/Lagos",
  where: " 2 Rock Drive, off Bisola Durosinmi Etti Drive, Lekki Phase 1, Lagos.",
  venue: "THE SOMI PLACE,",

  about: [
    "YADA Intimacy Conference is a call into the deeper reality of YADA; the Hebrew concept of knowing what goes beyond intellectual awareness into experiential, relational, intimate knowing. It speaks of knowing God through encounter, fellowship, trust, surrender, obedience, and continual communion until what we know of Him becomes something we have experienced and lived.",
    "YADA is not simply gathering information about God; it is being brought into such depth of relationship with Him that His nature, voice, heart, and ways becomes one with us. YADA is the journey from knowing about God to knowing God.",
  ],
  dress: [
    "As we gather in the presence of God, we encourage everyone to dress modestly and appropriately for the meeting.",
    "The power of God will be present, and we would not want anyone to become distracted, uncomfortable, or embarrassed because of their choice of clothing.",
    "Let your dress reflect your reverence for the presence of God.",
  ],
};

// Home page sections carried over from the former WordPress site (encounterground.org).
export const home = {
  tagline: "Dominion in Intimacy",
  // TODO: replace with on-site registration once member accounts ship.
  joinUsUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLScAXJFIqkya7AkuC0X5mHlw9oz1aKj93E97rCyAc5XLgufk7A/viewform",
  pillars: [
    {
      title: "Dwelling Place for His Presence",
      body: "Our main goal is to create a sanctuary, both physical and virtual, where individuals can experience the tangible presence of God.",
    },
    {
      title: "Equip Disciples Through Biblical Truth",
      body: "We are dedicated to the practical teaching of the Bible, empowering believers to move from simply hearing the Word to living it out.",
    },
    {
      title: "Activate a Prophetic and Praying Community",
      body: "We foster a culture of prayer and prophetic ministry, training our community to engage in dynamic relationship with the Holy Spirit.",
    },
    {
      title: "Fulfill the Great Commission in Our Generation",
      body: "We are committed to spreading the knowledge of God’s glory to the ends of the earth.",
    },
  ],
  streams: [
    { name: "YouTube replays", detail: "Catch up on past streams", href: "https://www.youtube.com/@encountergroundtv/streams" },
    { name: "Mixlr", detail: "Listen live on audio", href: "https://encounterground.mixlr.com/events/2805055" },
    { name: "Zoom", detail: "Join the live meeting", href: "https://us02web.zoom.us/j/8248076803?pwd=a0Q4WWcxTjVmOFE1THBNWVpBOTZPUT09" },
  ],
};
