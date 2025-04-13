import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const { did } = req.body

  const { data, error } = await supabase
    .from("did_users")
    .insert([{ did }])
    .select()

  if (error) {
    return res.status(400).json({ error: "DID already exists or invalid." })
  }

  return res.status(200).json({ message: "DID registered successfully", data })
}
