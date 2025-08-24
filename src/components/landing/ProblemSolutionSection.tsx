import * as React from "react";
import { 
  AlertTriangle, 
  GitBranch, 
  TimerReset, 
  Receipt, 
  GaugeCircle, 
  ShieldCheck, 
  Lock,
  ArrowRight 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";
import { motion, AnimatePresence } from "framer-motion";

interface ProblemCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface SolutionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ icon, title, description }) => (
  <Card className="rounded-3xl border border-red-400/20 bg-red-500/5 backdrop-blur shadow-lg">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        {icon}
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-red-100/80">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const SolutionCard: React.FC<SolutionCardProps> = ({ icon, title, description }) => (
  <Card className="rounded-3xl border border-green-400/20 bg-green-500/5 backdrop-blur shadow-lg">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        {icon}
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-green-100/80">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface ProblemSolutionSectionProps {
  storageSaved: number;
  className?: string;
}

const formatPercent = (n: number) => `${Math.round(n)}%`;

const ProblemSolutionSection: React.FC<ProblemSolutionSectionProps> = ({ storageSaved, className }) => {
  const [showSolution, setShowSolution] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(30);

  // Timer effect for automatic transition
  React.useEffect(() => {
    if (!showSolution) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setShowSolution(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showSolution]);

  // Allow manual toggle
  const toggleView = () => {
    setShowSolution(!showSolution);
    if (!showSolution) {
      setTimeLeft(0);
    } else {
      setTimeLeft(30);
    }
  };
  const problems = [
    {
      icon: <AlertTriangle className="w-8 h-8 text-amber-300" />,
      title: "Descriptive ≠ Verifiable",
      description: "Model and system cards describe intent, but auditors need independent, tamper-evident proof."
    },
    {
      icon: <GitBranch className="w-8 h-8 text-amber-300" />,
      title: "Lineage Without Integrity",
      description: "OpenLineage tracks events; without cryptographic anchoring, evidence can be disputed."
    },
    {
      icon: <TimerReset className="w-8 h-8 text-amber-300" />,
      title: "Proof at Production Speed",
      description: "zkML is powerful but often heavy; we need scalable verification paths for live systems."
    }
  ];

  const solutions = [
    {
      icon: <Receipt className="w-8 h-8 text-emerald-300" />,
      title: "Proof Capsules",
      description: "Tamper-evident receipts for training, inference, configuration, and compliance events."
    },
    {
      icon: <GaugeCircle className="w-8 h-8 text-emerald-300" />,
      title: "LCM Efficiency",
      description: `Generate capsules on demand. My internal tests show ~${formatPercent(storageSaved)} storage reduction.`
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-emerald-300" />,
      title: "Capsule Anchoring",
      description: "Capsules are chained with cryptographic methods for rapid, trustworthy verification."
    }
  ];

  return (
    <section className={cn("container mx-auto px-6 py-16 md:py-24 max-w-7xl", className)}>
      <SectionHeader
        kicker="The Challenge & My Answer"
        title="From AI Audit Confusion to Cryptographic Clarity"
        subtitle="Today's compliance is descriptive. Tomorrow's needs to be verifiable."
      />
      
      {/* Timer and Toggle Controls */}
      <div className="mt-8 flex items-center justify-center gap-4">
        {!showSolution && timeLeft > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/20 border border-indigo-400/30">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-indigo-200 text-sm">
              Solution reveals in {timeLeft}s
            </span>
          </div>
        )}
        <button
          onClick={toggleView}
          className="px-4 py-2 rounded-full bg-slate-600/20 border border-slate-400/30 text-slate-200 text-sm hover:bg-slate-600/30 transition-colors"
        >
          {showSolution ? 'Show Problem' : 'Show Solution Now'}
        </button>
      </div>
      
      <div className="mt-16 relative min-h-[600px]">
        <AnimatePresence mode="wait">
          {!showSolution ? (
            <motion.div
              key="problem"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="grid lg:grid-cols-2 gap-16"
            >
              {/* Problem Side */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-xl bg-red-500/20">
                    <AlertTriangle className="w-6 h-6 text-red-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">The Problem</h3>
                </div>
                <div className="space-y-6">
                  {problems.map((problem, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15, duration: 0.8, ease: "easeOut" }}
                    >
                      <ProblemCard
                        icon={problem.icon}
                        title={problem.title}
                        description={problem.description}
                      />
                    </motion.div>
                  ))}
                </div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                  className="mt-6 p-4 rounded-2xl bg-amber-600/10 border border-amber-400/30"
                >
                  <p className="text-amber-100/90 text-sm font-medium">
                    In short: AI moves faster than compliance can keep up. Proof must be cryptographic, not just descriptive.
                  </p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                  className="mt-6 p-4 rounded-2xl bg-red-600/10 border border-red-400/30"
                >
                  <p className="text-red-100/90 text-sm">
                    <strong>Current state:</strong> AI produces outputs faster than we can prove integrity. 
                    Auditors need cryptographic evidence, not just documentation.
                  </p>
                </motion.div>
              </div>

              {/* Placeholder for alignment */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 opacity-30">
                  <ArrowRight className="w-12 h-12 text-indigo-300" />
                  <span className="text-indigo-300 font-semibold">Solution Coming...</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="solution"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="grid lg:grid-cols-2 gap-16"
            >
              {/* Problem Side - Faded */}
              <div className="opacity-30">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-xl bg-red-500/20">
                    <AlertTriangle className="w-6 h-6 text-red-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">The Problem</h3>
                </div>
                <div className="space-y-6">
                  {problems.map((problem, index) => (
                    <ProblemCard
                      key={index}
                      icon={problem.icon}
                      title={problem.title}
                      description={problem.description}
                    />
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex items-center justify-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="flex flex-col items-center gap-4 bg-indigo-900/80 backdrop-blur p-4 rounded-2xl border border-indigo-400/30"
                >
                  <ArrowRight className="w-12 h-12 text-indigo-300" />
                  <span className="text-indigo-300 font-semibold">CIAF + LCM</span>
                </motion.div>
              </div>

              {/* Solution Side */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-xl bg-green-500/20">
                    <ShieldCheck className="w-6 h-6 text-green-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">My Solution</h3>
                </div>
                <div className="space-y-6">
                  {solutions.map((solution, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15, duration: 0.8, ease: "easeOut" }}
                    >
                      <SolutionCard
                        icon={solution.icon}
                        title={solution.title}
                        description={solution.description}
                      />
                    </motion.div>
                  ))}
                </div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                  className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-400/30"
                >
                  <p className="text-indigo-100/90 text-sm">
                    <strong>Beyond encryption & checksums:</strong> CIAF capsules provide auditable provenance — 
                    who created data, when, and how — not just confidentiality.
                  </p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
                  className="mt-4 p-4 rounded-2xl bg-slate-600/10 border border-slate-400/30"
                >
                  <p className="text-slate-100/90 text-sm">
                    <strong>Implementation Note:</strong> Demonstration only. No sensitive data is processed. Patent-pending; cryptographic details withheld.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Arrow */}
      {showSolution && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:hidden flex items-center justify-center my-8"
        >
          <div className="flex items-center gap-4">
            <ArrowRight className="w-8 h-8 text-indigo-300 rotate-90" />
            <span className="text-indigo-300 font-semibold">CIAF + LCM</span>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export { ProblemSolutionSection };
