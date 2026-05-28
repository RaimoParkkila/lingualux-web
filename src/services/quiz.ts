import { supabase } from "./supabase"

export type QuizQuestion = {
  id?: number
  question: string
  a: string
  b: string
  c: string
  d: string
  answer: "a" | "b" | "c" | "d"
}

/* ---------------- FETCH ALL ---------------- */
export async function getAllQuiz() {
  return await supabase
    .from("spanish_it_chinese")
    .select("*")
    .order("id", { ascending: true })
}

/* ---------------- CREATE ---------------- */
export async function createRow(row: QuizQuestion) {
  return await supabase
    .from("spanish_it_chinese")
    .insert([row])
    .select()
}

/* ---------------- UPDATE ---------------- */
export async function updateRow(id: number, data: Partial<QuizQuestion>) {
  return await supabase
    .from("spanish_it_chinese")
    .update(data)
    .eq("id", id)
    .select()
}

/* ---------------- DELETE ---------------- */
export async function deleteRow(id: number) {
  return await supabase
    .from("spanish_it_chinese")
    .delete()
    .eq("id", id)
}

/* ---------------- FETCH ONE (optional) ---------------- */
export async function getQuizByIndex(index: number) {
  const { data, error } = await supabase
    .from("spanish_it_chinese")
    .select("*")
    .order("id", { ascending: true })

  if (error) return { data: null, error }

  return {
    data: data?.[index] || null,
    error: null,
  }
}