<template functional>
    <i class="material-icons" :title="title">{{ props.kind }}</i>
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
@import url(../node_modules/material-design-icons/iconfont/material-icons.css);

.material-icons {
    vertical-align: middle;
    font-size: inherit;
}
</style>
