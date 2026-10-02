/* =====================================================================
   SITE CONTENT: this is the only file you need to edit.

   - Change any text between quotes. Keep the quotes and the commas.
   - To add a project, copy one whole { ... } block in `projects`,
     paste it where you want it to appear, and edit it. Order here is
     the order on the page.
   - To hide something without deleting it, wrap it in /* ... * /
     (no space between * and /).
   - Images: drop the file in the /images folder, then list it like
       images: [{ src: "images/pivot-home.png", alt: "Pivot home screen" }]
   - Links: links: [{ label: "Live demo", url: "https://..." }]
   - Tags drive the filter buttons. Use any of the names in `filters`.
   ===================================================================== */

const SITE = {
  name: "Parker Jones",
  headline: "ECE + Computer Science at Duke.",
  intro:
    "I build across the whole stack: firmware and sensor hardware, mechanical parts cut on a CNC mill, and the apps and backends that sit on top. Here's what I've made so far.",
  location: "Tampa, FL",

  contact: {
    email: "parker.t.jones07@gmail.com",
    linkedin: "https://www.linkedin.com/in/parkerjones0525",
    github: "https://github.com/parker-t-jones",
    // Put a PDF named resume.pdf next to index.html, then set this to "resume.pdf".
    // Leave it as "" to hide the resume button.
    resume: "",
  },

  education: {
    school: "Duke University",
    degree: "B.S.E., Electrical & Computer Engineering and Computer Science (double major)",
    gpa: "3.925",
    graduation: "Expected May 2029",
    coursework: [
      "Fundamentals of Electrical and Computer Engineering",
      "Intro to Signals and Systems",
      "Data Structures and Algorithms",
      "Computing for Engineers",
      "Matrices and Vectors",
      "Laboratory Calculus I and II",
      "Introductory Mechanics",
      "Engineering Design and Communication",
      "Design to Deliver",
      "Core Concepts in Chemistry",
    ],
  },

  // Filter buttons shown above the project list ("All" is added automatically).
  filters: ["Hardware", "Firmware", "Software", "Mechanical", "Audio"],

  projects: [
    {
      title: "Pivot",
      subtitle: "Roster-aware sports viewing app",
      role: "Independent Project",
      dates: "2025 – Present",
      tags: ["Software"],
      summary:
        "Connects a fantasy roster to live NFL game events and sends you to the broadcast that matters to your players.",
      bullets: [
        "Architect a pnpm-workspace monorepo with separate services for ESPN game-event ingestion, a switching/decision engine, a notification dispatcher, and a REST/WebSocket API, plus an Expo (React Native) mobile client and shared TypeScript types.",
        "Link a user's fantasy roster (Sleeper integration or manual entry) to real-time game events and route them to the most relevant live broadcast via deep link or TV casting.",
        "Tackle stream synchronization by splitting alerts into a spoiler-free routing nudge and a delay-sensitive reveal, comparing three live sports-data providers on cost, latency and licensing, and running a latency probe that measured a roughly 28 to 32 second feed-to-broadcast delay against YouTube TV.",
        "Deploy on Supabase (Postgres + Auth) and Vercel with a live shareable build ahead of a public release timed to the NFL season.",
      ],
      stack: ["TypeScript", "React Native (Expo)", "Node.js", "Supabase", "Vercel", "Cloudflare"],
      links: [],
      images: [],
    },
    {
      title: "Scissor-Lift Object Detection System",
      subtitle: "Collision warning for construction scissor lifts, sponsored by Skanska",
      role: "Mechatronics Team Lead, Client-Sponsored Team Project",
      dates: "2025 – Present",
      tags: ["Hardware", "Firmware", "Mechanical"],
      summary:
        "A Time-of-Flight sensing system that warns lift operators before a collision, built by a team of four across mechanical, hardware and software.",
      bullets: [
        "Design the sensor-integration mechanical layout in Fusion 360.",
        "Develop a haptic wristband alert so operators are warned without having to hear an alarm over jobsite noise, integrating a Seeed XIAO nRF52840 Sense (BLE), Adafruit DRV2605L haptic driver, 10mm coin LRA motor, and GME12864-11 OLED on dev boards.",
        "Write the wristband's Arduino C++ firmware and test its Bluetooth link and LRA vibration.",
        "Perform hardware bring-up and debugging with oscilloscope and multimeter, plus circuit prototyping and soldering, working hands-on with the ESP32-S3, I2C and VL53L8CX ToF sensors.",
        "Plan a custom KiCad PCB to consolidate the wristband's components (in progress).",
        "Work with the client across multiple semesters, from problem scoping through hardware prototyping.",
      ],
      stack: ["ESP32-S3", "nRF52840 (BLE)", "VL53L8CX ToF", "DRV2605L", "Arduino C++", "I2C", "Fusion 360", "KiCad"],
      links: [],
      images: [],
    },
    {
      title: "Duke Robotics Club, AUV Team",
      subtitle: "Autonomous underwater vehicles for RoboSub",
      role: "Student Club Team",
      dates: "2025 – Present",
      tags: ["Mechanical", "Hardware"],
      summary:
        "Contributing to two autonomous underwater vehicles that compete in RoboSub, where they navigate and complete manipulation tasks on their own.",
      bullets: [
        "Design mechanical components in SolidWorks and generate CNC toolpaths in Fusion 360.",
        "Machine buoyancy blocks on a Centroid CNC mill from self-generated toolpaths.",
      ],
      stack: ["SolidWorks", "Fusion 360 CAM", "Centroid CNC mill"],
      links: [],
      images: [],
    },
    {
      title: "Workout Tracker",
      subtitle: "Family gym app with an AI programming agent",
      role: "Independent Project",
      dates: "2026 – Present",
      tags: ["Software"],
      summary:
        "Generates and schedules workout programs, then adapts each next week to what was actually logged, including injuries and issues.",
      bullets: [
        "Run AI program generation as a Supabase Edge Function calling the Anthropic API, keeping the API key server-side instead of in the client bundle.",
        "Generate each following week from logged RPE, completion and pain flags, with a ranked exercise-substitution catalog and a review queue for AI-proposed substitutions.",
        "Design the Postgres schema with Row Level Security on every table, tying app users to Supabase auth identities.",
        "Build a family leaderboard through a Postgres RPC.",
      ],
      stack: ["React", "Tailwind CSS", "Vite", "Supabase", "Vercel"],
      links: [],
      images: [],
    },
    {
      title: "Cable Tray Testing Fixture",
      subtitle: "Ergonomic test fixture for UL Solutions",
      role: "Client-Sponsored Team Project",
      dates: "2025",
      tags: ["Mechanical"],
      summary:
        "A support structure with an integrated hydraulic lift table that took a heavy manual lift out of a cable tray test.",
      bullets: [
        "Designed and built a wooden support structure with an integrated hydraulic lift table to improve a cable tray testing process.",
        "Engineered the fixture to catch falling test weights, funnel them into a hydraulic cart, and raise the cart to waist height, improving technician ergonomics and testing throughput.",
      ],
      stack: ["Fixture design", "Hydraulic lift table"],
      links: [],
      images: [],
    },
    {
      title: "Autonomous Line-Following Robot",
      subtitle: "Line tracking, stop detection and heat-signature search",
      role: "Team Project",
      dates: "2026",
      tags: ["Hardware", "Firmware"],
      summary:
        "Follows a course, stops at hash marks, and finds a target object by its heat signature.",
      bullets: [
        "Built the robot in Arduino C++ to follow a line, detect hash-mark stops, and use an IR thermal sensor to locate a target object's heat signature.",
        "Programmed it to halt at each hash mark, set an onboard RGB LED to a stop-specific color, and report status over an Xbee wireless link.",
      ],
      stack: ["Arduino C++", "IR thermal sensor", "RGB LED", "Xbee"],
      links: [],
      images: [],
    },
    {
      title: "Procedural Western Music Generator",
      subtitle: "Original western-style music from a cadence and chords",
      role: "Course Team Project",
      dates: "2025",
      tags: ["Software", "Audio"],
      summary:
        "Give it a cadence and a chord progression and it writes an original western-style piece.",
      bullets: [
        "Built a Python program that procedurally generates original western-style music from an input cadence and chord progression.",
      ],
      stack: ["Python"],
      links: [],
      images: [],
    },
    {
      title: "\u201cMrs. Magic\u201d Harmonic Synthesis",
      subtitle: "Resynthesizing a song from first principles",
      role: "Independent Course Project",
      dates: "2026",
      tags: ["Software", "Audio"],
      summary:
        "Rebuilds \u201cMrs. Magic\u201d by Strawberry Guy in MATLAB using nothing but math.",
      bullets: [
        "Built a MATLAB program that resynthesizes the track using chord voicings, exponential-decay amplitude envelopes and additive harmonic synthesis.",
      ],
      stack: ["MATLAB", "Additive synthesis"],
      links: [],
      images: [],
    },
  ],

  experience: [
    {
      title: "Rogers Park Golf Course",
      role: "Outside Operations / Guest Services",
      dates: "2023 – Present",
      bullets: [
        "Manage cart fleet operations and driving range maintenance in a high-volume golf operation.",
        "Deliver food and beverage service in a fast-paced, customer-facing environment.",
      ],
    },
    {
      title: "Kind Camp",
      role: "Lead Counselor (\u201cBig Buddy\u201d), Volunteer",
      dates: "8 years",
      bullets: [
        "Mentored and supervised 6th through 12th grade campers, serving as a lead through high school and college.",
        "Promoted kindness and mentorship toward younger campers within a structured summer program.",
      ],
    },
  ],

  skills: [
    { group: "Languages", items: ["Python", "C++ (Arduino)", "TypeScript", "JavaScript", "Java", "MATLAB", "SQL", "HTML"] },
    { group: "Hardware", items: ["ESP32-S3", "Seeed XIAO nRF52840 Sense (BLE)", "Arduino", "VL53L8CX ToF sensors", "IR/thermal sensors", "DRV2605L haptic driver", "LRA motors", "OLED displays", "Xbee", "KiCad", "Soldering"] },
    { group: "Protocols", items: ["I2C", "UART/serial", "Xbee wireless serial"] },
    { group: "Test equipment", items: ["Oscilloscope", "Multimeter"] },
    { group: "CAD & manufacturing", items: ["Fusion 360 (CAD + CAM)", "SolidWorks", "Onshape", "Prusa Core One FDM printing", "Centroid CNC mill"] },
    { group: "Software & web", items: ["React", "React Native (Expo)", "Node.js", "REST APIs", "WebSockets", "Supabase (Postgres, Auth, Edge Functions, RLS)", "Vercel", "Cloudflare", "pnpm workspaces", "Git/GitHub"] },
    { group: "AI-assisted development", items: ["Cursor", "Claude"] },
  ],
};
