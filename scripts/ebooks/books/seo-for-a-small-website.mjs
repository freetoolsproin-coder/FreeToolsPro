// Practice material for "SEO for a Small Website".
// Businesses, sites and figures in examples are illustrations.

const code = (lines) => lines.join("\n");

const book = {
  checked: "October 2026",
  welcome:
    "This book is for people who run or write for a small website: a clinic, a coaching centre, a shop, a consultant, a blog. It explains how search engines find, understand and show pages, and what you can do, mostly in an afternoon, to make your pages easier to find and more likely to be clicked. There are no tricks here. Search engines reward pages that answer real questions clearly, load quickly and are easy to use, and most of the work is making sure nothing gets in the way of that.",

  chapters: [
    {
      title: "How search works, briefly",
      paragraphs: [
        "A search engine does three jobs. It crawls: programs follow links and sitemaps to find pages. It indexes: it reads each page, works out what it is about and stores it. It ranks: when someone searches, it chooses and orders the pages most likely to help. Your work as a site owner touches all three.",
      ],
      sections: [
        {
          heading: "Crawling",
          paragraphs: [
            "Crawlers find pages through links from other pages, including your own menus and articles, and through sitemaps you submit. A page that nothing links to and that is missing from your sitemap may never be found. A page blocked in robots.txt will not be crawled.",
          ],
        },
        {
          heading: "Indexing",
          paragraphs: [
            "Not every crawled page is indexed. Search engines skip pages that are duplicates of others, pages with very little content, pages marked noindex, and pages that return errors. Google Search Console shows which of your pages are indexed and, for those that are not, the reason.",
          ],
        },
        {
          heading: "Ranking",
          paragraphs: [
            "Ranking weighs hundreds of signals, but most of them come down to a few questions. Does the page answer what the searcher wanted? Is it from a source that seems trustworthy on the subject? Is it usable on a phone and reasonably fast? Do other sites link to it or mention it? For a small site, the first question matters most and is the one you control best.",
          ],
        },
        {
          heading: "Search results now",
          paragraphs: [
            "Results pages now include much more than ten blue links: maps with local businesses, AI-generated overviews, videos, images, and 'People also ask' boxes. Some searches are answered on the results page itself. For a small site, this means two things: be the best source for the questions you can answer, and make sure your business details are correct wherever search engines read them, including your Google Business Profile.",
          ],
        },
      ],
    },
    {
      title: "Choosing what each page is about",
      paragraphs: [
        "A page that tries to be about everything ranks for nothing. Each important page should have one main topic, matching something real people search for, and should answer it better than the alternatives.",
      ],
      sections: [
        {
          heading: "Start with your customers' words",
          paragraphs: [
            "Write down the questions customers ask you on the phone, at the counter and by email. Those questions, in their words, are what they type into search. A physiotherapy clinic may call its service 'musculoskeletal rehabilitation'; patients search for 'physiotherapy for knee pain near me'.",
          ],
        },
        {
          heading: "Free ways to find search terms",
          bullets: [
            "Type a few words into the search box and look at the suggestions as you type.",
            "Look at 'People also ask' and 'Related searches' on the results page.",
            "In Google Search Console, the Performance report shows the searches that already bring people to your site.",
            "Read reviews of your business and competitors for the words customers use.",
          ],
        },
        {
          heading: "One topic, one page",
          paragraphs: [
            "If two pages on your site target the same search, they compete with each other and both may do worse. Combine them into one stronger page, or make each clearly different: 'Knee pain physiotherapy' and 'Back pain physiotherapy' are different topics; 'Physiotherapy services' and 'Our physiotherapy treatments' are not.",
          ],
        },
        {
          heading: "Search intent",
          paragraphs: [
            "Behind every search is a purpose: to learn something, to find a particular site, to compare options, or to buy or book. Look at what already ranks for a search to see which purpose search engines have inferred. If the top results are all guides, a product page will struggle; if they are all local businesses, a long article will struggle.",
          ],
          table: {
            caption: "The same topic, different intents.",
            headers: ["Search", "Intent", "Best page"],
            widths: [2.2, 1.2, 2],
            rows: [
              ["what causes knee pain when climbing stairs", "Learn", "Helpful article"],
              ["physiotherapist near me", "Visit", "Clinic page with map and hours"],
              ["physiotherapy cost per session pune", "Compare", "Prices page"],
              ["book physio appointment koregaon park", "Act", "Booking page"],
            ],
          },
        },
      ],
    },
    {
      title: "Titles and descriptions",
      paragraphs: [
        "The title and meta description are what most searchers see of your page before they decide to click. They are also among the few things on a page written purely for search results.",
      ],
      sections: [
        {
          heading: "The title tag",
          paragraphs: [
            "The title tag is the clickable headline in search results and the text in the browser tab. Put the main topic first, in the words people search with, and add your brand at the end if there is room. Google cuts titles by width, roughly 580 to 600 pixels on desktop, which is usually 50 to 60 characters; wide letters and capitals use more space.",
          ],
          codes: [
            {
              caption: "Before and after.",
              code: code([
                "<title>Home | Sharma Physio</title>",
                "",
                "<title>Physiotherapy for Knee and Back Pain in Pune | Sharma Physio</title>",
              ]),
            },
          ],
        },
        {
          heading: "Unique titles",
          paragraphs: [
            "Every page needs its own title. Templates that give every page the same title, or titles like 'Page 2' or 'Untitled', waste the most visible line you have. A site audit often finds dozens of duplicate titles; fixing them is one of the quickest gains available.",
          ],
        },
        {
          heading: "The meta description",
          paragraphs: [
            "The meta description is the short summary that may appear under the title. It does not directly affect ranking, but a clear one encourages clicks. Aim for about 120 to 158 characters: say what the page offers and why it is worth clicking. Search engines often rewrite it using text from the page that better matches a particular search, which is normal.",
          ],
          codes: [
            {
              caption: "A description that earns the click.",
              code: code([
                "<meta name=\"description\" content=\"Hands-on treatment and exercise plans",
                "for knee, back and shoulder pain. Evening slots, Koregaon Park, Pune.",
                "Book online or call.\">",
              ]),
            },
          ],
        },
        {
          heading: "Why Google changes your title",
          paragraphs: [
            "Google sometimes shows a different title from the one you wrote, especially if yours is very long, stuffed with keywords, the same as other pages, or does not match the page content. If that happens, make your title shorter, more specific and closer to the page's main heading. The site's SERP snippet preview and meta title checker show how your title is likely to appear and where it may be cut.",
          ],
        },
      ],
    },
    {
      title: "Writing pages people want",
      paragraphs: [
        "Search engines increasingly reward pages written for people, by people who know the subject. For a small business that is good news: you know your customers and your work better than any content farm.",
      ],
      sections: [
        {
          heading: "Answer first",
          paragraphs: [
            "Readers arriving from search want their answer quickly. State it near the top, then explain. A page about clinic fees should show the fees in the first screen, not after three paragraphs about the clinic's history.",
          ],
        },
        {
          heading: "Show experience",
          paragraphs: [
            "Content that shows first-hand experience is more useful and more trusted: photos of your actual work, real examples, prices you actually charge, mistakes you see customers make. A page by a tax consultant explaining the five errors she sees most in salaried returns, with examples, is more valuable than a generic list copied from elsewhere.",
          ],
        },
        {
          heading: "Who is behind the site",
          bullets: [
            "An About page with real names, qualifications and photos.",
            "Contact details: address, phone, email, and a map for local businesses.",
            "Author names on articles, with a line on their experience.",
            "Dates on articles, updated when the content changes.",
            "Clear policies for prices, refunds and privacy where relevant.",
          ],
        },
        {
          heading: "Headings and structure",
          paragraphs: [
            "Use one main heading (h1) that states the page's topic, and subheadings (h2, h3) for sections. Headings help readers scan and help search engines understand the page. Short paragraphs, lists for steps and options, and tables for comparisons make pages easier to read on phones.",
          ],
        },
        {
          heading: "Length",
          paragraphs: [
            "There is no ideal word count. A page should be as long as it needs to be to answer the question well, and no longer. A clinic's hours page may need fifty words; a guide to choosing a home loan may need two thousand. Padding pages to reach a length makes them worse.",
          ],
        },
        {
          heading: "AI-written content",
          paragraphs: [
            "Search engines judge content by its usefulness, not by how it was written. AI tools can help draft and edit, but pages mass-produced with little human checking tend to be generic, sometimes wrong, and are treated as spam when made mainly to attract search traffic. Whatever tools you use, check the facts, add your own experience, and publish only what you would stand behind.",
          ],
        },
      ],
    },
    {
      title: "Addresses, links and duplicates",
      paragraphs: [
        "Each page should be reachable at one clear address, linked from related pages, and not duplicated under other addresses.",
      ],
      sections: [
        {
          heading: "Readable URLs",
          paragraphs: [
            "Short, descriptive addresses in lowercase with hyphens are easy to read, share and trust: example.in/services/knee-physiotherapy is better than example.in/page.php?id=482. Once a page is published and linked, avoid changing its address; if you must, redirect the old one.",
          ],
        },
        {
          heading: "Redirects",
          paragraphs: [
            "A 301 redirect sends visitors and search engines from an old address to a new one permanently, and passes most of the old page's value. Use one whenever you move or rename a page, merge two pages, or change domain. Without it, old links and bookmarks lead to an error page.",
          ],
        },
        {
          heading: "Duplicates and canonical tags",
          paragraphs: [
            "The same content often appears at several addresses: with and without www, with http and https, with tracking parameters, or with and without a trailing slash. Pick one version, redirect the others to it, and add a canonical tag on the page pointing to the preferred address. Search engines then combine signals on one URL.",
          ],
          codes: [
            {
              caption: "A canonical tag in the page's head.",
              code: code(["<link rel=\"canonical\" href=\"https://www.example.in/services/knee-physiotherapy\">"]),
            },
          ],
        },
        {
          heading: "Internal links",
          paragraphs: [
            "Links between your own pages help visitors find related information and help search engines find and understand pages. Link with descriptive text, such as 'our knee physiotherapy programme', not 'click here'. Make sure every important page is linked from at least one other page, ideally from a menu or a hub page.",
          ],
        },
        {
          heading: "Broken links",
          paragraphs: [
            "Links to pages that no longer exist frustrate visitors. Check for them every few months with a link checker or Search Console, and fix them by updating the link or adding a redirect.",
          ],
        },
      ],
    },
    {
      title: "Sitemaps, robots.txt and indexing",
      paragraphs: [
        "Two small files tell search engines what to crawl. Getting them wrong can hide a whole site; getting them right takes minutes.",
      ],
      sections: [
        {
          heading: "XML sitemaps",
          paragraphs: [
            "A sitemap lists the pages you want indexed, with optional dates of last change. Most website platforms create one automatically. Submit its address in Google Search Console and Bing Webmaster Tools, and list it in robots.txt. One sitemap file can hold up to 50,000 URLs and 50 MB uncompressed; larger sites use a sitemap index that points to several files.",
          ],
          codes: [
            {
              caption: "A minimal sitemap.",
              code: code([
                "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
                "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
                "  <url>",
                "    <loc>https://www.example.in/services/knee-physiotherapy</loc>",
                "    <lastmod>2026-10-12</lastmod>",
                "  </url>",
                "</urlset>",
              ]),
            },
          ],
        },
        {
          heading: "What belongs in a sitemap",
          bullets: [
            "Only pages you want in search results, at their canonical addresses.",
            "Only pages that load normally, without redirects or errors.",
            "Accurate lastmod dates; Google uses them only if they prove reliable.",
            "Not admin pages, search result pages, thank-you pages or duplicates.",
          ],
          paragraphs: [
            "Google ignores the priority and changefreq fields, so there is no need to fuss over them. The site's sitemap validator checks the structure, the URLs and common mistakes such as http addresses on an https site.",
          ],
        },
        {
          heading: "robots.txt",
          paragraphs: [
            "robots.txt, at the root of your domain, tells crawlers which paths not to crawl. It does not hide pages from search results: a blocked page can still be indexed if other sites link to it, just without its content. To keep a page out of results, allow it to be crawled and add a noindex tag instead.",
          ],
          codes: [
            {
              caption: "A simple robots.txt.",
              code: code(["User-agent: *", "Disallow: /admin/", "Disallow: /cart/", "", "Sitemap: https://www.example.in/sitemap.xml"]),
            },
          ],
        },
        {
          heading: "The most expensive mistake",
          paragraphs: [
            "Developers often block the whole site during building with 'Disallow: /' or a site-wide noindex, and forget to remove it at launch. The new site then disappears from search. After any launch or redesign, check robots.txt and a few pages' source for noindex, and use Search Console's URL inspection on the home page.",
          ],
        },
      ],
    },
    {
      title: "Speed, phones and page experience",
      paragraphs: [
        "Most searches in India happen on phones, often on mobile data. Google indexes the mobile version of sites. A page that is slow or awkward on a phone loses visitors whatever its ranking.",
      ],
      sections: [
        {
          heading: "Core Web Vitals",
          paragraphs: [
            "Google measures three aspects of real visitors' experience. Largest Contentful Paint (LCP) is how quickly the main content appears; aim for 2.5 seconds or less. Interaction to Next Paint (INP) is how quickly the page responds to taps and clicks; aim for 200 milliseconds or less. Cumulative Layout Shift (CLS) is how much the layout jumps around while loading; aim for 0.1 or less.",
          ],
          table: {
            caption: "Targets for a 'good' rating, measured on real visits.",
            headers: ["Measure", "What it means", "Good"],
            widths: [1, 2.6, 1],
            rows: [
              ["LCP", "Main content visible", "2.5 s or less"],
              ["INP", "Response to taps and clicks", "200 ms or less"],
              ["CLS", "Layout stability", "0.1 or less"],
            ],
          },
        },
        {
          heading: "Common fixes",
          bullets: [
            "Resize and compress images; they are usually the heaviest part of a page.",
            "Give images and embeds width and height so the layout does not jump.",
            "Remove plugins, scripts and widgets you do not need.",
            "Use good hosting and a content delivery network if visitors are spread out.",
            "Avoid large pop-ups that cover content on phones.",
          ],
        },
        {
          heading: "Mobile basics",
          bullets: [
            "Text readable without zooming.",
            "Buttons and links large enough to tap, with space between them.",
            "No horizontal scrolling.",
            "Phone numbers that can be tapped to call.",
            "Forms with few fields and the right keyboard for each, such as numbers for phone.",
          ],
        },
        {
          heading: "Measuring",
          paragraphs: [
            "PageSpeed Insights shows both lab tests and, for sites with enough visitors, real-user data. Search Console's Core Web Vitals report groups pages by status. Test on a mid-range phone on mobile data, not just on your office laptop.",
          ],
        },
      ],
    },
    {
      title: "Local search",
      paragraphs: [
        "For clinics, shops, coaching centres, restaurants and service businesses, local results, the map and the list of businesses below it, often matter more than ordinary results.",
      ],
      sections: [
        {
          heading: "Google Business Profile",
          steps: [
            "Claim or create your profile and verify it.",
            "Choose the most accurate primary category, such as 'Physiotherapist', and a few secondary ones.",
            "Enter your name exactly as on your signboard, without added keywords.",
            "Add address, phone, website, hours, including holiday hours, and services.",
            "Add real photos of the premises, team and work.",
            "Ask happy customers for reviews and reply to reviews politely.",
          ],
        },
        {
          heading: "Consistency",
          paragraphs: [
            "Your business name, address and phone number should be the same on your website, your Business Profile, directories, and social pages. Inconsistent details confuse both customers and search engines. When you move or change your number, update every listing.",
          ],
        },
        {
          heading: "Location pages",
          paragraphs: [
            "If you have several branches, give each its own page with its address, hours, map, staff and anything specific to it. Do not create pages for areas you do not serve, or near-identical pages that only change the town name; search engines treat those as spam.",
          ],
        },
        {
          heading: "Reviews",
          paragraphs: [
            "Reviews influence both ranking and customers. Ask for them after good experiences, make it easy with a direct link, and reply to all of them, especially critical ones, calmly and helpfully. Never buy reviews, write fake ones, or offer rewards only for positive reviews; it breaks platform rules and consumer protection guidelines and can get a profile suspended.",
          ],
        },
      ],
    },
    {
      title: "Links and mentions from other sites",
      paragraphs: [
        "Links from other reputable websites remain a signal that a page is useful. For a small site, a handful of relevant local and industry links is worth far more than hundreds of low-quality ones.",
      ],
      sections: [
        {
          heading: "Ways to earn links",
          bullets: [
            "Get listed in genuine local and industry directories and associations.",
            "Partner with local organisations, events or schools and be mentioned on their sites.",
            "Publish something useful others will cite, such as a clear guide, a local price survey or a free tool.",
            "Offer to write for respected sites in your field.",
            "Ask suppliers and partners to link to you where it makes sense.",
          ],
        },
        {
          heading: "What to avoid",
          paragraphs: [
            "Buying links, swapping links in bulk, and posting links in comments and forums are against search engine guidelines. They rarely help and can lead to penalties. Offers of 'a thousand backlinks for Rs. 999' are a reliable sign of something to avoid.",
          ],
        },
      ],
    },
    {
      title: "Measuring what works",
      paragraphs: [
        "Without measurement, SEO is guesswork. Two free tools give a small site most of what it needs.",
      ],
      sections: [
        {
          heading: "Google Search Console",
          bullets: [
            "Performance: searches, clicks, impressions, click-through rate and position for each page and query.",
            "Pages: which pages are indexed and why others are not.",
            "Sitemaps: submit and check your sitemap.",
            "URL inspection: see how Google sees one page and request indexing.",
            "Core Web Vitals and security issues.",
          ],
        },
        {
          heading: "Analytics",
          paragraphs: [
            "An analytics tool shows what visitors do after they arrive: which pages they view, how long they stay, and whether they contact you, book or buy. Set up a few key events, such as form submissions and phone clicks, so you can see which pages bring real enquiries, not just visits.",
          ],
        },
        {
          heading: "Click-through rate",
          paragraphs: [
            "Click-through rate is clicks divided by impressions. A page with many impressions but a low rate may have a weak title or description for the searches it appears in. Rewriting the title to match those searches more clearly is often the quickest improvement available.",
          ],
          codes: [
            {
              caption: "Working out click-through rate.",
              code: code(["CTR = clicks / impressions x 100", "", "120 clicks / 4,000 impressions = 3.0 %"]),
            },
          ],
        },
        {
          heading: "Be patient",
          paragraphs: [
            "Changes take time to show: days for titles to update, weeks or months for rankings to settle. Change one thing at a time where possible, note the date, and compare a few weeks before and after.",
          ],
        },
      ],
    },
  ],

  scenarioIntro:
    "Small sites, real problems: what went wrong, what was changed, and what happened next.",

  scenarios: [
    {
      title: "The site that vanished after a redesign",
      paragraphs: [
        "A coaching centre in Kota relaunched its website with a new design. Within three weeks, enquiries from search fell to almost nothing. The new site looked better than the old one in every way.",
        "A friend who worked in web development checked robots.txt and found 'Disallow: /', left over from the developer's test site. Every page was blocked. Removing the line, submitting the sitemap again in Search Console and requesting indexing of key pages brought the site back over the following two weeks.",
        "The centre now has a launch checklist that includes robots.txt, noindex tags, redirects from old URLs and a sitemap check, and asks the developer to confirm each item before switching over.",
      ],
      lesson: "After any launch or redesign, check robots.txt and noindex first. One line can hide a whole site.",
    },
    {
      title: "Every page called 'Home'",
      paragraphs: [
        "A dental clinic in Indore had a website built from a template that gave every page the title 'Home | Smile Dental'. In Search Console, the clinic's service pages had impressions but almost no clicks.",
        "The owner rewrote each title around what the page offered and where: 'Root Canal Treatment in Indore | Smile Dental', 'Braces and Aligners in Indore | Smile Dental', and so on. She checked each in the SERP snippet preview to see it would not be cut.",
        "Over the next two months, clicks to the service pages roughly tripled, though rankings changed little. The pages had been appearing all along; they simply had not given searchers a reason to click.",
      ],
      lesson: "Unique, specific titles are among the fastest gains. Search Console shows where impressions are not turning into clicks.",
    },
    {
      title: "Two pages fighting each other",
      paragraphs: [
        "A home bakery in Chennai had two blog posts about eggless cakes, one from 2023 and one from 2025, both targeting 'eggless cake recipe'. Neither ranked well, and Search Console showed them alternating for the same search.",
        "The owner merged them into one updated, fuller recipe on the newer page, added photos of each stage, and set up a 301 redirect from the older address. Within six weeks the combined page ranked higher than either had alone.",
        "She now checks whether she already has a page on a topic before writing a new one, and updates the existing page instead when she has something to add.",
      ],
      lesson: "Two pages for the same search compete. Merge them and redirect the weaker one.",
    },
    {
      title: "A clinic invisible on the map",
      paragraphs: [
        "A physiotherapist in Pune had a good website but rarely appeared in the map results when people nearby searched for physiotherapy. She had never claimed her Google Business Profile.",
        "She claimed and verified it, chose 'Physiotherapist' as the primary category, added hours, services, photos of the clinic and a booking link, and began asking satisfied patients for reviews with a short link printed on appointment cards.",
        "Within three months she appeared in the map results for her area, and the profile's insights showed more calls than her website's contact form brought in. For a local business, the profile was as important as the site.",
      ],
      lesson: "For local businesses, a complete, verified Business Profile and steady genuine reviews matter as much as the website.",
    },
    {
      title: "Keyword stuffing that backfired",
      paragraphs: [
        "A travel agency in Jaipur repeated 'Rajasthan tour packages' more than forty times on its home page, including in white text on a white background, on advice from a cheap SEO service. Rankings fell rather than rose.",
        "A new manager removed the hidden text and rewrote the page for visitors: a clear summary of the tours offered, prices, sample itineraries and real photos. The phrase now appeared naturally a few times.",
        "Rankings recovered over several months, and the bounce rate fell because visitors found what they wanted. The manager cancelled the SEO service, which had also been buying links from irrelevant sites.",
      ],
      lesson: "Write for readers. Repetition and hidden text are spam signals, not shortcuts.",
    },
    {
      title: "Images that slowed a shop",
      paragraphs: [
        "An online saree shop in Surat had product photos of 4 to 6 MB each. Product pages took eight seconds or more to show the main image on a phone, and PageSpeed Insights rated LCP as poor.",
        "The owner resized the photos to 1600 pixels wide and saved them as WebP at about 75 percent quality, bringing each to under 200 KB. She also set width and height on the image tags so the layout did not jump.",
        "LCP fell to under 2.5 seconds on most pages. More visitors stayed to browse, and mobile sales rose noticeably over the next two months.",
      ],
      lesson: "Large images are the most common cause of slow pages. Resize and compress them first.",
    },
    {
      title: "A moved page without a redirect",
      paragraphs: [
        "A chartered accountant in Ahmedabad reorganised her site, moving her popular guide to filing ITR from /blog/itr-guide to /guides/how-to-file-itr. She did not add a redirect.",
        "The old address, which had links from several news and forum sites, started returning an error. Traffic to the guide dropped by more than half, because the new address started with no history.",
        "Adding a 301 redirect from the old address to the new one restored most of the traffic within a few weeks. She now keeps a list of every address change and its redirect.",
      ],
      lesson: "When you move a page, redirect the old address with a 301.",
    },
    {
      title: "A description that matched the search",
      paragraphs: [
        "A yoga studio in Rishikesh had a teacher training page that ranked on the first page for '200 hour yoga teacher training Rishikesh' but received few clicks. Its description talked about the studio's philosophy.",
        "The owner rewrote it to cover what searchers compared: course dates, duration, price range, accommodation and certification. 'Four-week residential course, Yoga Alliance certified, accommodation and meals included. Next batches: Jan and Mar 2027. Fees from Rs. 1.4 lakh.'",
        "Click-through rate roughly doubled. The page's ranking had not changed; its snippet now answered the questions searchers had before clicking.",
      ],
      lesson: "Write descriptions that answer the questions searchers have before they click.",
    },
    {
      title: "Thin location pages",
      paragraphs: [
        "A pest control company in Hyderabad created 120 pages, one for each neighbourhood, with identical text except the area name. After an initial rise, traffic to most of them fell and many were not indexed.",
        "The company kept pages only for the six areas where it had teams, and rewrote each with real information: the team's base, typical problems in that area, sample jobs with photos, and local reviews. The other 114 pages were redirected to the main service page.",
        "Fewer pages, each genuinely useful, brought more enquiries than the 120 copies had. Search Console showed all six pages indexed.",
      ],
      lesson: "Location pages need real local content. Near-identical pages for many areas are treated as low quality.",
    },
    {
      title: "Reviews that were not real",
      paragraphs: [
        "A restaurant in Kolkata paid a service for fifty five-star reviews. Within weeks, many were removed by the platform, and the profile showed a warning to visitors that suspicious reviews had been taken down.",
        "The owner started asking real diners for reviews with a small card on each table and replied to every review, thanking positive ones and addressing problems raised in negative ones.",
        "Over six months the rating settled at a genuine 4.3, with over two hundred reviews. Diners mentioned in their reviews that the owner's replies showed he cared.",
      ],
      lesson: "Fake reviews are removed and damage trust. Ask real customers and reply to every review.",
    },
    {
      title: "A blog post that answered the question",
      paragraphs: [
        "A financial planner in Bengaluru wrote a 2,500-word post titled 'Everything about mutual funds'. It ranked for nothing in particular.",
        "She replaced it with several focused posts, each answering one question her clients asked, such as 'How much SIP do I need for Rs. 1 crore in 15 years?', with a worked example and a link to a calculator. Each started with the answer and then explained the assumptions.",
        "Several of the focused posts reached the first page within months and brought enquiries from people who had used the worked examples. One clear answer per page worked far better than one page about everything.",
      ],
      lesson: "Focused pages that answer one real question well tend to rank and convert better than broad overviews.",
    },
    {
      title: "Duplicate pages from tracking links",
      paragraphs: [
        "An electronics shop in Delhi shared product links with tracking parameters in WhatsApp campaigns, such as ?utm_source=whatsapp. Search Console started showing these versions as separate pages, some indexed instead of the clean URLs.",
        "The developer added canonical tags on every product page pointing to the clean address, and made sure internal links never included tracking parameters.",
        "Within a few weeks, Search Console showed the clean URLs as the indexed versions, and the duplicates were reported as 'Alternate page with proper canonical tag', which is expected.",
      ],
      lesson: "Use canonical tags so tracking and other parameter URLs consolidate on one clean address.",
    },
    {
      title: "A free tool that earned links",
      paragraphs: [
        "A small accounting firm in Pune built a simple HRA exemption calculator on its site, with a clear explanation of the rules underneath. It took a few days to build.",
        "Over the following year, personal finance blogs, a college placement cell and two local news articles linked to it as a helpful resource. The calculator page ranked well, and the links lifted the firm's other pages too.",
        "The firm keeps the calculator updated each time the rules change and adds a short note at the top with the date it was last checked.",
      ],
      lesson: "Genuinely useful resources earn links naturally. Keep them accurate and dated.",
    },
    {
      title: "Search Console showed what customers wanted",
      paragraphs: [
        "A furniture maker in Jodhpur looked at Search Console for the first time and found that many impressions came from searches like 'sheesham wood bed price' and 'solid wood dining table 6 seater price', but his pages showed no prices.",
        "He added price ranges and dimensions to each product page and a short guide comparing wood types. He also created a page answering 'How much does a custom wooden bed cost?' with examples.",
        "Clicks and enquiries rose, and customers arrived knowing the price range, which made conversations shorter. Search Console had shown him exactly what his customers wanted to know.",
      ],
      lesson: "The searches in Search Console show what customers want to know. Answer them on your pages.",
    },
    {
      title: "A site that was not secure",
      paragraphs: [
        "A small NGO in Bhopal still ran its site on http. Browsers showed 'Not secure' next to the address, and the donation page made some visitors hesitate.",
        "Its host offered a free SSL certificate. The volunteer who managed the site enabled it, redirected all http addresses to https with 301 redirects, updated internal links, and submitted the https sitemap in Search Console.",
        "The warning disappeared, and the donation page's completion rate improved. HTTPS is a small ranking signal, but the trust it gives visitors matters more.",
      ],
      lesson: "Use HTTPS everywhere, redirect http to https, and update internal links and the sitemap.",
    },
    {
      title: "Layout that jumped",
      paragraphs: [
        "A news blog in Lucknow had an ad slot that loaded after the article text, pushing the text down just as readers started reading. Visitors complained of tapping the wrong links, and the CLS score was poor.",
        "The developer reserved space for the ad with a fixed height, so the text stayed in place while the ad loaded. Images also got width and height attributes.",
        "CLS dropped to well under 0.1, and complaints stopped. Readers stayed longer, and ad revenue did not fall.",
      ],
      lesson: "Reserve space for ads, images and embeds so the layout does not jump while loading.",
    },
  ],

  problemIntro:
    "Work each problem before reading the working. Titles and descriptions have many good answers; the working shows one and why.",

  problems: [
    {
      title: "Rewrite a title",
      q: ["Improve the title 'Services | ABC Tutors' for a page about maths tuition for classes 9 and 10 in Thane."],
      steps: ["Lead with the topic in searchers' words; add place; brand last."],
      answer: "'Maths Tuition for Class 9 and 10 in Thane | ABC Tutors'.",
    },
    {
      title: "Title length",
      q: ["A title is 78 characters. What is likely to happen in Google's results, and what would you do?"],
      steps: ["Titles are cut at about 580 to 600 pixels, usually 50 to 60 characters."],
      answer: "It will probably be cut with an ellipsis, or rewritten. Shorten it to about 55 characters with the main topic first.",
    },
    {
      title: "Write a description",
      q: ["Write a meta description of about 150 characters for a tiffin service in Koramangala offering North Indian veg meals, monthly plans and office delivery."],
      steps: ["What, where, key options, call to action."],
      answer: "'Home-style North Indian veg tiffins delivered to homes and offices in Koramangala. Daily, weekly and monthly plans. See menu and order online.'",
    },
    {
      title: "Click-through rate",
      q: ["A page had 6,400 impressions and 96 clicks last month. What is its CTR?"],
      steps: ["96 / 6400 x 100"],
      answer: "1.5 percent.",
    },
    {
      title: "CTR change",
      q: ["After a title rewrite, the same page had 6,100 impressions and 214 clicks. How did CTR change?"],
      steps: ["214 / 6100 x 100 = 3.5 percent", "From 1.5 to 3.5 percent"],
      answer: "CTR rose from 1.5 to about 3.5 percent, more than doubling, while impressions were similar.",
    },
    {
      title: "Intent",
      q: ["Classify the intent: 'best laptop under 60000', 'hp service centre andheri', 'how to clean laptop keyboard', 'buy hp victus 15'."],
      steps: ["Compare, visit, learn, act."],
      answer: "Compare; visit (local); learn; act (buy).",
    },
    {
      title: "Pick the page type",
      q: ["The top results for 'gst registration process' are all step-by-step guides. You run a CA firm. What page should you create?"],
      steps: ["Match the intent shown by the results."],
      answer: "A clear step-by-step guide to GST registration, with a link to your paid registration service, rather than a sales page alone.",
    },
    {
      title: "Duplicate URLs",
      q: ["These all show the same page: http://example.in/fees, https://example.in/fees, https://www.example.in/fees/, https://www.example.in/fees?ref=wa. What do you do?"],
      steps: ["Pick one canonical version.", "Redirect protocol and host variants.", "Canonical tag handles parameters."],
      answer: "Choose https://www.example.in/fees (with or without slash, consistently); 301-redirect the http and non-www versions; add a canonical tag pointing to it so the ?ref version consolidates.",
    },
    {
      title: "robots.txt reading",
      q: ["What does this robots.txt do? 'User-agent: *' then 'Disallow: /'."],
      steps: ["All crawlers; disallow everything."],
      answer: "It blocks all crawlers from crawling the entire site. On a live site, this is almost always a mistake.",
    },
    {
      title: "Keep out of results",
      q: ["You want a thank-you page kept out of search results. Should you block it in robots.txt?"],
      steps: ["Blocking stops crawling, so a noindex tag would not be seen."],
      answer: "No. Allow crawling and add a noindex meta tag, or leave it unlinked and out of the sitemap. Blocking in robots.txt can leave it indexed without content if something links to it.",
    },
    {
      title: "Sitemap limits",
      q: ["A site has 120,000 product URLs. How many sitemap files are needed at minimum, and how are they tied together?"],
      steps: ["50,000 URLs per file.", "120,000 / 50,000 = 2.4, so 3 files."],
      answer: "At least 3 sitemap files, listed in a sitemap index file that you submit.",
    },
    {
      title: "Sitemap errors",
      q: ["A sitemap for an https site lists http URLs, a redirecting URL and an admin page. What should change?"],
      steps: ["List canonical, working, indexable URLs only."],
      answer: "Use https URLs, list the redirect's destination instead of the redirecting URL, and remove the admin page.",
    },
    {
      title: "LCP",
      q: ["A page's LCP is 4.1 seconds; the main image is a 3.8 MB JPG shown at 900 pixels wide. What would you try first?"],
      steps: ["Image is the likely LCP element and is far too heavy."],
      answer: "Resize to about 1800 pixels wide and compress as WebP or JPG at about 75 to 80 percent, aiming for under 200 KB; then retest.",
    },
    {
      title: "CLS cause",
      q: ["Text jumps down when a banner loads above it. Which measure suffers and what is the fix?"],
      steps: ["Layout movement is CLS."],
      answer: "Cumulative Layout Shift. Reserve the banner's space with fixed dimensions so content does not move.",
    },
    {
      title: "Internal link text",
      q: ["Improve: 'To learn more about our fees, click here.'"],
      steps: ["Make the link text describe the destination."],
      answer: "'See our [physiotherapy fees and packages].'",
    },
    {
      title: "URL",
      q: ["Suggest a URL for a page titled 'How to Choose a Water Purifier for Hard Water' on example.in/blog."],
      steps: ["Short, lowercase, hyphens, key words."],
      answer: "example.in/blog/water-purifier-for-hard-water",
    },
    {
      title: "Redirect type",
      q: ["You have permanently moved /pricing to /plans. Which redirect should you use?"],
      steps: ["Permanent move."],
      answer: "A 301 (permanent) redirect from /pricing to /plans.",
    },
    {
      title: "Merging pages",
      q: ["You have 'GST filing services' and 'GST return filing help' pages with similar content. What do you do?"],
      steps: ["Combine into the stronger page; redirect the other."],
      answer: "Merge the best content into one page, keep the address with more links or traffic, and 301-redirect the other to it.",
    },
    {
      title: "Business name",
      q: ["A salon's signboard says 'Glow Studio'. The owner wants its Business Profile name to be 'Glow Studio Best Salon Bridal Makeup Andheri'. Is that wise?"],
      steps: ["Profiles should use the real business name."],
      answer: "No. Adding keywords breaks Google's guidelines and risks suspension. Use 'Glow Studio' and describe services elsewhere in the profile.",
    },
    {
      title: "Review reply",
      q: ["Write a two-sentence reply to a review: 'Waited 40 minutes past my appointment time.'"],
      steps: ["Apologise, explain or fix, invite contact."],
      answer: "'We're sorry you waited so long; that's not the experience we want for anyone. We've changed how we schedule evening appointments, and we'd be glad to hear more at 98xxxxxx10.'",
    },
    {
      title: "Search Console reason",
      q: ["Search Console says a page is 'Crawled - currently not indexed'. What does that suggest and what can you do?"],
      steps: ["Google saw it and chose not to index it yet."],
      answer: "Google found the page but did not consider it worth indexing yet, often because it is thin or similar to others. Improve its content, link to it from relevant pages, and check it is not a near-duplicate.",
    },
    {
      title: "Average position",
      q: ["A query shows average position 8.4 with 2,000 impressions and 30 clicks. What is the CTR and what might help?"],
      steps: ["30 / 2000 x 100 = 1.5 percent."],
      answer: "1.5 percent. The page is near the bottom of page one; improving the title and description and strengthening the content could raise both position and CTR.",
    },
    {
      title: "Alt text",
      q: ["Write alt text for a photo on a bakery's page showing a two-tier eggless chocolate cake with gold leaf."],
      steps: ["Describe what matters to the page."],
      answer: "'Two-tier eggless chocolate cake decorated with gold leaf.'",
    },
    {
      title: "H1",
      q: ["A page's only h1 is the logo text 'Sharma Physio'. Its topic is knee physiotherapy. What should change?"],
      steps: ["The main heading should state the page topic."],
      answer: "Make the page's main heading 'Physiotherapy for Knee Pain' and keep the logo as an image or ordinary text.",
    },
    {
      title: "Before and after test",
      q: ["You rewrote ten titles on 1 September. How do you check whether it helped?"],
      steps: ["Compare equal periods before and after, allowing time for updates."],
      answer: "In Search Console, compare clicks and CTR for those pages over, say, four weeks from mid-September with the four weeks before 1 September, and check impressions were similar.",
    },
  ],

  exercises: {
    warmup: [
      { q: "Name the three jobs a search engine does.", a: "Crawl, index, rank." },
      { q: "Roughly how many characters fit in a Google title on desktop?", a: "About 50 to 60, depending on letter widths." },
      { q: "Does the meta description directly affect ranking?", a: "No, but it affects whether people click." },
      { q: "What does a 301 redirect mean?", a: "The page has moved permanently to a new address." },
      { q: "What does 'Disallow: /' in robots.txt do?", a: "Blocks all crawling of the site." },
      { q: "What are the three Core Web Vitals?", a: "LCP, INP and CLS." },
    ],
    practice: [
      { q: "Write a title for a page offering spoken English classes for adults in Lucknow, brand 'Speak Easy'.", a: "'Spoken English Classes for Adults in Lucknow | Speak Easy'." },
      { q: "Calculate CTR for 45 clicks from 1,800 impressions.", a: "2.5 percent." },
      { q: "List three free ways to find what people search for.", a: "Search suggestions; 'People also ask' and related searches; Search Console's Performance report." },
      { q: "Write a short URL for 'Monsoon Skin Care Tips for Oily Skin'.", a: "/blog/monsoon-skin-care-oily-skin" },
      { q: "What should a local business's name be on its Business Profile?", a: "Its real name as used on signage and documents, without added keywords." },
      { q: "Name two causes of slow pages.", a: "Large images; too many scripts or plugins. Others: slow hosting, heavy embeds." },
    ],
    stretch: [
      { q: "Explain why robots.txt is the wrong tool for keeping a page out of results.", a: "It only stops crawling. The URL can still be indexed from links, and a noindex tag on the page cannot be seen if crawling is blocked." },
      { q: "Plan a launch checklist for a redesigned site.", a: "Remove test blocks (robots.txt, noindex); 301 redirects from every old URL; check titles and descriptions; submit sitemap; inspect key URLs; check mobile and speed; monitor Search Console for errors for a few weeks." },
      { q: "Rewrite a weak description for a page selling refurbished phones in Delhi.", a: "'Refurbished iPhones and Android phones in Delhi, tested with 12-month warranty. Compare prices, check condition grades and get same-day delivery.'" },
      { q: "A blog has 30 short posts on similar topics. What would you do?", a: "Group them by topic, merge overlapping posts into fuller guides, redirect the old URLs, and update internal links." },
      { q: "How do you decide whether a topic needs a guide or a product page?", a: "Look at what ranks for the search; match the intent shown by the top results." },
    ],
    challenge: [
      { q: "Design a three-month SEO plan for a new dental clinic site.", a: "Month 1: Business Profile, site basics (titles, HTTPS, speed, sitemap, Search Console), service pages. Month 2: local directories, reviews routine, FAQ-style articles from patient questions. Month 3: review Search Console data, improve titles with low CTR, add content for searches with impressions but no page." },
      { q: "Explain how to handle 50 near-identical location pages.", a: "Keep pages only where you have a real presence and make each genuinely local; redirect the others to a main service page or nearest real location; remove them from the sitemap." },
      { q: "Write guidelines for using AI to help write site content.", a: "Use for drafts and editing; a knowledgeable person checks facts, adds first-hand experience and examples, and approves; no mass publishing of unchecked pages; disclose authorship on articles; update when facts change." },
      { q: "A competitor offers to swap 100 links. What do you advise?", a: "Decline. Bulk link exchanges are against guidelines and can harm both sites. Pursue relevant, earned links instead." },
      { q: "How would you measure whether SEO work is producing business?", a: "Track enquiries, bookings or sales from organic search in analytics with key events, alongside Search Console clicks; compare periods; note dates of changes." },
    ],
  },

  faqs: [
    {
      group: "Basics",
      items: [
        ["How long does SEO take to work?", "Simple fixes such as titles can show in days or weeks. New pages and sites often take several months to rank. Steady, consistent work over a year usually beats a burst of activity."],
        ["Do I need to pay for SEO?", "Not necessarily. A small site owner can do most of what matters: clear pages, good titles, a Business Profile, speed and Search Console. Paid help is useful for technical problems or competitive markets, but avoid anyone who guarantees rankings."],
        ["Can anyone guarantee first place on Google?", "No. Nobody controls Google's ranking. Promises of guaranteed positions are a warning sign."],
        ["Are meta keywords still used?", "No. Google has ignored the meta keywords tag for many years. Spend the time on titles, descriptions and content."],
        ["Does posting on social media help SEO?", "Not directly, but it can bring visitors and attention that lead to links and mentions. It also helps customers find you on platforms they use."],
        ["Is SEO different for Bing?", "The principles are the same. Bing Webmaster Tools is free and worth setting up alongside Search Console; Bing also supplies results to some other services."],
        ["What is Google Search Console?", "A free Google tool that shows how your site appears in search: queries, clicks, indexing status, errors and more. Every site owner should set it up."],
      ],
    },
    {
      group: "Titles, descriptions and content",
      items: [
        ["How long should a title be?", "About 50 to 60 characters, which usually fits within Google's roughly 580 to 600 pixel limit. Put the main words first in case it is cut."],
        ["How long should a meta description be?", "About 120 to 158 characters. Focus on what the page offers and why it is worth clicking, rather than the exact length."],
        ["Why does Google show a different description?", "It often picks text from the page that better matches a specific search. A clear, accurate description is still worth writing; it is used often."],
        ["How often should I update content?", "When facts change, and when you have something useful to add. Changing dates without changing content does not help and can mislead readers."],
        ["Should I add an FAQ section to every page?", "Only where real customers have those questions. FAQs can help readers, but Google now shows FAQ rich results mainly for authoritative government and health sites."],
        ["How many keywords should a page target?", "One main topic, plus naturally related terms. Write for the topic and the reader rather than for a list of keywords."],
        ["Is it bad to have short pages?", "Not if they answer the need fully. Very thin pages with little unique value may not be indexed."],
        ["Can I copy content from other sites?", "No. Copied content rarely ranks, may break copyright, and adds no value. Quote briefly with credit when needed."],
      ],
    },
    {
      group: "Technical",
      items: [
        ["What is a sitemap and do I need one?", "A file listing the pages you want indexed. Most platforms make one automatically. Submit it in Search Console; it helps search engines find pages, especially new ones."],
        ["What is robots.txt?", "A file telling crawlers which paths not to crawl. It does not remove pages from results; use noindex for that."],
        ["What is a canonical tag?", "A tag that tells search engines which URL is the main version of a page when several URLs show the same content."],
        ["Does HTTPS matter?", "Yes. Browsers warn visitors on http sites, and HTTPS is a small ranking signal. Most hosts provide free certificates."],
        ["Do I need a fast website?", "A reasonably fast one. Speed affects visitors more than rankings, but poor Core Web Vitals and slow mobile pages lose customers."],
        ["What is structured data?", "Code that describes a page's content, such as a business's address or a product's price, in a standard format. It can enable richer results, such as review stars on products, when it meets the search engine's rules."],
        ["What is a 404 error?", "The response when a page does not exist. A few are normal; fix any that come from your own links or from important old URLs by redirecting them."],
        ["Should I use www or not?", "Either works. Choose one, redirect the other to it, and use it consistently."],
      ],
    },
    {
      group: "Local and links",
      items: [
        ["How do I appear in Google Maps results?", "Claim and complete your Google Business Profile, choose accurate categories, keep details consistent everywhere, and gather genuine reviews. Distance from the searcher also matters, which you cannot change."],
        ["How do I get more reviews?", "Ask satisfied customers soon after a good experience, give them a direct link, and make it easy. Never buy reviews or reward only positive ones."],
        ["Should I reply to negative reviews?", "Yes, calmly and helpfully. Future customers read replies to see how you handle problems."],
        ["Are directory listings useful?", "Genuine local and industry directories help customers and confirm your details. Avoid low-quality directories created only for links."],
        ["How do I get backlinks?", "Create useful resources, take part in your community and industry, and ask partners where a link makes sense. Do not buy links."],
        ["Does my domain name matter?", "Choose one that is short, memorable and matches your brand. Exact-match keyword domains no longer give special advantage."],
      ],
    },
    {
      group: "Problems",
      items: [
        ["My site disappeared from Google. What should I check first?", "robots.txt for 'Disallow: /', noindex tags, recent site changes, Search Console for manual actions or security issues, and whether the site is reachable. A redesign is the most common cause."],
        ["Why is my new page not indexed?", "It may be new, unlinked, thin, a duplicate or blocked. Link to it from relevant pages, add it to your sitemap, check for noindex, and request indexing in Search Console."],
        ["My rankings dropped after an update. What now?", "Read what the update targeted, compare your pages honestly with those that rose, and improve usefulness rather than chasing tricks. Recovery often takes until later updates."],
        ["What is a manual action?", "A penalty applied by a Google reviewer for breaking spam policies, shown in Search Console. Fix the problem and submit a reconsideration request."],
        ["Someone copied my content. What can I do?", "Contact the site owner, then the host. Google has a legal removal process for copyright infringement. Your original, being older and linked, usually still ranks."],
      ],
    },
  ],

  glossary: [
    ["Crawling", "Search engine programs finding pages by following links and sitemaps."],
    ["Indexing", "Storing and understanding pages so they can appear in results."],
    ["Ranking", "Ordering pages for a search."],
    ["SERP", "Search engine results page."],
    ["Title tag", "The HTML title shown as the headline in search results."],
    ["Meta description", "A short page summary that may appear in results."],
    ["Snippet", "The title, URL and description shown for a result."],
    ["CTR", "Click-through rate: clicks divided by impressions."],
    ["Impression", "One showing of your page in search results."],
    ["Search intent", "The purpose behind a search: learn, visit, compare or act."],
    ["Canonical URL", "The preferred address for a page with duplicates."],
    ["301 redirect", "A permanent redirect from one URL to another."],
    ["404", "The response for a page that does not exist."],
    ["robots.txt", "A file that tells crawlers which paths not to crawl."],
    ["noindex", "A tag telling search engines not to show a page in results."],
    ["XML sitemap", "A file listing URLs for search engines."],
    ["Internal link", "A link from one page to another on the same site."],
    ["Backlink", "A link to your site from another site."],
    ["Anchor text", "The clickable words of a link."],
    ["Core Web Vitals", "Google's measures of loading, responsiveness and layout stability."],
    ["LCP", "Largest Contentful Paint: when the main content appears."],
    ["INP", "Interaction to Next Paint: responsiveness to user input."],
    ["CLS", "Cumulative Layout Shift: how much the layout moves while loading."],
    ["Google Business Profile", "A free listing for businesses on Google Search and Maps."],
    ["Structured data", "Standard code describing page content for search engines."],
    ["Rich result", "A search result with extra features, such as stars or prices."],
    ["Keyword stuffing", "Unnatural repetition of search terms, treated as spam."],
    ["Manual action", "A penalty applied by a search engine reviewer."],
    ["Search Console", "Google's free tool for monitoring a site in search."],
    ["HTTPS", "The secure version of the web protocol."],
  ],

  references: [
    { title: "Search Engine Optimization (SEO) Starter Guide", who: "Google Search Central", where: "developers.google.com/search/docs", note: "Google's own introduction to making sites easy to find and understand." },
    { title: "Creating helpful, reliable, people-first content", who: "Google Search Central", where: "developers.google.com/search/docs/fundamentals/creating-helpful-content", note: "Questions to judge whether content serves people first." },
    { title: "Spam policies for Google web search", who: "Google Search Central", where: "developers.google.com/search/docs/essentials/spam-policies", note: "What counts as keyword stuffing, link schemes, scaled content abuse and other spam." },
    { title: "Build and submit a sitemap", who: "Google Search Central", where: "developers.google.com/search/docs/crawling-indexing/sitemaps", note: "Sitemap limits, formats and which fields Google uses." },
    { title: "Web Vitals", who: "web.dev (Google)", where: "web.dev/articles/vitals", note: "Definitions and thresholds for LCP, INP and CLS." },
    { title: "Guidelines for representing your business on Google", who: "Google Business Profile Help", where: "support.google.com/business", note: "Rules for business names, addresses and categories." },
    { title: "Bing Webmaster Guidelines", who: "Microsoft Bing", where: "bing.com/webmasters", note: "Bing's guidance, largely consistent with Google's." },
    { title: "Guidelines for prevention of fake reviews", who: "Bureau of Indian Standards, IS 19000:2022", where: "bis.gov.in", note: "Indian standard for online consumer reviews." },
    { title: "SEO tools", who: "FreeToolsPro", where: "freetoolspro.in/seo-tools", note: "SERP snippet preview, meta title checker and sitemap validator." },
  ],
};

// ---------------------------------------------------------------------------
// Second pass: fuller situations and answers, and chapters on structured data,
// languages, shop pages, images and video, audits and planning.

const scenarioMore = {
  "Two pages fighting each other":
    "She also updated the links in her other recipes that had pointed to the old post, so they went straight to the combined page instead of through the redirect.",
  "A clinic invisible on the map":
    "She also posted short updates on the profile every few weeks, such as new evening hours or a seasonal tip on posture for students during exams. These posts did not transform her ranking, but patients mentioned noticing them, and the profile looked active and cared for.",
  "Keyword stuffing that backfired":
    "He also learned that hidden text is listed among the specific spam practices search engines name in their policies. The old service had not just wasted money; it had put the business at risk of a manual action, which would have taken far longer to recover from.",
  "Images that slowed a shop":
    "She added a step to her listing routine: every new product photo goes through the compressor with the same settings before upload. A rule followed every time avoids the slow drift back to heavy pages that happens when photos are added in a hurry.",
  "A moved page without a redirect":
    "She also checked Search Console's report of pages with errors, which listed two more old addresses that external sites still linked to. She redirected those as well. Old links can keep sending visitors for years, so they are worth keeping alive. Her list of address changes now sits in the same folder as her site's backups, so whoever manages the site next will find it.",
  "A description that matched the search":
    "The owner also found that clearer descriptions brought better-suited enquiries. People who clicked already knew the dates and the price range, so fewer enquiries ended in 'Sorry, that's more than I expected.' The snippet was doing some of the qualifying that his staff used to do on the phone.",
  "Thin location pages":
    "The company also learned that the original pages had confused customers, some of whom called expecting a local office that did not exist. Being honest about where the teams were based reduced wasted calls and complaints, as well as improving search.",
  "Reviews that were not real":
    "He also learned that India's standard for online consumer reviews and the consumer protection rules treat fake and paid reviews seriously. The platform's warning label had probably cost him more customers than the purchased reviews ever brought. Recovering trust took longer than losing it.",
  "A blog post that answered the question":
    "She kept the original overview too, rewritten as a short hub page linking to each focused post, so readers who wanted the big picture still had a starting point. The hub and the focused posts linked to each other, helping both readers and search engines see how the topics fitted together.",
  "Duplicate pages from tracking links":
    "The marketing team also stopped sharing links with long parameter strings where they were not needed, and used short tracking only for campaigns they actually measured. Fewer parameters meant fewer odd URLs for search engines to sort out in the first place, and campaign reports became easier to read too. The developer added a check to the site's monthly maintenance list to look for any new parameter URLs appearing in Search Console.",
  "A free tool that earned links":
    "The firm noticed that the people who used the calculator often became clients when their tax situation got more complicated. The tool built trust before the first conversation. It cost less than a month of advertising and kept working for years, which made it the firm's best marketing investment.",
  "Search Console showed what customers wanted":
    "He set a reminder to look at Search Console once a month for new searches that brought impressions but no clicks. Each time, the list suggested one or two pages to improve or create. The habit took twenty minutes a month and kept the site in step with what customers were asking.",
  "A site that was not secure":
    "The volunteer also checked that images and scripts on the pages loaded over https, because a single http image on an https page can trigger a 'mixed content' warning in some browsers. A quick scan of the page source for 'http://' found three images to fix. She then ran through the donation flow on her own phone to confirm every step showed the padlock and nothing was blocked.",
  "Layout that jumped":
    "The developer also added a note in the site's code explaining why the ad slot had a fixed height, so a future developer would not remove it to 'tidy up'. Small fixes that prevent problems are easily undone by someone who does not know why they were made.",
};
for (const s of book.scenarios) if (scenarioMore[s.title]) s.paragraphs.push(scenarioMore[s.title]);

const faqMore = {
  "Can anyone guarantee first place on Google?": " Rankings depend on the search engine, competitors and each searcher's location and history. A good adviser promises work and transparency, not positions.",
  "Should I use www or not?": " Make sure every internal link and your sitemap use the chosen version too, so there is no mix of addresses.",
  "Should I reply to negative reviews?": " Thank the reviewer, address the specific problem, and offer to continue the conversation privately. Do not argue or reveal private details, even if the review seems unfair.",
};
for (const g of book.faqs) g.items = g.items.map(([q, a]) => [q, faqMore[q] ? a + faqMore[q] : a]);

book.chapters.push(
  {
    title: "Structured data, simply",
    paragraphs: [
      "Structured data is a small block of code that describes facts on a page in a standard vocabulary, schema.org, so search engines can read them reliably. It does not make a page rank higher by itself, but it can make a result richer and help search engines understand your business.",
    ],
    sections: [
      {
        heading: "Useful types for small sites",
        table: {
          caption: "Types worth considering.",
          headers: ["Type", "For", "What it can enable"],
          widths: [1.4, 2, 2.2],
          rows: [
            ["LocalBusiness", "Shops, clinics, offices", "Clear business details for search engines"],
            ["Product with Offer", "Shop product pages", "Price and availability in results"],
            ["Review / AggregateRating", "Products", "Stars, under strict rules"],
            ["Article", "News and blog posts", "Better understanding of author and date"],
            ["BreadcrumbList", "Sites with sections", "A readable path instead of a raw URL"],
            ["Event", "Classes, workshops, shows", "Dates and venue in results"],
          ],
        },
      },
      {
        heading: "An example",
        codes: [
          {
            caption: "JSON-LD for a local clinic, placed in the page's head.",
            code: code([
              "<script type=\"application/ld+json\">",
              "{",
              "  \"@context\": \"https://schema.org\",",
              "  \"@type\": \"MedicalClinic\",",
              "  \"name\": \"Sharma Physio\",",
              "  \"telephone\": \"+91-20-5555-0123\",",
              "  \"address\": {",
              "    \"@type\": \"PostalAddress\",",
              "    \"streetAddress\": \"12 North Main Road, Koregaon Park\",",
              "    \"addressLocality\": \"Pune\",",
              "    \"postalCode\": \"411001\",",
              "    \"addressCountry\": \"IN\"",
              "  },",
              "  \"openingHours\": \"Mo-Sa 09:00-20:00\",",
              "  \"url\": \"https://www.example.in/\"",
              "}",
              "</script>",
            ]),
          },
        ],
      },
      {
        heading: "Rules that matter",
        bullets: [
          "Mark up only what is visible on the page and true.",
          "Do not add review stars for reviews you wrote or that are not on the page.",
          "Keep prices and availability in step with the page.",
          "Test with Google's Rich Results Test and fix errors.",
          "Expect search engines to decide whether to show rich results; markup is a request, not a guarantee.",
        ],
      },
      {
        heading: "What changed recently",
        paragraphs: [
          "Search engines change which rich results they show. In 2023 Google limited FAQ rich results to well-known authoritative government and health sites and stopped showing HowTo rich results. Structured data for these types does no harm, but do not expect visual extras from it. Check the current documentation before investing time in a type.",
        ],
      },
    ],
  },
  {
    title: "Sites in more than one language",
    paragraphs: [
      "Many Indian businesses serve customers in English and in Hindi or a regional language. Search engines handle multilingual sites well when each language version is a proper page of its own.",
    ],
    sections: [
      {
        heading: "Separate pages per language",
        paragraphs: [
          "Give each language its own URL, such as example.in/en/ and example.in/hi/, rather than switching text on the same address with a button. Search engines can then index each version and show the right one to each searcher.",
        ],
      },
      {
        heading: "hreflang",
        paragraphs: [
          "The hreflang annotation tells search engines that pages are translations of each other. Each version lists all versions, including itself. Mistakes are common: missing return links, wrong language codes, or pointing to redirected URLs.",
        ],
        codes: [
          {
            caption: "In the head of both the English and Hindi pages.",
            code: code([
              "<link rel=\"alternate\" hreflang=\"en-IN\" href=\"https://www.example.in/en/fees\">",
              "<link rel=\"alternate\" hreflang=\"hi-IN\" href=\"https://www.example.in/hi/fees\">",
              "<link rel=\"alternate\" hreflang=\"x-default\" href=\"https://www.example.in/en/fees\">",
            ]),
          },
        ],
      },
      {
        heading: "Real translation",
        paragraphs: [
          "Machine translation is a good start but often sounds unnatural and can get key terms wrong. Have a fluent speaker check important pages, and use the words people actually search with, which in Hindi may mix English terms, such as 'home loan EMI calculator' typed in Devanagari or Roman script.",
        ],
      },
      {
        heading: "Romanised searches",
        paragraphs: [
          "Many people search Indian-language words in Roman letters, such as 'sasta flight ticket' or 'ghar ka khana delivery'. Look at Search Console to see which forms bring visitors, and use natural phrases that match them in titles and text where they fit.",
        ],
      },
    ],
  },
  {
    title: "Product and category pages for small shops",
    paragraphs: [
      "Online shops have particular SEO problems: many similar pages, thin manufacturer descriptions, and filters that create endless URLs. A few habits handle most of them.",
    ],
    sections: [
      {
        heading: "Product pages",
        bullets: [
          "Write your own description: materials, sizes, care, who it suits, what is in the box.",
          "Show the price, availability and delivery time clearly.",
          "Use several real photos, including close-ups and scale.",
          "Answer common questions on the page, such as fit, washing or warranty.",
          "Show genuine customer reviews.",
          "Add Product structured data with price and availability.",
        ],
      },
      {
        heading: "Category pages",
        paragraphs: [
          "Category pages, such as 'Cotton sarees' or 'Wooden dining tables', often rank for broader searches than single products. Give each a short helpful introduction, clear filters and good product names. Avoid long blocks of keyword-heavy text pushed below the products; a few useful sentences are better.",
        ],
      },
      {
        heading: "Filters and sorting",
        paragraphs: [
          "Filters for colour, size and price can create thousands of URL combinations with the same products in different orders. Keep the main category pages indexable, point filtered versions to the main category with a canonical tag or keep them out of the index, and do not list filter URLs in the sitemap.",
        ],
      },
      {
        heading: "Out-of-stock products",
        paragraphs: [
          "If a product will return, keep the page with an 'out of stock' notice and a link to similar items. If it is gone for good and has a close replacement, redirect to the replacement; if not, let the page return a 404 or link to the category. Avoid redirecting everything to the home page, which confuses visitors.",
        ],
      },
      {
        heading: "Marketplaces and your own site",
        paragraphs: [
          "Many small sellers use marketplaces as well as their own site. Product descriptions copied word for word from your site to a marketplace, or the reverse, may mean the marketplace page outranks yours. Write a fuller description on your own site, with information and photos the marketplace listing lacks.",
        ],
      },
    ],
  },
  {
    title: "Images and video in search",
    paragraphs: [
      "Images and videos can bring visitors through image search, video results and the videos tab, and they make pages more useful.",
    ],
    sections: [
      {
        heading: "Images",
        bullets: [
          "Use descriptive file names, such as 'eggless-chocolate-cake.webp', not 'IMG_4432.jpg'.",
          "Write alt text that describes the image for people who cannot see it.",
          "Place images near related text on the page.",
          "Resize and compress them; aim for under 200 KB for large images.",
          "Use original photos where possible; stock photos add little.",
        ],
      },
      {
        heading: "Video",
        paragraphs: [
          "If you make videos, give each a page or a clear place on a relevant page, with a title and description in words. YouTube itself is a large search engine; a good title, description and thumbnail there can bring customers who never use your site's search. Embedding a YouTube video on a page with a written summary serves both audiences.",
        ],
      },
      {
        heading: "Link previews",
        paragraphs: [
          "When people share your pages in WhatsApp or on social media, Open Graph tags decide the title, description and image shown. Set an image of 1200 x 630 pixels and a clear title for important pages, and check how a shared link looks before a campaign.",
        ],
        codes: [
          {
            caption: "Open Graph tags in the head.",
            code: code([
              "<meta property=\"og:title\" content=\"Knee Pain Physiotherapy in Pune\">",
              "<meta property=\"og:description\" content=\"Evening slots in Koregaon Park.\">",
              "<meta property=\"og:image\" content=\"https://www.example.in/img/og-knee.jpg\">",
            ]),
          },
        ],
      },
    ],
  },
  {
    title: "A site audit in one afternoon",
    paragraphs: [
      "Every six months or so, and always after a redesign, a short audit catches most problems before they cost visitors. It needs Search Console, a browser and a phone.",
    ],
    sections: [
      {
        heading: "Indexing and access",
        steps: [
          "Open robots.txt and check nothing important is blocked.",
          "In Search Console, open the Pages report and read the reasons pages are not indexed.",
          "Inspect the home page and two key pages with URL inspection.",
          "Check the sitemap is submitted, has no errors and lists only canonical, working URLs.",
          "Check that http and non-preferred host versions redirect to the preferred address.",
        ],
      },
      {
        heading: "Titles and content",
        steps: [
          "List your main pages and their titles; fix duplicates, missing ones and those over about 60 characters.",
          "In Search Console Performance, sort pages by impressions and look for low CTR.",
          "Look for pages targeting the same search and merge where needed.",
          "Check facts, prices and dates on key pages are current.",
          "Check every important page is linked from a menu or relevant page.",
        ],
      },
      {
        heading: "Experience",
        steps: [
          "Open key pages on a phone on mobile data and note anything slow or awkward.",
          "Run PageSpeed Insights on the home page and a typical inner page.",
          "Check forms and phone links work.",
          "Check for broken links on main pages.",
        ],
      },
      {
        heading: "Local",
        steps: [
          "Check your Business Profile's hours, phone, address, categories and photos.",
          "Reply to any unanswered reviews.",
          "Search for your business name and check listings show the same details.",
        ],
      },
      {
        heading: "Write it down",
        paragraphs: [
          "Record what you found, what you changed and the date in a simple document. Next time, start by checking whether the earlier fixes held. Over a year, the record shows which changes made a difference.",
        ],
      },
    ],
  },
  {
    title: "A content plan for a year",
    paragraphs: [
      "Small sites rarely fail because of technical problems alone. More often, they stop adding anything useful after launch. A modest, steady plan beats bursts of activity.",
    ],
    sections: [
      {
        heading: "Collect questions",
        paragraphs: [
          "Keep a running list of questions customers ask, from calls, emails, counters and reviews, and from Search Console searches with impressions but no good page. Each question is a candidate for a page or a section of one.",
        ],
      },
      {
        heading: "A realistic pace",
        paragraphs: [
          "One or two good pages a month is enough for most small businesses. Each should answer one question well, with your own examples. Twelve to twenty-four strong pages in a year, kept up to date, build a site that serves customers and search engines alike.",
        ],
      },
      {
        heading: "Update before you add",
        paragraphs: [
          "Check your existing pages each quarter. Updating a page that already ranks, with new prices, rules or examples, often brings more benefit than a new page. Change the date on a page only when you change its content.",
        ],
      },
      {
        heading: "Seasonal topics",
        paragraphs: [
          "Plan around your customers' calendar: tax season for accountants in June and July, admissions for schools and coaching centres, festivals and weddings for shops and caterers, monsoon problems for pest control and repairs. Publish a few weeks before the season so pages have time to be indexed.",
        ],
      },
      {
        heading: "Measure and adjust",
        paragraphs: [
          "Every quarter, look at which pages brought clicks and enquiries. Write more about what worked, and improve or merge pages that brought nothing after six months.",
        ],
      },
    ],
  },
);

book.scenarios.push(
  {
    title: "A Hindi page that nobody found",
    paragraphs: [
      "A legal aid NGO in Patna added Hindi versions of its guides by placing a language switch button that replaced the English text on the same URL. Search Console showed almost no visits to the Hindi content, though the NGO's audience mostly preferred Hindi.",
      "Search engines saw only the default English version of each page. The volunteer developer gave each Hindi guide its own URL under /hi/, added hreflang links between the language pairs, included both versions in the sitemap and linked to the Hindi versions from a Hindi menu.",
      "Within two months, the Hindi guides were appearing for searches in Devanagari and for common Romanised phrases. Calls to the helpline from people who had read a Hindi guide rose, which had been the point all along.",
    ],
    lesson: "Give each language version its own URL and connect them with hreflang.",
  },
  {
    title: "Filter pages that flooded the index",
    paragraphs: [
      "A furniture shop in Bengaluru with 300 products found that Search Console reported over 40,000 discovered URLs. Each combination of colour, material, price and sort order had created a new address.",
      "The developer added canonical tags on filtered pages pointing to the main category page, stopped linking to sort-order URLs, and removed filter URLs from the sitemap. The main category and product pages remained indexable.",
      "Over the following months, the count of discovered-but-not-indexed URLs fell steadily, and crawling focused on product pages. New products began to appear in search within days rather than weeks.",
    ],
    lesson: "Keep filter and sort URLs from multiplying in the index; focus crawling on real category and product pages.",
  },
  {
    title: "A shop outranked by its own marketplace listing",
    paragraphs: [
      "A handloom weaver cooperative in Varanasi sold through its own site and a large marketplace, using the same short descriptions on both. For searches with the cooperative's product names, the marketplace listing nearly always appeared above its own site.",
      "The cooperative rewrote descriptions on its own site with the weaving technique, the weaver's name, the time each saree took, care instructions and many photos, and kept shorter descriptions on the marketplace. It also added a 'Meet the weavers' page.",
      "The cooperative's own pages began to rank for its product names and for searches about the technique. Sales on its own site, which earned a better margin, rose, while marketplace sales continued.",
    ],
    lesson: "Give your own site fuller, original content than your marketplace listings carry.",
  },
);

book.faqs.push(
  {
    group: "Structured data and languages",
    items: [
      ["Will structured data improve my rankings?", "Not directly. It helps search engines understand your pages and can make results richer, which may increase clicks. The content still has to be good."],
      ["Should I add FAQ structured data?", "It does no harm, but Google now shows FAQ rich results only for well-known government and health sites, so most small sites will not see a visual change."],
      ["How do I test structured data?", "Use Google's Rich Results Test or the Schema Markup Validator. Fix errors and warnings that apply to the features you want."],
      ["Should Hindi and English be on the same page?", "It is better to give each language its own URL and connect them with hreflang, so each version can be indexed and shown to the right searchers."],
      ["Is machine translation good enough for my site?", "It is a useful first draft, but have a fluent speaker check important pages. Awkward or wrong translations lose readers' trust."],
    ],
  },
  {
    group: "Shops and media",
    items: [
      ["Can I use the manufacturer's product descriptions?", "You can, but many other sites use the same text, so your page adds nothing new. Write your own descriptions with details and photos customers need."],
      ["What should I do with discontinued products?", "Redirect to a close replacement if there is one; otherwise show a helpful page with related products or let it return a 404. Do not redirect everything to the home page."],
      ["Do image file names matter?", "A little. Descriptive names help search engines and anyone who downloads the image. Alt text and the surrounding text matter more."],
      ["Should I host videos on my own site or YouTube?", "For most small businesses, YouTube with an embed on a relevant page works well: YouTube handles playback and brings its own search audience, and the page adds a written summary."],
      ["What are Open Graph tags?", "Tags that set the title, description and image shown when a page is shared on social media and chat apps. They do not affect ranking but affect how shared links look."],
    ],
  },
  {
    group: "Planning",
    items: [
      ["How often should I publish new content?", "A steady pace you can keep, such as one or two good pages a month, is better than many rushed pages. Updating existing pages counts too."],
      ["How do I choose what to write about?", "Start with customers' real questions and the searches in Search Console that show impressions but no strong page. Each well-answered question is a good page."],
      ["How often should I audit my site?", "Every six months, and always after a redesign, migration or major change. A short checklist takes an afternoon."],
      ["Should I hire an SEO agency?", "If you lack time or the site has technical problems, a reputable agency can help. Ask for clear reports, explanations of what they change and why, and avoid anyone promising guaranteed rankings or offering bulk links."],
    ],
  },
);

book.problems.push(
  {
    title: "Structured data honesty",
    q: ["A shop wants to add five-star review markup to every product page, though it has no reviews on the site. Is that acceptable?"],
    steps: ["Markup must reflect visible, genuine content."],
    answer: "No. Review markup must describe genuine reviews shown on the page. Adding it without reviews breaks the rules and can lead to a manual action.",
  },
  {
    title: "hreflang pair",
    q: ["An English fees page has hreflang links to its Hindi version, but the Hindi page has none. What is wrong?"],
    steps: ["hreflang must be reciprocal."],
    answer: "The annotations must be returned: the Hindi page must also list both versions. Without return links, search engines may ignore the hreflang.",
  },
  {
    title: "Filter URLs",
    q: ["A category page /tables has filter URLs like /tables?color=brown&sort=price. Where should the filtered page's canonical point?"],
    steps: ["Consolidate on the main category."],
    answer: "To /tables, unless the filtered view is a deliberate landing page with its own content.",
  },
  {
    title: "Discontinued product",
    q: ["A blender model is discontinued; the newer model is very similar. What should happen to the old page?"],
    steps: ["Close replacement exists."],
    answer: "301-redirect the old product page to the newer model's page, or keep the old page with a clear notice and a prominent link if many people still search for it.",
  },
  {
    title: "Seasonal timing",
    q: ["An accountant wants a guide on filing ITR to rank in July. When should it be published or updated?"],
    steps: ["Allow time for indexing and ranking."],
    answer: "By May or early June, updated for the year's rules, so it has time to be indexed and gather visits before the peak.",
  },
  {
    title: "Audit finding",
    q: ["An audit finds 14 pages titled 'Blog | Brand'. What is the fix and the priority?"],
    steps: ["Duplicate titles waste the main snippet line."],
    answer: "High priority: write a unique, descriptive title for each post, starting with its topic.",
  },
  {
    title: "Open Graph image",
    q: ["Shared links to your page show a tiny logo. What should you set?"],
    steps: ["Open Graph image tag with a suitably sized image."],
    answer: "An og:image of 1200 x 630 pixels showing something relevant, plus og:title and og:description.",
  },
  {
    title: "Content pace",
    q: ["A clinic can spare four hours a month for content. A good page takes about two hours. What plan would you suggest?"],
    steps: ["Two pages a month, or one new and one update."],
    answer: "Two pages a month: alternate between one new page answering a patient question and an update of an existing important page. That is 24 pieces of work a year.",
  },
);

book.exercises.warmup.push(
  { q: "What vocabulary does structured data usually use?", a: "schema.org." },
  { q: "What does hreflang indicate?", a: "Which pages are language or regional versions of each other." },
);
book.exercises.practice.push(
  { q: "Write a descriptive file name for a photo of a teak wood bed.", a: "'teak-wood-bed.webp' or similar." },
  { q: "Name three things to check in a quick site audit.", a: "robots.txt and indexing; titles and duplicate pages; mobile speed and broken links. Also: Business Profile details." },
);
book.exercises.stretch.push(
  { q: "Explain how filter URLs can waste crawling and what to do.", a: "They create many near-identical URLs; use canonicals to the main category, avoid linking sort orders, and keep them out of the sitemap." },
);
book.exercises.challenge.push(
  { q: "Plan a bilingual site for a coaching centre in English and Hindi.", a: "Separate URLs per language (/en/, /hi/), hreflang on every pair including x-default, human-checked translation using searchers' real words, language menus, both versions in the sitemap, and Search Console checks for each." },
);

book.glossary.push(
  ["schema.org", "The shared vocabulary used for structured data."],
  ["JSON-LD", "The recommended format for adding structured data to a page."],
  ["hreflang", "Annotation linking language or regional versions of a page."],
  ["Open Graph", "Tags that control how pages look when shared on social media and chat."],
  ["Faceted navigation", "Filters such as colour and size that create many URL combinations."],
);

book.references.push(
  { title: "Rich Results Test", who: "Google Search Central", where: "search.google.com/test/rich-results", note: "Checks structured data and shows which rich results a page may be eligible for." },
  { title: "Tell Google about localized versions of your page", who: "Google Search Central", where: "developers.google.com/search/docs/specialty/international", note: "How to use hreflang correctly." },
);

book.scenarios.find((s) => s.title === "Filter pages that flooded the index").paragraphs.push(
  "The shop kept two filtered views as proper landing pages, 'Sheesham dining tables' and 'Six-seater dining tables', each with its own introduction and a clean URL, because customers searched for those exact phrases.",
);

book.chapters.push(
  {
    title: "Search beyond the ten blue links",
    paragraphs: [
      "People now find businesses and answers in many places: map results, AI-generated answers, YouTube, marketplaces, and assistants in phones and apps. The same habits serve all of them: accurate information, clear pages and a good reputation.",
    ],
    sections: [
      {
        heading: "AI answers in search",
        paragraphs: [
          "Search engines increasingly show AI-generated summaries above or among results, drawing on several pages and linking to sources. There is no special trick to appear in them. Pages that answer questions clearly, state facts plainly, show who wrote them and are trusted on their subject are the ones likely to be used and linked. Some searches that used to bring clicks are now answered on the results page; focus on questions where people still want detail, a service or a conversation.",
        ],
      },
      {
        heading: "Maps and local apps",
        paragraphs: [
          "Map apps draw on business profiles, reviews and listings. Keep your Business Profile complete and consistent with your website, and check the main map apps and directories your customers use for wrong hours or old phone numbers.",
        ],
      },
      {
        heading: "YouTube",
        paragraphs: [
          "For services that are easier to show than describe, such as repairs, recipes, exercises or software, short videos on YouTube can reach people who never search the web. Treat titles, descriptions and thumbnails with the same care as page titles and descriptions.",
        ],
      },
      {
        heading: "Marketplaces",
        paragraphs: [
          "For products, many searches start on marketplaces. Their search uses the product title, attributes, price, reviews and sales history. Fill every attribute, use clear titles with the words buyers use, and keep stock accurate. Your own site remains the place for fuller information and loyal customers.",
        ],
      },
    ],
  },
  {
    title: "Keeping a site healthy and safe",
    paragraphs: [
      "A hacked or neglected site can lose its rankings overnight. Basic upkeep prevents most problems.",
    ],
    sections: [
      {
        heading: "Updates and backups",
        bullets: [
          "Keep the website platform, themes and plugins updated.",
          "Remove plugins and themes you no longer use.",
          "Use strong, unique passwords and two-step sign-in for admin accounts.",
          "Back up the site regularly and test that a backup can be restored.",
          "Keep a list of who has admin access and remove people who no longer need it.",
        ],
      },
      {
        heading: "Signs of a hacked site",
        paragraphs: [
          "Watch for pages you did not create appearing in search, often about pharmaceuticals, gambling or loans in other languages; visitors being redirected to strange sites; or a security warning in Search Console or the browser. Act quickly: restore from a clean backup, change all passwords, update everything, and request a review in Search Console once clean.",
        ],
      },
      {
        heading: "Spam comments and forms",
        paragraphs: [
          "Open comment sections and forms attract automated spam with links. Moderate comments, use a spam filter, and mark user-submitted links as nofollow or ugc so they do not pass value. Spam left visible makes a site look abandoned.",
        ],
      },
      {
        heading: "Domain renewal",
        paragraphs: [
          "Set your domain to renew automatically and keep the contact email current. Expired domains are a surprisingly common cause of small business sites disappearing, and lapsed domains are sometimes bought by others and reused for spam.",
        ],
      },
    ],
  },
  {
    title: "Working with a developer or agency",
    paragraphs: [
      "Most small businesses get help with their sites. Good help saves time and avoids mistakes; poor help can cause lasting damage. Knowing what to ask for makes the difference.",
    ],
    sections: [
      {
        heading: "Ask for these in any website project",
        bullets: [
          "Admin access in your name, and the domain registered to your business.",
          "Unique titles and descriptions editable by you.",
          "Clean, readable URLs.",
          "301 redirects from old URLs when replacing a site.",
          "A sitemap generated automatically.",
          "Mobile-friendly design tested on real phones.",
          "Images compressed and sized; reasonable page speed.",
          "Removal of any test-time blocks before launch.",
        ],
      },
      {
        heading: "Questions to ask an SEO provider",
        steps: [
          "What exactly will you change in the first three months?",
          "How will you report results, and which measures will you use?",
          "Do you build links? How?",
          "Will we have access to Search Console and analytics ourselves?",
          "What happens to the work if we stop?",
        ],
        paragraphs: [
          "Be wary of guaranteed rankings, secret methods, large numbers of links, and reports that show only rankings for obscure phrases. Good providers explain what they do in plain language and leave you with a better site, not a dependency.",
        ],
      },
      {
        heading: "Keep the keys",
        paragraphs: [
          "Your domain, hosting, Search Console, analytics and Business Profile should be owned by your business, with providers given access as users. When a relationship ends, you remove their access and keep everything. Businesses that let a developer own the domain sometimes lose their site address entirely.",
        ],
      },
    ],
  },
  {
    title: "Quick reference",
    paragraphs: [
      "The figures and rules used most often in this book. Search engines change their systems; check their documentation for the latest details.",
    ],
    sections: [
      {
        table: {
          caption: "Numbers worth remembering.",
          headers: ["Item", "Guide figure"],
          widths: [2.6, 2.2],
          rows: [
            ["Title length", "About 50 to 60 characters (roughly 580 to 600 px)"],
            ["Meta description", "About 120 to 158 characters"],
            ["Sitemap file limits", "50,000 URLs and 50 MB uncompressed"],
            ["LCP (good)", "2.5 seconds or less"],
            ["INP (good)", "200 milliseconds or less"],
            ["CLS (good)", "0.1 or less"],
            ["Open Graph image", "1200 x 630 pixels"],
            ["Large web image", "Under about 200 KB"],
          ],
        },
      },
      {
        heading: "Rules of thumb",
        bullets: [
          "One page, one main topic, one main heading.",
          "Title starts with the topic in searchers' words.",
          "Every moved page gets a 301 redirect.",
          "robots.txt blocks crawling; noindex keeps pages out of results.",
          "Same name, address and phone everywhere.",
          "Never buy links or reviews.",
          "Measure in Search Console; change one thing at a time.",
        ],
      },
    ],
  },
);

book.scenarios.push(
  {
    title: "The domain that expired",
    paragraphs: [
      "A family-run guest house in Munnar had its website built by a nephew years earlier, who registered the domain in his own name with his old college email. When the renewal notice went to that email, nobody saw it, and the domain expired during the booking season.",
      "Bookings through the site stopped, and the address briefly showed a parking page with advertisements. The nephew managed to renew it within the grace period after a frantic weekend, but the site had dropped out of many search results and took weeks to recover.",
      "The family transferred the domain into the guest house's name, set automatic renewal with a business card, and added two current email addresses as contacts. They also took ownership of the Search Console and Business Profile accounts.",
    ],
    lesson: "Register your domain in the business's name, set auto-renewal and keep contact emails current.",
  },
  {
    title: "Spam pages after a hack",
    paragraphs: [
      "A school in Mysuru noticed that searches for its name showed results in a foreign language about cheap medicines. Search Console showed a security warning and thousands of pages the school had never created.",
      "An outdated plugin on the school's site had been exploited. The IT teacher restored the site from a clean backup taken before the hack, updated the platform and every plugin, removed unused ones, changed all passwords and turned on two-step sign-in for admins. He then requested a review in Search Console.",
      "The warning was lifted after the review, and the spam pages dropped out of results over the following weeks. The school now has a monthly update routine and keeps weekly backups for three months.",
    ],
    lesson: "Keep software updated and backups ready. After a hack, clean fully, secure accounts and request a review.",
  },
  {
    title: "An agency that owned everything",
    paragraphs: [
      "A furniture showroom in Ludhiana ended its contract with an agency after two years of reports showing rankings for phrases nobody searched. It then discovered that the agency owned its domain, hosting account and Search Console property.",
      "Getting them transferred took two months of emails and a lawyer's letter. Meanwhile, the showroom could not update its prices or opening hours online.",
      "With a new provider, the owner insisted on owning every account and giving the provider user access. Reports now show enquiries from search, calls and visits to key pages, which he can check himself in Search Console and analytics.",
    ],
    lesson: "Own your domain, hosting and accounts; give providers access, not ownership. Judge SEO by enquiries, not obscure rankings.",
  },
);

book.faqs.push({
  group: "Beyond Google and upkeep",
  items: [
    ["How do I appear in AI answers in search?", "There is no separate method. Clear, accurate, well-structured pages from a trusted source are the ones AI summaries tend to draw on and link to. Answer questions plainly and keep facts current."],
    ["Does YouTube help my website's SEO?", "Indirectly. YouTube brings its own audience, and videos embedded on relevant pages make them more useful. Links in video descriptions bring visitors rather than ranking value."],
    ["How do I know if my site has been hacked?", "Watch for strange pages in search results for your site, unexpected redirects, unknown admin users, and security warnings in Search Console or browsers."],
    ["What should my contract with a web developer include?", "That the domain and accounts are owned by your business, that you get admin access, that redirects and SEO basics are part of a relaunch, and how backups and updates are handled."],
    ["Should I worry about my domain expiring?", "Yes. Set automatic renewal, keep contact emails current and register the domain to your business. An expired domain can take a site offline and damage its search presence."],
    ["Do marketplace listings compete with my own site?", "They can, especially if the descriptions are the same. Give your own site fuller, original content and photos to stand out."],
  ],
});

book.problems.push(
  {
    title: "Ownership check",
    q: ["List four accounts a small business should own rather than its developer."],
    steps: ["Think of what controls the site and its presence in search."],
    answer: "Domain registration, hosting, Google Search Console, analytics. Also Google Business Profile and social accounts.",
  },
  {
    title: "Hack response order",
    q: ["Put in order: request review in Search Console; restore clean backup; change passwords; update software."],
    steps: ["Clean, then secure, then ask for review."],
    answer: "Restore clean backup; update software and remove unused plugins; change passwords and enable two-step sign-in; request review.",
  },
  {
    title: "Agency report",
    q: ["An agency reports first-page rankings for 'premium wooden furniture showroom best quality Ludhiana city'. Is this a useful measure?"],
    steps: ["Check whether real people search the phrase."],
    answer: "Probably not. Very long, unnatural phrases have few searches. Ask for clicks, enquiries and the searches that actually bring visitors, from Search Console.",
  },
);

book.scenarios.find((s) => s.title === "An agency that owned everything").paragraphs.push(
  "He also kept a one-page record of every account, who owns it, who has access and when it renews, in the showroom's office file. When staff change, the record shows exactly which access to remove.",
);

book.scenarios.push(
  {
    title: "A clinic that answered the AI-summary question",
    paragraphs: [
      "A dermatology clinic in Gurugram noticed that searches like 'how long does acne scar treatment take' brought fewer clicks than before. AI summaries on the results page now gave a short general answer.",
      "The dermatologist rewrote the clinic's treatment pages to give what a summary could not: her own typical timelines by scar type, photos of real results with consent, prices, the number of sessions patients usually needed, and what she tells patients at the first visit. Each page named her, her qualifications and when it was last reviewed.",
      "Clicks on general questions stayed lower, but enquiries from people searching for treatment in Gurugram rose, and several patients said they had chosen the clinic after reading the detailed pages. The pages had become the source worth visiting after the quick answer.",
    ],
    lesson: "Where search pages give quick answers, offer the detail, experience and local service a summary cannot.",
  },
  {
    title: "Opening hours that were wrong in three places",
    paragraphs: [
      "A pharmacy in Coimbatore extended its hours to 11 pm, updated its website, and forgot everything else. Its Business Profile, a food-and-pharmacy delivery app and a local directory still said 9 pm.",
      "Customers searching late at night saw 'Closed' on the map and went elsewhere. A regular customer mentioned it at the counter a month later.",
      "The owner made a list of every place the pharmacy appeared online, updated each one, and now reviews the list whenever anything changes: hours, phone number or services. Late-evening sales rose within weeks.",
    ],
    lesson: "Keep a list of every listing and update them all when details change.",
  },
);

book.faqs.push({
  group: "Final questions",
  items: [
    ["Where should I start if I have only one hour?", "Set up Search Console if you have not, check robots.txt and noindex, rewrite the titles of your five most important pages, and complete your Business Profile if you serve local customers."],
    ["How do I keep business details consistent?", "Keep a list of every website, profile, app and directory where your business appears, and update all of them whenever your hours, phone, address or services change."],
  ],
});

book.scenarios.find((s) => s.title === "Opening hours that were wrong in three places").paragraphs.push(
  "She also added special hours for festivals to the Business Profile in advance, so customers searching on Diwali or Pongal saw the right times rather than guessing. The profile allows holiday hours to be set ahead, which takes a minute and prevents a wasted trip for customers.",
);

book.chapters.push({
  title: "One page from start to finish",
  paragraphs: [
    "To bring the book together, here is one page built from nothing: a fees page for a small music school in Pune that teaches guitar, keyboard and vocals. The same steps work for almost any page.",
  ],
  sections: [
    {
      heading: "1. Find the question",
      paragraphs: [
        "The school's phone rings most often with one question: how much are classes? Search suggestions show 'guitar classes fees in pune', 'keyboard classes near me fees' and 'music classes for kids pune fees'. Search Console shows the school already appears for some of these with no fees page, so impressions turn into few clicks.",
      ],
    },
    {
      heading: "2. Check the intent",
      paragraphs: [
        "The top results for these searches are mostly local schools' fee and course pages, with a map. So the page should be a clear fees page for this school, not a general guide to music lessons.",
      ],
    },
    {
      heading: "3. Write the page",
      bullets: [
        "Main heading: 'Music Class Fees: Guitar, Keyboard and Vocals'.",
        "First screen: a table of fees per month for each instrument, group and individual, with class length and frequency.",
        "Below: what is included, such as books and practice room time, and any registration fee.",
        "A short section for parents: ages accepted, trial class, and exam preparation.",
        "Address, hours, map and a booking button, plus a phone link.",
        "The teacher's name and qualifications, and the date the fees were last updated.",
      ],
    },
    {
      heading: "4. Title, description and URL",
      codes: [
        {
          caption: "The page's search details.",
          code: code([
            "URL:   https://www.example.in/fees",
            "Title: Music Class Fees in Pune: Guitar, Keyboard, Vocals | Taal School",
            "Desc:  Monthly fees for guitar, keyboard and vocal classes for kids and",
            "       adults in Baner, Pune. Group and one-to-one options. Book a free",
            "       trial class.",
          ]),
        },
      ],
      paragraphs: [
        "The title is checked in the SERP snippet preview: at about 64 characters it may be cut on some screens, so the brand comes last where a cut does least harm.",
      ],
    },
    {
      heading: "5. Connect it",
      paragraphs: [
        "The page is added to the main menu as 'Fees', linked from each course page with the text 'see fees for guitar classes', and listed in the sitemap. The Business Profile's website link for 'services' points to it.",
      ],
    },
    {
      heading: "6. Check and measure",
      paragraphs: [
        "On a phone, the fees table fits without sideways scrolling and the booking button is easy to tap. After a few weeks, Search Console shows the fees page appearing for the fee searches with a click-through rate well above the school's older pages, and the booking form records which enquiries came from it. The phone still rings, but callers now ask which batch to join rather than how much it costs.",
      ],
    },
  ],
});

book.scenarios.push(
  {
    title: "A blog with a hundred tags",
    paragraphs: [
      "A parenting blog in Chandigarh used tags generously: every post had ten or more, and many tags were used only once. The platform created a page for each tag, so the site had over 900 tag pages, most listing a single post with no other content.",
      "Search Console showed hundreds of these pages as 'Crawled - currently not indexed', and the blog's real articles were crawled less often. The owner reduced the tags to about twenty meaningful topics, merged similar ones, set the remaining tag pages with fewer than three posts to noindex, and wrote a short introduction for each main topic page.",
      "Over the next few months, the twenty topic pages started appearing for broad searches like 'toddler meal ideas', and new posts were indexed faster. Readers also used the topic pages to browse, which they had never done with the scattered tags.",
    ],
    lesson: "Avoid creating hundreds of thin automatic pages. Keep a few meaningful topic pages with real introductions.",
  },
);

book.problems.push(
  {
    title: "Tag pages",
    q: ["A blog has 900 tag pages; 820 list only one post. What would you do?"],
    steps: ["Thin automatic pages dilute crawling and add little.", "Keep meaningful topics; consolidate or noindex the rest."],
    answer: "Reduce tags to a small set of real topics, merge similar tags, noindex or remove tag pages with very few posts, and give main topic pages a short introduction.",
  },
  {
    title: "Fees page title length",
    q: ["A title is 'Music Class Fees in Pune: Guitar, Keyboard, Vocals | Taal School' (64 characters). Where would a cut fall, and does it matter?"],
    steps: ["At about 55 to 60 characters, the cut falls in the brand.", "The topic and place are before it."],
    answer: "Around the brand name at the end. That matters little, because the topic and place, which searchers need, come first.",
  },
);

book.faqs.push({
  group: "Blogs",
  items: [
    ["Do tags and categories help SEO?", "A few meaningful categories help readers and search engines understand a blog. Hundreds of tags used once or twice create thin pages that add little; keep them few and purposeful."],
    ["Should old blog posts be deleted?", "Update posts that are still useful, merge overlapping ones with redirects, and remove or noindex posts that are outdated and have no value. Do not delete pages that still bring visitors or links without redirecting them."],
  ],
});

book.scenarios.push({
  title: "A contact form that lost enquiries",
  paragraphs: [
    "An interior designer in Navi Mumbai saw good search traffic to her portfolio pages but few enquiries. She tried filling in her own contact form on a phone and found it had eleven fields, including budget, floor plan upload and preferred style, and the submit button sat below a large map.",
    "She cut the form to name, phone, area and a short message, moved the button above the map, and added a tap-to-call link and a WhatsApp button beside it. She also set up an analytics event for each form submission and call tap.",
    "Enquiries from search roughly doubled in the following two months with no change in traffic. SEO had been bringing the right people; the page had been turning them away.",
  ],
  lesson: "Search brings visitors; the page must make it easy for them to act. Test your own forms on a phone.",
});

book.problems.push({
  title: "Form length",
  q: ["A form has 11 fields and converts 1.2 percent of 2,500 monthly visitors. After cutting to 4 fields it converts 2.6 percent. How many more enquiries a month?"],
  steps: ["Before: 2500 x 1.2 / 100 = 30", "After: 2500 x 2.6 / 100 = 65"],
  answer: "35 more enquiries a month, from 30 to 65.",
});

export default book;
