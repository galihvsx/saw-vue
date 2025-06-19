<script setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { sawStore } from '../stores/sawStore'

const nama = ref('')
const bobot = ref('')
const tipe = ref('benefit') // default benefit

const store = sawStore()
const { criterias } = storeToRefs(store)
const { addCriteria, deleteCriteria, CRITERION_TYPE } = store

const tambah = () => {
    if (!nama.value.trim()) return
    const b = parseFloat(bobot.value)
    if (Number.isNaN(b) || b <= 0) return
    addCriteria({ nama: nama.value.trim(), bobot: b, tipe: tipe.value })
    nama.value = ''
    bobot.value = ''
    tipe.value = 'benefit'
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <h1 class="text-2xl font-semibold">Kriteria</h1>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
            <input v-model="nama" type="text" placeholder="Nama Kriteria" class="input input-bordered w-full" />
            <input v-model="bobot" type="number" step="0.01" placeholder="Bobot (0-1)"
                class="input input-bordered w-full" />
            <select v-model="tipe" class="select select-bordered w-full">
                <option :value="CRITERION_TYPE.BENEFIT">Benefit (lebih besar lebih baik)</option>
                <option :value="CRITERION_TYPE.COST">Cost (lebih kecil lebih baik)</option>
            </select>
            <button class="btn btn-primary" @click="tambah">Tambah</button>
        </div>

        <table v-if="criterias.length" class="table table-zebra">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Bobot</th>
                    <th>Tipe</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(c, idx) in criterias" :key="c.id">
                    <td>{{ idx + 1 }}</td>
                    <td>{{ c.nama }}</td>
                    <td>{{ c.bobot }}</td>
                    <td class="capitalize">{{ c.tipe }}</td>
                    <td>
                        <button class="btn btn-error btn-sm" @click="deleteCriteria(c.id)">Hapus</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>