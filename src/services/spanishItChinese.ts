import { supabase } from "./supabase"

export type SpanishITChinese = {
  id?: number
  spanish?: string
  chinese?: string
}

export async function getAll() {
  const { data, error } = await supabase
    .from("spanish_it_chinese")
    .select("*")
    .order("id", { ascending: true })

  return { data, error }
}

export async function createRow(row: SpanishITChinese) {
  const { data, error } = await supabase
    .from("spanish_it_chinese")
    .insert([row])
    .select()

  return { data, error }
}