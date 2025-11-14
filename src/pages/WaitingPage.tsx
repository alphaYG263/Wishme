import { useEffect, useState } from "react";
import { Gift } from "lucide-react";

const WaitingPage = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 8,
    minutes: 34,
    seconds: 56,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white/10 animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-white/10 animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-white/10 animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 right-1/3 w-28 h-28 rounded-full bg-white/10 animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Main Content */}
      <div className="max-w-2xl w-full text-center relative z-10 animate-fade-in">
        {/* Gift Box Animation */}
        <div className="mb-12 inline-block animate-float">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl animate-pulse-soft" />
            <div className="relative text-9xl">🎁</div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-12 text-white space-y-4">
          <p className="text-2xl md:text-3xl font-light animate-fade-in" style={{ animationDelay: "200ms" }}>
            A magical surprise arrives on
          </p>
          <h1 className="text-4xl md:text-6xl font-bold animate-fade-in" style={{ animationDelay: "400ms" }}>
            December 15, 2025
          </h1>
          <p className="text-lg md:text-xl text-white/80 animate-fade-in" style={{ animationDelay: "600ms" }}>
            at midnight
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 animate-scale-in" style={{ animationDelay: "800ms" }}>
          <div className="grid grid-cols-4 gap-4 md:gap-8">
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Minutes", value: timeLeft.minutes },
              { label: "Seconds", value: timeLeft.seconds },
            ].map((unit, index) => (
              <div key={unit.label} className="animate-fade-in" style={{ animationDelay: `${1000 + index * 100}ms` }}>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 mb-3">
                  <span className="text-4xl md:text-6xl font-bold text-white tabular-nums">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-sm md:text-base text-white/80 font-medium uppercase tracking-wide">
                  {unit.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Message */}
        <p className="mt-12 text-white/70 text-sm md:text-base animate-fade-in" style={{ animationDelay: "1400ms" }}>
          ✨ Something special is waiting for you ✨
        </p>
      </div>
    </div>
  );
};

export default WaitingPage;
