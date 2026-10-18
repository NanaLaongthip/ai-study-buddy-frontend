import React from 'react';
import {
  BrainCircuit,
  Code2,
  Database,
  GraduationCap,
  Layers3,
  Server,
  Sparkles,
  UserRound,
} from 'lucide-react';

const technologyGroups = [
  {
    title: 'Frontend',
    icon: Layers3,
    technologies: [
      'React 19',
      'Vite',
      'React Router v7',
      'Tailwind CSS',
      'Zustand',
      'TanStack Query',
    ],
  },
  {
    title: 'Backend & Database',
    icon: Database,
    technologies: ['Node.js', 'Express.js', 'Prisma ORM', 'PostgreSQL'],
  },
  {
    title: 'AI Engine',
    icon: BrainCircuit,
    technologies: ['Multi-Provider LLM Integration'],
  },
];

export const AboutPage: React.FC = () => (
  <div className="mx-auto max-w-5xl space-y-8 py-6 sm:py-10">
    <header className="text-center">
      <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
        <GraduationCap className="h-8 w-8" aria-hidden="true" />
      </div>
      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-secondary">
        เกี่ยวกับโครงการ
      </p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">AI Study Buddy</h1>
      <p className="mx-auto mt-3 max-w-2xl text-base-content/70">
        ผู้ช่วยเรียนอัจฉริยะที่เปลี่ยนเอกสารประกอบการเรียนให้กลายเป็นประสบการณ์ทบทวนบทเรียนที่ครบถ้วน
      </p>
    </header>

    <section aria-labelledby="project-overview">
      <div className="card border border-base-200 bg-base-100 shadow-sm">
        <div className="card-body gap-4 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 id="project-overview" className="card-title text-xl">
              ภาพรวมโครงการ
            </h2>
          </div>
          <p className="max-w-3xl leading-7 text-base-content/75">
            AI Study Buddy คือแพลตฟอร์มอัจฉริยะที่ช่วยดึงข้อความจากไฟล์ PDF
            สร้างสรุปบทเรียนเชิงวิชาการอย่างละเอียด ทำแฟลชการ์ดโต้ตอบแบบ 3 มิติ
            และจัดทำแบบทดสอบพร้อมวิเคราะห์จุดอ่อน เพื่อช่วยให้ผู้เรียนทบทวนเนื้อหาได้อย่างตรงจุด
          </p>
        </div>
      </div>
    </section>

    <section aria-labelledby="tech-stack">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-secondary/10 p-2.5 text-secondary">
          <Code2 className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 id="tech-stack" className="text-xl font-bold">
            เทคโนโลยีที่ใช้
          </h2>
          <p className="text-sm text-base-content/60">เครื่องมือที่ขับเคลื่อนแพลตฟอร์ม</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {technologyGroups.map(({ title, icon: Icon, technologies }) => (
          <article
            key={title}
            className="card border border-base-200 bg-base-100 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="card-body p-5">
              <div className="mb-1 flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-semibold">{title}</h3>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {technologies.map((technology) => (
                  <span key={technology} className="badge badge-outline badge-primary">
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section aria-labelledby="developer-profile">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-accent/10 p-2.5 text-accent">
          <UserRound className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 id="developer-profile" className="text-xl font-bold">
            ผู้พัฒนา
          </h2>
          <p className="text-sm text-base-content/60">ผู้สร้างสรรค์ AI Study Buddy</p>
        </div>
      </div>

      <article className="card border border-base-200 bg-base-100 shadow-sm">
        <div className="card-body gap-6 p-6 sm:p-8 md:flex-row md:items-start">
          <div className="avatar placeholder self-start">
            <div className="w-16 rounded-2xl bg-primary/10 text-primary">
              <span className="text-xl font-bold">LP</span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold">Laongthip Phokhonwong</h3>
            <div className="mt-2 flex items-center gap-2 text-sm font-medium text-primary">
              <Server className="h-4 w-4" aria-hidden="true" />
              Full-Stack Developer
            </div>
            <p className="mt-4 text-sm font-semibold">ความรับผิดชอบ</p>
            <p className="mt-1 leading-7 text-base-content/70">
              พัฒนาสถาปัตยกรรม SPA แบบแยกส่วนที่ทันสมัย สร้าง RESTful API
              ออกแบบ UI/UX และเชื่อมต่อกระบวนการทำงานของ AI (AI Pipeline)
            </p>
          </div>
        </div>
      </article>
    </section>
  </div>
);

export default AboutPage;
