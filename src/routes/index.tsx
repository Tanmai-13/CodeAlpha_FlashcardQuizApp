import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Eye, EyeOff, Layers } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flashcard Quiz — Study Smarter" },
      {
        name: "description",
        content:
          "A clean flashcard quiz app to create, study, edit, and delete flashcards. Flip cards, track progress, and study anywhere.",
      },
      { property: "og:title", content: "Flashcard Quiz — Study Smarter" },
      {
        property: "og:description",
        content:
          "A clean flashcard quiz app to create, study, edit, and delete flashcards. Flip cards, track progress, and study anywhere.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

const STORAGE_KEY = "flashcard-quiz-cards";

const SAMPLE_CARDS: Flashcard[] = [
  { id: "sample-1", question: "What is the capital of France?", answer: "Paris" },
  {
    id: "sample-2",
    question: "What does HTML stand for?",
    answer: "HyperText Markup Language",
  },
  {
    id: "sample-3",
    question: "Which planet is known as the Red Planet?",
    answer: "Mars",
  },
  {
    id: "sample-4",
    question: "What is 12 × 8?",
    answer: "96",
  },
  {
    id: "sample-5",
    question: "Who wrote the play 'Romeo and Juliet'?",
    answer: "William Shakespeare",
  },
];

function loadCards(): Flashcard[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_CARDS));
      return SAMPLE_CARDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (c): c is Flashcard =>
          c && typeof c.id === "string" && typeof c.question === "string" && typeof c.answer === "string",
      );
    }
  } catch {
    // fall through to samples
  }
  return SAMPLE_CARDS;
}

function Index() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [modal, setModal] = useState<null | { mode: "add" } | { mode: "edit"; card: Flashcard }>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCards(loadCards());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    }
  }, [cards, hydrated]);

  const current = cards[index] ?? null;

  const goTo = (next: number) => {
    setIndex(next);
    setShowAnswer(false);
  };

  const addCard = (question: string, answer: string) => {
    const card: Flashcard = {
      id: crypto.randomUUID(),
      question,
      answer,
    };
    setCards((prev) => {
      const next = [...prev, card];
      setIndex(next.length - 1);
      return next;
    });
    setShowAnswer(false);
    setModal(null);
  };

  const editCard = (question: string, answer: string) => {
    if (!current) return;
    setCards((prev) => prev.map((c) => (c.id === current.id ? { ...c, question, answer } : c)));
    setModal(null);
  };

  const deleteCard = () => {
    if (!current) return;
    setCards((prev) => {
      const next = prev.filter((c) => c.id !== current.id);
      setIndex((i) => Math.min(i, Math.max(next.length - 1, 0)));
      return next;
    });
    setShowAnswer(false);
    setConfirmDelete(false);
  };

  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-6 sm:py-10">
        {/* Header */}
        <header className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Layers className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Flashcard Quiz
              </h1>
              <p className="text-xs text-muted-foreground sm:text-sm">Study smarter, one card at a time</p>
            </div>
          </div>
          <button
            onClick={() => setModal({ mode: "add" })}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Add Flashcard</span>
            <span className="sm:hidden">Add</span>
          </button>
        </header>

        {/* Study area */}
        <main className="flex flex-1 flex-col items-center justify-center py-8">
          {!hydrated ? null : cards.length === 0 ? (
            <div className="flex w-full flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <Layers className="h-7 w-7" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-foreground">No flashcards yet</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Your deck is empty. Add your first flashcard and start building your study set!
              </p>
              <button
                onClick={() => setModal({ mode: "add" })}
                className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add Flashcard
              </button>
            </div>
          ) : (
            current && (
              <div className="w-full">
                {/* Card indicator */}
                <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
                  Card {index + 1} of {cards.length}
                </p>

                {/* Card */}
                <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-md sm:p-10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Question
                  </span>
                  <p className="mt-2 min-h-12 text-lg font-semibold leading-relaxed text-foreground sm:text-xl">
                    {current.question}
                  </p>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      showAnswer ? "mt-6 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                    aria-hidden={!showAnswer}
                  >
                    <div className="overflow-hidden">
                      <div className="rounded-xl border border-border bg-secondary/60 p-4 sm:p-5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Answer
                        </span>
                        <p className="mt-1 text-base leading-relaxed text-foreground sm:text-lg">
                          {current.answer}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setShowAnswer((s) => !s)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                    >
                      {showAnswer ? (
                        <>
                          <EyeOff className="h-4 w-4" aria-hidden="true" /> Hide Answer
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" aria-hidden="true" /> Show Answer
                        </>
                      )}
                    </button>
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        onClick={() => setModal({ mode: "edit", card: current })}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                        aria-label="Edit current flashcard"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                        aria-label="Delete current flashcard"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="mt-5 flex items-center justify-between">
                  <button
                    onClick={() => goTo(index - 1)}
                    disabled={index === 0}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-card"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    Previous
                  </button>
                  <div className="flex gap-1.5" aria-hidden="true">
                    {cards.map((c, i) => (
                      <button
                        key={c.id}
                        onClick={() => goTo(i)}
                        tabIndex={-1}
                        className={`h-2 rounded-full transition-all ${
                          i === index ? "w-5 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/40"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => goTo(index + 1)}
                    disabled={index === cards.length - 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-card"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )
          )}
        </main>
      </div>

      {/* Add / Edit modal */}
      {modal && (
        <CardModal
          title={modal.mode === "add" ? "Add Flashcard" : "Edit Flashcard"}
          initialQuestion={modal.mode === "edit" ? modal.card.question : ""}
          initialAnswer={modal.mode === "edit" ? modal.card.answer : ""}
          onClose={() => setModal(null)}
          onSubmit={modal.mode === "add" ? addCard : editCard}
        />
      )}

      {/* Delete confirmation */}
      {confirmDelete && current && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          onClick={() => setConfirmDelete(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="delete-title" className="text-lg font-semibold text-foreground">
              Delete this flashcard?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This will permanently remove the card “{current.question}”. This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={deleteCard}
                className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-sm transition-colors hover:bg-destructive/90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CardModal({
  title,
  initialQuestion,
  initialAnswer,
  onClose,
  onSubmit,
}: {
  title: string;
  initialQuestion: string;
  initialAnswer: string;
  onClose: () => void;
  onSubmit: (question: string, answer: string) => void;
}) {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState(initialAnswer);
  const [errors, setErrors] = useState<{ question?: string; answer?: string }>({});

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { question?: string; answer?: string } = {};
    const q = question.trim();
    const a = answer.trim();
    if (!q) nextErrors.question = "Question is required.";
    else if (q.length > 500) nextErrors.question = "Question must be under 500 characters.";
    if (!a) nextErrors.answer = "Answer is required.";
    else if (a.length > 1000) nextErrors.answer = "Answer must be under 1000 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onSubmit(q, a);
  };

  const inputClass = (invalid: boolean) =>
    `mt-1.5 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
      invalid ? "border-destructive" : "border-input"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>

        <div className="mt-4">
          <label htmlFor="fc-question" className="text-sm font-medium text-foreground">
            Question
          </label>
          <textarea
            id="fc-question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="e.g. What is the capital of Japan?"
            className={inputClass(!!errors.question)}
            autoFocus
          />
          {errors.question && <p className="mt-1 text-xs text-destructive">{errors.question}</p>}
        </div>

        <div className="mt-4">
          <label htmlFor="fc-answer" className="text-sm font-medium text-foreground">
            Answer
          </label>
          <textarea
            id="fc-answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="e.g. Tokyo"
            className={inputClass(!!errors.answer)}
          />
          {errors.answer && <p className="mt-1 text-xs text-destructive">{errors.answer}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
