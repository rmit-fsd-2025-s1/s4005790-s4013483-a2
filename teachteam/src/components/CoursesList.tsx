export interface Course {
  name: string,
  code: string,
  skills: string[],
  description: string,
};

export const courseList : Course[] = [
  {
    name: "Full Stack Development",
    code: "COSC2758",
    skills: ["JavaScript", "TypeScript", "HTML", "CSS", "React", "Angular", "Vue", "Node.js"],
    description: "Learn to build complete web applications from front-end to back-end using popular frameworks and technologies."
  },
  {
    name: "Machine Learning",
    code: "COSC2673",
    skills: ["Python", "SQL", "NoSQL"],
    description: "Explore the fundamentals and advanced concepts of machine learning, including supervised and unsupervised learning, and neural networks."
  },
  {
    name: "Programming Autonomous Robots",
    code: "COSC2814",
    skills: ["C++", "Python"],
    description: "Develop the skills to program robots for autonomous operations, including navigation, perception, and control."
  },
  {
    name: "Cloud Computing",
    code: "COSC2912",
    skills: ["Go", "Python", "Java", "Node.js"],
    description: "Gain expertise in cloud computing platforms and services, including deployment, scaling, and management of applications."
  },
  {
    name: "Process and Tools",
    code: "COSC2217",
    skills: ["Python", "Java"],
    description: "Learn about software development processes and tools used for managing and delivering high-quality software projects."
  },
  {
    name: "Software Requirements Engineering",
    code: "COSC2219",
    skills: ["Python", "Java"],
    description: "Understand the principles and practices of gathering, analyzing, and documenting software requirements."
  },
  {
    name: "Algorithm & Analysis",
    code: "COSC1111",
    skills: ["C++", "Java"],
    description: "Study the design and analysis of algorithms, including sorting, searching, and graph algorithms, with a focus on efficiency."
  },
  {
    name: "Programming Bootcamp",
    code: "COSC2401",
    skills: ["Java", "JavaScript", "C++", "C#", "Ruby", "Go", "Swift", "HTML", "CSS", "SQL", "NoSQL"],
    description: "An intensive course designed to teach the fundamentals of programming and software development using various languages and technologies."
  },
  {
    name: "Programming Studio",
    code: "COSC2402",
    skills: ["Java", "JavaScript", "C++", "C#", "Ruby", "Go", "Swift", "HTML", "CSS", "SQL", "NoSQL"],
    description: "Work on real-world software projects in a collaborative studio environment, applying programming skills and best practices."
  },
  {
    name: "Software Testing",
    code: "COSC2915",
    skills: ["Python", "Java", "JavaScript", "C++", "C#", "Ruby", "Go", "Swift", "Kotlin", "PHP"],
    description: "Learn the techniques and tools for testing software to ensure quality, reliability, and performance."
  }
];