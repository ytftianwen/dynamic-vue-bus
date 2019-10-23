在Vue项目中使用EventBus拥有生命周期，不用再去手动销毁
参考文章：[让在Vue中使用的EventBus也有生命周期](https://zhuanlan.zhihu.com/p/39537979)
## 使用
```sh
 npm install dynamic-vue-bus
```

 ```js
 import eventBus from 'dynamic-vue-bus'
 Vue.use(eventBus)
 
```

 
 ## 组件中使用
 ```js
  created () {
    let text = Array(1000000).fill('xxx').join(',')
    this.$eventBus.$on('home-on', (...args) => {
      // todo something
    }, this) // 注意第三个参数要传this
  },
  mounted () {
    setTimeout(() => {
      this.$eventBus.$emit('home-on', '这是home $emit参数')
    }, 1000)
  }
```
 
