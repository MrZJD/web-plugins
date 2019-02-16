## Usage

PCScroller Component for vue

```html
<PCScroller
    ref="rank-scroller"
    class="rank-listc"
    :right="6"
    :thumb-color="'#2fb8f9'" >
    <content />
</PCScroller>
```

```js
{
    components: {
        'scroller': PCScroller
    },
    updated () {
        this.$refs['rank-scroller'] && this.$refs['rank-scroller'].refreshDOM()
    }
}
```