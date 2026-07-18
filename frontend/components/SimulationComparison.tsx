import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sliders, ArrowRight, TrendingDown, TrendingUp, Compass } from "lucide-react";
import { Constraint, Impact, AffectedArea, DecisionCompass } from "@/lib/mockData";

export interface SimulationPreset {
  id: string;
  name: string;
  originalTitle: string;
  modifiedTitle: string;
  originalScore: number;
  modifiedScore: number;
  originalCompass: DecisionCompass;
  modifiedCompass: DecisionCompass;
  originalConstraints: Constraint[];
  modifiedConstraints: Constraint[];
  originalImpacts: Impact[];
  modifiedImpacts: Impact[];
  originalAreas: AffectedArea[];
  modifiedAreas: AffectedArea[];
}

export function SimulationComparison({ activePreset }: { activePreset: SimulationPreset }) {
  const delta = activePreset.modifiedScore - activePreset.originalScore;

  const getDeltaStyles = (val: number) => {
    if (val > 0) return { text: `+${val} stability gain`, colorClass: "text-success bg-success/5 border-success/20", icon: TrendingUp };
    if (val < 0) return { text: `${val} stability loss`, colorClass: "text-danger bg-danger/5 border-danger/20", icon: TrendingDown };
    return { text: "No stability change", colorClass: "text-secondary bg-secondary/5 border-secondary/20", icon: Sliders };
  };

  const deltaStyles = getDeltaStyles(delta);
  const DeltaIcon = deltaStyles.icon;

  return (
    <>
      <Card className={`border ${deltaStyles.colorClass} select-none`}>
        <CardContent className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-background border border-border">
              <DeltaIcon size={20} className={delta > 0 ? "text-success" : delta < 0 ? "text-danger" : "text-secondary"} />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider block">
                Stability Score Delta
              </span>
              <h3 className="text-sm font-bold text-text uppercase">
                {deltaStyles.text}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-3 font-mono font-extrabold text-xl">
            <span className="text-secondary">{activePreset.originalScore}</span>
            <ArrowRight size={16} className="text-secondary" />
            <span className={delta > 0 ? "text-success" : delta < 0 ? "text-danger" : "text-text"}>
              {activePreset.modifiedScore}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 select-none">
            <span className="w-1.5 h-6 bg-secondary rounded" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-secondary">Original Strategy</h3>
          </div>
          <Card className="bg-surface/60 border-dashed">
            <CardContent className="p-5">
              <h4 className="text-sm font-bold text-text mb-1">{activePreset.originalTitle}</h4>
              <p className="text-xs text-secondary leading-relaxed">Deterministic scenario path representing base assumptions.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3 border-b border-border bg-background/5">
              <CardTitle className="text-xs uppercase tracking-wider text-secondary font-bold">Original Constraints</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {activePreset.originalConstraints.map((c, idx) => (
                <div key={idx} className="flex justify-between items-start gap-3 text-xs border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
                  <span className="text-secondary/90 leading-relaxed">{c.text}</span>
                  <Badge variant={c.status === "satisfied" ? "success" : c.status === "violated" ? "danger" : "warning"} className="font-mono text-[9px] shrink-0">
                    {c.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3 border-b border-border bg-background/5">
              <CardTitle className="text-xs uppercase tracking-wider text-secondary font-bold">Impact Mapping</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-success uppercase tracking-wider block">Positive</span>
                {activePreset.originalImpacts.slice(0, 2).map((imp, idx) => (
                  <p key={idx} className="text-xs text-text border-l-2 border-success/30 pl-2 leading-relaxed">{imp.text}</p>
                ))}
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-danger uppercase tracking-wider block">Negative</span>
                {activePreset.originalImpacts.slice(2, 4).length > 0 ? (
                  activePreset.originalImpacts.slice(2, 4).map((imp, idx) => (
                    <p key={idx} className="text-xs text-text border-l-2 border-danger/30 pl-2 leading-relaxed">{imp.text}</p>
                  ))
                ) : (
                  <p className="text-xs text-secondary pl-2 leading-relaxed">Minimal platform impact detected.</p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3 border-b border-border bg-background/5">
              <CardTitle className="text-xs uppercase tracking-wider text-secondary font-bold">Affected Areas Stability</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {activePreset.originalAreas.map((area) => (
                <div key={area.name} className="flex items-center justify-between text-xs">
                  <span className="text-secondary font-medium">{area.name}</span>
                  <span className="font-mono font-bold text-text">{area.score}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="py-3 border-b border-border bg-background/5 flex flex-row items-center gap-1.5">
              <Compass size={13} className="text-secondary" />
              <CardTitle className="text-xs uppercase tracking-wider text-secondary font-bold">Decision Compass Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-2">
              <h5 className="text-xs font-bold text-text">{activePreset.originalCompass.recommendation}</h5>
              <p className="text-xs text-secondary leading-relaxed">{activePreset.originalCompass.whyThisMatters}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2.5 select-none">
            <span className="w-1.5 h-6 bg-accent rounded" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-accent">Modified Proposal</h3>
          </div>
          <Card className="bg-accent/[0.01] border-accent/30">
            <CardContent className="p-5">
              <h4 className="text-sm font-bold text-accent mb-1">{activePreset.modifiedTitle}</h4>
              <p className="text-xs text-secondary leading-relaxed">Modified parameters representing experimental strategy simulation.</p>
            </CardContent>
          </Card>
          <Card className="border-accent/15">
            <CardHeader className="py-3 border-b border-border bg-background/5">
              <CardTitle className="text-xs uppercase tracking-wider text-secondary font-bold">Modified Constraints</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {activePreset.modifiedConstraints.map((c, idx) => (
                <div key={idx} className="flex justify-between items-start gap-3 text-xs border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
                  <span className="text-secondary/90 leading-relaxed">{c.text}</span>
                  <Badge variant={c.status === "satisfied" ? "success" : c.status === "violated" ? "danger" : "warning"} className="font-mono text-[9px] shrink-0">
                    {c.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-accent/15">
            <CardHeader className="py-3 border-b border-border bg-background/5">
              <CardTitle className="text-xs uppercase tracking-wider text-secondary font-bold">Impact Mapping</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-success uppercase tracking-wider block">Positive</span>
                {activePreset.modifiedImpacts.slice(0, 2).map((imp, idx) => (
                  <p key={idx} className="text-xs text-text border-l-2 border-success/30 pl-2 leading-relaxed">{imp.text}</p>
                ))}
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-danger uppercase tracking-wider block">Negative</span>
                {activePreset.modifiedImpacts.slice(2, 4).length > 0 ? (
                  activePreset.modifiedImpacts.slice(2, 4).map((imp, idx) => (
                    <p key={idx} className="text-xs text-text border-l-2 border-danger/30 pl-2 leading-relaxed">{imp.text}</p>
                  ))
                ) : (
                  <p className="text-xs text-secondary pl-2 leading-relaxed">Minimal platform impact detected.</p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="border-accent/15">
            <CardHeader className="py-3 border-b border-border bg-background/5">
              <CardTitle className="text-xs uppercase tracking-wider text-secondary font-bold">Affected Areas Stability</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {activePreset.modifiedAreas.map((area) => {
                const origArea = activePreset.originalAreas.find(a => a.name === area.name);
                const areaDelta = origArea ? area.score - origArea.score : 0;
                return (
                  <div key={area.name} className="flex items-center justify-between text-xs">
                    <span className="text-secondary font-medium">{area.name}</span>
                    <div className="flex items-center gap-2 font-mono">
                      {areaDelta !== 0 && (
                        <span className={`text-[10px] font-bold ${areaDelta > 0 ? "text-success" : "text-danger"}`}>
                          {areaDelta > 0 ? `+${areaDelta}` : areaDelta}
                        </span>
                      )}
                      <span className="font-bold text-text">{area.score}%</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          <Card className="border-accent/40 bg-accent/[0.005]">
            <CardHeader className="py-3 border-b border-border bg-background/5 flex flex-row items-center gap-1.5">
              <Compass size={13} className="text-accent" />
              <CardTitle className="text-xs uppercase tracking-wider text-accent font-bold">Decision Compass Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-2">
              <h5 className="text-xs font-bold text-accent">{activePreset.modifiedCompass.recommendation}</h5>
              <p className="text-xs text-secondary leading-relaxed">{activePreset.modifiedCompass.whyThisMatters}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
