export default {
    props: ['list', 'modelValue'],
    emits: ['update:modelValue'],
    template: `
        <ul>
            <li v-for="(level, i) in list">
                <button @click="$emit('update:modelValue', i)">
                    {{ level.name }}
                </button>
            </li>
        </ul>
    `,
};
