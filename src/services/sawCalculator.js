// Jenis kriteria: benefit artinya semakin besar semakin baik, cost artinya semakin kecil semakin baik
export const CRITERION_TYPE = {
  BENEFIT: 'benefit',
  COST: 'cost'
}

export function calculateSAW (kriterias, alternatives) {

  if (!kriterias.length) {
    return { results: [], error: 'Belum ada kriteria yang ditambahkan.' }
  }

  if (!alternatives.length) {
    return { results: [], error: 'Belum ada alternatif yang ditambahkan.' }
  }

  const totalBobot = kriterias.reduce((sum, k) => sum + k.bobot, 0)

  if (Math.abs(totalBobot - 1) > 0.001) {
    console.warn(`Jumlah bobot bukan 1 melainkan ${totalBobot}`)
  }

  for (const alt of alternatives) {
    for (const k of kriterias) {
      const v = alt.nilai[k.id]
      if (v === undefined || Number.isNaN(v)) {
        return { results: [], error: `Nilai untuk alternatif "${alt.nama}" pada kriteria "${k.nama}" belum diisi atau tidak valid.` }
      }
    }
  }

  const altsParsed = alternatives.map(a => ({
    ...a,
    nilai: Object.fromEntries(Object.entries(a.nilai).map(([kid, val]) => [kid, Number(val)]))
  }))

  // Normalisasi
  const normalized = altsParsed.map(a => ({
    id: a.id,
    nama: a.nama,
    asli: { ...a.nilai },
    norm: {}
  }))

  for (const k of kriterias) {
    const semuaNilai = altsParsed.map(a => a.nilai[k.id])
    let minVal, maxVal
    if (k.tipe === CRITERION_TYPE.COST) {
      minVal = Math.min(...semuaNilai)
    } else {
      maxVal = Math.max(...semuaNilai)
    }

    altsParsed.forEach((alt, idx) => {
      const current = alt.nilai[k.id]
      let normValue
      if (k.tipe === CRITERION_TYPE.COST) {
        normValue = minVal / current
      } else {
        normValue = current / maxVal
      }
      normalized[idx].norm[k.id] = normValue
    })
  }

  // Hitung skor preferensi
  const withScore = normalized.map(a => {
    let score = 0
    for (const k of kriterias) {
      score += a.norm[k.id] * k.bobot
    }
    return { ...a, skor: score }
  })

  // Ranking
  const sorted = [...withScore].sort((a, b) => b.skor - a.skor)
  const results = sorted.map((r, idx) => ({
    idAlternatif: r.id,
    namaAlternatif: r.nama,
    nilaiAsli: r.asli,
    nilaiTernormalisasi: r.norm,
    skorPreferensi: r.skor,
    peringkat: idx + 1
  }))

  return { results }
} 