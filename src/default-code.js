export default `
<template>
  Hello, {{name}}!
</template>
<script>
export default {
  name: 'App',
  data () {
    return {
      name: 'World'
    }
  }
}
</script>
`.trim()
