<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
    idAttribute: string,
    columns: { field: string, label: string, formatter: Function | null, onClick: Function | null, description: string | null }[],
    data: any[],
}>();
</script>

<template>
    <table class="table table-striped">
        <thead>
            <tr>
                <th v-for="column in columns" :key="column.field" :class="{ 'icon-col': !!column.formatter }">{{ column.label }}</th>
            </tr>
        </thead>
        
        <tbody>
            <tr v-for="item in data" :key="item[idAttribute]">
                <td
                    v-for="column in columns"
                    :key="column.field"
                    :class="{ 'icon-col': !!column.formatter }"
                    @click="column.onClick ? column.onClick(item) : () => { }"
                >
                    <span :class="{ clickable: column.onClick }">
                        <template v-if="column.formatter">
                            <span v-html="column.formatter(item)"></span>
                        </template>
                        <template v-else>{{ item[column.field] }}</template>
                    </span>
                </td>
            </tr>
        </tbody>
    </table>

</template>

<style scoped>
.clickable {
    cursor: pointer;
}

.icon-col {
    text-align: center;
    width: 48px;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    white-space: nowrap;
}

.icon-col span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}
</style>
