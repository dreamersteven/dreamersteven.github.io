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
      'From multi-driver DSP pipelines to custom-fit ear hardware and patent-backed acoustic systems.',
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
    buttonLabel: 'Product Manager Resume',
    resumeFile: 'Hanlong Liu_resume_2026_Product Manager.pdf',
    description: [
      'End-to-end product ownership across R&D, manufacturing, and technical strategy.',
      'Founder and Product Lead for Sonic Fuse / SonicMold.',
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
    date: 'Atlanta, GA · Expected 05/2027',
  },
  {
    href: '#experience',
    className: 'dc-card dc-mid',
    icon: 'monitor',
    title: 'ByteDance',
    description: 'LLM Inference Optimization',
    date: 'vLLM · CUDA · 05/2023-08/2023',
  },
  {
    href: '#projects',
    className: 'dc-card dc-front',
    icon: 'headphones',
    title: 'Sonic Fuse',
    titleClass: 'dc-title-gold',
    description: 'Sonic Fuse · Founder',
    date: 'US App. + CN Patent',
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
    description: 'From customer requirements to manufacturable hardware - technical strategy, supply-chain alignment, and product delivery.',
    skills: ['Patent Strategy (US + China)', 'Technical Product Strategy', 'Manufacturing Workflow', 'Cross-functional Leadership', 'Hardware Go-to-Market'],
  },
];

export const experiences: Experience[] = [
  {
    date: '06/2020 - Present',
    org: 'Sonic Fuse',
    role: 'Founder and Product Lead',
    team: 'SonicMold / Sonic Fuse · Custom In-Ear Monitor Startup',
    bullets: [
      'Led end-to-end development of custom audio hardware solutions for enterprise clients across Germany and the U.S.',
      'Delivered R&D design, acoustic architecture, and manufacturable product specifications for custom earphone systems.',
      'Partnered with Tianqi Group to align precision titanium alloy component design with CNC machining and anodization workflows.',
    ],
    tags: ['Acoustic Design', 'Manufacturing', 'Titanium Components', 'Product'],
  },
  {
    date: '05/2023 - 08/2023',
    org: 'ByteDance',
    role: 'Artificial Intelligence Division Intern',
    team: 'Lark · Enterprise Collaboration Platform',
    bullets: [
      'Benchmarked vLLM against HuggingFace TGI on A100 under 500-request load, achieving p99 latency of 160ms versus 280ms.',
      'Identified KV-cache block fragmentation with nsys profiling and reduced peak VRAM by 18% without throughput regression.',
      'Evaluated tensor parallelism and BF16/FP16 precision trade-offs for production LLM serving workloads.',
    ],
    tags: ['LLM Inference', 'vLLM', 'CUDA', 'nsys'],
  },
  {
    date: '03/2024 - Present',
    org: 'UMich',
    role: 'Research Intern',
    team: 'Soundability Lab · Prof. Dhruv Jain',
    bullets: [
      'Designed DSP modules for filtering, calibration, cross-driver compensation, and real-time audio processing.',
      'Built 3D reconstruction and CAD automation pipelines from FaceID structured-light data for anatomical ear modeling.',
      'Delivered Python/C++ modules for audio processing, data pipelines, and 3D geometry processing.',
    ],
    tags: ['Signal Processing', '3D Reconstruction', 'CAD Automation', 'Audio Systems'],
  },
];

export const projects: Project[] = [
  {
    type: 'Startup · Patent',
    title: 'SonicMold / Sonic Fuse',
    description: 'Founded and led custom audio hardware development, spanning acoustic architecture, R&D design, manufacturable specifications, and supply-chain coordination.',
    detail: 'US Patent App. 63/706,317 · CN Patent ZL 2019 2 0331833.4',
    link: profile.github,
    tags: ['3D Printing', 'Acoustics', 'Hardware IP'],
  },
  {
    type: 'Research · Accessibility',
    title: 'Patented Earphone Embedded Bone Conduction Technology',
    description: 'Multi-driver earphone system integrating DSP calibration, cross-driver compensation, real-time audio processing, and custom-fit 3D reconstruction.',
    tags: ['DSP', 'Bone Conduction', '3D Reconstruction'],
  },
  {
    type: 'Industry · Infrastructure',
    title: 'LLM Inference Optimization',
    description: 'Production-oriented LLM serving evaluation at ByteDance, including vLLM benchmarking, KV-cache profiling, tensor parallelism, and BF16/FP16 trade-off analysis.',
    tags: ['vLLM', 'CUDA', 'nsys'],
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
    degrees: 'MS Computational Science and Engineering · MS Electrical and Computer Engineering',
    gpa: '4.0 GPA',
    date: 'Expected 05/2027',
  },
  {
    mark: 'UM',
    school: 'University of Michigan, Ann Arbor',
    degrees: 'BSE Computer Science Engineering · Minor in Entrepreneurship (Ross School of Business)',
    gpa: '3.73 GPA',
    date: '08/2022 - 05/2025',
  },
];
