<template>
    <div class="app-footer__root">
        <div
            v-for="(v, name) in versions"
            :key="name"
            class="app-footer__version-item"
        >
            <a :href="'https://github.com/' + v.repo" target="_blank" rel="noopener">
                {{ name }}
            </a>
            v{{ v.version }}
        </div>
    </div>
</template>

<script>
import versions from "./versions"

export default {
    name: "AppFooter",
    computed: {
        versions() {
            return versions
        },
    },
}
</script>

<style>
.app-footer__root {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    border-top: 1px solid #ccc;
    background-color: white;
}
.app-footer__version-item {
    flex-shrink: 0;
    margin-right: 8px;
}
.app-footer__version-item:not(:last-child)::after {
    content: ",";
}
</style>
