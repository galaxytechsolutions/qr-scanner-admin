

export type Category = "OC" | "BC" | "SC" | "ST";

export const SUBCASTES: Record<Category, string[]> = {
  OC: [
    "Reddy", "Kamma", "Kapu", "Velama", "Brahmin", "Vysya", "Arya Vysya",
    "Rajput", "Maratha", "Telaga", "Balija", "Kshatriya"
  ],
  BC: [
    "Yadava (Golla)", "Gouda", "Kuruba", "Kuruma", "Padmasali", "Devanga", "Kaikala",
    "Chakali (Rajaka)", "Mangali", "Vaddera", "Medari", "Sagara (Uppara)",
    "Settibalija", "Munnuru Kapu", "Turpu Kapu", "Ontari", "Telaga (BC-D)",
    "Dudekula", "Pinjari/Noorbash", "Qureshi", "Ansari", "Labbai", "Sheikh (BC-E)",
    "Viswabrahmin", "Kamsali", "Kummari", "Vadrangi"
  ],
  SC: [
    "Mala", "Madiga", "Adi Andhra", "Arundhatiyar", "Relli", "Mehtar",
    "Chamar", "Dakkal", "Godagalli", "Jambuvulu", "Sapru", "Sindhollu/Chindollu"
  ],
  ST: [
    "Lambadi (Banjara/Sugali)", "Yerukala/Korcha", "Gond", "Koya", "Chenchu",
    "Savara", "Konda Dora", "Konda Reddi", "Thoti", "Nayak", "Kolam", "Khond"
  ]
} as const;