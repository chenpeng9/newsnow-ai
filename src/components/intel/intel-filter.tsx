import { useState } from "react"

interface IntelFilterProps {
  selectedCategory: string | undefined
  onCategoryChange: (category: string | undefined) => void
}

const categories = [
  { value: "", label: "全部" },
  { value: "AI动态", label: "🤖 AI动态" },
  { value: "财经市场", label: "💰 财经市场" },
  { value: "全球视点", label: "🌍 全球视点" },
]

export function IntelFilter({ selectedCategory, onCategoryChange }: IntelFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedLabel = categories.find(c => c.value === (selectedCategory || ""))?.label || "全部"

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={$([
          "flex items-center gap-2 px-3 py-1.5 rounded-lg",
          "text-sm font-medium",
          "bg-zinc-100 dark:bg-zinc-800",
          "hover:bg-zinc-200 dark:hover:bg-zinc-700",
          "transition-colors",
        ])}
      >
        <span>{selectedLabel}</span>
        <span className={$("transition-transform", isOpen && "rotate-180")}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className={$([
          "absolute right-0 mt-2",
          "min-w-[140px] py-1 rounded-lg",
          "bg-white dark:bg-zinc-900",
          "border border-zinc-200 dark:border-zinc-800",
          "shadow-lg z-20",
        ])}
        >
          {categories.map(category => (
            <button
              key={category.value}
              type="button"
              onClick={() => {
                onCategoryChange(category.value || undefined)
                setIsOpen(false)
              }}
              className={$([
                "w-full text-left px-4 py-2 text-sm",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                "transition-colors",
                selectedCategory === category.value && "text-primary font-medium",
              ])}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
