import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const StatCounter = ({ value, label }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 1.4,
        ease: "easeOut",
        onUpdate: (v) => setDisplay(Math.floor(v)),
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-display font-tabular text-4xl md:text-5xl font-semibold" style={{ color: "var(--color-primary)" }}>
        {display.toLocaleString()}+
      </p>
      <p className="text-sm text-black/60 mt-1">{label}</p>
    </div>
  );
};

const steps = [
  {
    title: "Restaurant posts surplus",
    body: "Kitchens list surplus food in seconds with a live safety countdown.",
  },
  {
    title: "NGO claims instantly",
    body: "Nearby NGOs see urgent listings first and claim with one tap.",
  },
  {
    title: "Food reaches communities",
    body: "Pickup is tracked end-to-end, with feedback closing the loop.",
  },
];

const LandingPage = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="px-6 pt-20 pb-24 text-center max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-display text-4xl md:text-6xl font-medium leading-tight"
        >
          Turn surplus food into{" "}
          <span style={{ color: "var(--color-primary)" }}>saved meals</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="mt-5 text-lg text-black/60"
        >
          FeedRelay connects restaurants and hotels with NGOs in real time —
          reducing waste, building trust, and feeding communities.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-8 flex justify-center gap-4"
        >
          <Link
            to="/register"
            className="rounded-full px-6 py-3 font-semibold text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Join as Restaurant
          </Link>
          <Link
            to="/register"
            className="rounded-full px-6 py-3 font-semibold text-white"
            style={{ backgroundColor: "var(--color-ngo)" }}
          >
            Join as NGO
          </Link>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-6 py-16 bg-white border-y border-black/5">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8">
          <StatCounter value={12400} label="Meals saved" />
          <StatCounter value={180} label="Partner NGOs" />
          <StatCounter value={320} label="Restaurants onboard" />
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <h2 className="font-display text-3xl font-medium text-center mb-14">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="rounded-2xl p-6 bg-white border border-black/5 shadow-sm"
            >
              <span className="font-display text-3xl font-semibold" style={{ color: "var(--color-primary)" }}>
                0{i + 1}
              </span>
              <h3 className="font-semibold text-lg mt-3">{step.title}</h3>
              <p className="text-black/60 text-sm mt-2">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
