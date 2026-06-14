export type TrackKey = 'hw' | 'sw' | 'pm';

export type Track = {
  key: TrackKey;
  label: string;
  buttonLabel: string;
  resumeFile: string;
  description: string[];
};

export type DisplayCard = {
  href: string;
  className: string;
  icon: 'education' | 'monitor' | 'headphones';
  title: string;
  titleClass?: string;
  description: string;
  date: string;
  iconClass?: string;
};

export type Expertise = {
  number: string;
  title: string;
  description: string;
  skills: string[];
};

export type Experience = {
  date: string;
  org: string;
  role: string;
  team: string;
  bullets: string[];
  tags: string[];
};

export type Project = {
  type: string;
  title: string;
  description: string;
  detail?: string;
  link?: string;
  tags: string[];
};

export type Education = {
  mark: string;
  school: string;
  degrees: string;
  gpa: string;
  date: string;
};

export const profile = {
  name: 'Hanlong Liu',
  email: 'hliu747@gatech.edu',
  location: 'Atlanta, GA',
  linkedIn: 'https://www.linkedin.com/in/hanlong-liu-02881a268/',
  github: 'https://github.com/dreamersteven',
};

export const tracks: Track[] = [
  {
    key: 'hw',
    label: 'Hardware',
    buttonLabel: 'Hardware Resume',
    resumeFile: 'Hanlong Liu_resume_2026_hardware.pdf',
    description: [
      'Signal processing, acoustic systems, and embedded hardware.',
      'From DSP pipelines to 3D-printed CIEMs - with US and China patents filed.',
    ],
  },
  {
    key: 'sw',
    label: 'Software',
    buttonLabel: 'Software Resume',
    resumeFile: 'Hanlong Liu_resume_2026_software.pdf',
    description: [
      'ML infrastructure, LLM inference optimization, and systems programming.',
      'Production experience at ByteDance. CUDA, TensorRT, PyTorch.',
    ],
  },
  {
    key: 'pm',
    label: 'Product',
    buttonLabel: 'Product Resume',
    resumeFile: 'Hanlong Liu_resume_2026_Product Manager.pdf',
    description: [
      'End-to-end product ownership from patent filing to market positioning.',
      'Founded SonicMold - acoustic tech startup, dual-patent holder.',
    ],
  },
];

export const displayCards: DisplayCard[] = [
  {
    href: '#education',
    className: 'dc-card dc-back',
    icon: 'education',
    title: 'Georgia Tech',
    description: 'MS ECE + CSE · GPA 4.0',
    date: 'Atlanta, GA · 2024-2027',
  },
  {
    href: '#experience',
    className: 'dc-card dc-mid',
    icon: 'monitor',
    title: 'ByteDance',
    description: 'LLM Inference Optimization',
    date: 'CUDA · TensorRT · 2025',
  },
  {
    href: '#projects',
    className: 'dc-card dc-front',
    icon: 'headphones',
    title: 'SonicMold',
    titleClass: 'dc-title-gold',
    description: '3D-Printed CIEM Startup',
    date: 'US Patent #19/355,355',
    iconClass: 'dc-icon-gold',
  },
];

export const expertise: Expertise[] = [
  {
    number: '01',
    title: 'Hardware and DSP',
    description: 'Acoustic system design, signal processing pipelines, and embedded hardware - from algorithm to physical prototype.',
    skills: ['STFT / Filterbank / OLA', 'Acoustic System Design', 'MATLAB · Verilog · C', '3D-Printed CIEM Prototyping', 'Medical Acoustic Sensing'],
  },
  {
    number: '02',
    title: 'ML Systems and Software',
    description: 'Production ML infrastructure, LLM inference optimization, and systems programming at scale.',
    skills: ['PyTorch · CUDA · TensorRT', 'LLM Inference Optimization', 'Python · C++ · SQL', 'RAG Systems · Transformers', 'AWS · Docker · Linux'],
  },
  {
    number: '03',
    title: 'Product and Ventures',
    description: 'From zero to patent-filed product - technical strategy, IP protection, and building things people actually want.',
    skills: ['Patent Filing (US + China)', 'Technical Product Strategy', 'IP and Competitive Analysis', 'Cross-functional Leadership', 'Hardware Go-to-Market'],
  },
];

export const experiences: Experience[] = [
  {
    date: '2024 - Now',
    org: 'SonicMold',
    role: 'Founder',
    team: 'SonicMold / Sonic Fuse · Custom In-Ear Monitor Startup',
    bullets: [
      'Founded a 3D-printed multi-driver custom IEM venture - owning everything from acoustic structure design to go-to-market strategy.',
      'Invented a novel acoustic architecture; filed patents in both the United States (#19/355,355) and China.',
      'Led prototyping with resin 3D printing, driver tuning, and frequency-response measurement workflows.',
    ],
    tags: ['Acoustic Design', '3D Printing', 'Patent Strategy', 'Product'],
  },
  {
    date: '2025',
    org: 'ByteDance',
    role: 'ML Inference Engineer Intern',
    team: 'LLM Infrastructure',
    bullets: [
      'Optimized production-scale LLM inference pipeline for reduced latency and higher throughput.',
      'Implemented CUDA kernel and TensorRT graph optimizations for transformer architectures.',
      'Collaborated with cross-functional teams on deployment strategy for billion-parameter models.',
    ],
    tags: ['LLM Inference', 'CUDA', 'TensorRT', 'C++'],
  },
  {
    date: '2023-24',
    org: 'UMich',
    role: 'Research Assistant',
    team: 'Soundability Lab · Prof. Dhruv Jain',
    bullets: [
      'Built ML models for real-time sound recognition to assist Deaf and hard-of-hearing users.',
      'Contributed to a medical catheter acoustic sensing sub-project.',
      'Designed STFT/filterbank signal processing pipelines for audio classification.',
    ],
    tags: ['Signal Processing', 'PyTorch', 'Audio ML', 'Accessibility'],
  },
];

export const projects: Project[] = [
  {
    type: 'Startup · Patent',
    title: 'SonicMold / Sonic Fuse',
    description: 'Founded a 3D-printed multi-driver custom in-ear monitor startup. Novel acoustic structure with patents filed in both the United States and China.',
    detail: 'US Utility Patent #19/355,355 (pending) · CN Patent Filed · Sole Inventor',
    link: profile.github,
    tags: ['3D Printing', 'Acoustics', 'Hardware IP'],
  },
  {
    type: 'Research · Accessibility',
    title: 'Sound Recognition for DHH Users',
    description: 'ML system identifying everyday sounds - alarms, doorbells, speech - to assist Deaf and hard-of-hearing individuals in real time.',
    tags: ['Audio Classification', 'PyTorch', 'STFT'],
  },
  {
    type: 'Industry · Infrastructure',
    title: 'LLM Inference Optimization',
    description: 'Production-scale latency and throughput improvements for large language model serving at ByteDance, using custom CUDA kernels and TensorRT.',
    tags: ['CUDA', 'TensorRT', 'Systems'],
  },
  {
    type: 'Research · Medical',
    title: 'Medical Catheter Acoustic Sensing',
    description: 'Acoustic sensing techniques applied to medical catheters for non-invasive diagnostics - cross-disciplinary research at UMich Soundability Lab.',
    tags: ['Medical Devices', 'DSP', 'Signal Analysis'],
  },
];

export const education: Education[] = [
  {
    mark: 'GT',
    school: 'Georgia Institute of Technology',
    degrees: 'MS Electrical and Computer Engineering · MS Computer Science and Engineering',
    gpa: '4.0 GPA',
    date: '2024 - 2027',
  },
  {
    mark: 'UM',
    school: 'University of Michigan, Ann Arbor',
    degrees: 'BSE Computer Science and Engineering · BSE Computer Engineering',
    gpa: '3.73 GPA',
    date: '2020 - 2024',
  },
];
