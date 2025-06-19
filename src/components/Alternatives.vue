<script setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { sawStore } from '../stores/sawStore';
const alternativeName = ref('')
const store = sawStore()
const { alternatives } = storeToRefs(store)
const { addAlternative, deleteAlternative } = store

const tambah = () => {
    if (!alternativeName.value.trim()) return
    addAlternative(alternativeName.value.trim())
    alternativeName.value = ''
}

</script>

<template>
    <div class="flex flex-col gap-2">
        <h1 class="text-2xl font-semibold">Alternatif</h1>

        <div class="flex flex-row gap-2">
            <input class="input input-bordered w-full max-w-xs" type="text" placeholder="Nama Alternatif"
                v-model="alternativeName" />
            <button class="btn btn-primary" @click="tambah">Tambah</button>
        </div>

        <table class="table table-zebra">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Alternatif</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(alternative, idx) in alternatives" :key="alternative.id">
                    <td>{{ idx + 1 }}</td>
                    <td>{{ alternative.nama }}</td>
                    <td>
                        <button class="btn btn-error btn-sm" @click="deleteAlternative(alternative.id)">Hapus</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
