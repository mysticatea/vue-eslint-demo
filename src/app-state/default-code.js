export default `
<template>
  <div v-else>
    Hello, {{ name }}!
    <div
      v-for="item of items"
      key="item.id"
    >
      {{ item.name}}
    </div>
    <button v-on:click="onClick">Button</button>
  </div>
</template>
<script>
export default {
  name: 'App',
  data: {
    name: 'World',
    items: [
      {id: 1, name: "a"},
      {id: 2, name: "b"},
      {id: 3, name: "c"}
    ]
  },
  methods: {
    onClick() {
      // do something.
    }
  }
}
</script>
`.trim()
