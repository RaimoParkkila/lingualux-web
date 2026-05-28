import { useEffect, useState } from "react"
import { getAllQuiz, createRow, updateRow, deleteRow } from "./services/quiz"
import { supabase } from "./services/supabase"

type Row = {
  id?: number
  question?: string
  a?: string
  b?: string
  c?: string
  d?: string
  answer?: string
}

export default function App() {
  const [mode, setMode] = useState<"quiz" | "admin">("quiz")

  const [rows, setRows] = useState<Row[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [question, setQuestion] = useState("")
  const [a, setA] = useState("")
  const [b, setB] = useState("")
  const [c, setC] = useState("")
  const [d, setD] = useState("")
  const [answer, setAnswer] = useState("")

  const [editingId, setEditingId] = useState<number | null>(null)

  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)

  const current = rows[quizIndex]

  const isAdmin = user?.email === "raimopa2@gmail.com"

  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
  }, [])

  /* ---------------- LOAD ---------------- */
  async function load() {
    const { data } = await getAllQuiz()
    setRows(data || [])
  }

  useEffect(() => {
    load()
  }, [])

  /* ---------------- SPEAK ---------------- */
  function speak(text: string) {
    return new Promise<void>((resolve) => {
      if (!window.speechSynthesis) return resolve()

      const u = new SpeechSynthesisUtterance(text)
      u.lang = "es-ES"
      u.rate = 0.95
      u.onend = () => resolve()
      u.onerror = () => resolve()

      window.speechSynthesis.speak(u)
    })
  }

  /* ---------------- LOGIN ---------------- */
  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) return alert(error.message)

    const { data } = await supabase.auth.getUser()
    setUser(data.user)
  }

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
    setMode("quiz")
  }

  /* ---------------- SAVE (ADD / EDIT) ---------------- */
  async function save() {
    if (!isAdmin) return
    if (!question || !a || !b || !c || !d || !answer) return

    if (editingId) {
      await updateRow(editingId, {
        question,
        a,
        b,
        c,
        d,
        answer,
      })
    } else {
      await createRow({
        question,
        a,
        b,
        c,
        d,
        answer,
      })
    }

    setEditingId(null)
    setQuestion("")
    setA("")
    setB("")
    setC("")
    setD("")
    setAnswer("")

    load()
  }

  /* ---------------- EDIT ---------------- */
  function editRow(r: Row) {
    setEditingId(r.id || null)
    setQuestion(r.question || "")
    setA(r.a || "")
    setB(r.b || "")
    setC(r.c || "")
    setD(r.d || "")
    setAnswer(r.answer || "")
  }

  /* ---------------- DELETE ---------------- */
  async function remove(id?: number) {
    if (!id) return
    await deleteRow(id)
    load()
  }

  function restartQuiz() {
    setQuizIndex(0)
    setSelected(null)
    setScore(0)
  }

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Loading...</h2>
      </div>
    )
  }

  /* ---------------- UI ---------------- */
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Lingualux Quiz</h1>

      {/* MODE */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setMode("quiz")}
          style={{
            ...styles.button,
            ...(mode === "quiz" ? styles.buttonQuiz : styles.buttonNeutral),
            marginRight: 10,
          }}
        >
          Quiz
        </button>

        <button
          onClick={() => {
            if (!isAdmin) return alert("Admin only")
            setMode("admin")
          }}
          style={{
            ...styles.button,
            ...(mode === "admin" ? styles.buttonPrimary : styles.buttonNeutral),
          }}
        >
          Admin
        </button>
      </div>

      {/* LOGIN */}
      <div style={{ marginBottom: 20 }}>
        {!user ? (
          <>
            <input style={styles.input} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input style={styles.input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <button onClick={login} style={{ ...styles.button, ...styles.buttonPrimary }}>
              Login
            </button>
          </>
        ) : (
          <>
            <div style={{ color: "#00ff66", marginBottom: 10 }}>{user.email}</div>
            <button onClick={logout} style={{ ...styles.button, ...styles.buttonNeutral }}>
              Logout
            </button>
          </>
        )}
      </div>

      {/* QUIZ */}
      {mode === "quiz" && current && (
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "#ff6a00" }}>{current.question}</h2>

          {(["a", "b", "c", "d"] as const).map((key) => {
            const isSelected = selected === key
            let bg = "#1f2937"

            if (selected) {
              if (key === current.answer) bg = "#00ff66"
              else if (isSelected) bg = "#ff0033"
            }

            return (
              <div
                key={key}
                onClick={async () => {
                  if (selected) return

                  setSelected(key)

                  const correct = key === current.answer
                  const answerText = current[current.answer as "a" | "b" | "c" | "d"]

                  if (correct) setScore((s) => s + 1)

                  await speak(correct ? "Correcto" : "Incorrecto")
                  await speak(answerText || "")

                  setTimeout(() => {
                    setSelected(null)
                    setQuizIndex((i) => i + 1)
                  }, 500)
                }}
                style={{
                  padding: 18,
                  marginBottom: 10,
                  backgroundColor: bg,
                  border: "2px solid #ff6a00",
                  borderRadius: 10,
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                {current[key]}
              </div>
            )
          })}

          <div style={{ color: "#fff" }}>Score: {score}</div>

          <button onClick={restartQuiz} style={styles.button}>
            Restart
          </button>
        </div>
      )}

      {/* ADMIN */}
      {mode === "admin" && isAdmin && (
        <>
          <input style={styles.input} placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} />
          <input style={styles.input} placeholder="A" value={a} onChange={(e) => setA(e.target.value)} />
          <input style={styles.input} placeholder="B" value={b} onChange={(e) => setB(e.target.value)} />
          <input style={styles.input} placeholder="C" value={c} onChange={(e) => setC(e.target.value)} />
          <input style={styles.input} placeholder="D" value={d} onChange={(e) => setD(e.target.value)} />
          <input style={styles.input} placeholder="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />

          <button onClick={save} style={{ ...styles.button, ...styles.buttonPrimary }}>
            {editingId ? "Update" : "Add"}
          </button>

          <div style={{ marginTop: 20 }}>
            {rows.map((r) => (
              <div key={r.id} style={styles.card}>
                <div style={styles.cardTitle}>{r.question}</div>
                <div style={styles.cardText}>A: {r.a}</div>
                <div style={styles.cardText}>B: {r.b}</div>
                <div style={styles.cardText}>C: {r.c}</div>
                <div style={styles.cardText}>D: {r.d}</div>
                <div style={styles.cardAnswer}>Answer: {r.answer}</div>

                <button onClick={() => editRow(r)} style={{ ...styles.button, backgroundColor: "#00ff66", color: "#000" }}>
                  Edit
                </button>

                <button onClick={() => remove(r.id)} style={{ ...styles.button, backgroundColor: "#ff0033", color: "#fff" }}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {mode === "admin" && !isAdmin && (
        <div style={{ color: "#fff" }}>No admin access</div>
      )}
    </div>
  )
}

/* ---------------- STYLES ---------------- */
const styles: any = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#05060a",
    padding: 20,
    fontFamily: "Arial",
  },
  title: {
    fontSize: 30,
    color: "#ff6a00",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    background: "#111318",
    color: "#ffb000",
    border: "1px solid #ff6a00",
  },
  button: {
    padding: 12,
    border: "none",
    marginTop: 10,
    width: "100%",
    fontWeight: 900,
    cursor: "pointer",
    borderRadius: 8,
  },
  buttonPrimary: { backgroundColor: "#ff6a00", color: "#000" },
  buttonQuiz: { backgroundColor: "#00ff66", color: "#000" },
  buttonNeutral: { backgroundColor: "#333", color: "#fff" },

  card: {
    background: "#111318",
    padding: 10,
    marginTop: 10,
    border: "1px solid #333",
  },
  cardTitle: { color: "#00ff66", fontWeight: 900 },
  cardText: { color: "#ffb000" },
  cardAnswer: { color: "#ff6a00" },
}