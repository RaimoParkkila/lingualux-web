import { supabase } from "./supabase"



export async function getAllQuiz() {
  return await supabase
    .from("spanish_it_chinese")
    .select("*")
    .order("id", { ascending: true })
}

export async function createRow(row: any) {
  return await supabase
    .from("spanish_it_chinese")
    .insert([row])
}

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

 

/* ---------------- FETCH ONE (optional future use) ---------------- */

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

export async function updateRow(id: number, data: any) {
  return supabase.from("quiz").update(data).eq("id", id)
}

export async function deleteRow(id: number) {
  return supabase.from("quiz").delete().eq("id", id)
}