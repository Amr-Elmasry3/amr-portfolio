// Project data: static facts (images, links, tech) live here;
// titles and descriptions are translated in the messages
// files under the "Projects" key, matched by id. Ported in
// full from the previous version of the site — the card grid
// uses the first image, the technicals and the links; the
// gallery, video, description, basic functions and tech stack
// are kept for a future project-details view.

// => Types & Interfaces
type BasicFunctions = {
  id: number;
  key: string;
  value: string;
};
type TechStack = {
  id: number;
  key: string;
  value: string;
};
export interface TranslateData {
  id: number;
  title: string;
  badge: string;
  shortDescription: string;
  description: string;
  basicFunctions: BasicFunctions[];
}
interface StaticData {
  id: number;
  images: string[];
  video: string;
  technicals: string[];
  techStack: TechStack[];
  demo: string;
  github: string;
}

// => Variables
export const projects: StaticData[] = [
  {
    id: 1,
    images: [
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1780361858/file_000000003d3871f4a56308f4c7ed485d_pjk6oe.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1778694554/yallachat-1_jdrfy7.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1778694551/yallachat-2_le3k1w.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1778694552/yallachat-3_lmdrlo.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1778694552/yallachat-4_uowdux.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1778694553/yallachat-5_m2e7if.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1778694552/yallachat-6_rrljxk.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1778694557/yallachat-7_q0oitt.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1778694553/yallachat-8_jutogc.png",
    ],
    video:
      "https://res.cloudinary.com/dqymivlkf/video/upload/v1778772388/Yallachat_Video_envomw.mp4",
    technicals: [
      "Next.js",
      "TypeScript",
      "Axios",
      "Supabase",
      "Firebase",
      "Shadcn Ui",
      "Tailwind CSS",
      "Cloudinary",
    ],
    techStack: [
      {
        id: 1,
        key: "frontend development",
        value:
          "Next.js, TypeScript, Axios (for building scalable and maintainable user interfaces).",
      },
      {
        id: 2,
        key: "backend & database",
        value: "Supabase (realtime database, and backend services).",
      },
      {
        id: 3,
        key: "real-time communication",
        value:
          "Supabase Realtime (to deliver instant messaging and live updates between users).",
      },
      {
        id: 4,
        key: "managemant notifactions",
        value: "Firebase (to send notifactions between users).",
      },
      {
        id: 5,
        key: "media management",
        value:
          "Cloudinary (for uploading and managing images, audio, and files inside chats).",
      },
      {
        id: 6,
        key: "UI/Design",
        value:
          "Shadcn Ui & Tailwind CSS (responsive and modern interface optimized for all devices).",
      },
    ],
    demo: "https://yallachat-rho.vercel.app",
    github: "https://github.com/Amr-Elmasry3/yallachat",
  },
  {
    id: 2,
    images: [
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1780361915/file_0000000027c0720a80b95ffeb4054d58_nvslsg.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755647374/grogin-1_wagggh.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755647408/grogin-2_sg9lmw.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755647433/grogin-3_qsubej.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755647452/grogin-4_wbpyvt.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755647474/grogin-5_mnfltz.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755647490/grogin-6_tafnav.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755647514/grogin-7_axqcqt.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755647557/grogin-8_mcd7ew.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755647576/grogin-9_yer26h.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755647597/grogin-10_teb2yt.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755647615/grogin-11_rgiyzq.png",
    ],
    video:
      "https://res.cloudinary.com/dqymivlkf/video/upload/v1755699738/Grogin_Video_30mb_gyntkz.mov",
    technicals: [
      "React.js",
      "React Router",
      "Redux",
      "Axios",
      "JavaScript",
      "Sass",
      "MUI",
    ],
    techStack: [
      {
        id: 1,
        key: "frontend development",
        value:
          "React, React Router (to manage navigation between pages such as Home, Shop, Cart).",
      },
      {
        id: 2,
        key: "state managemnet",
        value:
          "Redux (to centrally and efficiently manage complex application state such as cart, product, and user).",
      },
      { id: 3, key: "core function", value: "JavaScript(ES6+), HTML5" },
      {
        id: 4,
        key: "Ui/Design",
        value:
          "MUI, Sass (for full design control and customization, and create responsve layouts using Flexbox/Grid).",
      },
      {
        id: 5,
        key: "error boundaries",
        value:
          "(to check and handle errors in React, components elegantly and prevent the entire interface from collapsing).",
      },
      {
        id: 6,
        key: "Algorithm",
        value:
          "Quick Sort (has been implemented to efficiently implement the Sort function for products (by price or rate) on the client-side)",
      },
    ],
    demo: "https://amr-elmasry3.github.io/grogin/",
    github: "https://github.com/Amr-Elmasry3/grogin",
  },
  {
    id: 3,
    images: [
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1780361916/file_000000001a60720a86c632a1039165f5_lzexcp.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755648073/type-speed-1_kta8op.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755648074/type-speed-2_qbct48.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755648077/type-speed-3_w2fbip.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755648083/type-speed-4_ywqmwd.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755648084/type-speed-5_wq8nqk.png",
    ],
    video:
      "https://res.cloudinary.com/dqymivlkf/video/upload/v1755648434/Speed_Test_Video_gerzzn.mp4",
    technicals: ["HTML5", "CSS3", "JavaScript"],
    techStack: [
      {
        id: 1,
        key: "core development",
        value:
          "Vanilla JavaScript(ES6+), HTML5, CSS3 (the application was built entirely with Pure Javascript without any framework).",
      },
      {
        id: 2,
        key: "data management",
        value:
          "LocalStorage (to storing user data localyly on the browser, such as user scores).",
      },
      {
        id: 3,
        key: "Styling",
        value:
          "CSS3 (an attractive, interactive and responsive user interface  to optimize the gameplay experience).",
      },
    ],
    demo: "https://amr-elmasry3.github.io/typing-speed-app/",
    github: "https://github.com/Amr-Elmasry3/typing-speed-app",
  },
  {
    id: 4,
    images: [
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1778694550/weather-app-1_kofydz.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1778694551/weather-app-2_vi664o.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1778694550/weather-app-3_feknfg.png",
    ],
    video:
      "https://res.cloudinary.com/dqymivlkf/video/upload/v1778767874/Weather_App_Video_s5yofo.mp4",
    technicals: ["Next.js", "JavaScript", "Tailwind CSS"],
    techStack: [
      {
        id: 1,
        key: "core development",
        value:
          "Next.js, JavaScript(ES6+) (the project was built without frameworks for better understanding of core web concepts).",
      },
      {
        id: 2,
        key: "API integration",
        value:
          "Weather API integration to fetch real-time weather data dynamically.",
      },
      {
        id: 3,
        key: "UI/Design",
        value:
          "Responsive and modern user interface optimized for all screen sizes.",
      },
    ],
    demo: "https://amr-elmasry3.github.io/real-weather-app/",
    github: "https://github.com/Amr-Elmasry3/real-weather-app",
  },
  {
    id: 5,
    video:
      "https://res.cloudinary.com/dqymivlkf/video/upload/v1755699386/Amazing_main_sdcftl.mp4",
    images: [
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1780361909/file_00000000eea0720a88c21a328721918b_ykgjhd.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755647658/amazing-1_bknb6k.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755647766/amazing-3_py8vjn.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755647751/amazing-2_wjnhvs.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755647788/amazing-4_m8yfjn.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755647807/amazing-5_zbgcvv.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755647826/amazing-6_dgjjts.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755647848/amazing-7_dckvye.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755647869/amazing-8_rcnu69.png",
    ],
    technicals: [
      "React.js",
      "React Router",
      "Redux",
      "Axios",
      "JavaScript",
      "Tailwind CSS",
      "MUI",
    ],
    techStack: [
      {
        id: 1,
        key: "frontend development",
        value:
          "React, React Router (to manage navigation between pages such as Home, Shop, Cart).",
      },
      {
        id: 2,
        key: "state managemnet",
        value:
          "Redux (to centrally and efficiently manage complex application state such as cart, product, and user).",
      },
      { id: 3, key: "core function", value: "JavaScript(ES6+), HTML5, CSS3" },
      {
        id: 4,
        key: "UI/Design",
        value:
          "Tailwind Css (as a core framework for building fast-developing, customized, and responsive user interface using utility-first classes)",
      },
      {
        id: 5,
        key: "server conection",
        value: "Axios (to connect with the DummyJSON API to fetch data).",
      },
    ],
    demo: "https://amr-elmasry3.github.io/amazing/",
    github: "https://github.com/Amr-Elmasry3/amazing",
  },
  {
    id: 6,
    images: [
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755648091/questions-1_tkvviz.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755648092/questions-2_uc3pxa.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755648098/questions-3_tkibhz.png",
      "https://res.cloudinary.com/dqymivlkf/image/upload/v1755648099/questions-4_eysrhl.png",
    ],
    video:
      "https://res.cloudinary.com/dqymivlkf/video/upload/v1755648535/Questions_Challenge_Video_zmp4ql.mp4",
    technicals: ["HTML5", "CSS3", "JavaScript"],
    techStack: [
      {
        id: 1,
        key: "core development",
        value:
          "Vanilla JavaScript(ES6+), HTML5, CSS3 (the application was built entirely with Pure Javascript without any framework).",
      },
      {
        id: 2,
        key: "data management",
        value:
          "Array and Objects (to load and manage the questions and answer set).",
      },
      {
        id: 3,
        key: "Styling",
        value:
          "CSS3 (an attractive, interactive and responsive user interface  to optimize the gameplay experience).",
      },
    ],
    demo: "https://amr-elmasry3.github.io/question-app/",
    github: "https://github.com/Amr-Elmasry3/question-app",
  },
];
