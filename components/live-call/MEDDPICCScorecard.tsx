'use client'

import { MEDDPICCState } from '@/types/live-call'

const LETTERS = [
  { key: 'metrics', letter: 'M', name: 'Metrics' },
  { key: 'economic_buyer', letter: 'E', name: 'Economic Buyer' },
  { key: 'decision_criteria', letter: 'D', name: 'Decision Criteria' },
  { key: 'decision_process', letter: 'D', name: 'Decision Process' },
  { key: 'paper_process', letter: 'P', name: 'Paper Process' },
  { key: 'identify_pain', letter: 'I', name: 'Identify Pain' },
  { key: 'champion', letter: 'C', name: 'Champion' },
  { key: 'competition', letter: 'C', name: 'Competition' },
]

export function MEDDPICCScorecard({ state }: { state: MEDDPICCState }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-white mb-4">MEDDPICC Scorecard</h3>
      <div className="flex gap-2">
        {LETTERS.map(({ key, letter, name }) => {
          const isActive = !!state[key as keyof MEDDPICCState]
          return (
            <div
              key={key}
              className={`
                flex-1 aspect-square flex items-center justify-center rounded-lg
                text-2xl font-bold transition-all cursor-pointer
                ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400'}
              `}
              title={`${name}${isActive ? ': ' + state[key as keyof MEDDPICCState] : ''}`}
            >
              {letter}
            </div>
          )
        })}
      </div>
    </div>
  )
}
