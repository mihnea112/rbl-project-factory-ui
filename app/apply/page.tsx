'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { ApplicationStream } from '@/lib/types';
import TriageResultsPage from './triage-result';

type Step = 'stream-select' | 'basic-info' | 'stream-details' | 'attachments' | 'review';

export default function ApplyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('stream-select');
  const [selectedStream, setSelectedStream] = useState<ApplicationStream | null>(null);
  const [showTriageResults, setShowTriageResults] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stream: null as ApplicationStream | null,
    // Stream A specific (Scaling Plan)
    maturityStage: '', // e.g. pilot / regional / multi-regional / national
    provenResults: '', // what works today (evidence, outcomes)
    beneficiaries: '',
    ecosystemAlignment: [] as string[], // 5 areas (at least 1)
    scalingObjectives: '', // 2-3 year objectives
    scalingApproach: [] as string[], // replication / delivery capacity / digitalization / partnerships
    scalingNarrative: '', // how you will scale in practice
    governanceModel: '',
    operatingModel: '',
    fundingStability: '',
    resourcesNeeded: '', // financial + non-financial
    impactKPIs: '',
    risksDependencies: '',
    synergyOpportunities: '',
    supporterNeeds: [] as string[], // capital / expertise / network / leadership
    milestonesTimeline: '',
    // Stream B specific
    hypothesis: '',
    mvpDescription: '',
    pilotPlan: '',
    budget: '',
    impactLogic: '',
    // Common
    attachments: [] as string[],
  });

  const steps: Step[] = ['stream-select', 'basic-info', 'stream-details', 'attachments', 'review'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progressPercent = ((currentStepIndex + 1) / steps.length) * 100;

  const ECOSYSTEM_AREAS = [
    'Entrepreneurial education & culture',
    'Access to finance & capital',
    'Reducing friction for founders',
    'Support for early-stage & growth-stage entrepreneurs',
    'Connecting to mentors, markets & diaspora',
  ];

  const STREAM_A_APPROACHES = [
    'Replication in regional chapters',
    'Increase delivery capacity (people/process)',
    'Digitalization / platformization',
    'Partnerships (public/private/NGO)',
    'Standardization & playbooks',
  ];

  const SUPPORTER_NEEDS = ['Capital', 'Expertise', 'Network', 'Leadership'];

  function toggleArrayValue(arr: string[], value: string) {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  }

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  };

  const handleSubmit = () => {
    // Simulate submission and triage
    setShowTriageResults(true);
  };

  if (showTriageResults) {
    return <TriageResultsPage applicationId="app-new-001" onClose={() => router.push('/')} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Project Application</h1>
              <p className="text-sm text-muted-foreground mt-1">Step {currentStepIndex + 1} of {steps.length}</p>
            </div>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Stream Selection */}
        {currentStep === 'stream-select' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Choose Your Stream</h2>
              <p className="text-muted-foreground">Select the stream that best fits your project.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stream A */}
              <Card
                className={`p-8 cursor-pointer transition-all border-2 ${
                  selectedStream === 'A'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-border/50 bg-card'
                }`}
                onClick={() => {
                  setSelectedStream('A');
                  setFormData({ ...formData, stream: 'A' });
                }}
              >
                <div className="mb-4">
                  <div className="inline-block px-3 py-1 bg-primary/15 text-primary rounded-full text-xs font-semibold">
                    Stream A
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">RBL Upgrade 2.0</h3>
                <p className="text-muted-foreground mb-6">For mature projects ready to scale.</p>
                <ul className="space-y-2 text-sm text-foreground mb-6">
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>2-3 year scaling plan</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Proven model or strong traction</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Focused on acceleration</span>
                  </li>
                </ul>
                <div className={`text-sm font-semibold ${selectedStream === 'A' ? 'text-primary' : 'text-muted-foreground'}`}>
                  {selectedStream === 'A' ? '✓ Selected' : 'Select'}
                </div>
              </Card>

              {/* Stream B */}
              <Card
                className={`p-8 cursor-pointer transition-all border-2 ${
                  selectedStream === 'B'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-border/50 bg-card'
                }`}
                onClick={() => {
                  setSelectedStream('B');
                  setFormData({ ...formData, stream: 'B' });
                }}
              >
                <div className="mb-4">
                  <div className="inline-block px-3 py-1 bg-secondary/20 text-secondary-foreground rounded-full text-xs font-semibold">
                    Stream B
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Open Innovation</h3>
                <p className="text-muted-foreground mb-6">For early-stage ideas with high potential.</p>
                <ul className="space-y-2 text-sm text-foreground mb-6">
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>8-12 week MVP timeline</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Hypothesis-driven development</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Learning and iteration</span>
                  </li>
                </ul>
                <div className={`text-sm font-semibold ${selectedStream === 'B' ? 'text-primary' : 'text-muted-foreground'}`}>
                  {selectedStream === 'B' ? '✓ Selected' : 'Select'}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Basic Info */}
        {currentStep === 'basic-info' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Project Basics</h2>
              <p className="text-muted-foreground">Tell us about your impact project.</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-foreground font-medium">
                  Project Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="E.g., Renewable Energy Training Academy"
                  className="mt-2 bg-input border-border"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-foreground font-medium">
                  Project Description
                </Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your project, the problem it solves, and the impact it creates..."
                  className="mt-2 w-full min-h-32 p-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* Stream-Specific Details */}
        {currentStep === 'stream-details' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {selectedStream === 'A' ? 'Scaling Strategy' : 'Innovation Details'}
              </h2>
              <p className="text-muted-foreground">
                {selectedStream === 'A'
                  ? 'Provide details about your 2-3 year scaling plan'
                  : 'Share your hypothesis, MVP approach, and impact logic'}
              </p>
            </div>

            <div className="space-y-4">
              {selectedStream === 'A' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maturity-stage" className="text-foreground font-medium">
                        Current maturity stage
                      </Label>
                      <select
                        id="maturity-stage"
                        value={formData.maturityStage}
                        onChange={(e) => setFormData({ ...formData, maturityStage: e.target.value })}
                        className="mt-2 w-full h-10 px-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select stage...</option>
                        <option value="Pilot">Pilot</option>
                        <option value="Regional">Regional</option>
                        <option value="Multi-regional">Multi-regional</option>
                        <option value="National">National</option>
                      </select>
                      <p className="text-xs text-muted-foreground mt-2">
                        Stream A is for projects with proven relevance/impact and a realistic 2–3 year scaling trajectory.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="beneficiaries" className="text-foreground font-medium">
                        Target beneficiaries / users
                      </Label>
                      <Input
                        id="beneficiaries"
                        value={formData.beneficiaries}
                        onChange={(e) => setFormData({ ...formData, beneficiaries: e.target.value })}
                        placeholder="Who benefits (and how many today)?"
                        className="mt-2 bg-input border-border"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="proven-results" className="text-foreground font-medium">
                      Proven results (evidence)
                    </Label>
                    <textarea
                      id="proven-results"
                      value={formData.provenResults}
                      onChange={(e) => setFormData({ ...formData, provenResults: e.target.value })}
                      placeholder="What works today? Include outcomes, traction, pilots, testimonials, partners, or any measurable results."
                      className="mt-2 w-full min-h-28 p-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <Label className="text-foreground font-medium">
                      Ecosystem alignment (pick at least 1)
                    </Label>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {ECOSYSTEM_AREAS.map((area) => (
                        <label
                          key={area}
                          className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/40 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="mt-1"
                            checked={formData.ecosystemAlignment.includes(area)}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                ecosystemAlignment: toggleArrayValue(formData.ecosystemAlignment, area),
                              })
                            }
                          />
                          <span className="text-sm text-foreground">{area}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      All Project Factory initiatives should strengthen Romania’s entrepreneurial ecosystem.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="scaling-objectives" className="text-foreground font-medium">
                      2–3 year objectives
                    </Label>
                    <textarea
                      id="scaling-objectives"
                      value={formData.scalingObjectives}
                      onChange={(e) => setFormData({ ...formData, scalingObjectives: e.target.value })}
                      placeholder="What will be true in 24–36 months? (coverage, outcomes, number of beneficiaries, regions, institutions, etc.)"
                      className="mt-2 w-full min-h-28 p-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <Label className="text-foreground font-medium">
                      Scaling approach (choose what applies)
                    </Label>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {STREAM_A_APPROACHES.map((approach) => (
                        <label
                          key={approach}
                          className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/40 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="mt-1"
                            checked={formData.scalingApproach.includes(approach)}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                scalingApproach: toggleArrayValue(formData.scalingApproach, approach),
                              })
                            }
                          />
                          <span className="text-sm text-foreground">{approach}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="scaling-narrative" className="text-foreground font-medium">
                      Scaling narrative (how you will scale)
                    </Label>
                    <textarea
                      id="scaling-narrative"
                      value={formData.scalingNarrative}
                      onChange={(e) => setFormData({ ...formData, scalingNarrative: e.target.value })}
                      placeholder="Explain your plan: replication model, playbooks, partnerships, chapter rollout, quality control, and what will change operationally."
                      className="mt-2 w-full min-h-28 p-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="governance-model" className="text-foreground font-medium">
                        Governance & accountability
                      </Label>
                      <textarea
                        id="governance-model"
                        value={formData.governanceModel}
                        onChange={(e) => setFormData({ ...formData, governanceModel: e.target.value })}
                        placeholder="Who leads? What decisions, cadence, reporting, and responsibilities?"
                        className="mt-2 w-full min-h-24 p-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <Label htmlFor="operating-model" className="text-foreground font-medium">
                        Operating model
                      </Label>
                      <textarea
                        id="operating-model"
                        value={formData.operatingModel}
                        onChange={(e) => setFormData({ ...formData, operatingModel: e.target.value })}
                        placeholder="How do you deliver today and at scale (team, processes, delivery partners, chapters)?"
                        className="mt-2 w-full min-h-24 p-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="funding-stability" className="text-foreground font-medium">
                        Funding stability
                      </Label>
                      <textarea
                        id="funding-stability"
                        value={formData.fundingStability}
                        onChange={(e) => setFormData({ ...formData, fundingStability: e.target.value })}
                        placeholder="Current funding sources, renewal risk, diversification, and how you plan stability."
                        className="mt-2 w-full min-h-24 p-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <Label htmlFor="resources-needed" className="text-foreground font-medium">
                        Required resources (financial + non-financial)
                      </Label>
                      <textarea
                        id="resources-needed"
                        value={formData.resourcesNeeded}
                        onChange={(e) => setFormData({ ...formData, resourcesNeeded: e.target.value })}
                        placeholder="Funding, people, expertise, infrastructure, tools, partnerships."
                        className="mt-2 w-full min-h-24 p-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="impact-kpis" className="text-foreground font-medium">
                      Impact & sustainability KPIs
                    </Label>
                    <textarea
                      id="impact-kpis"
                      value={formData.impactKPIs}
                      onChange={(e) => setFormData({ ...formData, impactKPIs: e.target.value })}
                      placeholder="Define a small set of outcome-oriented KPIs (not only activity volume). Include cost/impact if possible."
                      className="mt-2 w-full min-h-24 p-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="risks" className="text-foreground font-medium">
                        Risks & dependencies
                      </Label>
                      <textarea
                        id="risks"
                        value={formData.risksDependencies}
                        onChange={(e) => setFormData({ ...formData, risksDependencies: e.target.value })}
                        placeholder="What could break the plan? What do you depend on (partners, regulations, funding, capacity)?"
                        className="mt-2 w-full min-h-24 p-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <Label htmlFor="synergies" className="text-foreground font-medium">
                        Synergy opportunities
                      </Label>
                      <textarea
                        id="synergies"
                        value={formData.synergyOpportunities}
                        onChange={(e) => setFormData({ ...formData, synergyOpportunities: e.target.value })}
                        placeholder="Where could you collaborate with other RBL projects/chapters to amplify impact?"
                        className="mt-2 w-full min-h-24 p-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-foreground font-medium">
                      What support do you need from RBL?
                    </Label>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {SUPPORTER_NEEDS.map((need) => (
                        <label
                          key={need}
                          className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/40 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="mt-1"
                            checked={formData.supporterNeeds.includes(need)}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                supporterNeeds: toggleArrayValue(formData.supporterNeeds, need),
                              })
                            }
                          />
                          <span className="text-sm text-foreground">{need}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      This helps match your project with the right supporters (capital, expertise, network, leadership).
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="milestones" className="text-foreground font-medium">
                      Key milestones & timeline
                    </Label>
                    <textarea
                      id="milestones"
                      value={formData.milestonesTimeline}
                      onChange={(e) => setFormData({ ...formData, milestonesTimeline: e.target.value })}
                      placeholder="List major milestones and expected dates for the next 12–36 months."
                      className="mt-2 w-full min-h-24 p-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="hypothesis" className="text-foreground font-medium">
                      Core Hypothesis
                    </Label>
                    <textarea
                      id="hypothesis"
                      value={formData.hypothesis}
                      onChange={(e) => setFormData({ ...formData, hypothesis: e.target.value })}
                      placeholder="What's your core assumption about how to solve this problem?"
                      className="mt-2 w-full min-h-24 p-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mvp" className="text-foreground font-medium">
                      MVP Description & Timeline
                    </Label>
                    <textarea
                      id="mvp"
                      value={formData.mvpDescription}
                      onChange={(e) => setFormData({ ...formData, mvpDescription: e.target.value })}
                      placeholder="Describe your minimum viable product and 8-12 week plan..."
                      className="mt-2 w-full min-h-24 p-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <Label htmlFor="budget" className="text-foreground font-medium">
                      Requested Budget (EUR)
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="E.g., 25000"
                      className="mt-2 bg-input border-border"
                    />
                  </div>

                  <div>
                    <Label htmlFor="impact-logic" className="text-foreground font-medium">
                      Impact Logic & Success Metrics
                    </Label>
                    <textarea
                      id="impact-logic"
                      value={formData.impactLogic}
                      onChange={(e) => setFormData({ ...formData, impactLogic: e.target.value })}
                      placeholder="How will you measure success? What does impact look like?"
                      className="mt-2 w-full min-h-24 p-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Attachments */}
        {currentStep === 'attachments' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Supporting Documents</h2>
              <p className="text-muted-foreground">Upload pitch deck, financial models, or other supporting documents.</p>
            </div>

            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-card hover:bg-muted transition-colors">
              <div className="text-4xl mb-3">📎</div>
              <h3 className="font-semibold text-foreground mb-2">Upload Files</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop files here or click to browse (PDF, Excel, Word, Video)
              </p>
              <Button variant="outline" className="border-border text-foreground hover:bg-slate-light bg-transparent">
                Choose Files
              </Button>
              <p className="text-xs text-muted-foreground mt-4">Max 50MB per file</p>
            </div>

            <div className="bg-muted/40 border border-border rounded-lg p-4">
              <p className="text-sm text-foreground">
                <strong>Helpful documents:</strong> Pitch deck, financial projections, team bios, impact framework, market research, pilot results (if applicable).
              </p>
            </div>
          </div>
        )}

        {/* Review */}
        {currentStep === 'review' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Review Your Application</h2>
              <p className="text-muted-foreground">Please review all information before submitting.</p>
            </div>

            <Card className="p-6 border-border bg-card">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 text-lg">Project Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Title</p>
                      <p className="text-foreground font-medium">{formData.title || '(Not provided)'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Stream</p>
                      <p className="text-foreground font-medium">
                        {selectedStream === 'A' ? 'Stream A - RBL Upgrade 2.0' : 'Stream B - Open Innovation'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="text-foreground">{formData.description || '(Not provided)'}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <p className="text-xs text-muted-foreground mb-2">
                    By submitting, you agree to our terms and acknowledge that your application will be reviewed by RBL's assessment team.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 mt-12">
          <Button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            variant="outline"
            className="gap-2 border-border text-foreground hover:bg-slate-light bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentStep === 'review' ? (
            <Button
              onClick={handleSubmit}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground ml-auto"
            >
              Submit Application
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 'stream-select' && !selectedStream) ||
                (currentStep === 'basic-info' && (!formData.title || !formData.description))
              }
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground ml-auto"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
