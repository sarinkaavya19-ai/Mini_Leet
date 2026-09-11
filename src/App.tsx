import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = "dashboard" | "workspace" | "profile";
type Difficulty = "Easy" | "Medium" | "Hard";
type Status = "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Runtime Error";

interface Problem {
  id: number;
  title: string;
  difficulty: Difficulty;
  categories: string[];
  solved: boolean;
}

interface Submission {
  id: number;
  problem: string;
  status: Status;
  language: string;
  runtime: string;
  date: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROBLEMS: Problem[] = [
  { id: 1, title: "Two Sum", difficulty: "Easy", categories: ["Array", "Hash Table"], solved: true },
  { id: 2, title: "Valid Parentheses", difficulty: "Easy", categories: ["Stack", "String"], solved: true },
  { id: 3, title: "Binary Search", difficulty: "Easy", categories: ["Searching", "Array"], solved: true },
  { id: 4, title: "Merge Two Sorted Lists", difficulty: "Easy", categories: ["Linked List", "Recursion"], solved: true },
  { id: 5, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", categories: ["Array", "Dynamic Programming"], solved: true },
  { id: 6, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", categories: ["String", "Sliding Window"], solved: false },
  { id: 7, title: "Add Two Numbers", difficulty: "Medium", categories: ["Linked List", "Math"], solved: true },
  { id: 8, title: "Longest Palindromic Substring", difficulty: "Medium", categories: ["String", "Dynamic Programming"], solved: false },
  { id: 9, title: "Container With Most Water", difficulty: "Medium", categories: ["Array", "Two Pointers"], solved: true },
  { id: 10, title: "3Sum", difficulty: "Medium", categories: ["Array", "Sorting"], solved: false },
  { id: 11, title: "Group Anagrams", difficulty: "Medium", categories: ["String", "Hash Table"], solved: false },
  { id: 12, title: "Trapping Rain Water", difficulty: "Hard", categories: ["Array", "Dynamic Programming"], solved: false },
  { id: 13, title: "Median of Two Sorted Arrays", difficulty: "Hard", categories: ["Array", "Binary Search"], solved: false },
  { id: 14, title: "Reverse Linked List", difficulty: "Easy", categories: ["Linked List", "Recursion"], solved: true },
  { id: 15, title: "Maximum Subarray", difficulty: "Easy", categories: ["Array", "Dynamic Programming"], solved: true },
];

const SUBMISSIONS: Submission[] = [
  { id: 1, problem: "Two Sum", status: "Accepted", language: "Python", runtime: "45 ms", date: "2026-09-08" },
  { id: 2, problem: "Valid Parentheses", status: "Accepted", language: "Java", runtime: "12 ms", date: "2026-09-07" },
  { id: 3, problem: "Binary Search", status: "Accepted", language: "Python", runtime: "38 ms", date: "2026-09-06" },
  { id: 4, problem: "Longest Palindromic Substring", status: "Wrong Answer", language: "JavaScript", runtime: "—", date: "2026-09-05" },
  { id: 5, problem: "Container With Most Water", status: "Accepted", language: "Python", runtime: "201 ms", date: "2026-09-04" },
  { id: 6, problem: "3Sum", status: "Time Limit Exceeded", language: "Java", runtime: "—", date: "2026-09-03" },
  { id: 7, problem: "Add Two Numbers", status: "Accepted", language: "C++", runtime: "8 ms", date: "2026-09-02" },
  { id: 8, problem: "Group Anagrams", status: "Wrong Answer", language: "Python", runtime: "—", date: "2026-09-01" },
];

const CATEGORIES = ["Arrays", "Strings", "Searching", "Sorting", "Linked Lists", "Dynamic Programming", "Sliding Window"];

const CODE_SNIPPET = `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`;

// ─── Sub-components ───────────────────────────────────────────────────────────

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const styles = {
    Easy: "bg-[#1a3826] text-[#3fb950] border border-[#238636]",
    Medium: "bg-[#3a2b12] text-[#d29922] border border-[#7a5c1a]",
    Hard: "bg-[#3d1f1e] text-[#f85149] border border-[#6b2828]",
  };
  const dots = { Easy: "🟢", Medium: "🟡", Hard: "🔴" };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium code-font ${styles[difficulty]}`}>
      {dots[difficulty]} {difficulty}
    </span>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    Accepted: "bg-[#1a3826] text-[#3fb950] border border-[#238636]",
    "Wrong Answer": "bg-[#3d1f1e] text-[#f85149] border border-[#6b2828]",
    "Time Limit Exceeded": "bg-[#3a2b12] text-[#d29922] border border-[#7a5c1a]",
    "Runtime Error": "bg-[#2d2157] text-[#a371f7] border border-[#5a3ea6]",
  };
  const icons: Record<Status, string> = {
    Accepted: "✓",
    "Wrong Answer": "✗",
    "Time Limit Exceeded": "⏱",
    "Runtime Error": "⚡",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium code-font ${styles[status]}`}>
      {icons[status]} {status}
    </span>
  );
}

function CategoryTag({ tag, darkMode = true }: { tag: string; darkMode?: boolean }) {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-xs code-font border"
      style={{
        background: darkMode ? "#161b22" : "#f3f4f6",
        color: darkMode ? "#8b949e" : "#6b7280",
        borderColor: darkMode ? "#30363d" : "#e5e7eb",
      }}
    >
      {tag}
    </span>
  );
}

function Avatar({ size = "sm" }: { size?: "sm" | "lg" }) {
  const s = size === "sm" ? "w-8 h-8 text-sm" : "w-16 h-16 text-xl";
  return (
    <div className={`${s} rounded-full bg-gradient-to-br from-[#a371f7] to-[#58a6ff] flex items-center justify-center font-bold text-white flex-shrink-0`}>
      K
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function Navbar({
  screen,
  setScreen,
  darkMode,
  setDarkMode,
}: {
  screen: Screen;
  setScreen: (s: Screen) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}) {
  const navItems: { label: string; key: Screen }[] = [
    { label: "Problems", key: "dashboard" },
    { label: "Submissions", key: "profile" },
    { label: "Profile", key: "profile" },
  ];
  return (
    <header
      className="h-14 border-b flex items-center px-6 gap-6 sticky top-0 z-50 transition-colors"
      style={{
        background: darkMode ? "#161b22" : "#ffffff",
        borderColor: darkMode ? "#30363d" : "#e5e7eb",
      }}
    >
      <button
        onClick={() => setScreen("dashboard")}
        className="flex items-center gap-2 font-bold hover:opacity-80 transition-opacity mr-4"
        style={{ color: darkMode ? "#e6edf3" : "#111827" }}
      >
        <span className="text-[#3fb950] code-font text-lg">{"</>"}</span>
        <span className="text-sm tracking-wide">Mini LeetCode</span>
      </button>

      <nav className="flex items-center gap-1 flex-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setScreen(item.key)}
            className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
            style={{
              color: darkMode ? "#8b949e" : "#6b7280",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = darkMode ? "#21262d" : "#f3f4f6";
              (e.currentTarget as HTMLButtonElement).style.color = darkMode ? "#e6edf3" : "#111827";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = darkMode ? "#8b949e" : "#6b7280";
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-8 h-8 rounded flex items-center justify-center transition-all"
          style={{
            background: darkMode ? "#21262d" : "#f3f4f6",
            color: darkMode ? "#e6edf3" : "#374151",
            border: `1px solid ${darkMode ? "#30363d" : "#e5e7eb"}`,
          }}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        <button
          onClick={() => setScreen("profile")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Avatar size="sm" />
          <span
            className="text-sm font-medium hidden sm:block"
            style={{ color: darkMode ? "#e6edf3" : "#111827" }}
          >
            kaavya19
          </span>
        </button>
      </div>
    </header>
  );
}

// ─── Screen 1: Dashboard ──────────────────────────────────────────────────────

function Dashboard({ setScreen, setProblem, darkMode }: { setScreen: (s: Screen) => void; setProblem: (p: Problem) => void; darkMode: boolean }) {
  const bg = darkMode ? "#161b22" : "#ffffff";
  const border = darkMode ? "#30363d" : "#e5e7eb";
  const subBg = darkMode ? "#0d1117" : "#f6f8fa";
  const text = darkMode ? "#e6edf3" : "#1f2328";
  const muted = darkMode ? "#8b949e" : "#6b7280";
  const hover = darkMode ? "#1f2937" : "#f3f4f6";
  
  const totalSolved = PROBLEMS.filter((p) => p.solved).length;
  const easySolved = PROBLEMS.filter((p) => p.difficulty === "Easy" && p.solved).length;
  const easyTotal = PROBLEMS.filter((p) => p.difficulty === "Easy").length;
  const mediumSolved = PROBLEMS.filter((p) => p.difficulty === "Medium" && p.solved).length;
  const hardSolved = PROBLEMS.filter((p) => p.difficulty === "Hard" && p.solved).length;

  const filtered = PROBLEMS;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* Progress card */}
      <div className="rounded-xl p-6 border" style={{ background: bg, borderColor: border }}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold code-font" style={{ color: text }}>{totalSolved}</span>
              <span className="text-lg code-font" style={{ color: muted }}>/ {PROBLEMS.length} Solved</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden mb-4" style={{ background: darkMode ? "#21262d" : "#e5e7eb" }}>
              <div
                className="h-full bg-gradient-to-r from-[#3fb950] to-[#58a6ff] rounded-full transition-all"
                style={{ width: `${(totalSolved / PROBLEMS.length) * 100}%` }}
              />
            </div>
            <div className="flex gap-4 flex-wrap">
              <span className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-[#3fb950]" />
                <span style={{ color: muted }}>Easy</span>
                <span className="text-[#3fb950] font-semibold code-font">{easySolved}</span>
              </span>
              <span className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-[#d29922]" />
                <span style={{ color: muted }}>Medium</span>
                <span className="text-[#d29922] font-semibold code-font">{mediumSolved}</span>
              </span>
              <span className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-[#f85149]" />
                <span style={{ color: muted }}>Hard</span>
                <span className="text-[#f85149] font-semibold code-font">{hardSolved}</span>
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            {[
              { label: "Easy", count: easySolved, color: "#3fb950", ring: "#238636" },
              { label: "Medium", count: mediumSolved, color: "#d29922", ring: "#7a5c1a" },
              { label: "Hard", count: hardSolved, color: "#f85149", ring: "#6b2828" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="w-20 h-20 rounded-full border-2 flex flex-col items-center justify-center"
                style={{ borderColor: stat.ring, background: subBg }}
              >
                <span className="text-xl font-bold code-font" style={{ color: stat.color }}>{stat.count}</span>
                <span className="text-[10px]" style={{ color: muted }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    

      {/* Problem table */}
      <div className="rounded-xl overflow-hidden border" style={{ background: bg, borderColor: border }}>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: border }}>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider w-12" style={{ color: muted }}>Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: muted }}># Title</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: muted }}>Tags</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: muted }}>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((problem, i) => (
              <tr
                key={problem.id}
                onClick={() => { setProblem(problem); setScreen("workspace"); }}
                className="cursor-pointer transition-colors group border-b"
                style={{ borderColor: i === filtered.length - 1 ? "transparent" : border }}
                onMouseEnter={(e) => (e.currentTarget.style.background = hover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td className="px-4 py-3.5 text-center">
                  {problem.solved ? (
                    <span className="text-[#3fb950] text-base">✓</span>
                  ) : (
                    <span className="w-4 h-4 inline-block rounded-full border" style={{ borderColor: border }} />
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm code-font mr-2" style={{ color: muted }}>{String(problem.id).padStart(2, "0")}.</span>
                  <span className="text-sm font-medium transition-colors" style={{ color: text }}>{problem.title}</span>
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {problem.categories.map((c) => <CategoryTag key={c} tag={c} darkMode={darkMode} />)}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <DifficultyBadge difficulty={problem.difficulty} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm" style={{ color: muted }}>
            No problems match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Screen 2: Workspace ──────────────────────────────────────────────────────

function Workspace({ problem, setScreen, darkMode }: { problem: Problem; setScreen: (s: Screen) => void; darkMode: boolean }) {
  const bg = darkMode ? "#161b22" : "#ffffff";
  const border = darkMode ? "#30363d" : "#e5e7eb";
  const subBg = darkMode ? "#0d1117" : "#f6f8fa";
  const text = darkMode ? "#e6edf3" : "#1f2328";
  const muted = darkMode ? "#8b949e" : "#6b7280";
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState(CODE_SNIPPET);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<"accepted" | "error" | null>(null);
  const [activeTab, setActiveTab] = useState<"output" | "testcases">("output");

  const handleRun = () => {
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setRunning(false);
      setResult("accepted");
      setActiveTab("output");
    }, 1200);
  };

  const handleSubmit = () => {
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setRunning(false);
      setResult("accepted");
      setActiveTab("output");
    }, 1800);
  };

  const codeLines = code.split("\n");

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Workspace header */}
      <div className="h-12 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 gap-4 flex-shrink-0">
        <button
          onClick={() => setScreen("dashboard")}
          className="flex items-center gap-1.5 text-sm text-[#8b949e] hover:text-[#e6edf3] transition-colors"
        >
          <span>←</span>
          <span>Problems</span>
        </button>
        <div className="w-px h-4 bg-[#30363d]" />
        <span className="text-sm font-semibold text-[#e6edf3]">{problem.title}</span>
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Problem details */}
        <div className="w-[45%] flex-shrink-0 border-r border-[#30363d] overflow-y-auto p-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#8b949e] code-font text-sm">#{problem.id}</span>
              <h1 className="text-xl font-bold text-[#e6edf3]">{problem.title}</h1>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <DifficultyBadge difficulty={problem.difficulty} />
              {problem.categories.map((c) => <CategoryTag key={c} tag={c} />)}
            </div>
          </div>

          <div className="text-sm text-[#8b949e] leading-relaxed space-y-3">
            <p>
              Given an array of integers <code className="bg-[#21262d] text-[#a371f7] px-1 py-0.5 rounded code-font text-xs">nums</code> and
              an integer <code className="bg-[#21262d] text-[#a371f7] px-1 py-0.5 rounded code-font text-xs">target</code>, return
              indices of the two numbers such that they add up to <code className="bg-[#21262d] text-[#a371f7] px-1 py-0.5 rounded code-font text-xs">target</code>.
            </p>
            <p>
              You may assume that each input would have <strong className="text-[#e6edf3]">exactly one solution</strong>, and
              you may not use the same element twice.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Examples</h3>
            {[
              { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explain: "nums[0] + nums[1] == 9" },
              { input: "nums = [3,2,4], target = 6", output: "[1,2]", explain: "nums[1] + nums[2] == 6" },
            ].map((ex, i) => (
              <div key={i} className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 code-font text-xs space-y-1">
                <div><span className="text-[#8b949e]">Input: </span><span className="text-[#e6edf3]">{ex.input}</span></div>
                <div><span className="text-[#8b949e]">Output: </span><span className="text-[#3fb950]">{ex.output}</span></div>
                <div><span className="text-[#8b949e]">Explain: </span><span className="text-[#8b949e]">{ex.explain}</span></div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Constraints</h3>
            <ul className="space-y-1">
              {[
                "2 ≤ nums.length ≤ 10⁴",
                "-10⁹ ≤ nums[i] ≤ 10⁹",
                "-10⁹ ≤ target ≤ 10⁹",
                "Only one valid answer exists.",
              ].map((c) => (
                <li key={c} className="text-sm text-[#8b949e] code-font flex gap-2">
                  <span className="text-[#a371f7]">•</span>{c}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1">Hidden Test Cases</div>
              <div className="text-sm text-[#e6edf3]">47 test cases</div>
            </div>
            <span className="text-2xl">🔒</span>
          </div>
        </div>

        {/* Right: Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor toolbar */}
          <div className="h-11 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 gap-3 flex-shrink-0">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#21262d] border border-[#30363d] rounded px-3 py-1 text-xs text-[#e6edf3] code-font focus:outline-none focus:border-[#58a6ff] transition-colors cursor-pointer"
            >
              {["Python", "JavaScript", "Java", "C++"].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
            <div className="flex-1" />
            <button className="text-[#8b949e] hover:text-[#e6edf3] transition-colors text-sm px-2">⚙</button>
          </div>

          {/* Code area */}
          <div className="flex-1 bg-[#0d1117] overflow-auto p-4">
            <div className="code-font text-xs leading-6 line-numbers">
              {codeLines.map((line, i) => (
                <div key={i} className="code-line flex">
                  <span className="w-8 text-right text-[#484f58] select-none mr-4 flex-shrink-0">{i + 1}</span>
                  <span
                    className="flex-1 text-[#e6edf3]"
                    style={{ whiteSpace: "pre" }}
                    dangerouslySetInnerHTML={{ __html: highlightPython(line) }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action bar */}
          <div className="h-14 bg-[#161b22] border-t border-[#30363d] flex items-center justify-between px-4 flex-shrink-0">
            <div className="flex gap-2">

            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRun}
                disabled={running}
                className="px-4 py-1.5 text-sm font-medium text-[#e6edf3] bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-lg transition-colors disabled:opacity-50"
              >
                {running ? "Running..." : "▶ Run"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={running}
                className="px-5 py-1.5 text-sm font-semibold text-black bg-[#3fb950] hover:bg-[#2ea043] rounded-lg transition-colors disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>

          {/* Output panel */}
          <div className="h-44 bg-[#161b22] border-t border-[#30363d] flex flex-col flex-shrink-0">
            <div className="flex border-b border-[#30363d]">
              {["output", "testcases"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as "output" | "testcases")}
                  className={`px-4 py-2 text-xs font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? "text-[#e6edf3] border-b-2 border-[#3fb950] -mb-px"
                      : "text-[#8b949e] hover:text-[#e6edf3]"
                  }`}
                >
                  {tab === "output" ? "Console" : "Test Cases"}
                </button>
              ))}
            </div>
            <div className="flex-1 p-4 overflow-auto">
              {activeTab === "output" && (
                <div className="code-font text-xs space-y-2">
                  {running && (
                    <div className="text-[#8b949e] animate-pulse">Running test cases...</div>
                  )}
                  {result === "accepted" && !running && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[#3fb950] font-semibold">
                        <span>✓</span>
                        <span>Accepted</span>
                      </div>
                      <div className="text-[#8b949e]">Runtime: <span className="text-[#e6edf3]">45 ms</span></div>
                      <div className="text-[#8b949e]">Memory: <span className="text-[#e6edf3]">14.2 MB</span></div>
                      <div className="text-[#8b949e]">Passed: <span className="text-[#3fb950]">47 / 47</span> test cases</div>
                    </div>
                  )}
                  {result === null && !running && (
                    <span className="text-[#484f58]">Run your code to see output here.</span>
                  )}
                </div>
              )}
              {activeTab === "testcases" && (
                <div className="code-font text-xs space-y-2">
                  {[
                    { input: "[2,7,11,15], 9", expected: "[0,1]", status: "pass" },
                    { input: "[3,2,4], 6", expected: "[1,2]", status: "pass" },
                    { input: "[3,3], 6", expected: "[0,1]", status: "pass" },
                  ].map((tc, i) => (
                    <div key={i} className="flex items-center gap-3 text-[#8b949e]">
                      <span className={result === "accepted" ? "text-[#3fb950]" : "text-[#484f58]"}>
                        {result === "accepted" ? "✓" : "○"}
                      </span>
                      <span>Case {i + 1}:</span>
                      <span className="text-[#e6edf3]">{tc.input}</span>
                      <span>→</span>
                      <span className="text-[#3fb950]">{tc.expected}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 3: Profile ────────────────────────────────────────────────────────

function Profile() {
  const totalSolved = PROBLEMS.filter((p) => p.solved).length;
  const easySolved = PROBLEMS.filter((p) => p.difficulty === "Easy" && p.solved).length;
  const mediumSolved = PROBLEMS.filter((p) => p.difficulty === "Medium" && p.solved).length;
  const hardSolved = PROBLEMS.filter((p) => p.difficulty === "Hard" && p.solved).length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Profile header */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <Avatar size="lg" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#e6edf3]">kaavya19</h1>
          <p className="text-sm text-[#8b949e] mt-0.5">Joined September 2025</p>
          <div className="flex gap-6 mt-4">
            {[
              { label: "Solved", value: totalSolved, color: "text-[#e6edf3]" },
              { label: "Easy", value: easySolved, color: "text-[#3fb950]" },
              { label: "Medium", value: mediumSolved, color: "text-[#d29922]" },
              { label: "Hard", value: hardSolved, color: "text-[#f85149]" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={`text-2xl font-bold code-font ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-[#8b949e] mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden sm:block">
          <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-center">
            <div className="text-3xl font-bold code-font text-[#a371f7]">{SUBMISSIONS.filter(s => s.status === "Accepted").length}</div>
            <div className="text-xs text-[#8b949e] mt-1">Accepted</div>
          </div>
        </div>
      </div>


      {/* Submissions table */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#30363d]">
          <h2 className="text-base font-semibold text-[#e6edf3]">Recent Submissions</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#30363d]">
              <th className="text-left px-6 py-3 text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Problem</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[#8b949e] uppercase tracking-wider hidden sm:table-cell">Language</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[#8b949e] uppercase tracking-wider hidden md:table-cell">Runtime</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[#8b949e] uppercase tracking-wider hidden md:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {SUBMISSIONS.map((sub, i) => (
              <tr
                key={sub.id}
                className={`border-b border-[#21262d] hover:bg-[#1f2937] transition-colors ${
                  i === SUBMISSIONS.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-6 py-4 text-sm text-[#58a6ff] hover:underline cursor-pointer font-medium">{sub.problem}</td>
                <td className="px-6 py-4"><StatusBadge status={sub.status} /></td>
                <td className="px-6 py-4 hidden sm:table-cell text-sm text-[#8b949e] code-font">{sub.language}</td>
                <td className="px-6 py-4 hidden md:table-cell text-sm text-[#8b949e] code-font">{sub.runtime}</td>
                <td className="px-6 py-4 hidden md:table-cell text-sm text-[#8b949e] code-font">{sub.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Syntax highlighter (minimal) ────────────────────────────────────────────

function highlightPython(line: string): string {
  const keywords = /\b(def|return|for|in|if|else|elif|import|from|class|pass|None|True|False|and|or|not|is|lambda|with|as|try|except|raise|yield|global|nonlocal|del|assert|break|continue|while|enumerate)\b/g;
  const strings = /(["'])((?:(?!\1)[^\\]|\\.)*)(\1)/g;
  const numbers = /\b(\d+)\b/g;
  const builtins = /\b(len|range|list|dict|set|tuple|print|input|int|str|float|bool|type|isinstance|hasattr|getattr|setattr|map|filter|zip|sorted|sum|min|max|abs|round|open|super|object|property|staticmethod|classmethod)\b/g;
  const comments = /(#.*)$/;

  const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  let safe = escape(line);

  if (comments.test(safe)) {
    return safe.replace(/(#.*)$/, '<span style="color:#8b949e;font-style:italic">$1</span>');
  }

  safe = safe.replace(strings, '<span style="color:#a5d6ff">$&</span>');
  safe = safe.replace(keywords, '<span style="color:#ff7b72;font-weight:500">$1</span>');
  safe = safe.replace(builtins, '<span style="color:#d2a8ff">$1</span>');
  safe = safe.replace(numbers, '<span style="color:#79c0ff">$1</span>');

  return safe;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [activeProblem, setActiveProblem] = useState<Problem>(PROBLEMS[0]);
  const [darkMode, setDarkMode] = useState(true);

  const dm = darkMode;

  return (
    <div
      className="min-h-full transition-colors duration-200"
      style={{
        background: dm ? "#0d1117" : "#f6f8fa",
        color: dm ? "#e6edf3" : "#1f2328",
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <Navbar screen={screen} setScreen={setScreen} darkMode={dm} setDarkMode={setDarkMode} />
      {screen === "dashboard" && (
        <Dashboard setScreen={setScreen} setProblem={setActiveProblem} darkMode={dm} />
      )}
      {screen === "workspace" && (
        <Workspace problem={activeProblem} setScreen={setScreen} darkMode={dm} />
      )}
      {screen === "profile" && <Profile darkMode={dm} />}
    </div>
  );
}
