<template>
    <div v-if="show" class="appcache-toast__root">
        <div>New version available</div>
        <button @click="reload">
            Reload
        </button>
    </div>
</template>

<script>
export default {
    name: "AppcacheToast",

    props: {
        show: Boolean,
    },

    methods: {
        reload() {
            window.applicationCache.swapCache()
            location.reload(true)
        },
    },
}
</script>

<style>
.appcache-toast__root {
    display: block;
    position: absolute;
    right: 24px;
    bottom: 32px;
    width: 320px;
    padding: 8px;
    border: 1px solid #4caf50;
    border-radius: 3px;
    background: white;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
    text-align: center;
    animation: AppcacheToastIn 0.333s;
}
.appcache-toast__root > div {
    text-align: left;
}
.appcache-toast__root > button {
    margin-top: 8px;
    padding: 4px 32px;
}

@keyframes AppcacheToastIn {
    0% {
        opacity: 0;
        transform: translate(0, 50%) scale(0.5);
    }
    100% {
        opacity: 1;
        transform: none;
    }
}
</style>
