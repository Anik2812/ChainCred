import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const { did } = req.body

  const { data, error } = await supabase
    .from("did_users")
    .select("*")
    .eq("did", did)

  if (error || !data || data.length === 0) {
    return res.status(401).json({ error: "DID not found" })
  }

  return res.status(200).json({ message: "Login successful", user: data[0] })
}
