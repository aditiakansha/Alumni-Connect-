import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  MessageSquare,
  Briefcase,
  Share2,
  ArrowRight,
} from "lucide-react";

const quickLinks = [
  {
    icon: Users,
    label: "Directory",
    desc: "Find alumni by role, company, or city",
    href: "/directory",
  },
  {
    icon: Calendar,
    label: "Events",
    desc: "Reunions, workshops, and meetups",
    href: "/events",
  },
  {
    icon: MessageSquare,
    label: "Discussions",
    desc: "Ask questions, share updates",
    href: "/discussions",
  },
  {
    icon: Briefcase,
    label: "Jobs",
    desc: "Openings posted by fellow alumni",
    href: "/jobs",
  },
  {
    icon: Share2,
    label: "Referrals",
    desc: "Request or offer a referral",
    href: "/referrals",
  },
];

const stats = [
  { value: "8", label: "Verified profiles" },
  { value: "5", label: "Industry tracks" },
  { value: "1", label: "Growing network" },
];

export default function Home() {
  return (
    <div className="bg-[#FAFAFA]">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-20">
        <p className="text-sm font-semibold tracking-wide text-[#ffc002]">
          Your college, still connected
        </p>
        <h1 className="mt-3 max-w-3xl text-5xl font-bold leading-tight text-[#002148] sm:text-6xl">
          Where alumni find each other
          <span className="text-[#ffc002]">.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-slate-600">
          Browse the directory, get referrals, post openings, and stay in
          the loop on events — all in one place built for our alumni
          network.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/register"
            className="flex items-center gap-2 rounded-md bg-[#002148] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a2f5c]"
          >
            Create your profile
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/directory"
            className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#002148] hover:bg-slate-100"
          >
            Browse directory
          </Link>
        </div>

        {/* Stats strip */}
        <div className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-slate-200 pt-8">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-[#002148]">
                {s.value}
              </div>
              <div className="text-sm text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick links / dashboard entry points */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="mb-6 text-xl font-bold text-[#002148]">
          Jump back in
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {quickLinks.map(({ icon: Icon, label, desc, href }) => (
            <Link
              key={label}
              to={href}
              className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-[#ffc002]/60 hover:shadow-sm"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#002148]/5 text-[#002148] group-hover:bg-[#ffc002]/20 group-hover:text-[#002148]">
                <Icon size={20} />
              </div>
              <div className="font-semibold text-[#002148]">{label}</div>
              <p className="mt-1 text-sm text-slate-500">{desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}