"use client";

import { Button } from "@flagix/ui/components/button";
import { Label } from "@flagix/ui/components/label";
import { Target, TrendingUp, Users, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const DemoSection = () => {
  const [flagEnabled, setFlagEnabled] = useState(false);
  const [rolloutPercentage, setRolloutPercentage] = useState(0);
  const [targetingMode, setTargetingMode] = useState("all");
  const [activeUsers, setActiveUsers] = useState(new Set());
  const [isAnimating, setIsAnimating] = useState(false);

  const totalUsers = 100;

  const users = useMemo(
    () =>
      Array.from({ length: totalUsers }, (_, i) => ({
        id: i,
        isPremium: i % 5 === 0,
      })),
    []
  );

  useEffect(() => {
    if (!flagEnabled) {
      setActiveUsers(new Set());
      setRolloutPercentage(0);
      return;
    }

    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 700);

    let targetUsers = users;

    if (targetingMode === "premium") {
      targetUsers = users.filter((u) => u.isPremium);
    }

    const numToActivate = Math.floor(
      targetUsers.length * (rolloutPercentage / 100)
    );
    const shuffled = [...targetUsers].sort(() => Math.random() - 0.5);
    const newActiveUsers = new Set(
      shuffled.slice(0, numToActivate).map((u) => u.id)
    );

    setActiveUsers(newActiveUsers);

    return () => clearTimeout(timer);
  }, [flagEnabled, rolloutPercentage, targetingMode, users]);

  const handleToggle = () => {
    if (flagEnabled) {
      setFlagEnabled(false);
    } else {
      setFlagEnabled(true);
      setRolloutPercentage(100);
    }
  };

  let totalTargetableUsers = totalUsers;
  if (targetingMode === "premium") {
    totalTargetableUsers = users.filter((u) => u.isPremium).length;
  }

  const stats = {
    active: activeUsers.size,
    total: totalTargetableUsers,
  };

  return (
    <section className="bg-black py-24" id="demo">
      <div className="container-landing">
        <div className="text-center">
          <h2 className="mt-2 font-bold text-4xl text-white">
            See Feature Flags in Action
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Watch how gradual rollouts and targeting rules work in real-time.
            Each square represents a user in your system.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/5 bg-[#1D1C1D] p-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-xl">
                    enable-new-dashboard
                  </h3>
                  <p className="mt-1 text-sm text-white/50">
                    Roll out the redesigned dashboard to users
                  </p>
                </div>

                <Button
                  className={`relative h-12 w-24 rounded-full transition-all duration-500 ${
                    flagEnabled ? "bg-green-600" : "bg-[#bfbfc5]"
                  }`}
                  onClick={handleToggle}
                >
                  <div
                    className={`absolute top-1 h-10 w-10 rounded-full bg-white shadow-lg transition-all duration-500 ${
                      flagEnabled ? "left-12" : "left-1"
                    }`}
                  />
                </Button>
              </div>

              {flagEnabled && (
                <div className="mt-8 space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center space-x-2 font-semibold text-sm text-white">
                        <TrendingUp className="h-4 w-4 text-white/50" />
                        <span>Rollout Percentage</span>
                      </Label>
                      <span className="font-bold text-2xl text-white">
                        {rolloutPercentage}%
                      </span>
                    </div>
                    <input
                      className="h-2 w-full flex-1 cursor-pointer appearance-none rounded-lg [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500"
                      max={100}
                      min={0}
                      onChange={(e) =>
                        setRolloutPercentage(Number(e.target.value))
                      }
                      style={{
                        background: `linear-gradient(to right, rgb(16, 185, 129) 0%, rgb(16, 185, 129) ${rolloutPercentage}%, rgb(229, 231, 235) ${rolloutPercentage}%, rgb(229, 231, 235) 100%)`,
                      }}
                      type="range"
                      value={rolloutPercentage}
                    />
                    <div className="mt-2 flex justify-between text-white/50 text-xs">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div>
                    <Label className="flex items-center space-x-2 font-semibold text-sm text-white">
                      <Target className="h-4 w-4 text-white/50" />
                      <span>Targeting Rules</span>
                    </Label>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {[
                        { value: "all", label: "All Users" },
                        { value: "premium", label: "Premium" },
                      ].map((mode) => (
                        <Button
                          className={`rounded-lg border px-4 py-2 font-medium text-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:ring-offset-[#1D1C1D] ${
                            targetingMode === mode.value
                              ? "border-black bg-black/90 text-white shadow-md hover:bg-black"
                              : "border-gray-700 bg-transparent text-white/70 hover:border-gray-600 hover:text-white"
                          }`}
                          key={mode.value}
                          onClick={() => setTargetingMode(mode.value)}
                        >
                          {mode.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/5 bg-[#1D1C1D] p-6 shadow-lg">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-white/50" />
                  <span className="font-medium text-sm text-white/70">
                    Active Users
                  </span>
                </div>
                <p className="mt-2 font-bold text-3xl text-white">
                  {stats.active}
                </p>
              </div>
              <div className="rounded-xl border border-white/5 bg-[#1D1C1D] p-6 shadow-lg">
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-white/50" />
                  <span className="font-medium text-sm text-white/70">
                    Coverage
                  </span>
                </div>
                <p className="mt-2 font-bold text-3xl text-white">
                  {stats.total > 0
                    ? Math.round((stats.active / stats.total) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#191919] p-4">
              <p className="text-sm text-white/70">
                <span className="font-semibold text-white">Try it:</span> Toggle
                the flag on, adjust the rollout percentage, and switch targeting
                rules to see how features are deployed in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="rounded-2xl border border-white/10 bg-[#1D1C1D] p-8 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h4 className="font-semibold text-white">User Base</h4>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-[#bfbfc5]" />
                    <span className="text-white/70">Inactive</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-white/70">Active</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-10 gap-2">
                {users.map((user) => {
                  const isActive = activeUsers.has(user.id);
                  const isPremium = user.isPremium;

                  return (
                    <div
                      className={`relative h-8 w-8 rounded-lg transition-all duration-700 ease-in-out ${
                        isAnimating
                          ? "-translate-y-0.5 scale-[1.05]"
                          : "scale-100"
                      } ${isActive ? "bg-green-500 shadow-xl" : "bg-[#bfbfc5]"}`}
                      key={user.id}
                      style={{
                        transitionDelay: `${(user.id % 10) * 15}ms`,
                      }}
                    >
                      {isPremium && (
                        <div className="-right-1 -top-1 absolute h-2 w-2 rounded-full bg-yellow-400 ring-1 ring-black/50" />
                      )}
                      {isActive && (
                        <div className="absolute inset-0 animate-ping rounded-lg bg-green-500 opacity-30" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 text-center text-white/50 text-xs">
                <span className="inline-flex items-center">
                  <span className="mr-1 inline-block h-2 w-2 rounded-full bg-yellow-400" />
                  Premium users
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
