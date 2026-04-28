import { motion } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { Truck, Recycle, ShieldCheck, ArrowRight, Leaf, Globe } from 'lucide-react';

export default function LandingPage() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="relative pt-16">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-white px-4">
        <div className="absolute inset-0 z-0">
          <div className="absolute -left-10 top-20 h-72 w-72 rounded-full bg-emerald-50 mix-blend-multiply blur-3xl opacity-70 animate-blob" />
          <div className="absolute -right-10 top-40 h-72 w-72 rounded-full bg-blue-50 mix-blend-multiply blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute left-1/2 bottom-20 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-50 mix-blend-multiply blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 max-w-4xl text-center"
        >
          <span className="mb-6 inline-block rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-600">
            A New Life for Your Labels
          </span>
          <h1 className="font-serif text-6xl font-light leading-[1.1] tracking-tight text-neutral-900 md:text-8xl">
            Circular Fashion, <br />
            <span className="italic">Redefined by AI.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-neutral-500 md:text-xl">
            DOR AI optimizes used clothing logistics through dynamic scheduling and smart routing. 
            Reducing waste and miles, one pickup at a time.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => signInWithGoogle()}
              className="group flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-4 text-lg font-semibold text-white hover:bg-neutral-800 transition-all active:scale-95"
            >
              Start Recycling
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button 
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full border border-neutral-200 px-8 py-4 text-lg font-semibold text-neutral-600 hover:bg-neutral-50 transition-all cursor-pointer"
            >
              How it works
            </button>
          </div>
        </motion.div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="bg-white py-24 px-4 border-t border-neutral-100">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl italic text-neutral-900">How DOR AI Works</h2>
            <p className="mt-4 text-neutral-500">A minimal flow for maximal impact.</p>
          </div>
          
          <div className="grid gap-12 md:grid-cols-3 relative">
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 font-serif text-2xl italic text-white shadow-xl">1</div>
              <h4 className="text-lg font-bold text-neutral-900 uppercase tracking-widest">You Input</h4>
              <p className="mt-4 text-sm text-neutral-500 max-w-xs mx-auto text-center leading-relaxed">
                Log your pickup request with location and item details. Simple as sending a text.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 font-serif text-2xl italic text-white shadow-xl ring-4 ring-emerald-50">2</div>
              <h4 className="text-lg font-bold text-emerald-600 uppercase tracking-widest">AI Optimizes</h4>
              <p className="mt-4 text-sm text-neutral-500 max-w-xs mx-auto text-center leading-relaxed">
                Gemini-3-Flash analyzes all pending requests to create the smartest, lowest-emission pickup route.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 font-serif text-2xl italic text-white shadow-xl">3</div>
              <h4 className="text-lg font-bold text-neutral-900 uppercase tracking-widest">Growth Output</h4>
              <p className="mt-4 text-sm text-neutral-500 max-w-xs mx-auto text-center leading-relaxed">
                Drivers get optimized routes, you get a clean closet, and the planet gets confirmed CO2 savings.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-neutral-50 py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-3">
            {[
              {
                icon: Truck,
                title: "Smart Pickups",
                desc: "AI-optimized routes mean less fuel, fewer emissions, and reliable collection times.",
                color: "emerald"
              },
              {
                icon: Recycle,
                title: "Circular sorting",
                desc: "Every item is tracked and directed to its highest potential—resale, repair, or fiber recycling.",
                color: "blue"
              },
              {
                icon: ShieldCheck,
                title: "Verified Impact",
                desc: "Real-time visibility into the water, CO2, and waste saved by your contributions.",
                color: "amber"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group rounded-3xl bg-white p-8 shadow-sm transition-all hover:shadow-md"
              >
                <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-${feature.color}-50 text-${feature.color}-600`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">{feature.title}</h3>
                <p className="mt-4 text-neutral-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-white py-24 px-4 overflow-hidden">
         <div className="mx-auto max-w-7xl relative">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
               {[
                  { label: "Water Saved", value: "2.4M Liters", icon: Globe },
                  { label: "CO2 Mitigated", value: "120 Tons", icon: Leaf },
                  { label: "Items Diverted", value: "50k+", icon: Recycle },
                  { label: "Active Donors", value: "12k", icon: ShieldCheck }
               ].map((stat, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center">
                     <stat.icon className="h-8 w-8 text-neutral-300 mb-4" />
                     <span className="text-3xl font-bold tracking-tight text-neutral-900">{stat.value}</span>
                     <span className="text-sm font-medium uppercase tracking-widest text-neutral-400 mt-2">{stat.label}</span>
                  </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}
