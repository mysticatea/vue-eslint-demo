<template functional>
    <i
        class="material-icons"
        :title="title"
    >
        {{ props.kind }}
    </i>
</template>

<script>
export default {
    name: "MdIcon",
    props: {
        kind: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            default: "",
        },
    },
}
</script>

<style>
@import url(https://fonts.googleapis.com/icon?family=Material+Icons);

.material-icons {
    vertical-align: middle;
    font-size: inherit;
}
</style>
