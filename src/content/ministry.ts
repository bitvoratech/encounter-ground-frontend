// Ministry copy supplied by Encounter Ground (Oct 2026).
// Single source for the public pages until the admin-editable `site_content`
// API is wired up in week 2. Keep wording as the ministry gave it.

export const contact = {
  email: "general@encounterground.org",
  phoneDisplay: "0809 997 7733",
  phoneHref: "tel:+2348099977733",
  socials: [
    { name: "Instagram", handle: "@encounter_ground", href: "https://www.instagram.com/encounter_ground" },
    // TODO: confirm the exact YouTube channel URL with the ministry.
    { name: "YouTube", handle: "EncounterGroundTV", href: "https://www.youtube.com/@EncounterGroundTV" },
    { name: "TikTok", handle: "@encounterground", href: "https://www.tiktok.com/@encounterground" },
    { name: "WhatsApp channel", handle: "Encounter Ground", href: "https://whatsapp.com/channel/0029VbDonGGKmCPZKguofK3T" },
  ],
} as const;

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

export const discipleshipClasses = ["Halak", "Chayil", "Becoming", "Whispers"];

export const yada = {
  slug: "yada-intimacy-conference-2026",
  name: "YADA Intimacy Conference",
  year: 2026,
  theme: "Reviving the Ancient Well",
  // Dates and times are withheld until the ministry confirms them.
  when: "December 2026",
  about: [
    "YADA Intimacy Conference is a call into the deeper reality of YADA—knowing God beyond intellectual awareness and into experiential, relational, intimate knowing.",
    "It is a journey from knowing about God to truly knowing Him through desire, encounter, fellowship, surrender, obedience, and continual communion.",
  ],
  dress: [
    "Decent and modest dressing is a priority for this event.",
    "Dress as one who is coming into the presence of their King.",
  ],
};

// Home page sections carried over from the former WordPress site (encounterground.org).
export const home = {
  tagline: "Dominion in Intimacy",
  welcome:
    "Let us discover faith together as we grow in intimacy through our fellowship with the Spirit of God! Join us in this spiritual journey, growing in the grace and knowledge of our Lord Jesus Christ.",
  // TODO: replace with on-site registration once member accounts ship.
  joinUsUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLScAXJFIqkya7AkuC0X5mHlw9oz1aKj93E97rCyAc5XLgufk7A/viewform",
  whoWeAre: {
    heading: "A House of Dominion Through Intimacy",
    // The old site gave two different founding years (2001 and 2021), so the
    // year is left out until the ministry confirms it.
    body: [
      "Encounter Ground is a vibrant faith community dedicated to spreading the teachings of the Bible through passionate prayer, prophetic ministry, and uplifting worship. Founded through a simple act of obedience, our doors, both physical and virtual, are open to all.",
      "We are a family, growing together in the Spirit, known for our love for God’s Word, our devotion to dwelling in His presence, and our desire to behold His beauty daily.",
      "We believe the most incredible adventure of every believer begins with a loving, interactive relationship with the Holy Spirit.",
    ],
  },
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

export type BankAccount = { bank: string; accountName: string; accountNumber: string; currency: string };

// Giving. The old site's Donations page was a broken link, so there are no
// details to carry over. Add the ministry's accounts here once confirmed;
// online giving arrives with the Paystack integration.
export const giving = {
  bankAccounts: [] as BankAccount[],
  uses: [
    { title: "Prayer & streams", body: "Zoe Healing Stream, the Prayer Stretches and the live streams that carry them." },
    { title: "YADA Conference", body: "A free conference every December, open to everyone who is hungry for God." },
    { title: "Discipleship", body: "The discipleship classes and the Ministry School, so teaching reaches more people." },
  ],
};
