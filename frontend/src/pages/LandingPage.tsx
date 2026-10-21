import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight, ArrowRight, CalendarDays, ChevronRight, MapPin, Play, Sparkles, Users } from 'lucide-react';
import type { EventItem } from '@/types';
import { api } from '@/lib/api';
import EventCard from '@/components/EventCard';
import Loader from '@/components/Loader';

const speakers = [
  { name: 'Maya Chen', role: 'AI Researcher', image: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=700' },
  { name: 'Arjun Mehta', role: 'Cloud Architect', image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=700' },
  { name: 'Nia Brooks', role: 'Product Designer', image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=700' },
];

export default function LandingPage() {
  const [featured, setFeatured] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 190]);
  const heroScale = useTransform(scrollY, [0, 700], [1, 1.08]);

  useEffect(() => {
    api.listEvents({ sort: 'date_asc' }).then((events) => setFeatured(events.slice(0, 3))).catch(() => setFeatured([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-hidden bg-[#160b35]">
      <section className="summitra-hero relative min-h-[780px] overflow-hidden sm:min-h-[860px]">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(233,81,255,.45),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(96,28,206,.8),transparent_38%),linear-gradient(135deg,#7924d8_0%,#8b2bdc_42%,#4720ad_100%)]" />
          <div className="summitra-orbit summitra-orbit-one" />
          <div className="summitra-orbit summitra-orbit-two" />
          <div className="summitra-orbit summitra-orbit-three" />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 0.7px, transparent 0.7px)', backgroundSize: '26px 26px' }} />
        </motion.div>

        <div className="relative z-10 mx-auto flex min-h-[780px] max-w-[1380px] flex-col px-6 pb-16 pt-6 sm:px-10 lg:px-14">
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="flex items-center justify-between text-white">
            <Link to="/" className="font-display text-2xl font-bold tracking-[-0.06em] sm:text-3xl">SeatSage</Link>
            <div className="hidden items-center gap-8 text-sm font-medium text-white/75 md:flex"><a href="#about" className="transition hover:text-white">About</a><a href="#speakers" className="transition hover:text-white">Speakers</a><Link to="/events" className="transition hover:text-white">Events</Link></div>
            <Link to="/events" className="summitra-pill summitra-pill-small"><span>Book a seat</span><span className="summitra-pill-icon"><ArrowRight className="h-4 w-4" /></span></Link>
          </motion.div>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .15 }} className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[.25em] text-[#ffd66b]"><Sparkles className="h-4 w-4" /> SeatSage live sessions</motion.div>
            <motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .85, delay: .25 }} className="mt-8 max-w-5xl font-display text-5xl font-bold leading-[.96] tracking-[-.06em] text-[#ffd66b] sm:text-7xl lg:text-[104px]">Discover. Connect.<br />Create memories.</motion.h1>
            <motion.p initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .4 }} className="mt-8 max-w-xl text-base leading-7 text-white/80 sm:text-lg">The people, ideas and experiences worth showing up for. Find your next unforgettable event and claim your seat before it is gone.</motion.p>
            <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .52 }} className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link to="/events" className="summitra-pill"><span>Explore events</span><span className="summitra-pill-icon"><ArrowRight className="h-5 w-5" /></span></Link>
              <a href="#about" className="group flex items-center gap-3 text-sm font-semibold text-white"><span className="grid h-12 w-12 place-items-center rounded-full border border-white/35 bg-white/10 transition group-hover:bg-white/20"><Play className="ml-0.5 h-4 w-4 fill-current" /></span>See how it works</a>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8, delay: .8 }} className="mt-14 flex flex-wrap items-center justify-center gap-5 text-sm text-white/80"><span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#ffd66b]" /> 12 cities worldwide</span><span className="h-1 w-1 rounded-full bg-white/50" /><span className="flex items-center gap-2"><Users className="h-4 w-4 text-[#ffd66b]" /> 8,000+ guests joined</span></motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 45 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .7 }} className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
            {speakers.map((speaker, index) => <div key={speaker.name} className={`summitra-person-card ${index === 1 ? 'sm:-translate-y-8' : ''}`}><img src={speaker.image} alt={speaker.name} /><div className="absolute inset-0 bg-gradient-to-t from-[#24104e]/85 via-transparent to-transparent" /><div className="absolute bottom-4 left-4 text-left"><p className="font-display text-base font-bold text-white">{speaker.name}</p><p className="text-xs text-white/70">{speaker.role}</p></div></div>)}
          </motion.div>
        </div>
        <a href="#about" className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-white/70 transition hover:text-white"><ArrowDownRight className="h-6 w-6 rotate-45" /></a>
      </section>

      <section id="about" className="bg-[#160b35] px-6 py-24 sm:px-10 lg:px-14"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="text-sm font-semibold uppercase tracking-[.25em] text-[#ffd66b]">More than a ticket</p><h2 className="mt-5 max-w-xl font-display text-4xl font-bold leading-tight tracking-[-.04em] text-white sm:text-6xl">Make room for the moments that matter.</h2></div><div className="max-w-xl"><p className="text-lg leading-8 text-white/60">SeatSage brings your city’s most exciting gatherings into one warm, effortless place. Browse with curiosity, book with confidence, and arrive ready to be part of something bigger.</p><Link to="/events" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#ffd66b] transition hover:gap-3">Find your next experience <ChevronRight className="h-4 w-4" /></Link></div></div></section>

      <section id="speakers" className="bg-[#f9e9c8] px-6 py-24 text-[#24104e] sm:px-10 lg:px-14"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-sm font-bold uppercase tracking-[.25em] text-[#7d27c9]">Happening soon</p><h2 className="mt-4 font-display text-4xl font-bold tracking-[-.04em] sm:text-6xl">Choose your next story.</h2></div><Link to="/events" className="summitra-pill summitra-pill-purple w-fit"><span>View all events</span><span className="summitra-pill-icon"><ArrowRight className="h-5 w-5" /></span></Link></div>{loading ? <Loader label="Loading events…" /> : <div className="mt-12 grid gap-6 md:grid-cols-3">{featured.map((event, index) => <div key={event.id} className="rounded-[24px] bg-white/70 p-3 shadow-xl shadow-[#6b38a3]/10"><EventCard event={event} index={index} /></div>)}</div>}</div></section>

      <section className="relative overflow-hidden bg-[#7924d8] px-6 py-24 text-center sm:px-10 lg:px-14"><div className="summitra-orbit summitra-orbit-four" /><div className="relative z-10 mx-auto max-w-3xl"><CalendarDays className="mx-auto h-9 w-9 text-[#ffd66b]" /><h2 className="mt-6 font-display text-4xl font-bold leading-tight tracking-[-.04em] text-[#ffd66b] sm:text-6xl">Your people are out there.<br />Go meet them.</h2><p className="mx-auto mt-6 max-w-lg text-white/75">From intimate workshops to electric live shows, the next great memory is one booking away.</p><Link to="/events" className="summitra-pill mt-8"><span>Browse the lineup</span><span className="summitra-pill-icon"><ArrowRight className="h-5 w-5" /></span></Link></div></section>
    </div>
  );
}
