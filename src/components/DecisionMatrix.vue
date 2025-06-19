<script setup>
import { storeToRefs } from 'pinia'
import { sawStore } from '../stores/sawStore'

const store = sawStore()
const { alternatives, criterias } = storeToRefs(store)
const { setMatrixValue } = store
</script>

<template>
    <div>
        <h1 class="text-2xl font-semibold mb-4">Matriks Keputusan</h1>
        <div v-if="!alternatives.length || !criterias.length" class="alert alert-info">
            Tambahkan setidaknya satu kriteria dan satu alternatif terlebih dahulu.
        </div>

        <div v-else class="overflow-x-auto">
            <table class="table">
                <thead>
                    <tr>
                        <th>Alternatif</th>
                        <th v-for="k in criterias" :key="k.id">
                            {{ k.nama }}
                            <span class="text-xs text-gray-500">({{ k.tipe }}, w={{ k.bobot }})</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="alt in alternatives" :key="alt.id">
                        <td class="font-medium">{{ alt.nama }}</td>
                        <td v-for="k in criterias" :key="k.id">
                            <input type="number" step="any" class="input input-bordered w-24 text-center"
                                :value="alt.nilai[k.id] === undefined ? '' : alt.nilai[k.id]"
                                @input="e => setMatrixValue(alt.id, k.id, e.target.value)" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>