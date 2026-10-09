// Blog posts carried over from the former WordPress site. These move to the
// `posts` table (admin-editable) when the blog API is built.

type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: { lead: string; text: string }[] };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string; // ISO date
  image: string;
  legacyPath: string; // old WordPress path, redirected in next.config.ts
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "discover-the-power-of-prayer",
    title: "Discover the Power of Prayer: Connecting with Encounter Ground",
    excerpt:
      "Prayer is a way to communicate with God, seek guidance, and find peace in times of trouble.",
    category: "Mission",
    publishedAt: "2022-04-24",
    image: "/images/blog/power-of-prayer.webp",
    legacyPath: "/discover-the-power-of-prayer-connecting-with-encounter-ground",
    body: [
      { type: "p", text: "If you are looking to deepen your faith and spiritual connection, Encounter Ground is the perfect online platform for you. This ministry offers a range of services, including Bible teaching, prayer, prophecy, and worship, to help you strengthen your Christian beliefs and draw closer to God." },
      { type: "p", text: "One of the most powerful ways to connect with Encounter Ground is through the practice of prayer. Prayer is a way to communicate with God, seek guidance, and find peace in times of trouble. It is a powerful tool that can help you build a stronger relationship with God and grow in your faith." },
      { type: "p", text: "When you engage in prayer on Encounter Ground, you are not only connecting with a community of like-minded believers but also tapping into the energy and power of collective prayer. The support and encouragement of others in the community can be a source of strength and comfort as you navigate your spiritual journey." },
      { type: "p", text: "Prayer is not just about asking for things from God; it is also about listening and being present in the moment. By taking the time to quiet your mind and open your heart, you can create space for God to speak to you and reveal His will for your life. Whether you are seeking guidance, healing, or simply a deeper connection with God, prayer on Encounter Ground can be a transformative experience." },
      { type: "p", text: "Through prayer, you can enter into a sacred space where you can lay your burdens down, find solace in God’s presence, and experience the power of divine love." },
      { type: "p", text: "So, if you are looking to enhance your spiritual life and cultivate a deeper connection with God, consider exploring the power of prayer on Encounter Ground. Join the community, engage in prayer, and experience the transformative power of connecting with God in a meaningful way." },
    ],
  },
  {
    slug: "deepening-your-faith",
    title: "Deepening Your Faith: Bible Teaching Tips for Growth",
    excerpt:
      "Bible teaching is a powerful tool that can help us gain insight, wisdom, and strengthen our relationship with the Lord.",
    category: "Mission",
    publishedAt: "2022-04-24",
    image: "/images/blog/deepening-your-faith.webp",
    legacyPath: "/deepening-your-faith",
    body: [
      { type: "p", text: "Are you looking to deepen your faith and grow closer to God through studying the Bible? As believers, it is important to continuously seek growth and understanding in our spiritual journey. Bible teaching is a powerful tool that can help us gain insight, wisdom, and strengthen our relationship with the Lord." },
      { type: "p", text: "Here are some valuable tips to help you in deepening your faith through Bible teaching:" },
      {
        type: "list",
        items: [
          { lead: "Consistent study", text: "Setting aside dedicated time each day for reading and studying the Bible is essential for growth. Consistency is key in building a solid foundation of knowledge and understanding." },
          { lead: "Engage in group studies", text: "Joining a Bible study group or attending a Bible teaching session can provide new perspectives and insights on scripture. It also allows for healthy discussions and fellowship with other believers." },
          { lead: "Prayerful reflection", text: "Take time to pray before and after studying the Bible. Ask the Holy Spirit to guide you in understanding the scriptures and to reveal their truths to you." },
          { lead: "Apply what you learn", text: "It’s important not only to gain knowledge but also to apply the teachings of the Bible in your daily life. Reflect on how you can live out the principles and values found in scripture." },
          { lead: "Utilize resources", text: "There are various resources available online, such as commentaries, devotionals, and study guides, that can enhance your Bible study experience. Take advantage of these tools to gain a deeper understanding of the Word." },
          { lead: "Journaling", text: "Keeping a journal of your reflections, prayers, and key takeaways." },
          { lead: "Stay open-minded and humble", text: "Approach Bible teaching with an open heart and a humble spirit, allowing God to speak to you through His Word. Be willing to challenge your beliefs and preconceptions as you seek a deeper understanding of the scriptures." },
        ],
      },
      { type: "p", text: "Remember, deepening your faith through Bible teaching is a lifelong journey that requires commitment, patience, and a sincere desire to grow spiritually." },
      { type: "p", text: "May these tips inspire and guide you in your quest for spiritual growth and a closer walk with God." },
    ],
  },
];

export const formatPostDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
