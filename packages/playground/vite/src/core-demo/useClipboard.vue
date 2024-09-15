<template>
  <div>
    <p v-copy:[copyTxt]="handleCopy">useClipboard</p>
    <UseClipboard v-slot="{ copy, copied }">
      <button @click="copy">
        {{ copied }}
        {{ copied ? 'copied' : 'text'  }}
      </button>
    </UseClipboard>
    showClipboardContent: {{ computedText }}
    <button @click="handleCopyItems">itemsCopy</button>
  </div>
</template>
  
<script lang='ts' setup>
  import { useClipboard, useClipboardItems } from '@mini-vueuse/core'
  import { UseClipboard, vCopy } from '@mini-vueuse/components'
  import { computed, effect, ref } from 'vue';
  const copyTxt = ref('copyTxtcopyTxt')
  const { isSupported, copy } = useClipboard()
  console.log('useSupported', isSupported.value);
  
  copy('123essda')

  const handleCopy = () => {
    
  }

  function createClipboardItems(text: string) {
    const mime = 'text/html'
    const blob = new Blob([text], { type: mime })
    return new ClipboardItem({
      [mime]: blob,
    })
  }
  const mime = 'text/html'

  const { copy: itemsCopy, content } = useClipboardItems()

  const computedText = ref('')

  effect(() => {
    Promise.all(content.value.map(item => item.getType('text/html'))).then(blobs => {
      return Promise.all(blobs.map(blob => blob.text()))
    }).then(text => {
      console.log('text', text);
      computedText.value = text.join('')
    })
  })
  
  const handleCopyItems = () => {
    // const blob = new Blob([`<div>${mime}</div>`], { type: mime })
    // const item = new ClipboardItem({
    //   [mime]: blob,
    // })
    // navigator.clipboard.write([item])
    console.log('handleCopyItems');
    
    itemsCopy([createClipboardItems('<div>zs</div>')])

  }
</script>
  
<style lang='less' scoped>
  
</style>