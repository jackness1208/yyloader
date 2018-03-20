# yyloader SDK
`yyloader` 是基于 `localstorage` 编写的 模板缓存 组件。
## 使用方法
在 html 中设置好 `yyloader` 用的参数:
```
<div
    id="mod01"
    data-loader-url="../components/module01.html"
    data-loader-name="module01"
    data-loader-ref="module02"
>
</div>
<script>
    yyloader('#mod01');
</script>
```

然后执行 `yyloader(<selector>)` 即可 例子在 [这里](./test/html/index.html)

## HTML 属性说明
```
data-loader-url  模板地址
data-loader-name 模板id 确保在整个域名中的唯一性
data-loader-ref  模板依赖, 多个依赖用 逗号隔开
```

## JS 参数说明
### yyloader(selector)
```
/**
 * 加载模块
 * @param  {String|Object} 需要执行初始化的模块
 * @return {Void}
 */
yyloader(selector)
```

### yyloader.clear()
```
/**
 * 清除 yyloader 用的 localstorage
 * @return {Void}
 */
yyloader.clear()
```

### yyloader.setExprie(time)
```
/**
 * 设置 yyloader 缓存模块的 有效时长
 * @param  {Number} time 有效时长 ms 为单位
 * @return {Void}
 */
yyloader.setExprie(time)
```
### yyloader.cache
获取 yyloader缓存数据

## 历史记录
* [这里](./history.md)
