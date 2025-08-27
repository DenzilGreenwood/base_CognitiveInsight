'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RubricScores } from '@/types/admin';
import { AdminService } from '@/lib/admin-service';

interface RubricScoringModalProps {
  requestId: string;
  requestData: {
    name: string;
    org: string;
    roleHint: string;
    sector: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (scores: RubricScores) => void;
}

export default function RubricScoringModal({
  requestId,
  requestData,
  isOpen,
  onClose,
  onSubmit
}: RubricScoringModalProps) {
  const [scores, setScores] = useState<RubricScores>({
    missionFit: { score: 0, notes: '' },
    roleClarity: { score: 0, notes: '' },
    dataFeasibility: { score: 0, notes: '' },
    timeline: { score: 0, notes: '' },
    overallScore: 0,
    recommendation: 'CONDITIONAL'
  });

  const criteria = [
    {
      key: 'missionFit' as keyof RubricScores,
      title: 'Mission Fit',
      description: 'How well does this request align with our mission and goals?',
      guidelines: [
        '5: Perfect alignment with core mission',
        '4: Strong alignment with clear value',
        '3: Good alignment with some gaps',
        '2: Limited alignment, requires justification',
        '1: Poor alignment, high risk'
      ]
    },
    {
      key: 'roleClarity' as keyof RubricScores,
      title: 'Role Clarity',
      description: 'Is the applicant\'s role and responsibilities clearly defined?',
      guidelines: [
        '5: Crystal clear role with detailed responsibilities',
        '4: Clear role with minor clarification needed',
        '3: Generally clear but some ambiguity',
        '2: Unclear role requiring significant discussion',
        '1: Very unclear or inappropriate role'
      ]
    },
    {
      key: 'dataFeasibility' as keyof RubricScores,
      title: 'Data Feasibility',
      description: 'How feasible are the data requirements and access needs?',
      guidelines: [
        '5: All data readily available and accessible',
        '4: Most data available with minor challenges',
        '3: Data available but requires coordination',
        '2: Significant data challenges but solvable',
        '1: Major data barriers or unavailable'
      ]
    },
    {
      key: 'timeline' as keyof RubricScores,
      title: 'Timeline Feasibility',
      description: 'Is the proposed timeline realistic and achievable?',
      guidelines: [
        '5: Very realistic with buffer time',
        '4: Realistic timeline with proper planning',
        '3: Tight but achievable timeline',
        '2: Aggressive timeline requiring careful management',
        '1: Unrealistic timeline'
      ]
    }
  ];

  const updateScore = (criterion: keyof RubricScores, field: 'score' | 'notes', value: number | string) => {
    setScores(prev => {
      const updated = { ...prev };
      
      if (criterion === 'missionFit' || criterion === 'roleClarity' || criterion === 'dataFeasibility' || criterion === 'timeline') {
        const current = updated[criterion] as { score: number; notes: string };
        updated[criterion] = {
          ...current,
          [field]: value
        };
      }
      
      // Calculate overall score
      const totalScore = (
        updated.missionFit.score +
        updated.roleClarity.score +
        updated.dataFeasibility.score +
        updated.timeline.score
      ) / 4;
      
      updated.overallScore = Math.round(totalScore * 10) / 10;
      
      // Auto-recommendation based on overall score
      if (updated.overallScore >= 4.5) {
        updated.recommendation = 'ACCEPT';
      } else if (updated.overallScore >= 3.0) {
        updated.recommendation = 'CONDITIONAL';
      } else {
        updated.recommendation = 'REJECT';
      }
      
      return updated;
    });
  };

  const handleSubmit = async () => {
    await AdminService.scoreFit(requestId, scores);
    onSubmit(scores);
    onClose();
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'ACCEPT': return 'bg-green-500';
      case 'CONDITIONAL': return 'bg-yellow-500';
      case 'REJECT': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-800 rounded-lg border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Rubric Scoring</h2>
              <div className="flex items-center space-x-4 text-sm text-indigo-200">
                <span>{requestData.name}</span>
                <span>•</span>
                <span>{requestData.org}</span>
                <span>•</span>
                <Badge variant="outline" className="border-indigo-400/50 text-indigo-300">
                  {requestData.roleHint}
                </Badge>
                <Badge variant="outline" className="border-indigo-400/50 text-indigo-300">
                  {requestData.sector}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-indigo-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {criteria.map((criterion) => (
              <Card key={criterion.key} className="bg-white/5 border-white/10">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-white">{criterion.title}</CardTitle>
                  <p className="text-sm text-indigo-200">{criterion.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Score Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-indigo-200">Score</span>
                      <span className="text-lg font-bold text-white">
                        {criterion.key === 'missionFit' || criterion.key === 'roleClarity' || 
                         criterion.key === 'dataFeasibility' || criterion.key === 'timeline' 
                          ? (scores[criterion.key] as { score: number; notes: string }).score || 0
                          : 0}/5
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => updateScore(criterion.key, 'score', star)}
                          className={`p-1 rounded transition-colors ${
                            star <= (criterion.key === 'missionFit' || criterion.key === 'roleClarity' || 
                                   criterion.key === 'dataFeasibility' || criterion.key === 'timeline' 
                                    ? (scores[criterion.key] as { score: number; notes: string }).score || 0
                                    : 0)
                              ? 'text-yellow-400 hover:text-yellow-300'
                              : 'text-gray-500 hover:text-gray-400'
                          }`}
                        >
                          <Star className="w-6 h-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Guidelines */}
                  <div>
                    <span className="text-sm font-medium text-indigo-200 block mb-2">Guidelines</span>
                    <ul className="text-xs text-indigo-300 space-y-1">
                      {criterion.guidelines.map((guideline, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{guideline}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-sm font-medium text-indigo-200 block mb-2">
                      Notes & Justification
                    </label>
                    <Textarea
                      placeholder="Add specific notes about this criterion..."
                      value={criterion.key === 'missionFit' || criterion.key === 'roleClarity' || 
                             criterion.key === 'dataFeasibility' || criterion.key === 'timeline' 
                              ? (scores[criterion.key] as { score: number; notes: string }).notes || ''
                              : ''}
                      onChange={(e) => updateScore(criterion.key, 'notes', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-indigo-300 min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Overall Summary */}
          <Card className="mt-6 bg-white/10 border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Overall Assessment</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-indigo-200">Overall Score:</span>
                      <span className="text-2xl font-bold text-white">{scores.overallScore}/5</span>
                    </div>
                    <Badge className={`${getRecommendationColor(scores.recommendation)} text-white`}>
                      {scores.recommendation}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Scores
                  </Button>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-4 gap-4 text-center">
                {criteria.map((criterion) => (
                  <div key={criterion.key} className="bg-white/5 rounded-lg p-3">
                    <div className="text-lg font-bold text-white">
                      {criterion.key === 'missionFit' || criterion.key === 'roleClarity' || 
                       criterion.key === 'dataFeasibility' || criterion.key === 'timeline' 
                        ? (scores[criterion.key] as { score: number; notes: string }).score || 0
                        : 0}
                    </div>
                    <div className="text-xs text-indigo-200">{criterion.title}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
