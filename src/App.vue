<script setup>
import { storeToRefs } from 'pinia'
import Alternatives from './components/Alternatives.vue'
import Criterias from './components/Criterias.vue'
import DecisionMatrix from './components/DecisionMatrix.vue'
import { sawStore } from './stores/sawStore'

const store = sawStore()
const { calculate } = store
const { results, error } = storeToRefs(store)
</script>

<template>
  <main class="container mx-auto p-4 space-y-6">
    <h1 class="text-3xl font-bold text-center mb-6">SAW Decision Helper</h1>
    <Criterias />
    <Alternatives />
    <DecisionMatrix />

    <div class="flex justify-center">
      <button class="btn btn-primary" @click="calculate">Hitung Hasil</button>
    </div>

    <div v-if="error" class="alert alert-error mt-4">{{ error }}</div>

    <div v-if="results.length" class="mt-6">
      <h2 class="text-2xl font-semibold mb-4">Hasil</h2>
      <table class="table table-zebra">
        <thead>
          <tr>
            <th>Peringkat</th>
            <th>Alternatif</th>
            <th>Skor Preferensi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in results" :key="r.idAlternatif" :class="r.peringkat === 1 ? 'bg-green-100' : ''">
            <td>{{ r.peringkat }}</td>
            <td>{{ r.namaAlternatif }}</td>
            <td>{{ r.skorPreferensi.toFixed(4) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
