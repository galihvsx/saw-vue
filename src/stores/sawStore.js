import { defineStore } from 'pinia'
import { ref } from 'vue'
import { calculateSAW, CRITERION_TYPE } from '../services/sawCalculator.js'

export const sawStore = defineStore('sawStore', () => {
  const alternatives = ref([])
  const criterias = ref([])
  const results = ref([])
  const error = ref(null)

  function uuid () {
    return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10)
  }

  const addAlternative = (nama) => {
    const id = uuid()
    const nilai = {}
    criterias.value.forEach(k => {
      nilai[k.id] = undefined
    })
    alternatives.value.push({ id, nama, nilai })
  }

  const deleteAlternative = (id) => {
    alternatives.value = alternatives.value.filter(a => a.id !== id)
  }

  const addCriteria = ({ nama, bobot, tipe }) => {
    const id = uuid()
    criterias.value.push({ id, nama, bobot: Number(bobot), tipe })
    alternatives.value.forEach(a => {
      a.nilai[id] = undefined
    })
  }

  const deleteCriteria = (id) => {
    criterias.value = criterias.value.filter(k => k.id !== id)
    alternatives.value.forEach(a => {
      delete a.nilai[id]
    })
  }

  const setMatrixValue = (altId, critId, value) => {
    const alt = alternatives.value.find(a => a.id === altId)
    if (alt) {
      alt.nilai[critId] = value === '' ? undefined : Number(value)
    }
  }

  const calculate = () => {
    const { results: res, error: err } = calculateSAW(criterias.value, alternatives.value)
    error.value = err || null
    results.value = res
  }

  return { alternatives, criterias, results, error, addAlternative, deleteAlternative, addCriteria, deleteCriteria, setMatrixValue, calculate, CRITERION_TYPE }
})
