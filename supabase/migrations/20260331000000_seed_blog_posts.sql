-- Seed the blog_posts table with the 4 real blog posts from the site.
-- Uses ON CONFLICT (slug) DO NOTHING so the migration is safe to re-run.

INSERT INTO blog_posts (id, title, slug, content, excerpt, category, author, featured_image, published, reading_time, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'Feeding the Greatest Hunger',
    'feeding-the-greatest-hunger',
    E'> "If you pour yourself out for the hungry and satisfy the desire of the afflicted, then shall your light rise in the darkness." — Isaiah 58:10\n\nMost of us already know that hungry children matter. We feel it when we picture a child struggling to focus in class on an empty stomach, or a little boy acting out because he is tired, worried, and hungry—not rebellious. Real change starts with awareness, but it takes compassion that leads to action.\n\nIn Amarillo, hunger often goes unnoticed. It can be hidden by a school backpack, a quiet smile, or a family doing their best to get by. Children still go to class, parents still work, and grandparents do all they can to make groceries last. But behind these efforts, there is often a real need and worry.\n\nThis is why we need more empathy and compassion for Amarillo''s children facing hunger. Not distant pity or brief concern, but real compassion that notices, responds, and remains present.\n\n## A Story from the Beginning\n\nWhen we started Citychurch in 1997, I didn''t realize how serious the problem was. I remember driving to a run-down apartment complex with some donated toys and groceries, hoping to invite children to Citychurch. As soon as I took out the food, the children rushed over and grabbed it before I reached the first door. Their hunger surprised me. I was a stranger, but they didn''t care—they were desperate.\n\nI quickly went back to Citychurch, filled my truck with all the food we had, and returned to the complex. The food was gone right away. Later that week, we came back to offer the children a ride to our weekly Bible club. That night, we picked up 80 children from that one place and started a new van route.\n\n## Why It Matters for Our City\n\nWhen Scripture tells us to help the hungry, it is not asking for mere feelings. It calls us to live differently. God does not ignore those in need, and neither should we. For the Church, feeding children is not just about food. It is about dignity and showing each child, through our actions, that "You matter to God, and you matter to us."\n\nThis is very important for our city.\n\nAccording to The Texas Tribune, 71.6% of students in Amarillo ISD are considered economically disadvantaged. This means most children in the district already live with financial stress. When rent goes up, work hours are cut, a car breaks down, or a parent gets sick, food is often the first thing families struggle to afford.\n\nHunger data shows us how big the problem is. Feeding America''s estimates reveal that child food insecurity exists in every county in the country. Earlier data showed that Potter County had a food insecurity rate of 15.5% and Randall County had a rate of 11.3%. These numbers remind us that hunger is not rare in Amarillo—it is present in the neighborhoods where children live and grow.\n\nAnd children really feel it.\n\nThey feel it in class when it''s hard to focus. They feel it emotionally when worry sets in. They feel it physically when their bodies don''t get enough food. They feel it socially when they start to think they are different or left behind. Hunger is never just about food—it affects confidence, energy, family peace, and hope.\n\n## How Citychurch Responds\n\nThis is why Citychurch believes children are the key to reaching families. If we can find, feed, and teach children with love and consistency, we do more than meet a single need. We break cycles, open doors for families to heal, and introduce children and caregivers to Jesus while meeting their needs with dignity.\n\nThis work is not just a dream for us. It is making a real difference in families'' lives.\n\nCitychurch''s mission is to find, feed, and teach Amarillo''s most vulnerable children. Last year, we served over 150,000 meals and welcomed more than 1,400 children into our ministries. These numbers matter because they stand for real children, real neighborhoods, and real stories. They show the doors we''ve knocked on, the meals we''ve delivered, and the conversations that lead to prayer and long-term care.\n\nJust as important, Citychurch believes that help without hope is no help at all. We do not want to treat children and families like projects. We want to welcome them with love, consistency, and the hope of Christ. Every meal served, every resource shared, is meant to show that the Shepherd has not forgotten His sheep.\n\n## The Need for Partnership\n\nThis kind of ministry needs compassion, but it also needs partnership.\n\nSome people in Amarillo might think hunger is someone else''s problem. Others may believe that with all our churches, schools, and charities, every child who needs a meal is already helped. But that''s not the case. Hunger is still there on weekends, during school breaks, and when a family is just one paycheck or bill away from empty shelves.\n\nThis is where more empathy can make all the difference.\n\nEmpathy helps us stop asking, "Why don''t they just fix it?" and start asking, "What burden are they carrying that I''ve never had to carry?" Compassion helps us see hunger not as a number, but as a child made in God''s image. It reminds us that families under stress are not problems—they are neighbors to love.\n\nFor parents and grandparents in Amarillo, this hits close to home. If it were your child, grandchild, niece, or the kid next door, you''d want someone to notice and act. For young professionals, this is part of faithful stewardship and Christian discipleship. God put us here not just to build our own lives, but to share His grace with others. If God''s grace stops with us, it hasn''t reached its full purpose.\n\n## How You Can Help\n\nThe good news is Amarillo doesn''t have to respond with apathy. We can choose to respond with love and obedience.\n\n**We can pray.** We can ask God for wisdom, provision, open doors, protection for the children, and spiritual renewal in the homes Citychurch serves. We can pray for strong volunteers, more resources, and for every act of service to help introduce children and families to Jesus. Prayer is not the least we can do—it is one of the most important things, because this ministry depends on more than just human effort.\n\n**We can give.** Citychurch relies on private donors and partner churches, not government funding. This means your support has lasting value and goes straight to helping children and families now. Your giving helps provide resources, prepare meals, stock supplies, support outreach, and strengthen the daily work of restoring families in Amarillo. If God has given you resources, this is a meaningful way to use them.\n\n**We can serve.** There are real opportunities right now for individuals, families, groups, businesses, and churches to volunteer. Some can help us get organized for ministry. Some can prepare meals that nourish children with care and dignity. Some can deliver meals to neighborhoods, building trust through practical help. Others can serve in the Citychurch Cafe, turning a meal into a moment of welcome. Every role matters. Every act of service adds to our story.\n\nThis kind of work can change a child''s whole future. Isn''t this at the heart of our mission as followers of Christ?\n\n## A Final Word\n\nAmarillo''s children don''t need our judgment—they need our compassion. They shouldn''t have to prove their worth to be valued. God gave them value long before we saw their need. Christ died for them. The real question is whether we will live as if that''s true.\n\nSo let''s not look away.\n\nLet''s ask God to give us more empathy for the children in Amarillo who are hungry. Let''s move toward them with Christ''s love. Let''s support Citychurch as a lifeboat for the city''s poorest children and families.\n\nBecause the Good Shepherd gave His life for us,\n\nDonnie Lane Jr.',
    'A pastoral call for Amarillo to see child hunger with greater empathy and respond with prayer, generosity, and service through Citychurch.',
    'Outreach',
    'Donnie Lane Jr.',
    '/images/blog-01-feeding-the-greatest-hunger.jpg',
    TRUE,
    7,
    '2026-03-27T10:00:00Z',
    '2026-03-27T10:00:00Z'
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_posts (id, title, slug, content, excerpt, category, author, featured_image, published, reading_time, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'Why We Don''t Sell Anything',
    'why-we-dont-sell-anything',
    E'Our approach is different. We believe the most powerful witness is simply showing up and doing the work — no strings attached.\n\n## The Problem with Transactions\n\nSomewhere along the way, service became a marketing strategy. Give someone a meal, hand them a flyer. Offer help, but only if they sit through a pitch first. We reject that model entirely.\n\n## What We Do Instead\n\nWe show up. We serve. We document what we see. That''s it. If someone asks why we''re here, we tell them the truth: because we believe every person in Amarillo matters, and we wanted to prove it with our hands, not our words.\n\n> "The most radical thing a church can do in 2026 is simply be present without an agenda."\n\nThis isn''t a strategy. It''s a conviction.',
    'Our approach is different. We believe the most powerful witness is simply showing up and doing the work — no strings attached.',
    'Leadership',
    'Citychurch Team',
    NULL,
    TRUE,
    3,
    '2026-02-28T10:00:00Z',
    '2026-02-28T10:00:00Z'
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_posts (id, title, slug, content, excerpt, category, author, featured_image, published, reading_time, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'Citychurch Music Academy',
    'citychurch-music-academy',
    E'It is well known how important music is to everyone. Music can help people in many ways throughout their lives. It stimulates multiple regions of the brain and can improve cognitive, emotional, and even physical functioning.\n\nEspecially for children, music is a powerful tool that brings numerous benefits, including intellectual, social-emotional, motor, and language development.\n\nHere at Citychurch, we understand the importance of music and recognize it as a beautiful way to express faith, praise, and worship to God.\n\nSo, why am I saying all this? Because we''re about to launch the "Citychurch Music Academy"!\n\nWe believe this new initiative will bless many children, teenagers, and young people in our community. Completely free of charge, we want to give them the opportunity to learn how to play an instrument or take vocal lessons. Can you imagine what a blessing this could be for those who don''t have the financial means to afford music classes — and now will have a place that offers it to them?\n\nWe''re excited, but we''re also facing some challenges. We''ll be starting in a small room in our facility, which will work for now — but as the program grows, we''ll need more space and may even need to remodel.\n\nTo get started, we''ll need to purchase at least two acoustic guitars, one electric keyboard, guitar stands, electronic drums, and other equipment.\n\n## Would You Consider Helping Us?\n\nOne way you can support this ministry is by praying — asking God to guide us and bless every child who will be impacted by this project.\n\nSecondly, if you feel led to support us financially or through donations of instruments or equipment, it would make a big difference and be deeply appreciated.\n\nMay God bless you richly.\n\n> "Praise him with the sounding of the trumpet, praise him with the harp and lyre, praise him with timbrel and dancing, praise him with the strings and pipe, praise him with the clash of cymbals, praise him with resounding cymbals. Let everything that has breath praise the Lord. Praise the Lord." — Psalm 150:4-6',
    'We''re launching the Citychurch Music Academy — free music lessons for children, teenagers, and young people in our community. Learn how you can help.',
    'Community',
    'Renato Silva',
    '/images/blog-04-citychurch-music-academy.jpg',
    TRUE,
    4,
    '2025-05-28T10:00:00Z',
    '2025-05-28T10:00:00Z'
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_posts (id, title, slug, content, excerpt, category, author, featured_image, published, reading_time, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'Faces of Amarillo: A Photo Essay',
    'faces-of-amarillo',
    E'Portraits and stories from the people we''ve had the privilege to serve and walk alongside this season.\n\n## Every Face Tells a Story\n\nWe started this documentary project with a simple camera and a simpler question: "Can we sit with you for a moment?"\n\nWhat we found was extraordinary. Not because the stories were dramatic — though some were — but because they were real. Unvarnished. Human.\n\n## The Grandmother on 6th Street\n\nShe told us she''d lived in the same house for 47 years. Her neighborhood had changed around her, but she stayed. "This is my home," she said. "Where else would I go?"\n\n## The Veteran at the Park\n\nHe comes to the meal service every Saturday. Not because he needs the food — he has a pension — but because he needs the company. "Loneliness will kill you faster than hunger," he told us.',
    'Portraits and stories from the people we''ve had the privilege to serve and walk alongside this season.',
    'Documentary',
    'Citychurch Team',
    NULL,
    TRUE,
    5,
    '2026-02-20T10:00:00Z',
    '2026-02-20T10:00:00Z'
  )
ON CONFLICT (slug) DO NOTHING;
