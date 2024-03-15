export default {
    props: {
        author: {
            type: Object,
            required: true,
        },
        creators: {
            type: Array,
            required: true,
        },
        verifier: {
            type: Object,
            required: true,
        },
    },
    template: `
        <div class="level-authors">
            <template v-if="selfVerified">
                <div class="type-title-sm">Creator & Verifier</div>
                <p class="type-body">
                    <span>{{ author.global_name }}</span>
                </p>
            </template>
            <template v-else-if="creators.length === 0">
                <div class="type-title-sm">Creator</div>
                <p class="type-body">
                    <span>{{ author.global_name }}</span>
                </p>
                <div class="type-title-sm">Verifier</div>
                <p class="type-body">
                    <span>{{ verifier.global_name }}</span>
                </p>
            </template>
            <template v-else>
                <div class="type-title-sm">Creators</div>
                <p class="type-body">
                    <template v-for="(creator, index) in creators">
                        <span >{{ creator.global_name }}</span
                        ><span v-if="index < creators.length - 1">, </span>
                    </template>
                </p>
                <div class="type-title-sm">Verifier</div>
                <p class="type-body">
                    <span>{{ verifier.global_name }}</span>
                </p>
            </template>
            <div class="type-title-sm">Publisher</div>
            <p class="type-body">
                <span>{{ author.global_name }}</span>
            </p>
        </div>
    `,

    computed: {
        selfVerified() {
            return this.author.global_name === this.verifier.global_name && this.creators.length === 1 && this.creators[0].global_name === this.author.global_name;
        },
    },
};
