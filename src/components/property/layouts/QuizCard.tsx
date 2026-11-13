import { useState } from "react"
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { QuizData } from "@/lib/markdown-parser"

type QuizCardProps = { quizzes: QuizData[] }

export function QuizCard({ quizzes }: QuizCardProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [complete, setComplete] = useState(false)
  const quiz = quizzes[questionIndex]
  const isCorrect = selectedIndex === quiz.correctIndex

  function handleSubmit() { if (selectedIndex !== null) setSubmitted(true) }
  function handleNext() {
    if (questionIndex === quizzes.length - 1) { setComplete(true); return }
    setQuestionIndex((index) => index + 1)
    setSelectedIndex(null)
    setSubmitted(false)
  }
  function handleReset() { setQuestionIndex(0); setSelectedIndex(null); setSubmitted(false); setComplete(false) }

  return <div className="mt-12 max-w-3xl rounded-xl border border-zinc-200 bg-zinc-50/50 p-6 shadow-xl backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.03]">
    <div className="flex items-center justify-between gap-4 border-b border-zinc-200/60 pb-4 dark:border-white/[0.05]"><div className="flex items-center gap-2.5"><div className="flex size-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-800 dark:bg-white/[0.06] dark:text-zinc-50"><HelpCircle className="size-4" /></div><div><h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Concept Check</h3><p className="text-[10px] text-zinc-500 dark:text-zinc-400">{quizzes.length > 1 ? `${questionIndex + 1} of ${quizzes.length} questions` : "Test your understanding of the lesson above."}</p></div></div>{quizzes.length > 1 && <span className="font-mono text-[10px] text-zinc-500">{String(questionIndex + 1).padStart(2, "0")}/{String(quizzes.length).padStart(2, "0")}</span>}</div>
    {complete ? <div className="py-8 text-center"><CheckCircle2 className="mx-auto size-8 text-zinc-700 dark:text-zinc-200" /><h4 className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">Concept check complete</h4><p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">You made it through every question.</p><button type="button" onClick={handleReset} className="mt-5 rounded-md border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-white/[0.08] dark:text-zinc-300 dark:hover:bg-white/[0.05]">Try again</button></div> : <>
      <p className="mt-5 text-sm font-medium leading-relaxed text-zinc-800 dark:text-zinc-200">{quiz.question}</p>
      <div className="mt-5 space-y-2.5">{quiz.options.map((option, index) => { const isSelected = selectedIndex === index; const isCurrentCorrect = index === quiz.correctIndex; let optionStyle = "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-white/[0.06] dark:bg-white/[0.01] dark:text-zinc-400 dark:hover:bg-white/[0.04]"; if (isSelected) optionStyle = "border-zinc-800 bg-zinc-900 text-zinc-50 dark:border-white/20 dark:bg-white/10 dark:text-zinc-50"; if (submitted) { if (isCurrentCorrect) optionStyle = "border-zinc-700 bg-zinc-200 text-zinc-900 dark:border-white/40 dark:bg-white/15 dark:text-zinc-50"; else if (isSelected) optionStyle = "border-zinc-500 bg-zinc-100 text-zinc-700 dark:border-white/20 dark:bg-white/[0.06] dark:text-zinc-300"; else optionStyle = "border-zinc-100 bg-transparent text-zinc-300 opacity-50 dark:border-white/[0.04] dark:text-zinc-600" } return <button key={option} type="button" disabled={submitted} onClick={() => setSelectedIndex(index)} className={cn("flex w-full cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-left text-xs font-medium transition-all duration-200 disabled:pointer-events-none", optionStyle)}><span>{option}</span>{submitted && isCurrentCorrect && <CheckCircle2 className="ml-2 size-4 shrink-0" />}{submitted && isSelected && !isCorrect && <AlertCircle className="ml-2 size-4 shrink-0" />}</button> })}</div>
      <div className="mt-6 flex items-center justify-between gap-4">{!submitted ? <button type="button" onClick={handleSubmit} disabled={selectedIndex === null} className="rounded-md bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-50 transition-colors hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-30 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">Submit answer</button> : <button type="button" onClick={handleNext} className="rounded-md bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">{questionIndex === quizzes.length - 1 ? "Finish" : "Next question"}</button>}</div>
      {submitted && quiz.explanation && <div className="mt-5 rounded-lg border border-zinc-200/80 bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-600 dark:border-white/[0.04] dark:bg-white/[0.02] dark:text-zinc-400"><p className="mb-1 font-semibold text-zinc-900 dark:text-zinc-300">{isCorrect ? "Correct." : "Not quite."}</p><p>{quiz.explanation}</p></div>}
    </>}
  </div>
}
